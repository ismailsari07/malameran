/**
 * MOCK FIXTURES — NOT REAL DATA, AND NOT CONTENT.
 *
 * Block 2 of F1-B is UI only: there is no database, no auth and no query behind
 * any panel screen, so the customer panel is rendered against this file. It is
 * deleted the moment the real query lands — nothing here is a schema, and the
 * shapes below are what the screens need, not what the tables will hold.
 *
 * Kept apart from `src/content/` on purpose. That directory holds copy someone
 * has to approve; this holds invented rows nobody should ever approve.
 *
 * Every reference number reads MAL-MOCK-xxxxx rather than the real MAL-xxxxx
 * format, and every company is plainly invented, so a screenshot of this screen
 * can never be mistaken for a real client's record.
 */

export type MockProject = {
  /** URL segment, and what the list links to. */
  id: string;
  reference: string;
  name: string;
  /** Index into PROJECT_STAGES. The tracker derives every state from it. */
  stageIndex: number;
  openedOn: string;
  updatedOn: string;
  category: string;
  quantity: string;
  manufacturingCountry: string;
  targetDelivery: string;
  /** The four commercial fields. Display only — the public form does not ask
   *  for these yet, which is still an open item in docs/change-requests.md. */
  incoterm: string;
  destination: string;
  purchaseType: string;
  existingSupplier: string;
};

/**
 * Six projects, spread across the tracker so the list shows variety and the
 * detail screen can be read at an early stage, a mid stage and Delivered.
 */
export const MOCK_PROJECTS: readonly MockProject[] = [
  {
    id: "mock-40219",
    reference: "MAL-MOCK-40219",
    name: "Powder-coated aluminium window profiles",
    stageIndex: 1,
    openedOn: "12 September 2026",
    updatedOn: "22 September 2026",
    category: "Building materials",
    quantity: "5,000 m",
    manufacturingCountry: "Türkiye",
    targetDelivery: "March 2027",
    incoterm: "FOB",
    destination: "Port of Montreal, Canada",
    purchaseType: "Recurring",
    existingSupplier: "No",
  },
  {
    id: "mock-40224",
    reference: "MAL-MOCK-40224",
    name: "Stainless steel restaurant prep tables",
    stageIndex: 0,
    openedOn: "21 September 2026",
    updatedOn: "23 September 2026",
    category: "Commercial kitchen equipment",
    quantity: "120 units",
    manufacturingCountry: "No preference",
    targetDelivery: "June 2027",
    incoterm: "DDP",
    destination: "Calgary, Alberta, Canada",
    purchaseType: "One-off",
    existingSupplier: "No",
  },
  {
    id: "mock-39880",
    reference: "MAL-MOCK-39880",
    name: "Injection-moulded storage crates",
    stageIndex: 3,
    openedOn: "4 July 2026",
    updatedOn: "18 September 2026",
    category: "Industrial packaging",
    quantity: "24,000 units",
    manufacturingCountry: "Vietnam",
    targetDelivery: "January 2027",
    incoterm: "CIF",
    destination: "Port of Vancouver, Canada",
    purchaseType: "Recurring",
    existingSupplier: "Yes",
  },
  {
    id: "mock-39642",
    reference: "MAL-MOCK-39642",
    name: "Cotton canvas tool aprons, branded",
    stageIndex: 4,
    openedOn: "19 May 2026",
    updatedOn: "20 September 2026",
    category: "Textiles",
    quantity: "8,500 units",
    manufacturingCountry: "India",
    targetDelivery: "December 2026",
    incoterm: "FOB",
    destination: "Port of Halifax, Canada",
    purchaseType: "One-off",
    existingSupplier: "No",
  },
  {
    id: "mock-39301",
    reference: "MAL-MOCK-39301",
    name: "LED high-bay warehouse luminaires",
    stageIndex: 6,
    openedOn: "3 March 2026",
    updatedOn: "16 September 2026",
    category: "Electrical",
    quantity: "1,400 units",
    manufacturingCountry: "China",
    targetDelivery: "October 2026",
    incoterm: "DDP",
    destination: "Mississauga, Ontario, Canada",
    purchaseType: "Recurring",
    existingSupplier: "Yes",
  },
  {
    id: "mock-38975",
    reference: "MAL-MOCK-38975",
    name: "Anodised aluminium shelving brackets",
    stageIndex: 7,
    openedOn: "8 January 2026",
    updatedOn: "29 August 2026",
    category: "Hardware",
    quantity: "60,000 units",
    manufacturingCountry: "Türkiye",
    targetDelivery: "August 2026",
    incoterm: "EXW",
    destination: "Port of Montreal, Canada",
    purchaseType: "Recurring",
    existingSupplier: "No",
  },
];

/** The signed-in client, as the profile screen would receive them. */
export const MOCK_PROFILE = {
  name: "Sample Client",
  email: "client@example.com",
  phone: "+1 555 0100",
  company: "Example Trading Co.",
  country: "Canada",
  sector: "Distribution and wholesale",
} as const;

export function mockProjectById(id: string): MockProject | undefined {
  return MOCK_PROJECTS.find((project) => project.id === id);
}
