/**
 * Supplier application success screen copy.
 * TODO(copy): every string below.
 */

export const SUPPLIER_SUCCESS = {
  eyebrow: "Application received",
  heading: "Your application is in the review queue.",
  /** The reference is rendered in bold between these two halves. */
  leadBefore: "Reference ",
  leadAfter: ". We read every application and reply either way.",

  next: {
    eyebrow: "What happens next",
    rows: [
      {
        timeframe: "Within 5 business days",
        detail:
          "A first review, then a document request — licence, certifications, export history.",
      },
      {
        timeframe: "If shortlisted",
        detail: "We arrange an on-site audit before adding you to the network.",
      },
    ],
  },

  /**
   * Restored in block 9, now that mail actually sends. The artboard's own
   * wording, with one correction: it reads suppliers@malameran.com, which is
   * not a mailbox anyone has confirmed exists.
   */
  confirmationEmail: (email: string) =>
    `A confirmation email is on its way to ${email}. If it does not arrive within the hour, check your spam folder or write to info@malameran.com.`,

  returnLink: { label: "Return to the home page", href: "/" },
} as const;
