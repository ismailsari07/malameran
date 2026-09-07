# Decision log

Newest at the top. One entry per decision that would otherwise get re-litigated.
Format: date · decision · why · consequence.

---

## 2026-09-07 · The prototype mark ships for stage A, over my objection

`public/malameran-mark.png` replaces the design's accent square in the wordmark.
**The objection, which stands:** the file contradicts the palette it is
advertising. Recorded in full so the reasoning survives the decision, and so the
vector request to the client can be specific rather than "send us a logo":

1. **It is opaque.** No `tRNS` chunk, PNG colour-type 3 — a solid `#020917`
   tile, a cold near-black, sitting on the header's warm `#1F1E23` and the
   footer's `#151418`. It reads as a bluer square patch, not a mark on the bar.
   The replacement needs a transparent background.
2. **It is a crop, not a mark.** The globe circle is clipped at the left, right
   and top edges, with a band of cut-off lettering along the bottom. It is
   `malameran-emblem.png` with the edges cut off.
3. **It is illegible at the size it is used.** Its strokes are about 3% of the
   image width, so at the wordmark's 11-13px they land on well under a pixel and
   average into a muddy brown. Measured at 11, 13, 16, 20, 24 and 32px:
   acceptable at 2x, a smudge at 1x, properly legible only around 20px.

None of that is a reason not to ship it — the decision is the client's, and a
placeholder mark beats no mark for stage A.
**Explicitly not done:** the mark was NOT sized up to 18-20px to make it legible
at 1x. A 20px logo beside 13px type would look like a mistake in a design whose
mark is a 13px square, and distorting an approved header to accommodate a file
being replaced anyway is the wrong trade.
**Consequence:** `src/components/ui/brand-mark.tsx` is the only place the path
appears. The vector swap is one file. `src/app/opengraph-image.tsx` keeps the
design system's own square — it is generated from the tokens, not from the brand
assets, and is correct as it stands.

## 2026-09-07 · A className must not fight a component's own layout utilities

`cn()` is a plain join, and its comment says "every component variant in this
codebase is a closed map of complete class strings, so there is never a
conflicting pair of utilities to resolve." That is true of the maps and false at
any call site that adds one.
**What it cost:** `<Button className="hidden lg:inline-flex">` in the site
header did not hide anything. `Button`'s base begins with `inline-flex`, and the
built CSS emits `.hidden` at 33159 and `.inline-flex` at 33238 — later wins,
regardless of the order in the class attribute. The CTA rendered at 375px, took
the space the hamburger needed, and wrapped its label to three lines. Measured
with real font metrics: the row needed 519px in a 335px column, overflowing by
184px.
**The rule:** display, position, width and flex-direction are props, never
`className` overrides. `Button` gained `block="below-lg"` so the one other
instance — `final-cta-band.tsx`, which worked only because `.inline-flex`
happens to sort after `.flex` — stopped relying on cascade luck.
**The nuance worth keeping:** unprefixed-versus-unprefixed is decided by
Tailwind's emission order and is luck. Unprefixed-versus-variant (`flex` and
`lg:inline-flex` in one string) is well defined, because Tailwind always emits
responsive variants after the utilities they override. The first is a bug; the
second is how the new prop is implemented.
**Enforced:** `pnpm check:classnames`. It reads each component's own class
literals and flags a call site passing an unprefixed utility from the same
property group. Scope is deliberately narrow — four groups, unprefixed only —
because margins and colours do not fail silently. Negative-controlled against
both real instances. Third occurrence of this class of bug: see also the block 3
colour override and the sidebar gradient.

## 2026-09-07 · One ROUTES table drives the sitemap, robots and every noindex

`src/lib/seo.ts` holds the list; `sitemap.ts`, `robots.ts` and `pageMetadata()`
all read it, and `pnpm check:routes` fails if a page exists with no entry.
**Why:** three hand-maintained lists that agree today drift apart the first time
someone adds a page in a hurry, and the failure is silent — a page with no
canonical and no sitemap presence looks fine in a browser.
**Consequence:** adding a route means adding a line here. The checker says so by
name when you forget.

