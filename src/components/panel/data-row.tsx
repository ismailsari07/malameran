import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

/**
 * One record in an admin list.
 *
 * AUTHORED: see "Admin panel screens" in docs/design.md. It reproduces the same
 * file-row treatment the client's project row uses, with its columns as `fr`
 * fractions — never pixel widths, which is the mistake that cost block 2 a
 * rewrite.
 *
 * It is a NEW component rather than a rewrite of `ProjectRow`: that one is the
 * client's row, typed to a project and linking into the client panel. Five
 * admin lists with five different column sets cannot be one typed row, so the
 * shared thing here is the treatment, not the data.
 *
 * `columns` is a closed map, as `Card`'s padding is: a call site picks a set
 * that exists and nothing else compiles. The display utility sits on the anchor
 * and is never passed into `Card`, which owns its own — `pnpm check:classnames`
 * exists because that went wrong once.
 */

const COLUMNS = {
  "2-1": "lg:grid-cols-[2fr_1fr]",
  "2-1-1": "lg:grid-cols-[2fr_1fr_1fr]",
  "2-1-1-1": "lg:grid-cols-[2fr_1fr_1fr_1fr]",
} as const;

export type DataCell = {
  label: string;
  value: React.ReactNode;
};

export function DataRow({
  href,
  title,
  subtitle,
  cells,
  columns,
}: {
  href: string;
  title: string;
  subtitle: string;
  /** One per column after the title. Keep to the set `columns` names. */
  cells: readonly DataCell[];
  columns: keyof typeof COLUMNS;
}) {
  return (
    <li>
      <Link href={href} className="focus-visible:focus-outline block">
        <Card
          tone="surface"
          pad="14-16"
          padLg="18-20"
          radius={12}
          className="hover:border-border-hover transition-colors"
        >
          <div
            className={cn("lg:grid lg:items-center lg:gap-6", COLUMNS[columns])}
          >
            <div className="lg:min-w-0">
              <p className="t-h3-card-sm text-ink">{title}</p>
              <p className="t-fineprint-sm text-text-small mt-1">{subtitle}</p>
            </div>

            {cells.map((cell) => (
              <div key={cell.label} className="mt-3 lg:mt-0">
                <p className="t-fineprint-sm text-text-small">{cell.label}</p>
                <div className="t-label text-ink mt-1">{cell.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </Link>
    </li>
  );
}
