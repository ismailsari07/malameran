import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Marker } from "@/components/ui/marker";
import { Rule } from "@/components/ui/rule";
import { HOME } from "@/content/home";

const { industries } = HOME;

/**
 * Six sector cards, `repeat(3,1fr)` gap 16 — narrower than the gap 20 the
 * Industries page uses for the same card, per the Home artboard.
 */
export function Industries() {
  return (
    <Section ground="soft">
      <Eyebrow tone="dark" className="mb-5 lg:mb-6.5">
        {industries.eyebrow}
      </Eyebrow>
      <h2 className="t-h2-section mb-7 text-white lg:mb-13">
        {industries.heading}
      </h2>

      <ul className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        {industries.cards.map((card) => (
          <Card
            key={card.heading}
            as="li"
            tone="dark"
            pad="22"
            padLg="30-28-32"
            radius={18}
            radiusLg={20}
            className="lg:min-h-[172px]"
          >
            <h3 className="t-h3-industry mb-2 text-white lg:mb-3">
              {card.heading}
            </h3>
            <p className="t-body-sm text-white/66">{card.body}</p>
          </Card>
        ))}
      </ul>

      <Rule tone="dark" className="mt-7 lg:mt-10" />
      <div className="flex items-start gap-3 pt-5.5 lg:items-center lg:gap-3.5 lg:pt-7">
        <Marker size={9} sizeLg={10} className="mt-[7px] lg:mt-0" />
        <p className="t-marker-line text-white/74">{industries.closing}</p>
      </div>
    </Section>
  );
}
