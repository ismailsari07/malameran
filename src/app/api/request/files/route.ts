import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteObject, downloadObject } from "@/lib/files/storage";
import {
  MAX_FILES_PER_REQUEST,
  MAX_FILE_BYTES,
  verifyUpload,
} from "@/lib/files/verify";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { verifySubmissionToken } from "@/lib/submission-token";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Step 9: verify every uploaded file and delete anything that fails.
 *
 * The client says the uploads finished; nothing it says is trusted. The server
 * reads each object back from Storage, measures it, identifies it from its
 * bytes, and deletes it if it fails — marking the row rejected either way, so
 * the team can see what was refused and why.
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

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);

  // Limited too: this endpoint reads from Storage and is worth abusing.
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
    .select("id, storage_path, original_filename, declared_mime, status")
    .eq("request_id", requestId)
    .eq("status", "pending")
    .limit(MAX_FILES_PER_REQUEST);

  if (error) {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const rejected: { filename: string; reason: string }[] = [];

  for (const file of files ?? []) {
    let reason: string | null = null;
    let detectedMime: string | null = null;
    let sizeBytes: number | null = null;

    try {
      const bytes = await downloadObject(file.storage_path);
      sizeBytes = bytes.byteLength;

      // Measured, not taken from the client.
      if (bytes.byteLength > MAX_FILE_BYTES) {
        reason = "over the 4MB limit";
      } else {
        const result = verifyUpload(bytes, file.declared_mime ?? "");
        if (result.ok) detectedMime = result.mime;
        else reason = result.reason;
      }
    } catch {
      reason = "the upload did not complete";
    }

    if (reason) {
      // Delete first, then record. An object we cannot remove must not be
      // reported as removed.
      try {
        await deleteObject(file.storage_path);
      } catch {
        // Already gone, or Storage is unavailable; the row still says rejected.
      }
      await supabase
        .from("request_files")
        .update({
          status: "rejected",
          rejection_reason: reason.slice(0, 200),
          detected_mime: detectedMime,
        })
        .eq("id", file.id);
      rejected.push({ filename: file.original_filename, reason });
      continue;
    }

    await supabase
      .from("request_files")
      .update({
        status: "verified",
        detected_mime: detectedMime,
        ...(sizeBytes === null ? {} : { size_bytes: sizeBytes }),
      })
      .eq("id", file.id);
  }

  return NextResponse.json({ checked: files?.length ?? 0, rejected });
}
