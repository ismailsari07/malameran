/**
 * Sourcing request success screen copy.
 * TODO(copy): every string below.
 */

export const REQUEST_SUCCESS = {
  eyebrow: "Request received",
  heading: "Your request is with a sourcing specialist.",
  /** The reference is rendered in bold between these two halves. */
  leadBefore: "Reference ",
  leadAfter:
    ". A named specialist reviews it and replies within two business days — with questions if anything is missing, or with a shortlist if it is not.",

  next: {
    eyebrow: "What happens next",
    rows: [
      {
        timeframe: "Within 2 business days",
        detail: "A specialist replies with questions or a factory shortlist.",
      },
      {
        timeframe: "1–2 weeks",
        detail:
          "Audited options and a quotation with landed cost and lead time.",
      },
    ],
  },

  /**
   * Restored in block 9, now that mail actually sends. The artboard's own
   * wording, with one correction: it reads sourcing@malameran.com, which is not
   * a mailbox anyone has confirmed exists.
   */
  confirmationEmail: (email: string) =>
    `A confirmation email is on its way to ${email}. If it does not arrive within the hour, check your spam folder or write to info@malameran.com.`,

  /** Shown only when a file was refused after upload. */
  filesRejected: {
    heading: "Some attachments could not be kept.",
    body: "Your request was received and is with a specialist. These files were not attached — send them by reply if they matter:",
  },

  returnLink: { label: "Return to the home page", href: "/" },
} as const;
