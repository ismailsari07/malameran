import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { INDUSTRIES } from "@/content/industries";
import { cn } from "@/lib/cn";

const { sectors } = INDUSTRIES;

/**
 * Six sector rows, `1fr 1fr` gap 72 from lg with a hairline between each.
 *
 * Authored below lg: the row stacks, and the chip grid stays two columns —
 * the chips are short enough that one column would leave the row very tall.
 */
export function SectorRows() {
  return (
    <Section ground="paper">
      <ol>
        {sectors.map((sector, i) => (
          <li key={sector.numeral}>
            {i > 0 ? <Rule tone="paper" /> : null}
            <div
              className={cn(
                "grid gap-6 lg:grid-cols-2 lg:gap-18",
                i === 0 ? "pb-8 lg:pb-12" : "py-8 lg:py-12",
              )}
            >
              <div>
                <Eyebrow tone="paper" size="xs" className="mb-3.5">
                  {sector.numeral}
                </Eyebrow>
                <h2 className="t-h2-industry text-ink">{sector.heading}</h2>
                <p className="t-prose-step text-text-body mt-4.5">
                  {sector.body}
                </p>
              </div>

              <ul className="grid grid-cols-2 content-start gap-3 lg:pt-13">
                {sector.chips.map((chip) => (
                  <Card key={chip} as="li" tone="paper" pad="14-16" radius={14}>
                    <span className="t-body-sm text-text-support">{chip}</span>
                  </Card>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
