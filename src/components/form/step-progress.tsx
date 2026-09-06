"use client";

import { REQUEST_FORM } from "@/content/request-form";
import { cn } from "@/lib/cn";

/**
 * The three-track step progress from docs/design.md.
 *
 * Desktop shows a track, a numeral pill and a label per step, with an issue
 * pill on any step carrying validation errors. Mobile collapses to three bars
 * plus the current step's name and a counter.
 */

export type StepState = "complete" | "current" | "upcoming";

const TRACK = {
  complete: "bg-accent",
  current: "bg-accent",
  upcoming: "bg-track-idle",
} as const;

const PILL = {
  complete: "bg-(--accent-step-complete) text-step-complete border-accent",
  current: "bg-accent text-on-accent border-accent",
  upcoming: "bg-surface text-text-small border-border-field",
} as const;

const LABEL = {
  complete: "text-muted",
  current: "text-ink",
  upcoming: "text-muted",
} as const;

export function stepStateFor(index: number, current: number): StepState {
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
}

export function StepProgress({
  current,
  issueCounts,
}: {
  /** Zero-based index of the active step. */
  current: number;
  /** Validation errors per step index; zero means none. */
  issueCounts: readonly number[];
}) {
  const steps = REQUEST_FORM.steps;

  return (
    <>
      {/* Desktop: a labelled track per step. */}
      <ol className="hidden gap-2.5 lg:flex">
        {steps.map((step, index) => {
          const state = stepStateFor(index, current);
          const issues = issueCounts[index] ?? 0;
          return (
            <li key={step.id} className="flex-1">
              <div className={cn("rounded-2 h-[3px]", TRACK[state])} />
              <div className="mt-3.5 flex items-center gap-2.5">
                <span
                  className={cn(
                    "rounded-pill t-step-pill flex size-[22px] items-center justify-center border",
                    PILL[state],
                  )}
                >
                  {index + 1}
                </span>
                <span className={cn("t-label", LABEL[state])}>
                  {step.label}
                </span>
                {issues > 0 ? (
                  <span className="t-step-pill text-err border-err-border bg-err-bg rounded-pill border px-2 py-0.5">
                    <span aria-hidden="true">! </span>
                    {REQUEST_FORM.nav.issue(issues)}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile: three bars, the current step's name and a counter. */}
      <div className="lg:hidden">
        <ol className="flex gap-1.5">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                "rounded-2 h-[3px] flex-1",
                TRACK[stepStateFor(index, current)],
              )}
            />
          ))}
        </ol>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="t-step-name text-ink">{steps[current]?.label}</span>
          <span className="t-legal text-text-small">
            {REQUEST_FORM.nav.counter(current + 1, steps.length)}
          </span>
        </div>
      </div>
    </>
  );
}
