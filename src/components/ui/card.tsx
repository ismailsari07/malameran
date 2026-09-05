import { cn } from "@/lib/cn";

import { Eyebrow } from "./eyebrow";

/**
 * The four card treatments in docs/design.md "Cards".
 *
 * `pad` is required and typed to the exact set of paddings the artboards use,
 * so a page picks its own value and nothing else compiles. The source does not
 * have one card padding — it has eight.
 */

const TONES = {
  /** On paper: transparent over --paper, 1px #E4E3DF. */
  paper: "border border-border-card",
  /** On dark: a 3.5% white fill inside a 12% white border. */
  dark: "border border-white/12 bg-white/[3.5%]",
  /** Buyer-owned: accent-tinted fill, accent border, carries the "You" pill. */
  emphasis: "border border-accent bg-(--accent-card-fill)",
  /** The closing "action" cell in a grid: no fill, a 22% white border. */
  statement: "border border-white/22",
} as const;

const PADDING = {
  "22": "p-5.5",
  "24-22-26": "px-5.5 pt-6 pb-6.5",
  "26-24-28": "px-6 pt-6.5 pb-7",
  "30-28-32": "px-7 pt-7.5 pb-8",
  "30-30-34": "px-7.5 pt-7.5 pb-8.5",
  "32-32-36": "p-8 pb-9",
  "34-32-38": "px-8 pt-8.5 pb-9.5",
  "36-34-40": "px-8.5 pt-9 pb-10",
} as const;

const RADIUS = {
  18: "rounded-18",
  20: "rounded-20",
  22: "rounded-22",
  24: "rounded-24",
};

export function Card({
  tone = "paper",
  pad,
  radius = 22,
  children,
  className,
  as: Tag = "div",
}: {
  tone?: keyof typeof TONES;
  pad: keyof typeof PADDING;
  radius?: keyof typeof RADIUS;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag className={cn(TONES[tone], PADDING[pad], RADIUS[radius], className)}>
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
