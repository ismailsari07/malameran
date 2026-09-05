import { cn } from "@/lib/cn";

/**
 * The content column.
 *
 * The artboards put `padding: 0 40px` on a full-bleed element and
 * `max-width: 1200px` on the element inside it, so the content column is 1200px
 * with 40px gutters — 1280px overall. `max-w-[1280px]` plus the padding
 * reproduces that in one element; `max-w-[1200px]` would give a 1120px column.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-5 lg:px-10", className)}
    >
      {children}
    </div>
  );
}
