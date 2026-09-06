import type { Metadata } from "next";

import { Commitments } from "@/components/sections/commitments";
import { FinalCtaBand } from "@/components/sections/final-cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { StepRows } from "@/components/sections/step-rows";
import { TimelineAside } from "@/components/sections/timeline-aside";
import { HOW_IT_WORKS, HOW_IT_WORKS_META } from "@/content/how-it-works";

export const metadata: Metadata = {
  title: HOW_IT_WORKS_META.title,
  description: HOW_IT_WORKS_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: `${HOW_IT_WORKS_META.title} · Malameran`,
    description: HOW_IT_WORKS_META.description,
    locale: "en_CA",
  },
};

export default function HowItWorksPage() {
  return (
    <main>
      <PageHero
        eyebrow={HOW_IT_WORKS.hero.eyebrow}
        heading={HOW_IT_WORKS.hero.heading}
        lead={HOW_IT_WORKS.hero.lead}
        leadClassName="max-w-[600px]"
        aside={<TimelineAside />}
      />
      <StepRows />
      <Commitments />
      <FinalCtaBand
        heading={HOW_IT_WORKS.finalCta.heading}
        body={HOW_IT_WORKS.finalCta.body}
        cta={HOW_IT_WORKS.finalCta.cta}
      />
    </main>
  );
}
