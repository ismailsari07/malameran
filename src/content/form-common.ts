/**
 * Copy shared by every form, not owned by any one of them.
 *
 * `FieldShell` used to read this string out of the sourcing-request content
 * file, which made a shared form primitive depend on one form's copy. Anything
 * a second form would also need belongs here instead.
 *
 * TODO(copy): every string below.
 */

export const FORM_COMMON = {
  /** The tag beside a label in the light treatment, which marks what is optional. */
  optionalTag: "Optional",
  retry: "Try again",
} as const;