## 2026-09-07 · Disallow is not how a linked page gets de-indexed

`robots.txt` disallows only `/api/` and `/tokens`. `/request` and
`/suppliers/apply` are noindex but stay crawlable.
**Why:** the original instruction was to disallow every noindex route. Disallow
stops the fetch, so the crawler never reads the noindex — and a disallowed URL
that is linked from elsewhere still gets listed, as a bare result with no
description. Both form pages are linked from four calls to action, so that is
exactly the case where it misfires. What is disallowed is what cannot carry a
meta tag (`/api` serves JSON) or what nothing links to.
**Consequence:** crawlers fetch two pages we do not want ranked, and obey the tag
that actually de-indexes them.

## 2026-09-07 · The social card is generated, and the prototype emblem is not used

`src/app/opengraph-image.tsx` renders 1200x630 from the design system via
`next/og`. `public/malameran-emblem.png` is left in place and unused.
**Why:** the emblem is prototype art — a `#010A19` navy ground and a yellow-gold
monogram, against a palette whose ink is the warm `#1A191E` and whose accent is
`#E2751B`, plus a globe motif that appears in no artboard. `docs/design.md`
records that the design ships no icons. Advertising the site with a picture that
contradicts its own palette is worse than having no picture.
**Consequence:** the card carries the same hardcoded hex exception as the email
templates — Satori reads neither CSS variables nor layered background shorthand.
Inter Tight is fetched from Google at build in two weights, falling back to the
bundled default rather than failing the build; registering one weight made every
string render at 800, which is how that was caught.

## 2026-09-07 · Cookieless analytics, and what it cannot answer

GA4 configured with `client_storage: 'none'`, `allow_google_signals: false` and
`allow_ad_personalization_signals: false`. No `anonymize_ip` — GA4 anonymises
unconditionally and ignores the parameter, so passing it would look like a
control we have and do not.
**Why:** no cookie and no localStorage entry means nothing identifying is stored
in the browser, and nothing to ask consent to store.
**What it costs, and the client must hear this in these words:** without a stored
client id GA4 mints a new one per page view. There are **no returning visitors,
no sessions, no funnels and no attribution.** It answers "how much traffic, to
which pages, from where". It cannot answer "who came back" or "what path led to
a submission".
**Consequence:** the code is inert until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set,
and off in development regardless. Setting it also makes the published privacy
policy false — the policy copy and the variable move in the same change. Both
are open items in `docs/tasks/f1-a.md`.

## 2026-09-07 · Email sends from `after()`, never from the request path

Both submission routes schedule their sends with `after()` from `next/server`,
once the response has been flushed and its shape decided.
**Why:** a submission that reached the database succeeded. Resend being down,
rate-limiting us or rejecting an address must never turn a written row into an
error the user sees. Awaiting the send before responding couples the two; a bare
un-awaited promise is worse, because the invocation freezes after the response
and the send disappears with no error at all.
**Consequence:** no retry and no durable queue — a failed send is logged and
gone. The work still runs inside the same billed invocation, so a slow Resend
call extends function duration rather than user-visible latency. A queue is
stage B infrastructure and should arrive as infrastructure, not as a patch.

## 2026-09-07 · The sourcing team email goes out at write time, not after verification

`/api/request` sends the team notification immediately, listing files as
declared with verification pending. `/api/request/files` follows up **only** when
verification actually refused something.
**Why:** file verification is a second round trip the browser triggers. Sending
the team email from there would produce one tidy, complete message — and lose it
entirely whenever a tab closes mid-upload, which is the one failure that must
never happen. Guaranteeing it with a `team_notified_at` column and an
opportunistic sweep makes the guarantee weakest exactly when traffic is thinnest,
which is now.
**Consequence:** a request with attachments produces one email normally and two
when a file is refused. The first says so, so the second is never a surprise.

## 2026-09-07 · No Resend SDK, and no React email framework

Sends go over plain `fetch` in `src/lib/email/send.ts`.
**Why:** the send endpoint is one authenticated POST with a JSON body, and
`src/lib/turnstile.ts` already establishes exactly this pattern for Cloudflare.
Forty lines beats a dependency and one fewer supply-chain edge.
**Consequence:** none felt so far. Templates are string functions; if they ever
need composition beyond that, revisit rather than accreting a template engine.

