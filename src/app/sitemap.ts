import type { MetadataRoute } from "next";

import { INDEXABLE_ROUTES, SITE_URL } from "@/lib/seo";

/**
 * Generated from the ROUTES table in src/lib/seo.ts, so it cannot disagree with
 * robots.txt or with the noindex set — all three read the same list.
 *
 * No `lastModified`. The only value available at build time is "now", which
 * would tell crawlers every page changed on every deploy. An absent field is
 * honest; a fabricated one trains them to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
  }));
}
