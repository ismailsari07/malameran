import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { HOW_IT_WORKS } from "@/content/how-it-works";

const { timeline } = HOW_IT_WORKS;

/** The "Typical timeline" card beside the How It Works hero. */
export function TimelineAside() {
  return (
    <Card tone="dark-panel" pad="22" padLg="28" radius={20} radiusLg={22}>
      <Eyebrow tone="dark-45" size="card" className="mb-4 lg:mb-4.5">
        {timeline.eyebrow}
      </Eyebrow>
      {/* A <dl> may hold divs; each row is one, and the rules are siblings. */}
      <dl className="flex flex-col gap-3.5">
        {timeline.rows.map((row, i) => (
          <Fragment key={row.label}>
            {i > 0 ? <Rule tone="dark" /> : null}
            <div className="flex justify-between gap-4">
              <dt className="t-body-sm text-white/72">{row.label}</dt>
              <dd className="t-stat-value text-white">{row.value}</dd>
            </div>
          </Fragment>
        ))}
      </dl>
      <Rule tone="dark" className="mt-5" />
      <p className="t-fineprint-sm pt-4 text-white/50">{timeline.footnote}</p>
    </Card>
  );
}