## 2026-09-07 · Email templates hardcode hex, and that is correct

`src/lib/email/layout.ts` contains literal `#1A191E`, `#E2751B`, `#6C6A66` and
`#DCDBD6`, plus a system font stack.
**Why:** CLAUDE.md forbids hardcoded hex, and is right to for the app, which
reads its tokens from `globals.css`. An email client cannot read a CSS variable
or a Tailwind token — no external stylesheet, no web font, no `@theme`. The four
brand values are literals in that one file and nowhere else.
**Consequence:** a token change does not propagate to email. The file says so at
the top. Do not "fix" it.

## 2026-09-07 · `EMAIL_FROM` accepts a display name, and must be on `send.`

`env.ts` parses the address out of `Name <address>` as well as a bare address,
then requires its domain to start with `send.`.
**Why:** the bare `z.email()` it had before rejected the display-name form, and
setting `EMAIL_FROM=Malameran <noreply@send.malameran.com>` took both submission
routes down with a 500 — `serverEnv` is evaluated at module load, so every route
importing it threw. The subdomain check turns a CLAUDE.md hard rule into
something that fails at boot rather than in a deliverability report months later.
**Consequence:** a root-domain sender cannot be configured by accident. The
format is documented in `.env.example`.

## 2026-09-07 · The gates before a write live in one shared module

`guardSubmission(request, endpoint)` parses the envelope, verifies Turnstile and
checks the rate limiter, in that order, for both public forms. Neither route can
write before it holds an `{ ok: true }` from it.
**Why:** "Turnstile and the limiter run before anything is written" was a comment
plus a statement ordering, duplicated in two files. That is precisely the shape
of invariant an unrelated edit breaks in one place and not the other, silently
and without a failing test. It is now structural.
**Consequence:** validation stays in the routes — it is per-form and belongs with
the schema. The `endpoint` argument is the rate-limit bucket, so a new form gets
an independent limit by passing a new string, with no migration.

## 2026-09-07 · The website field accepts http and https only

`supplierApplicationSchema.website` is `z.url({ protocol: /^https?$/ })`.
**Why:** found in block 8 verification — `z.url()` alone accepted
`javascript:alert(1)` and the row was written. Supplier-supplied, and the admin
panel will render it as a link in phase 1-B, so it is a stored-XSS vector waiting
for a render site. Constrained once at the schema rather than at every future
place it is displayed.
**Consequence:** a supplier whose site is reachable only over some other scheme
cannot enter it. Nobody has one.

## 2026-09-07 · The form islands own the grid; the sidebar is a prop

`RequestForm` and `SupplierForm` render the heading, the sidebar and the form
card. The pages pass the sidebar down as a prop, so it stays a server component
and so do the pages.
**Why:** both artboards draw the success state as a full-width page with no
heading, no form and no sidebar. With the page owning the grid, `/request` had
been showing its dark "What happens next" panel next to the confirmation since
block 7a — a parent that does not know the state cannot remove what the state
removes.
**Consequence:** the success band is 96px at the top against the form's 72px,
per both artboards, and each island carries about fifteen lines of layout. A
shared shell was considered and rejected: six props to save that is not
abstraction.

## 2026-09-07 · Required fields follow the schema, not the artboard

The Supplier Application artboard tags Country and Manufacturing categories
"Optional". Both are `not null` in the migration, and categories carries a
`>= 1` check. Built as required.
**Why:** not a judgement call. An artboard that marks a NOT NULL column optional
describes a form that fails at the database.
**Consequence:** two fewer "Optional" tags than the artboard shows; five remain.

## 2026-09-07 · `t-h3-aside`, and the supplier form keeps its own components

