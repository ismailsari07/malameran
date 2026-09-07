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
 *
 * The CTA used to carry `className="hidden lg:inline-flex"`, which did not
 * hide it: `Button`'s base string starts with `inline-flex`, `cn()` is a plain
 * join, and `.inline-flex` is emitted after `.hidden` in the built CSS, so the
 * cascade kept the button visible. At 375px it took the space the hamburger
 * needed and wrapped its label to three lines. Nothing here overrides a
 * component's own display from the outside any more — the button is always
 * rendered, and only its label changes with the breakpoint.
 */
export function SiteHeader() {
  return (
    <header className="bg-head-bg border-b border-white/10 lg:border-b-0">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 lg:h-22 lg:gap-10">
          <Wordmark size="site" hideTextBelowLg />

          <SiteNav />

          <Button href={HEADER_CTA.href} variant="primary-sm">
            <span className="lg:hidden">{HEADER_CTA.labelShort}</span>
            <span className="hidden lg:inline">{HEADER_CTA.label}</span>
          </Button>

          <MobileMenu className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
