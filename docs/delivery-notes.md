# Delivery notes — Phase 1, Stage A

For the client. What was built, what is still yours to decide, and what is
deliberately outside this stage.

Everything here is drawn from `docs/decisions.md` and the open items in
`docs/tasks/f1-a.md`. Nothing in this document is new information; it is the
subset you need to act on, in one place.

---

## 1. The legal pages are template text, pending review

`/privacy` and `/terms` are live and linked from the footer, and both carry a
visible notice at the top of the page saying the text is a template and not legal
advice. That notice is deliberate and should stay until the text is reviewed.

**Twenty-one `[PLACEHOLDER: …]` values render publicly on those two pages right
now.** They are deliberately ugly so that shipping them by accident is impossible
to miss. They break down as:

**Facts only you can supply**

- Effective date (both documents)
- Registered legal entity name (both documents)
- Retention period for enquiry and form submissions
- Retention period for account and project data
- Response window for access and deletion requests
- Hosting region and data-processing-agreement status for **Supabase**, **Vercel**
  and **Resend** — these three are named in the policy because which services
  process the data is a fact about the stack, not a guess
- Whether personal information leaves Canada, stated plainly
- Analytics provider, in four places — see section 2, because these move together
  with a code change

**Questions for whoever reviews the text**

- **Is PIPEDA the right regime?** The policy currently says the federal Act
  applies because Ontario has no private-sector privacy statute of its own. That
  is correct for an Ontario-only footprint. It changes if you have a
  establishment, employees or customers in **Quebec** (Law 25 imposes additional
  and stricter obligations, including a designated privacy officer by name and
  breach-reporting duties), **British Columbia** or **Alberta** (each has its own
  PIPA). This is the single most likely thing to be wrong in the document.
- Whether a designated privacy officer is required or appointed
- Whether any cookie requires consent under the applicable rules
- Which courts have jurisdiction, and whether you want an exclusive-jurisdiction
  clause
- Whether a liability cap applies, and whether it belongs in the terms or in the
  project agreement
- Whether the precedence clause matches your actual client contract

**What to do:** have the text reviewed, answer the list above, and the copy can be
replaced without touching any code — every string lives in
`src/content/privacy.ts` and `src/content/terms.ts`.

---

## 2. Analytics: installed, switched off, and limited when you switch it on

The code is in place and **completely inert**. With no measurement ID set, nothing
loads and no request is made to Google at all. It is also off in development
regardless. Turning it on is setting one environment variable in Vercel.

Before you do, two things.

### It is cookieless, and that has a real cost

The configuration writes **no cookie and no browser storage**, which is why the
site needs no consent banner. The trade is that Google Analytics has nothing to
recognise a returning visitor with, so it issues a new identity on every page
view.

**You will get:** page views per URL, reliably. Which pages get traffic. The
referrer or campaign for each landing page view. Country, region, device and
browser.

**You will not get: no returning visitors, no sessions, no funnels and no
attribution.** It answers "how much traffic, to which pages, from where". It
cannot answer "who came back" or "what path led to a request". Someone going
Home → Services → Request is counted as three unrelated visitors, not one
journey. Bounce rate and session duration are meaningless numbers here.

If you later want the second kind of answer, that is a consent-banner
conversation, not a settings change.

### Enabling it and updating the privacy policy are one change, not two

The privacy policy currently states that no analytics provider has been selected,
in four places. **The moment the measurement ID is set in Production, a published
legal document becomes false.** The policy copy and the environment variable must
change together, in the same deployment.

---

## 3. The logo is a placeholder, and a vector is needed

The site uses `public/malameran-mark.png`, kept from the original prototype. It
was shipped for this stage over a recorded objection, which is the right call for
launch — a placeholder mark beats no mark. But it has three specific defects, and
naming them means the replacement request can be precise rather than "send us a
logo":

1. **It is opaque.** A solid cold-navy tile (`#020917`) sitting on a warm
   near-black bar (`#1F1E23`). It reads as a bluer square patch rather than a mark
   on the header. **The replacement needs a transparent background.**
