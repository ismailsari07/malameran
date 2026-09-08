import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME } from "@/content/home";

const { trust } = HOME;

/**
 * `repeat(2,1fr)` gap 20. The numeral sits beside the statement from lg and
 * above it below.
 *
 * The count is whatever `trust.reasons` holds — the grid was written for four
 * and now renders three, after the client retracted the "contract sits with us"
 * claim in September 2026. Nothing here depends on the number; a two-column
 * grid takes an odd count as 2 + 1.
 */
export function Trust() {
  return (
    <Section ground="paper">
      <Eyebrow tone="paper" className="mb-5 lg:mb-6.5">
        {trust.eyebrow}
      </Eyebrow>
      <h2 className="t-h2-section text-ink mb-7 lg:mb-14">{trust.heading}</h2>

      <ul className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        {trust.reasons.map((reason) => (
          <Card
            key={reason.numeral}
            as="li"
            tone="paper"
            pad="24-22-26"
            padLg="36-34-40"
            radius={20}
            radiusLg={22}
            className="lg:flex lg:items-start lg:gap-7"
          >
            <span className="t-numeral-trust block text-(--accent-numeral) lg:shrink-0">
              {reason.numeral}
            </span>
            <p className="t-statement text-ink mt-4 lg:mt-0">
              {reason.statement}
            </p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
