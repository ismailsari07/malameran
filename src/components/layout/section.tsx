import { cn } from "@/lib/cn";
import { Container } from "./container";

/**
 * A page band: a ground plus vertical rhythm.
 *
 * Ground and rhythm are props rather than className overrides so a section
 * cannot be given a background or a padding that is not in the design.
 * Values: docs/design.md "Vertical rhythm" and "Grounds".
 */

const GROUNDS = {
  "hero-home": "ground-hero-home",
  hero: "ground-hero",
  "hero-form": "ground-hero-form",
  soft: "ground-soft",
  quiet: "ground-quiet",
  "quiet-form": "ground-quiet-form",
  strong: "ground-strong",
  paper: "bg-paper",
} as const;

/**
 * Mobile values are the 375px artboard's; the desktop step lands at `lg`,
 * matching the typography roles. The source has no intermediate artboard.
 */
const RHYTHMS = {
  /** Standard section: 64px mobile, 112px 0 120px desktop */
  standard: "py-16 lg:pt-28 lg:pb-30",
  /** Inner-page hero: 52px 0 60px mobile, 96px 0 112px desktop */
  "page-hero": "pt-13 pb-15 lg:pt-24 lg:pb-28",
  /** Home hero: 52px 0 60px mobile, 104px 0 120px desktop */
  "home-hero": "pt-13 pb-15 lg:pt-26 lg:pb-30",
  /**
   * Compact hero (Contact): 88px 0 72px desktop. Mobile borrows the hero's
   * 52/60 — the Contact page has no 375px artboard.
   */
  "compact-hero": "pt-13 pb-15 lg:pt-22 lg:pb-18",
  /** Final CTA band: 80px 0 88px mobile, 128px 0 140px desktop */
  cta: "pt-20 pb-22 lg:pt-32 lg:pb-35",
  /**
   * Supplier-page CTA band: 112px 0 124px desktop. Mobile borrows the standard
   * CTA band's 80/88.
   */
  "cta-supplier": "pt-20 pb-22 lg:pt-28 lg:pb-31",
  /**
   * Success page: 96px 0 104px desktop. No mobile artboard exists for the
   * success pages, so the mobile step borrows the hero's 52/60.
   */
  success: "pt-13 pb-15 lg:pt-24 lg:pb-26",
  /** App form body: 36px 0 56px mobile, 72px 0 104px desktop */
  "form-body": "pt-9 pb-14 lg:pt-18 lg:pb-26",
  /** No vertical padding — the child owns its own rhythm. */
  none: "",
} as const;

export type SectionGround = keyof typeof GROUNDS;
export type SectionRhythm = keyof typeof RHYTHMS;

export function Section({
  ground,
  rhythm = "standard",
  divider = false,
  children,
  className,
  id,
  as: Tag = "section",
}: {
  ground: SectionGround;
  rhythm?: SectionRhythm;
  /** Closes the band with the source's full-bleed 10% white hairline. */
  divider?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "header" | "footer";
}) {
  return (
    <Tag
      id={id}
      className={cn(GROUNDS[ground], divider && "border-b border-white/10")}
    >
      <Container className={cn(RHYTHMS[rhythm], className)}>
        {children}
      </Container>
    </Tag>
  );
}
