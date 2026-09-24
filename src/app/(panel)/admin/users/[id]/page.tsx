import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockCompanyById } from "@/content/mock/companies";
import { mockUserById } from "@/content/mock/users";
import { ADMIN_DETAIL } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = ADMIN_DETAIL;

export async function generateMetadata({
  params,
}: PageProps<"/admin/users/[id]">): Promise<Metadata> {
  const { id } = await params;
  const user = mockUserById(id);
  return pageMetadata({
    title: user ? user.name : ADMIN_DETAIL.eyebrow,
    description: ADMIN_DETAIL.accountHeading,
    path: "/admin/users/[id]",
    canonical: `/admin/users/${id}`,
  });
}

/**
 * One account, read-only.
 *
 * Nothing on this screen grants, revokes or resets anything — there is no auth
 * behind it yet, and a control that changes a role it cannot write would be the
 * worst version of the rule this whole block follows.
 */
export default async function AdminUserDetailPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const user = mockUserById(id);
  if (!user) notFound();

  const company = user.companyId ? mockCompanyById(user.companyId) : undefined;

  return (
    <>
      <Link
        href="/admin/users"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {ADMIN_DETAIL.backToUsers}
      </Link>

      <PanelPageHeader
        eyebrow={ADMIN_DETAIL.accountHeading}
        title={user.name}
        lead={user.email}
      />

      <Card
        tone="surface"
        pad="22"
        padLg="32-30-34"
        radius={20}
        radiusLg={24}
        className="lg:max-w-[620px]"
      >
        <Eyebrow tone="muted-paper" size="card" className="mb-2">
          {ADMIN_DETAIL.accountHeading}
        </Eyebrow>
        <DetailList
          rows={[
            { label: labels.email, value: user.email },
            { label: labels.role, value: user.role },
            { label: labels.company, value: company?.name ?? null },
            { label: labels.joined, value: user.joinedOn },
          ]}
        />
      </Card>
    </>
  );
}
