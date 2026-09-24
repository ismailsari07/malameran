import { PanelShell } from "@/components/panel/panel-shell";
import { ADMIN_HOME, ADMIN_NAV } from "@/content/panel";

/** Chrome for the admin panel: the same shell, carrying the staff sections. */
export default function AdminPanelLayout({ children }: LayoutProps<"/">) {
  return (
    <PanelShell kind="admin" home={ADMIN_HOME} nav={ADMIN_NAV}>
      {children}
    </PanelShell>
  );
}
