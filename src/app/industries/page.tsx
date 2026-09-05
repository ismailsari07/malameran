import type { Metadata } from "next";

import { FinalCtaBand } from "@/components/sections/final-cta-band";
import { NotListed } from "@/components/sections/not-listed";
import { PageHero } from "@/components/sections/page-hero";
import { SectorRows } from "@/components/sections/sector-rows";
import { INDUSTRIES, INDUSTRIES_META } from "@/content/industries";

export const metadata: Metadata = {
  title: INDUSTRIES_META.title,
  description: INDUSTRIES_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: `${INDUSTRIES_META.title} · Malameran`,
    description: INDUSTRIES_META.description,
    locale: "en_CA",
  },
};

export default function IndustriesPage() {
  return (
    <main>
      <PageHero
        eyebrow={INDUSTRIES.hero.eyebrow}
        heading={INDUSTRIES.hero.heading}
        lead={INDUSTRIES.hero.lead}
        headingClassName="max-w-[880px]"
        leadClassName="max-w-[640px]"
      />
      <SectorRows />
      <NotListed />
      {/* The artboard's closing band carries no paragraph. */}
      <FinalCtaBand
        heading={INDUSTRIES.finalCta.heading}
        cta={INDUSTRIES.finalCta.cta}
      />
    </main>
  );
}
