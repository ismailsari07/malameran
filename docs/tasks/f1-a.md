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
- [ ] Privacy policy
- [ ] Terms
- [ ] 404 and error pages

## Sourcing request form
- [ ] Schema and migration for `sourcing_requests`
- [ ] Form UI with all fields from `docs/scope.md`
- [ ] Server-side validation
- [ ] File attachment upload with type and size limits
- [ ] Reference number generated on submit
- [ ] Success and failure states
- [ ] Bot / spam protection
- [ ] Rate limiting

## Supplier application form
- [ ] Schema and migration for `supplier_applications`
- [ ] Form UI, validation, success state

## Email
- [ ] Resend configured on the `send.` subdomain
- [ ] SPF, DKIM, DMARC records verified
- [ ] Buyer confirmation email
- [ ] Internal new-request notification
- [ ] Internal new-supplier-application notification
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
