import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { ListFilter } from "@/components/panel/list-filter";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { MOCK_COMPANIES } from "@/content/mock/companies";
import { MOCK_PROJECTS } from "@/content/mock/projects";
import { ADMIN_LIST, PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["admin/companies"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/admin/companies",
});

/**
 * The client CRM, read-only.
 *
 * `source` and `last contact` are displayed here and captured nowhere in the
 * product — the screen that collects them is an editable admin form in the
 * backend turn, which is recorded in docs/change-requests.md.
 */
export default function AdminCompaniesPage() {
  const rows = MOCK_COMPANIES.map((company) => {
    const projectCount = MOCK_PROJECTS.filter(
      (project) => project.companyId === company.id,
    ).length;
    return {
      key: company.id,
      search: [company.name, company.contact, company.country, company.sector]
        .join(" ")
        .toLowerCase(),
      node: (
        <DataRow
          key={company.id}
          href={`/admin/companies/${company.id}`}
          title={company.name}
          subtitle={company.contact}
          columns="2-1-1-1"
          cells={[
            { label: ADMIN_LIST.columns.source, value: company.source },
            {
              label: ADMIN_LIST.columns.lastContact,
              value: company.lastContact,
            },
            { label: ADMIN_LIST.columns.projects, value: projectCount },
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
