import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { NOT_FOUND } from "@/content/not-found";

/**
 * The 404 page. Rendered inside the root layout, so it keeps the site header
 * and footer.
 *
 * Composed inline rather than through PageHero: it needs a call to action,
 * and a `cta` prop used by exactly one page is worse than four lines here.
 * Next does not support a metadata export from the root not-found, so the
 * title falls back to the layout default.
 */
export default function NotFound() {
  return (
    <main>
      <Section ground="hero" rhythm="page-hero">
        <Eyebrow tone="dark" className="mb-5 lg:mb-6.5">
          {NOT_FOUND.eyebrow}
        </Eyebrow>
        <h1 className="t-h1-page text-white">{NOT_FOUND.heading}</h1>
        <p className="t-lead mt-6 max-w-[560px] text-white/74 lg:mt-7">
          {NOT_FOUND.lead}
        </p>
        <div className="mt-8 lg:mt-10">
          <Button
            href={NOT_FOUND.cta.href}
            block
            className="lg:inline-flex lg:w-auto"
          >
            {NOT_FOUND.cta.label}
          </Button>
        </div>
      </Section>
    </main>
  );
}
