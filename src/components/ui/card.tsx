import { cn } from "@/lib/cn";

import { Eyebrow } from "./eyebrow";

/**
 * The four card treatments in docs/design.md "Cards".
 *
 * `pad` and `radius` are typed to the exact sets the artboards use, so a page
 * picks its own value and nothing else compiles. The source does not have one
 * card padding — it has a dozen. `padLg` and `radiusLg` carry the desktop half
 * where it differs, which on the Home page is almost every card.
 */

const TONES = {
  /** On paper: transparent over --paper, 1px #E4E3DF. */
  paper: "border border-border-card",
  /** Info panel: the form pages' notice treatment, --line on --surface-info. */
  info: "border border-line bg-surface-info",
  /** The white form card on a paper page. */
  surface: "border border-line bg-surface",
  /** The dark sidebar card beside a form on a light page. */
  sidebar: "border border-border-dark-card bg-(--dark-quiet)",
  /** On dark: a 3.5% white fill inside a 12% white border. */
  dark: "border border-white/12 bg-white/[3.5%]",
  /** Buyer-owned: accent-tinted fill, accent border, carries the "You" pill. */
  emphasis: "border border-accent bg-(--accent-card-fill)",
  /** The closing "action" cell in a grid: no fill, a 22% white border. */
  statement: "border border-white/22",
  /** A large centred panel: no fill, a 14% white border. */
  panel: "border border-white/14",
  /** A filled aside on a dark ground: the same 14% border over a 3.5% fill. */
  "dark-panel": "border border-white/14 bg-white/[3.5%]",
  /** A form card: the faintest fill in the source, at 2%. */
  "dark-form": "border border-white/14 bg-white/2",
  /** A sidebar card beside a form, at 3%. */
  "dark-aside": "border border-white/14 bg-white/3",
  /** Accent-tinted, but bordered at the 45% mix rather than full accent. */
  "emphasis-soft":
    "border border-(--accent-tint-border) bg-(--accent-card-fill)",
} as const;

const PADDING = {
  "14-16": "px-4 py-3.5",
  "16-18": "px-4.5 py-4",
  "18": "p-4.5",
  "20": "p-5",
  "22": "p-5.5",
  "26": "p-6.5",
  "28": "p-7",
  "30": "p-7.5",
  "24-22-26": "px-5.5 pt-6 pb-6.5",
  "26-24-28": "px-6 pt-6.5 pb-7",
  "30-28-32": "px-7 pt-7.5 pb-8",
  "30-30-34": "px-7.5 pt-7.5 pb-8.5",
  "32-30-36": "px-7.5 pt-8 pb-9",
  "32-32-36": "p-8 pb-9",
  "34-32-38": "px-8 pt-8.5 pb-9.5",
  "36-34-40": "px-8.5 pt-9 pb-10",
  "28-22-30": "px-5.5 pt-7 pb-7.5",
  "18-20": "px-5 py-4.5",
  "32-30-34": "px-7.5 pt-8 pb-8.5",
  "36-40-40": "px-10 pt-9 pb-10",
  "44-44-48": "px-11 pt-11 pb-12",
  "52-56-56": "px-14 pt-13 pb-14",
} as const;

/** The `lg:` half of every padding above. */
const PADDING_LG = {
  "14-16": "lg:px-4 lg:py-3.5",
  "16-18": "lg:px-4.5 lg:py-4",
  "18": "lg:p-4.5",
  "20": "lg:p-5",
  "22": "lg:p-5.5",
  "26": "lg:p-6.5",
  "28": "lg:p-7",
  "30": "lg:p-7.5",
  "24-22-26": "lg:px-5.5 lg:pt-6 lg:pb-6.5",
  "26-24-28": "lg:px-6 lg:pt-6.5 lg:pb-7",
  "30-28-32": "lg:px-7 lg:pt-7.5 lg:pb-8",
  "30-30-34": "lg:px-7.5 lg:pt-7.5 lg:pb-8.5",
  "32-30-36": "lg:px-7.5 lg:pt-8 lg:pb-9",
  "32-32-36": "lg:p-8 lg:pb-9",
  "34-32-38": "lg:px-8 lg:pt-8.5 lg:pb-9.5",
  "36-34-40": "lg:px-8.5 lg:pt-9 lg:pb-10",
  "28-22-30": "lg:px-5.5 lg:pt-7 lg:pb-7.5",
  "18-20": "lg:px-5 lg:py-4.5",
  "32-30-34": "lg:px-7.5 lg:pt-8 lg:pb-8.5",
  "36-40-40": "lg:px-10 lg:pt-9 lg:pb-10",
  "44-44-48": "lg:px-11 lg:pt-11 lg:pb-12",
  "52-56-56": "lg:px-14 lg:pt-13 lg:pb-14",
} as const;

const RADIUS = {
  14: "rounded-14",
  16: "rounded-16",
  18: "rounded-18",
  20: "rounded-20",
  22: "rounded-22",
  24: "rounded-24",
  28: "rounded-28",
} as const;

/** The `lg:` half of every radius above. */
const RADIUS_LG = {
  14: "lg:rounded-14",
  16: "lg:rounded-16",
  18: "lg:rounded-18",
  20: "lg:rounded-20",
  22: "lg:rounded-22",
  24: "lg:rounded-24",
  28: "lg:rounded-28",
} as const;

export function Card({
  tone = "paper",
  pad,
  padLg,
  radius = 22,
  radiusLg,
  children,
  className,
  as: Tag = "div",
}: {
  tone?: keyof typeof TONES;
  /** The 375px artboard's padding. */
  pad: keyof typeof PADDING;
  /** The 1440px artboard's padding, when it differs. */
  padLg?: keyof typeof PADDING;
  /** The 375px artboard's radius. */
  radius?: keyof typeof RADIUS;
  /** The 1440px artboard's radius, when it differs. */
  radiusLg?: keyof typeof RADIUS;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        TONES[tone],
        PADDING[pad],
        padLg ? PADDING_LG[padLg] : "",
        RADIUS[radius],
        radiusLg ? RADIUS_LG[radiusLg] : "",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * The "You" pill that marks a buyer-owned step on an emphasised card.
 * 11px uppercase accent inside a pill border of accent mixed 60% with #101010.
 */
export function YouPill({ children = "You" }: { children?: React.ReactNode }) {
  return (
    <Eyebrow
      as="span"
      tone="dark"
      size="xs"
      className="rounded-pill border border-(--accent-pill-border) px-2.5 py-[5px]"
    >
      {children}
    </Eyebrow>
  );
}
