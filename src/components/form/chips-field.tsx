"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { FieldShell, type FieldShellProps } from "./field-shell";

/**
 * Multi-select chips with a free-text "add another" input.
 *
 * Suggested values toggle. Anything typed into the dashed input and confirmed
 * with Enter is added as a selected chip. Selecting is idempotent — adding a
 * value that is already selected is a no-op rather than a duplicate.
 *
 * `max` and `maxLength` default to the sourcing form's bounds. Both are props
 * because the two forms differ: supplier certifications allow 20 chips and
 * manufacturing categories allow 120 characters each. Every default and every
 * override mirrors a CHECK constraint — these are a convenience for the user,
 * and the server re-checks them against the same schema regardless.
 */

const DEFAULT_MAX_CHIPS = 10;
const DEFAULT_MAX_CHIP_LENGTH = 80;

export function ChipsField({
  suggestions,
  addPlaceholder,
  value,
  onChange,
  max = DEFAULT_MAX_CHIPS,
  maxLength = DEFAULT_MAX_CHIP_LENGTH,
  ...shell
}: Omit<FieldShellProps, "children"> & {
  suggestions: readonly string[];
  addPlaceholder: string;
  value: readonly string[];
  onChange: (value: string[]) => void;
  /** Most chips that may be selected. Mirrors the array bound in the schema. */
  max?: number;
  /** Longest single chip. Mirrors the per-item bound in the schema. */
  maxLength?: number;
}) {
  const [draft, setDraft] = useState("");

  const toggle = (chip: string) => {
    onChange(
      value.includes(chip)
        ? value.filter((v) => v !== chip)
        : value.length < max
          ? [...value, chip]
          : [...value],
    );
  };

  const commitDraft = () => {
    const next = draft.trim().slice(0, maxLength);
    if (!next || value.includes(next) || value.length >= max) {
      setDraft("");
      return;
    }
    onChange([...value, next]);
    setDraft("");
  };

  // Suggestions first, in artboard order, then anything the user typed.
  const custom = value.filter((v) => !suggestions.includes(v));

  return (
    <FieldShell {...shell}>
      {({ id, describedBy }) => (
        <>
          {/*
            `data-field` and the negative tabindex give this group a focus
            target. A chips group renders no element carrying `name`, so the
            forms' focusFirstError cannot find it the way it finds an input —
            and on the supplier form this field is required, so an error here
            has to be reachable.
          */}
          <div
            id={id}
            data-field={shell.name}
            tabIndex={-1}
            role="group"
            aria-label={shell.label}
            className="flex flex-wrap gap-2.5 outline-none"
          >
            {[...suggestions, ...custom].map((chip) => {
              const selected = value.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(chip)}
                  className={cn(
                    "rounded-pill focus-visible:focus-outline border px-3.5 py-2.5 transition-colors",
                    selected
                      ? "t-label border-accent text-on-accent bg-(--accent-chip-selected)"
                      : "t-chip-option border-border-field bg-surface text-text-body-alt hover:border-border-hover",
                  )}
                >
                  {chip}
                  {selected ? <span aria-hidden="true"> ✕</span> : null}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={draft}
            placeholder={addPlaceholder}
            aria-label={addPlaceholder}
            aria-describedby={describedBy}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                // Never let Enter here submit the form or advance the step.
                event.preventDefault();
                commitDraft();
              }
            }}
            onBlur={commitDraft}
            className="rounded-12 border-border-dashed-field bg-surface text-ink placeholder:text-placeholder focus:focus-ring t-body mt-3 w-full max-w-[480px] border border-dashed px-4 py-3.5 outline-none focus:border-solid"
          />
        </>
      )}
    </FieldShell>
  );
}
