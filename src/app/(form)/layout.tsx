import { AppHeader } from "@/components/layout/app-header";

/**
 * Chrome for the form pages: the reduced 76/60 header with a single way back,
 * and no footer — the artboards give these pages none. A visitor mid-form
 * should have one obvious exit, not a nav.
 */
export default function FormLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader />
      <div className="flex-1">{children}</div>
    </>
  );
}
