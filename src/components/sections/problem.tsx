import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { HOME } from "@/content/home";

const { problem } = HOME;

/**
 * `1fr 520px` gap 96 from lg: heading left, prose right. Single column below.
 *
 * The artboard's optional image slot is deliberately omitted — see
 * docs/decisions.md — and the prose column takes the space.
 */
export function Problem() {
  return (
    <Section ground="paper">
      <div className="grid gap-7 lg:grid-cols-[1fr_520px] lg:gap-24">
        <div>
          <Eyebrow tone="paper" className="mb-5 lg:mb-6.5">
            {problem.eyebrow}
          </Eyebrow>
          <h2 className="t-h2-section text-ink lg:max-w-[520px]">
            {problem.heading}
          </h2>
        </div>
        <div className="lg:pt-2">
          <p className="t-prose text-text-prose">{problem.paragraphs[0]}</p>
          <Rule tone="paper" className="my-6.5 lg:my-8" />
          <p className="t-prose text-text-prose">{problem.paragraphs[1]}</p>
        </div>
      </div>
    </Section>
  );
}