A new type role at 26 / 1.15 / −0.025em / 700 for the heading in a dark aside.
**Why:** `t-h3-card-lg` is the same 26px but declares no line-height and is
already carried by five components, so it cannot absorb a declared 1.15 without
changing all of them — and the fold rule forbids folding across a line-height
difference in any case. The heading wraps to two lines in a 312px column, where
the difference shows.
**Consequence:** `SupplierSidebar` and `SupplierSuccess` are their own
components rather than variants of the request ones. The sidebars are a timeline
and a checklist; the success screens differ in heading role, rows and whether a
rejected-files block exists. What genuinely repeated was extracted instead —
`SubmissionBanner`, `guardSubmission`, `FORM_COMMON`, and `max`/`maxLength` on
`ChipsField`.

## 2026-09-07 · Turnstile is rendered with `execution: "execute"`

The `render()` options set `execution: "execute"`. Cloudflare's default is
`"render"`, and on that default the widget arms its own challenge twice: once
when `render()` builds it (`isExecuted: pe, isExecuting: pe`, where
`pe = params.execution === "render"`) and again inside `reset()`, whose predicate
returns true unconditionally in that mode. Our own `execute()` then arrived at a
widget that was already executing, logged "Call to execute() on a widget that is
already executing", and returned without doing anything.
**Why it mattered:** it worked, but not for the reason the code claimed. The
token that came back was the one `reset()` had asked for; our `execute()` had
been a no-op since it was written. A challenge also ran at page load and its
token was discarded, which is exactly what the component's comment said we were
avoiding.
**Consequence:** `reset()` before `execute()` stays — it clears the stored
response and swaps in a fresh challenge iframe regardless of execution mode, and
the second submit needs that. Only its self-arming half was conditional. The
in-flight promise guard also stays: it never had anything to do with this
warning, but it is the right guard for the retry path.

## 2026-09-06 · File verification reads ranges, not whole files, and runs concurrently

Measured before changing anything. Verifying two files took 29s in the browser;
instrumenting the route gave, for a 2MB PDF and a 69-byte PNG:

| phase | production | dev |
| --- | --- | --- |
| download the 2MB PDF | 1044ms | **37219ms** |
| download the 69-byte PNG | 694ms | 499ms |
| magic-byte detection | **0.3ms** | 0.3ms |

**It was never the ZIP walk and never the detection** — those are sub-millisecond.
It was downloading whole files, sequentially. Two things compounded: a 69-byte
file still costs ~0.5s because the cost is a round trip, not bytes; and in dev,
buffering a large body through Next's patched `fetch` runs at roughly 18ms per KB,
which is where 37 of the 38 seconds went.

**Supabase Storage honours HTTP Range** — verified: 206 with a correct
`Content-Range`, for both prefix (`bytes=0-63`) and suffix (`bytes=-64`) forms.

So verification now reads a 64-byte head, and for a ZIP a 256KB tail — never the
middle, never the whole file. Size comes from `Content-Range`'s total, which is
Storage's own number rather than the client's claim. Files are inspected
concurrently, because the cost is latency.

Fair comparison, same 5 files (2MB PDF, two 1MB ZIPs, a PNG, and a mislabelled
file), same machine, same server lifetime:

| | run 1 | run 2 | run 3 |
| --- | --- | --- | --- |
| whole-file, sequential | 24.1s | 5.1s | 7.0s |
| ranged, concurrent | 1.79s | 2.16s | 1.88s |

Both detection paths were re-tested against real fixtures and agree on all eight,
including a `.docx` renamed `.xlsx` and a PNG declared as a PDF.

## 2026-09-06 · Turnstile needs an in-flight guard and removal on unmount

Two console warnings from a real submission: "Call to execute() on a widget that
is already executing" and "Cannot find Widget … consider using
turnstile.remove()".
**Why it mattered:** it happened to work on a first successful submission and
would have failed on the retry path — the one that only runs when something has
already gone wrong.
**Fixed:** a single in-flight promise, so a second `getToken()` returns the first
one's promise instead of starting a second challenge; `remove()` in an unmount
effect, because the success screen swaps the component out; and a 20-second
timeout so a challenge that never calls back cannot hold the submission open.
The automatic retry no longer resets the widget itself — `getToken()` owns that,
which is what made the two collide.

