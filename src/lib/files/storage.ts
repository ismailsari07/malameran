import "server-only";

import { randomUUID } from "node:crypto";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Storage helpers for request attachments.
 *
 * The bucket is private and carries no policies on `storage.objects`, so only
 * the secret key can touch it. Browsers never hold a Supabase credential —
 * they get a single-purpose signed URL and nothing else.
 */

export const REQUEST_FILES_BUCKET = "request-files";

/**
 * Short enough that a leaked URL — in a log, a forwarded email, a screenshot —
 * is worthless within minutes; long enough to actually pull 4MB on a bad
 * connection. 60 seconds fails real downloads.
 */
export const DOWNLOAD_URL_TTL_SECONDS = 300;

/**
 * `requests/{requestId}/{uuid}` — scoped to the request it belongs to, with
 * neither the original filename nor an extension.
 *
 * A user-supplied filename in a storage path is a path-traversal and
 * content-sniffing problem for no benefit: the real name lives in
 * `request_files.original_filename` and is reattached at download time through
 * the signed URL's Content-Disposition.
 */
export function buildStoragePath(requestId: string): string {
  return `requests/${requestId}/${randomUUID()}`;
}

/**
 * A one-shot upload URL for a single file, generated server-side.
 *
 * Supabase fixes the lifetime of these at two hours and the client library
 * exposes no way to shorten it — see docs/decisions.md.
 */
export async function createUploadUrl(storagePath: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(REQUEST_FILES_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    throw new Error(`could not create an upload URL: ${error?.message}`);
  }
  return { path: data.path, token: data.token, signedUrl: data.signedUrl };
}

/**
 * A time-limited download URL. `downloadAs` sets Content-Disposition, which is
 * how the original filename comes back despite not being in the path.
 */
export async function createDownloadUrl(
  storagePath: string,
  downloadAs: string,
  ttlSeconds: number = DOWNLOAD_URL_TTL_SECONDS,
) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(REQUEST_FILES_BUCKET)
    .createSignedUrl(storagePath, ttlSeconds, { download: downloadAs });

  if (error || !data) {
    throw new Error(`could not create a download URL: ${error?.message}`);
  }
  return data.signedUrl;
}

/** Reads an uploaded object back so its bytes can be verified. */
export async function downloadObject(storagePath: string): Promise<Uint8Array> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(REQUEST_FILES_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new Error(`could not read ${storagePath}: ${error?.message}`);
  }
  return new Uint8Array(await data.arrayBuffer());
}

/** Removes an object. Called for every file that fails verification. */
export async function deleteObject(storagePath: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage
    .from(REQUEST_FILES_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`could not delete ${storagePath}: ${error.message}`);
  }
}
