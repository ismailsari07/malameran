/**
 * Panel navigation and shell copy.
 *
 * The customer panel and the admin panel share one shell and differ only in the
 * nav they are given, so both sets live here beside each other — the way
 * `src/content/nav.ts` holds the marketing header and footer together.
 *
 * Every string is placeholder copy and must be confirmed with the client, as on
 * the marketing site. The section names in particular follow the decisions
 * recorded in docs/change-requests.md: an unconverted sourcing request is a
 * lead, and a project is a record created from one, so the admin panel lists
 * Requests and Projects separately.
 */

export type PanelNavItem = {
  readonly label: string;
  readonly href: string;
};

export type PanelNavGroup = {
  /** Uppercase group heading above the links. */
  readonly heading: string;
  readonly items: readonly PanelNavItem[];
};

/** TODO(copy): customer panel section names. */
export const CUSTOMER_NAV: readonly PanelNavGroup[] = [
  {
    heading: "Your account",
    items: [
      { label: "Projects", href: "/dashboard" },
      { label: "Profile", href: "/dashboard/profile" },
    ],
  },
];

/**
 * TODO(copy): admin section names. "Requests" is the intake queue — the client
 * has not yet confirmed whether they call these leads.
 */
export const ADMIN_NAV: readonly PanelNavGroup[] = [
  {
    heading: "Pipeline",
    items: [
      { label: "Requests", href: "/admin/requests" },
      { label: "Projects", href: "/admin/projects" },
    ],
  },
  {
    heading: "Records",
    items: [
      { label: "Companies", href: "/admin/companies" },
      { label: "Users", href: "/admin/users" },
      { label: "Supplier applications", href: "/admin/supplier-applications" },
    ],
  },
];

/** Where `/admin` sends a visitor. There is no admin dashboard in phase 1. */
export const ADMIN_HOME = "/admin/requests";

/**
 * The label in the panel header bar.
 *
 * Deliberately names the panel, not the person. There is no auth yet, and a
 * header that greets a made-up user — or offers a sign-out that signs nobody
 * out — would be the same mistake as a success screen claiming an email was
 * sent. It becomes the account menu when the auth block lands.
 */
export const PANEL_LABELS = {
  customer: "Client portal",
  admin: "Admin",
} as const;

export type PanelKind = keyof typeof PANEL_LABELS;

/** TODO(copy): every title, lead and empty state below. */
export const PANEL_SCREENS = {
  "dashboard/projects": {
    eyebrow: "Client portal",
    title: "Projects",
    lead: "Every sourcing project we are running for you, and where each one has reached.",
    empty: {
      heading: "No projects yet",
      body: "Once we have reviewed your sourcing request and opened a project, it appears here with its current stage.",
      action: { label: "Start a project", href: "/request" },
    },
  },
  "dashboard/profile": {
    eyebrow: "Client portal",
    title: "Profile",
    lead: "Your contact details and company information.",
    empty: {
      heading: "Nothing to edit yet",
      body: "Profile fields arrive with the accounts block. Until then this screen exists to hold the shell in place.",
      action: null,
    },
  },
  "admin/requests": {
    eyebrow: "Admin",
    title: "Requests",
    lead: "Incoming sourcing requests, before any of them becomes a project.",
    empty: {
      heading: "No requests to show",
      body: "This screen is built in a later block. The shell around it is what is being reviewed now.",
      action: null,
    },
  },
  "admin/projects": {
    eyebrow: "Admin",
    title: "Projects",
    lead: "Every open and closed project, across all clients.",
    empty: {
      heading: "No projects to show",
      body: "This screen is built in a later block. The shell around it is what is being reviewed now.",
      action: null,
    },
  },
  "admin/companies": {
    eyebrow: "Admin",
    title: "Companies",
    lead: "One record per client company: contact, country, sector, source and last contact.",
    empty: {
      heading: "No companies to show",
      body: "This screen is built in a later block. Source and last-contact date are not captured anywhere today, so it becomes an editable form rather than a read-only list.",
      action: null,
    },
  },
  "admin/users": {
    eyebrow: "Admin",
    title: "Users",
    lead: "Everyone with an account, and which company they belong to.",
    empty: {
      heading: "No users to show",
      body: "This screen is built in a later block. The shell around it is what is being reviewed now.",
      action: null,
    },
  },
  "admin/supplier-applications": {
    eyebrow: "Admin",
    title: "Supplier applications",
    lead: "Manufacturers who have applied through the public form.",
    empty: {
      heading: "No applications to show",
      body: "This screen is built in a later block. The shell around it is what is being reviewed now.",
      action: null,
    },
  },
} as const;

/** The drawer trigger's accessible name, both states. */
export const PANEL_MENU = {
  open: "Open sections",
  close: "Close sections",
  heading: "Sections",
} as const;
