import { Button } from "@/components/ui/button";
import { HEADER_CTA } from "@/content/nav";

import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";
import { Wordmark } from "./wordmark";

/**
 * The marketing header: 64px with a hamburger, 88px with the full nav from
 * `lg`. Source: design/Site Header.dc.html.
 *
 * Stays a server component. Only <SiteNav> and <MobileMenu> need the current
 * route, and they read it themselves.
 */
export function SiteHeader() {
  return (
    <header className="bg-head-bg border-b border-white/10 lg:border-b-0">
      <Container>
        <div className="flex h-16 items-center justify-between gap-10 lg:h-22">
          <Wordmark size="site" />

          <SiteNav />

          <Button
            href={HEADER_CTA.href}
            variant="primary-sm"
            className="hidden lg:inline-flex"
          >
            {HEADER_CTA.label}
          </Button>

          <MobileMenu className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
