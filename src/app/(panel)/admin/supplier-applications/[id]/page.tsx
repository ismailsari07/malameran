import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { StageBadge } from "@/components/panel/stage-badge";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mockSupplierById } from "@/content/mock/suppliers";
import { ADMIN_DETAIL } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const { labels } = ADMIN_DETAIL;

export async function generateMetadata({
  params,
}: PageProps<"/admin/supplier-applications/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supplier = mockSupplierById(id);
  return pageMetadata({
    title: supplier ? supplier.company : ADMIN_DETAIL.eyebrow,
    description: ADMIN_DETAIL.applicationHeading,
    path: "/admin/supplier-applications/[id]",
    canonical: `/admin/supplier-applications/${id}`,
  });
}

/**
 * One supplier application, read-only.
 *
 * The status is DISPLAYED and there is no control to change it: whether an
 * application carries a status at all is an open decision in
 * docs/change-requests.md, and a dropdown here would settle it by accident.
 *
 * Categories render as the flat list the current schema holds. Replacing that
 * with the main → sub → capability hierarchy is its own open decision, and this
 * screen is what it will change.
 */
export default async function AdminSupplierApplicationDetailPage({
  params,
}: PageProps<"/admin/supplier-applications/[id]">) {
  const { id } = await params;
  const supplier = mockSupplierById(id);
  if (!supplier) notFound();

  return (
    <>
      <Link
        href="/admin/supplier-applications"
        className="t-link-back text-muted hover:text-ink focus-visible:focus-outline mb-4 inline-block transition-colors"
      >
        {ADMIN_DETAIL.backToSuppliers}
      </Link>

      <PanelPageHeader
        eyebrow={supplier.reference}
        title={supplier.company}
        lead={`${supplier.country} · ${supplier.receivedOn}`}
        action={<StageBadge>{supplier.status}</StageBadge>}
      />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <Card
          tone="surface"
          pad="22"
          padLg="32-30-34"
          radius={20}
          radiusLg={24}
        >
          <Eyebrow tone="muted-paper" size="card" className="mb-2">
            {ADMIN_DETAIL.applicationHeading}
          </Eyebrow>
          <DetailList
            rows={[
              { label: labels.reference, value: supplier.reference },
              { label: labels.received, value: supplier.receivedOn },
              { label: labels.status, value: supplier.status },
              { label: labels.country, value: supplier.country },
              { label: labels.capacity, value: supplier.capacity },
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
              { label: labels.contact, value: supplier.contact },
              { label: labels.email, value: supplier.email },
              { label: labels.website, value: supplier.website },
              {
                label: labels.categories,
                value: supplier.categories.join(", "),
              },
              {
                label: labels.certifications,
                value: supplier.certifications.join(", "),
              },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
