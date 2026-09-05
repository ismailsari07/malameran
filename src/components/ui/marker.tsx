import { cn } from "@/lib/cn";

/**
 * The small accent square that flags a summary line.
 *
 * 9px or 10px with a 2px radius. Purely decorative — the design ships no icon
 * set, so this is the only recurring glyph that is not text or CSS geometry.
 */
export function Marker({
  size = 10,
  className,
}: {
  size?: 9 | 10;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "rounded-2 bg-accent inline-block shrink-0",
        size === 9 ? "size-[9px]" : "size-2.5",
        className,
      )}
    />
  );
}
