import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteObject, readRange } from "@/lib/files/storage";
import {
  classifyZipEntries,
  detectSignature,
  HEAD_BYTES,
  MAX_FILES_PER_REQUEST,
  MAX_FILE_BYTES,
  normaliseDeclaredMime,
  ZIP_TAIL_BYTES,
  zipEntryNamesFromWindow,
} from "@/lib/files/verify";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { verifySubmissionToken } from "@/lib/submission-token";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Step 9: verify every uploaded file and delete anything that fails.
 *
 * The client says the uploads finished; nothing it says is trusted. Size comes
 * from Storage's own Content-Range, and the type from the bytes.
 *
 * Reads are RANGED, not whole-file. A signature lives in the first 16 bytes and
 * a ZIP's central directory at its tail, so a 4MB drawing costs two small reads
 * rather than four megabytes. Files are verified concurrently, because the cost
 * is round-trip latency rather than work.
 *
 * Access is gated by the HMAC submission token from step 1, not by the request
 * id alone. Only rows still `pending` are touched, so a replayed call cannot
 * undo a completed verification.
 */

export const runtime = "nodejs";

const payloadSchema = z.object({
  requestId: z.uuid(),
  submissionToken: z.string().min(1).max(512),
});

type FileRow = {
  id: string;
  storage_path: string;
  original_filename: string;
  declared_mime: string | null;
};

type Outcome = {
  row: FileRow;
  reason: string | null;
  detectedMime: string | null;
  sizeBytes: number | null;
};

/** One file: at most two ranged reads, no whole-file download. */
async function inspect(row: FileRow): Promise<Outcome> {
  const declared = normaliseDeclaredMime(row.declared_mime ?? "");
  const reject = (
    reason: string,
    sizeBytes: number | null = null,
  ): Outcome => ({
    row,
    reason,
    detectedMime: null,
    sizeBytes,
  });

  let head;
  try {
    head = await readRange(row.storage_path, 0, HEAD_BYTES - 1);
  } catch {
    return reject("the upload did not complete");
  }

  const size = head.totalSize;
  // Storage's number, not the client's.
  if (size === 0) return reject("empty file", 0);
  if (size > MAX_FILE_BYTES) return reject("over the 4MB limit", size);

  const signature = detectSignature(head.bytes);
  if (signature.kind === "unknown") return reject(signature.reason, size);

  let detected: string;
  if (signature.kind === "mime") {
    detected = signature.mime;
  } else {
    // A ZIP: the central directory decides whether it is a spreadsheet.
    const tailLength = Math.min(size, ZIP_TAIL_BYTES);
    let walk;
    try {
      const tail = await readRange(row.storage_path, size - tailLength);
      walk = zipEntryNamesFromWindow(tail.bytes, size - tailLength, size);

      // A central directory larger than the tail window: read from where the
      // EOCD says it starts. At most one extra read.
      if (walk.kind === "needFrom") {
        const wider = await readRange(row.storage_path, walk.offset);
        walk = zipEntryNamesFromWindow(wider.bytes, walk.offset, size);
      }
    } catch {
      return reject("the upload did not complete", size);
    }

    if (walk.kind !== "names") {
      return reject("unreadable or encrypted archive", size);
    }
    const verdict = classifyZipEntries(walk.names);
    if (!verdict.ok) return reject(verdict.reason, size);
    detected = verdict.mime;
  }

  if (declared && declared !== detected) {
    return reject(
      `declared ${row.declared_mime} but the bytes are ${detected}`,
      size,
    );
  }
  return { row, reason: null, detectedMime: detected, sizeBytes: size };
}

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);

  const limit = await checkRateLimit({
    ip,
    endpoint: "sourcing-request-files",
    maxHits: 20,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "rate-limited", message: "Too many requests." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { requestId, submissionToken } = parsed.data;
  const token = verifySubmissionToken(requestId, submissionToken);
  if (!token.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: files, error } = await supabase
    .from("request_files")
    .select("id, storage_path, original_filename, declared_mime")
    .eq("request_id", requestId)
    .eq("status", "pending")
    .limit(MAX_FILES_PER_REQUEST);

  if (error) {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  // Concurrent: the cost is latency, not work.
  const outcomes = await Promise.all((files ?? []).map(inspect));

  await Promise.all(
    outcomes.map(async ({ row, reason, detectedMime, sizeBytes }) => {
      if (reason) {
        // Delete first. An object we could not remove must not be recorded as
        // removed — but the row is still marked rejected either way.
        try {
          await deleteObject(row.storage_path);
        } catch {
          // Already gone, or Storage is unavailable.
        }
        await supabase
          .from("request_files")
          .update({
            status: "rejected",
            rejection_reason: reason.slice(0, 200),
            ...(sizeBytes === null || sizeBytes === 0
              ? {}
              : { size_bytes: sizeBytes }),
          })
          .eq("id", row.id);
        return;
      }
      await supabase
        .from("request_files")
        .update({
          status: "verified",
          detected_mime: detectedMime,
          ...(sizeBytes === null ? {} : { size_bytes: sizeBytes }),
        })
        .eq("id", row.id);
    }),
  );

  return NextResponse.json({
    checked: outcomes.length,
    rejected: outcomes
      .filter((o) => o.reason !== null)
      .map((o) => ({ filename: o.row.original_filename, reason: o.reason })),
  });
}
