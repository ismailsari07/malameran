import { notFound } from "next/navigation";

import { isProduction } from "@/lib/env";

/**
 * The gate on both panels.
 *
 * Every panel route is UI only — there is no auth, no session and no row-level
 * security behind any of it yet — so in production the whole group does not
 * exist. `notFound()` here covers every page under `(panel)` at once, which is
 * the point of putting it in the group layout rather than in eight pages.
 *
 * Same treatment as `/tokens`, for the same reason: the routes are reviewable
 * in development and on previews, and a merge to main cannot put an
 * unauthenticated admin panel on the live site. This comes off when the auth
 * block lands and real access control replaces it — not before.
 */
export default function PanelGroupLayout({ children }: LayoutProps<"/">) {
  if (isProduction) notFound();
  return <>{children}</>;
}
