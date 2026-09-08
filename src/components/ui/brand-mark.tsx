import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * The logo mark. THE ONLY PLACE THE FILE PATH APPEARS.
 *
 * Swapping in the vector the client eventually supplies is a change to this
 * file and nothing else — `Wordmark` is the single component the site header,
 * the app header and the footer all consume, and it consumes this.
 *
 * Three known problems with the current file, accepted for stage A and recorded
 * in docs/decisions.md so the vector request can be specific:
 *
 * 1. It is opaque. No tRNS chunk, palette colour-type 3 — a solid #020917 tile,
 *    a cold near-black, sitting on the header's warm #1F1E23 and the footer's
 *    #151418. It reads as a bluer square patch, not a mark on the bar.
 * 2. It is a crop of malameran-emblem.png rather than a mark: the globe circle
 *    is clipped left, right and top, with a band of cut-off lettering along the
 *    bottom edge.
 * 3. Its strokes are about 3% of the image width, so at the 11-13px the
 *    wordmark uses they land on well under a pixel and average into a muddy
 *    brown. Legible at 2x, a smudge at 1x, properly legible only around 20px.
 *
 * Decorative by design: `alt=""`. The accessible name comes from the wordmark
 * text beside it, which is `sr-only` below lg rather than absent.
 */

/**
 * The LARGEST size the mark is ever rendered at — 36px, in the site header
 * below `lg`, where it stands alone. next/image builds its srcset from this,
 * not from the source's 320px, so declaring 320 made every page fetch a 384px
 * image for a slot a fortieth of that. At 24 it generates the small candidates
 * a 1x and a 2x display actually need.
 */
const RENDERED = 36;

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/malameran-mark.png"
      alt=""
      width={RENDERED}
      height={RENDERED}
      priority
      className={cn("border-paper rounded-12 shrink-0 border object-contain", className)}
    />
  );
}
