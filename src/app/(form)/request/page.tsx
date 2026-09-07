import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { RequestForm } from "@/components/sections/request-form";
import { RequestSidebar } from "@/components/sections/request-sidebar";
import { REQUEST_META } from "@/content/request-form";
import { publicEnv } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: REQUEST_META.title,
  description: REQUEST_META.description,
  path: "/request",
});

/**
 * The sourcing request page.
 *
 * A server component. <RequestForm> is the only client island, and it owns
 * everything below the header because the success state replaces the heading
 * and the sidebar as well as the form. The sidebar is passed to it as a prop
 * and stays a server component.
 */
export default function RequestPage() {
  return (
    <main className="border-line border-t">
      <Container>
        <RequestForm
          turnstileSiteKey={publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          sidebar={<RequestSidebar />}
        />
      </Container>
    </main>
  );
}
