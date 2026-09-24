/**
 * MOCK FIXTURES — NOT REAL DATA, AND NOT CONTENT.
 *
 * The admin panel's company records. Same terms as `projects.ts`: invented
 * rows, deleted when the real query lands, and plainly fictional so a
 * screenshot cannot be mistaken for a client's record.
 *
 * `source` and `lastContact` are shown here as values. Nothing in the product
 * captures either of them today — `docs/change-requests.md` records that the
 * screen which collects them is an editable admin form in the backend turn, not
 * this read-only one.
 */

export type MockCompany = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  sector: string;
  /** Where the lead came from. Not captured anywhere yet. */
  source: string;
  /** Not captured anywhere yet either. */
  lastContact: string;
};

export const MOCK_COMPANIES: readonly MockCompany[] = [
  {
    id: "mock-co-northbrook",
    name: "Northbrook Building Supply",
    contact: "Alex Rivera",
    email: "alex@example.com",
    phone: "+1 555 0142",
    country: "Canada",
    sector: "Building materials distribution",
    source: "Google",
    lastContact: "22 September 2026",
  },
  {
    id: "mock-co-harbourline",
    name: "Harbourline Equipment Co.",
    contact: "Morgan Diallo",
    email: "morgan@example.com",
    phone: "+1 555 0188",
    country: "Canada",
    sector: "Commercial kitchen and warehouse equipment",
    source: "LinkedIn",
    lastContact: "23 September 2026",
  },
  {
    id: "mock-co-brightfold",
    name: "Brightfold Workwear",
    contact: "Jamie Lindqvist",
    email: "jamie@example.com",
    phone: "+1 555 0113",
    country: "Canada",
    sector: "Apparel and workwear",
    source: "Referral",
    lastContact: "20 September 2026",
  },
  {
    id: "mock-co-cedarpoint",
    name: "Cedar Point Interiors",
    contact: "Riley Nakamura",
    email: "riley@example.com",
    phone: "+1 555 0167",
    country: "Canada",
    sector: "Commercial interiors",
    source: "Direct",
    lastContact: "9 September 2026",
  },
];

export function mockCompanyById(id: string): MockCompany | undefined {
  return MOCK_COMPANIES.find((company) => company.id === id);
}
