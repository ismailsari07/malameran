# Malameran

Managed global sourcing platform for a Canada-based company. Buyers submit sourcing
requests; Malameran staff find and vet overseas manufacturers and run the process end
to end. This is a client portal plus an internal admin panel — not a marketplace and
not a product catalogue.

## Commands

- `npm run dev` — local dev server
- `npm run build` — must pass before any commit
- `npm run lint`
- `npx supabase migration new <name>` / `npx supabase db push`

## Stack

Next.js (App Router) · TypeScript · Tailwind · Supabase (Auth, Postgres, Storage) ·
Vercel · Resend

## Scope discipline

- Phased delivery. Current position and stage definitions: `docs/roadmap.md`
- Full scope: `docs/scope.md`. Never build something that is not in it.
- If a request is out of scope, do not implement it. Log it in
  `docs/change-requests.md` and say so.
- When unsure whether something is in scope, ask instead of assuming.

## Hard rules

- English UI only. No i18n, no locale routing, no translation files.
- Every table holding user data needs RLS policies. Never rely on UI filtering or
  a `where user_id = ...` in application code alone. Verify as a non-owner before
  calling a feature done.
- Uploaded files are never publicly readable. Signed URLs with expiry only.
- Transactional email sends from the `send.` subdomain, never the root domain.
- Messaging is asynchronous. No realtime subscriptions, no presence, no typing
  indicators — those are a later phase.
- No secrets in the repo. Env vars only, mirrored in `.env.example`.
- Do not add a dependency without asking first. Prefer the platform and what is
  already installed.
- Do not create files that were not asked for — no extra READMEs, no scaffolding
  "for later".

## Conventions

Naming, commits, branches and component structure: `docs/conventions.md`

## Definition of done

Feature works · `npm run build` passes · RLS verified from a second account ·
no console errors · responsive at 375px and 1440px · task checked off in
`docs/tasks/`.

## Docs maintenance

You own the files in `docs/`. Keep them current without being asked.

After finishing any task, in the same commit:
- Tick the matching box in `docs/tasks/`
- Add real decisions to `docs/decisions.md` (date, decision, why, consequence)
- Update the "current position" in `docs/roadmap.md` when a stage starts or ends
- Log out-of-scope requests in `docs/change-requests.md`
- Update `docs/scope.md` when scope actually changes, and say so in the reply

Exception: `docs/design.md` is generated once and edited only when told.

Skip doc updates for trivial changes. Never invent a decision that wasn't made.

## Design

- Visual reference: `design/*.html`. Reference only — never imported by the app.
- Tokens live in `tailwind.config.ts`. Never hardcode a hex value.
- Rebuild designs as proper components; do not paste export markup into the app.
- Token table and layout rules: `docs/design.md`
