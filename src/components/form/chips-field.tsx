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
 */

const MAX_CHIPS = 10;
const MAX_CHIP_LENGTH = 80;

export function ChipsField({
  suggestions,
  addPlaceholder,
  value,
  onChange,
  ...shell
}: Omit<FieldShellProps, "children"> & {
  suggestions: readonly string[];
  addPlaceholder: string;
  value: readonly string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const toggle = (chip: string) => {
    onChange(
      value.includes(chip)
        ? value.filter((v) => v !== chip)
        : value.length < MAX_CHIPS
          ? [...value, chip]
          : [...value],
    );
  };

  const commitDraft = () => {
    const next = draft.trim().slice(0, MAX_CHIP_LENGTH);
    if (!next || value.includes(next) || value.length >= MAX_CHIPS) {
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
          <div className="flex flex-wrap gap-2.5" id={id}>
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
