import "server-only";

import { randomUUID } from "node:crypto";

import { publicEnv, serverEnv } from "@/lib/env";
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

export type RangeRead = {
  bytes: Uint8Array;
  /** The object's full length, from the Content-Range header. Authoritative. */
  totalSize: number;
};

/**
 * Reads part of an object.
 *
 * Verification needs a file's first 64 bytes and, for a ZIP, its tail — never
 * the middle and never the whole thing. Downloading a 4MB drawing to read six
 * magic bytes costs a second in production and is pathological in dev, where
 * buffering a large body through Next's patched fetch runs at about 18ms/KB.
 *
 * Supabase Storage honours Range and answers 206 with a Content-Range carrying
 * the total size, which is where the size check gets its number — measured by
 * Storage, not claimed by the client.
 *
 * `end` is inclusive, per the HTTP spec. Omit it to read to the end.
 */
export async function readRange(
  storagePath: string,
  start: number,
  end?: number,
): Promise<RangeRead> {
  const url = `${publicEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${REQUEST_FILES_BUCKET}/${storagePath}`;
  const response = await fetch(url, {
    headers: {
      apikey: serverEnv.SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${serverEnv.SUPABASE_SECRET_KEY}`,
      Range: end === undefined ? `bytes=${start}-` : `bytes=${start}-${end}`,
    },
    cache: "no-store",
  });

  if (response.status !== 206 && response.status !== 200) {
    throw new Error(`could not read ${storagePath}: HTTP ${response.status}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());

  // "bytes 0-63/2097161" — the part after the slash is what we want.
  const contentRange = response.headers.get("content-range");
  const declaredTotal = contentRange?.split("/")[1];
  const totalSize =
    declaredTotal && declaredTotal !== "*"
      ? Number(declaredTotal)
      : // A 200 means the server ignored the range and sent everything.
        bytes.byteLength;

  if (!Number.isFinite(totalSize)) {
    throw new Error(`could not determine the size of ${storagePath}`);
  }
  return { bytes, totalSize };
}

/** Reads an uploaded object in full. Used by tests and by nothing on the hot path. */
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
