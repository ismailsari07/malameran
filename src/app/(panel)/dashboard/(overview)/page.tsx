import type { Metadata } from "next";

import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { ProjectRow } from "@/components/panel/project-row";
import { MOCK_PROJECTS } from "@/content/mock/projects";
import { PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["dashboard/projects"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/dashboard",
});

/**
 * The client's project list.
 *
 * Rendered against `src/content/mock/projects.ts` — block 2 is UI only, so
 * there is no query, no session and no filtering by owner here. When the real
 * query lands it replaces the import and nothing else on this screen.
 *
 * The empty state stays wired rather than deleted: it is the screen a new
 * client sees, and emptying the fixture array is how it is checked.
 */
export default function CustomerProjectsPage() {
  return (
    <>
      <PanelPageHeader
        eyebrow={screen.eyebrow}
        title={screen.title}
        lead={screen.lead}
      />

      {MOCK_PROJECTS.length === 0 ? (
        <PanelEmptyState
          heading={screen.empty.heading}
          body={screen.empty.body}
          action={screen.empty.action}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {MOCK_PROJECTS.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </ul>
      )}
    </>
  );
}
