import type { Metadata } from "next";

import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { CONTACT, CONTACT_META } from "@/content/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: CONTACT_META.title,
  description: CONTACT_META.description,
  path: "/contact",
});

/**
 * The one marketing page that does not close on --dark-strong. The visitor is
 * already doing what a closing CTA would ask them to do, so the artboard ends
 * on the form. Recorded in docs/design.md.
 */
export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow={CONTACT.hero.eyebrow}
        heading={CONTACT.hero.heading}
        lead={CONTACT.hero.lead}
        ground="hero-form"
        rhythm="compact-hero"
        headingRole="contact"
        headingClassName="max-w-[820px]"
        leadClassName="max-w-[620px]"
      />
      <ContactForm />
    </main>
  );
}
