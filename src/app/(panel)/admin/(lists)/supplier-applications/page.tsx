import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { ListFilter } from "@/components/panel/list-filter";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StageBadge } from "@/components/panel/stage-badge";
import { MOCK_SUPPLIERS } from "@/content/mock/suppliers";
import { ADMIN_LIST, PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["admin/supplier-applications"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/admin/supplier-applications",
});

/**
 * Manufacturers who applied through the public form. Read-only.
 *
 * The status is displayed and cannot be changed from here: whether an
 * application carries a status at all is still an open decision, and every
 * value renders in the same neutral badge so no outcome is implied by colour.
 */
export default function AdminSupplierApplicationsPage() {
  const rows = MOCK_SUPPLIERS.map((supplier) => ({
    key: supplier.id,
    search: [
      supplier.company,
      supplier.reference,
      supplier.country,
      ...supplier.categories,
    ]
      .join(" ")
      .toLowerCase(),
    node: (
      <DataRow
        key={supplier.id}
        href={`/admin/supplier-applications/${supplier.id}`}
        title={supplier.company}
        subtitle={supplier.reference}
        columns="2-1-1-1"
        cells={[
          { label: ADMIN_LIST.columns.country, value: supplier.country },
          { label: ADMIN_LIST.columns.received, value: supplier.receivedOn },
          {
            label: ADMIN_LIST.columns.status,
            value: <StageBadge>{supplier.status}</StageBadge>,
          },
        ]}
      />
    ),
  }));

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
