import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * What a panel screen shows when it has nothing to show.
 *
 * AUTHORED: see "Panel shell" in docs/design.md. The app-form card, at the
 * mobile card's padding and radius below `lg`. Left-aligned rather than
 * centred, because every other card in the design is.
 */
export function PanelEmptyState({
  heading,
  body,
  action,
}: {
  heading: string;
  body: string;
  action?: { label: string; href: string } | null;
}) {
  return (
    <Card tone="surface" pad="22" padLg="36-40-40" radius={20} radiusLg={24}>
      <h2 className="t-h3-card-sm text-ink">{heading}</h2>
      <p className="t-body-sm text-text-body-alt mt-2.5 max-w-[520px]">
        {body}
      </p>
      {action ? (
        <Button href={action.href} variant="secondary" className="mt-6">
          {action.label}
        </Button>
      ) : null}
    </Card>
  );
}
