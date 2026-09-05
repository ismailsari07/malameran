import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME } from "@/content/home";

const { services } = HOME;

/** Eight numbered service tiles, `repeat(4,1fr)` gap 16. */
export function WhatWeHandle() {
  return (
    <Section ground="paper">
      <Eyebrow tone="paper" className="mb-5 lg:mb-6.5">
        {services.eyebrow}
      </Eyebrow>
      <h2 className="t-h2-section text-ink mb-8 max-w-[900px] lg:mb-14">
        {services.heading}
      </h2>

      <ol className="grid gap-3 lg:grid-cols-4 lg:gap-4">
        {services.tiles.map((tile) => (
          <Card
            key={tile.numeral}
            as="li"
            tone="paper"
            pad="22"
            padLg="26-24-28"
            radius={18}
            radiusLg={20}
            className="lg:min-h-[200px]"
          >
            <span className="t-numeral-tile block text-(--accent-numeral)">
              {tile.numeral}
            </span>
            <h3 className="t-h3-card-sm text-ink mt-3.5 mb-2 lg:mt-5 lg:mb-2.5">
              {tile.heading}
            </h3>
            <p className="t-body-sm text-text-support">{tile.body}</p>
          </Card>
        ))}
      </ol>
    </Section>
  );
}
