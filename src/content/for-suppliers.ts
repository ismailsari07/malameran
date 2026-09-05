/**
 * For Suppliers page copy. Artboard English, verbatim.
 * Every string is `TODO(copy):` for the client to replace.
 */

/** TODO(copy): every string below. */
export const FOR_SUPPLIERS = {
  hero: {
    eyebrow: "For suppliers",
    heading: "If you manufacture well, we want you on the list.",
    lead: "We place orders on behalf of buyers in Canada and the United States. Audited factories in our network get briefed on real projects with approved budgets — not price-fishing enquiries.",
  },

  criteria: {
    eyebrow: "What we look for",
    heading: "Four things we check before we brief you.",
    cards: [
      {
        numeral: "01",
        heading: "Real capability",
        body: "Your own production, your own equipment, and honest limits on what you can and cannot hold.",
      },
      {
        numeral: "02",
        heading: "Documents in order",
        body: "Business licence, export history and the certifications your product category requires.",
      },
      {
        numeral: "03",
        heading: "Quality process",
        body: "Written inspection steps, records we can read, and openness to third-party inspection.",
      },
      {
        numeral: "04",
        heading: "Communication",
        body: "Replies within a working day and bad news delivered early. This matters as much as price.",
      },
    ],
  },

  process: [
    {
      numeral: "01",
      heading: "You apply",
      // Artboard reads "Send the form below"; the form is no longer on this
      // page, so the wording follows the CTA. TODO(copy): confirm.
      body: "Send us your product range, capacity and certifications.",
    },
    {
      numeral: "02",
      heading: "We review and visit",
      body: "Document check first, then an on-site audit if your category is one we are placing.",
    },
    {
      numeral: "03",
      heading: "You get briefed",
      body: "Approved factories receive project briefs with quantities, specs and decision dates.",
    },
  ],

  application: {
    eyebrow: "Supplier application",
    heading: "Tell us what you make.",
    body: "We review every application. If your category matches an open project, you will hear from us within two weeks.",
    cta: { label: "Apply as a supplier", href: "/suppliers/apply" },
    reassurance:
      "We do not share your details with buyers until you agree to a project.",
  },

  questions: {
    heading: "Questions before applying?",
    body: "Write to us directly and we will tell you whether your category is one we are placing.",
    /**
     * The artboard uses suppliers@malameran.com. One mailbox only until the
     * client confirms another exists; split routing is a phase 2 question.
     */
    email: "info@malameran.com",
  },
} as const;

/** TODO(copy): page title and description. */
export const FOR_SUPPLIERS_META = {
  title: "For Suppliers",
  description:
    "We place orders for buyers in Canada and the United States. Audited factories in our network get briefed on real projects.",
} as const;
