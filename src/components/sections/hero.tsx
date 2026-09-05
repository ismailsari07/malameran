import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { HOME } from "@/content/home";

import { HeroDiagram } from "./hero-diagram";

const { hero } = HOME;

/**
 * Home hero. `1fr 480px` gap 80 from lg, single column below, where the
 * diagram drops beneath the reassurance line.
 */
export function Hero() {
  return (
    <Section ground="hero-home" rhythm="home-hero" divider>
      <div className="grid gap-10 lg:grid-cols-[1fr_480px] lg:gap-20">
        <div>
          <Eyebrow tone="dark" className="mb-5 lg:mb-7">
            {hero.eyebrow}
          </Eyebrow>
          <h1 className="t-h1-hero text-white">{hero.heading}</h1>
          <p className="t-lead mt-6 max-w-[560px] text-white/74 lg:mt-8">
            {hero.lead}
          </p>

          <div className="mt-8 lg:mt-11 lg:flex lg:items-center lg:gap-8">
            <Button
              href={hero.primaryCta.href}
              block
              className="lg:inline-flex lg:w-auto"
            >
              {hero.primaryCta.label}
            </Button>
            <Button
              href={hero.secondaryCta.href}
              variant="link"
              block
              className="mt-5 lg:mt-0 lg:inline-flex lg:w-auto"
            >
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p className="t-fineprint mt-8 max-w-[520px] border-t border-white/14 pt-5 text-white/56 lg:mt-12 lg:pt-5.5">
            {hero.reassurance}
          </p>
        </div>

        <div className="mt-10 lg:mt-0">
          <HeroDiagram />
        </div>
      </div>
    </Section>
  );
}
