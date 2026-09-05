import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * The brand mark: an accent square beside MALAMERAN.
 *
 * Two sizes, each a responsive pair read from the artboards —
 * `site` is an 11px square with 17px text on mobile and 13px/21px from `lg`;
 * `app` is 11px/17px and 12px/19px, used by the app header and the footer.
 */

const SQUARE = {
  site: "size-[11px] lg:size-[13px]",
  app: "size-[11px] lg:size-3",
} as const;

const TYPE = {
  site: "t-wordmark",
  app: "t-wordmark-md",
} as const;

export function Wordmark({
  size = "site",
  href = "/",
  className,
}: {
  size?: keyof typeof SQUARE;
  /** `null` renders static text rather than a link. */
  href?: string | null;
  className?: string;
}) {
  const layout = cn("flex items-center gap-2.5 lg:gap-3", className);
  const inner = (
    <>
      <span
        className={cn("bg-accent shrink-0", SQUARE[size])}
        aria-hidden="true"
      />
      <span className={cn(TYPE[size], "text-white")}>MALAMERAN</span>
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
