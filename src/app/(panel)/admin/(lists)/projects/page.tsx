import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { ListFilter } from "@/components/panel/list-filter";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { mockCompanyById } from "@/content/mock/companies";
import { MOCK_PROJECTS } from "@/content/mock/projects";
import { ADMIN_LIST, PANEL_SCREENS, PROJECT_STAGES } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["admin/projects"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/admin/projects",
});

/** Every project across all clients — the same records the client sees one of. */
export default function AdminProjectsPage() {
  const rows = MOCK_PROJECTS.map((project) => {
    const company = mockCompanyById(project.companyId);
    return {
      key: project.id,
      search: [project.name, project.reference, company?.name ?? ""]
        .join(" ")
        .toLowerCase(),
      node: (
        <DataRow
          key={project.id}
          href={`/admin/projects/${project.id}`}
          title={project.name}
          subtitle={project.reference}
          columns="2-1-1-1"
          cells={[
            { label: ADMIN_LIST.columns.company, value: company?.name ?? "—" },
            {
              label: ADMIN_LIST.columns.stage,
              value: PROJECT_STAGES[project.stageIndex],
            },
            { label: ADMIN_LIST.columns.updated, value: project.updatedOn },
          ]}
        />
      ),
    };
  });

  return (
    <>
      <PanelPageHeader
        eyebrow={screen.eyebrow}
        title={screen.title}
        lead={screen.lead}
      />
      {rows.length === 0 ? (
        <PanelEmptyState
          heading={screen.empty.heading}
          body={screen.empty.body}
        />
      ) : (
        <ListFilter rows={rows} />
      )}
    </>
  );
}
