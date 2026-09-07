import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * The closing band every marketing page ends on.
 *
 * Home's heading is 76px (`t-h2-cta`); the inner pages' is 72px
 * (`t-h2-cta-page`). Body and reassurance are optional — Industries has
 * neither, the other inner pages have a body but no reassurance.
 */
export function FinalCtaBand({
  heading,
  body,
  cta,
  reassurance,
  size = "page",
}: {
  heading: string;
  body?: string;
  cta: { label: string; href: string };
  reassurance?: string;
  /** `home` is the 76px heading; `page` the 72px one every inner page uses. */
  size?: "home" | "page";
}) {
  return (
    <Section ground="strong" rhythm="cta" className="text-center">
      <h2
        className={cn(
          size === "home" ? "t-h2-cta" : "t-h2-cta-page",
          "text-white",
        )}
      >
        {heading}
      </h2>
      {body ? (
        <p className="t-lead mx-auto mt-5.5 max-w-[620px] text-white/74 lg:mt-7">
          {body}
        </p>
      ) : null}
      <div className="mt-7.5 lg:mt-10">
        <Button href={cta.href} block="below-lg">
          {cta.label}
        </Button>
      </div>
      {reassurance ? (
        <p className="t-fineprint mx-auto mt-6.5 max-w-[520px] text-white/50 lg:mt-9">
          {reassurance}
        </p>
      ) : null}
    </Section>
  );
}