**Superseded in part on 2026-09-07:** the in-flight guard did not cause the
"already executing" warning to stop, because it was never the cause. See the
`execution: "execute"` entry above.

## 2026-09-06 · The last step has no advance button, and that guard regressed once

The footer nav's Continue button must not render on step 3, which submits from
the card body. The guard was written in 7a and lost when that block was rewritten
in 7b, so step 3 showed both "Sending request…" and "Continue".
**Consequence:** the guard now carries a comment saying it has regressed before.
The banner's "Try again" and the card's submit button can both be visible after a
failure; that is the artboard's own state 4 and is two entry points to one action,
not two competing actions.

## 2026-09-06 · The submission order is fixed, and nothing is written before the gates

Turnstile, then the rate limiter, then validation, then the row. A rejected
submission leaves no trace at all.
**Why the order matters:** writing first and validating after would let an
unverified or rate-limited caller fill the table with rows that then have to be
cleaned up. Verified end to end: a submission with no token, an invalid token, a
tampered payload, six file intents and an oversize intent each leave the row
count unchanged.
**Consequence:** once the row exists every later failure surfaces the reference.
A user is never told their request failed when it is in the database — the
"after-write" banner says it was received and names the reference.

## 2026-09-06 · `SUBMISSION_TOKEN_SECRET` is its own secret

An HMAC over `requestId + expiry`, ten-minute lifetime, gating the
file-verification endpoint.
**Why not the request id alone:** a v4 UUID is unguessable, but "unguessable
identifier as bearer token" ages badly — ids leak into logs, referrers and
support tickets in ways secrets do not.
**Why its own secret rather than derived from `SUPABASE_SECRET_KEY`:** the
Supabase key is rotated for reasons unrelated to this token. Coupling the two
schedules means an unrelated rotation silently invalidates in-flight
submissions, and someone spends an hour working out why.
**Rotating it invalidates tokens issued in the last ten minutes.** Bounded blast
radius, but do it deliberately. Must be set in all three Vercel environments,
alongside `RATE_LIMIT_IP_SALT`.

## 2026-09-06 · Turnstile's token is fetched at submit, not at page load

`turnstile.execute()` runs when the user clicks. If the server still reports
`timeout-or-duplicate`, the widget resets and the submission retries once,
silently, before anything surfaces.
**Why:** the token lives about five minutes and this form takes longer than that
to fill. Fetching at page load would fail for any user who reads the questions.

## 2026-09-06 · The success screen renders in place, not at its own route

**Why:** the reference would have to travel in the URL, where it lands in server
logs and referrer headers, and a `/request/success` reached without one is a
worse failure than losing it on refresh.
**Consequence:** a refresh loses the screen. Consistent with there being no
partial save and no resume in stage A.

## 2026-09-06 · The success screen does not claim an email was sent

The artboard reads "A confirmation email is on its way to {email}". Nothing
sends until block 9.
**Why:** telling someone to expect an email that never arrives is worse than
saying nothing — they wait, then assume the request was lost. The copy says what
is true: nothing more is needed, and the reference identifies the request.
**Consequence:** marked `TODO(copy) — BLOCK 9` in `src/content/request-success.ts`
to restore the email wording once Resend is wired.

## 2026-09-06 · Grounds are applied only through `.ground-*`, and a check enforces it

The `sidebar` Card tone used a background utility pointed at `--dark-quiet`,
which emits `background-color: var(--dark-quiet)`. The grounds are layered
gradients, and a gradient is an image, not a colour.
**Why it was silent:** `var()` is substituted at computed-value time, so the
parser cannot reject the declaration. It is accepted, then becomes invalid at
computed-value time, and the property falls back to its initial value —
`transparent`. No warning, no console error, nothing in the build output. The
card rendered with a border and no fill: white text on paper.
**Scope:** exactly one occurrence. All 14 other variable-fed backgrounds point at
`color-mix()` expressions, which are real colours. Every other gradient variable
was already reached only through `.ground-*`. Only `/request` was affected;
nothing on the nine previously reviewed pages touches that tone.
**Consequence:** `scripts/check-css-vars.mjs` resolves every variable fed to a
colour-only property — `color`, `background-color`, every `border-*-color`,
`fill`, `stroke` and the rest — through any chain of indirection, and fails if
one is an image. `pnpm check:css`, added to the definition of done. Verified with
a negative control: reintroducing the bug fails the check.

