import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { SupplierApplicationCta } from "@/components/sections/supplier-application-cta";
import { SupplierContactBand } from "@/components/sections/supplier-contact-band";
import { SupplierCriteria } from "@/components/sections/supplier-criteria";
import { FOR_SUPPLIERS, FOR_SUPPLIERS_META } from "@/content/for-suppliers";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: FOR_SUPPLIERS_META.title,
  description: FOR_SUPPLIERS_META.description,
  path: "/for-suppliers",
});

export default function ForSuppliersPage() {
  return (
    <main>
      <PageHero
        eyebrow={FOR_SUPPLIERS.hero.eyebrow}
        heading={FOR_SUPPLIERS.hero.heading}
        lead={FOR_SUPPLIERS.hero.lead}
        headingClassName="max-w-[900px]"
        leadClassName="max-w-[640px]"
      />
      <SupplierCriteria />
      <SupplierApplicationCta />
      <SupplierContactBand />
    </main>
  );
}
