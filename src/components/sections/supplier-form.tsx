"use client";

import { useRef, useState } from "react";

import { ChipsField } from "@/components/form/chips-field";
import {
  SubmissionBanner,
  type BannerKind,
} from "@/components/form/submission-banner";
import {
  SelectField,
  TextField,
  TextareaField,
} from "@/components/form/text-fields";
import { Turnstile, type TurnstileHandle } from "@/components/form/turnstile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { SUPPLIER_FORM } from "@/content/supplier-form";
import { supplierApplicationSchema } from "@/lib/schemas/supplier-application";

import { SupplierSuccess } from "./supplier-success";

/**
 * The supplier application form.
 *
 * The only client component on /suppliers/apply — the page and the sidebar stay
 * on the server, the sidebar arriving as a prop so this component can own the
 * grid and take the whole page over on success. The artboard's success state is
 * a full-width page with no heading, no form and no sidebar, so nothing below
 * the header can be rendered by a parent that does not know the state.
 *
 * One step and no files, so the submission is a single round trip. The server
 * still verifies Turnstile and the rate limiter before writing anything, and
 * validates with the same schema used here — client validation is a courtesy,
 * not a control.
 *
 * There is no partial save and no resume: leaving the page loses the draft.
 * That is deliberate for stage A.
 */

type Values = {
  companyName: string;
  country: string;
  manufacturingCategories: string[];
  monthlyCapacity: string;
  website: string;
  certifications: string[];
  contactName: string;
  email: string;
  phone: string;
  note: string;
};

const EMPTY: Values = {
  companyName: "",
  country: "",
  manufacturingCategories: [],
  monthlyCapacity: "",
  website: "",
  certifications: [],
  contactName: "",
  email: "",
  phone: "",
  note: "",
};

/** The order errors are announced and focused in — the order they are rendered. */
const FIELD_ORDER = [
  "companyName",
  "country",
  "manufacturingCategories",
  "monthlyCapacity",
  "website",
  "certifications",
  "contactName",
  "email",
  "phone",
  "note",
] as const satisfies readonly (keyof Values)[];

type Errors = Partial<Record<keyof Values, string>>;

/**
 * Blank optional fields are absent, not empty strings — the schema treats ""
 * as undefined and the database stores NULL.
 */
function toSchemaInput(values: Values) {
  const blankToUndefined = (v: string) => (v.trim() === "" ? undefined : v);
  return {
    companyName: values.companyName,
    country: values.country,
    manufacturingCategories: values.manufacturingCategories,
    contactName: values.contactName,
    email: values.email,
    monthlyCapacity: blankToUndefined(values.monthlyCapacity),
    website: blankToUndefined(values.website),
    certifications: values.certifications.length
      ? values.certifications
      : undefined,
    phone: blankToUndefined(values.phone),
    note: blankToUndefined(values.note),
  };
}

