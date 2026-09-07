import { NextResponse, after } from "next/server";
import { z } from "zod";

import { sendAll } from "@/lib/email/send";
import {
  sourcingConfirmation,
  sourcingTeamNotification,
  type FileLine,
} from "@/lib/email/templates";
import { MAX_FILES_PER_REQUEST, MAX_FILE_BYTES } from "@/lib/files/verify";
import { buildStoragePath, createUploadUrl } from "@/lib/files/storage";
import { sourcingRequestSchema } from "@/lib/schemas/sourcing-request";
import { guardSubmission } from "@/lib/submission-guard";
import {
  createSubmissionToken,
  sanitiseFilename,
} from "@/lib/submission-token";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Step 1 of the submission: verify, limit, validate, insert, sign uploads.
 *
 * The first two gates live in `guardSubmission`, which both public forms share
 * — Turnstile and the rate limiter run BEFORE anything is written, so a
 * rejected submission leaves no trace. Validation below is the control, not a
 * repeat of the client's: nothing the client sent is trusted.
 *
 * Email is sent from `after()`, once the response has been flushed, so no send
 * outcome can reach the buyer. The team notification goes out HERE rather than
 * after file verification, which happens in a second round trip the browser
 * triggers: a tab closed mid-upload would otherwise mean the team never learns
 * a real request came in. Files are listed as declared, and /api/request/files
 * follows up only if one is refused. See docs/decisions.md.
 */

export const runtime = "nodejs";

/** What the client declares about a file. Advisory — the bytes decide later. */
const fileIntentSchema = z.object({
  filename: z.string().min(1).max(1024),
  mimeType: z.string().max(255).optional(),
  sizeBytes: z.number().int().positive(),
});

/** The route's own half of the envelope; the shared half is in the guard. */
const filesSchema = z.array(fileIntentSchema).max(50).optional();

type FieldErrors = Record<string, string>;

function fail(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  // 1-3. Envelope, Turnstile, rate limiter. Nothing is written before this
  //      returns ok, and the guard is where that ordering is enforced.
  const guard = await guardSubmission(request, "sourcing-request");
  if (!guard.ok) return guard.response;

  const files = filesSchema.safeParse(guard.raw.files);
  if (!files.success) {
    return fail(400, { error: "invalid", message: "Malformed request." });
  }

  // 4. Validation is the control. The client already ran this schema; that is
  //    a convenience for the user, not evidence about the payload.
  const parsed = sourcingRequestSchema.safeParse(guard.values);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return fail(400, { error: "validation", fieldErrors });
  }

  // File intents: counted and bounded server-side. The client's own limits are
  // a convenience; these are the control.
  const intents = files.data ?? [];
  if (intents.length > MAX_FILES_PER_REQUEST) {
    return fail(400, {
      error: "files",
      message: `A request may carry at most ${MAX_FILES_PER_REQUEST} files.`,
    });
  }
  if (intents.some((f) => f.sizeBytes > MAX_FILE_BYTES)) {
    return fail(400, {
      error: "files",
      message: "One of those files is over the 4MB limit.",
    });
  }

  const supabase = createSupabaseAdminClient();
  const values = parsed.data;

  // 5. The row. From here on, every failure path must still surface the
  //    reference — the request exists whatever happens next.
  const { data: row, error: insertError } = await supabase
    .from("sourcing_requests")
    .insert({
      product_description: values.productDescription,
      contact_name: values.contactName,
      email: values.email,
      company: values.company ?? null,
      phone: values.phone ?? null,
      industry: values.industry ?? null,
      request_type: values.requestType ?? null,
      quantity: values.quantity ?? null,
      target_price: values.targetPrice ?? null,
      target_delivery_date: values.targetDeliveryDate ?? null,
      preferred_country: values.preferredCountry ?? null,
      certifications: values.certifications ?? null,
      note: values.note ?? null,
    })
    .select("id, reference")
    .single();

  if (insertError || !row) {
    return fail(500, {
      error: "server",
      message: "We could not save your request.",
    });
  }

  // 6. One signed upload URL per file, scoped to this request. The filename
  //    never reaches the path — it is stored for display only.
  const uploads: {
    index: number;
    path: string;
    signedUrl: string;
    token: string;
  }[] = [];

  for (const [index, intent] of intents.entries()) {
    const storagePath = buildStoragePath(row.id);
    try {
      const signed = await createUploadUrl(storagePath);
      const { error: fileRowError } = await supabase
        .from("request_files")
        .insert({
          request_id: row.id,
          storage_path: storagePath,
          original_filename: sanitiseFilename(intent.filename),
          declared_mime: intent.mimeType ?? null,
          size_bytes: intent.sizeBytes,
          status: "pending",
        });
      if (fileRowError) continue;
      uploads.push({
        index,
        path: storagePath,
        signedUrl: signed.signedUrl,
        token: signed.token,
      });
    } catch {
      // A file that cannot be prepared is dropped; the request still stands.
      continue;
    }
  }

  // The row exists and the response is decided. Files are listed as the client
  // declared them — the bytes have not been read yet, and the sizes here are
  // the only ones available at this point. Verification corrects them in the
  // follow-up when it refuses something.
  const declaredFiles: FileLine[] = intents.map((intent) => ({
    filename: sanitiseFilename(intent.filename),
    sizeBytes: intent.sizeBytes,
    status: "pending",
  }));

  after(async () => {
    await sendAll([
      sourcingConfirmation(values, row.reference ?? ""),
      sourcingTeamNotification(values, row.reference ?? "", declaredFiles),
    ]);
  });

  return NextResponse.json({
    requestId: row.id,
    reference: row.reference,
    submissionToken: createSubmissionToken(row.id),
    uploads,
  });
}
