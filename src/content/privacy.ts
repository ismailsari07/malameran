/**
 * TODO(legal): THIS IS TEMPLATE TEXT. It has not been reviewed by a lawyer.
 *
 * It is a generic privacy policy for a Canadian company running a business
 * website that collects contact details and project enquiries through forms.
 * It must be replaced with reviewed copy before or shortly after launch —
 * tracked as a Phase 1 Stage B item in docs/tasks/.
 *
 * Every `[PLACEHOLDER: ...]` below is a fact the client has to supply. Do not
 * guess at them; they render visibly on the page on purpose.
 *
 * The page carries the same disclosure visibly, in an info panel above the
 * document. Do not remove it without replacing the text.
 */

import type { LegalDoc } from "@/components/sections/legal-body";
import { FOOTER_CONTACT } from "@/content/nav";

export const PRIVACY: LegalDoc = {
  hero: {
    eyebrow: "Legal",
    heading: "Privacy policy",
    lead: "What we collect when you use this website, why we collect it, and what you can ask us to do with it.",
  },

  lastUpdated:
    "Effective [PLACEHOLDER: effective date]. Template pending legal review.",

  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "This website is operated by [PLACEHOLDER: registered legal entity name], a company registered in Ontario, Canada. In this policy, “we” and “us” mean that company.",
        `If you have a question about this policy or about your personal information, write to ${FOOTER_CONTACT.email}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "We collect only what you give us, plus a small amount of technical information that any website receives when a page loads.",
      ],
      bullets: [
        "Information you type into a form: your name, company, email address, phone number if you provide one, and the content of your enquiry or application.",
        "Files you attach to a sourcing request, such as specifications, drawings or photographs.",
        "Technical information sent by your browser: IP address, browser type, and the pages you requested. This is used to keep the site running and to limit automated abuse.",
        "[PLACEHOLDER: analytics data, once an analytics provider is chosen — see the Analytics and cookies section].",
      ],
    },
    {
      heading: "Why we collect it",
      paragraphs: [
        "We use the information you submit to answer your enquiry, to prepare and run a sourcing project for you, and to assess supplier applications. We use technical information to operate and secure the site.",
        "We do not sell personal information, and we do not use it to build advertising profiles.",
      ],
    },
    {
      heading: "Analytics and cookies",
      paragraphs: [
        "[PLACEHOLDER: analytics provider not yet selected.] Once analytics is in place, this section must state which provider is used, whether it sets cookies, which cookies it sets, and how long they last. [PLACEHOLDER: confirm whether any cookie requires consent under the applicable rules.]",
        "The site does not currently set advertising or cross-site tracking cookies.",
      ],
    },
    {
      heading: "Who else processes your information",
      paragraphs: [
        "We use third-party services to run the website and its forms. Each of them processes information on our behalf under their own terms:",
      ],
      bullets: [
        "Supabase — database, authentication and file storage. [PLACEHOLDER: hosting region and data-processing agreement status.]",
        "Vercel — website hosting and delivery. [PLACEHOLDER: hosting region and data-processing agreement status.]",
        "Resend — transactional email, used to send confirmations and internal notifications. [PLACEHOLDER: hosting region and data-processing agreement status.]",
        "[PLACEHOLDER: analytics provider, once selected.]",
      ],
    },
    {
      heading: "Where your information is stored",
      paragraphs: [
        "[PLACEHOLDER: confirm the storage regions for each service above, and state plainly whether personal information leaves Canada.] Where information is processed outside Canada, it is subject to the laws of the country it is processed in.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep form submissions and project records for as long as we need them for the purpose they were collected for, and then delete them.",
        "[PLACEHOLDER: retention period for enquiry and form submissions.] [PLACEHOLDER: retention period for account and project data.]",
      ],
    },
    {
      heading: "How we protect it",
      paragraphs: [
        "Access to submitted information is restricted to the people who need it to do the work. Data is transmitted over encrypted connections, uploaded files are not publicly readable, and access to project records is enforced in the database rather than only in the interface.",
        "No system is perfectly secure, and we do not claim otherwise.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. You can also withdraw consent to our use of it, though that may mean we can no longer run a project for you.",
        `To make a request, write to ${FOOTER_CONTACT.email}. We will respond within [PLACEHOLDER: response window for access and deletion requests].`,
      ],
    },
    {
      heading: "The law that applies",
      paragraphs: [
        "Ontario has no private-sector privacy statute of its own, so the federal Personal Information Protection and Electronic Documents Act (PIPEDA) applies to our commercial activities. [PLACEHOLDER: confirm PIPEDA is the correct regime for the client's circumstances, and whether a designated privacy officer is required or appointed.]",
        "If you are not satisfied with how we have handled your information, you may complain to the Office of the Privacy Commissioner of Canada.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If we change this policy we will update the effective date at the top of this page. Material changes will be described here rather than made silently.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `Questions about this policy: ${FOOTER_CONTACT.email}, ${FOOTER_CONTACT.location}.`,
      ],
    },
  ],
};

/** TODO(copy): page title and description. */
export const PRIVACY_META = {
  title: "Privacy policy",
  description:
    "What we collect when you use this website, why we collect it, and what you can ask us to do with it.",
} as const;
