"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * The behaviour every full-screen panel on this site shares.
 *
 * Two of them exist — the marketing header's mobile menu and the panel shell's
 * section drawer — and they must behave identically: Escape closes, Tab cycles
 * inside the panel, focus moves in when it opens and returns to the trigger
 * when it closes, and the page behind it does not scroll. That list was written
 * once for the mobile menu and lifted here when the second panel needed it,
 * rather than copied. A focus trap that exists twice drifts.
 *
 * What stays at the call site: the open state, the trigger, the markup and
 * where the panel is portalled to. Only the behaviour is shared.
 *
 * Returning focus to the trigger is deliberately NOT done here. It belongs to
 * the caller's own close handler, because the caller also closes on a link
 * click — and a hook that moved focus on every close would fight the navigation
 * that follows.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDismissablePanel<T extends HTMLElement>({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<T>(null);

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
        onClose();
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
  }, [open, onClose]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

  return panelRef;
}

/**
 * The hydration-safe form of "are we on the client yet", for a panel that is
 * portalled to `<body>` and therefore needs a document.
 *
 * The server snapshot is false, the client snapshot is true, and React
 * re-renders once after hydrating. Setting state from an effect would do the
 * same thing while tripping react-hooks/set-state-in-effect.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
