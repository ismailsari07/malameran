import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * The gates every public submission passes before anything is written.
 *
 * The order is the point of this module. Turnstile and the rate limiter both
 * run BEFORE any insert, so a rejected submission leaves no trace — no row, no
 * storage object, no reference number burned. That invariant used to be a
 * comment plus a statement ordering inside each route, which is exactly the
 * shape of thing an unrelated edit breaks silently in one file and not the
 * other. Here it is structural: a route cannot write before it has a
 * `{ ok: true }` back from this function.
 *
 * What this deliberately does NOT do is validate the payload. Validation is
 * per-form and belongs to the route that owns the schema; this only decides
 * whether the request is entitled to be considered at all.
 */

/** The envelope shared by every submission. Route-specific keys survive in `raw`. */
const envelopeSchema = z.object({
  turnstileToken: z.string().min(1).max(4096),
  values: z.unknown(),
});

export type GuardResult =
  | {
      ok: true;
      /** Null when no client address could be determined. */
      ip: string | null;
      /** The unvalidated form values, for the route's own schema. */
      values: unknown;
      /** The whole body, for routes carrying extra keys such as file intents. */
      raw: Record<string, unknown>;
    }
  | { ok: false; response: NextResponse };

function refuse(status: number, body: Record<string, unknown>): GuardResult {
  return { ok: false, response: NextResponse.json(body, { status }) };
}

export async function guardSubmission(
  request: Request,
  /**
   * The rate-limit bucket. Distinct values are independent limits: the key is
   * hash(salted ip) + ':' + endpoint, so one form filling up cannot lock a
   * visitor out of the other.
   */
  endpoint: string,
): Promise<GuardResult> {
  const ip = clientIpFrom(request.headers);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return refuse(400, { error: "invalid", message: "Malformed request." });
  }

  const envelope = envelopeSchema.safeParse(raw);
  if (!envelope.success) {
    return refuse(400, { error: "invalid", message: "Malformed request." });
  }

  // 1. Turnstile, before anything is written.
  const turnstile = await verifyTurnstile(envelope.data.turnstileToken, ip);
  if (!turnstile.ok) {
    // A spent or elapsed token is a retryable condition, not a failed
    // challenge: the client fetches a fresh one and submits again, once.
    const expired = /timeout-or-duplicate/.test(turnstile.reason);
    return refuse(403, {
      error: expired ? "turnstile-expired" : "turnstile",
      message: "We could not verify that you are human.",
    });
  }

  // 2. Rate limiter. Any error from it means refuse — it fails closed.
  const limit = await checkRateLimit({ ip, endpoint });
  if (!limit.allowed) {
    return refuse(429, {
      error: "rate-limited",
      message: "Too many requests from this connection.",
    });
  }

  return {
    ok: true,
    ip,
    values: envelope.data.values,
    raw: raw as Record<string, unknown>,
  };
}
