import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { HOW_IT_WORKS } from "@/content/how-it-works";

import { SectionHead } from "./section-head";

const { commitments } = HOW_IT_WORKS;

/** Three commitment cards, `repeat(3,1fr)` gap 20. */
export function Commitments() {
  return (
    <Section ground="soft">
      <SectionHead
        tone="dark"
        eyebrow={commitments.eyebrow}
        heading={commitments.heading}
        headingClassName="mb-7 max-w-[820px] lg:mb-13"
      />
      <ul className="grid gap-3 lg:grid-cols-3 lg:gap-5">
        {commitments.cards.map((card) => (
          <Card
            key={card.heading}
            as="li"
            tone="dark"
            pad="22"
            padLg="30-28-32"
            radius={18}
            radiusLg={20}
          >
            <h3 className="t-h3-card mb-2 text-white lg:mb-3">
              {card.heading}
            </h3>
            <p className="t-body-sm text-white/66">{card.body}</p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
