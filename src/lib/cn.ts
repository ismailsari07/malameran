/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not clsx or tailwind-merge: every component variant in this
 * codebase is a closed map of complete class strings, so there is never a
 * conflicting pair of utilities to resolve.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
