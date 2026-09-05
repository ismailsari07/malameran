import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

/**
 * The inner-page hero: eyebrow, h1, lead.
 *
 * Single column on Services and Industries; How It Works passes an `aside`,
 * which becomes the 420px second column from lg and stacks below the lead
 * otherwise.
 */
export function PageHero({
  eyebrow,
  heading,
  lead,
  headingClassName,
  leadClassName,
  aside,
}: {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Layout only — the heading's measure cap. */
  headingClassName?: string;
  /** Layout only — the lead's measure cap. */
  leadClassName?: string;
  aside?: React.ReactNode;
}) {
  const copy = (
    <div>
      <Eyebrow tone="dark" className="mb-5 lg:mb-6.5">
        {eyebrow}
      </Eyebrow>
      <h1 className={cn("t-h1-page text-white", headingClassName)}>
        {heading}
      </h1>
      <p className={cn("t-lead mt-6 text-white/74 lg:mt-7", leadClassName)}>
        {lead}
      </p>
    </div>
  );

  return (
    <Section ground="hero" rhythm="page-hero">
      {aside ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end lg:gap-20">
          {copy}
          {aside}
        </div>
      ) : (
        copy
      )}
    </Section>
  );
}
