import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { ListFilter } from "@/components/panel/list-filter";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StageBadge } from "@/components/panel/stage-badge";
import { mockCompanyById } from "@/content/mock/companies";
import { MOCK_REQUESTS } from "@/content/mock/requests";
import { ADMIN_LIST, ADMIN_STAGES, PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["admin/requests"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/admin/requests",
});

/**
 * The intake queue: every request that has not become a project.
 *
 * Rows are built here, on the server, and handed to the filter island as nodes
 * — it decides which to show and nothing else.
 */
export default function AdminRequestsPage() {
  const rows = MOCK_REQUESTS.map((request) => {
    const company = mockCompanyById(request.companyId);
    return {
      key: request.id,
      search: [request.summary, request.reference, company?.name ?? ""]
        .join(" ")
        .toLowerCase(),
      node: (
        <DataRow
          key={request.id}
          href={`/admin/requests/${request.id}`}
          title={request.summary}
          subtitle={request.reference}
          columns="2-1-1"
          cells={[
            {
              label: ADMIN_LIST.columns.company,
              value: company?.name ?? "—",
            },
            {
              label: ADMIN_LIST.columns.stage,
              value: (
                <StageBadge>{ADMIN_STAGES[request.stageIndex]}</StageBadge>
              ),
            },
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
