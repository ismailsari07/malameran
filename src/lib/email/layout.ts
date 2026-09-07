import "server-only";

/**
 * Email HTML, built by hand.
 *
 * Email clients are not browsers. There is no external stylesheet, no web font,
 * no flexbox and no grid — tables for layout and inline styles on every
 * element, because Gmail strips <style> blocks in some contexts and Outlook
 * renders through Word.
 *
 * COLOURS ARE HARDCODED HEX HERE ON PURPOSE. CLAUDE.md forbids that everywhere
 * else and is right to: the app reads its tokens from globals.css. An email
 * cannot read a CSS variable or a Tailwind token, so the four brand values are
 * literals in this file and nowhere else. Do not "fix" this — see
 * docs/decisions.md.
 */

const INK = "#1A191E";
const ACCENT = "#E2751B";
const MUTED = "#6C6A66";
const LINE = "#DCDBD6";
const PAPER = "#F9F9F7";
const SURFACE = "#FFFFFF";
const LABEL = "#26251F";

/** Inter Tight will not load in an inbox. Ship the system stack instead. */
const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * Everything interpolated into an email body is attacker-controlled: a company
 * name, a note, a filename. Escaped at the boundary, every time, with no
 * exceptions for values that "cannot" contain markup.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A row of the field table: label above value, value wrapping freely. */
export type Field = { label: string; value: string };

/**
 * Drops fields the submitter left blank. An email listing eight "—" rows is
 * harder to read than one listing the four things that were actually said.
 */
export function presentFields(
  fields: readonly (readonly [string, string | null | undefined])[],
): Field[] {
  return fields
    .filter((f): f is readonly [string, string] => Boolean(f[1]?.trim()))
    .map(([label, value]) => ({ label, value }));
}

export function fieldTable(fields: readonly Field[]): string {
  if (fields.length === 0) return "";
  const rows = fields
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:0 0 4px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED}">${escapeHtml(label)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.5;color:${LABEL};white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse">${rows}</table>`;
}

/** The plain-text half of the same fields. */
export function fieldText(fields: readonly Field[]): string {
  return fields.map(({ label, value }) => `${label}:\n${value}`).join("\n\n");
}

export function heading(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:21px;line-height:1.25;font-weight:700;color:${INK}">${escapeHtml(text)}</p>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.55;color:${LABEL}">${html}</p>`;
}

export function sectionLabel(text: string): string {
  return `<p style="margin:26px 0 12px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED}">${escapeHtml(text)}</p>`;
}

export function rule(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:${LINE}">&nbsp;</td></tr></table>`;
}

/** The reference, set apart so it is the first thing found when scanning. */
export function referenceBlock(reference: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;margin:0 0 22px">
    <tr>
      <td style="padding:14px 18px;background-color:${PAPER};border:1px solid ${LINE};border-radius:10px;font-family:${SANS};font-size:16px;font-weight:700;color:${INK}">
        ${escapeHtml(reference)}
      </td>
    </tr>
  </table>`;
}

/**
 * The page shell: a centred 600px column on a paper ground, the wordmark as
 * text over a rule, and a footer. 600px because it is the widest column that
 * survives an Outlook reading pane.
 */
export function shell({
  body,
  footer,
}: {
  body: string;
  footer: string;
}): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${PAPER};-webkit-font-smoothing:antialiased">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;background-color:${PAPER}">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:0 0 20px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="width:10px;height:10px;background-color:${ACCENT};font-size:0;line-height:0">&nbsp;</td>
                <td style="padding-left:10px;font-family:${SANS};font-size:15px;font-weight:700;letter-spacing:0.10em;color:${INK}">MALAMERAN</td>
              </tr></table>
            </td>
          </tr>
          <tr><td style="height:1px;line-height:1px;font-size:0;background-color:${LINE}">&nbsp;</td></tr>
          <tr>
            <td style="padding:28px 30px 30px;background-color:${SURFACE};border:1px solid ${LINE};border-top:0;border-radius:0 0 12px 12px">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 4px 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED}">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body></html>`;
}
