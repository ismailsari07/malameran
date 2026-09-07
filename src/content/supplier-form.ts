/**
 * Supplier application copy. Artboard English unless noted.
 * TODO(copy): every string below.
 *
 * Three deliberate departures from the artboard, all recorded in
 * docs/design.md:
 *
 * - Country and Manufacturing categories carry no "Optional" tag. Both are
 *   NOT NULL in supabase/migrations/*_supplier_applications.sql, and
 *   categories has a >= 1 check. The artboard describes a form that fails at
 *   the database.
 * - Every mailbox is info@malameran.com. The artboard says
 *   suppliers@malameran.com, which is not a mailbox anyone has confirmed
 *   exists.
 * - Nothing here mentions uploading a profile or catalogue. That field is not
 *   built — see docs/decisions.md.
 */

export const SUPPLIER_FORM = {
  page: {
    heading: "Apply to join our supplier network.",
    lead: "Tell us what you manufacture. We review every application and audit before adding a factory to the network.",
  },

  factory: {
    eyebrow: "The factory",
    companyName: {
      label: "Company name",
      placeholder: "Registered legal name",
    },
    country: {
      label: "Country",
      placeholder: "Select a country",
      /**
       * Seven, including Canada — a supplier can be domestic. Deliberately not
       * the six-country list on /request, which answers a different question
       * ("preferred manufacturing country" for a buyer).
       */
      options: [
        "China",
        "India",
        "Vietnam",
        "Türkiye",
        "Mexico",
        "Poland",
        "Canada",
      ],
    },
    manufacturingCategories: {
      label: "Manufacturing categories",
      suggestions: [
        "Metal fabrication",
        "Extrusion",
        "Injection moulding",
        "Textiles",
        "Electronics assembly",
        "Packaging",
        "Woodwork & furniture",
      ],
      addPlaceholder: "Add another category and press enter",
    },
    monthlyCapacity: {
      label: "Monthly production capacity",
      placeholder: "e.g. 120 tonnes or 80,000 units",
    },
    website: { label: "Website", placeholder: "https://" },
    certifications: {
      label: "Certifications",
      suggestions: ["ISO 9001", "CE", "FDA", "ISO 14001", "BSCI", "FSC"],
      addPlaceholder: "Add another certification and press enter",
    },
  },

  contact: {
    eyebrow: "Who we speak to",
    contactName: { label: "Contact name", placeholder: "Full name" },
    email: { label: "Email", placeholder: "name@factory.com" },
    phone: { label: "Phone", placeholder: "+86 000 0000 0000" },
    note: {
      label: "Notes",
      placeholder:
        "Main export markets, typical clients, equipment on the floor.",
    },
    submitLabel: "Submit application",
    submittingLabel: "Submitting application…",
    /**
     * The artboard reads "Uploading your catalogue — do not close this page."
     * Nothing uploads, so this says what actually happens.
     */
    submittingNote: "Do not close this page — this takes a few seconds.",
    challengeSlot:
      "Reserved for a verification challenge — appears only if triggered",
    reassurance:
      "We reply to every application, including the ones we cannot take on.",
  },

  /** Failure banners. Each cause reads differently on purpose. */
  errors: {
    validation: {
      heading: "Some details need checking.",
      body: "Fix the highlighted fields, then send again.",
    },
    rateLimited: {
      heading:
        "We have already received a few applications from this connection.",
      body: "Please wait about 15 minutes before sending another, or write to info@malameran.com and we will pick it up from there.",
    },
    turnstile: {
      heading: "We could not verify that you are human.",
      body: "This is usually a browser extension or a network filter. Try again, or write to info@malameran.com.",
    },
    server: {
      heading: "We could not send your application.",
      body: "Nothing you typed has been lost. Try again, or email your profile to info@malameran.com.",
    },
    /** The row exists; only a later step failed. Never say it failed. */
    afterWrite: {
      heading: "Your application was received.",
      body: (reference: string | null) =>
        reference
          ? `It is saved under ${reference}. Something went wrong afterwards, so quote that reference if you write to us.`
          : "It is saved, but something went wrong afterwards and we could not show you its reference. Write to info@malameran.com and we will find it.",
    },
  },

  sidebar: {
    eyebrow: "How we review",
    heading: "We audit before we recommend.",
    body: "Expect a document request and, for shortlisted factories, an on-site visit.",
    checks: [
      "Business licence and export history",
      "Quality system and certification records",
      "Capacity check against real order volumes",
    ],
    /** The 375 artboard collapses the panel into heading plus body on one line. */
    mobileSummary:
      "We audit before we recommend. Expect a document request and, for shortlisted factories, an on-site visit.",
  },
} as const;

/** TODO(copy): page title and description. */
export const SUPPLIER_META = {
  title: "Apply as a supplier",
  description:
    "Tell us what you manufacture. We review every application and audit before adding a factory to the network.",
} as const;
