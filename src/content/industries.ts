/**
 * Industries page copy. Artboard English, verbatim.
 * Every string is `TODO(copy):` for the client to replace.
 */

export type Sector = {
  readonly numeral: string;
  readonly heading: string;
  readonly body: string;
  readonly chips: readonly string[];
};

/** TODO(copy): every string below. */
export const INDUSTRIES = {
  hero: {
    eyebrow: "Industries",
    heading: "Sectors we source for.",
    lead: "Six sectors where we already know the factories, the certifications and the failure points. If yours is not here, it is probably still something we can source.",
  },

  sectors: [
    {
      numeral: "01",
      heading: "Hospitality and hotel fit-out",
      body: "Room-count deadlines do not move, so lead time is the whole game. We source case goods, lighting, soft goods and joinery against a fixed opening date, and we inspect finish quality before it ships.",
      chips: [
        "Case goods",
        "Decorative lighting",
        "Textiles and bedding",
        "Bathroom fittings",
        "Joinery and millwork",
        "FF&E packages",
      ],
    },
    {
      numeral: "02",
      heading: "Food and beverage",
      body: "Food-contact compliance and documentation decide whether a shipment clears. We work with factories that already hold the certificates your market asks for, and we keep the paperwork with the goods.",
      chips: [
        "Primary packaging",
        "Glassware",
        "Closures and caps",
        "Service equipment",
        "Private label runs",
        "Labels and sleeves",
      ],
    },
    {
      numeral: "03",
      heading: "Retail and packaging",
      body: "Colour and finish have to match across runs and across suppliers. We hold approved standards, check print against them, and consolidate multi-item programmes into one shipment.",
      chips: [
        "Folding cartons",
        "Rigid boxes",
        "Point-of-sale displays",
        "Store fixtures",
        "Shipper cartons",
        "Bags and pouches",
      ],
    },
    {
      numeral: "04",
      heading: "Construction materials",
      body: "Heavy, high-volume and standards-bound. We check test reports against the codes your project is built to, and plan freight so a site is not waiting on a container.",
      chips: [
        "Tile and stone",
        "Doors and frames",
        "Aluminium profiles",
        "Fabricated metal",
        "Plumbing fittings",
        "Hardware",
      ],
    },
    {
      numeral: "05",
      heading: "Industrial equipment",
      body: "Drawing-driven work where tolerance and material certificates matter more than price. We qualify on first-article inspection and keep a second source qualified behind the first.",
      chips: [
        "Machined parts",
        "Castings",
        "Weldments",
        "Sub-assemblies",
        "Motors and drives",
        "Spare parts",
      ],
    },
    {
      numeral: "06",
      heading: "Consumer goods",
      body: "Cost per unit, safety testing and retail-ready packaging in one brief. We manage the tooling, the compliance testing and the barcode-level detail that stops a listing going live.",
      chips: [
        "Housewares",
        "Small appliances",
        "Apparel and accessories",
        "Hardware and tools",
        "Outdoor and sport",
        "Retail-ready packs",
      ],
    },
  ] as const satisfies readonly Sector[],

  notListed: {
    eyebrow: "Not on the list",
    heading:
      "If your product is manufactured, it is probably something we can source.",
    body: "Send the specification. If it is outside what we can stand behind, we will tell you that instead of taking the project.",
  },

  finalCta: {
    heading: "Tell us what you need.",
    cta: { label: "Start a sourcing request", href: "/request" },
  },
} as const;

/** TODO(copy): page title and description. */
export const INDUSTRIES_META = {
  title: "Industries",
  description:
    "Six sectors where we already know the factories, the certifications and the failure points.",
} as const;
