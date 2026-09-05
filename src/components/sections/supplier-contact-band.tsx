import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { FOR_SUPPLIERS } from "@/content/for-suppliers";

const { questions } = FOR_SUPPLIERS;

/**
 * For Suppliers' closing band. Not the shared FinalCtaBand: it uses the
 * cta-supplier rhythm, a 56px heading and a ghost mailto rather than a primary
 * link to /request.
 */
export function SupplierContactBand() {
  return (
    <Section ground="strong" rhythm="cta-supplier" className="text-center">
      <h2 className="t-h2-cta-supplier text-white">{questions.heading}</h2>
      <p className="t-panel-body mx-auto mt-5 max-w-[600px] text-white/72 lg:mt-6.5">
        {questions.body}
      </p>
      <div className="mt-7 lg:mt-9">
        <Button
          href={`mailto:${questions.email}`}
          variant="ghost"
          block
          className="lg:inline-flex lg:w-auto"
        >
          {questions.email}
        </Button>
      </div>
    </Section>
  );
}
