import "server-only";

import { CONTACT_EMAIL, EMAILS, FIELD_LABELS } from "@/content/emails";
import { serverEnv } from "@/lib/env";
import type { Email } from "@/lib/email/send";
import {
  escapeHtml,
  fieldTable,
  fieldText,
  heading,
  paragraph,
  presentFields,
  referenceBlock,
  rule,
  sectionLabel,
  shell,
  type Field,
} from "@/lib/email/layout";
import type { SourcingRequestInput } from "@/lib/schemas/sourcing-request";
import type { SupplierApplicationInput } from "@/lib/schemas/supplier-application";

/**
 * The four notification emails.
 *
 * Each returns a fully-formed `Email`, so a route hands one to `sendEmail` and
 * makes no decisions about subjects, recipients or reply addresses.
 *
 * No user-supplied value reaches a subject line or a header. Subjects carry the
 * server-generated reference and, for the team emails, the company name, which
 * the schema has already bounded and which Resend sends as JSON rather than a
 * raw SMTP header. Everything else is escaped into the body.
 */

/** UTC and unambiguous. A team spread over time zones should not have to guess. */
function timestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function list(values: readonly string[] | undefined): string | undefined {
  return values?.length ? values.join(", ") : undefined;
}

/** A file as the team email describes it. No paths, no ids, no links. */
export type FileLine = {
  filename: string;
  sizeBytes: number;
  status: "pending" | "verified" | "rejected";
  detectedMime?: string | null;
  rejectionReason?: string | null;
};

function fileSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function fileLineText(file: FileLine): string {
  const parts = [file.filename, fileSize(file.sizeBytes)];
  if (file.detectedMime) parts.push(file.detectedMime);
  parts.push(file.status);
  if (file.rejectionReason) parts.push(file.rejectionReason);
  return parts.join(" · ");
}

