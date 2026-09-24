import type { Metadata } from "next";

import { publicEnv } from "@/lib/env";

/**
 * One table of routes, and the metadata helper that reads it.
 *
 * `sitemap.ts`, `robots.ts` and every page's own metadata all derive from
 * ROUTES, so the sitemap, the robots rules and the noindex set cannot drift
 * apart — they are three views of this one list rather than three lists that
 * happen to match today. `pnpm check:routes` fails the build if a page exists
 * with no entry here.
 */

export const SITE_NAME = "Malameran";

/**
 * The generated social card, declared explicitly rather than left to Next's
 * file convention.
 *
 * `src/app/opengraph-image.tsx` serves this path, but the convention only
 * injects itself into pages that do not supply their own `openGraph` object —
 * and every page here does, through `pageMetadata`. Naming it once is more
 * robust than relying on a merge that silently produced no og:image tag at all.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — global sourcing and procurement`,
};

/** Absolute, from NEXT_PUBLIC_SITE_URL, with any trailing slash removed. */
export const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");

export type RouteEntry = {
  path: string;
  /** In the sitemap, and crawlable without a noindex tag. */
  indexable: boolean;
  /**
   * Blocked in robots.txt.
   *
   * Deliberately NOT the same set as `!indexable`. Disallow stops the fetch, so
   * a disallowed page's noindex is never read — and a disallowed URL that is
   * linked from elsewhere still gets listed, as a bare result with no
   * description. /request and /suppliers/apply are linked from four CTAs, so
   * they must stay fetchable for their noindex to be obeyed. Only routes that
   * cannot carry a meta tag at all, or that nothing links to, are disallowed.
   */
  disallow?: boolean;
};

export const ROUTES: readonly RouteEntry[] = [
  { path: "/", indexable: true },
  { path: "/how-it-works", indexable: true },
  { path: "/services", indexable: true },
  { path: "/industries", indexable: true },
  { path: "/for-suppliers", indexable: true },
  { path: "/about", indexable: true },
  { path: "/contact", indexable: true },
  { path: "/privacy", indexable: true },
  { path: "/terms", indexable: true },

  // A form has nothing to rank for, and a half-filled form in a search result
  // helps nobody. Crawlable, so the noindex below is actually read.
  { path: "/request", indexable: false },
  { path: "/suppliers/apply", indexable: false },

  // Internal, unlinked, and slated for deletion before launch.
  { path: "/tokens", indexable: false, disallow: true },

  // The F1-B panels. UI only so far — no auth, no session, no row-level
  // security — so the whole group 404s in production, the same gate /tokens
  // carries. Nothing links them and nothing may rank them, so unlike /request
  // they are disallowed as well as noindex.
  //
  // Only the two roots carry `disallow`. A robots.txt Disallow is a prefix
  // match, so "/admin" already covers every section under it; repeating it per
  // child would print six redundant lines and publish the panel's whole URL
  // structure in a file anyone can read.
  { path: "/dashboard", indexable: false, disallow: true },
  // The template, not a URL: `pnpm check:routes` reads the directory name, so
  // this is the only spelling that matches. The page passes its resolved URL to
  // `pageMetadata` as `canonical`.
  { path: "/dashboard/[id]", indexable: false },
  { path: "/dashboard/profile", indexable: false },
  { path: "/admin", indexable: false, disallow: true },
  { path: "/admin/requests", indexable: false },
  { path: "/admin/projects", indexable: false },
  { path: "/admin/companies", indexable: false },
  { path: "/admin/users", indexable: false },
  { path: "/admin/supplier-applications", indexable: false },
];

export const INDEXABLE_ROUTES = ROUTES.filter((r) => r.indexable);

/** Paths blocked in robots.txt. `/api/` is added there — it serves no HTML. */
export const DISALLOWED_ROUTES = ROUTES.filter((r) => r.disallow);

function routeFor(path: string): RouteEntry {
  const entry = ROUTES.find((r) => r.path === path);
  if (!entry) {
    // A page that reaches here would ship with no canonical and no sitemap
    // entry. Failing the build is the cheap version of that mistake.
    throw new Error(
      `No ROUTES entry for "${path}". Add one in src/lib/seo.ts — it decides the canonical, the sitemap and the noindex.`,
    );
  }
  return entry;
}

/**
 * Every page's metadata, from one place.
 *
 * The root layout owns the title template, the site name and the Twitter card
 * defaults; this fills in what is per-page and nothing else. Pages used to
 * repeat an eleven-line openGraph block each, including a hand-written
 * "· Malameran" suffix that duplicated the template.
 */
export function pageMetadata({
  title,
  description,
  path,
  canonical,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * The URL to publish as the canonical, when it is not `path` itself.
   *
   * Only a dynamic route needs this. `path` has to be the ROUTES key, which for
   * a dynamic route is the template — "/dashboard/[id]" — because that is what
   * `pnpm check:routes` sees on disk. Publishing the template as a canonical
   * would be publishing a URL that resolves to nothing, so the page passes the
   * resolved one here.
   *
   * Additive: every existing call omits it and is unchanged.
   */
  canonical?: string;
}): Metadata {
  const route = routeFor(path);

  // Home is the site's own name, so it opts out of the "%s · Malameran"
  // template rather than rendering "Malameran … · Malameran".
  const home = path === "/";
  const fullTitle = home ? title : `${title} · ${SITE_NAME}`;

  const url = canonical ?? path;

  return {
    title: home ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      locale: "en_CA",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    ...(route.indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

/**
 * Organization structured data, rendered on the home page only.
 *
 * Everything here is a fact already published on the site. Nothing is inferred
 * and nothing is filled in for completeness:
 *
 * - `name` is the brand. FOOTER_COPYRIGHT says "Malameran Sourcing Inc." but is
 *   marked TODO(copy): confirm the registered company name — an unconfirmed
 *   legal entity does not belong in machine-readable markup.
 * - no `telephone`, no `streetAddress`: neither has been confirmed, and the
 *   Contact page deliberately shows city and country only.
 * - no `sameAs`: there are no confirmed social profiles.
 * - no `logo`, no `foundingDate`, no `numberOfEmployees`.
 *
 * Add a property here only when someone has confirmed the fact behind it.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "info@malameran.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
  };
}
