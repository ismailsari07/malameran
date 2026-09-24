/**
 * MOCK FIXTURES — NOT REAL DATA, AND NOT CONTENT.
 *
 * Supplier applications as they arrive from the public form.
 *
 * `status` is PROVISIONAL in the strongest sense: whether an application
 * carries a status at all is an open decision in `docs/change-requests.md`.
 * This block displays a value and offers no control to change one, and every
 * status renders in the same neutral badge so that no outcome is implied by
 * colour — see "Admin panel screens" in docs/design.md.
 *
 * `categories` is the flat list the current schema holds. Replacing it with the
 * main → sub → capability hierarchy is a separate open decision.
 */

export type MockSupplier = {
  id: string;
  reference: string;
  company: string;
  country: string;
  contact: string;
  email: string;
  website: string;
  receivedOn: string;
  /** One of SUPPLIER_STATUSES. Provisional. */
  status: string;
  categories: readonly string[];
  capacity: string;
  certifications: readonly string[];
};

export const MOCK_SUPPLIERS: readonly MockSupplier[] = [
  {
    id: "mock-sp-11824",
    reference: "SUP-MOCK-11824",
    company: "Anatolia Extrusion Works",
    country: "Türkiye",
    contact: "Emre Şahin",
    email: "emre@example.com",
    website: "https://example.com",
    receivedOn: "21 September 2026",
    status: "New",
    categories: ["Aluminium extrusion", "Powder coating"],
    capacity: "1,800 tonnes per year",
    certifications: ["ISO 9001", "Qualicoat"],
  },
  {
    id: "mock-sp-11791",
    reference: "SUP-MOCK-11791",
    company: "Mekong Polymer Industries",
    country: "Vietnam",
    contact: "Linh Tran",
    email: "linh@example.com",
    website: "https://example.com",
    receivedOn: "14 September 2026",
    status: "Reviewing",
    categories: ["Injection moulding", "Recycled polymers"],
    capacity: "40,000 units per month",
    certifications: ["ISO 9001", "ISO 14001"],
  },
  {
    id: "mock-sp-11746",
    reference: "SUP-MOCK-11746",
    company: "Coimbatore Textile Mills",
    country: "India",
    contact: "Arun Balakrishnan",
    email: "arun@example.com",
    website: "https://example.com",
    receivedOn: "2 September 2026",
    status: "Approved",
    categories: ["Woven cotton", "Cut and sew", "Screen printing"],
    capacity: "25,000 pieces per month",
    certifications: ["GOTS", "SA8000", "ISO 9001"],
  },
  {
    id: "mock-sp-11702",
    reference: "SUP-MOCK-11702",
    company: "Baltic Lighting Assembly",
    country: "Lithuania",
    contact: "Rasa Petrauskas",
    email: "rasa@example.com",
    website: "https://example.com",
    receivedOn: "26 August 2026",
    status: "Declined",
    categories: ["LED assembly"],
    capacity: "6,000 units per month",
    certifications: ["CE"],
  },
];

export function mockSupplierById(id: string): MockSupplier | undefined {
  return MOCK_SUPPLIERS.find((supplier) => supplier.id === id);
}
