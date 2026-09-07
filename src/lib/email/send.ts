import "server-only";

import { serverEnv } from "@/lib/env";

/**
 * Resend, over plain fetch. Same shape as `src/lib/turnstile.ts`.
 *
 * No SDK: the send endpoint is one authenticated POST with a JSON body, and the
 * wrapper would be a dependency for forty lines we already know how to write.
 *
 * This never throws. A caller that is sending mail after a database write must
 * not be able to turn a delivery problem into a failed submission, so every
 * outcome comes back as a value and every failure is logged.
 */

const SEND_URL = "https://api.resend.com/emails";

/** Long enough for a slow API, short enough not to hold an invocation open. */
const TIMEOUT_MS = 10_000;

/** Which message this was, for the log line. */
export type EmailKind =
  | "confirmation-sourcing"
  | "team-sourcing"
  | "team-sourcing-files"
  | "confirmation-supplier"
  | "team-supplier";

export type Email = {
  kind: EmailKind;
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Where a reply should land, which is never the noreply sender. */
  replyTo: string;
  /** The MAL- or SUP- reference, so a log line can be found by it. */
  reference: string;
};

export type SendResult =
  { ok: true; id: string } | { ok: false; reason: string };

/**
 * One line per send, success or failure, with a stable `[email]` prefix and the
 * reference in it.
 *
 * This is the whole audit trail in stage A: there is no retry and no durable
 * queue, so a send that fails is gone, and the log line is the only record that
 * it was ever attempted. Searchable by reference in `next dev` output and in
 * Vercel's function logs. A queryable send log belongs with the admin panel in
 * F1-B — see docs/tasks/f1-a.md.
 */
function log(email: Email, outcome: SendResult) {
  const head = `[email] ${outcome.ok ? "sent" : "FAILED"} kind=${email.kind} ref=${email.reference} to=${email.to}`;
  if (outcome.ok) {
    console.log(`${head} id=${outcome.id}`);
  } else {
    console.error(`${head} error=${outcome.reason}`);
  }
}

export async function sendEmail(email: Email): Promise<SendResult> {
  let outcome: SendResult;

  try {
    const response = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: serverEnv.EMAIL_FROM,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };

    outcome = response.ok
      ? { ok: true, id: body.id ?? "unknown" }
      : {
          ok: false,
          reason:
            `status=${response.status} ${body.name ?? ""} ${body.message ?? ""}`.trim(),
        };
  } catch (cause) {
    outcome = {
      ok: false,
      reason: `unreachable: ${cause instanceof Error ? cause.message : "unknown"}`,
    };
  }

  log(email, outcome);
  return outcome;
}

/**
 * Sends several, independently. One failure never prevents another send — a
 * confirmation that bounces must not cost the team its notification.
 */
export async function sendAll(emails: readonly Email[]): Promise<void> {
  await Promise.all(emails.map((email) => sendEmail(email)));
}
