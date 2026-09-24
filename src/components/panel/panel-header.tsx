import { Container } from "@/components/layout/container";
import { Wordmark } from "@/components/layout/wordmark";
import {
  PANEL_LABELS,
  type PanelKind,
  type PanelNavGroup,
} from "@/content/panel";

import { PanelDrawer } from "./panel-drawer";

/**
 * The panel bar: 60px mobile, 76px desktop, on the app header's ground.
 *
 * Same geometry as the form pages' `AppHeader` — the panel is the same surface
 * and reusing the bar's heights keeps the two from disagreeing by four pixels.
 * It is a separate component rather than a prop on `AppHeader` because the
 * contents differ entirely: a section drawer on the left instead of a wordmark
 * alone, and no "Back to site".
 *
 * The right-hand side names the PANEL, not a person. There is no auth yet, and
 * a bar greeting a made-up user or offering a sign-out that signs nobody out
 * would be the same mistake as a success screen claiming an email was sent. It
 * becomes the account menu when the auth block lands.
 *
 * Stays a server component: only the drawer needs state and the route.
 */
export function PanelHeader({
  kind,
  home,
  nav,
}: {
  kind: PanelKind;
  /** Where the wordmark points — the panel's own home, not the marketing site. */
  home: string;
  nav: readonly PanelNavGroup[];
}) {
  return (
    <header className="bg-head-bg">
      <Container>
        <div className="flex h-15 items-center justify-between gap-3 lg:h-19">
          <div className="flex items-center gap-2.5 lg:gap-0">
            <PanelDrawer groups={nav} />
            <Wordmark size="app" href={home} />
          </div>

          <p className="t-link-back text-white/60">{PANEL_LABELS[kind]}</p>
        </div>
      </Container>
    </header>
  );
}
