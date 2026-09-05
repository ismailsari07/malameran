/**
 * How It Works page copy. Artboard English, verbatim.
 * Every string is `TODO(copy):` for the client to replace.
 */

export type ProcessStep = {
  readonly numeral: string;
  readonly owner: "you" | "us";
  readonly ownerLabel: string;
  readonly heading: string;
  readonly body: string;
  readonly points: readonly string[];
};

/** TODO(copy): every string below. */
export const HOW_IT_WORKS = {
  hero: {
    eyebrow: "How it works",
    heading: "Five steps. Two of them are yours.",
    lead: "You brief us and you approve. Everything between those two moments is our job, and you are told where it stands in writing.",
  },

  timeline: {
    eyebrow: "Typical timeline",
    rows: [
      { label: "Shortlist", value: "3–5 days" },
      { label: "Quotation", value: "1–2 weeks" },
      { label: "Sample", value: "2–4 weeks" },
      { label: "Production", value: "4–10 weeks" },
      { label: "Freight and clearance", value: "2–6 weeks" },
    ],
    footnote:
      "Ranges depend on product, tooling and shipping mode. You get dated estimates with your quote.",
  },

  steps: [
    {
      numeral: "01",
      owner: "you",
      ownerLabel: "You",
      heading: "Tell us what you need",
      body: "A drawing, a spec sheet, a competitor's product or a photo. If you have a target price and a delivery window, tell us those too.",
      points: [
        "Specification, drawing or sample photo",
        "Target price and quantity",
        "Certifications the market requires",
      ],
    },
    {
      numeral: "02",
      owner: "us",
      ownerLabel: "Us",
      heading: "We source and verify",
      body: "We build a shortlist against your spec, then visit and audit before we recommend anyone. You see a handful of factories that can actually do the job — not a directory export.",
      points: [
        "Capability and capacity check",
        "On-site visit and audit report",
        "Business licence and export document review",
      ],
    },
    {
      numeral: "03",
      owner: "you",
      ownerLabel: "You",
      heading: "You approve quote and sample",
      body: "One quotation with landed cost, lead time and payment terms — and a physical sample in your hands. Nothing goes into production until both have your sign-off.",
      points: [
        "Landed cost, not factory-gate price",
        "Dated lead time and payment schedule",
        "Sample shipped to you for approval",
      ],
    },
    {
      numeral: "04",
      owner: "us",
      ownerLabel: "Us",
      heading: "We manage production and quality",
      body: "Progress checks on the floor, written updates at agreed intervals, and a pre-shipment inspection against the approved sample before anything is packed.",
      points: [
        "Scheduled progress reports",
        "Pre-shipment inspection with photos",
        "Defects resolved before shipment leaves",
      ],
    },
    {
      numeral: "05",
      owner: "us",
      ownerLabel: "Us",
      heading: "We handle shipping and documents",
      body: "Freight booked, export paperwork prepared, customs cleared and delivery arranged to your dock. One invoice, one accountable party.",
      points: [
        "Sea, air or consolidated freight",
        "Export documents and HS classification",
        "Customs clearance and final delivery",
      ],
    },
  ] as const satisfies readonly ProcessStep[],

  commitments: {
    eyebrow: "What you can expect",
    heading: "Commitments we make in writing.",
    cards: [
      {
        heading: "A named specialist",
        body: "One person owns your project from brief to delivery. You always know who to call.",
      },
      {
        heading: "No hidden margin",
        body: "Our fee is agreed up front. The quote you see is the cost landed at your door.",
      },
      {
        heading: "Your relationships stay yours",
        body: "We do not sell your specifications, and we do not resell your product to your competitors.",
      },
    ],
  },

  finalCta: {
    heading: "Start at step one.",
    body: "Send us the specification. We will come back with a shortlist and a plan.",
    cta: { label: "Start a sourcing request", href: "/request" },
  },
} as const;

/** TODO(copy): page title and description. */
export const HOW_IT_WORKS_META = {
  title: "How It Works",
  description:
    "Five steps from specification to delivery. You brief us and you approve; everything in between is our job.",
} as const;
