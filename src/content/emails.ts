/**
 * Every string in the four notification emails.
 * TODO(copy): all of it.
 *
 * The confirmations deliberately echo the success screens. Someone who reads
 * both within a minute of each other must not find them saying different
 * things about what happens next.
 */

/** The one mailbox this project references. See docs/decisions.md. */
export const CONTACT_EMAIL = "info@malameran.com";

export const EMAILS = {
  confirmationSourcing: {
    subject: (reference: string) =>
      `We have your sourcing request (${reference})`,
    heading: "Your request is with a sourcing specialist.",
    intro:
      "Thank you — we have your sourcing request and it is in the queue for a named specialist.",
    nextLabel: "What happens next",
    next: [
      "Within 2 business days: a specialist replies with questions or a factory shortlist.",
      "1–2 weeks: audited options and a quotation with landed cost and lead time.",
    ],
    closing:
      "Nothing else is needed from you right now. Reply to this email if you have anything to add.",
    summaryLabel: "What you sent us",
  },

  confirmationSupplier: {
    subject: (reference: string) =>
      `We have your supplier application (${reference})`,
    heading: "Your application is in the review queue.",
    intro:
      "Thank you — we have your application. We read every one and reply either way.",
    nextLabel: "What happens next",
    next: [
      "Within 5 business days: a first review, then a document request — licence, certifications, export history.",
      "If shortlisted: we arrange an on-site audit before adding you to the network.",
    ],
    closing:
      "Nothing else is needed from you right now. Reply to this email if you have anything to add.",
    summaryLabel: "What you sent us",
  },

  teamSourcing: {
    subject: (reference: string, company: string | undefined) =>
      `New sourcing request ${reference}${company ? ` — ${company}` : ""}`,
    heading: "New sourcing request",
    filesLabel: "Attachments",
    noFiles: "No attachments.",
    /**
     * Files are in a private bucket. No links and no attachments here: a signed
     * URL is a bearer token that outlives nothing and expires long before the
     * email is read, and it would sit in every inbox backup. Retrieval is a
     * dashboard lookup by reference until the admin panel lands in F1-B.
     */
    filesNote: (count: number) =>
      `${count} ${count === 1 ? "file" : "files"} declared, verification in progress. You will get a second email only if one is refused. The files are in the request-files bucket — look the reference up in Supabase to find the folder.`,
    replyNote: "Reply to this email to answer the buyer directly.",
  },

  teamSourcingFiles: {
    subject: (reference: string, count: number) =>
      `${reference} — ${count} ${count === 1 ? "attachment" : "attachments"} refused`,
    heading: "Attachments refused after verification",
    intro:
      "These files did not pass verification and have been deleted from storage. The request itself is unaffected, and the buyer was told on the success screen.",
    keptLabel: "Still attached",
    noneKept: "No attachments were kept.",
  },

  teamSupplier: {
    subject: (reference: string, company: string) =>
      `New supplier application ${reference} — ${company}`,
    heading: "New supplier application",
    replyNote: "Reply to this email to answer the applicant directly.",
  },

  /** Shared footer. Deliberately says nothing that would age badly. */
  footer: "Malameran · sent automatically, because a form was submitted.",
  submittedLabel: "Submitted",
} as const;

/** Field labels for the team emails, matching the form labels the user saw. */
export const FIELD_LABELS = {
  sourcing: {
    productDescription: "Product description",
    industry: "Industry",
    requestType: "Request type",
    quantity: "Quantity",
    targetPrice: "Target price per unit",
    targetDeliveryDate: "Target delivery date",
    preferredCountry: "Preferred manufacturing country",
    certifications: "Required certifications",
    contactName: "Contact name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    note: "Anything else",
  },
  supplier: {
    companyName: "Company name",
    country: "Country",
    manufacturingCategories: "Manufacturing categories",
    monthlyCapacity: "Monthly production capacity",
    website: "Website",
    certifications: "Certifications",
    contactName: "Contact name",
    email: "Email",
    phone: "Phone",
    note: "Notes",
  },
} as const;
