"use client";

import { useRef, useState } from "react";

import { ChipsField } from "@/components/form/chips-field";
import { FileField } from "@/components/form/file-field";
import { FormNav } from "@/components/form/form-nav";
import { StepProgress } from "@/components/form/step-progress";
import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/form/text-fields";
import { Card } from "@/components/ui/card";
import { Rule } from "@/components/ui/rule";
import { REQUEST_FORM } from "@/content/request-form";
import { sourcingRequestSchema } from "@/lib/schemas/sourcing-request";

/**
 * The sourcing request form.
 *
 * The only client component on /request — the page, its heading and the
 * sidebar stay on the server.
 *
 * BLOCK 7A: collects, validates and holds state. There is no submit handler,
 * no upload, no Turnstile and no database. The submit control is inert.
 *
 * There is no partial save and no resume: leaving the page loses the draft.
 * That is deliberate for stage A.
 */

type Values = {
  productDescription: string;
  industry: string;
  requestType: string;
  quantity: string;
  targetPrice: string;
  targetDeliveryDate: string;
  preferredCountry: string;
  certifications: string[];
  contactName: string;
  company: string;
  email: string;
  phone: string;
  note: string;
};

const EMPTY: Values = {
  productDescription: "",
  industry: "",
  requestType: "",
  quantity: "",
  targetPrice: "",
  targetDeliveryDate: "",
  preferredCountry: "",
  certifications: [],
  contactName: "",
  company: "",
  email: "",
  phone: "",
  note: "",
};

/** Which fields each step is responsible for, for per-step validation. */
const STEP_FIELDS = [
  ["productDescription", "industry", "requestType", "quantity"],
  ["targetPrice", "targetDeliveryDate", "preferredCountry", "certifications"],
  ["contactName", "company", "email", "phone", "note"],
] as const satisfies readonly (readonly (keyof Values)[])[];

type Errors = Partial<Record<keyof Values, string>>;

/**
 * Blank optional fields are absent, not empty strings — the schema treats ""
 * as undefined and the database stores NULL.
 */
function toSchemaInput(values: Values) {
  const blankToUndefined = (v: string) => (v.trim() === "" ? undefined : v);
  return {
    productDescription: values.productDescription,
    contactName: values.contactName,
    email: values.email,
    company: blankToUndefined(values.company),
    phone: blankToUndefined(values.phone),
    industry: blankToUndefined(values.industry),
    requestType: blankToUndefined(values.requestType),
    quantity: blankToUndefined(values.quantity),
    targetPrice: blankToUndefined(values.targetPrice),
    targetDeliveryDate: blankToUndefined(values.targetDeliveryDate),
    preferredCountry: blankToUndefined(values.preferredCountry),
    certifications: values.certifications.length
      ? values.certifications
      : undefined,
    note: blankToUndefined(values.note),
  };
}

/**
 * Validates one step against the same schema the server uses — `.pick()` over
 * that step's fields. There is no second, client-only schema.
 */
