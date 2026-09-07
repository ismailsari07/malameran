// Every page must have an entry in the ROUTES table in src/lib/seo.ts.
//
// That table decides three things at once: the canonical URL, whether the page
// is in the sitemap, and whether it carries a noindex. A page added without an
// entry would ship with no canonical and no sitemap presence, and nothing else
// would complain — pageMetadata() throws at build, but only for a page that
// actually calls it. This catches the page that forgets to.
//
// Run after any route is added or removed: pnpm check:routes

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const APP = "src/app";
const SEO = "src/lib/seo.ts";

/** Route-group segments — (site), (form) — do not appear in the URL. */
const isGroup = (segment) => segment.startsWith("(") && segment.endsWith(")");

function pagePaths(dir, segments = []) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(
        ...pagePaths(full, isGroup(entry) ? segments : [...segments, entry]),
      );
    } else if (entry === "page.tsx") {
      found.push("/" + segments.join("/"));
    }
  }
  return found;
}

const declared = new Set(
  [...readFileSync(SEO, "utf8").matchAll(/path:\s*"([^"]+)"/g)].map(
    (m) => m[1],
  ),
);

const actual = new Set(
  pagePaths(APP).map((p) => (p === "/" ? "/" : p.replace(/\/$/, ""))),
);

const missing = [...actual].filter((p) => !declared.has(p)).sort();
const stale = [...declared].filter((p) => !actual.has(p)).sort();

for (const p of [...actual].sort()) {
  console.log(`  ${declared.has(p) ? "ok  " : "MISS"} ${p}`);
}

if (missing.length || stale.length) {
  console.error("");
  for (const p of missing) {
    console.error(`A page exists at ${p} with no entry in ${SEO}.`);
    console.error("  It would ship with no canonical and no sitemap entry.");
  }
  for (const p of stale) {
    console.error(`${SEO} declares ${p}, but no page.tsx renders it.`);
    console.error(
      "  A sitemap entry pointing at a 404 tells crawlers the site is broken.",
    );
  }
  process.exit(1);
}

console.log(`\nAll ${actual.size} routes are declared in ${SEO}.`);
