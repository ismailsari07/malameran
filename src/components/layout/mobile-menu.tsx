"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { HEADER_CTA, NAV_ITEMS } from "@/content/nav";
import { cn } from "@/lib/cn";

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
 * The trigger, the state and every handler are unchanged. Only where the panel
 * renders moved.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /**
   * The portal needs a document, and there is none during SSR. This is the
   * hydration-safe form of "are we on the client yet": the server snapshot is
   * false, the client snapshot is true, and React re-renders once after
   * hydrating. Setting state from an effect would do the same thing while
   * tripping react-hooks/set-state-in-effect.
   *
   * The panel is therefore absent from the SSR markup, which costs nothing —
   * it is closed and `hidden` at that point anyway.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Lock the page behind the panel.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes; Tab cycles inside the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

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
