/**
 * Sourcing request form copy. Artboard English unless noted.
 * TODO(copy): every string below.
 */

export const REQUEST_FORM = {
  page: {
    heading: "Tell us what you need.",
    lead: "Three short steps. No account, no obligation.",
  },

  steps: [
    { id: "need", label: "What you need" },
    { id: "requirements", label: "Your requirements" },
    { id: "contact", label: "How we reach you" },
  ],

  need: {
    productDescription: {
      label: "Product description",
      description:
        "Describe what you need made. A specification, a drawing or a photo of something similar is enough.",
      placeholder:
        "e.g. Powder-coated aluminium window profiles, 6063-T5, 2.0mm wall, RAL 7016 finish",
    },
    industry: {
      label: "Industry",
      placeholder: "Select an industry",
      options: [
        "Construction & building products",
        "Industrial & machinery",
        "Consumer goods",
        "Packaging",
        "Automotive & transport",
        "Energy & electrical",
      ],
    },
    requestType: {
      label: "Request type",
      placeholder: "Select a request type",
      options: [
        "New product sourcing",
        "Repeat order",
        "Replace an existing supplier",
        "Not sure yet",
      ],
    },
    quantity: {
      label: "Quantity",
      placeholder: "5,000",
      hint: "Units, kilograms, metres or pallets — whatever fits.",
    },
  },

  requirements: {
    notice: "All optional. Anything you leave blank, we will ask about later.",
    targetPrice: { label: "Target price per unit", placeholder: "CAD 12.50" },
    targetDeliveryDate: { label: "Target delivery date" },
    preferredCountry: {
      label: "Preferred manufacturing country",
      placeholder: "No preference",
      options: ["China", "India", "Vietnam", "Türkiye", "Mexico", "Poland"],
    },
    certifications: {
      label: "Required certifications",
      suggestions: ["CE", "ISO 9001", "FDA", "FSC", "REACH", "RoHS"],
      addPlaceholder: "Add another certification and press enter",
    },
    files: {
      label: "Drawings, specs or photos",
      dropTitle: "Drag files here",
      browsePrefix: "or ",
      browseLabel: "browse your device",
      /**
       * The artboard reads "up to 10MB per file". The real limit is 4MB — the
       * bucket's file_size_limit, the size_bytes CHECK constraint and the
       * decision on record all say 4194304. The copy follows the limit.
       */
      constraints:
        "PDF, images, DWG or spreadsheets · up to 4MB per file · 5 files maximum",
      removeLabel: "Remove",
      readyLabel: "ready to send",
      uploadingLabel: (percent: number) => `uploading ${percent}%`,
      uploadedLabel: "uploaded",
      cancelLabel: "Cancel",
      rejectedTitle: (name: string) => `${name} could not be added`,
      rejectedBody:
        "Accepted: PDF, images, DWG or spreadsheets, up to 4MB per file, 5 files maximum.",
      chooseAnother: "Choose a different file",
    },
  },

  contact: {
    contactName: { label: "Full name", placeholder: "Jane Doe" },
    company: { label: "Company", placeholder: "Acme Industrial" },
    email: { label: "Email", placeholder: "jane@company.com" },
    phone: { label: "Phone", placeholder: "+1 555 000 0000" },
    note: {
      label: "Anything else we should know",
      placeholder:
        "Timelines, packaging, existing supplier history — anything that gives us context.",
    },
    submitLabel: "Send request",
    submittingLabel: "Sending request…",
    submittingNote: "Do not close this page — this takes a few seconds.",
    /** Turnstile mounts here in block 7b. */
    challengeSlot:
      "Reserved for a verification challenge — appears only if triggered",
    reassurance:
      "No obligation. Nothing is produced until you approve the quote and the sample.",
  },

  nav: {
    back: "Back",
    continue: "Continue",
    review: "Review",
    counter: (current: number, total: number) => `Step ${current} of ${total}`,
    issue: (count: number) => `${count} ${count === 1 ? "issue" : "issues"}`,
  },

  /** Failure banners. Each cause reads differently on purpose. */
  errors: {
    validation: {
      heading: "Some details need checking.",
      body: "Go back and fix the highlighted fields, then send again.",
    },
    rateLimited: {
      heading: "We have already received a few requests from this connection.",
      body: "Please wait about 15 minutes before sending another, or write to info@malameran.com and we will pick it up from there.",
    },
    turnstile: {
      heading: "We could not verify that you are human.",
      body: "This is usually a browser extension or a network filter. Try again, or write to info@malameran.com.",
    },
    server: {
      heading: "We could not send your request.",
      body: "Nothing you typed has been lost. Try again, or email it to info@malameran.com.",
    },
    /** The row exists; only a later step failed. Never say it failed. */
    afterWrite: {
      heading: "Your request was received.",
      body: (reference: string) =>
        `It is saved under ${reference}. Something went wrong afterwards, so if you attached files it is worth sending them by reply.`,
    },
  },

  sidebar: {
    eyebrow: "What happens next",
    steps: [
      "We read your request and come back with questions if anything is missing.",
      "We shortlist and audit factories against your specification.",
      "You receive a quotation with landed cost and lead time.",
    ],
    footnote: "A named sourcing specialist owns your project.",
    /** The mobile artboard collapses the timeline into one line. */
    mobileSummary:
      "We read your request → we shortlist and audit factories → you receive a quotation with landed cost and lead time.",
  },
} as const;

/** TODO(copy): page title and description. */
export const REQUEST_META = {
  title: "Start a sourcing request",
  description:
    "Tell us what you need made. Three short steps, no account and no obligation.",
} as const;
