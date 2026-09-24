import { Fragment } from "react";

import { Rule } from "@/components/ui/rule";
import { PROJECT_DETAIL } from "@/content/panel";

/**
 * Label-and-value pairs on the panel's light surface.
 *
 * AUTHORED: see "Customer panel screens" in docs/design.md. It is the timeline
 * aside's `<dl>` — a row per pair, hairlines between — with the rule and the
 * text colours swapped for their light-surface counterparts.
 *
 * A row whose `value` is null renders the PENDING placeholder: the label, then
 * an em dash in the disabled grey. That is for the fields the business-model
 * question blocks — anything carrying a price, the supplier's identity, and who
 * the contract sits with. An empty string and a zero would both read as facts;
 * a dash that the block labels as pending does not. Nothing here decides a
 * price model or a supplier-visibility rule, and the geometry is the same
 * either way, so deciding it later fills these in without a redraw.
 */

export type DetailRow = {
  label: string;
  /** null renders the pending placeholder. */
  value: string | null;
};

export function DetailList({ rows }: { rows: readonly DetailRow[] }) {
  return (
    <dl>
      {rows.map((row, index) => (
        <Fragment key={row.label}>
          {index > 0 ? <Rule tone="form" /> : null}
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3.5">
            <dt className="t-body-sm text-muted">{row.label}</dt>
            {row.value === null ? (
              <dd
                className="t-body-sm text-disabled"
                aria-label="Not confirmed"
              >
                {PROJECT_DETAIL.pendingValue}
              </dd>
            ) : (
              <dd className="t-body-sm text-ink">{row.value}</dd>
            )}
          </div>
        </Fragment>
      ))}
    </dl>
  );
}
