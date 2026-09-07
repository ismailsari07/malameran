import { NextResponse, after } from "next/server";

import { sendAll } from "@/lib/email/send";
import {
  supplierConfirmation,
  supplierTeamNotification,
} from "@/lib/email/templates";
import { supplierApplicationSchema } from "@/lib/schemas/supplier-application";
import { guardSubmission } from "@/lib/submission-guard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * The supplier application submission. Verify, limit, validate, insert.
 *
 * Simpler than /api/request by one whole round trip: no files, so no signed
 * upload URLs, no verification pass and no submission token. Nothing follows
 * the insert, so there is nothing after it that needs authorising.
 *
 * The two gates before the write live in `guardSubmission`, shared with
 * /api/request. Its endpoint argument is the rate-limit bucket, and a different
 * string means a genuinely separate limit — one person exhausting the sourcing
 * form cannot lock another visitor out of this one.
 *
 * Email is sent from `after()`, once the response has been flushed. An
 * application that reached the database succeeded, whether or not Resend was
 * reachable, so no send outcome can reach the applicant.
 */

export const runtime = "nodejs";

type FieldErrors = Record<string, string>;

function fail(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  // 1-3. Envelope, Turnstile, rate limiter. Nothing is written before this
  //      returns ok.
  const guard = await guardSubmission(request, "supplier-application");
  if (!guard.ok) return guard.response;

  // 4. Validation is the control. The client already ran this schema; that is
  //    a convenience for the user, not evidence about the payload.
  const parsed = supplierApplicationSchema.safeParse(guard.values);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return fail(400, { error: "validation", fieldErrors });
  }

  const values = parsed.data;
  const supabase = createSupabaseAdminClient();

  // 5. The row. `reference` is generated in the database — 'SUP-' || a
  //    sequence — so it cannot be influenced from here or from the client.
  const { data: row, error: insertError } = await supabase
    .from("supplier_applications")
    .insert({
      company_name: values.companyName,
      country: values.country,
      manufacturing_categories: values.manufacturingCategories,
      contact_name: values.contactName,
      email: values.email,
      monthly_capacity: values.monthlyCapacity ?? null,
      website: values.website || null,
      certifications: values.certifications ?? null,
      phone: values.phone ?? null,
      note: values.note ?? null,
    })
    .select("reference")
    .single();

  if (insertError || !row) {
    return fail(500, {
      error: "server",
      message: "We could not save your application.",
    });
  }

  // The row exists and the response is decided. Only now is anything sent, and
  // a failure in here is logged rather than thrown — see src/lib/email/send.ts.
  after(async () => {
    await sendAll([
      supplierConfirmation(values, row.reference ?? ""),
      supplierTeamNotification(values, row.reference ?? ""),
    ]);
  });

  return NextResponse.json({ reference: row.reference });
}
