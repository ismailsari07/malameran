import { cn } from "@/lib/cn";

/**
 * A hairline divider.
 *
 * Always a 1px-tall filled element, never a border on the element it separates
 * — that is how the source draws every rule. Source: docs/design.md
 * "Rules and dividers".
 */

const TONES = {
  /** Between prose blocks on paper. */
  paper: "bg-rule",
  /** Inside a card on paper. */
  card: "bg-border-card",
  /** On the app form pages. */
  form: "bg-line",
  /** On any dark ground. */
  dark: "bg-white/12",
  /** Fainter dark: header and footer edges. */
  "dark-faint": "bg-white/9",
  /** Inside a success card. */
  success: "bg-track",
} as const;

export function Rule({
  tone = "paper",
  className,
}: {
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      className={cn("h-px w-full", TONES[tone], className)}
    />
  );
}
