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
      heading: "No requests yet",
      body: "Requests submitted through the public form arrive here first.",
      action: null,
    },
  },
  "admin/projects": {
    eyebrow: "Admin",
    title: "Projects",
    lead: "Every open and closed project, across all clients.",
    empty: {
      heading: "No projects yet",
      body: "A project is created from a request once it has been qualified.",
      action: null,
    },
  },
  "admin/companies": {
    eyebrow: "Admin",
    title: "Companies",
    lead: "One record per client company: contact, country, sector, source and last contact.",
    empty: {
      heading: "No companies yet",
      body: "A company record is created the first time someone from it gets in touch.",
      action: null,
    },
  },
  "admin/users": {
    eyebrow: "Admin",
    title: "Users",
    lead: "Everyone with an account, and which company they belong to.",
    empty: {
      heading: "No users yet",
      body: "Accounts appear here once the accounts block lands.",
      action: null,
    },
  },
  "admin/supplier-applications": {
    eyebrow: "Admin",
    title: "Supplier applications",
    lead: "Manufacturers who have applied through the public form.",
    empty: {
      heading: "No applications yet",
      body: "Applications submitted through the public form arrive here.",
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

/**
 * The admin's five-stage pipeline, from the client feedback in
 * `docs/change-requests.md`.
 *
 * NOT the customer's eight-stage tracker in PROJECT_STAGES. Different stages,
 * different audience, different screen — the two are related only through
 * docs/design.md, and neither component imports the other.
 *
 * TODO(copy): PROVISIONAL. The client described this pipeline in feedback; the
 * wording has not been confirmed and the stage set has not been signed off.
 */
export const ADMIN_STAGES = [
  "New Lead",
  "Reviewing",
  "Qualified",
  "Project Created",
  "Sourcing",
] as const;

/**
 * Supplier application triage labels.
 *
 * TODO(copy): PROVISIONAL, and deliberately so. Whether supplier applications
 * carry a status of their own is an open decision in
 * `docs/change-requests.md` — this block DISPLAYS a value and offers no control
 * to change one. These four are plausible placeholders, not a taxonomy anybody
 * has agreed to, and they are rendered in one neutral treatment so that no
 * outcome is implied by colour.
 */
export const SUPPLIER_STATUSES = [
  "New",
  "Reviewing",
  "Approved",
  "Declined",
] as const;

/** TODO(copy): column headings across the five admin lists. */
export const ADMIN_LIST = {
  columns: {
    company: "Company",
    stage: "Stage",
    status: "Status",
    updated: "Last updated",
    received: "Received",
    country: "Country",
    sector: "Sector",
    source: "Source",
    lastContact: "Last contact",
    projects: "Projects",
    role: "Role",
    categories: "Categories",
  },
  search: {
    label: "Search",
    placeholder: "Search by name, reference or company",
    /** The list is not empty — the query simply matched nothing. */
    noMatchHeading: "Nothing matches that search",
    noMatchBody:
      "Try a shorter query, or clear the field to see every record again.",
    clear: "Clear",
    /** Announced to a screen reader when the filtered count changes. */
    resultCount: (shown: number, total: number) =>
      `Showing ${shown} of ${total}`,
  },
} as const;

/** TODO(copy): the admin detail screens. */
export const ADMIN_DETAIL = {
  eyebrow: "Admin",
  backToRequests: "All requests",
  backToProjects: "All projects",
  backToCompanies: "All companies",
  backToUsers: "All users",
  backToSuppliers: "All applications",
  pipelineHeading: "Pipeline stage",
  customerViewHeading: "What the client sees",
  customerViewNote:
    "The eight-stage tracker on the client's own project screen, shown here so the two views cannot drift apart.",
  requestHeading: "What was asked for",
  commercialHeading: "Commercial terms",
  contactHeading: "Contact",
  companyHeading: "Company",
  applicationHeading: "Application",
  accountHeading: "Account",
  relatedProjectsHeading: "Projects",
  relatedUsersHeading: "People",
  noRelated: "Nothing linked yet.",
  labels: {
    reference: "Reference",
    received: "Received",
    company: "Company",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    country: "Country",
    sector: "Sector",
    source: "Source",
    lastContact: "Last contact",
    role: "Role",
    joined: "Joined",
    status: "Status",
    website: "Website",
    categories: "Manufacturing categories",
    capacity: "Capacity",
    certifications: "Certifications",
    projectCount: "Projects",
    stage: "Current stage",
  },
} as const;

/**
 * Internal notes.
 *
 * The heading says who cannot see this, not who can: on a screen the team
 * shares with nobody, the useful fact is the boundary.
 *
 * TODO(copy): all three strings.
 */
export const INTERNAL_NOTES = {
  heading: "Internal notes — not visible to the client",
  empty: "No notes on this record yet.",
  /**
   * There is no box to type in, not even a disabled one: nothing on these
   * screens persists, and a disabled input still advertises that it will work.
   */
  footnote:
    "Notes are written from the admin panel once it is connected to the database.",
} as const;

/** The drawer trigger's accessible name, both states. */
export const PANEL_MENU = {
  open: "Open sections",
  close: "Close sections",
  heading: "Sections",
} as const;
