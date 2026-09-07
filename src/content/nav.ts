/**
 * Navigation and footer copy.
 *
 * Every string here is placeholder copy carried over from the design reference
 * and must be confirmed with the client before launch — see the
 * `TODO(copy):` markers.
 */

export type NavItem = {
  readonly label: string;
  readonly href: string;
};

/** TODO(copy): labels and order taken from design/Site Header.dc.html. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "For Suppliers", href: "/for-suppliers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** TODO(copy): header CTA label and destination. */
/**
 * Two real labels, not one truncated. The header has room for seven characters
 * at 375px and for the full sentence from `lg`, and a CSS truncation would give
 * a screen reader the long string while showing the short one.
 * TODO(copy): both.
 */
export const HEADER_CTA = {
  label: "Start a sourcing request",
  labelShort: "Request",
  href: "/request",
} as const;

/** TODO(copy): app-header back link. */
export const BACK_TO_SITE: NavItem = { label: "Back to site", href: "/" };

export type FooterColumn = {
  readonly heading: string;
  readonly links: readonly NavItem[];
};

/** TODO(copy): footer column headings and grouping. */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
    ],
  },
  {
    heading: "More",
    links: [
      { label: "For Suppliers", href: "/for-suppliers" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** TODO(copy): one-line positioning statement under the footer wordmark. */
export const FOOTER_DESCRIPTION =
  "Managed global sourcing. One accountable party from specification to delivery.";

/**
 * TODO(copy): the design reference shows hello@malameran.com and a full street
 * address (150 King Street West, Suite 200, Toronto). The brief specifies
 * info@ and city/country only, which is what ships. Confirm which address —
 * and which mailbox — is real before launch. No phone number and no social
 * links exist by design; do not add placeholders for them.
 */
export const FOOTER_CONTACT = {
  email: "info@malameran.com",
  location: "Toronto, Ontario, Canada",
} as const;

/** TODO(copy): confirm the registered company name and year. */
export const FOOTER_COPYRIGHT = "© 2026 Malameran Sourcing Inc.";

/** TODO(copy): legal pages are not built yet — hrefs are provisional. */
export const FOOTER_LEGAL: readonly NavItem[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
