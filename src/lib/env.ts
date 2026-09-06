import "server-only";

import { z } from "zod";

/**
 * The only module in the application that reads `process.env`.
 *
 * Splitting the schemas keeps the public half importable from client code
 * without dragging server secrets into the bundle, and means a key rename
 * touches this file alone.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
});

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
  TEAM_NOTIFICATION_EMAIL: z.email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  /**
   * Salt for the rate limiter's IP hash. An unsalted SHA-256 of an IPv4
   * address is reversible by brute force in seconds, so the salt is what makes
   * it a hash rather than an encoding.
   *
   * Rotating it resets every active rate-limit window. Windows are minutes
   * long, so that is acceptable — but it must be set, and set identically, in
   * all three Vercel environments.
   */
  RATE_LIMIT_IP_SALT: z.string().min(32),
  /**
   * HMAC key for the submission token that ties the file-verification call to
   * the request row it belongs to.
   *
   * Deliberately its own secret rather than something derived from
   * SUPABASE_SECRET_KEY: the Supabase key gets rotated for reasons that have
   * nothing to do with this token, and coupling the two schedules means an
   * unrelated rotation silently invalidates in-flight submissions.
   *
   * Rotating this invalidates tokens issued in the last ten minutes — bounded
   * blast radius, but do it deliberately.
   */
  SUBMISSION_TOKEN_SECRET: z.string().min(32),
});

function parse<T extends z.ZodType>(schema: T, source: unknown, label: string) {
  const result = schema.safeParse(source);
  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid ${label} environment variables:\n${missing}\n\nSee .env.example.`,
    );
  }
  return result.data as z.infer<T>;
}

/**
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time only for literal
 * property accesses, so these cannot be read from a dynamic object.
 */
export const publicEnv = parse(
  publicSchema,
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  "public",
);

export const serverEnv = parse(
  serverSchema,
  {
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    TEAM_NOTIFICATION_EMAIL: process.env.TEAM_NOTIFICATION_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    RATE_LIMIT_IP_SALT: process.env.RATE_LIMIT_IP_SALT,
    SUBMISSION_TOKEN_SECRET: process.env.SUBMISSION_TOKEN_SECRET,
  },
  "server",
);
