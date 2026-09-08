// Configured for the CSP — see ./zod.ts. Never import zod directly here.
import { z } from "./zod";

/**
 * The supplier application form on /suppliers/apply.
 *
 * Bounds mirror the CHECK constraints in
 * supabase/migrations/*_supplier_applications.sql.
 *
 * The artboard's "Company profile or catalogue" upload is deliberately absent:
 * a supplier application is a lead, not a project, and supplier document
 * upload arrives with supplier accounts in phase 2. See docs/decisions.md.
 */

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

export const supplierApplicationSchema = z.object({
  // Required
  companyName: z.string().trim().min(1).max(160),
  country: z.string().trim().min(1).max(80),
  manufacturingCategories: z
    .array(z.string().trim().min(1).max(120))
    .min(1)
    .max(10),
  contactName: z.string().trim().min(1).max(120),
  email: z.email().max(254),

  // Optional
  monthlyCapacity: optionalText(200),
  /**
   * http(s) only. `z.url()` alone accepts any well-formed URL, including
   * `javascript:` and `data:` — a supplier-supplied string that the admin panel
   * will render as a link in phase 1-B, so the scheme is constrained here
   * rather than at every future render site. Caught in block 8 verification,
   * where `javascript:alert(1)` was accepted and written.
   */
  website: z
    .union([z.url({ protocol: /^https?$/ }).max(300), z.literal("")])
    .optional(),
  certifications: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  phone: optionalText(40),
  note: optionalText(5000),
});

export type SupplierApplicationInput = z.infer<
  typeof supplierApplicationSchema
>;
