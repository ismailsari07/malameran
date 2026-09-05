import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

/**
 * The eyebrow + h2 opener almost every section carries.
 *
 * `tone` sets both halves together, which is the pairing that drifts when this
 * is copied by hand: the eyebrow is accent on a dark ground and the 74% accent
 * mix on paper, and the heading is white or ink to match.
 */
export function SectionHead({
  eyebrow,
  heading,
  tone,
  className,
  headingClassName,
}: {
  eyebrow: string;
  heading: string;
  tone: "dark" | "paper";
  /** Layout only — margins. */
  className?: string;
  /** Layout only — the heading's measure cap and bottom margin. */
  headingClassName?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow tone={tone} className="mb-5 lg:mb-6.5">
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "t-h2-section",
          tone === "dark" ? "text-white" : "text-ink",
          headingClassName,
        )}
      >
        {heading}
      </h2>
    </div>
  );
}
