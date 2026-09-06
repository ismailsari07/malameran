"use client";

import { cn } from "@/lib/cn";

import { CONTROL_PADDING, controlClasses } from "./control-classes";
import { FieldShell, SelectChevron, type FieldShellProps } from "./field-shell";

/**
 * The four controls that share the standard box: text, textarea, select, date.
 *
 * Each takes the FieldShell props plus its own, so a call site never wires
 * aria by hand — the shell hands the control its id, describedBy and invalid
 * flag.
 */

type Shared = Omit<FieldShellProps, "children">;

export function TextField({
  placeholder,
  type = "text",
  value,
  onChange,
  inputRef,
  ...shell
}: Shared & {
  placeholder?: string;
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <FieldShell {...shell}>
      {({ id, describedBy, invalid }) => (
        <input
          ref={inputRef}
          id={id}
          name={shell.name}
          type={type}
          value={value}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(controlClasses({ invalid }), CONTROL_PADDING.default)}
        />
      )}
    </FieldShell>
  );
}

export function TextareaField({
  placeholder,
  rows = 4,
  value,
  onChange,
  inputRef,
  ...shell
}: Shared & {
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
}) {
  return (
    <FieldShell {...shell}>
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={inputRef}
          id={id}
          name={shell.name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            controlClasses({ invalid }),
            CONTROL_PADDING.default,
            "resize-y",
          )}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  placeholder,
  options,
  value,
  onChange,
  inputRef,
  ...shell
}: Shared & {
  /** The first, valueless option — "Select an industry". */
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<HTMLSelectElement>;
}) {
  return (
    <FieldShell {...shell}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            ref={inputRef}
            id={id}
            name={shell.name}
            value={value}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              controlClasses({ invalid }),
              CONTROL_PADDING.select,
              "appearance-none",
            )}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      )}
    </FieldShell>
  );
}

export function DateField({
  value,
  onChange,
  inputRef,
  ...shell
}: Shared & {
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <FieldShell {...shell}>
      {({ id, describedBy, invalid }) => (
        <input
          ref={inputRef}
          id={id}
          name={shell.name}
          type="date"
          value={value}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(controlClasses({ invalid }), CONTROL_PADDING.date)}
        />
      )}
    </FieldShell>
  );
}
