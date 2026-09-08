import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";
import { cn } from "@/lib/cn";

/**
 * The brand lockup: the logo mark beside MALAMERAN.
 *
 * Two sizes, each a responsive pair read from the artboards —
 * `site` is an 11px mark with 17px text on mobile and 13px/21px from `lg`;
 * `app` is 11px/17px and 12px/19px, used by the app header and the footer.
 *
 * The mark replaced the design's accent square in the header fix. The square
 * survives in `src/app/opengraph-image.tsx`, which is generated from the design
 * system rather than the brand assets and is correct as it stands.
 *
 * Below `lg` the site header hides the text and shows the mark alone, so the
 * text is `sr-only` rather than removed — a link whose only content is a
 * decorative image has no accessible name at all.
 */

/**
 * `site` is 24px on mobile, where the mark stands alone in a 64px bar and has
 * to be legible by itself, and the artboard's 13px from `lg`, where the
 * wordmark text carries the name.
 *
 * 24 and not 28: the file is a crop of the emblem, and past 24px the clipped
 * globe stops reading as texture and starts reading as a mistake. Measured at
 * 13/20/24/26/28/32 — see docs/design.md.
 */
const MARK = {
  site: "size-6 lg:size-[13px]",
  app: "size-[11px] lg:size-3",
} as const;

const TYPE = {
  site: "t-wordmark",
  app: "t-wordmark-md",
} as const;

export function Wordmark({
  size = "site",
  href = "/",
  hideTextBelowLg = false,
  className,
}: {
  size?: keyof typeof MARK;
  /** `null` renders static text rather than a link. */
  href?: string | null;
  /**
   * Mark only below `lg`, full lockup from `lg`. A prop rather than a
   * `className` override: the text's display is this component's business, and
   * a utility passed from outside would be fighting the one set here with only
   * the cascade to settle it.
   */
  hideTextBelowLg?: boolean;
  className?: string;
}) {
  const layout = cn("flex items-center gap-2.5 lg:gap-3", className);
  const inner = (
    <>
      <BrandMark className={MARK[size]} />
      <span
        className={cn(
          TYPE[size],
          "text-white",
          hideTextBelowLg && "sr-only lg:not-sr-only",
        )}
      >
        MALAMERAN
      </span>
    </>
  );

  if (href === null) {
    return <span className={layout}>{inner}</span>;
  }

  return (
    <Link href={href} className={cn(layout, "focus-visible:focus-outline")}>
      {inner}
    </Link>
  );
}
