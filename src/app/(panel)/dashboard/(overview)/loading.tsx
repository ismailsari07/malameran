import { PanelSkeleton } from "@/components/panel/panel-skeleton";

/**
 * Covers the list and the profile while they resolve.
 *
 * It sits inside `(overview)` rather than on `dashboard/` so that it does NOT
 * cover `/dashboard/[id]`. A `loading.tsx` above a segment makes it stream, and
 * a streamed response has already sent its headers by the time `notFound()`
 * runs — so an unknown project id answered 200 with the not-found page in the
 * body instead of a real 404. Measured both ways before moving it.
 *
 * That status matters more than a skeleton on a screen that reads a fixture:
 * once row-level security decides what a client may open, "not yours" has to be
 * a 404, not a 200 that happens to look like one.
 */
export default function CustomerOverviewLoading() {
  return <PanelSkeleton />;
}
