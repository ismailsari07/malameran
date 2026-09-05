import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import { cn } from "@/lib/cn";

const { steps } = HOW_IT_WORKS;

/**
 * Five numbered rows, `120px 1fr 1fr` gap 48 from lg with a hairline between
 * each. The numeral is accent on the two steps the buyer owns and the dimmed
 * grey on the three we own.
 *
 * Authored below lg: the numeral sits above the heading and the point list
 * below the copy.
 */
export function StepRows() {
  return (
    <Section ground="paper">
      <ol>
        {steps.map((step, i) => (
          <li key={step.numeral}>
            {i > 0 ? <Rule tone="paper" /> : null}
            <div
              className={cn(
                "grid gap-6 lg:grid-cols-[120px_1fr_1fr] lg:gap-12",
                i === 0 ? "pb-8 lg:pb-11" : "py-8 lg:py-11",
              )}
            >
              <p
                className={cn(
                  "t-numeral-row",
                  step.owner === "you"
                    ? "text-(--accent-numeral)"
                    : "text-numeral-idle",
                )}
              >
                {step.numeral}
              </p>

              <div>
                <Eyebrow
                  tone={step.owner === "you" ? "paper" : "muted-paper"}
                  size="xs"
                  className="mb-3"
                >
                  {step.ownerLabel}
                </Eyebrow>
                <h2 className="t-h2-step text-ink">{step.heading}</h2>
                <p className="t-prose-step text-text-body mt-4">{step.body}</p>
              </div>

              <ul className="flex flex-col gap-3 lg:pt-8.5">
                {step.points.map((point) => (
                  <Card
                    key={point}
                    as="li"
                    tone="paper"
                    pad="16-18"
                    radius={14}
                  >
                    <span className="t-body-sm text-text-support">{point}</span>
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
