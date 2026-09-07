import type { MetadataRoute } from "next";

import { DISALLOWED_ROUTES, SITE_URL } from "@/lib/seo";

/**
 * Open to crawlers, with two exceptions.
 *
 * `Disallow` is deliberately NOT applied to every noindex route. Disallow stops
 * the fetch, so the crawler never reads the page's noindex — and a disallowed
 * URL that is linked from elsewhere still gets listed, as a bare result with no
 * description. /request and /suppliers/apply are linked from four calls to
 * action, so they stay fetchable and rely on their meta tag, which is the thing
 * that actually de-indexes them.
 *
 * What is disallowed here is what cannot carry a meta tag (/api returns JSON)
 * or what nothing links to (/tokens, internal and slated for deletion).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...DISALLOWED_ROUTES.map((r) => r.path)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
