import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { CONTACT } from "@/content/contact";

const { form, aside } = CONTACT;

/**
 * Contact's dark form and its three sidebar cards, `1fr 420px` gap 64.
 *
 * MARKUP AND STYLING ONLY. There is no submit handler, no validation, no
 * server action and no schema — the button is `type="button"` so it cannot
 * submit. Wiring comes with the schema and rate limiting from block 7 onward.
 *
 * The fields are written inline rather than as a shared <Field>: block 7 owns
 * that API and has to cover the light treatment, errors, hints and the
 * "Optional" tag as well, which one dark form is not enough to design.
 *
 * This is the first real use of the dark field treatment and of
 * `focus:focus-ring-dark`.
 */

/** Control styling shared by the input, select and textarea. */
const CONTROL =
  "rounded-12 w-full border border-white/14 bg-white/[4.5%] px-4 py-[15px] " +
  "t-body text-white outline-none placeholder:text-white/32 focus:focus-ring-dark";

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="t-label mb-2.5 block text-white/90">
      {children}
      {required ? (
        <span aria-hidden="true" className="text-accent">
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

export function ContactForm() {
  return (
    <Section ground="quiet" rhythm="form-band">
      <div className="grid gap-4 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-16">
        <Card
          tone="dark-form"
          pad="22"
          padLg="44-44-48"
          radius={24}
          radiusLg={28}
        >
          <h2 className="t-h2-form-card mb-2 text-white">{form.heading}</h2>
          <p className="t-body-lg mb-7 text-white/60 lg:mb-8">
            {form.introBefore}
            <Link
              href={form.introLinkHref}
              className="text-accent focus-visible:focus-outline underline-offset-4 hover:underline"
            >
              {form.introLinkLabel}
            </Link>
            {form.introAfter}
          </p>

          <form>
            <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
              {form.fields.map((field) => (
                <div key={field.name}>
                  <FieldLabel htmlFor={field.name} required={field.required}>
                    {field.label}
                  </FieldLabel>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={CONTROL}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5.5">
              <FieldLabel
                htmlFor={form.reason.name}
                required={form.reason.required}
              >
                {form.reason.label}
              </FieldLabel>
              <div className="relative">
                <select
                  id={form.reason.name}
                  name={form.reason.name}
                  required={form.reason.required}
                  defaultValue={form.reason.options[0]}
                  className={`${CONTROL} appearance-none pr-11`}
                >
                  {form.reason.options.map((option) => (
                    <option key={option} className="text-select-option">
                      {option}
                    </option>
                  ))}
                </select>
                {/* CSS chevron — the design ships no icons. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4.5 size-[9px] -translate-y-[70%] rotate-45 border-r-2 border-b-2 border-white/50"
                />
              </div>
            </div>

            <div className="mt-5.5">
              <FieldLabel
                htmlFor={form.message.name}
                required={form.message.required}
              >
                {form.message.label}
              </FieldLabel>
              <textarea
                id={form.message.name}
                name={form.message.name}
                rows={form.message.rows}
                placeholder={form.message.placeholder}
                required={form.message.required}
                className={`${CONTROL} resize-y`}
              />
            </div>

            {/* Not wired: type="button" so nothing can be submitted yet. */}
            <Button type="button" block className="mt-8">
              {form.submitLabel}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-4">
          <Card
            tone="dark-aside"
            pad="22"
            padLg="30-28-32"
            radius={20}
            radiusLg={22}
          >
            <Eyebrow tone="dark-45" size="card" className="mb-4 lg:mb-4.5">
              {aside.email.eyebrow}
            </Eyebrow>
            <p className="t-node-body mb-1 text-white/55">
              {aside.email.label}
            </p>
            <a
              href={`mailto:${aside.email.address}`}
              className="t-contact-value hover:text-accent focus-visible:focus-outline text-white transition-colors"
            >
              {aside.email.address}
            </a>
          </Card>

          <Card
            tone="dark-aside"
            pad="22"
            padLg="30-28-32"
            radius={20}
            radiusLg={22}
          >
            <Eyebrow tone="dark-45" size="card" className="mb-4 lg:mb-4.5">
              {aside.office.eyebrow}
            </Eyebrow>
            <p className="t-body-lg text-white">
              {aside.office.lines.map((line, i) => (
                <span key={line}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
            <Rule tone="dark" className="mt-5" />
            <p className="t-fineprint pt-4 text-white/55">
              {aside.office.hours}
            </p>
          </Card>

          <Card
            tone="dark-aside"
            pad="22"
            padLg="30-28-32"
            radius={20}
            radiusLg={22}
          >
            <Eyebrow tone="dark-45" size="card" className="mb-4 lg:mb-4.5">
              {aside.response.eyebrow}
            </Eyebrow>
            <p className="t-stat-figure text-accent">{aside.response.figure}</p>
            <p className="t-body-sm mt-3.5 text-white/60">
              {aside.response.note}
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
