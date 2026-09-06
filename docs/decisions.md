# Decision log

Newest at the top. One entry per decision that would otherwise get re-litigated.
Format: date · decision · why · consequence.

---

## 2026-09-05 · Deny by default: RLS on, zero policies, plus revoked grants

All four tables have RLS enabled and forced, and **no policies at all**. On top of
that, `anon` and `authenticated` have every privilege revoked.
**Why:** there are no accounts in stage A, so the publishable key must be able to
read and write nothing. RLS is the control; the revoked grants are an independent
second layer, so a policy added by mistake still has no privilege to exercise.
**Verified 2026-09-05** against the dev project: reads and writes with the
publishable key return `42501 permission denied` on all four tables.
**Consequence:** every write goes through a server route holding the secret key.
Real policies arrive with accounts in stage B, and the revokes must be revisited
then rather than left to silently block the new roles.

## 2026-09-05 · Supplier file upload is out of stage A

The Supplier Application artboard's "Company profile or catalogue" field is not
built, and no polymorphic `submission_files` table exists.
**Why:** a supplier application is a lead, not a project. What the decision to
contact a supplier needs is capability, capacity and certifications — a catalogue
does not change that decision. Suppliers get real accounts and document upload in
phase 2, where the table design can follow the actual requirement instead of a
guess at it.
**Consequence:** `request_files` is scoped to sourcing requests by a real foreign
key rather than a nullable polymorphic pair. Block 8's form drops that field.

## 2026-09-05 · IP addresses are salted-hashed and never stored on submissions

`ip_hash` and `user_agent` are not columns on either submission table. The rate
limiter stores `sha256(RATE_LIMIT_IP_SALT + ip)`, truncated, and nothing else.
**Why:** the limiter already holds what abuse control needs, and the privacy
policy we shipped says IP is used for exactly that. An unsalted hash of an IPv4
address is reversible by exhausting four billion possibilities, so the salt is
what makes it a hash rather than an encoding.
**Consequence:** `RATE_LIMIT_IP_SALT` is a required env var of at least 32
characters. **Rotating it resets every active rate-limit window** — acceptable,
because windows are ten minutes. It must be set, to the same value, in all three
Vercel environments before block 11. If investigation data is ever needed, that
is a decision with its own privacy consequences and should be made deliberately.

## 2026-09-05 · File type is decided by the bytes, never the extension or MIME

`src/lib/files/verify.ts` reads magic bytes for all six accepted types. No
dependency was added.
**Why:** both the extension and the browser-declared MIME type are
attacker-controlled. The two awkward formats: **DWG** carries a six-byte version
code at offset 0 (`AC1014`–`AC1032`), and **XLSX** is a ZIP — `PK\x03\x04` proves
only "this is a zip", which docx, pptx, jar and apk all satisfy — so the central
directory is walked and an `xl/` entry required. The walk also rejects encrypted
archives and caps entry count and declared uncompressed size against zip bombs.
**Declared vs detected:** a mismatch is a rejection, not a correction. Known
aliases are normalised first, because an alias is not a lie — `application/acad`
is a real DWG type and is in the dev bucket's own whitelist.
**Verified 2026-09-05** against real fixture bytes: all six types accepted, a
`.docx` rejected where a naive zip check would pass it, a PNG renamed `.pdf`
rejected, plus the size and empty-file cases.

## 2026-09-05 · The rate limiter fails closed

`check_rate_limit()` increments and tests in one statement, so two concurrent
requests cannot both read the same count and both proceed. The TypeScript caller
treats **any** error — a bad key, an unreachable database, a missing function, a
timeout — as "limit exceeded".
**Why:** a limiter that admits everyone when it breaks is not a limiter. A request
with no determinable client address is also refused rather than given a free pass.
**Shape:** five submissions per IP per endpoint per ten minutes; rows older than
an hour are deleted opportunistically on roughly one call in twenty, which avoids
a `pg_cron` dependency. A scheduled job is the stage B refinement.
**Verified 2026-09-05:** five allowed and the sixth refused; refusal on a wrong
secret key and on an unreachable host; the publishable key cannot call the
function at all.

