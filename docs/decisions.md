# Decision log

Newest at the top. One entry per decision that would otherwise get re-litigated.
Format: date · decision · why · consequence.

---

## 2026-09-05 · `agentRules: false` — the build tool does not edit `CLAUDE.md`

`next dev` detects an AI coding agent from environment variables and appends a managed
`<!-- BEGIN:nextjs-agent-rules -->` block to `CLAUDE.md`, re-adding it on every run.
Disabled with the top-level `agentRules: false` in `next.config.ts`.
**Why:** `CLAUDE.md` is the file that governs how the agent behaves on this project. It is
edited deliberately and reviewed in a diff; instructions must not arrive in it from a
dependency. The block's own text told the agent to stop removing it and commit it instead,
which is the specific thing being ruled out.
**Consequence:** the bundled Next.js docs the block points at are still there and still
readable at `node_modules/next/dist/docs/`; only the automatic edit is off. Verified with a
control run: without the flag the block is written and the dev log prints "Generated
CLAUDE.md for AI agents"; with it, `CLAUDE.md` is byte-identical after `next dev` and no
`AGENTS.md` is created.

## 2026-09-05 · Chrome typography is a set of role classes, not inline sizes

Fifteen `.t-*` roles added to `globals.css` for the wordmark, nav link, six button
labels, "Back to site", the text-link CTA, the footer link, footer note, legal line
and a flat 11px eyebrow.
**Why:** block 1 extracted content typography only, because no component needed the
rest yet. Every one of these values is already in the `docs/design.md` type scale —
they were simply never turned into classes, so the first component to need one would
have had to inline a size.
**Consequence:** 51 type roles in total. No component file sets a font size.

## 2026-09-05 · The container is `max-w-[1280px]` with the gutter inside it

`mx-auto w-full max-w-[1280px] px-5 lg:px-10`.
**Why:** the artboards put `padding: 0 40px` on a full-bleed element and
`max-width: 1200px` on the element inside it, so the content column is 1200px and the
page is 1280px overall. A `max-w-[1200px]` container with the same padding would give a
1120px column — 80px narrower than every artboard.
**Consequence:** the brief's "1200px max-width" describes the content column, not the
container element. Every page inherits the correct measure without restating it.

## 2026-09-05 · Derived accent colours live in `:root` as `color-mix()` expressions

Six added: `--accent-hover`, `--accent-disabled`, `--accent-eyebrow-paper`,
`--accent-numeral`, `--accent-pill-border`, `--accent-card-fill`.
**Why:** same reasoning as the gradient grounds — they are computed values, not a scale,
so they must not become utilities, and they must stay expressions so changing
`--color-accent` propagates rather than needing six hexes updated.
**Consequence:** Tailwind emits a static hex fallback plus an `@supports` block holding
the real expression. Both are correct; the expression wins wherever `color-mix` is
supported.

## 2026-09-05 · The mobile menu and the keyboard focus ring are authored, not extracted

The artboards give a hamburger but no open state, and no focus state for links or
buttons anywhere.
**Why:** the site cannot ship without either. Both stay strictly inside the existing
tokens — no new colour, radius or type size.
**Consequence:** recorded under "Authored, not in the source" in `docs/design.md` so it
stays obvious later which parts of the design have no artboard behind them. If the
client reviews the design again, these are the parts to put in front of them.

## 2026-09-05 · `Card` takes its padding as a required prop

`pad` is typed to the eight paddings the artboards actually use.
**Why:** the source has no single card padding. Picking one default would silently be
wrong on seven of eight cards, and leaving padding to a `className` override would put
raw spacing back into page files.
**Consequence:** each page states the artboard value it is reproducing, and TypeScript
rejects anything not in the source.

## 2026-09-05 · Tailwind v4, with tokens in CSS and no `tailwind.config.ts`

Design tokens live in `src/app/globals.css`: `@theme static` for colour, font, radius and
breakpoint tokens; `:root` for the gradient grounds; `@layer components` for ground and
typography role classes; `@utility` for the focus rings.
**Why:** Tailwind v4 is CSS-first and ships no `tailwind.config.ts`. `static` is needed
because Tailwind otherwise tree-shakes tokens that no utility references yet, which would
gut a design system defined ahead of its components. The focus rings are `@utility` rather
than components because only utilities accept variants, and they are needed as
`focus:focus-ring`.
**Consequence:** "tokens live in `tailwind.config.ts`" is no longer true and has been
corrected in `CLAUDE.md`. A new token is added in `docs/design.md` first, then `globals.css`.

## 2026-09-05 · Sourcing request form uses the light Request Form treatment

The dark `Malameran Sourcing Request` artboard is discarded and will not be built.
**Why:** the Request Form / Supplier Application pair is the later and more complete
treatment — it has step states, validation, upload, success, failure and rate-limit states,
which the dark artboard does not.
**Consequence:** `/request` takes the 56↔36 type pair and `/suppliers/apply` the 52↔33 pair.
Contact's 64px heading has no mobile counterpart and does not scale yet. Dark form fields
survive on Contact and on the For Suppliers embedded form, so the dark treatment stays
documented.

## 2026-09-05 · Supabase publishable / secret keys, not anon / service_role

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`.
**Why:** the dashboard already marks the anon / service_role JWT pair as legacy. Starting on
the current system avoids a migration later. Verified before use that
`@supabase/supabase-js@2.115.0` and `@supabase/ssr@0.12.6` forward these keys verbatim with
no JWT parsing.
**Consequence:** the secret key bypasses RLS exactly as `service_role` did. `src/lib/env.ts`
is the only module that reads `process.env`, so a future rename touches one file.

## 2026-09-05 · pnpm is the package manager

Pinned via `"packageManager": "pnpm@10.14.0"`; `pnpm-lock.yaml` is committed.
**Why:** faster installs and a strict node_modules layout that catches undeclared
dependencies before they reach a deploy.
**Consequence:** every command in `CLAUDE.md` and the docs is `pnpm`, not `npm`. Vercel
picks the package manager up from the lockfile.

## 2026-09-05 · Separate Supabase projects for development and production

**Why:** running migrations and RLS experiments against the database that holds real
sourcing requests is the kind of mistake that is only made once. Stage F1-A already collects
live enquiries.
**Consequence:** two sets of Supabase env values — local `.env.local` and Vercel preview
point at the dev project, Vercel production at the production project. Both projects live in
the client's account.

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
