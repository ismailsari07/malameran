import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PROJECT_LIST, PROJECT_STAGES } from "@/content/panel";
import type { MockProject } from "@/content/mock/projects";

/**
 * One project in the customer's list.
 *
 * AUTHORED: see "Customer panel screens" in docs/design.md. It reproduces the
 * file row — the only list row the source has — at the row paddings the design
 * already uses, stepping up from `lg` where the stage and date columns appear
 * beside the name rather than under it.
 *
 * The whole row is one link, so the display utility sits on the anchor. It is
 * never passed into `Card`, which owns its own: an unprefixed display utility
 * arriving through `className` would be settled by Tailwind's emission order,
 * which is what `pnpm check:classnames` exists to catch.
 */
export function ProjectRow({ project }: { project: MockProject }) {
  const stage = PROJECT_STAGES[project.stageIndex];

  return (
    <li>
      <Link
        href={`/dashboard/${project.id}`}
        className="focus-visible:focus-outline block"
      >
        <Card
          tone="surface"
          pad="14-16"
          padLg="18-20"
          radius={12}
          className="hover:border-border-hover transition-colors"
        >
          {/*
            Three columns from `lg` at 2fr 1fr 1fr, gap 24 — fractions rather
            than pixel widths, which is how every grid in the source is
            expressed, and the only way the columns line up down the list
            without a width nobody measured.
          */}
          <div className="lg:grid lg:grid-cols-[2fr_1fr_1fr] lg:items-center lg:gap-6">
            <div className="lg:min-w-0">
              <p className="t-h3-card-sm text-ink">{project.name}</p>
              <p className="t-fineprint-sm text-text-small mt-1">
                {project.reference}
              </p>
            </div>

            <div className="mt-3 lg:mt-0">
              <p className="t-label text-ink">{stage}</p>
              <p className="t-fineprint-sm text-text-small mt-1">
                {PROJECT_LIST.stageCounter(project.stageIndex)}
              </p>
            </div>

            <div className="mt-3 lg:mt-0">
              <p className="t-fineprint-sm text-text-small">
                {PROJECT_LIST.columns.updated}
              </p>
              <p className="t-body-sm text-text-body-alt mt-1">
                {project.updatedOn}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}
