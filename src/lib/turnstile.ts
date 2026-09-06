import "server-only";

import { serverEnv } from "@/lib/env";

/**
 * Server-side Cloudflare Turnstile verification.
 *
 * A submission with a missing, invalid or already-spent token is rejected
 * before anything is written. Cloudflare invalidates a token on its first
 * verification, so replay is handled at their end.
 *
 * Like the rate limiter, this fails closed: a network error verifying the
 * token is a rejection, not a pass.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TIMEOUT_MS = 5000;

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: "missing token" };

  const body = new FormData();
  body.append("secret", serverEnv.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      return { ok: false, reason: `siteverify returned ${response.status}` };
    }

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (result.success === true) return { ok: true };
    return {
      ok: false,
      reason: result["error-codes"]?.join(", ") || "verification failed",
    };
  } catch (cause) {
    return {
      ok: false,
      reason: `siteverify unreachable: ${cause instanceof Error ? cause.message : "unknown"}`,
    };
  }
}
