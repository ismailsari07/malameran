/**
 * TODO(legal): THIS IS TEMPLATE TEXT. It has not been reviewed by a lawyer.
 *
 * It is a generic set of website terms for a Canadian company. It covers the
 * use of this website only — it is not the agreement under which a sourcing
 * project is run, which is a separate signed contract. It must be replaced with
 * reviewed copy before or shortly after launch, tracked as a Phase 1 Stage B
 * item in docs/tasks/.
 *
 * Every `[PLACEHOLDER: ...]` below is a fact the client has to supply. They
 * render visibly on the page on purpose.
 *
 * The page carries the same disclosure visibly, in an info panel above the
 * document. Do not remove it without replacing the text.
 */

import type { LegalDoc } from "@/components/sections/legal-body";
import { FOOTER_CONTACT } from "@/content/nav";

export const TERMS: LegalDoc = {
  hero: {
    eyebrow: "Legal",
    heading: "Terms of service",
    lead: "The terms on which you may use this website, and the limits of what it promises.",
  },

  lastUpdated:
    "Effective [PLACEHOLDER: effective date]. Template pending legal review.",

  sections: [
    {
      heading: "These terms",
      paragraphs: [
        "This website is operated by [PLACEHOLDER: registered legal entity name], a company registered in Ontario, Canada. By using the site you agree to these terms. If you do not agree to them, do not use the site.",
        "These terms cover the website only. A sourcing project is governed by a separate written agreement, and where that agreement and these terms disagree, the agreement takes precedence. [PLACEHOLDER: confirm this precedence clause matches the client's actual contract.]",
      ],
    },
    {
      heading: "Using the site",
      paragraphs: [
        "You may use this site to learn about our services and to contact us. You may not:",
      ],
      bullets: [
        "Submit false information, or impersonate another person or company.",
        "Attempt to gain access to accounts, data or systems that are not yours.",
        "Interfere with the operation of the site, including by automated scraping, flooding forms, or probing for vulnerabilities.",
        "Use the site or anything on it to break the law.",
      ],
    },
    {
      heading: "What you send us",
      paragraphs: [
        "You keep ownership of the specifications, drawings, photographs and other material you send us. You give us permission to use that material for the purpose you sent it for — assessing your enquiry and running your project — and for nothing else.",
        "You confirm that you have the right to send us what you send, and that doing so does not breach someone else's rights.",
      ],
    },
    {
      heading: "Enquiries are not a contract",
      paragraphs: [
        "Submitting a form on this site does not create a contract, oblige us to take on your project, or commit either of us to a price. Nothing is agreed until it is agreed in writing.",
        "Timelines, ranges and figures shown on this site are indicative. They are not quotations.",
      ],
    },
    {
      heading: "Our content",
      paragraphs: [
        "The text, design and layout of this site belong to us. You may read, print and share pages for your own use. You may not copy the site or substantial parts of it to build a competing service.",
      ],
    },
    {
      heading: "No warranty",
      paragraphs: [
        "The site is provided as it is. We do not promise that it will always be available, that it will be free of errors, or that the information on it is complete or current at the moment you read it.",
        "To the extent the law allows, we exclude implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the extent the law allows, we are not liable for indirect, incidental or consequential loss arising from your use of this website, including lost profits, lost business or lost data.",
        "Nothing in these terms limits liability that cannot lawfully be limited. [PLACEHOLDER: confirm whether a liability cap applies, and whether it should be stated here or left to the project agreement.]",
      ],
    },
    {
      heading: "Links to other sites",
      paragraphs: [
        "Where this site links to a third party, we do not control that site and are not responsible for its content or its handling of your information.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: [
        "How we handle personal information is set out in our privacy policy, which forms part of these terms.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "We may update these terms. The effective date at the top of this page shows when they last changed. Continuing to use the site after a change means you accept the updated terms.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply in it. [PLACEHOLDER: confirm the specific courts that have jurisdiction, and whether the client wants an exclusive-jurisdiction clause.]",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `Questions about these terms: ${FOOTER_CONTACT.email}, ${FOOTER_CONTACT.location}.`,
      ],
    },
  ],
};

/** TODO(copy): page title and description. */
export const TERMS_META = {
  title: "Terms of service",
  description:
    "The terms on which you may use this website, and the limits of what it promises.",
} as const;
