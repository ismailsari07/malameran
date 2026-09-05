import type { MetadataRoute } from "next";

/**
 * The site is closed to crawlers until launch. Opened up in the SEO block —
 * see the open item in docs/tasks/f1-a.md.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
