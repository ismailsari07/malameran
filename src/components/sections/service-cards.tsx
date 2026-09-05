import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Rule } from "@/components/ui/rule";
import { SERVICES } from "@/content/services";

import { SectionHead } from "./section-head";

const { fullService } = SERVICES;

/**
 * Eight service cards, `repeat(2,1fr)` gap 20. The numeral sits beside the
 * heading on a shared baseline — not above it, which is Home's tile treatment
 * of the same eight subjects.
 */
export function ServiceCards() {
  return (
    <Section ground="paper">
      <SectionHead
        tone="paper"
        eyebrow={fullService.eyebrow}
        heading={fullService.heading}
        headingClassName="mb-8 max-w-[900px] lg:mb-14"
      />
      <ol className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        {fullService.cards.map((card) => (
          <Card
            key={card.numeral}
            as="li"
            tone="paper"
            pad="22"
            padLg="32-32-36"
            radius={20}
            radiusLg={22}
          >
            <div className="flex items-baseline gap-4.5">
              <span className="t-numeral-service text-(--accent-numeral)">
                {card.numeral}
              </span>
              <h3 className="t-h3-card-lg text-ink">{card.heading}</h3>
            </div>
            <p className="t-body-lg text-text-body mt-4.5">{card.body}</p>
            <Rule tone="card" className="mt-5" />
            <p className="t-fineprint text-muted pt-4">{card.deliverable}</p>
          </Card>
        ))}
      </ol>
    </Section>
  );
}
