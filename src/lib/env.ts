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
  /**
   * Google Analytics 4 measurement ID. OPTIONAL, and absent until delivery.
   *
   * With it unset nothing loads and no request reaches Google — see
   * src/components/analytics.tsx. Setting it also makes the analytics section
   * of the published privacy policy false, so the policy copy and this variable
   * have to move in the same change. See docs/tasks/f1-a.md.
   */
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, 'must look like "G-XXXXXXXXXX"')
    .optional(),
});

/**
 * The address inside `EMAIL_FROM`, which may be either a bare address or the
 * `Display Name <address>` form. Resend accepts both, and the display name is
 * what a recipient actually sees, so both have to validate.
 */
function addressPart(value: string): string {
  const angled = /<([^<>]+)>\s*$/.exec(value);
  return (angled?.[1] ?? value).trim();
}

/**
 * `EMAIL_FROM` must be on the `send.` subdomain.
 *
 * CLAUDE.md makes this a hard rule: bounces and spam complaints from automated
 * mail damage sender reputation, and the client's own outreach runs on the root
 * domain. Checking it here means a misconfiguration fails at boot rather than
 * showing up in a deliverability report months later.
 */
const emailFrom = z
  .string()
  .min(1)
  .superRefine((value, ctx) => {
    const address = addressPart(value);
    if (!z.email().safeParse(address).success) {
      ctx.addIssue({
        code: "custom",
        message: `not an email address: expected "name@send.example.com" or "Name <name@send.example.com>", got ${JSON.stringify(value)}`,
      });
      return;
    }
    const domain = address.slice(address.lastIndexOf("@") + 1);
    if (!domain.startsWith("send.")) {
      ctx.addIssue({
        code: "custom",
        message: `must send from the "send." subdomain, not ${domain} — see CLAUDE.md`,
      });
    }
  });

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: emailFrom,
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
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  "public",
);

/**
 * Kept here so `src/lib/env.ts` stays the only module reading `process.env`.
 * Next inlines NODE_ENV the same way it inlines the public variables.
 */
export const isProduction = process.env.NODE_ENV === "production";

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
