import type { Metadata } from "next";

import { CompanyStats } from "@/components/sections/company-stats";
import { FinalCtaBand } from "@/components/sections/final-cta-band";
import { OperatingRules } from "@/components/sections/operating-rules";
import { PageHero } from "@/components/sections/page-hero";
import { WhyWeExist } from "@/components/sections/why-we-exist";
import { ABOUT, ABOUT_META } from "@/content/about";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: ABOUT_META.title,
  description: ABOUT_META.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow={ABOUT.hero.eyebrow}
        heading={ABOUT.hero.heading}
        lead={ABOUT.hero.lead}
        headingClassName="max-w-[900px]"
        leadClassName="max-w-[640px]"
      />
      <WhyWeExist />
      <OperatingRules />
      <CompanyStats />
      <FinalCtaBand
        heading={ABOUT.finalCta.heading}
        body={ABOUT.finalCta.body}
        cta={ABOUT.finalCta.cta}
      />
    </main>
  );
}
