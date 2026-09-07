import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Industries } from "@/components/sections/industries";
import { Problem } from "@/components/sections/problem";
import { SuppliersPanel } from "@/components/sections/suppliers-panel";
import { Trust } from "@/components/sections/trust";
import { WhatWeHandle } from "@/components/sections/what-we-handle";
import { HOME_META } from "@/content/home";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: HOME_META.title,
  description: HOME_META.description,
  path: "/",
});

/** Sections in artboard order. */
export default function HomePage() {
  return (
    <main>
      {/* Organization data, home page only — repeating it site-wide adds nothing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      <Problem />
      <HowItWorks />
      <WhatWeHandle />
      <Industries />
      <Trust />
      <SuppliersPanel />
      <FinalCta />
    </main>
  );
}
