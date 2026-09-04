# Decision log

Newest at the top. One entry per decision that would otherwise get re-litigated.
Format: date · decision · why · consequence.

---

## 2026-08-30 · Design direction comes from a written brief, one page at a time

Home page design is approved before any other page is built.
**Why:** approving eight pages at once risks a "I don't like the colour" answer
after all eight exist.
**Consequence:** `docs/design-brief.md` is written first; home page is the design
reference for everything after it.

## 2026-08-30 · Development proceeds on placeholder copy

Client supplies real copy; work does not wait for it.
**Why:** copy is the most common blocker in this kind of project and the least
technically risky thing to swap in late.
**Consequence:** see `docs/content.md` for the placeholder policy and the list of
outstanding items.

## 2026-08-30 · Hosting and service accounts belong to the client

Domain, business email, Supabase, Vercel and email service are opened under the
client's name and paid by the client. Developer has collaborator access.
**Why:** avoids the developer becoming a permanent unpaid sysadmin and avoids an
ownership dispute later.
**Consequence:** subscription costs are outside the project price.

## 2026-08-30 · Phase 1 is delivered in three independently shippable stages

F1-A site and intake · F1-B panels · F1-C files, messaging and security review.
**Why:** the site is live and useful after each stage, so the client can start
collecting requests before the panels exist.
**Consequence:** each stage has its own definition of done in `docs/roadmap.md`.

## 2026-08-30 · English only, no multi-language support

**Why:** client dropped the Turkish version from scope.
**Consequence:** no i18n library, no locale routing. Adding it later means a
routing change, which is why it is not being stubbed out "just in case".

## 2026-08-30 · Messaging is asynchronous, not realtime chat

Per-project message thread that behaves like email.
**Why:** expected volume in phase 1 is a handful of messages per project. Realtime
presence, typing indicators and push are a disproportionate cost at this stage.
**Consequence:** realtime is a phase 2 item. No subscriptions are added now.

## 2026-08-30 · Supplier side is a form only in phase 1

"Become a supplier" submits an application that lands in the admin panel.
No supplier accounts, no supplier portal.
**Why:** starts building the supplier pool before the portal exists, at almost no
cost.
**Consequence:** supplier portal, RFQ distribution and quote comparison are phase 2.

## 2026-08-30 · Tenant isolation is enforced in the database, not the UI

Row Level Security on every table holding user data.
**Why:** a bug in application code must not be able to expose one client's data to
another. This is the single highest-consequence failure mode in the product.
**Consequence:** every feature touching user data is tested from a second account
before being marked done.

## 2026-08-30 · Transactional email sends from a subdomain

Application email goes out via Resend from `send.malameran.com`, not the root
domain. Human business email stays on the root domain via the mailbox provider.
**Why:** bounces and spam complaints from automated mail damage sender reputation.
Isolating them protects the client's own outreach, which is their sales channel.
**Consequence:** separate SPF/DKIM records for the subdomain.

## 2026-08-30 · Stack: Next.js, TypeScript, Tailwind, Supabase, Vercel

**Why:** Supabase covers auth, Postgres with RLS, and file storage in one service,
which is most of phase 1's non-UI work. The same stack supports phase 2 and 3
requirements (roles, realtime, larger data) without a migration.
**Consequence:** no separate backend service, no custom auth.
