import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

/**
 * The inner-page hero: eyebrow, h1, lead.
 *
 * Single column on most pages; How It Works passes an `aside`, which becomes
 * the 420px second column from lg and stacks below the lead otherwise.
 * Contact overrides all three of ground, rhythm and heading role.
 */

const HEADING = {
  /** 68px — About, Services, Industries, For Suppliers, How It Works. */
  page: "t-h1-page",
  /** 64px — Contact only. */
  contact: "t-h1-contact",
} as const;

export function PageHero({
  eyebrow,
  heading,
  lead,
  ground = "hero",
  rhythm = "page-hero",
  headingRole = "page",
  headingClassName,
  leadClassName,
  aside,
}: {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Contact sits on the no-fade 13% ground; every other page on the 14%. */
  ground?: "hero" | "hero-form";
  rhythm?: "page-hero" | "compact-hero";
  headingRole?: keyof typeof HEADING;
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
      <h1 className={cn(HEADING[headingRole], "text-white", headingClassName)}>
        {heading}
      </h1>
      <p className={cn("t-lead mt-6 text-white/74 lg:mt-7", leadClassName)}>
        {lead}
      </p>
    </div>
  );

  return (
    <Section ground={ground} rhythm={rhythm}>
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
