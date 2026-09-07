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
   * TODO(copy) — BLOCK 9: the artboard reads "A confirmation email is on its
   * way to the address you gave us." Nothing sends yet, and telling someone to
   * expect an email that never arrives is worse than saying nothing: they wait,
   * then assume the application was lost. This says what is actually true.
   * Restore the email wording when Resend is wired.
   */
  keepReference: (reference: string) =>
    `Nothing else is needed from you right now. Quote ${reference} if you write to us about this application.`,

  returnLink: { label: "Return to the home page", href: "/" },
} as const;
