import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import {
  FOOTER_COLUMNS,
  FOOTER_CONTACT,
  FOOTER_COPYRIGHT,
  FOOTER_DESCRIPTION,
  FOOTER_LEGAL,
} from "@/content/nav";

import { Container } from "./container";
import { Wordmark } from "./wordmark";

/**
 * The site footer. Four columns at `1.4fr 1fr 1fr 1.2fr` from `lg`, two on
 * mobile with the contact block dropping below a rule — the 375px artboard's
 * arrangement. Source: design/Site Footer.dc.html.
 *
 * The Contact column carries the address and the mailbox only. There is no
 * phone number and no social links anywhere in the design; do not add
 * placeholders for them.
 */

const LINK =
  "t-footer-link text-white/66 transition-colors hover:text-white focus-visible:focus-outline";

export function SiteFooter() {
  return (
    <footer className="bg-footer border-t border-white/9">
      <Container>
        <div className="pt-11 pb-8 lg:pt-16 lg:pb-9">
          <div className="grid grid-cols-2 gap-7 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
            <div className="col-span-2 lg:col-span-1">
              <Wordmark size="app" />
              <p className="t-footer-note mt-3.5 text-white/50 lg:mt-4 lg:max-w-[280px]">
                {FOOTER_DESCRIPTION}
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <Eyebrow as="h2" tone="muted-dark" size="xs" className="mb-4">
                  {column.heading}
                </Eyebrow>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={LINK}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 mt-1 border-t border-white/9 pt-6 lg:col-span-1 lg:mt-0 lg:border-t-0 lg:pt-0">
              <Eyebrow as="h2" tone="muted-dark" size="xs" className="mb-4">
                Contact
              </Eyebrow>
              <a
                href={`mailto:${FOOTER_CONTACT.email}`}
                className="t-footer-link hover:text-accent focus-visible:focus-outline text-white transition-colors"
              >
                {FOOTER_CONTACT.email}
              </a>
              <p className="t-footer-note mt-3 text-white/50 lg:mt-3.5">
                {FOOTER_CONTACT.location}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-5 border-t border-white/9 pt-6 lg:mt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p className="t-legal text-white/40">{FOOTER_COPYRIGHT}</p>
            <div className="flex gap-5.5 lg:gap-6.5">
              {FOOTER_LEGAL.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="t-legal focus-visible:focus-outline text-white/50 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
