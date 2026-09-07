# Malameran

Managed global sourcing platform for a Canada-based company. Buyers submit sourcing
requests; Malameran staff find and vet overseas manufacturers and run the process end
to end. This is a client portal plus an internal admin panel — not a marketplace and
not a product catalogue.

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — must pass before any commit
- `pnpm lint`
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm check:css` — asserts no colour property is fed a gradient variable
  (run after `pnpm build`; it reads the built CSS)
- `pnpm check:routes` — asserts every page has a ROUTES entry in `src/lib/seo.ts`,
  which is what gives it a canonical, a sitemap entry and its noindex
- `pnpm check:classnames` — asserts no `className` passed into a component fights
  a layout utility that component already sets
- `pnpm format` — Prettier
- `pnpm dlx supabase migration new <name>` / `pnpm dlx supabase db push`

pnpm only. The package manager is pinned in `package.json`.

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

Feature works · `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm check:css`,
`pnpm check:routes` and `pnpm check:classnames` all pass ·
every new component variant rendered on `/tokens` ·
RLS verified from a second account ·
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
- Tailwind v4: there is no `tailwind.config.ts`. Tokens live in `src/app/globals.css` —
  `@theme static` for colour/font/radius/breakpoint, `:root` for the gradient grounds,
  `@layer components` for ground and typography role classes, `@utility` for focus rings.
  Never hardcode a hex value. A new token goes in `docs/design.md` first.
- Use the `.t-*` typography role classes rather than assembling size, weight, line-height
  and family by hand.
- **Display, position, width and flex-direction are props, never `className`
  overrides.** `cn()` is a plain join, so two unprefixed utilities in one class
  attribute are settled by whichever Tailwind emits later, not by the order you
  wrote them. This has cost the project three bugs. `pnpm check:classnames`
  enforces it.
- Rebuild designs as proper components; do not paste export markup into the app.
- Token table and layout rules: `docs/design.md`
- The gradient grounds are applied **only** through the `.ground-*` component
  classes, never through a background utility pointed at the variable. A gradient
  is an image, not a colour: fed to `background-color` it is invalid at
  computed-value time and falls back to transparent, silently. `pnpm check:css`
  enforces this.
- **Every `Card`, `Eyebrow`, `Rule`, `Button` or `Marker` variant added must be
  rendered on `/tokens` in the same block that introduces it.** A variant that is
  not on that page has not been looked at. Six tones drifted off it and a broken
  one reached review.
- Tailwind scans comments as well as code. A class name written in prose
  generates that class — do not spell out utilities in comments or docs strings
  unless you want them emitted.
