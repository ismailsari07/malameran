import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ABOUT } from "@/content/about";

const { company } = ABOUT;

/**
 * Four company facts, `repeat(4,1fr)` gap 16.
 *
 * The artboard gives this section an eyebrow and no heading, so it does not
 * use SectionHead.
 */
export function CompanyStats() {
  return (
    <Section ground="paper">
      <Eyebrow tone="paper" className="mb-5 lg:mb-6.5">
        {company.eyebrow}
      </Eyebrow>
      <ul className="grid gap-3 lg:grid-cols-4 lg:gap-4">
        {company.stats.map((stat) => (
          <Card
            key={stat.label}
            as="li"
            tone="paper"
            pad="22"
            padLg="30-28-32"
            radius={18}
            radiusLg={20}
          >
            <Eyebrow tone="muted-paper" size="xs" className="mb-3.5">
              {stat.label}
            </Eyebrow>
            <p className="t-h3-card-lg text-ink">{stat.value}</p>
            <p className="t-body-sm text-text-support mt-2.5">{stat.note}</p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
