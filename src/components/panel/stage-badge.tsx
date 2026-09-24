import { cn } from "@/lib/cn";

/**
 * A small pill carrying a stage or a status.
 *
 * AUTHORED: see "Admin panel screens" in docs/design.md. It is the spacing
 * table's tag pill — 6px 12px, radius 999 — in the capability chip's two
 * existing treatments, rest and selected.
 *
 * COLOUR CARRIES POSITION, NEVER OUTCOME. The palette has no success colour, so
 * a green "Approved" and a red "Declined" would each be a new token and a
 * semantic this design has never made. Every status renders in the rest
 * treatment; `active` means only "this is where the record currently is". The
 * word in the badge carries the outcome.
 */

const TONES = {
  rest: "border-border-field bg-surface text-text-body-alt",
  active: "border-accent bg-(--accent-chip-selected) text-on-accent",
} as const;

export function StageBadge({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "t-chip rounded-pill inline-block border px-3 py-1.5",
        TONES[active ? "active" : "rest"],
      )}
    >
      {children}
    </span>
  );
}
