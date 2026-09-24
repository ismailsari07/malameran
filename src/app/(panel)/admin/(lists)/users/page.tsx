import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { ListFilter } from "@/components/panel/list-filter";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { mockCompanyById } from "@/content/mock/companies";
import { MOCK_USERS } from "@/content/mock/users";
import { ADMIN_LIST, PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["admin/users"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/admin/users",
});

/** Everyone with an account. Read-only: nothing here grants or revokes anything. */
export default function AdminUsersPage() {
  const rows = MOCK_USERS.map((user) => {
    const company = user.companyId
      ? mockCompanyById(user.companyId)
      : undefined;
    return {
      key: user.id,
      search: [user.name, user.email, user.role, company?.name ?? ""]
        .join(" ")
        .toLowerCase(),
      node: (
        <DataRow
          key={user.id}
          href={`/admin/users/${user.id}`}
          title={user.name}
          subtitle={user.email}
          columns="2-1-1"
          cells={[
            { label: ADMIN_LIST.columns.role, value: user.role },
            {
              label: ADMIN_LIST.columns.company,
              value: company?.name ?? "—",
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
