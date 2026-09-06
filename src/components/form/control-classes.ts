import { cn } from "@/lib/cn";

/**
 * Every control's styling, in one place.
 *
 * `tone` is threaded through the whole field layer even though only "light" is
 * implemented: the light artboard is the canonical treatment and the only one
 * with error, hint and locked states. Adding the dark treatment later means
 * adding a branch here and in FieldShell, not rewriting six components.
 */

export type FieldTone = "light" | "dark";

export type ControlState = {
  tone?: FieldTone;
  invalid?: boolean;
  /**
   * A control inside a locked form. The wrapping <fieldset disabled> already
   * removes interaction; this is the artboard's readonly fill on top of it.
   */
  locked?: boolean;
};

const BASE = "rounded-12 w-full border outline-none transition-colors t-body";

const LIGHT_REST =
  "border-border-field bg-surface text-ink placeholder:text-placeholder focus:focus-ring";

/**
 * Invalid controls take the error border and tint. The focus ring still
 * applies, so a field being corrected does not lose its focus indicator.
 */
const LIGHT_INVALID =
  "border-err bg-err-field-bg text-ink placeholder:text-placeholder focus:focus-ring";

/** Submitting: the field keeps its border but takes the info surface. */
const LIGHT_LOCKED = "border-border-field bg-surface-info text-ink";

export function controlClasses({
  tone = "light",
  invalid = false,
  locked = false,
}: ControlState = {}) {
  if (tone === "dark") {
    // Not implemented in block 7a. Contact's dark form styles its own fields
    // inline; unifying them is block 8's call.
    throw new Error("the dark field tone is not implemented yet");
  }
  if (locked) return cn(BASE, LIGHT_LOCKED);
  return cn(BASE, invalid ? LIGHT_INVALID : LIGHT_REST);
}

/** Padding differs per control: the date input sits 1px tighter. */
export const CONTROL_PADDING = {
  default: "px-4 py-3.5",
  /** Native date inputs render taller, so the artboard trims a pixel. */
  date: "px-4 py-[13px]",
  /** Room for the chevron. */
  select: "py-3.5 pr-10.5 pl-4",
} as const;
