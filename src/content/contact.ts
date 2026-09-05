/**
 * Contact page copy. Artboard English, verbatim.
 * Every string is `TODO(copy):` for the client to replace.
 */

export type Field = {
  readonly name: string;
  readonly label: string;
  readonly placeholder: string;
  readonly type: "text" | "email" | "tel";
  readonly required: boolean;
};

/** TODO(copy): every string below. */
export const CONTACT = {
  hero: {
    eyebrow: "Contact",
    heading: "Talk to a sourcing specialist.",
    lead: "General questions, partnerships or something that does not fit a form. We reply within two business days.",
  },

  form: {
    heading: "Send a message",
    introBefore: "Sourcing a specific product? The ",
    introLinkLabel: "sourcing request form",
    introLinkHref: "/request",
    introAfter: " gets you a faster answer.",
    /** The paired fields, in artboard order across a two-column grid. */
    fields: [
      {
        name: "name",
        label: "Full Name",
        placeholder: "Jane Doe",
        type: "text",
        required: true,
      },
      {
        name: "company",
        label: "Company Name",
        placeholder: "Acme Industrial",
        type: "text",
        required: false,
      },
      {
        name: "email",
        label: "Email Address",
        placeholder: "jane@company.com",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        placeholder: "+1 555 000 0000",
        type: "tel",
        required: false,
      },
    ] as const satisfies readonly Field[],
    reason: {
      name: "reason",
      label: "Reason for contact",
      required: true,
      options: [
        "Select an option",
        "General enquiry",
        "Existing project",
        "Supplier application",
        "Partnership",
        "Press",
      ],
    },
    message: {
      name: "message",
      label: "Message",
      placeholder: "Tell us what you need and any dates we should work to.",
      required: true,
      rows: 6,
    },
    submitLabel: "Send message",
  },

  aside: {
    /**
     * The artboard splits this into two mailboxes, hello@ for buyers and
     * suppliers@ for suppliers. One mailbox until the client confirms another
     * exists; split routing is a phase 2 question and both forms currently
     * land in the same inbox.
     */
    email: {
      eyebrow: "Email",
      label: "General",
      address: "info@malameran.com",
    },
    office: {
      eyebrow: "Head office",
      // Artboard reads "150 King Street West, Suite 200 / Toronto, Ontario
      // M5H 1J9 / Canada". City and country only.
      lines: ["Toronto, Ontario", "Canada"],
      hours: "Monday to Friday, 09:00–18:00 ET",
    },
    response: {
      eyebrow: "Response time",
      figure: "2 days",
      note: "Every message is read by a sourcing specialist, not a queue.",
    },
  },
} as const;

/** TODO(copy): page title and description. */
export const CONTACT_META = {
  title: "Contact",
  description:
    "Talk to a sourcing specialist. General questions, partnerships, or anything that does not fit a form.",
} as const;
