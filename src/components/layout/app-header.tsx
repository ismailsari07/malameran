import Link from "next/link";

import { BACK_TO_SITE } from "@/content/nav";

import { Container } from "./container";
import { Wordmark } from "./wordmark";

/**
 * The reduced header the form pages use: 60px mobile, 76px desktop, no nav —
 * just the wordmark and a single way back. Source: the Request Form and
 * Supplier Application artboards.
 */
export function AppHeader() {
  return (
    <header className="bg-head-bg">
      <Container>
        <div className="flex h-15 items-center justify-between lg:h-19">
          <Wordmark size="app" />
          <Link
            href={BACK_TO_SITE.href}
            className="t-link-back focus-visible:focus-outline text-white/60 transition-colors hover:text-white"
          >
            {BACK_TO_SITE.label}
          </Link>
        </div>
      </Container>
    </header>
  );
}
