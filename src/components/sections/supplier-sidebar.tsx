import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { SUPPLIER_FORM } from "@/content/supplier-form";

const { sidebar } = SUPPLIER_FORM;

/**
 * The "How we review" panel beside the application form. A server component —
 * it holds no state and never changes.
 *
 * Not the same composition as RequestSidebar despite sitting in the same slot:
 * that one is a numbered timeline of what happens to a request, this is a
 * heading over a list of what gets checked. Sharing them would mean a component
 * with two mutually exclusive halves.
 */
export function SupplierSidebar() {
  return (
    <Card
      tone="sidebar"
      pad="20"
      padLg="32-30-34"
      radius={18}
      radiusLg={24}
      className="lg:sticky lg:top-6"
    >
      <Eyebrow tone="dark" size="card">
        {sidebar.eyebrow}
      </Eyebrow>

      {/* Mobile: heading and body run together as one line, per the 375 artboard. */}
      <p className="t-fineprint mt-3 text-white/80 lg:hidden">
        {sidebar.mobileSummary}
      </p>

      <div className="hidden lg:block">
        <h2 className="t-h3-aside mt-5 text-white">{sidebar.heading}</h2>
        <p className="t-body-sm mt-4 text-white/78">{sidebar.body}</p>

        {/* Source is white/0.14; folded to the shared dark rule at 0.12, as in 4a. */}
        <Rule tone="dark" className="mt-6.5" />

        <ul className="flex flex-col gap-3.5 pt-5.5">
          {sidebar.checks.map((check, index) => (
            <li key={check} className="contents">
              {/* Source is white/0.10; the same fold, as in 4a and 7a. */}
              {index > 0 ? <Rule tone="dark" /> : null}
              <p className="t-fineprint text-white/62">{check}</p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
