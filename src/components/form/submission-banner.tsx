"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FORM_COMMON } from "@/content/form-common";

/**
 * The banner above a form after a failed submission.
 *
 * Every cause reads differently on purpose, and one of them is not a failure at
 * all: `after-write` means the row exists and only a later step went wrong, so
 * it carries the reference and never says the submission failed.
 *
 * Rate limiting takes the neutral info treatment rather than the error one —
 * nothing has gone wrong, the visitor is simply early.
 */

export type BannerKind =
  "validation" | "rate-limited" | "turnstile" | "server" | "after-write";

/** Only these two are worth retrying in place; the rest need the user to act. */
const RETRYABLE: readonly BannerKind[] = ["server", "turnstile"];

export function SubmissionBanner({
  kind,
  heading,
  body,
  onRetry,
}: {
  kind: BannerKind;
  heading: string;
  body: string;
  onRetry: () => void;
}) {
  const neutral = kind === "rate-limited";

  return (
    <Card
      tone={neutral ? "info" : "error"}
      pad="18-20"
      radius={14}
      className="mb-6"
    >
      <p
        className={
          neutral
            ? "t-banner-heading text-ink"
            : "t-banner-heading text-err-heading"
        }
      >
        {heading}
      </p>
      <p
        className={
          neutral
            ? "t-fineprint text-text-body-alt mt-2"
            : "t-fineprint text-err-body mt-2"
        }
      >
        {body}
      </p>
      {RETRYABLE.includes(kind) ? (
        <Button variant="primary-retry" className="mt-4" onClick={onRetry}>
          {FORM_COMMON.retry}
        </Button>
      ) : null}
    </Card>
  );
}
