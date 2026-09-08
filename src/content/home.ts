/**
 * Home page copy.
 *
 * Every string is the artboard's own English, verbatim — not edited, shortened
 * or improved. All of it is `TODO(copy):` for the client to replace.
 */

export type Step = {
  readonly numeral: string;
  readonly owner: "you" | "us";
  readonly ownerLabel: string;
  readonly heading: string;
  readonly body: string;
};

export type NumberedTile = {
  readonly numeral: string;
  readonly heading: string;
  readonly body: string;
};

export type Industry = {
  readonly heading: string;
  readonly body: string;
};

/** TODO(copy): every string below. */
export const HOME = {
  hero: {
    eyebrow: "Global sourcing & procurement · Canada",
    heading: "Tell us what you need. We take it from there.",
    lead: "Malameran finds the right manufacturer, audits them, and manages your order end to end — from quotation to customs clearance.",
    primaryCta: { label: "Start a Project", href: "/request" },
    secondaryCta: { label: "Apply as a supplier", href: "/suppliers/apply" },
    reassurance:
      "No obligation. Nothing is produced until you approve the quote and the sample.",
  },

  diagram: {
    eyebrow: "The handoff",
    from: {
      eyebrow: "You send",
      title: "You",
      body: "A specification and a target price",
    },
    middle: {
      title: "MALAMERAN",
      chips: [
        "Sourcing",
        "Audit",
        "Negotiation",
        "Samples",
        "Production",
        "Inspection",
        "Freight",
        "Customs",
      ],
    },
    to: {
      eyebrow: "We deliver",
      title: "Your door",
      body: "Delivered, cleared, inspected",
    },
  },

  problem: {
    eyebrow: "The problem",
    heading:
      "Finding a factory is easy. Finding the right one is the hard part.",
    paragraphs: [
      "Directories and trade shows will hand you a hundred names in an afternoon. None of them tell you which factory can actually hold your tolerance, your finish, or your delivery date.",
      "The risk sits in the months after the order — the sample that passes and the shipment that doesn't, the paperwork that holds a container at the border. Someone has to be accountable for all of it. That is the job we take.",
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "Five steps. You are only involved in two of them.",
    steps: [
      {
        numeral: "01",
        owner: "you",
        ownerLabel: "You",
        heading: "Tell us what you need",
        body: "A specification, a drawing, or a photo and a target price.",
      },
      {
        numeral: "02",
        owner: "us",
        ownerLabel: "Us",
        heading: "We source and verify",
        body: "Shortlisted factories, visited and audited before you see them.",
      },
      {
        numeral: "03",
        owner: "you",
        ownerLabel: "You",
        heading: "You approve quote and sample",
        body: "Landed cost, lead time and a physical sample in your hands.",
      },
      {
        numeral: "04",
        owner: "us",
        ownerLabel: "Us",
        heading: "We manage production and quality",
        body: "Progress checks on the floor and inspection before shipment.",
      },
      {
        numeral: "05",
        owner: "us",
        ownerLabel: "Us",
        heading: "We handle shipping and documents",
        body: "Freight, export paperwork, customs clearance and delivery.",
      },
    ] as const satisfies readonly Step[],
    touchpoints: {
      label: "Your two touchpoints",
      body: "Steps 01 and 03 need you. The other three run without you, and you are told where they stand.",
      primaryCta: { label: "Start a Project", href: "/request" },
      secondaryCta: { label: "Apply as a supplier", href: "/suppliers/apply" },
    },
  },

  services: {
    eyebrow: "What we handle",
    heading: "Everything between your specification and your loading dock.",
    tiles: [
      {
        numeral: "01",
        heading: "Supplier research",
        body: "Shortlists built to your spec, not a directory dump.",
      },
      {
        numeral: "02",
        heading: "Factory verification",
        body: "On-site visits, audits and document checks.",
      },
      {
        numeral: "03",
        heading: "Quotation and negotiation",
        body: "Landed cost, not a factory-gate price.",
      },
      {
        numeral: "04",
        heading: "Samples",
        body: "Ordered, chased and delivered to you for approval.",
      },
      {
        numeral: "05",
        heading: "Production monitoring",
        body: "Progress checks on the floor, in writing.",
      },
      {
        numeral: "06",
        heading: "Quality inspection",
        body: "Pre-shipment inspection against the agreed spec.",
      },
      {
        numeral: "07",
        heading: "Freight and logistics",
        body: "Booking, consolidation and tracking.",
      },
      {
        numeral: "08",
        heading: "Export documents and customs",
        body: "Paperwork prepared and cleared.",
      },
    ] as const satisfies readonly NumberedTile[],
  },

  industries: {
    eyebrow: "Industries",
    heading: "Sectors we source for.",
    cards: [
      {
        heading: "Hospitality and hotel fit-out",
        body: "Case goods, lighting, textiles and joinery for rooms and public areas.",
      },
      {
        heading: "Food and beverage",
        body: "Packaging, glassware, service equipment and private label runs.",
      },
      {
        heading: "Retail and packaging",
        body: "Cartons, rigid boxes, displays and store fixtures.",
      },
      {
        heading: "Construction materials",
        body: "Tile, stone, fittings, doors and fabricated metal.",
      },
      {
        heading: "Industrial equipment",
        body: "Machined parts, assemblies and specified components.",
      },
      {
        heading: "Consumer goods",
        body: "Housewares, hardware, apparel and accessories.",
      },
    ] as const satisfies readonly Industry[],
    closing:
      "If your product is manufactured, it is probably something we can source.",
  },

  trust: {
    eyebrow: "Why buyers trust us",
    heading: "Why buyers hand us the problem.",
    reasons: [
      {
        numeral: "01",
        statement:
          "Suppliers are screened and verified against the requirements of each project before we recommend them.",
      },
      {
        numeral: "02",
        statement:
          "A named sourcing specialist owns your project and reports back in writing.",
      },
      {
        numeral: "03",
        statement: "No commitment until you approve the quote and the sample.",
      },
    ],
  },

  suppliers: {
    eyebrow: "For suppliers",
    heading: "Manufacture something we should know about?",
    body: "We are continuously expanding our global supplier network. Tell us what you make, your capacity and your certifications.",
    cta: { label: "Apply as a supplier", href: "/suppliers/apply" },
  },

  finalCta: {
    heading: "Tell us what you need.",
    body: "Describe your requirement. A sourcing specialist will come back to you with next steps.",
    cta: { label: "Start a Project", href: "/request" },
    reassurance:
      "No obligation to proceed until you review and approve our proposed next step.",
  },
} as const;

/** TODO(copy): page title, description and social preview text. */
export const HOME_META = {
  title: "Malameran — Managed global sourcing",
  description:
    "Malameran finds the right manufacturer, audits them, and manages your order end to end — from quotation to customs clearance.",
} as const;
