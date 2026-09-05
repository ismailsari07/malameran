import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME } from "@/content/home";

const { suppliers } = HOME;

/** A single centred panel on the quiet ground, capped at 800px from lg. */
export function SuppliersPanel() {
  return (
    <Section ground="quiet">
      <Card
        tone="panel"
        pad="28-22-30"
        padLg="52-56-56"
        radius={24}
        radiusLg={28}
        className="mx-auto max-w-[800px] text-center"
      >
        <Eyebrow tone="dark-45" className="mb-4 lg:mb-5.5">
          {suppliers.eyebrow}
        </Eyebrow>
        <h2 className="t-h2-panel text-white">{suppliers.heading}</h2>
        <p className="t-panel-body mx-auto mt-4.5 mb-6.5 max-w-[620px] text-white/68 lg:mt-5.5 lg:mb-8.5">
          {suppliers.body}
        </p>
        <Button
          href={suppliers.cta.href}
          variant="ghost"
          block
          className="lg:inline-flex lg:w-auto"
        >
          {suppliers.cta.label}
        </Button>
      </Card>
    </Section>
  );
}
