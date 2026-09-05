import { Fragment } from "react";

import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Marker } from "@/components/ui/marker";
import { Rule } from "@/components/ui/rule";

/**
 * Renders a legal document: the template notice, then numbered-free sections
 * separated by hairlines.
 *
 * The type is here rather than in src/types because only this component and
 * the two content files it consumes ever refer to it.
 */

export type LegalSection = {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  /** Rendered as Marker rows — the design ships no bullet glyph. */
  readonly bullets?: readonly string[];
};

export type LegalDoc = {
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly lead: string;
  };
  readonly lastUpdated: string;
  readonly sections: readonly LegalSection[];
};

/**
 * The visible disclosure that this text is a template. Deliberately the first
 * thing in the body, above the document itself.
 */
export function LegalNotice() {
  return (
    <Card tone="info" pad="16-18" radius={14} className="max-w-[720px]">
      <p className="t-body text-text-body-alt">
        <strong className="text-ink">
          This is template text, not legal advice.
        </strong>{" "}
        It has not been reviewed by a lawyer and is a placeholder pending
        review. Do not rely on it.
      </p>
    </Card>
  );
}

export function LegalBody({ doc }: { doc: LegalDoc }) {
  return (
    <Section ground="paper">
      <LegalNotice />

      <p className="t-fineprint text-muted mt-6 max-w-[720px]">
        {doc.lastUpdated}
      </p>

      <div className="mt-8 max-w-[720px] lg:mt-10">
        {doc.sections.map((section, i) => (
          <Fragment key={section.heading}>
            {i > 0 ? <Rule tone="paper" className="my-8 lg:my-10" /> : null}
            <section>
              <h2 className="t-h3-card-lg text-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="t-prose text-text-prose mt-4"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Marker size={9} className="mt-2.5" />
                      <span className="t-prose text-text-prose">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
