import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StatusTracker } from "@/components/panel/status-tracker";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockProjectById } from "@/content/mock/projects";
import {
  PENDING_FIELDS,
  PROJECT_DETAIL,
  PROJECT_STAGES,
} from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = PROJECT_DETAIL;

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = mockProjectById(id);

  return pageMetadata({
    title: project ? project.name : PROJECT_DETAIL.eyebrow,
    description: PROJECT_DETAIL.summaryHeading,
    // The ROUTES key is the template; the canonical is the resolved URL.
    path: "/dashboard/[id]",
    canonical: `/dashboard/${id}`,
  });
}

/**
 * One project: where it has reached, what was asked for, and the commercial
 * terms.
 *
 * Mock data, like the list. An id that is not in the fixtures is a 404 rather
 * than an empty shell — the same answer the real query will give for a project
 * that is not the caller's, once row-level security decides that rather than
 * this file.
 */
export default async function CustomerProjectDetailPage({
  params,
}: PageProps<"/dashboard/[id]">) {
  const { id } = await params;
  const project = mockProjectById(id);
  if (!project) notFound();

  const stage = PROJECT_STAGES[project.stageIndex];

  return (
    <>
      <Link
        href="/dashboard"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {PROJECT_DETAIL.backLabel}
      </Link>

      <PanelPageHeader
        eyebrow={project.reference}
        title={project.name}
        lead={`${labels.stage}: ${stage}`}
      />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_1fr] lg:items-start lg:gap-6">
        <Card
          tone="surface"
          pad="22"
          padLg="32-30-34"
          radius={20}
          radiusLg={24}
        >
          <Eyebrow tone="muted-paper" size="card" className="mb-5">
            {PROJECT_DETAIL.trackerHeading}
          </Eyebrow>
          <StatusTracker
            currentIndex={project.stageIndex}
            updatedOn={project.updatedOn}
          />
        </Card>

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
                { label: labels.opened, value: project.openedOn },
                { label: labels.updated, value: project.updatedOn },
                { label: labels.category, value: project.category },
                { label: labels.quantity, value: project.quantity },
                {
                  label: labels.manufacturingCountry,
                  value: project.manufacturingCountry,
                },
                { label: labels.targetDelivery, value: project.targetDelivery },
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
              {PROJECT_DETAIL.commercialHeading}
            </Eyebrow>
            {/*
              The four fields from the client's feedback, read-only. They are
              displayed here and still not collected by the public form — that
              is an open item in docs/change-requests.md, and F1-A surface.
            */}
            <DetailList
              rows={[
                { label: labels.incoterm, value: project.incoterm },
                { label: labels.destination, value: project.destination },
                { label: labels.purchaseType, value: project.purchaseType },
                {
                  label: labels.existingSupplier,
                  value: project.existingSupplier,
                },
              ]}
            />
          </Card>

          {/*
            Everything the reseller-versus-agent question blocks. The labels are
            here and the values are not: a figure would imply whose figure it
            is, and a supplier name would imply the client may approach them.
            Neither is decided. See docs/change-requests.md.
          */}
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
