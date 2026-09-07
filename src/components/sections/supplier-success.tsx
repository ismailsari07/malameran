import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { SUPPLIER_SUCCESS } from "@/content/supplier-success";

/**
 * The success screen, rendered in place of the whole form once an application
 * is written — heading, lead, sidebar and card all go.
 *
 * Not a separate route: the reference would have to travel in the URL, where it
 * lands in logs and referrer headers, and a /suppliers/apply/success with no
 * reference is a worse failure mode than losing it on refresh.
 *
 * Kept separate from RequestSuccess rather than shared: the two differ in
 * heading role, lead, row content and whether a rejected-files block exists,
 * and a component parameterised across all of that is harder to read than two
 * that each say what they render.
 */
export function SupplierSuccess({ reference }: { reference: string }) {
  return (
    <div className="mx-auto max-w-[760px]">
      <Eyebrow tone="paper">{SUPPLIER_SUCCESS.eyebrow}</Eyebrow>
      <h2 className="t-h2-success-apply text-ink mt-5">
        {SUPPLIER_SUCCESS.heading}
      </h2>
      <p className="t-lead text-text-body-alt mt-5">
        {SUPPLIER_SUCCESS.leadBefore}
        <strong className="text-ink">{reference}</strong>
        {SUPPLIER_SUCCESS.leadAfter}
      </p>

      <Card tone="surface" pad="22" padLg="28-30" radius={20} className="mt-8">
        <Eyebrow tone="muted-paper" size="card">
          {SUPPLIER_SUCCESS.next.eyebrow}
        </Eyebrow>
        <div className="mt-4.5 flex flex-col gap-3.5">
          {SUPPLIER_SUCCESS.next.rows.map((row, index) => (
            <div key={row.timeframe} className="contents">
              {index > 0 ? <Rule tone="success" /> : null}
              <p className="t-body text-text-label flex flex-col gap-1 sm:flex-row sm:gap-3.5">
                <span className="t-banner-heading text-accent sm:w-[150px] sm:shrink-0">
                  {row.timeframe}
                </span>
                <span>{row.detail}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      <p className="t-body text-muted mt-7">
        {SUPPLIER_SUCCESS.keepReference(reference)}
      </p>

      <p className="mt-8.5">
        <Link
          href={SUPPLIER_SUCCESS.returnLink.href}
          className="t-btn-ghost text-muted hover:text-ink focus-visible:focus-outline underline underline-offset-4 transition-colors"
        >
          {SUPPLIER_SUCCESS.returnLink.label}
        </Link>
      </p>
    </div>
  );
}
