/**
 * MOCK FIXTURES — NOT REAL DATA, AND NOT CONTENT.
 *
 * Sourcing requests as the admin sees them, before any of them becomes a
 * project. An unconverted request is what the client feedback calls a lead —
 * the decision recorded in `docs/change-requests.md` on 2026-09-24.
 *
 * `stageIndex` points into ADMIN_STAGES, which is the five-stage admin
 * pipeline and PROVISIONAL. It is not the customer's eight-stage tracker.
 */

import type { MockNote } from "./projects";

export type MockRequest = {
  id: string;
  reference: string;
  /** What was asked for, in the submitter's words. */
  summary: string;
  /** Index into ADMIN_STAGES. */
  stageIndex: number;
  companyId: string;
  contact: string;
  email: string;
  receivedOn: string;
  category: string;
  quantity: string;
  manufacturingCountry: string;
  targetDelivery: string;
  notes: readonly MockNote[];
};

export const MOCK_REQUESTS: readonly MockRequest[] = [
  {
    id: "mock-rq-41108",
    reference: "MAL-MOCK-41108",
    summary: "Galvanised steel shelving uprights",
    stageIndex: 0,
    companyId: "mock-co-cedarpoint",
    contact: "Riley Nakamura",
    email: "riley@example.com",
    receivedOn: "23 September 2026",
    category: "Storage and shelving",
    quantity: "3,200 units",
    manufacturingCountry: "No preference",
    targetDelivery: "May 2027",
    notes: [
      {
        author: "Sam Okonkwo",
        date: "23 September 2026",
        body: "Arrived overnight. Specification is unusually complete for a first request — drawings attached, tolerances stated.",
      },
    ],
  },
  {
    id: "mock-rq-41094",
    reference: "MAL-MOCK-41094",
    summary: "Acoustic ceiling baffles, felt",
    stageIndex: 1,
    companyId: "mock-co-cedarpoint",
    contact: "Riley Nakamura",
    email: "riley@example.com",
    receivedOn: "19 September 2026",
    category: "Commercial interiors",
    quantity: "900 m²",
    manufacturingCountry: "Portugal",
    targetDelivery: "February 2027",
    notes: [
      {
        author: "Priya Raman",
        date: "21 September 2026",
        body: "Asked for the fire rating they need before we approach anyone. Class B changes the shortlist entirely.",
      },
    ],
  },
  {
    id: "mock-rq-41061",
    reference: "MAL-MOCK-41061",
    summary: "Insulated shipping totes",
    stageIndex: 2,
    companyId: "mock-co-harbourline",
    contact: "Morgan Diallo",
    email: "morgan@example.com",
    receivedOn: "11 September 2026",
    category: "Industrial packaging",
    quantity: "14,000 units",
    manufacturingCountry: "Vietnam",
    targetDelivery: "April 2027",
    notes: [
      {
        author: "Sam Okonkwo",
        date: "17 September 2026",
        body: "Qualified. Volume and timeline are both realistic and the buyer has signing authority. Ready to open as a project.",
      },
      {
        author: "Sam Okonkwo",
        date: "12 September 2026",
        body: "Second request from this company. Their first one is already in production.",
      },
    ],
  },
  {
    id: "mock-rq-40998",
    reference: "MAL-MOCK-40998",
    summary: "Recycled PET retail fixtures",
    stageIndex: 1,
    companyId: "mock-co-brightfold",
    contact: "Jamie Lindqvist",
    email: "jamie@example.com",
    receivedOn: "5 September 2026",
    category: "Retail fit-out",
    quantity: "450 units",
    manufacturingCountry: "No preference",
    targetDelivery: "January 2027",
    notes: [
      {
        author: "Priya Raman",
        date: "8 September 2026",
        body: "Recycled content needs certifying, not just claiming. Flagged that this narrows the field and may move the price.",
      },
    ],
  },
  {
    id: "mock-rq-40931",
    reference: "MAL-MOCK-40931",
    summary: "Powder-coated bike racks",
    stageIndex: 4,
    companyId: "mock-co-northbrook",
    contact: "Alex Rivera",
    email: "alex@example.com",
    receivedOn: "28 August 2026",
    category: "Street furniture",
    quantity: "600 units",
    manufacturingCountry: "Türkiye",
    targetDelivery: "December 2026",
    notes: [
      {
        author: "Dana Whitfield",
        date: "14 September 2026",
        body: "Sourcing under way against the same mills as their window profiles. No project record opened yet.",
      },
    ],
  },
];

export function mockRequestById(id: string): MockRequest | undefined {
  return MOCK_REQUESTS.find((request) => request.id === id);
}
