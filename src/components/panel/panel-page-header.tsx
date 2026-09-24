import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * The panel's page-title pattern — its counterpart to `PageHero`.
 *
 * AUTHORED: see "Panel shell" in docs/design.md. The title is `t-h2-form-card`
 * (30px) and stays flat at both widths, because 30px is already the source's
 * mobile panel heading and so needs no mobile step — the same position
 * `t-h2-cta-page` is in.
 *
 * The action slot sits beside the title from `lg` and under it below, which is
 * the stacking rule every two-column region on the site follows.
 */
export function PanelPageHeader({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 lg:mb-8">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div>
          {eyebrow ? (
            <Eyebrow size="card" tone="muted-paper" className="mb-2.5">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <h1 className="t-h2-form-card text-ink">{title}</h1>
          {lead ? (
            <p className="t-body-sm text-text-body-alt mt-3 max-w-[620px]">
              {lead}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="mt-6 lg:mt-0 lg:shrink-0">{action}</div>
        ) : null}
      </div>
    </header>
  );
}