function validateStep(step: number, values: Values): Errors {
  const fields = STEP_FIELDS[step] ?? [];
  const mask = Object.fromEntries(fields.map((f) => [f, true]));
  const result = sourcingRequestSchema
    .pick(mask as never)
    .safeParse(toSchemaInput(values));

  if (result.success) return {};

  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof Values | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function RequestForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [issueCounts, setIssueCounts] = useState<number[]>([0, 0, 0]);
  const [announcement, setAnnouncement] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const total = REQUEST_FORM.steps.length;
  const lastStep = step === total - 1;

  /**
   * A field that has already errored re-validates as the user types, so the
   * message clears the moment it is fixed. Fields that have not errored stay
   * quiet until the step is advanced.
   */
  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (errors[key]) {
      const revalidated = validateStep(step, next);
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest[key];
        return revalidated[key] ? { ...rest, [key]: revalidated[key] } : rest;
      });
    }
  };

  const focusFirstError = (stepErrors: Errors) => {
    const fields = STEP_FIELDS[step] ?? [];
    const firstKey = fields.find((f) => stepErrors[f]);
    if (!firstKey) return;
    const control = cardRef.current?.querySelector<HTMLElement>(
      `[name="${firstKey}"]`,
    );
    control?.focus();
  };

  const goNext = () => {
    const stepErrors = validateStep(step, values);
    const count = Object.keys(stepErrors).length;

    setErrors(stepErrors);
    setIssueCounts((prev) => prev.map((c, i) => (i === step ? count : c)));

    if (count > 0) {
      setAnnouncement(
        `${count} ${count === 1 ? "field needs" : "fields need"} attention before you can continue.`,
      );
      focusFirstError(stepErrors);
      return;
    }

    if (lastStep) return; // Submitting is block 7b.

    const next = step + 1;
    setStep(next);
    setErrors({});
    setAnnouncement(
      `Step ${next + 1} of ${total}, ${REQUEST_FORM.steps[next]?.label}.`,
    );
  };

  const goBack = () => {
    if (step === 0) return;
    const previous = step - 1;
    setStep(previous);
    setErrors({});
    setAnnouncement(
      `Step ${previous + 1} of ${total}, ${REQUEST_FORM.steps[previous]?.label}.`,
    );
  };

  const need = REQUEST_FORM.need;
  const requirements = REQUEST_FORM.requirements;
  const contact = REQUEST_FORM.contact;

  return (
    <Card
      tone="surface"
      pad="22"
      padLg="36-40-40"
      radius={18}
      radiusLg={24}
      className="min-w-0"
    >
      <div ref={cardRef}>
        <StepProgress current={step} issueCounts={issueCounts} />
        <Rule tone="form" className="mt-7 mb-8 lg:mt-7.5" />

        {/* Announces step changes and blocked advances to screen readers. */}
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>

        {/* Nothing submits in this block; the fieldset is where 7b will lock. */}
        <fieldset className="min-w-0 border-0 p-0">
          {step === 0 ? (
            <div className="flex flex-col gap-5.5 lg:gap-6.5">
              <TextareaField
                name="productDescription"
                label={need.productDescription.label}
                description={need.productDescription.description}
                placeholder={need.productDescription.placeholder}
                rows={6}
                value={values.productDescription}
                error={errors.productDescription}
                onChange={(v) => setField("productDescription", v)}
              />
              <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
                <SelectField
                  name="industry"
                  label={need.industry.label}
                  optional
                  placeholder={need.industry.placeholder}
                  options={need.industry.options}
                  value={values.industry}
                  error={errors.industry}
                  onChange={(v) => setField("industry", v)}
                />
                <SelectField
                  name="requestType"
                  label={need.requestType.label}
                  optional
                  placeholder={need.requestType.placeholder}
                  options={need.requestType.options}
                  value={values.requestType}
                  error={errors.requestType}
                  onChange={(v) => setField("requestType", v)}
                />
              </div>
              <div className="lg:max-w-[400px]">
                <TextField
                  name="quantity"
                  label={need.quantity.label}
                  optional
                  placeholder={need.quantity.placeholder}
                  hint={need.quantity.hint}
                  value={values.quantity}
                  error={errors.quantity}
                  onChange={(v) => setField("quantity", v)}
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-5.5 lg:gap-6.5">
              <Card tone="info" pad="16-18" radius={14}>
                <p className="t-body text-text-body-alt">
                  {requirements.notice}
                </p>
              </Card>
              <div className="grid gap-5.5 lg:grid-cols-2 lg:gap-x-6">
                <TextField
                  name="targetPrice"
                  label={requirements.targetPrice.label}
                  placeholder={requirements.targetPrice.placeholder}
                  value={values.targetPrice}
                  error={errors.targetPrice}
                  onChange={(v) => setField("targetPrice", v)}
                />
                <DateField
                  name="targetDeliveryDate"
                  label={requirements.targetDeliveryDate.label}
                  value={values.targetDeliveryDate}
                  error={errors.targetDeliveryDate}
                  onChange={(v) => setField("targetDeliveryDate", v)}
                />
              </div>
              <div className="lg:max-w-[480px]">
                <SelectField
                  name="preferredCountry"
                  label={requirements.preferredCountry.label}
                  placeholder={requirements.preferredCountry.placeholder}
                  options={requirements.preferredCountry.options}
                  value={values.preferredCountry}
                  error={errors.preferredCountry}
                  onChange={(v) => setField("preferredCountry", v)}
                />
              </div>
              <ChipsField
                name="certifications"
                label={requirements.certifications.label}
                suggestions={requirements.certifications.suggestions}
                addPlaceholder={requirements.certifications.addPlaceholder}
                value={values.certifications}
                error={errors.certifications}
                onChange={(v) => setField("certifications", v)}
              />
              <FileField
                name="files"
                label={requirements.files.label}
                value={files}
                onChange={setFiles}
              />
            </div>
          ) : null}

          {step === 2 ? (
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
                  name="company"
                  label={contact.company.label}
                  optional
                  placeholder={contact.company.placeholder}
                  value={values.company}
                  error={errors.company}
                  onChange={(v) => setField("company", v)}
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

              <div>
                {/* Inert until block 7b wires the route, upload and Turnstile. */}
                <button
                  type="button"
                  disabled
                  className="t-btn text-on-accent/55 rounded-14 w-full cursor-not-allowed bg-(--accent-disabled) px-7.5 py-[19px]"
                >
                  {contact.submitLabel}
                </button>
                <div className="rounded-12 border-border-reserved mt-3.5 flex min-h-[78px] items-center justify-center border border-dashed px-4 text-center">
                  <p className="t-hint text-disabled">
                    {contact.challengeSlot}
                  </p>
                </div>
                <p className="t-node-body text-muted mt-3.5 text-center">
                  {contact.reassurance}
                </p>
              </div>
            </div>
          ) : null}
        </fieldset>

        <FormNav
          current={step}
          total={total}
          onBack={goBack}
          onNext={goNext}
          nextLabel={
            step === total - 2
              ? REQUEST_FORM.nav.review
              : REQUEST_FORM.nav.continue
          }
        />
      </div>
    </Card>
  );
}
