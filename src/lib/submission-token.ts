import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { serverEnv } from "@/lib/env";

/**
 * Ties the file-verification call to the request row it belongs to.
 *
 * Without it, the request id would be the only credential on
 * POST /api/request/files. A v4 UUID is 122 bits and unguessable in practice,
 * but "unguessable identifier as bearer token" is the pattern that ages badly —
 * ids leak into logs, referrers and support tickets in ways secrets do not.
 *
 * Ten minutes is generous for five 4MB uploads and short enough that a leaked
 * token is worthless by the time anyone reads the log it landed in.
 */

const TTL_SECONDS = 600;

/** C0 and C1 control characters, plus DEL. */
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F]/g;

function sign(requestId: string, expiresAt: number): string {
  return createHmac("sha256", serverEnv.SUBMISSION_TOKEN_SECRET)
    .update(`${requestId}.${expiresAt}`)
    .digest("base64url");
}

export function createSubmissionToken(requestId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  return `${expiresAt}.${sign(requestId, expiresAt)}`;
}

export type TokenCheck = { ok: true } | { ok: false; reason: string };

/**
 * Fails closed on anything unexpected: a malformed token, a bad signature, an
 * expired one, or a signature of the wrong length.
 */
export function verifySubmissionToken(
  requestId: string,
  token: string | undefined | null,
): TokenCheck {
  if (!token) return { ok: false, reason: "missing submission token" };

  const separator = token.indexOf(".");
  if (separator < 1) return { ok: false, reason: "malformed submission token" };

  const expiresAt = Number(token.slice(0, separator));
  const signature = token.slice(separator + 1);
  if (!Number.isFinite(expiresAt) || !signature) {
    return { ok: false, reason: "malformed submission token" };
  }
  if (expiresAt < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "submission token expired" };
  }

  const expected = sign(requestId, expiresAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, so check that first.
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid submission token" };
  }
  return { ok: true };
}

/**
 * Filenames are attacker-controlled and are echoed back to the team on
 * download, so they never reach a storage path and are stripped of anything
 * that could travel somewhere it should not.
 */
export function sanitiseFilename(raw: string): string {
  const base = raw
    // Path separators and traversal: keep the last segment only.
    .split(/[/\\]/)
    .pop()!
    // Control characters, including NUL and the CR/LF that would let a name
    // break out of a Content-Disposition header.
    .replace(CONTROL_CHARACTERS, "")
    .replace(/^\.+/, "")
    .trim();
  return (base || "attachment").slice(0, 255);
}
