import { Card } from "@/components/ui/card";

/**
 * The panel's loading state.
 *
 * AUTHORED: see "Panel shell" in docs/design.md. Flat bars on `--track`, the
 * upload progress track's own grey. **No pulse and no shimmer** — the design
 * has exactly one keyframe in it, the button spinner, and an animated skeleton
 * would be a new token. If one is ever wanted it goes through docs/design.md
 * first, like any other token.
 */
export function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card tone="surface" pad="22" padLg="36-40-40" radius={20} radiusLg={24}>
      <div role="status">
        <span className="sr-only">Loading</span>
        <div aria-hidden="true">
          <div className="bg-track rounded-8 h-4 w-40" />
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="bg-track rounded-8 mt-4 h-3 w-full" />
          ))}
        </div>
      </div>
    </Card>
  );
}