function fileListHtml(files: readonly FileLine[]): string {
  const rows = files
    .map((file) => {
      const detail = [fileSize(file.sizeBytes), file.detectedMime ?? null]
        .filter(Boolean)
        .join(" · ");
      const status = file.rejectionReason
        ? `${file.status} — ${file.rejectionReason}`
        : file.status;
      return `<tr>
        <td style="padding:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#26251F">
          <strong style="font-weight:600">${escapeHtml(file.filename)}</strong><br>
          <span style="font-size:13px;color:#6C6A66">${escapeHtml(detail)} · ${escapeHtml(status)}</span>
        </td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse">${rows}</table>`;
}

function bullets(items: readonly string[]): string {
  return items
    .map(
      (item) =>
        `<p style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#26251F">${escapeHtml(item)}</p>`,
    )
    .join("");
}

const FOOTER_HTML = escapeHtml(EMAILS.footer);

// ---------------------------------------------------------------------------
// Confirmations
// ---------------------------------------------------------------------------

function confirmation({
  kind,
  copy,
  to,
  reference,
  subject,
  summary,
}: {
  kind: Email["kind"];
  copy: {
    heading: string;
    intro: string;
    nextLabel: string;
    next: readonly string[];
    closing: string;
    summaryLabel: string;
  };
  to: string;
  reference: string;
  subject: string;
  summary: readonly Field[];
}): Email {
  const html = shell({
    body: [
      heading(copy.heading),
      paragraph(escapeHtml(copy.intro)),
      referenceBlock(reference),
      sectionLabel(copy.nextLabel),
      bullets(copy.next),
      rule(),
      sectionLabel(copy.summaryLabel),
      fieldTable(summary),
      paragraph(escapeHtml(copy.closing)),
    ].join("\n"),
    footer: FOOTER_HTML,
  });

  const text = [
    copy.heading,
    "",
    copy.intro,
    "",
    `Reference: ${reference}`,
    "",
    copy.nextLabel,
    ...copy.next.map((n) => `- ${n}`),
    "",
    copy.summaryLabel,
    fieldText(summary),
    "",
    copy.closing,
    "",
    EMAILS.footer,
  ].join("\n");

  return { kind, to, subject, html, text, replyTo: CONTACT_EMAIL, reference };
}

export function sourcingConfirmation(
  values: SourcingRequestInput,
  reference: string,
): Email {
  const L = FIELD_LABELS.sourcing;
  return confirmation({
    kind: "confirmation-sourcing",
    copy: EMAILS.confirmationSourcing,
    to: values.email,
    reference,
    subject: EMAILS.confirmationSourcing.subject(reference),
    summary: presentFields([
      [L.productDescription, values.productDescription],
      [L.quantity, values.quantity],
      [L.preferredCountry, values.preferredCountry],
    ]),
  });
}

export function supplierConfirmation(
  values: SupplierApplicationInput,
  reference: string,
): Email {
  const L = FIELD_LABELS.supplier;
  return confirmation({
    kind: "confirmation-supplier",
    copy: EMAILS.confirmationSupplier,
    to: values.email,
    reference,
    subject: EMAILS.confirmationSupplier.subject(reference),
    summary: presentFields([
      [L.companyName, values.companyName],
      [L.country, values.country],
      [L.manufacturingCategories, list(values.manufacturingCategories)],
    ]),
  });
}

// ---------------------------------------------------------------------------
// Team notifications
// ---------------------------------------------------------------------------

export function sourcingTeamNotification(
  values: SourcingRequestInput,
  reference: string,
  files: readonly FileLine[],
): Email {
  const L = FIELD_LABELS.sourcing;
  const fields = presentFields([
    [EMAILS.submittedLabel, timestamp()],
    [L.contactName, values.contactName],
    [L.company, values.company],
    [L.email, values.email],
    [L.phone, values.phone],
    [L.productDescription, values.productDescription],
    [L.industry, values.industry],
    [L.requestType, values.requestType],
    [L.quantity, values.quantity],
    [L.targetPrice, values.targetPrice],
    [L.targetDeliveryDate, values.targetDeliveryDate],
    [L.preferredCountry, values.preferredCountry],
    [L.certifications, list(values.certifications)],
    [L.note, values.note],
  ]);

  const filesBody = files.length
    ? [
        sectionLabel(EMAILS.teamSourcing.filesLabel),
        fileListHtml(files),
        paragraph(escapeHtml(EMAILS.teamSourcing.filesNote(files.length))),
      ].join("\n")
    : [
        sectionLabel(EMAILS.teamSourcing.filesLabel),
        paragraph(escapeHtml(EMAILS.teamSourcing.noFiles)),
      ].join("\n");

  const html = shell({
    body: [
      heading(EMAILS.teamSourcing.heading),
      referenceBlock(reference),
      fieldTable(fields),
      rule(),
      filesBody,
      paragraph(escapeHtml(EMAILS.teamSourcing.replyNote)),
    ].join("\n"),
    footer: FOOTER_HTML,
  });

  const text = [
    EMAILS.teamSourcing.heading,
    `Reference: ${reference}`,
    "",
    fieldText(fields),
    "",
    EMAILS.teamSourcing.filesLabel,
    files.length
      ? files.map((f) => `- ${fileLineText(f)}`).join("\n") +
        `\n\n${EMAILS.teamSourcing.filesNote(files.length)}`
      : EMAILS.teamSourcing.noFiles,
    "",
    EMAILS.teamSourcing.replyNote,
    "",
    EMAILS.footer,
  ].join("\n");

  return {
    kind: "team-sourcing",
    to: serverEnv.TEAM_NOTIFICATION_EMAIL,
    subject: EMAILS.teamSourcing.subject(reference, values.company),
    html,
    text,
    // So the team can answer the buyer without copying an address out.
    replyTo: values.email,
    reference,
  };
}

/**
 * The follow-up, sent only when verification actually refused something.
 * A request whose files all pass produces no second email.
 */
export function sourcingFilesNotification(
  reference: string,
  rejected: readonly FileLine[],
  kept: readonly FileLine[],
): Email {
  const html = shell({
    body: [
      heading(EMAILS.teamSourcingFiles.heading),
      referenceBlock(reference),
      paragraph(escapeHtml(EMAILS.teamSourcingFiles.intro)),
      fileListHtml(rejected),
      rule(),
      sectionLabel(EMAILS.teamSourcingFiles.keptLabel),
      kept.length
        ? fileListHtml(kept)
        : paragraph(escapeHtml(EMAILS.teamSourcingFiles.noneKept)),
    ].join("\n"),
    footer: FOOTER_HTML,
  });

  const text = [
    EMAILS.teamSourcingFiles.heading,
    `Reference: ${reference}`,
    "",
    EMAILS.teamSourcingFiles.intro,
    "",
    ...rejected.map((f) => `- ${fileLineText(f)}`),
    "",
    EMAILS.teamSourcingFiles.keptLabel,
    kept.length
      ? kept.map((f) => `- ${fileLineText(f)}`).join("\n")
      : EMAILS.teamSourcingFiles.noneKept,
    "",
    EMAILS.footer,
  ].join("\n");

  return {
    kind: "team-sourcing-files",
    to: serverEnv.TEAM_NOTIFICATION_EMAIL,
    subject: EMAILS.teamSourcingFiles.subject(reference, rejected.length),
    html,
    text,
    replyTo: CONTACT_EMAIL,
    reference,
  };
}

export function supplierTeamNotification(
  values: SupplierApplicationInput,
  reference: string,
): Email {
  const L = FIELD_LABELS.supplier;
  const fields = presentFields([
    [EMAILS.submittedLabel, timestamp()],
    [L.companyName, values.companyName],
    [L.country, values.country],
    [L.manufacturingCategories, list(values.manufacturingCategories)],
    [L.monthlyCapacity, values.monthlyCapacity],
    [L.website, values.website],
    [L.certifications, list(values.certifications)],
    [L.contactName, values.contactName],
    [L.email, values.email],
    [L.phone, values.phone],
    [L.note, values.note],
  ]);

  const html = shell({
    body: [
      heading(EMAILS.teamSupplier.heading),
      referenceBlock(reference),
      fieldTable(fields),
      rule(),
      paragraph(escapeHtml(EMAILS.teamSupplier.replyNote)),
    ].join("\n"),
    footer: FOOTER_HTML,
  });

  const text = [
    EMAILS.teamSupplier.heading,
    `Reference: ${reference}`,
    "",
    fieldText(fields),
    "",
    EMAILS.teamSupplier.replyNote,
    "",
    EMAILS.footer,
  ].join("\n");

  return {
    kind: "team-supplier",
    to: serverEnv.TEAM_NOTIFICATION_EMAIL,
    subject: EMAILS.teamSupplier.subject(reference, values.companyName),
    html,
    text,
    replyTo: values.email,
    reference,
  };
}
