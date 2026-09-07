import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SupplierForm } from "@/components/sections/supplier-form";
import { SupplierSidebar } from "@/components/sections/supplier-sidebar";
import { SUPPLIER_META } from "@/content/supplier-form";
import { publicEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: SUPPLIER_META.title,
  description: SUPPLIER_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: `${SUPPLIER_META.title} · Malameran`,
    description: SUPPLIER_META.description,
    locale: "en_CA",
  },
};

/**
 * The supplier application page — the destination of every "Apply as a
 * supplier" call to action on the site.
 *
 * A server component. <SupplierForm> is the only client island, and it owns
 * everything below the header because the success state replaces the heading
 * and the sidebar as well as the form. The sidebar is passed to it as a prop
 * and stays a server component.
 */
export default function SupplierApplyPage() {
  return (
    <main className="border-line border-t">
      <Container>
        <SupplierForm
          turnstileSiteKey={publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          sidebar={<SupplierSidebar />}
        />
      </Container>
    </main>
  );
}
