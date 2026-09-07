"use client";

import { useRef, useState } from "react";

import { ChipsField } from "@/components/form/chips-field";
import { FileField, type UploadState } from "@/components/form/file-field";
import { FormNav } from "@/components/form/form-nav";
import {
  SubmissionBanner,
  type BannerKind,
} from "@/components/form/submission-banner";
import { StepProgress } from "@/components/form/step-progress";
import {
  DateField,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/form/text-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rule } from "@/components/ui/rule";
import { Turnstile, type TurnstileHandle } from "@/components/form/turnstile";
import { uploadToSignedUrl } from "@/components/form/upload";
import { REQUEST_FORM } from "@/content/request-form";
import { sourcingRequestSchema } from "@/lib/schemas/sourcing-request";

import { RequestSuccess } from "./request-success";

/**
 * The sourcing request form.
 *
 * The only client component on /request. The page stays a server component and
 * so does the sidebar, which arrives here as a prop: this component owns the
 * grid and the heading because the success state replaces all three, and a
 * parent that does not know the state cannot render them.
 *
 * Submission order is fixed and must not be rearranged: the server verifies
 * Turnstile and the rate limiter BEFORE writing anything, so a rejected
 * submission leaves no trace. Once the row exists, every failure path still
 * surfaces the reference — nobody is told their request failed when it is in
 * the database.
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

type Banner =
  | { kind: Exclude<BannerKind, "after-write"> }
  | { kind: "after-write"; reference: string };

export function RequestForm({
  turnstileSiteKey,
  sidebar,
}: {
  turnstileSiteKey: string;
  /** Rendered as given — a server component passed down through this island. */
  sidebar: React.ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [issueCounts, setIssueCounts] = useState<number[]>([0, 0, 0]);
  const [announcement, setAnnouncement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [uploads, setUploads] = useState<Record<number, UploadState>>({});
  const [success, setSuccess] = useState<{
    reference: string;
    rejectedFiles: { filename: string; reason: string }[];
  } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
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
    // Chips groups carry no `name`, so fall back to the data attribute they do
    // carry. Both are scoped to this card.
    const control =
      cardRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
      cardRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
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

    // Unreachable: the nav's advance button is hidden on the last step, which
    // submits from the card body instead.
    if (lastStep) return;

    const next = step + 1;
    setStep(next);
    setErrors({});
    setAnnouncement(
      `Step ${next + 1} of ${total}, ${REQUEST_FORM.steps[next]?.label}.`,
    );
  };

  /**
   * The submission, in the fixed order. Each numbered comment is a step from
   * the flow in docs/decisions.md.
   */
  const submit = async (isRetryAfterExpiry = false) => {
    // Client validation first: it costs nothing and spares a round trip. The
    // server runs the same schema again as the actual control.
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setIssueCounts((prev) =>
        prev.map((c, i) => (i === step ? Object.keys(stepErrors).length : c)),
      );
      focusFirstError(stepErrors);
      return;
    }

    setSubmitting(true);
    setBanner(null);

    // 1. A fresh token at submit time, so its short lifetime never elapses
    //    while the form is being filled.
    const token = await turnstileRef.current?.getToken();
    if (!token) {
      setSubmitting(false);
      setBanner({ kind: "turnstile" });
      return;
    }

    let created: {
      requestId: string;
      reference: string;
      submissionToken: string;
      uploads: { index: number; signedUrl: string }[];
    };

    try {
      // 2-6. Verify, limit, validate, insert, sign uploads.
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken: token,
          values: toSchemaInput(values),
          files: files.map((file) => ({
            filename: file.name,
            mimeType: file.type || undefined,
            sizeBytes: file.size,
          })),
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
          setIssueCounts((prev) =>
            prev.map((c, i) =>
              i === step ? Object.keys(body.fieldErrors ?? {}).length : c,
            ),
          );
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

    // From here the row EXISTS. Every remaining failure path must surface the
    // reference rather than telling the user their request failed.
    let rejectedFiles: { filename: string; reason: string }[] = [];

    try {
      // 7. Direct to Storage, one signed URL per file.
      await Promise.all(
        created.uploads.map(async (upload) => {
          const file = files[upload.index];
          if (!file) return;
          const handle = uploadToSignedUrl({
            signedUrl: upload.signedUrl,
            file,
            onProgress: (percent) =>
              setUploads((prev) => ({
                ...prev,
                [upload.index]: { percent, cancel: handle.cancel },
              })),
          });
          setUploads((prev) => ({
            ...prev,
            [upload.index]: { percent: 0, cancel: handle.cancel },
          }));
          await handle.done.catch(() => undefined);
        }),
      );

      // 8-9. Tell the server the uploads finished; it verifies the bytes and
      //      deletes anything that fails.
      const verified = await fetch("/api/request/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: created.requestId,
          submissionToken: created.submissionToken,
        }),
      });
      if (verified.ok) {
        const body = (await verified.json()) as {
          rejected?: { filename: string; reason: string }[];
        };
        rejectedFiles = body.rejected ?? [];
      }
    } catch {
      // The request is saved. Say so, with its reference.
      setSubmitting(false);
      setBanner({ kind: "after-write", reference: created.reference });
      return;
    }

    // 10. Success.
    setSubmitting(false);
    setSuccess({ reference: created.reference, rejectedFiles });
    setAnnouncement(`Request received. Reference ${created.reference}.`);
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

  // The artboard's success state is the whole page: no heading, no sidebar, no
  // form. Its band is 96px rather than the form's 72px at the top.
  if (success) {
    return (
      <div className="pt-9 pb-14 lg:pt-24 lg:pb-26">
        <RequestSuccess
          reference={success.reference}
          email={values.email}
          rejectedFiles={success.rejectedFiles}
        />
      </div>
    );
  }

  const bannerCopy =
    banner === null
      ? null
      : banner.kind === "rate-limited"
        ? REQUEST_FORM.errors.rateLimited
        : banner.kind === "turnstile"
          ? REQUEST_FORM.errors.turnstile
          : banner.kind === "validation"
            ? REQUEST_FORM.errors.validation
            : banner.kind === "after-write"
              ? {
                  heading: REQUEST_FORM.errors.afterWrite.heading,
                  body: REQUEST_FORM.errors.afterWrite.body(banner.reference),
                }
              : REQUEST_FORM.errors.server;

  return (
    <div className="pt-9 pb-14 lg:pt-18 lg:pb-26">
      <h1 className="t-h1-request text-ink">{REQUEST_FORM.page.heading}</h1>
      <p className="t-lead text-muted mt-3.5 lg:mt-4.5">
        {REQUEST_FORM.page.lead}
      </p>

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
              <StepProgress current={step} issueCounts={issueCounts} />
              <Rule tone="form" className="mt-7 mb-8 lg:mt-7.5" />

              {/* Announces step changes and blocked advances to screen readers. */}
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
                      addPlaceholder={
                        requirements.certifications.addPlaceholder
                      }
                      value={values.certifications}
                      error={errors.certifications}
                      onChange={(v) => setField("certifications", v)}
                    />
                    <FileField
                      name="files"
                      label={requirements.files.label}
                      value={files}
                      onChange={setFiles}
                      uploads={uploads}
                      locked={submitting}
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
                      <Button
                        block
                        submitting={submitting}
                        onClick={() => void submit()}
                      >
                        {submitting
                          ? contact.submittingLabel
                          : contact.submitLabel}
                      </Button>
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={turnstileSiteKey}
                      />
                      <p className="t-node-body text-muted mt-3.5 text-center">
                        {submitting
                          ? contact.submittingNote
                          : contact.reassurance}
                      </p>
                    </div>
                  </div>
                ) : null}
              </fieldset>

              <FormNav
                current={step}
                total={total}
                disabled={submitting}
                onBack={goBack}
                onNext={goNext}
                nextLabel={
                  // The last step submits from the card body; a second advance
                  // button here would be a competing affordance. Regressed once
                  // already when this block was rewritten — keep the guard explicit.
                  lastStep
                    ? null
                    : step === total - 2
                      ? REQUEST_FORM.nav.review
                      : REQUEST_FORM.nav.continue
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
