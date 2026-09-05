import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { ABOUT } from "@/content/about";

import { SectionHead } from "./section-head";

const { rules } = ABOUT;

/** Four rule cards, `repeat(2,1fr)` gap 20. */
export function OperatingRules() {
  return (
    <Section ground="soft">
      <SectionHead
        tone="dark"
        eyebrow={rules.eyebrow}
        heading={rules.heading}
        headingClassName="mb-7 max-w-[760px] lg:mb-13"
      />
      <ul className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        {rules.cards.map((card) => (
          <Card
            key={card.heading}
            as="li"
            tone="dark"
            pad="22"
            padLg="34-32-38"
            radius={20}
            radiusLg={22}
          >
            <h3 className="t-h3-card-lg mb-2.5 text-white lg:mb-3">
              {card.heading}
            </h3>
            <p className="t-body-lg text-white/68">{card.body}</p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
