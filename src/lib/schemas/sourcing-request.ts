// Configured for the CSP — see ./zod.ts. Never import zod directly here.
import { z } from "./zod";

/**
 * The sourcing request form.
 *
 * Defined once and used by both the server route and, from block 7, the client.
 * Server-side validation is the control; the client reuses this for convenience
 * only.
 *
 * Every bound here mirrors a CHECK constraint in
 * supabase/migrations/*_sourcing_requests.sql. If the two drift the database
 * wins and the user gets a 500, so they are kept adjacent in docs/decisions.md.
 *
 * No `server-only` import and no env access: this module has to be importable
 * from client components.
 */

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

export const sourcingRequestSchema = z.object({
  // Required
  productDescription: z.string().trim().min(1).max(5000),
  contactName: z.string().trim().min(1).max(120),
  email: z.email().max(254),

  // Optional
  company: optionalText(160),
  phone: optionalText(40),
  industry: optionalText(80),
  requestType: optionalText(80),
  quantity: optionalText(80),
  targetPrice: optionalText(80),
  /** ISO date (YYYY-MM-DD) or absent. */
  targetDeliveryDate: z.iso.date().optional(),
  preferredCountry: optionalText(80),
  certifications: z.array(z.string().trim().min(1).max(80)).max(10).optional(),
  note: optionalText(5000),
});

export type SourcingRequestInput = z.infer<typeof sourcingRequestSchema>;

/** One file the client intends to upload, declared before the upload happens. */
export const requestFileIntentSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  /** Advisory only — the server trusts the bytes, not this. */
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(4 * 1024 * 1024),
});

export const requestFileIntentsSchema = z.array(requestFileIntentSchema).max(5);

export type RequestFileIntent = z.infer<typeof requestFileIntentSchema>;
