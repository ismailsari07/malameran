# Conventions

## Files and naming

- Route folders: kebab-case (`app/for-suppliers/page.tsx`)
- Components: PascalCase files in `components/`, one component per file
- Server-only helpers live in `lib/server/`, shared helpers in `lib/`
- Types in `types/`, colocated when only used once
- No `index.ts` barrel files

## TypeScript

- No `any`. Use `unknown` and narrow.
- Database types are generated from Supabase, not hand-written
- Prefer explicit return types on exported functions

## React / Next

- Server Components by default. Add `"use client"` only when the component needs
  state, effects, or browser APIs.
- Data fetching in Server Components or Route Handlers, never in `useEffect`
- Forms: Server Actions with server-side validation. Client-side validation is a
  convenience, never the security boundary.

## Tailwind

- Tailwind v4 — no `tailwind.config.ts`. Design tokens live in `src/app/globals.css`.
  Use them, don't hardcode hex values.
- Headings and body copy take a `.t-*` role class, never hand-assembled type properties.
- No arbitrary values (`w-[437px]`) unless there is a real reason
- Order: layout → spacing → typography → colour → state

## Supabase

- Every schema change is a migration file, never a change made in the dashboard
- RLS enabled on every table that holds user data, with an explicit policy per
  operation (select / insert / update / delete)
- Service-role key is used only in server code, never shipped to the client

## Git

- Branch per feature: `f1a/contact-form`, `f1b/admin-projects`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Commit messages in English, imperative mood, one logical change per commit
- Never commit `.env`, generated files, or `node_modules`

## Error handling

- User-facing errors are plain English and never leak internals
- Server errors are logged with enough context to debug
- Every form submission has a visible success and failure state
