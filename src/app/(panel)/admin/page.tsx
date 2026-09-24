import { redirect } from "next/navigation";

import { ADMIN_HOME } from "@/content/panel";

/**
 * `/admin` is not a screen.
 *
 * There is no admin dashboard in phase 1 — reporting and the funnel are phase 2
 * in docs/scope.md — so the bare route sends staff to the first section in the
 * sidebar instead of showing them an empty overview.
 */
export default function AdminIndexPage() {
  redirect(ADMIN_HOME);
}