/** Validates against the same schema the server uses. There is no second one. */
function validate(values: Values): Errors {
  const result = supplierApplicationSchema.safeParse(toSchemaInput(values));
  if (result.success) return {};

  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof Values | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

type Banner =
  | { kind: Exclude<BannerKind, "after-write"> }
  | { kind: "after-write"; reference: string | null };

export function SupplierForm({
  turnstileSiteKey,
  sidebar,
}: {
  turnstileSiteKey: string;
  /** Rendered as given — a server component passed down through this island. */
  sidebar: React.ReactNode;
}) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [announcement, setAnnouncement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  /**
   * A field that has already errored re-validates as the user types, so the
   * message clears the moment it is fixed. Fields that have not errored stay
   * quiet until submit.
   */
  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (errors[key]) {
      const revalidated = validate(next);
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest[key];
        return revalidated[key] ? { ...rest, [key]: revalidated[key] } : rest;
      });
    }
  };

  const focusFirstError = (fieldErrors: Errors) => {
    const firstKey = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (!firstKey) return;
    // Chips groups carry no `name`, so fall back to the data attribute they do
    // carry. Both are scoped to this card.
    const control =
      cardRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
      cardRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
    control?.focus();
  };

  const submit = async (isRetryAfterExpiry = false) => {
    // Client validation first: it costs nothing and spares a round trip. The
    // server runs the same schema again as the actual control.
    const fieldErrors = validate(values);
    const count = Object.keys(fieldErrors).length;
    if (count > 0) {
      setErrors(fieldErrors);
      setAnnouncement(
        `${count} ${count === 1 ? "field needs" : "fields need"} attention before you can submit.`,
      );
      focusFirstError(fieldErrors);
      return;
    }

    setSubmitting(true);
    setBanner(null);

    // A fresh token at submit time, so its short lifetime never elapses while
    // the form is being filled.
    const token = await turnstileRef.current?.getToken();
    if (!token) {
      setSubmitting(false);
      setBanner({ kind: "turnstile" });
      return;
    }

    let created: { reference: string };

    try {
      // Verify, limit, validate, insert — in that order, server-side.
      const response = await fetch("/api/supplier-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken: token,
          values: toSchemaInput(values),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
          fieldErrors?: Errors;
        };

        // The token was spent or expired between issue and use. getToken()
        // resets the widget itself, and its in-flight guard means this cannot
        // collide with the execute() that produced the first token.
        if (body.error === "turnstile-expired" && !isRetryAfterExpiry) {
          setSubmitting(false);
          void submit(true);
          return;
        }

        setSubmitting(false);
        if (body.error === "validation" && body.fieldErrors) {
          setErrors(body.fieldErrors);
          setBanner({ kind: "validation" });
          focusFirstError(body.fieldErrors);
          return;
        }
        setBanner({
          kind:
            body.error === "rate-limited"
              ? "rate-limited"
              : body.error === "turnstile" || body.error === "turnstile-expired"
                ? "turnstile"
                : "server",
        });
        return;
      }

      created = await response.json();
    } catch {
      setSubmitting(false);
      setBanner({ kind: "server" });
      return;
    }

    // The row EXISTS from here. Nothing follows the insert on this form, so
    // there is no failure path left that could need the after-write banner —
    // but a malformed success body would land here, and it must not be
    // reported as a failure.
    setSubmitting(false);
    if (!created?.reference) {
      setBanner({ kind: "after-write", reference: null });
      return;
    }

    setReference(created.reference);
    setAnnouncement(`Application received. Reference ${created.reference}.`);
  };

  const { factory, contact, page } = SUPPLIER_FORM;

  // The artboard's success state is the whole page: no heading, no sidebar, no
  // form. Its band is 96px rather than the form's 72px at the top.
  if (reference !== null) {
    return (
      <div className="pt-9 pb-14 lg:pt-24 lg:pb-26">
        <SupplierSuccess reference={reference} email={values.email} />
      </div>
    );
  }

  const bannerCopy =
    banner === null
      ? null
      : banner.kind === "rate-limited"
        ? SUPPLIER_FORM.errors.rateLimited
        : banner.kind === "turnstile"
          ? SUPPLIER_FORM.errors.turnstile
          : banner.kind === "validation"
            ? SUPPLIER_FORM.errors.validation
            : banner.kind === "after-write"
              ? {
                  heading: SUPPLIER_FORM.errors.afterWrite.heading,
                  body: SUPPLIER_FORM.errors.afterWrite.body(banner.reference),
                }
              : SUPPLIER_FORM.errors.server;

  return (
    <div className="pt-9 pb-14 lg:pt-18 lg:pb-26">
      <h1 className="t-h1-apply text-ink">{page.heading}</h1>
      <p className="t-lead text-muted mt-3.5 lg:mt-4.5">{page.lead}</p>

      <div className="mt-6 grid gap-6 lg:mt-13 lg:grid-cols-[minmax(0,1fr)_372px] lg:items-start lg:gap-12">
        {/* Mobile puts the sidebar above the form, per the 375 artboard. */}
        <div className="lg:order-2">{sidebar}</div>

        <div className="lg:order-1">
          <Card
            tone="surface"
            pad="22"
            padLg="36-40-40"
            radius={18}
            radiusLg={24}
            className="min-w-0"
          >
            <div ref={cardRef}>
              {/* Announces blocked submissions to screen readers. */}
              <p aria-live="polite" className="sr-only">
                {announcement}
              </p>

              {bannerCopy && banner ? (
                <SubmissionBanner
                  kind={banner.kind}
                  heading={bannerCopy.heading}
                  body={bannerCopy.body}
                  onRetry={() => void submit()}
                />
              ) : null}

              {/* The whole form locks while submitting: native disabled semantics. */}
              <fieldset
                disabled={submitting}
                className="min-w-0 border-0 p-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <Eyebrow tone="muted-paper" size="card">
                  {factory.eyebrow}
                </Eyebrow>
                <Rule tone="form" className="mt-4.5 mb-6.5" />

                <div className="flex flex-col gap-5.5 lg:gap-6.5">
                  <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
                    <TextField
                      name="companyName"
                      label={factory.companyName.label}
                      placeholder={factory.companyName.placeholder}
                      value={values.companyName}
                      error={errors.companyName}
                      onChange={(v) => setField("companyName", v)}
                    />
                    <SelectField
                      name="country"
                      label={factory.country.label}
                      placeholder={factory.country.placeholder}
                      options={factory.country.options}
                      value={values.country}
                      error={errors.country}
                      onChange={(v) => setField("country", v)}
                    />
                  </div>

                  <ChipsField
                    name="manufacturingCategories"
                    label={factory.manufacturingCategories.label}
                    suggestions={factory.manufacturingCategories.suggestions}
                    addPlaceholder={
                      factory.manufacturingCategories.addPlaceholder
                    }
                    maxLength={120}
                    value={values.manufacturingCategories}
                    error={errors.manufacturingCategories}
                    onChange={(v) => setField("manufacturingCategories", v)}
                  />

                  <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
                    <TextField
                      name="monthlyCapacity"
                      label={factory.monthlyCapacity.label}
                      optional
                      placeholder={factory.monthlyCapacity.placeholder}
                      value={values.monthlyCapacity}
                      error={errors.monthlyCapacity}
                      onChange={(v) => setField("monthlyCapacity", v)}
                    />
                    <TextField
                      name="website"
                      label={factory.website.label}
                      optional
                      placeholder={factory.website.placeholder}
                      value={values.website}
                      error={errors.website}
                      onChange={(v) => setField("website", v)}
                    />
                  </div>

                  <ChipsField
                    name="certifications"
                    label={factory.certifications.label}
                    optional
                    suggestions={factory.certifications.suggestions}
                    addPlaceholder={factory.certifications.addPlaceholder}
                    max={20}
                    value={values.certifications}
                    error={errors.certifications}
                    onChange={(v) => setField("certifications", v)}
                  />
                </div>

                <Eyebrow tone="muted-paper" size="card" className="mt-9.5">
                  {contact.eyebrow}
                </Eyebrow>
                <Rule tone="form" className="mt-4.5 mb-6.5" />

                <div className="flex flex-col gap-5.5 lg:gap-6.5">
                  <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
                    <TextField
                      name="contactName"
                      label={contact.contactName.label}
                      placeholder={contact.contactName.placeholder}
                      value={values.contactName}
                      error={errors.contactName}
                      onChange={(v) => setField("contactName", v)}
                    />
                    <TextField
                      name="email"
                      type="email"
                      label={contact.email.label}
                      placeholder={contact.email.placeholder}
                      value={values.email}
                      error={errors.email}
                      onChange={(v) => setField("email", v)}
                    />
                  </div>
                  <div className="lg:max-w-[400px]">
                    <TextField
                      name="phone"
                      type="tel"
                      label={contact.phone.label}
                      optional
                      placeholder={contact.phone.placeholder}
                      value={values.phone}
                      error={errors.phone}
                      onChange={(v) => setField("phone", v)}
                    />
                  </div>
                  <TextareaField
                    name="note"
                    label={contact.note.label}
                    optional
                    placeholder={contact.note.placeholder}
                    rows={4}
                    value={values.note}
                    error={errors.note}
                    onChange={(v) => setField("note", v)}
                  />
                </div>

                <Rule tone="form" className="mt-8.5" />
                <div className="pt-6.5">
                  <Button
                    block
                    submitting={submitting}
                    onClick={() => void submit()}
                  >
                    {submitting ? contact.submittingLabel : contact.submitLabel}
                  </Button>
                  <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} />
                  <p className="t-node-body text-muted mt-3.5 text-center">
                    {submitting ? contact.submittingNote : contact.reassurance}
                  </p>
                </div>
              </fieldset>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
