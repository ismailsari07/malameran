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

export const metadata: Metadata = {
  // The root layout's template would render this as "… · Malameran", so the
  // home page opts out with an absolute title.
  title: { absolute: HOME_META.title },
  description: HOME_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: HOME_META.title,
    description: HOME_META.description,
    locale: "en_CA",
  },
};

/** Sections in artboard order. */
export default function HomePage() {
  return (
    <main>
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
