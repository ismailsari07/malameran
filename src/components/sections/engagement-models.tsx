import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { SERVICES } from "@/content/services";

import { SectionHead } from "./section-head";

const { engagement } = SERVICES;

/**
 * Three engagement models, `repeat(3,1fr)` gap 20. The first is accent-tinted
 * with the 45% border mix rather than a full accent border.
 */
export function EngagementModels() {
  return (
    <Section ground="soft">
      <SectionHead
        tone="dark"
        eyebrow={engagement.eyebrow}
        heading={engagement.heading}
        headingClassName="mb-7 max-w-[760px] lg:mb-13"
      />
      <ul className="grid gap-3 lg:grid-cols-3 lg:gap-5">
        {engagement.models.map((model) => (
          <Card
            key={model.heading}
            as="li"
            tone={model.featured ? "emphasis-soft" : "dark"}
            pad="22"
            padLg="32-30-36"
            radius={20}
            radiusLg={22}
            className="flex flex-col"
          >
            <Eyebrow
              tone={model.featured ? "dark" : "dark-40"}
              size="xs"
              className="mb-4"
            >
              {model.tag}
            </Eyebrow>
            <h3 className="t-h3-card-lg mb-3 text-white">{model.heading}</h3>
            <p className="t-body-panel mb-5 text-white/72">{model.body}</p>
            {/* Source is white/0.14; folded to the shared dark rule at 0.12. */}
            <Rule tone="dark" className="mt-auto" />
            <p className="t-fineprint pt-5 text-white/60">{model.fee}</p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
