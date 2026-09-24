import type { Metadata } from "next";

import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { PanelPageHeader } from "@/components/panel/panel-page-header";
import { PANEL_SCREENS } from "@/content/panel";
import { pageMetadata } from "@/lib/seo";

const screen = PANEL_SCREENS["dashboard/profile"];

export const metadata: Metadata = pageMetadata({
  title: screen.title,
  description: screen.lead,
  path: "/dashboard/profile",
});

/**
 * Block 1 is the shell. This screen is the page-title pattern and the empty
 * state on it — the list itself is a later block, and nothing here reads any
 * data.
 */
export default function CustomerProfilePage() {
  return (
    <>
      <PanelPageHeader
        eyebrow={screen.eyebrow}
        title={screen.title}
        lead={screen.lead}
      />
      <PanelEmptyState
        heading={screen.empty.heading}
        body={screen.empty.body}
        action={screen.empty.action}
      />
    </>
  );
}
