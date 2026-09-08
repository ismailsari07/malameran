# F1-A · Marketing site and request intake

Stage is done when: the site is live, both forms work, incoming requests reach the
team by email, and the submitter receives a confirmation.

## Setup

- [x] Next.js project initialised, TypeScript strict mode on
- [x] Tailwind configured with design tokens from the approved design
- [x] Repo structure and `.env.example` in place
- [ ] Vercel project connected, preview deployments working
- [ ] Supabase project created (client's account), local CLI linked

## Design foundation

- [ ] Design brief agreed
- [ ] Home page design approved — with the client as preview checkpoint 1
- [x] Shared components: header, footer, buttons, section wrapper
      (form controls are block 7 — see the Sourcing request form section below)

## Pages

- [x] Home
- [x] How It Works
- [x] Services
- [x] Industries
- [x] For Suppliers
- [x] About
- [x] Contact
- [x] Privacy policy — template text, see the open item below
- [x] Terms — template text, see the open item below
- [x] 404 and error pages

## Sourcing request form

- [x] Schema and migration for `sourcing_requests`
- [x] Form UI with all fields from `docs/scope.md`
- [x] Server-side validation
- [x] File attachment upload with type and size limits
- [x] Reference number generated on submit
- [x] Success and failure states
- [x] Bot / spam protection
- [x] Rate limiting

## Supplier application form

- [x] Schema and migration for `supplier_applications`
- [x] Form UI, validation, success state

## Email

- [x] Resend configured on the `send.` subdomain
- [ ] SPF, DKIM, DMARC records verified
- [x] Buyer confirmation email
- [x] Internal new-request notification
- [x] Internal new-supplier-application notification
- [ ] Deliverability test (score checked before launch)

## Infrastructure

- [ ] Domain DNS on Cloudflare
- [ ] Business email mailboxes and aliases set up
- [ ] SSL verified
- [ ] Staging environment separate from production
- [ ] Automated database backups confirmed

## Launch

- [x] SEO: titles, meta descriptions, Open Graph, sitemap, robots.txt
- [ ] Analytics installed and receiving events — the code is in place and inert;
      this is done when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (see below)
- [x] Responsive check at 375px and 1440px — all 12 routes, no horizontal
      overflow at either width. Found and fixed `t-h1-page` overflowing on
      /for-suppliers and /about
- [ ] Lighthouse pass on performance and accessibility
- [ ] All `TODO(copy):` placeholders reviewed and flagged to the client
- [x] `pnpm build` clean, with lint, typecheck, check:css, check:routes and
      check:classnames
- [ ] Deployed to production
- [ ] Client walkthrough and written sign-off

## Open items carried from the setup block

- [x] `src/app/tokens/` — kept but gated: `notFound()` in production, so it
      exists in dev and previews and 404s on the live site. See docs/decisions.md
- [x] Write a README with setup instructions before delivery
- [x] Decide which supplier application surface wins — the embedded dark form is
      dropped; `/suppliers/apply` wins. See `docs/decisions.md`
- [ ] Give the remaining single-size type roles a mobile value as the pages using
      them are built — listed in `docs/design.md`. `t-h1-page` was given one in
      block 11 because at 68px it overflowed the 375px column; the rest have not
      caused an overflow on any route at 375px
- [ ] Revisit `lg: 1024px` when Home is built: the 82px hero is authored at 1440 and
      currently applies from 1024 up
- [ ] Confirm the Supabase key names against the real project when it is created

## Stage A security pass — 2026-09-08

Run against a local production build. Full detail in the delivery report.

- [x] Rate limiting limits, both forms, independently — 5 pass then 429 on each
- [x] Bucket unreadable without a signed URL — publishable key sees no contents,
      no filenames and no bucket names, verified with an object present
- [x] No secret in the client bundle — all five server secrets, 0 occurrences
- [x] XSS — one `dangerouslySetInnerHTML` (server-built JSON-LD), no `innerHTML`
      anywhere; the `<script>` payload renders escaped in all five email templates
- [x] Security headers — CSP, HSTS, nosniff, Referrer-Policy, X-Frame-Options,
      Permissions-Policy; `X-Powered-By` removed
- [x] noindex / robots / sitemap agree, on the production build
- [x] No secret, token or internal id in any email or error body — the MAL-/SUP-
      reference is the only identifier that leaves the system
- [ ] **Yours to run before launch:** confirm the production Turnstile widget's
      hostname allowlist includes `malameran.com`, and that
      `NEXT_PUBLIC_SITE_URL=https://malameran.com` in the Production environment

## Open items carried from the SEO and analytics block

- [ ] **Setting `NEXT_PUBLIC_GA_MEASUREMENT_ID` and updating the privacy policy is
      ONE change, not two.** `src/content/privacy.ts` currently states that no
      analytics provider has been selected, in four places. The moment that
      variable is set in production, a published legal document is false. Fill in
      the provider, whether it sets cookies (it does not, in this configuration),
      and the consent position, in the same commit that sets the variable
- [ ] Tell the client at delivery, in these words: cookieless analytics means
      **no returning visitors, no sessions, no funnels and no attribution.** It
      answers "how much traffic, to which pages, from where". It cannot answer
      "who came back" or "what path led to a request". Wanting the second kind of
      answer is a consent-banner conversation, not a settings change. This belongs
      in the delivery note as its own line, not buried in a settings list
- [ ] Set `NEXT_PUBLIC_SITE_URL` in all three Vercel environments, alongside
      `RATE_LIMIT_IP_SALT` and `SUBMISSION_TOKEN_SECRET`. The canonicals, the
      sitemap and the social image URL are all built from it, so a wrong value
      breaks three things together and silently
- [ ] The 404 renders its `noindex` meta tag twice — React 19 hoists the tag and
      the resolved head keeps both copies. Harmless (identical directives, and the
      page already answers HTTP 404, which is the stronger signal) but untidy.
      Drop the tag and rely on the status code if it ever matters
- [ ] `public/malameran-emblem.png` and `malameran-mark.png` are prototype art in
      a palette that contradicts the design system, referenced nowhere in `src/`.
      Decide with the client whether to delete them or commission a real mark

## Open items carried from the email block

- [ ] There is no durable record of a send. A failure leaves a `[email] FAILED`
      line with the reference in it and nothing else — no retry, no queue, no
      column. F1-B should add a send log the admin panel can query, deliberately
      and designed against that panel, rather than a `notified_at` column bolted
      on now
- [ ] The team email carries no link to the attachments, because a signed URL is
      a bearer token that would sit in an inbox backup and expire long before the
      mail is read. Retrieval is a dashboard lookup by reference today; F1-B
      should replace it with a deep link into the admin panel
- [ ] `after()` gives no retry. A Resend outage loses those notifications
      permanently. Acceptable at this volume; revisit when a queue exists

## Open items carried from the supplier application block

- [ ] `ChipsField`'s label uses `htmlFor` against a `<div>`, which is inert. The
      group is reachable and announced (`role="group"`, `aria-label`), but making
      the label itself work means `aria-labelledby` and a label id in `FieldShell`

## Open items carried from the submission block

- [ ] Set `SUBMISSION_TOKEN_SECRET` in all three Vercel environments before block 11,
      alongside `RATE_LIMIT_IP_SALT`. At least 32 characters. Rotating it invalidates
      submission tokens issued in the last ten minutes
- [ ] A file that fails verification is deleted and its row marked rejected, but the
      buyer only learns which files were refused on the success screen. Once email
      exists, say it in the confirmation too

## Legal copy — must be replaced

- [ ] Replace the template privacy policy and terms with reviewed copy. Fifteen
      `[PLACEHOLDER: ...]` values render publicly on the pages until then; the full
      list is in `docs/decisions.md` and in the `TODO(legal):` block at the top of
      `src/content/privacy.ts` and `src/content/terms.ts`
- [ ] Collect the placeholder answers from the client: effective date, registered
      entity name, retention periods, hosting regions and DPA status for Supabase /
      Vercel / Resend, analytics provider and its cookies, access-request response
      window, privacy-officer requirement, jurisdiction and liability-cap detail
- [ ] Confirm PIPEDA is the right regime — a BC, Alberta or Quebec footprint changes it
- [x] Tell the client at delivery that this text is a template — `docs/delivery-notes.md`

## Open items carried from the data layer

- [ ] Set `RATE_LIMIT_IP_SALT` in all three Vercel environments before block 11.
      At least 32 characters; the same value in each. Rotating it resets every
      active rate-limit window
- [ ] Revisit the `revoke all ... from anon, authenticated` on all four tables when
      accounts land in stage B — the new roles will need grants alongside policies
- [ ] The dev `request-files` bucket allows `application/acad` as a seventh MIME
      type. Harmless — the verifier normalises it to `image/vnd.dwg` — but the
      production bucket should be created with the same list, deliberately
- [ ] Replace the limiter's opportunistic cleanup with a scheduled job in stage B

## Open items carried from the shared-components block

- [ ] Confirm the footer contact details with the client: the design shows
      `hello@malameran.com` and a full street address, the brief specifies `info@` and
      city/country only. Both are `TODO(copy):` in `src/content/nav.ts`
- [ ] Review all `TODO(copy):` strings in `src/content/nav.ts` with the client — nav labels,
      footer headings, the positioning line, the copyright and the legal link targets
- [ ] Build the `/privacy` and `/terms` routes the footer links to
- [ ] Put the two authored pieces — the mobile menu and the link/button focus ring — in front
      of the client if the design is reviewed again. See "Authored, not in the source" in
      `docs/design.md`
- [ ] Give the twelve single-size chrome roles a mobile value if a 375px artboard ever
      appears for a page that uses them
