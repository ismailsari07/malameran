import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card, YouPill } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Marker } from "@/components/ui/marker";
import { HOME } from "@/content/home";

const { howItWorks } = HOME;

/** Five numbered steps plus a closing statement cell, `repeat(3,1fr)` gap 20. */
export function HowItWorks() {
  return (
    <Section ground="soft">
      <Eyebrow tone="dark" className="mb-5 lg:mb-6.5">
        {howItWorks.eyebrow}
      </Eyebrow>
      <h2 className="t-h2-section mb-8 max-w-[760px] text-white lg:mb-15">
        {howItWorks.heading}
      </h2>

      <ol className="grid gap-3 lg:grid-cols-3 lg:gap-5">
        {howItWorks.steps.map((step) => (
          <Card
            key={step.numeral}
            as="li"
            tone={step.owner === "you" ? "emphasis" : "dark"}
            pad="22"
            padLg="30-30-34"
            radius={20}
            radiusLg={22}
            className="flex flex-col lg:min-h-[250px]"
          >
            <div className="flex items-center justify-between">
              <span className="t-numeral-step text-accent">{step.numeral}</span>
              {step.owner === "you" ? (
                <YouPill>{step.ownerLabel}</YouPill>
              ) : (
                <Eyebrow as="span" tone="dark-40" size="xs">
                  {step.ownerLabel}
                </Eyebrow>
              )}
            </div>
            <h3 className="t-h3-card mt-4 mb-2 text-white lg:mt-5.5 lg:mb-3">
              {step.heading}
            </h3>
            <p className="t-body-sm text-white/68">{step.body}</p>
          </Card>
        ))}

        <Card
          as="li"
          tone="statement"
          pad="22"
          padLg="30"
          radius={20}
          radiusLg={22}
          className="flex flex-col justify-between lg:min-h-[250px]"
        >
          <div>
            <div className="mb-3 flex items-center gap-2.5 lg:mb-3.5">
              <Marker />
              <Eyebrow as="span" tone="dark-60" size="xs">
                {howItWorks.touchpoints.label}
              </Eyebrow>
            </div>
            <p className="t-card-note text-white/72">
              {howItWorks.touchpoints.body}
            </p>
          </div>
          <div className="mt-5 flex flex-col lg:mt-0 lg:items-start lg:gap-4">
            <Button
              href={howItWorks.touchpoints.primaryCta.href}
              variant="primary-panel"
              block
              className="lg:inline-flex lg:w-auto lg:whitespace-nowrap"
            >
              {howItWorks.touchpoints.primaryCta.label}
            </Button>
            <Button
              href={howItWorks.touchpoints.secondaryCta.href}
              variant="link"
              block
              className="mt-4 lg:mt-0 lg:inline-flex lg:w-auto"
            >
              {howItWorks.touchpoints.secondaryCta.label}
            </Button>
          </div>
        </Card>
      </ol>
    </Section>
  );
}
