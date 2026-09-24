import { Container } from "@/components/layout/container";
import type { PanelKind, PanelNavGroup } from "@/content/panel";

import { PanelHeader } from "./panel-header";
import { PanelNav } from "./panel-nav";

/**
 * The frame both panels share: bar, sidebar, main column.
 *
 * One component for the customer panel and the admin panel, differing only in
 * the nav it is handed — which is why the two layouts under `(panel)` are three
 * lines each. See "Panel shell" under "Authored, not in the source" in
 * docs/design.md: no artboard exists for any of this, and every value in it is
 * either already in the spacing scale or justified there against a source one.
 *
 * `240px` sidebar, `48px` gap, inside the site's existing 1280px container —
 * the panel introduces no second measure. Body rhythm is 32/48 mobile and
 * 48/72 desktop, the app form's own rhythm stepped down one pair: a screen
 * that is returned to daily does not want a marketing page's air.
 *
 * It takes no `className`. Every layout utility on these elements is set here,
 * so there is no call site that can pass one that fights them.
 */
export function PanelShell({
  kind,
  home,
  nav,
  children,
}: {
  kind: PanelKind;
  home: string;
  nav: readonly PanelNavGroup[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper flex flex-1 flex-col">
      <PanelHeader kind={kind} home={home} nav={nav} />
      <Container>
        <div className="pt-8 pb-12 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:pt-12 lg:pb-18">
          <PanelNav groups={nav} />
          <main>{children}</main>
        </div>
      </Container>
    </div>
  );
}
