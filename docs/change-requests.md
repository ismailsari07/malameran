# Change requests

Anything asked for that is not in `docs/scope.md` goes here first.
Nothing on this list gets built until it has a decision and, where relevant, a price.

Rule: requests are never refused outright — they are logged, priced, and scheduled
into the current stage's tail or a later phase.

| Date | Request | Source | Decision | Effect | Status |
|---|---|---|---|---|---|
| 2026-09-08 | Lead → Qualified → Project pipeline in the admin panel | Client feedback | Deferred to F1-B | Admin panel does not exist in Stage A | logged |
| 2026-09-08 | Simple CRM in the admin panel | Client feedback | Deferred to F1-B | Same | logged |
| 2026-09-08 | Supplier category hierarchy replacing the flat `text[]` | Client feedback | Deferred to F1-B | Schema + migration; affects Phase 3 matching quality | logged |
| 2026-09-08 | Extended funnel analytics to Customer | Client feedback | Deferred to F1-B | Back half needs accounts and the admin panel | logged |
| 2026-09-08 | Four commercial fields on the sourcing form | Client feedback | Deferred to F1-B | Schema + migration; field types undecided | logged |
| 2026-09-08 | Supplier performance score | Client feedback | Deferred to phase 2 | Feeds Phase 3 AI matching | logged |
| 2026-09-08 | Platform section, Sign In, dashboard mockup on the marketing site | Client feedback | Not accepted for Stage A | Out of scope; no accounts exist yet | logged |
| 2026-09-08 | Business model: reseller or agent? | Client feedback | **Blocking** — client meeting | Determines liability, tax, import, insurance, payment flow, revenue model, and the legal copy | open question |

Status values: `logged` · `priced` · `accepted` · `deferred to phase 2` · `declined`

---

## 2026-09-08 · Client copy feedback — deferred items

Recorded from the client's longer feedback alongside the copy corrections applied
on the same date. **None of this is implemented.** The copy corrections that *were*
applied are listed at the end of this section.

### F1-B (Stage B)

**Lead → Qualified → Project pipeline in the admin panel.**
Stages: New Lead → Reviewing → Qualified → Project Created → Sourcing.

**Simple CRM in the admin panel.**
Per company: company, contact, country, sector, source
(Google / LinkedIn / referral / direct), project count, last-contact date,
status tag.

**Supplier category hierarchy.**
Main category → sub-category → product/capability, replacing the current single
`text[]` on `supplier_applications.manufacturing_categories`. The point of doing
it early is that structured data must be collected from day one, so the Phase 3
matching engine does not inherit dirty free-text data that has to be
retrospectively cleaned.

**Extended funnel analytics.**
Visitor → Request Started → Request Submitted → Qualified Lead → Quote →
Customer. Only the first three are observable from the public site. The back half
depends on the admin panel and on accounts, so it cannot exist before F1-B —
this is a sequencing constraint, not a preference.

**Four commercial fields on the sourcing form.**

- Incoterm (EXW / FOB / CIF / DDP)
- Delivery country and city, or port
- One-off versus recurring purchase
- Existing supplier: yes / no

A small schema and migration change. Deferred pending a decision on the field
types and on which step of the three-step form each belongs in.

### Phase 2

**Supplier performance score.**
Composed from on-time delivery, quality issues, response speed, quote
competitiveness and completed orders. Feeds the Phase 3 AI matching engine.

### Open business-model question — blocks legal copy, affects every phase

**Does the customer buy from Malameran, or does Malameran act as an agent, with
the purchase contract sitting between the customer and the manufacturer?**

This determines liability, tax, import, insurance, payment flow and the revenue
model. It is not a copy question.

The retracted line — "The contract sits with us, not with an overseas
intermediary" — cannot return until this is answered. **Flagged for the client
meeting.**

Implementation note, so the retraction is not assumed to be complete: the same
assertion still appears twice on `/about`, in `src/content/about.ts` (the page
lead and the closing statement), both reading *"we are registered where the buyer
is, and the contract sits with us."* Those two were not named in the feedback and
have deliberately not been changed. They need the same decision.

### Applied on the same date, for the record

String changes only, in `src/content/`. All remain `TODO(copy)` — this was a
correction, not sign-off.

- Hero eyebrow → "Global sourcing & procurement · Canada"
- Primary CTA → "Start a Project" / "Start" (short mobile form)
- Trust reason 01 → "Suppliers are screened and verified against the requirements
  of each project before we recommend them."
- Trust reason 04 ("The contract sits with us…") removed, not replaced
- Final CTA reassurance → "No obligation to proceed until you review and approve
  our proposed next step."
- For-suppliers panel → "We are continuously expanding our global supplier
  network."
