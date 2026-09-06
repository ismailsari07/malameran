import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { REQUEST_FORM } from "@/content/request-form";

const { sidebar } = REQUEST_FORM;

/**
 * The "What happens next" panel beside the form. A server component — it holds
 * no state and never changes with the step.
 *
 * Desktop shows a numbered timeline whose nodes are joined by a hairline;
 * mobile collapses it to the artboard's single summary line above the form.
 */
export function RequestSidebar() {
  return (
    <Card
      tone="sidebar"
      pad="20"
      padLg="32-30-34"
      radius={18}
      radiusLg={24}
      className="lg:sticky lg:top-6"
    >
      <Eyebrow tone="dark" size="card">
        {sidebar.eyebrow}
      </Eyebrow>

      {/* Mobile: one line, per the 375 artboard. */}
      <p className="t-fineprint mt-3 text-white/80 lg:hidden">
        {sidebar.mobileSummary}
      </p>

      {/* Desktop: the numbered timeline. */}
      <ol className="mt-6 hidden lg:block">
        {sidebar.steps.map((text, index) => {
          const last = index === sidebar.steps.length - 1;
          return (
            <li key={text} className="flex gap-4">
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={
                    last
                      ? "rounded-pill t-step-pill border-accent text-accent flex size-[26px] items-center justify-center border bg-(--accent-node-active)"
                      : "rounded-pill t-step-pill flex size-[26px] items-center justify-center border border-white/22 text-white"
                  }
                >
                  {index + 1}
                </span>
                {last ? null : <span className="w-px flex-1 bg-white/16" />}
              </div>
              <p
                className={`t-card-note text-white/80 ${last ? "" : "pb-5.5"}`}
              >
                {text}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Source is white/0.14; folded to the shared dark rule at 0.12, as in 4a. */}
      <Rule tone="dark" className="mt-3.5 lg:mt-7" />
      <p className="t-node-body pt-3.5 text-white/60 lg:hidden">
        {sidebar.footnote}
      </p>
      <p className="t-fineprint hidden pt-5.5 text-white/62 lg:block">
        {sidebar.footnote}
      </p>
    </Card>
  );
}
