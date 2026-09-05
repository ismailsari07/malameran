import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { HOME } from "@/content/home";

const { finalCta } = HOME;

/** The closing band every marketing page ends on. */
export function FinalCta() {
  return (
    <Section ground="strong" rhythm="cta" className="text-center">
      <h2 className="t-h2-cta text-white">{finalCta.heading}</h2>
      <p className="t-lead mx-auto mt-5.5 max-w-[620px] text-white/74 lg:mt-7">
        {finalCta.body}
      </p>
      <div className="mt-7.5 lg:mt-10">
        <Button
          href={finalCta.cta.href}
          block
          className="lg:inline-flex lg:w-auto"
        >
          {finalCta.cta.label}
        </Button>
      </div>
      <p className="t-fineprint mx-auto mt-6.5 max-w-[520px] text-white/50 lg:mt-9">
        {finalCta.reassurance}
      </p>
    </Section>
  );
}
