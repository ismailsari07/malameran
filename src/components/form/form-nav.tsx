"use client";

import { REQUEST_FORM } from "@/content/request-form";
import { Rule } from "@/components/ui/rule";
import { cn } from "@/lib/cn";

/**
 * The footer nav under the form card: Back on the left, then the step counter
 * and the advance button on the right.
 *
 * Back is present but inert on the first step, matching the artboard — it
 * greys rather than disappearing, so the row does not reflow between steps.
 *
 * On the last step the advance button is omitted: the artboard puts a
 * full-width "Send request" in the card body, and two submit affordances in one
 * view is worse than one.
 */
export function FormNav({
  current,
  total,
  onBack,
  onNext,
  nextLabel,
  disabled = false,
}: {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  /** null hides the advance button — the last step submits from the body. */
  nextLabel: string | null;
  disabled?: boolean;
}) {
  const firstStep = current === 0;

  return (
    <div className="mt-8 lg:mt-8.5">
      <Rule tone="form" />
      <div className="flex flex-col gap-3 pt-6.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={firstStep || disabled}
          className={cn(
            "t-btn-secondary rounded-12 border-line focus-visible:focus-outline order-2 border px-5.5 py-3.5 transition-colors lg:order-1",
            firstStep
              ? "text-disabled cursor-not-allowed"
              : "text-muted hover:border-border-hover",
          )}
        >
          {REQUEST_FORM.nav.back}
        </button>

        <div className="order-1 flex items-center justify-between gap-5 lg:order-2 lg:justify-end">
          <span className="t-legal text-text-small hidden lg:inline">
            {REQUEST_FORM.nav.counter(current + 1, total)}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={disabled}
            className="t-btn-step bg-accent text-on-accent rounded-12 focus-visible:focus-outline w-full px-7 py-[15px] transition-colors hover:bg-(--accent-hover) disabled:cursor-not-allowed lg:w-auto"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
