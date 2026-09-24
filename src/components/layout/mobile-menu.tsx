"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { HEADER_CTA, NAV_ITEMS } from "@/content/nav";
import { cn } from "@/lib/cn";
import {
  useDismissablePanel,
  useHasMounted,
} from "@/lib/use-dismissable-panel";

/**
 * The mobile navigation panel.
 *
 * AUTHORED, NOT IN THE SOURCE. The artboards give the hamburger but no open
 * state, so this is designed rather than extracted — see "Authored, not in the
 * source" in docs/design.md. It stays inside the existing tokens: no new
 * colour, radius or type size.
 *
 * The panel is PORTALLED TO <body>, not rendered where the trigger sits.
 * `position: fixed` resolves against the nearest ancestor with a `transform`,
 * `filter`, `backdrop-filter`, `perspective`, `contain` or `will-change` — not
 * against the viewport — so while the panel lived inside the header's flex row,
 * any future one of those on the header, the container or the row would have
 * silently trapped a full-screen panel inside a 64px bar. Nothing does that
 * today; the portal means nothing can.
 *
 * Escape, the Tab cycle, the initial focus move and the scroll lock now come
 * from `useDismissablePanel`, which the panel shell's section drawer also uses.
 * The behaviour is unchanged in every respect — the effects moved file, nothing
 * about them was rewritten, and returning focus to the trigger stays here in
 * `close()` because this panel also closes on a link click.
 */

export function MobileMenu({ className }: { className?: string }) {
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
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
        className="focus-visible:focus-outline flex size-11 flex-col items-end justify-center gap-[5px]"
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
               * `lg:hidden` is on the panel itself now. It used to be inherited
               * from the wrapper the trigger sits in, and outside that wrapper
               * a menu left open while the viewport grows past `lg` would
               * otherwise stay on screen over the desktop layout.
               */
              className="ground-quiet fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto px-5 pt-2 pb-10 lg:hidden"
            >
              <nav aria-label="Main">
                <ul>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className="border-b border-white/9">
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={
                          item.href === pathname ? "page" : undefined
                        }
                        className={cn(
                          "t-h3-card focus-visible:focus-outline block py-5",
                          item.href === pathname
                            ? "text-white"
                            : "text-white/72",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button href={HEADER_CTA.href} block className="mt-6">
                {HEADER_CTA.label}
              </Button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
