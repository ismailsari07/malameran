import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { RequestForm } from "@/components/sections/request-form";
import { RequestSidebar } from "@/components/sections/request-sidebar";
import { REQUEST_FORM, REQUEST_META } from "@/content/request-form";

export const metadata: Metadata = {
  title: REQUEST_META.title,
  description: REQUEST_META.description,
  openGraph: {
    type: "website",
    siteName: "Malameran",
    title: `${REQUEST_META.title} · Malameran`,
    description: REQUEST_META.description,
    locale: "en_CA",
  },
};

/**
 * The sourcing request page.
 *
 * A server component: only <RequestForm> is a client island. The form band uses
 * its own rhythm rather than <Section>, because this page sits on paper with a
 * hairline under the app header rather than on a ground.
 */
export default function RequestPage() {
  return (
    <main className="border-line border-t">
      <Container className="pt-9 pb-14 lg:pt-18 lg:pb-26">
        <h1 className="t-h1-request text-ink">{REQUEST_FORM.page.heading}</h1>
        <p className="t-lead text-muted mt-3.5 lg:mt-4.5">
          {REQUEST_FORM.page.lead}
        </p>

        <div className="mt-6 grid gap-6 lg:mt-13 lg:grid-cols-[minmax(0,1fr)_372px] lg:items-start lg:gap-12">
          {/* Mobile puts the sidebar above the form, per the 375 artboard. */}
          <div className="lg:order-2">
            <RequestSidebar />
          </div>
          <div className="lg:order-1">
            <RequestForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
