# F1-A · Marketing site and request intake

Stage is done when: the site is live, both forms work, incoming requests reach the
team by email, and the submitter receives a confirmation.

## Setup
- [ ] Next.js project initialised, TypeScript strict mode on
- [ ] Tailwind configured with design tokens from the approved design
- [ ] Repo structure and `.env.example` in place
- [ ] Vercel project connected, preview deployments working
- [ ] Supabase project created (client's account), local CLI linked

## Design foundation
- [ ] Design brief agreed
- [ ] Home page design approved
- [ ] Shared components: header, footer, buttons, form controls, section wrapper

## Pages
- [ ] Home
- [ ] How It Works
- [ ] Services
- [ ] Industries
- [ ] For Suppliers
- [ ] About
- [ ] Contact
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
- [ ] Analytics installed and receiving events
- [ ] Responsive check at 375px and 1440px
- [ ] Lighthouse pass on performance and accessibility
- [ ] All `TODO(copy):` placeholders reviewed and flagged to the client
- [ ] `npm run build` clean
- [ ] Deployed to production
- [ ] Client walkthrough and written sign-off
