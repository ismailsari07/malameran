"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PanelNavGroup } from "@/content/panel";
import { cn } from "@/lib/cn";

/**
 * The panel sidebar, from `lg`.
 *
 * AUTHORED, NOT IN THE SOURCE — no artboard shows a panel of any kind. See
 * "Panel shell" under "Authored, not in the source" in docs/design.md for the
 * width, the sticky offset and where the active treatment comes from.
 *
 * The only part of the shell that needs the current route, so it is the only
 * part of the shell that runs on the client — the same split `SiteNav` makes,
 * for the same reason: marking the shell itself a client component would push
 * the wordmark and its imports into the bundle for one boolean per link.
 *
 * Its own display is set here, not passed in. A caller writing the hide/show
 * half from outside would be two unprefixed utilities in one class attribute,
 * settled by Tailwind's emission order rather than by the order written —
 * which is the bug `pnpm check:classnames` exists to catch.
 */
export function PanelNav({ groups }: { groups: readonly PanelNavGroup[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="hidden lg:sticky lg:top-12 lg:block lg:self-start"
    >
      {groups.map((group) => (
        <div key={group.heading} className="mb-7 last:mb-0">
          <p className="t-eyebrow-xs text-text-eyebrow mb-3 px-3.5">
            {group.heading}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    /*
                     * Every item carries a border, transparent unless active,
                     * so selecting one cannot move the column by a pixel. The
                     * two colours are in separate branches of the ternary
                     * rather than one string with an override — a pair of
                     * border colours in one class attribute would be decided
                     * by emission order, not by what was written last.
                     */
                    className={cn(
                      "t-nav rounded-12 focus-visible:focus-outline block border px-3.5 py-2.5 transition-colors",
                      active
                        ? "border-line bg-surface text-ink"
                        : "hover:text-ink text-muted border-transparent",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
