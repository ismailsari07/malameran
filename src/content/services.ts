/**
 * Services page copy. Artboard English, verbatim.
 *
 * The eight service headings are client-approved — do not reword them.
 * Everything else is `TODO(copy):`.
 */

export type ServiceCard = {
  readonly numeral: string;
  /** Client-approved. Do not alter. */
  readonly heading: string;
  readonly body: string;
  readonly deliverable: string;
};

export const SERVICES = {
  hero: {
    // TODO(copy):
    eyebrow: "Services",
    heading: "Take the whole chain, or the part you cannot cover.",
    lead: "Most buyers hand us everything from specification to delivery. If you already have a factory, we can step in at audit, inspection or freight instead.",
  },

  fullService: {
    // TODO(copy): eyebrow, heading and body — but NOT the card headings.
    eyebrow: "Full service",
    heading: "Eight jobs we do so you do not have to.",
    cards: [
      {
        numeral: "01",
        heading: "Supplier research",
        body: "We read your spec first, then search. You get a shortlist of factories with the right process, tolerance range and volume band — with the reason each one is on the list.",
        deliverable: "Deliverable: shortlist with capability notes",
      },
      {
        numeral: "02",
        heading: "Factory verification",
        body: "Someone walks the floor. We check equipment, staffing, quality process, licences and export history — and we tell you what we did not like.",
        deliverable: "Deliverable: audit report with photos",
      },
      {
        numeral: "03",
        heading: "Quotation and negotiation",
        body: "We price the whole thing: unit cost, tooling, packaging, freight, duty and clearance. Then we negotiate terms in the supplier's language and time zone.",
        deliverable: "Deliverable: landed-cost quotation",
      },
      {
        numeral: "04",
        heading: "Samples",
        body: "Ordered, chased, checked against your spec and shipped to you. If the first sample misses, we run the correction loop with the factory, not with you.",
        deliverable: "Deliverable: approved physical sample",
      },
      {
        numeral: "05",
        heading: "Production monitoring",
        body: "Written progress updates at agreed milestones, with photos from the floor. Delays are reported when we learn them, not when the ship is missed.",
        deliverable: "Deliverable: milestone progress reports",
      },
      {
        numeral: "06",
        heading: "Quality inspection",
        body: "Pre-shipment inspection against the approved sample and an agreed AQL. Nothing is packed and shipped while a defect is open.",
        deliverable: "Deliverable: inspection report and sign-off",
      },
      {
        numeral: "07",
        heading: "Freight and logistics",
        body: "Sea, air or consolidated, booked at rates we hold with our carriers. Tracking and revised arrival dates come to you without being asked for.",
        deliverable: "Deliverable: booking, tracking, arrival plan",
      },
      {
        numeral: "08",
        heading: "Export documents and customs",
        body: "Commercial invoice, packing list, certificates of origin, HS classification and clearance. Paperwork errors are what hold containers, so we own them.",
        deliverable: "Deliverable: cleared shipment, delivered",
      },
    ] as const satisfies readonly ServiceCard[],
  },

  engagement: {
    // TODO(copy):
    eyebrow: "Engagement models",
    heading: "Three ways to work with us.",
    models: [
      {
        tag: "Most common",
        featured: true,
        heading: "End to end",
        body: "All eight services. You brief and approve; we are accountable for the rest, including the shipment.",
        fee: "Fee agreed per project or per order value",
      },
      {
        tag: "Targeted",
        featured: false,
        heading: "Single service",
        body: "You have the factory. We audit it, inspect the order, or move the freight and clear it.",
        fee: "Fixed fee per audit, inspection or shipment",
      },
      {
        tag: "Ongoing",
        featured: false,
        heading: "Retained supply",
        body: "Repeat orders on a schedule, with a second source kept qualified and ready behind the first.",
        fee: "Monthly retainer plus order-based fee",
      },
    ],
  },

  finalCta: {
    // TODO(copy):
    heading: "Which part is yours?",
    body: "Tell us where the problem sits and we will tell you what we would take on.",
    cta: { label: "Start a sourcing request", href: "/request" },
  },
} as const;

/** TODO(copy): page title and description. */
export const SERVICES_META = {
  title: "Services",
  description:
    "Eight sourcing services from supplier research to customs clearance — taken end to end, or one at a time.",
} as const;
