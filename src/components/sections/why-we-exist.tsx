import { Fragment } from "react";

import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { ABOUT } from "@/content/about";

const { whyWeExist } = ABOUT;

/**
 * `1fr 520px` gap 96: heading left, three paragraphs right.
 *
 * The same grid as Home's "the problem", but a different heading role and
 * three paragraphs against two, so the two are kept separate.
 *
 * The artboard's optional image slot is omitted — see docs/decisions.md — and
 * the prose column takes the space.
 */
export function WhyWeExist() {
  return (
    <Section ground="paper">
      <div className="grid gap-7 lg:grid-cols-[1fr_520px] lg:gap-24">
        <div>
          <Eyebrow tone="paper" className="mb-5 lg:mb-6.5">
            {whyWeExist.eyebrow}
          </Eyebrow>
          <h2 className="t-h2-why text-ink lg:max-w-[520px]">
            {whyWeExist.heading}
          </h2>
        </div>
        <div className="lg:pt-2">
          {whyWeExist.paragraphs.map((paragraph, i) => (
            <Fragment key={paragraph.slice(0, 32)}>
              {i > 0 ? <Rule tone="paper" className="my-6.5 lg:my-8" /> : null}
              <p className="t-prose text-text-prose">{paragraph}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
}
