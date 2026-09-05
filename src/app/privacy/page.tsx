import type { Metadata } from "next";

import { LegalBody } from "@/components/sections/legal-body";
import { PageHero } from "@/components/sections/page-hero";
import { PRIVACY, PRIVACY_META } from "@/content/privacy";

export const metadata: Metadata = {
  title: PRIVACY_META.title,
  description: PRIVACY_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: `${PRIVACY_META.title} · Malameran`,
    description: PRIVACY_META.description,
    locale: "en_CA",
  },
};

/**
 * Template text pending legal review — see the TODO(legal) at the top of
 * src/content/privacy.ts. The disclosure is visible on the page, in the info
 * panel above the document.
 *
 * No closing CTA band, the same exception Contact is.
 */
export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow={PRIVACY.hero.eyebrow}
        heading={PRIVACY.hero.heading}
        lead={PRIVACY.hero.lead}
        leadClassName="max-w-[620px]"
      />
      <LegalBody doc={PRIVACY} />
    </main>
  );
}
