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
- [ ] SEO: titles, meta descriptions, Open Graph, sitemap, robots.txt
      (robots.txt currently `Disallow: /` — must be opened up before launch)
- [ ] Analytics installed and receiving events
- [ ] Responsive check at 375px and 1440px
- [ ] Lighthouse pass on performance and accessibility
- [ ] All `TODO(copy):` placeholders reviewed and flagged to the client
- [ ] `npm run build` clean
- [ ] Deployed to production
- [ ] Client walkthrough and written sign-off

## Open items carried from the setup block

- [ ] Open up `src/app/robots.ts` — it is `Disallow: /` for every crawler right now
- [ ] Delete `src/app/tokens/` — temporary internal token verification page
- [ ] Write a README with setup instructions before delivery
- [x] Decide which supplier application surface wins — the embedded dark form is
      dropped; `/suppliers/apply` wins. See `docs/decisions.md`
- [ ] Give the 14 single-size type roles a mobile value as the pages using them are built —
      listed in `docs/design.md` under "Type roles with no mobile counterpart"
- [ ] Revisit `lg: 1024px` when Home is built: the 82px hero is authored at 1440 and
      currently applies from 1024 up
- [ ] Confirm the Supabase key names against the real project when it is created

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
- [ ] Tell the client at delivery that this text is a template

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
