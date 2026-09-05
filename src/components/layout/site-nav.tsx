"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/content/nav";
import { cn } from "@/lib/cn";

/**
 * The desktop nav links.
 *
 * The only part of the header that needs the current route, so it is the only
 * part that runs on the client — the bar, the wordmark and the CTA stay on the
 * server.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="ml-auto hidden items-center gap-8 lg:flex"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "t-nav focus-visible:focus-outline transition-colors hover:text-white",
              active ? "text-white" : "text-white/72",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
