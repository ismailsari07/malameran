import type { Metadata } from "next";

import { LegalBody } from "@/components/sections/legal-body";
import { PageHero } from "@/components/sections/page-hero";
import { TERMS, TERMS_META } from "@/content/terms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: TERMS_META.title,
  description: TERMS_META.description,
  path: "/terms",
});

/**
 * Template text pending legal review — see the TODO(legal) at the top of
 * src/content/terms.ts. The disclosure is visible on the page, in the info
 * panel above the document.
 *
 * No closing CTA band, the same exception Contact is.
 */
export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow={TERMS.hero.eyebrow}
        heading={TERMS.hero.heading}
        lead={TERMS.hero.lead}
        leadClassName="max-w-[620px]"
      />
      <LegalBody doc={TERMS} />
    </main>
  );
}
