import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Rule } from "@/components/ui/rule";
import { REQUEST_SUCCESS } from "@/content/request-success";

/**
 * The success screen, rendered in place of the form once a request is written.
 *
 * Not a separate route: the reference would have to travel in the URL, where it
 * lands in logs and referrer headers, and a /request/success with no reference
 * is a worse failure mode than losing it on refresh.
 */
export function RequestSuccess({
  reference,
  rejectedFiles = [],
}: {
  reference: string;
  rejectedFiles?: readonly { filename: string; reason: string }[];
}) {
  return (
    <div className="mx-auto max-w-[760px]">
      <Eyebrow tone="paper">{REQUEST_SUCCESS.eyebrow}</Eyebrow>
      <h2 className="t-h2-success-request text-ink mt-5">
        {REQUEST_SUCCESS.heading}
      </h2>
      <p className="t-lead text-text-body-alt mt-5">
        {REQUEST_SUCCESS.leadBefore}
        <strong className="text-ink">{reference}</strong>
        {REQUEST_SUCCESS.leadAfter}
      </p>

      <Card tone="surface" pad="22" padLg="28-30" radius={20} className="mt-8">
        <Eyebrow tone="muted-paper" size="card">
          {REQUEST_SUCCESS.next.eyebrow}
        </Eyebrow>
        <div className="mt-4.5 flex flex-col gap-3.5">
          {REQUEST_SUCCESS.next.rows.map((row, index) => (
            <div key={row.timeframe} className="contents">
              {index > 0 ? <Rule tone="success" /> : null}
              <p className="t-body text-text-label flex flex-col gap-1 sm:flex-row sm:gap-3.5">
                <span className="t-banner-heading text-accent shrink-0">
                  {row.timeframe}
                </span>
                <span>{row.detail}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      {rejectedFiles.length > 0 ? (
        <Card tone="error" pad="18-20" radius={14} className="mt-6">
          <p className="t-banner-heading text-err-heading">
            {REQUEST_SUCCESS.filesRejected.heading}
          </p>
          <p className="t-fineprint text-err-body mt-2">
            {REQUEST_SUCCESS.filesRejected.body}
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {rejectedFiles.map((file) => (
              <li key={file.filename} className="t-fineprint text-err-body">
                {file.filename} — {file.reason}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <p className="t-body text-muted mt-7">
        {REQUEST_SUCCESS.keepReference(reference)}
      </p>

      <p className="mt-8.5">
        <Link
          href={REQUEST_SUCCESS.returnLink.href}
          className="t-btn-ghost text-muted hover:text-ink focus-visible:focus-outline underline underline-offset-4 transition-colors"
        >
          {REQUEST_SUCCESS.returnLink.label}
        </Link>
      </p>
    </div>
  );
}
