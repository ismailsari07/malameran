import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { InternalNotes } from "@/components/panel/internal-notes";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StageRail } from "@/components/panel/stage-rail";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockCompanyById } from "@/content/mock/companies";
import { mockRequestById } from "@/content/mock/requests";
import { ADMIN_DETAIL, ADMIN_STAGES, PROJECT_DETAIL } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = ADMIN_DETAIL;
/**
 * The fields a request and a project share — what was asked for — keep the
 * client screen's labels rather than a second copy of the same four strings
 * under a different TODO(copy) marker.
 */
const asked = PROJECT_DETAIL.labels;

export async function generateMetadata({
  params,
}: PageProps<"/admin/requests/[id]">): Promise<Metadata> {
  const { id } = await params;
  const request = mockRequestById(id);
  return pageMetadata({
    title: request ? request.summary : ADMIN_DETAIL.eyebrow,
    description: ADMIN_DETAIL.requestHeading,
    path: "/admin/requests/[id]",
    canonical: `/admin/requests/${id}`,
  });
}

/** One request, with its pipeline stage and the team's notes on it. */
export default async function AdminRequestDetailPage({
  params,
}: PageProps<"/admin/requests/[id]">) {
  const { id } = await params;
  const request = mockRequestById(id);
  if (!request) notFound();

  const company = mockCompanyById(request.companyId);

  return (
    <>
      <Link
        href="/admin/requests"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {ADMIN_DETAIL.backToRequests}
      </Link>

      <PanelPageHeader
        eyebrow={request.reference}
        title={request.summary}
        lead={`${labels.stage}: ${ADMIN_STAGES[request.stageIndex]}`}
      />

      <div className="flex flex-col gap-4">
        <Card
          tone="surface"
          pad="22"
          padLg="32-30-34"
          radius={20}
          radiusLg={24}
        >
          <Eyebrow tone="muted-paper" size="card" className="mb-4">
            {ADMIN_DETAIL.pipelineHeading}
          </Eyebrow>
          <StageRail currentIndex={request.stageIndex} />
        </Card>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
          <Card
            tone="surface"
            pad="22"
            padLg="32-30-34"
            radius={20}
            radiusLg={24}
          >
            <Eyebrow tone="muted-paper" size="card" className="mb-2">
              {ADMIN_DETAIL.requestHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: labels.reference, value: request.reference },
                { label: labels.received, value: request.receivedOn },
                { label: asked.category, value: request.category },
                { label: asked.quantity, value: request.quantity },
                {
                  label: asked.manufacturingCountry,
                  value: request.manufacturingCountry,
                },
                { label: asked.targetDelivery, value: request.targetDelivery },
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
              {ADMIN_DETAIL.contactHeading}
            </Eyebrow>
            <DetailList
              rows={[
                { label: labels.company, value: company?.name ?? null },
                { label: labels.contact, value: request.contact },
                { label: labels.email, value: request.email },
                { label: labels.country, value: company?.country ?? null },
                { label: labels.sector, value: company?.sector ?? null },
              ]}
            />
          </Card>
        </div>

        <InternalNotes notes={request.notes} />
      </div>
    </>
  );
}
