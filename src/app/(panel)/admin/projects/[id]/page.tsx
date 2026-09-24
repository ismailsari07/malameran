import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { InternalNotes } from "@/components/panel/internal-notes";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StatusTracker } from "@/components/panel/status-tracker";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockCompanyById } from "@/content/mock/companies";
import { mockProjectById } from "@/content/mock/projects";
import {
  ADMIN_DETAIL,
  PENDING_FIELDS,
  PROJECT_DETAIL,
  PROJECT_STAGES,
} from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = ADMIN_DETAIL;
const asked = PROJECT_DETAIL.labels;

export async function generateMetadata({
  params,
}: PageProps<"/admin/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = mockProjectById(id);
  return pageMetadata({
    title: project ? project.name : ADMIN_DETAIL.eyebrow,
    description: PROJECT_DETAIL.summaryHeading,
    path: "/admin/projects/[id]",
    canonical: `/admin/projects/${id}`,
  });
}

/**
 * One project, from the team's side.
 *
 * It carries the CLIENT's eight-stage tracker rather than a second admin view
 * of the same thing: the team needs to see exactly what the client sees, and
 * two renderings of one project's progress would drift apart. The five-stage
 * pipeline belongs to a request, and stops once a project exists.
 *
 * The fields the business-model question blocks stay blocked here too. The team
 * knowing a price does not make it decided whose price the client is shown.
 */
export default async function AdminProjectDetailPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = mockProjectById(id);
  if (!project) notFound();

  const company = mockCompanyById(project.companyId);

  return (
    <>
      <Link
        href="/admin/projects"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {ADMIN_DETAIL.backToProjects}
      </Link>

      <PanelPageHeader
        eyebrow={project.reference}
        title={project.name}
        lead={`${company?.name ?? "—"} · ${PROJECT_STAGES[project.stageIndex]}`}
      />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_1fr] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4">
          <Card
            tone="surface"
            pad="22"
            padLg="32-30-34"
            radius={20}
            radiusLg={24}
          >
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {ADMIN_DETAIL.customerViewHeading}
            </Eyebrow>
            <p className="t-fineprint-sm text-text-small mb-5">
              {ADMIN_DETAIL.customerViewNote}
            </p>
            <StatusTracker
              currentIndex={project.stageIndex}
              updatedOn={project.updatedOn}
            />
          </Card>

          <InternalNotes notes={project.notes} />
        </div>

        <div className="flex flex-col gap-4">
          <Card
            tone="surface"
            pad="22"
            padLg="32-30-34"
            radius={20}
            radiusLg={24}
          >
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {PROJECT_DETAIL.summaryHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: labels.reference, value: project.reference },
                { label: labels.company, value: company?.name ?? null },
                { label: asked.opened, value: project.openedOn },
                { label: asked.updated, value: project.updatedOn },
                { label: asked.category, value: project.category },
                { label: asked.quantity, value: project.quantity },
                {
                  label: asked.manufacturingCountry,
                  value: project.manufacturingCountry,
                },
                { label: asked.targetDelivery, value: project.targetDelivery },
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
              {ADMIN_DETAIL.commercialHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: asked.incoterm, value: project.incoterm },
                { label: asked.destination, value: project.destination },
                { label: asked.purchaseType, value: project.purchaseType },
                {
                  label: asked.existingSupplier,
                  value: project.existingSupplier,
                },
              ]}
            />
          </Card>

          <Card tone="info" pad="22" padLg="32-30-34" radius={20} radiusLg={24}>
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {PROJECT_DETAIL.pendingHeading}
            </Eyebrow>
            <DetailList
              rows={PENDING_FIELDS.map((label) => ({ label, value: null }))}
            />
            <p className="t-fineprint-sm text-text-small mt-4">
              {PROJECT_DETAIL.pendingNote}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