## 2026-09-06 · Asserting a declaration exists is not asserting it is valid

Every verification pass so far checked that a rule was emitted with the expected
declaration. `background-color: var(--dark-quiet)` passes that test perfectly —
it is exactly the declaration you would assert.
**Why it matters:** the failure is one level down, at whether the substituted
value is legal for the property. Any future variable of this shape would have
passed the same way. The check is written against the general class, not against
the grounds.

## 2026-09-06 · Every component variant goes on `/tokens` in its own block

Six of the twelve `Card` tones had drifted off the page, including the broken
one. Had `sidebar` been rendered there, it would have shown as an empty outline
before `/request` existed.
**Consequence:** written into `CLAUDE.md` as a rule rather than left as a habit,
and into the definition of done. All twelve tones are now on the page, each on
the ground it is used against; `sidebar` is shown on paper, which is both where
it is used and where the bug was visible.

## 2026-09-06 · Tailwind scans comments, so prose can emit classes

The first version of the comment warning about this bug spelled out the offending
utility, which regenerated it — and the new check flagged a class nothing used.
**Consequence:** comments and doc strings do not spell out utility class names.
Noted in `CLAUDE.md`.

## 2026-09-06 · Route groups: `(site)` and `(form)` own their chrome

The root layout is `html`, `body` and fonts only. `(site)/layout.tsx` adds the
marketing header and footer; `(form)/layout.tsx` adds the reduced app header and
no footer. `not-found.tsx` stays at the app root and renders its own.
**Why:** `/request` uses the 76/60 app header and the artboards give the form
pages no footer. With chrome in the root layout there was no way to express that
without a conditional on the pathname, which would have made the layout a client
component.
**Consequence:** nine page files moved; no URL changed. `/suppliers/apply` will
join `(form)` in block 8.

## 2026-09-06 · The artboard's 10MB file limit is wrong; 4MB ships

The dropzone copy reads "up to 10MB per file". Everything real says 4MB — the
bucket's `file_size_limit`, the `size_bytes` CHECK constraint, and the block 6
decision.
**Why:** the copy has to match what the server will accept, or the first person to
attach a 6MB drawing gets a rejection the page told them would work.
**Consequence:** the constraints line says 4MB. If the client wants 10MB, three
things change together — the bucket, the constraint and the copy — not just the
copy.

## 2026-09-06 · The Field API is a shell plus typed controls, not one component

`FieldShell` owns the label, the "Optional" tag or required marker, the
description, the hint, the error badge and all aria wiring. `TextField`,
`TextareaField`, `SelectField`, `DateField`, `ChipsField` and `FileField` consume
it and never wire aria by hand.
**Why one shell, not a `type` prop:** a chips field and a dropzone have nothing in
common with a text input except their chrome. A single component switching on
`type` would be a union of six unrelated prop sets.
**Built so the dark treatment is an addition, not a rewrite:** `tone` is threaded
through from the start and the shell's colour map already has both entries, read
from Contact's dark form. Control styling lives in one function,
`controlClasses`, whose dark branch throws today — the dark artboard has no error,
hint or locked state to copy, so guessing it would be worse than leaving it out.
**Obligation is expressed twice on purpose:** the light artboard tags what is
optional, the dark one marks what is required with an accent asterisk. Both are
props, so neither treatment is baked in.
**Locked state is a native `<fieldset disabled>`** carrying the artboard's
opacity, rather than simulated disabling.

## 2026-09-06 · Files are held in memory and uploaded only on submit

`File` objects live in component state. Nothing reaches storage until the final
submit in block 7b.
**Why:** an upload that starts before the request row exists can orphan an object
in the bucket. Holding the file until submit means a file can never exist without
a request.
**Consequence:** the client checks extension, size and count as a convenience; the
server re-checks all three plus the actual bytes. The dropzone's rejected state is
reachable only through the client checks in this block.

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
