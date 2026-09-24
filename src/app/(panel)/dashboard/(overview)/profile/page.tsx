import type { Metadata } from "next";

import { DetailList } from "@/components/panel/detail-list";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MOCK_PROFILE } from "@/content/mock/projects";
import { PANEL_SCREENS, PROFILE } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["dashboard/profile"];
const { labels } = PROFILE;

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/dashboard/profile",
});

/**
 * The client's own details, read-only.
 *
 * A `<dl>`, not a form. There is no auth and nothing to save, so there is no
 * control to label and no submit to offer: a Save button that saves nothing
 * would be the same lie as a header greeting a user who is not signed in. The
 * read-only treatment is the token set's own locked-input surface, and the
 * notice says plainly that editing arrives with accounts.
 *
 * Mock data, like the rest of block 2.
 */
export default function CustomerProfilePage() {
  return (
    <>
      <PanelPageHeader
        eyebrow={screen.eyebrow}
        title={screen.title}
        lead={screen.lead}
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
            {PROFILE.contactHeading}
          </Eyebrow>
          <DetailList
            rows={[
              { label: labels.name, value: MOCK_PROFILE.name },
              { label: labels.email, value: MOCK_PROFILE.email },
              { label: labels.phone, value: MOCK_PROFILE.phone },
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
            {PROFILE.companyHeading}
          </Eyebrow>
          <DetailList
            rows={[
              { label: labels.company, value: MOCK_PROFILE.company },
              { label: labels.country, value: MOCK_PROFILE.country },
              { label: labels.sector, value: MOCK_PROFILE.sector },
            ]}
          />
        </Card>
      </div>

      <Card tone="info" pad="16-18" radius={14} className="mt-4">
        <p className="t-body-sm text-text-body-alt">{PROFILE.readOnlyNote}</p>
      </Card>
    </>
  );
}