## 2026-09-05 · Storage paths carry neither the filename nor an extension

`requests/{requestId}/{uuid}`. The original filename lives in
`request_files.original_filename` and is reattached at download time through the
signed URL's `Content-Disposition`.
**Why:** a user-supplied filename in a storage path is a path-traversal and
content-sniffing problem for no benefit.
**Expiries:** downloads are signed for **300 seconds** — short enough that a URL
leaked in a log or a forwarded email is worthless within minutes, long enough to
actually pull 4MB on a bad connection; 60 seconds fails real downloads. Upload
URLs are fixed by Supabase at **two hours** and the client library exposes no way
to shorten them.
**Verified 2026-09-05:** the bucket is `public: false`, its public URL returns
400, the publishable key cannot read an object, and a URL signed for 5 seconds
returned 200 immediately and 400 after 9.

## 2026-09-05 · Template legal text ships, disclosed on the page

`/privacy` and `/terms` carry generic template copy for a Canadian company running
a business website with contact forms. It has not been reviewed by a lawyer.
**Why:** the site cannot launch with a footer linking to two dead routes, and real
policy text needs facts and a review the client has not yet provided. Shipping
honestly-labelled template text is better than shipping nothing or shipping
invented specifics.
**How it is disclosed:** three ways, so it cannot be missed — a visible info panel
at the top of each page reading "This is template text, not legal advice"; a
`TODO(legal):` block at the top of each content file; and the delivery note.
**Placeholders rather than invented facts:** every value that would need a fact we
do not have — retention periods, hosting regions, the analytics provider, the
registered entity name, the effective date — renders on the page as a literal
`[PLACEHOLDER: ...]`. Fifteen distinct ones across the two documents. They are
deliberately ugly and deliberately public.
**Consequence:** replacing this text is a Phase 1 Stage B item. The pages stay
indexable: the visible notice is the disclosure that matters, and a site with
unindexable legal pages looks worse than one with labelled template text.

## 2026-09-05 · Supabase, Vercel and Resend are named as processors

The privacy policy names all three by name; their regions and data-processing
agreement status stay placeholders.
**Why:** which services process the data is a fact about the stack, not a guess.
Where they run it, and under what agreement, is not.

## 2026-09-05 · PIPEDA is named as the applicable regime

Ontario has no private-sector privacy statute of its own, so the federal Act
applies to commercial activity. Written as PIPEDA and marked for confirmation
rather than left blank.
**Consequence:** if the client operates in or into British Columbia, Alberta or
Quebec, that section needs revisiting — those provinces have their own statutes.

## 2026-09-05 · For Suppliers loses its embedded application form

The artboard carries an eleven-field dark form on For Suppliers and a separate
light `/suppliers/apply` page. The embedded form is dropped; the band keeps its
copy and links to `/suppliers/apply`.
**Why:** two submission surfaces for one application is not what `docs/scope.md`
describes, and the light Request Form pair is already the chosen treatment for
form pages — the same call made for the sourcing form on 2026-09-05.
**Consequence:** the open question in `docs/design.md` about two supplier surfaces
is answered. `/suppliers/apply` is block 8; the CTA points at the route before it
exists. Contact is now the only page on the site with a dark form.

## 2026-09-05 · One mailbox and no street address, on every page

`info@malameran.com` everywhere; city and country only. The artboards show
`hello@malameran.com`, `suppliers@malameran.com` and a King Street address across
Contact, For Suppliers, About and the footer.
**Why:** nothing in the project should reference a mailbox or a street address the
client has not confirmed exists. Split routing between buyer and supplier mail is a
phase 2 question; for now both forms land in one inbox, which is already the
decision on record.
**Consequence:** every divergence is noted at its `TODO(copy):` in the content
file, so the client sees exactly what the design said and what shipped instead.

## 2026-09-05 · Contact does not close on a CTA band

Every other marketing page ends on `--dark-strong`. Contact ends on the form.
**Why:** the artboard does, and the reason holds — a visitor at the bottom of a
contact form is already doing the thing a closing CTA would ask for.
**Consequence:** the section-rhythm note in `docs/design.md` records Contact as the
documented exception rather than an omission.

