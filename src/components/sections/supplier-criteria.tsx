import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Rule } from "@/components/ui/rule";
import { FOR_SUPPLIERS } from "@/content/for-suppliers";

import { SectionHead } from "./section-head";

const { criteria, process } = FOR_SUPPLIERS;

/**
 * Four criteria cards `repeat(2,1fr)` gap 20, then the three-step process row
 * below a full-width rule. One section on the artboard, so one here.
 *
 * Authored below lg: both grids go to one column and the criteria numeral
 * moves above its heading, as Home's trust cards do.
 */
export function SupplierCriteria() {
  return (
    <Section ground="paper">
      <SectionHead
        tone="paper"
        eyebrow={criteria.eyebrow}
        heading={criteria.heading}
        headingClassName="mb-8 max-w-[820px] lg:mb-14"
      />

      <ul className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        {criteria.cards.map((card) => (
          <Card
            key={card.numeral}
            as="li"
            tone="paper"
            pad="22"
            padLg="34-32-38"
            radius={20}
            radiusLg={22}
            className="lg:flex lg:items-start lg:gap-6.5"
          >
            <span className="t-numeral-criteria block text-(--accent-numeral) lg:shrink-0">
              {card.numeral}
            </span>
            <div className="mt-4 lg:mt-0">
              <h3 className="t-h3-industry text-ink mb-2.5">{card.heading}</h3>
              <p className="t-body-lg text-text-body">{card.body}</p>
            </div>
          </Card>
        ))}
      </ul>

      <Rule tone="paper" className="mt-10 lg:mt-16" />
      <ol className="grid gap-6 pt-8 lg:grid-cols-3 lg:gap-5 lg:pt-12">
        {process.map((step) => (
          <li key={step.numeral}>
            <p className="t-numeral-row text-(--accent-numeral)">
              {step.numeral}
            </p>
            <h3 className="t-h3-process text-ink mt-4 mb-2.5 lg:mt-5">
              {step.heading}
            </h3>
            <p className="t-body-panel text-text-support">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
