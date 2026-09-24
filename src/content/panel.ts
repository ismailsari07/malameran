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
    lead: "Your contact details and company information, as we hold them.",
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

/**
 * The eight customer-facing stages, in order, from `docs/scope.md`.
 *
 * This is the CUSTOMER's view of a project. The five-stage admin pipeline in
 * `docs/change-requests.md` — New Lead → Reviewing → Qualified → Project
 * Created → Sourcing — is a different thing on a different screen, and is not
 * this list.
 *
 * TODO(copy): the client's own wording for each stage.
 */
export const PROJECT_STAGES = [
  "Request Received",
  "Supplier Research",
  "Quote Collection",
  "Negotiation",
  "Production",
  "Quality Control",
  "Shipping",
  "Delivered",
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number];

/** Screen-reader state words for a tracker row — state is never colour alone. */
export const STAGE_STATE_LABELS = {
  done: "Completed",
  current: "Current stage",
  upcoming: "Not started",
} as const;

/** TODO(copy): column headings and row labels on the project list. */
export const PROJECT_LIST = {
  columns: { project: "Project", stage: "Stage", updated: "Last updated" },
  /** Reads out the position without relying on the tracker being visible. */
  stageCounter: (index: number) =>
    `Stage ${index + 1} of ${PROJECT_STAGES.length}`,
} as const;

/**
 * The project detail screen.
 *
 * `pending` is the wording for a field that cannot be filled until the business
 * model is decided — see PENDING_FIELDS below.
 */
export const PROJECT_DETAIL = {
  eyebrow: "Client portal",
  backLabel: "All projects",
  trackerHeading: "Progress",
  summaryHeading: "Project details",
  commercialHeading: "Commercial terms",
  pendingHeading: "Not yet confirmed",
  pendingValue: "—",
  pendingNote:
    "These depend on how the engagement is structured, which is being confirmed with you. They are left blank deliberately rather than filled with a placeholder figure.",
  labels: {
    reference: "Reference",
    opened: "Opened",
    updated: "Last updated",
    stage: "Current stage",
    category: "Category",
    quantity: "Quantity",
    manufacturingCountry: "Preferred manufacturing country",
    targetDelivery: "Target delivery",
    incoterm: "Incoterm",
    destination: "Delivery destination",
    purchaseType: "Purchase type",
    existingSupplier: "Existing supplier",
  },
} as const;

/**
 * The fields the business-model question blocks, named in one place.
 *
 * Until `docs/change-requests.md`'s reseller-versus-agent question is answered,
 * nothing here can be given a value: a price implies whose price it is, a
 * supplier's name implies the client may deal with them directly, and the
 * contracting party is the question itself. The labels render; the values are a
 * dash marked as pending.
 *
 * TODO(copy): all four, once the model is decided.
 */
export const PENDING_FIELDS = [
  "Indicative price",
  "Landed cost",
  "Supplier",
  "Contracting party",
] as const;

/** TODO(copy): the profile screen's field labels and its read-only notice. */
export const PROFILE = {
  contactHeading: "Contact",
  companyHeading: "Company",
  readOnlyNote:
    "Shown as we hold it. Editing arrives with accounts; until then, email us to change anything here.",
  labels: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    country: "Country",
    sector: "Sector",
  },
} as const;

/** The drawer trigger's accessible name, both states. */
export const PANEL_MENU = {
  open: "Open sections",
  close: "Close sections",
  heading: "Sections",
} as const;
