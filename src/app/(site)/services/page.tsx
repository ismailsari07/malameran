import type { Metadata } from "next";

import { EngagementModels } from "@/components/sections/engagement-models";
import { FinalCtaBand } from "@/components/sections/final-cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCards } from "@/components/sections/service-cards";
import { SERVICES, SERVICES_META } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SERVICES_META.title,
  description: SERVICES_META.description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow={SERVICES.hero.eyebrow}
        heading={SERVICES.hero.heading}
        lead={SERVICES.hero.lead}
        headingClassName="max-w-[900px]"
        leadClassName="max-w-[640px]"
      />
      <ServiceCards />
      <EngagementModels />
      <FinalCtaBand
        heading={SERVICES.finalCta.heading}
        body={SERVICES.finalCta.body}
        cta={SERVICES.finalCta.cta}
      />
    </main>
  );
}
