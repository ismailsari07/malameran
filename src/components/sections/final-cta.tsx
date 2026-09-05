import { HOME } from "@/content/home";

import { FinalCtaBand } from "./final-cta-band";

const { finalCta } = HOME;

/** Home's closing band: the 76px heading, with a reassurance line. */
export function FinalCta() {
  return (
    <FinalCtaBand
      size="home"
      heading={finalCta.heading}
      body={finalCta.body}
      cta={finalCta.cta}
      reassurance={finalCta.reassurance}
    />
  );
}
