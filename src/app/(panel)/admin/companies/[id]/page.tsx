import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DataRow } from "@/components/panel/data-row";
import { DetailList } from "@/components/panel/detail-list";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockCompanyById } from "@/content/mock/companies";
import { MOCK_PROJECTS } from "@/content/mock/projects";
import { MOCK_USERS } from "@/content/mock/users";
import { ADMIN_DETAIL, ADMIN_LIST, PROJECT_STAGES } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = ADMIN_DETAIL;

export async function generateMetadata({
  params,
}: PageProps<"/admin/companies/[id]">): Promise<Metadata> {
  const { id } = await params;
  const company = mockCompanyById(id);
  return pageMetadata({
    title: company ? company.name : ADMIN_DETAIL.eyebrow,
    description: ADMIN_DETAIL.companyHeading,
    path: "/admin/companies/[id]",
    canonical: `/admin/companies/${id}`,
  });
}

/**
 * One company: who they are, and everything linked to them.
 *
 * Read-only. `source` and `last contact` display values that nothing in the
 * product collects today; the form that collects them is an editable admin
 * screen in the backend turn — recorded in docs/change-requests.md.
 */
export default async function AdminCompanyDetailPage({
  params,
}: PageProps<"/admin/companies/[id]">) {
  const { id } = await params;
  const company = mockCompanyById(id);
  if (!company) notFound();

  const projects = MOCK_PROJECTS.filter((p) => p.companyId === company.id);
  const people = MOCK_USERS.filter((u) => u.companyId === company.id);

  return (
    <>
      <Link
        href="/admin/companies"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {ADMIN_DETAIL.backToCompanies}
      </Link>

      <PanelPageHeader
        eyebrow={ADMIN_DETAIL.companyHeading}
        title={company.name}
        lead={company.sector}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
          <Card
            tone="surface"
            pad="22"
            padLg="32-30-34"
            radius={20}
            radiusLg={24}
          >
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {ADMIN_DETAIL.contactHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: labels.contact, value: company.contact },
                { label: labels.email, value: company.email },
                { label: labels.phone, value: company.phone },
                { label: labels.country, value: company.country },
              ]}
            />
          </Card>

          <Card
            tone="surface"
            pad="22"
            padLg="32-30-34"
            radius={20}
            radiusLg={24}
          >
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {ADMIN_DETAIL.companyHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: labels.sector, value: company.sector },
                { label: labels.source, value: company.source },
                { label: labels.lastContact, value: company.lastContact },
                { label: labels.projectCount, value: String(projects.length) },
              ]}
            />
          </Card>
        </div>

        <section>
          <Eyebrow tone="muted-paper" size="card" className="mb-3">
            {ADMIN_DETAIL.relatedProjectsHeading}
          </Eyebrow>
          {projects.length === 0 ? (
            <p className="t-body-sm text-muted">{ADMIN_DETAIL.noRelated}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {projects.map((project) => (
                <DataRow
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  title={project.name}
                  subtitle={project.reference}
                  columns="2-1"
                  cells={[
                    {
                      label: ADMIN_LIST.columns.stage,
                      value: PROJECT_STAGES[project.stageIndex],
                    },
                  ]}
                />
              ))}
            </ul>
          )}
        </section>

        <section>
          <Eyebrow tone="muted-paper" size="card" className="mb-3">
            {ADMIN_DETAIL.relatedUsersHeading}
          </Eyebrow>
          {people.length === 0 ? (
            <p className="t-body-sm text-muted">{ADMIN_DETAIL.noRelated}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {people.map((user) => (
                <DataRow
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  title={user.name}
                  subtitle={user.email}
                  columns="2-1"
                  cells={[{ label: ADMIN_LIST.columns.role, value: user.role }]}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
