"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { PANEL_MENU, type PanelNavGroup } from "@/content/panel";
import { cn } from "@/lib/cn";
import {
  useDismissablePanel,
  useHasMounted,
} from "@/lib/use-dismissable-panel";

/**
 * The panel's section drawer, below `lg`.
 *
 * AUTHORED, NOT IN THE SOURCE, like everything else in the shell. It is the
 * marketing site's mobile menu on the light surface: the same trigger, the same
 * portal, the same dismissal rules — Escape closes, Tab cycles inside, focus
 * moves in on open and back to the trigger on close, the page behind does not
 * scroll — all of it from `useDismissablePanel`, which both panels share so
 * they cannot drift apart.
 *
 * Portalled to <body> for the reason recorded in docs/decisions.md: `fixed`
 * resolves against the nearest transformed, filtered or contained ancestor
 * rather than the viewport, so a panel rendered inside the header row can be
 * silently trapped inside a 60px bar by a property added later.
 *
 * `top-15` is the mobile bar's 60px — the marketing menu's `top-16` is its
 * 64px bar. The two numbers differ because the two bars do.
 */
export function PanelDrawer({ groups }: { groups: readonly PanelNavGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const panelRef = useDismissablePanel<HTMLDivElement>({
    open,
    onClose: close,
  });
  const mounted = useHasMounted();

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? PANEL_MENU.close : PANEL_MENU.open}
        onClick={() => (open ? close() : setOpen(true))}
        className="focus-visible:focus-outline -ml-2.5 flex size-11 flex-col items-start justify-center gap-[5px]"
      >
        <span
          aria-hidden="true"
          className={cn(
            "block h-0.5 w-6 bg-white transition-transform duration-200",
            open && "translate-y-[3.5px] rotate-45",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "block h-0.5 w-6 bg-white transition-transform duration-200",
            open && "-translate-y-[3.5px] -rotate-45",
          )}
        />
      </button>

      {mounted
        ? createPortal(
            <div
              id={panelId}
              ref={panelRef}
              hidden={!open}
              /*
               * `lg:hidden` sits on the panel itself, not only on the wrapper
               * the trigger lives in: a drawer left open while the viewport
               * grows past `lg` would otherwise stay on screen over the
               * sidebar layout.
               */
              className="bg-paper fixed inset-x-0 top-15 bottom-0 z-50 overflow-y-auto px-5 pt-4 pb-10 lg:hidden"
            >
              <nav aria-label="Sections">
                {groups.map((group) => (
                  <div key={group.heading} className="mb-6 last:mb-0">
                    {/* Same heading treatment as the sidebar. */}
                    <p className="t-eyebrow-xs text-text-body-alt mb-1">
                      {group.heading}
                    </p>
                    <ul>
                      {group.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <li
                            key={item.href}
                            className="border-line border-b last:border-b-0"
                          >
                            <Link
                              href={item.href}
                              onClick={close}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "t-h3-card-sm focus-visible:focus-outline block py-4",
                                active ? "text-ink" : "text-muted",
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