2. **It is a crop, not a mark.** It is the larger emblem file with the edges cut
   off — the globe circle is clipped at the left, right and top, with a band of
   cut-off lettering along the bottom.
3. **Its strokes are too fine to survive small sizes.** They are about 3% of the
   image width, so at the sizes a header uses they fall below one pixel and
   average into a brown smudge.

On mobile it is rendered at 36px with rounded corners and a cream hairline, which
turns the tile into a deliberate badge and hides the worst of the crop. On desktop
it is 13px beside the wordmark text.

**What to supply:** an SVG, with a transparent background, whose strokes stay
legible at 13px. Swapping it is a change to one file —
`src/components/ui/brand-mark.tsx` is the only place the path appears.

---

## 4. Two unconfirmed details, currently placeholders

- **The registered company name.** The footer reads "© 2026 Malameran Sourcing
  Inc." and the legal pages carry `[PLACEHOLDER: registered legal entity name]`.
  Nobody has confirmed the registered name, so it is deliberately absent from the
  structured data a search engine reads — only the brand name "Malameran" appears
  there. Confirm it and both are corrected together.
- **`info@malameran.com` is the only mailbox referenced anywhere on the site.**
  The design originally showed `hello@`, `sourcing@` and `suppliers@` in different
  places. Those were removed because nobody had confirmed they exist. If you want
  separate addresses for buyers and suppliers, say so and they can be
  reintroduced; if not, `info@` needs to be a mailbox someone reads.

The site shows **city and country only** — Toronto, Ontario, Canada — and no
telephone number and no street address, because none has been confirmed. The
design showed a King Street address; it was removed for the same reason.

---

## 5. Your production infrastructure, as it stands

Recorded so that Stage B, or another developer, inherits an accurate picture. No
secrets here — just the shape of what exists.

- **A production Supabase project, separate from development.** They share no data
  and no keys.
- **Row Level Security is enabled and forced on all four tables, with zero
  policies**, plus grants revoked from the anonymous and authenticated roles as an
  independent second layer. Verified: the publishable key that ships to the browser
  is refused on every table.
- **The storage bucket is private**, with a MIME whitelist and a per-file size
  limit. Nothing in it is publicly readable. Uploads and downloads both go through
  short-lived signed URLs.
- **Cloudflare Turnstile is configured in invisible mode.** Its hostname allowlist
  must include the live domain, or the forms fail on production and nowhere else.
- **Vercel holds the environment variables across Production, Preview and
  Development**, with the production values scoped to Production only.
- **Production migrations are applied by hand, by you.** The command-line tool
  stays linked to the development project, so no routine command can reach
  production data. Migration files themselves are committed to the repository, so
  the schema's history is in version control.

---

## 6. What Stage A does not include

Stated explicitly so the boundary is clear before Stage B begins.

**Not built, by design:**

- **No user accounts.** No sign-up, no sign-in, no password reset. Both forms are
  public and require no account.
- **No client portal and no admin panel.** Submissions land in the database and
  are announced by email. Reading them today means opening the Supabase dashboard.
- **No project tracking.** The "Request received → Supplier research → Quotes →
  Production → Delivery" progress view is Stage B.
- **No supplier portal.** Suppliers can apply; they cannot log in, maintain a
  profile or upload documents.
- **No messaging and no file sharing** between you and a client.
- **No supplier document upload.** The application form deliberately has no file
  field — a supplier application is a lead, not a project.
- **No payments, invoicing or escrow.** That is Phase 3 at the earliest.
- **No search, no filtering, no reporting, no dashboards.**

**Consequences worth knowing now:**

- **Attachments are not linked in the team notification email.** A signed link is
  a bearer token that would sit in every inbox backup and would expire long before
  the email is read. Retrieving an attachment today means looking the reference up
  in the Supabase dashboard. Stage B's admin panel replaces this with a direct
  link.
- **There is no durable record of an email send.** A failure is written to the
  application log with the reference in it, and there is no automatic retry. At
  this volume that is acceptable; a proper send log belongs with the admin panel.
- **Rate limiting is five submissions per form, per network address, per ten
  minutes.** It fails closed: if the check itself cannot run, the submission is
  refused rather than allowed through.
