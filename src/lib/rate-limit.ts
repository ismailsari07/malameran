import "server-only";

import { createHash } from "node:crypto";

import { serverEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Fixed-window rate limiting, in Postgres. No external service.
 *
 * The increment and the test happen in one statement inside
 * `check_rate_limit()`, so two concurrent requests cannot both read the same
 * count and both proceed.
 *
 * This FAILS CLOSED: any error — a timeout, a missing function, a broken
 * connection — is treated as "limit exceeded" and the submission is refused.
 * A limiter that admits everyone when it breaks is not a limiter.
 */

/** Five submissions per IP per endpoint per ten minutes. */
export const DEFAULT_MAX_HITS = 5;
export const DEFAULT_WINDOW_SECONDS = 600;

/**
 * The raw IP never reaches the database.
 *
 * An unsalted SHA-256 of an IPv4 address is reversible by exhausting the 4
 * billion possibilities in seconds, so the salt is what makes this a hash
 * rather than an encoding.
 */
function hashIp(ip: string): string {
  return createHash("sha256")
    .update(`${serverEnv.RATE_LIMIT_IP_SALT}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Pulls the client IP from the proxy headers Vercel sets.
 *
 * Returns null when no address can be determined, which the caller treats the
 * same way as being over the limit — an unattributable request is not given a
 * free pass.
 */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || null;
}

export type RateLimitResult = { allowed: boolean; reason?: string };

export async function checkRateLimit({
  ip,
  endpoint,
  maxHits = DEFAULT_MAX_HITS,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
}: {
  ip: string | null;
  endpoint: string;
  maxHits?: number;
  windowSeconds?: number;
}): Promise<RateLimitResult> {
  if (!ip) {
    return { allowed: false, reason: "no client address" };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_bucket_key: `${hashIp(ip)}:${endpoint}`,
      p_max_hits: maxHits,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      return { allowed: false, reason: `limiter error: ${error.message}` };
    }
    if (typeof data !== "boolean") {
      return { allowed: false, reason: "limiter returned an unexpected value" };
    }
    return data
      ? { allowed: true }
      : { allowed: false, reason: "rate limited" };
  } catch (cause) {
    // Fail closed. Never let an exception here become an open door.
    return {
      allowed: false,
      reason: `limiter unavailable: ${cause instanceof Error ? cause.message : "unknown"}`,
    };
  }
}
