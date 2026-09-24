import { PanelShell } from "@/components/panel/panel-shell";
import { CUSTOMER_NAV } from "@/content/panel";

/** Chrome for the customer panel: the shell, carrying the customer's sections. */
export default function CustomerPanelLayout({ children }: LayoutProps<"/">) {
  return (
    <PanelShell kind="customer" home="/dashboard" nav={CUSTOMER_NAV}>
      {children}
    </PanelShell>
  );
}
