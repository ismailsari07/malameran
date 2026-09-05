import { cn } from "@/lib/cn";

/**
 * The small accent square that flags a summary line.
 *
 * 9px or 10px with a 2px radius. Purely decorative — the design ships no icon
 * set, so this is the only recurring glyph that is not text or CSS geometry.
 */
const SIZE = { 9: "size-[9px]", 10: "size-2.5" } as const;
const SIZE_LG = { 9: "lg:size-[9px]", 10: "lg:size-2.5" } as const;

export function Marker({
  size = 10,
  sizeLg,
  className,
}: {
  /** The 375px artboard's size. */
  size?: keyof typeof SIZE;
  /** The 1440px artboard's size, when it differs. */
  sizeLg?: keyof typeof SIZE;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "rounded-2 bg-accent inline-block shrink-0",
        SIZE[size],
        sizeLg ? SIZE_LG[sizeLg] : "",
        className,
      )}
    />
  );
}
