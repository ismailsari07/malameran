import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { INDUSTRIES } from "@/content/industries";

const { notListed } = INDUSTRIES;

/** The centred closing statement on Industries, capped at 800px. */
export function NotListed() {
  return (
    <Section ground="soft">
      <div className="mx-auto max-w-[800px] text-center">
        <Eyebrow tone="dark" className="mb-4 lg:mb-5.5">
          {notListed.eyebrow}
        </Eyebrow>
        <h2 className="t-h2-statement text-white">{notListed.heading}</h2>
        <p className="t-panel-body mx-auto mt-4.5 max-w-[620px] text-white/68 lg:mt-5.5">
          {notListed.body}
        </p>
      </div>
    </Section>
  );
}
