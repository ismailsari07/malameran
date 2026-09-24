# F1-B · Customer panel and admin panel

Stage is done when: a client signs in and sees their project's status, the team runs
every project from the panel, and no client can reach another client's data by any
route.

Scope: `docs/scope.md`, "Hesap sistemi", "Müşteri paneli", "Yönetim paneli".
The client feedback that extends it is in `docs/change-requests.md`; the decisions
taken on it are recorded in `docs/decisions.md`.

## Block 1 — Panel shell (UI only)

- [x] "Panel shell" written into `docs/design.md` § "Authored, not in the source"
      before any component — no artboard exists for any panel screen
- [x] Shared shell for both panels: bar, sidebar from `lg`, drawer below it,
      1280px container, authored body rhythm
- [x] Sidebar marks the current route; admin lists Requests and Projects, then
      Companies, Users and Supplier applications
- [x] Drawer behaviour lifted into one hook shared with the marketing site's
      mobile menu — portal, Escape, Tab cycle, focus return, scroll lock
- [x] Page-title pattern, empty state and flat loading state
- [x] `/dashboard` and `/admin` route groups, `/admin` redirecting to Requests
- [x] Every panel route 404s in production until auth lands
- [x] All eight panel routes in the ROUTES table, noindex, roots disallowed
- [x] Rendered on `/tokens` in its own block
- [x] Zero new colour, radius or type tokens

## Block 2 — Customer panel

- [ ] Project list
- [ ] Project detail with the eight-stage status tracker
- [ ] Profile

## Block 3 — Admin panel

- [ ] Requests list, filter and search
- [ ] Project list, filter and search
- [ ] Project detail, status update, internal notes closed to the client
- [ ] Companies — an editable form, not a read-only list: `source` and
      `last-contact date` are captured nowhere today
- [ ] User list
- [ ] Supplier applications

## Accounts, schema and RLS

- [ ] Sign-up, sign-in, password reset, email verification, protected routes
- [ ] Roles: client, admin
- [ ] Schema and migrations for projects, project status and company records
- [ ] RLS policy per operation on every table holding user data
- [ ] Verified as a second account: no client can reach another client's rows
- [ ] Remove the production gate on `(panel)` once real access control replaces it
- [ ] Grants for the new authenticated role alongside the policies — carried from
      `docs/tasks/f1-a.md`

## Decisions still open

- [ ] **Business model — reseller or agent.** Blocks the panel's vocabulary
      (project versus order), whether a client ever sees a supplier's identity,
      and the two remaining contract claims in `src/content/about.ts`
- [ ] Confirm the client's own word for an unconverted request — the sidebar says
      Requests, the feedback says Lead
- [ ] Supplier category hierarchy: hardcoded list, or a taxonomy the admin panel
      maintains
- [ ] Supplier applications: read-only triage, or a status of their own
- [ ] The four commercial fields on the sourcing form — field types, and which
      step of the public form each belongs in
- [ ] Sign In on the marketing site: deferred out of block 1, still needed before
      a client can reach `/dashboard`

## Known issues carried in

- [ ] `src/components/layout/wordmark.tsx` — `MARK.site` ends in a size utility
      with no value, which emits nothing, so the desktop mark never leaves its
      mobile size; `MARK.app` is a 48px mark against a doc comment describing 11
      and 13px. Arrived in `5b59cb4 change icons size`, inherited by the panel bar
      because it reuses `Wordmark`. Its own commit, deliberately not this one
