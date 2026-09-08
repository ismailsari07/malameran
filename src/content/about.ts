/**
 * About page copy. Artboard English, verbatim.
 * Every string is `TODO(copy):` for the client to replace.
 */

/** TODO(copy): every string below. */
export const ABOUT = {
  hero: {
    eyebrow: "About",
    heading: "One accountable party, on your side of the table.",
    lead: "Malameran is a Canadian sourcing company. We are paid by the buyer, and we are registered where the buyer is.",
  },

  whyWeExist: {
    eyebrow: "Why we exist",
    heading: "We kept watching good orders fail for the same reasons.",
    paragraphs: [
      "Our team has spent years on both sides of an import: specifying product for buyers in North America, and standing on factory floors in Asia explaining why a shipment was rejected. The failures were rarely about the manufacturer being bad. They were about nobody owning the middle.",
      "An agent takes a commission from the factory. A trading company hides the factory entirely. Neither is accountable for the thing a buyer actually needs: that the product matches the spec, arrives when promised, and clears customs without a fight.",
      "So we built the alternative. One company, paid by you, that owns every step between your specification and your loading dock — and tells you the truth when something slips.",
    ],
  },

  rules: {
    eyebrow: "How we operate",
    heading: "Four rules we do not bend.",
    cards: [
      {
        heading: "The buyer pays us",
        body: "We take no commission from suppliers. Our incentive is your outcome, not the size of the factory's invoice.",
      },
      {
        heading: "You see the factory",
        body: "We do not hide who makes your product. You get the audit report, the name and the address.",
      },
      {
        heading: "Bad news travels fast",
        body: "A delay or a defect reaches you the day we learn it, with the options already worked out.",
      },
      {
        heading: "We say no",
        body: "If a product is outside what we can stand behind, we decline the project rather than learn on your order.",
      },
    ],
  },

  company: {
    eyebrow: "The company",
    stats: [
      {
        label: "Registered",
        value: "Ontario, Canada",
        note: "Malameran Sourcing Inc.",
      },
      {
        label: "Head office",
        value: "Toronto",
        // Artboard reads "150 King Street West, Suite 200". City and country
        // only until the client confirms a street address.
        note: "Ontario, Canada",
      },
      {
        label: "Sourcing regions",
        value: "Asia, Türkiye, EU",
        note: "Audited factories in eleven countries",
      },
      {
        label: "Working languages",
        value: "EN · FR · TR · ZH",
        note: "Negotiation in the supplier's language",
      },
    ],
  },

  finalCta: {
    heading: "Work with us.",
    body: "Send a specification and we will tell you honestly whether we are the right party for it.",
    cta: { label: "Start a Project", href: "/request" },
  },
} as const;

/** TODO(copy): page title and description. */
export const ABOUT_META = {
  title: "About",
  description:
    "Malameran is a Canadian sourcing company. We are paid by the buyer and registered where the buyer is.",
} as const;