## 2026-09-05 · The About image slot is dropped, as Home's was

**Why:** same as Home — there is no corporate photography and none is planned.
**Consequence:** both image slots in the design are now unbuilt, and the prose
column takes the space on both pages. The slots stay described in
`docs/design.md` in case photography ever arrives.

## 2026-09-05 · The header's active state is read on the client, by the nav alone

`SiteNav` is a small client component calling `usePathname`; `SiteHeader` stays a
server component, as do the wordmark and the CTA. `MobileMenu` was already a client
component and now reads the route itself instead of taking an `active` prop.
**Why:** the header lives in the root layout, which cannot know the route without a
client hook. Marking the whole header `"use client"` would push the wordmark, the CTA
and their imports into the bundle for one boolean per link.
**Consequence:** no page passes an `active` prop; adding a page cannot forget to. The
nav had rendered no active state at all since block 2, which this fixes.

## 2026-09-05 · Three page structures extracted, three deliberately not

Extracted: `SectionHead` (eyebrow + h2, ~10 uses), `PageHero` (eyebrow + h1 + lead,
with an optional aside), `FinalCtaBand` (Home's 76px heading and the inner pages' 72px
are the same composition at two sizes).
**Why:** each is the same composition with different content. `SectionHead` in
particular keeps the eyebrow tone paired with its ground, which is the detail that
drifts when a two-element pattern is copied by hand.
**Kept separate:** How It Works step rows vs Industries sector rows — they read alike
but share no structure, only the hairlines. Services' service cards vs Home's service
tiles — same eight client-approved headings, different composition entirely. How It
Works commitment cards vs Home's industry cards — five lines each with different
heading roles; a shared wrapper would be indirection, not reuse.

## 2026-09-05 · The "the problem" image slot is dropped

The Home artboard marks a `210px` / `170px` texture slot under the "the problem"
heading as optional. It is not built; the prose column takes the space.
**Why:** there is no corporate photography and none is planned. An empty or
placeholder image block reads worse than the two-column prose alone.
**Consequence:** the only other image slot in the design (About) is undecided and
stays recorded in `docs/design.md`. If photography ever arrives, the slot is a
`max-width: 460px` block below the heading in the left column.

## 2026-09-05 · Eight page roles and three diagram colours added for Home

`t-node-body`, `t-diagram-title`, `t-chip`, `t-statement`, `t-panel-body`,
`t-marker-line`, `t-card-note`, `t-btn-panel`; plus `--accent-diagram-fill`,
`--accent-diagram-border` and `--accent-connector`.
**Why:** the hero diagram and the trust and panel copy use values no existing role
is within 2px of. Three of the eight sit at the same size as an existing role but a
different line-height, which the block 1 fold rule keeps separate.
**Consequence:** 59 type roles. The three colours mix into `--color-ink` rather than
`--color-on-accent`; both bases appear in the source, sometimes on adjacent elements.

## 2026-09-05 · Colour and size are props on the primitives, never className

`Card` gained a `panel` tone, `Eyebrow` four faintness levels, `Marker` a `sizeLg`.
**Why:** overriding a component's own utility through `className` depends on
Tailwind's internal sort order, not on the order the classes are written in. The
supplier panel's `border-white/14` silently lost to the `statement` tone's
`border-white/22` and rendered at the wrong opacity. The other four overrides
happened to win, which is worse — they would have broken on a Tailwind upgrade.
**Consequence:** no component's own property is overridden from a page. `className`
carries layout only — margins, max-widths, alignment.

## 2026-09-05 · `Card` takes responsive padding and radius

`padLg` and `radiusLg` added; a single value still means "same at both widths".
**Why:** block 2 built `Card` with no page to test it against. Every card on Home is
smaller on mobile — radius 22→20, 20→18, 28→24, padding almost always `22px`.
**Consequence:** `Section` also gained a `divider` prop for the hero's full-bleed
hairline, since `className` reaches the container, not the ground element.

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
