"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";
import { FORM_COMMON } from "@/content/form-common";

import type { FieldTone } from "./control-classes";

/**
 * Shell colours per treatment. Both are filled in — the dark values are read
 * from Contact's form — so the chrome already works either way. The half that
 * is still light-only is `controlClasses`, which has no dark branch because the
 * dark artboard has no error, hint or locked state to copy.
 */
const TONE = {
  light: {
    label: "text-text-label",
    optional: "text-text-small",
    description: "text-muted",
    hint: "text-text-small",
  },
  dark: {
    label: "text-white/90",
    optional: "text-white/55",
    description: "text-white/60",
    hint: "text-white/50",
  },
} as const;

/**
 * The chrome around every control: label, the "Optional" tag or the required
 * marker, an optional description, the control itself, a hint, and the error
 * badge and message.
 *
 * The two treatments mark obligation differently — the light artboard tags
 * what is *optional*, the dark one marks what is *required* with an accent
 * asterisk — so both are props and neither is baked in.
 */

export type FieldShellProps = {
  /** Also the control's id and name. */
  name: string;
  label: string;
  /** Light treatment: renders the "Optional" tag. */
  optional?: boolean;
  /** Dark treatment: renders the accent asterisk. */
  required?: boolean;
  /** Sits between the label and the control. */
  description?: string;
  /** Sits below the control. */
  hint?: string;
  /** Present means invalid: drives the border, tint, badge and aria. */
  error?: string;
  tone?: FieldTone;
  children: (ids: FieldIds) => React.ReactNode;
};

export type FieldIds = {
  id: string;
  /** Pass straight to aria-describedby; undefined when there is nothing to point at. */
  describedBy: string | undefined;
  invalid: boolean;
};

export function FieldShell({
  name,
  label,
  optional = false,
  required = false,
  description,
  hint,
  error,
  tone = "light",
  children,
}: FieldShellProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy =
    [descriptionId, hintId, errorId].filter(Boolean).join(" ") || undefined;

  const palette = TONE[tone];

  return (
    <div>
      <div
        className={cn(
          "flex items-baseline gap-2",
          description ? "mb-1.5" : "mb-2",
        )}
      >
        <label htmlFor={id} className={cn("t-label", palette.label)}>
          {label}
          {required ? (
            <span aria-hidden="true" className="text-accent">
              {" "}
              *
            </span>
          ) : null}
        </label>
        {optional ? (
          <span className={cn("t-optional", palette.optional)}>
            {FORM_COMMON.optionalTag}
          </span>
        ) : null}
      </div>

      {description ? (
        <p
          id={descriptionId}
          className={cn("t-field-desc mb-2.5", palette.description)}
        >
          {description}
        </p>
      ) : null}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && !error ? (
        <p id={hintId} className={cn("t-hint mt-2", palette.hint)}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <div id={errorId} className="mt-2.5 flex items-start gap-2">
          <span
            aria-hidden="true"
            className="bg-err rounded-pill t-step-pill mt-px flex size-[17px] shrink-0 items-center justify-center text-white"
          >
            !
          </span>
          <p className="t-error-msg text-err">{error}</p>
        </div>
      ) : null}
    </div>
  );
}

/** The chevron every select carries. CSS geometry — the design ships no icons. */
export function SelectChevron() {
  return (
    <span
      aria-hidden="true"
      className="border-chevron pointer-events-none absolute top-[19px] right-[17px] size-2 rotate-45 border-r-2 border-b-2"
    />
  );
}
