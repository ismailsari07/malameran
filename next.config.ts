import type { NextConfig } from "next";

/**
 * The Supabase origin the browser actually talks to.
 *
 * Read here rather than through `src/lib/env.ts`, which is the only module in
 * the APPLICATION allowed to touch `process.env`. This file is build
 * configuration, not application code, and it cannot import from `src/` — the
 * config is evaluated before any of it exists. Next loads `.env*` before
 * evaluating this file, so the value is available.
 *
 * It has to be derived, not hardcoded: dev and production are different
 * Supabase projects with different refs, so a literal origin would pass every
 * local check and then block the direct-to-storage upload in production and
 * nowhere else.
 */
function supabaseOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is required at build time: it is what puts the " +
        "Supabase origin in the Content-Security-Policy. Without it the form's " +
        "file upload is blocked by CSP at runtime.",
    );
  }
  return new URL(raw).origin;
}

/**
 * Content-Security-Policy — an ORIGIN ALLOWLIST, NOT A STRICT CSP.
 *
 * `script-src` carries `'unsafe-inline'` because Next inlines the RSC flight
 * payload into the document. Removing it would need a per-request nonce, which
 * needs middleware, which makes all 21 currently-static routes dynamic. For a
 * marketing site with no auth, no user-generated HTML and React escaping every
 * value, that trades real performance for a near-nil XSS surface. Do not read
 * this policy as strict, and do not "harden" it into middleware without
 * weighing that cost — see docs/decisions.md.
 *
 * What it does buy, and what would be lost by dropping it: code cannot be
 * loaded from an origin nobody chose, the page cannot be framed, `<base>`
 * cannot be rewritten, forms cannot post off-site, and plugins are off.
 *
 * The three origins that matter and why, because getting any of them wrong
 * breaks the form and only the form:
 *   - challenges.cloudflare.com — the Turnstile loader (script) and its
 *     challenge widget (frame). Also connect: the loader posts from page
 *     context before the iframe exists.
 *   - <project>.supabase.co — the signed-URL PUT that uploads an attachment
 *     straight to Storage, bypassing our own server.
 *   - googletagmanager / google-analytics — allowed while analytics is still
 *     inert, so that setting the measurement ID later turns it on rather than
 *     silently doing nothing.
 */
function contentSecurityPolicy(): string {
  const supabase = supabaseOrigin();
  const turnstile = "https://challenges.cloudflare.com";
  const ga = "https://www.googletagmanager.com";
  const gaCollect = "https://www.google-analytics.com";

  return [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' ${turnstile} ${ga}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: ${gaCollect}`,
    `font-src 'self'`,
    `connect-src 'self' ${supabase} ${turnstile} ${gaCollect}`,
    `frame-src ${turnstile}`,
    `worker-src 'self' blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
  {
    // Two years, subdomains included, preload-eligible. Inert over http, so it
    // costs nothing locally and applies the moment the domain is on https.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Superseded by frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a managed <!-- BEGIN:nextjs-agent-rules -->
  // block to CLAUDE.md on every run, and re-adds it if removed. CLAUDE.md
  // governs agent behaviour on this project and is edited deliberately, not by
  // a build tool. The bundled docs it points at are still readable at
  // node_modules/next/dist/docs/.
  agentRules: false,

  /** `X-Powered-By: Next.js` is a free version disclosure. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
