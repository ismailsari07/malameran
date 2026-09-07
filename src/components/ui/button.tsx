import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * The nine button variants in the docs/design.md button table, plus the
 * submitting state.
 *
 * Renders an `<a>` when given `href`, otherwise a `<button>`. Every variant is
 * a complete class string; nothing here is composed at the call site.
 */

const BASE =
  "inline-flex items-center justify-center gap-2.5 text-center transition-colors " +
  "focus-visible:focus-outline disabled:cursor-not-allowed";

const VARIANTS = {
  /** Hero and form submit. 17px/700, 19px 30px, radius 14. */
  primary:
    "t-btn bg-accent text-on-accent px-7.5 py-[19px] rounded-14 hover:bg-(--accent-hover)",
  /** Site header CTA. 15px/700, 13px 22px, radius 12. */
  "primary-sm":
    "t-btn-sm bg-accent text-on-accent px-5.5 py-[13px] rounded-12 hover:bg-(--accent-hover)",
  /** Step-nav Continue / Review. 15.5px/700, 15px 28px, radius 12. */
  "primary-step":
    "t-btn-step bg-accent text-on-accent px-7 py-[15px] rounded-12 hover:bg-(--accent-hover)",
  /** Inline retry after a failed submit. Same box as the header CTA. */
  "primary-retry":
    "t-btn-sm bg-accent text-on-accent px-5.5 py-[13px] rounded-12",
  /** In-card CTA. 16/700 17px 22px on mobile, 15/700 14px 22px from lg. */
  "primary-panel":
    "t-btn-panel bg-accent text-on-accent px-5.5 py-[17px] lg:py-3.5 rounded-12 " +
    "hover:bg-(--accent-hover)",
  /** Ghost on dark. 16px/600, 16px 26px, radius 12. */
  ghost:
    "t-btn-ghost border border-white/45 text-white px-6.5 py-4 rounded-12 " +
    "hover:border-white hover:bg-white/6",
  /** Secondary on light. 15.5px/600, 14px 22px, radius 12. */
  secondary:
    "t-btn-secondary border border-line text-muted px-5.5 py-3.5 rounded-12 " +
    "hover:border-border-hover",
  /** Remove / Cancel. 13.5px/600, 7px 12px, radius 8. */
  destructive:
    "t-btn-xs border border-line text-muted px-3 py-[7px] rounded-8 " +
    "hover:text-err hover:border-err-border-hover",
  /** Disabled and submitting share one box — the primary box, accent at 42%. */
  disabled:
    "t-btn bg-(--accent-disabled) text-on-accent/55 px-7.5 py-[19px] rounded-14",
  /** Text link CTA on dark. */
  link:
    "t-link-cta text-white/72 underline underline-offset-4 decoration-white/30 " +
    "hover:text-white hover:decoration-white",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

type CommonProps = {
  variant?: ButtonVariant;
  /** Renders the disabled box with a spinner and locks the control. */
  submitting?: boolean;
  /**
   * Full-width. `true` at every width, `"below-lg"` on mobile only.
   *
   * `"below-lg"` exists because the call site used to write the desktop half
   * itself, as `block className="lg:inline-flex lg:w-auto"`. Two unprefixed
   * display utilities in one class attribute are settled by whichever Tailwind
   * happens to emit later, not by their order in the string — the same trap
   * that left the site header's CTA visible on mobile. Inside this one string
   * it is well defined: Tailwind always emits responsive variants after the
   * unprefixed utilities they override.
   */
  block?: boolean | "below-lg";
  children: React.ReactNode;
  className?: string;
};

function classes({
  variant = "primary",
  submitting = false,
  block = false,
  className,
}: CommonProps) {
  return cn(
    BASE,
    VARIANTS[submitting ? "disabled" : variant],
    block === "below-lg"
      ? "flex w-full lg:inline-flex lg:w-auto"
      : block
        ? "flex w-full"
        : "",
    submitting ? "cursor-not-allowed" : "",
    className,
  );
}

/**
 * 17px spinner, matching the source exactly: 2px track at 25% black with the
 * top edge at 70%, one turn every 0.8s.
 */
function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="rounded-pill border-on-accent/25 border-t-on-accent/70 inline-block size-[17px] [animation:mal-spin_0.8s_linear_infinite] border-2"
    />
  );
}

export function Button({
  href,
  type = "button",
  disabled,
  onClick,
  ...props
}: CommonProps & {
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}) {
  const { children, submitting = false } = props;
  const content = (
    <>
      {submitting ? <Spinner /> : null}
      {children}
    </>
  );

  if (href !== undefined) {
    return (
      <Link href={href} className={classes(props)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled ?? submitting}
      aria-busy={submitting || undefined}
      className={classes(props)}
    >
      {content}
    </button>
  );
}
