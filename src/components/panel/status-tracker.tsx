import { PROJECT_STAGES, STAGE_STATE_LABELS } from "@/content/panel";
import { cn } from "@/lib/cn";

/**
 * The eight customer-facing stages of a project, vertically.
 *
 * AUTHORED: see "Customer panel screens" under "Authored, not in the source" in
 * docs/design.md. Its geometry is the request sidebar's numbered timeline — a
 * 26px node, a connector between consecutive nodes, 16px to the label — moved
 * onto the light surface. Its colours are the three-step form's own state
 * table, unchanged.
 *
 * The colour map below is deliberately RESTATED rather than imported from
 * `step-progress.tsx`. The two components share colours and no geometry: that
 * one is a horizontal bar track carrying validation-issue pills, this one is a
 * vertical connector carrying dates. `docs/design.md` holds the table both of
 * them are written from, so the table is the shared thing, not a module.
 *
 * STATE IS NEVER COLOUR ALONE. The current stage carries `aria-current`, and
 * every row states its own state in text for a screen reader. The design ships
 * no icon set, so there is no tick to use and none is invented.
 *
 * This is the CUSTOMER's view. The admin pipeline is a different component on a
 * different screen and is not built here.
 */

type StageState = "done" | "current" | "upcoming";

const NODE = {
  done: "bg-(--accent-step-complete) text-step-complete border-accent",
  current: "bg-accent text-on-accent border-accent",
  upcoming: "bg-surface text-text-small border-border-field",
} as const;

const LABEL = {
  done: "text-muted",
  current: "text-ink",
  upcoming: "text-muted",
} as const;

/** The connector runs accent through the completed stages, then goes idle. */
const CONNECTOR = {
  done: "bg-accent",
  current: "bg-accent",
  upcoming: "bg-track-idle",
} as const;

function stageState(index: number, current: number): StageState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

export function StatusTracker({
  currentIndex,
  updatedOn,
}: {
  /** Zero-based index into PROJECT_STAGES. */
  currentIndex: number;
  /** Shown under the current stage — the only date the fixtures carry. */
  updatedOn?: string;
}) {
  return (
    <ol>
      {PROJECT_STAGES.map((stage, index) => {
        const state = stageState(index, currentIndex);
        const last = index === PROJECT_STAGES.length - 1;
        return (
          <li key={stage} className="flex gap-4">
            <div className="flex shrink-0 flex-col items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-pill t-step-pill flex size-[26px] items-center justify-center border",
                  NODE[state],
                )}
              >
                {index + 1}
              </span>
              {last ? null : (
                <span
                  className={cn(
                    "w-px flex-1",
                    // The connector below a node belongs to the run that has
                    // been passed, so it takes the NEXT stage's state: idle as
                    // soon as the next stage is upcoming.
                    CONNECTOR[stageState(index + 1, currentIndex)],
                  )}
                />
              )}
            </div>
            <div className={last ? "" : "pb-5.5"}>
              <p
                className={cn("t-label", LABEL[state])}
                aria-current={state === "current" ? "step" : undefined}
              >
                {stage}
                <span className="sr-only"> — {STAGE_STATE_LABELS[state]}</span>
              </p>
              {state === "current" && updatedOn ? (
                <p className="t-fineprint-sm text-text-small mt-1">
                  {updatedOn}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
