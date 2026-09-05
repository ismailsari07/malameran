import { cn } from "@/lib/cn";

/**
 * The uppercase opener that sits above almost every section heading.
 *
 * Accent on dark grounds, `color-mix(accent 74%, #101010)` on paper, and two
 * deliberately muted variants. Source: docs/design.md "Section eyebrow".
 */

const TONES = {
  /** On any dark ground. */
  dark: "text-accent",
  /** On paper — the accent darkened so it does not vibrate against #F9F9F7. */
  paper: "text-(--accent-eyebrow-paper)",
  /** Muted on paper: column and group labels that are not the main opener. */
  "muted-paper": "text-text-eyebrow",
  /** Muted on dark: footer column headings and faint labels. */
  "muted-dark": "text-white/38",
} as const;

const SIZES = {
  /** Section opener: 11px mobile, 12.5px desktop. */
  section: "t-eyebrow",
  /** Card and sidebar opener: 11px mobile, 11.5px desktop. */
  card: "t-eyebrow-sm",
  /** Flat 11px: footer headings, the "You" pill, the numbered step row. */
  xs: "t-eyebrow-xs",
} as const;

export function Eyebrow({
  tone = "dark",
  size = "section",
  children,
  className,
  as: Tag = "p",
}: {
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  children: React.ReactNode;
  className?: string;
  as?: "p" | "div" | "span" | "h2";
}) {
  return (
    <Tag className={cn(SIZES[size], TONES[tone], className)}>{children}</Tag>
  );
}
