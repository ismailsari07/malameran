import { ADMIN_STAGES } from "@/content/panel";

import { StageBadge } from "./stage-badge";

/**
 * The admin's five-stage pipeline, as a wrapping row of badges.
 *
 * AUTHORED: see "Admin panel screens" in docs/design.md.
 *
 * DELIBERATELY NOT `StatusTracker`, and sharing no code with it. That component
 * is the CLIENT's eight-stage view of a project — a vertical timeline with
 * dates, on the client's own screen. This is the team's five-stage pipeline for
 * a request. Different stages, different audience, different screen; the two are
 * related only through docs/design.md, which holds the badge treatment both a
 * rail and a status use.
 *
 * Wrapping rather than scrolling: five short labels fit two rows at 375px, and a
 * horizontally scrolling strip would hide state on the screen where state is the
 * entire point.
 *
 * The stage set is PROVISIONAL — see ADMIN_STAGES.
 */
export function StageRail({ currentIndex }: { currentIndex: number }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {ADMIN_STAGES.map((stage, index) => (
        <li key={stage}>
          <StageBadge active={index === currentIndex}>
            {stage}
            {index === currentIndex ? (
              <span className="sr-only"> — current stage</span>
            ) : null}
          </StageBadge>
        </li>
      ))}
    </ol>
  );
}
