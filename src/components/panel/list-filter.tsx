"use client";

import { Fragment, useMemo, useState } from "react";

import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import {
  controlClasses,
  CONTROL_PADDING,
} from "@/components/form/control-classes";
import { ADMIN_LIST } from "@/content/panel";
import { cn } from "@/lib/cn";

/**
 * The search field above an admin list.
 *
 * AUTHORED: see "Admin panel screens" in docs/design.md. The light input
 * exactly as the form pages draw it, through the same `controlClasses` the
 * fields use, so the two cannot drift.
 *
 * IT REALLY FILTERS. Filtering is a view operation over an array already in the
 * browser — it changes nothing and saves nothing, so it does not fall foul of
 * the rule that governs the rest of this block. An inert search box would be
 * the same lie as a Save button that saves nothing.
 *
 * THERE IS NO STATUS DROPDOWN. A dropdown would publish a status taxonomy as
 * settled, and that decision has not been taken — see docs/change-requests.md.
 *
 * Rows are rendered on the server and handed over as nodes; this component only
 * decides which of them to show. That keeps every list screen a server
 * component and puts one small input in the bundle.
 */

export type FilterableRow = {
  key: string;
  /** Everything the query is matched against, already lowercased by the caller. */
  search: string;
  node: React.ReactNode;
};

export function ListFilter({ rows }: { rows: readonly FilterableRow[] }) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => row.search.includes(needle));
  }, [query, rows]);

  return (
    <>
      <div className="mb-5">
        <label htmlFor="panel-list-search" className="sr-only">
          {ADMIN_LIST.search.label}
        </label>
        <input
          id="panel-list-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ADMIN_LIST.search.placeholder}
          className={cn(
            controlClasses(),
            CONTROL_PADDING.default,
            "max-w-[480px]",
          )}
        />
        <p className="t-fineprint-sm text-text-small mt-2" aria-live="polite">
          {ADMIN_LIST.search.resultCount(matches.length, rows.length)}
        </p>
      </div>

      {matches.length === 0 ? (
        <PanelEmptyState
          heading={ADMIN_LIST.search.noMatchHeading}
          body={ADMIN_LIST.search.noMatchBody}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {/* Each node is already the row's own <li>; wrapping it in another
              would nest one list item inside the next. */}
          {matches.map((row) => (
            <Fragment key={row.key}>{row.node}</Fragment>
          ))}
        </ul>
      )}
    </>
  );
}
