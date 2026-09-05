import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HEADER_CTA, NAV_ITEMS } from "@/content/nav";
import { cn } from "@/lib/cn";

import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { Wordmark } from "./wordmark";

/**
 * The marketing header: 64px with a hamburger, 88px with the full nav from
 * `lg`. Source: design/Site Header.dc.html.
 */
export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="bg-head-bg border-b border-white/10 lg:border-b-0">
      <Container>
        <div className="flex h-16 items-center justify-between gap-10 lg:h-22">
          <Wordmark size="site" />

          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-8 lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === active ? "page" : undefined}
                className={cn(
                  "t-nav focus-visible:focus-outline transition-colors hover:text-white",
                  item.href === active ? "text-white" : "text-white/72",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            href={HEADER_CTA.href}
            variant="primary-sm"
            className="hidden lg:inline-flex"
          >
            {HEADER_CTA.label}
          </Button>

          <MobileMenu active={active} className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
