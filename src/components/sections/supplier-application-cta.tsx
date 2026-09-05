import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FOR_SUPPLIERS } from "@/content/for-suppliers";

const { application } = FOR_SUPPLIERS;

/**
 * The application band.
 *
 * The artboard carries an eleven-field dark form here. It was dropped — two
 * submission surfaces for one application is not what the scope describes — so
 * the band keeps its copy and sends the visitor to /suppliers/apply instead.
 * See docs/decisions.md.
 */
export function SupplierApplicationCta() {
  return (
    <Section ground="quiet">
      <div className="mx-auto max-w-[800px] text-center">
        <Eyebrow tone="dark" className="mb-4 lg:mb-5.5">
          {application.eyebrow}
        </Eyebrow>
        <h2 className="t-h2-statement text-white">{application.heading}</h2>
        <p className="t-panel-body mx-auto mt-4.5 max-w-[620px] text-white/68 lg:mt-5">
          {application.body}
        </p>
        <div className="mt-7 lg:mt-9">
          <Button
            href={application.cta.href}
            block
            className="lg:inline-flex lg:w-auto"
          >
            {application.cta.label}
          </Button>
        </div>
        <p className="t-fineprint-sm mx-auto mt-5 max-w-[620px] text-white/48">
          {application.reassurance}
        </p>
      </div>
    </Section>
  );
}
