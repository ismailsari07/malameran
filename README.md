# Malameran

Managed global sourcing platform for a Canada-based company. Buyers submit sourcing
requests; Malameran staff find and vet overseas manufacturers and run the process end
to end. A client portal plus an internal admin panel — not a marketplace and not a
product catalogue.

This repository is **Phase 1 Stage A**: the public marketing site, the sourcing request
form, the supplier application form, and the notification emails behind them. Scope and
phasing are in `docs/scope.md` and `docs/roadmap.md`. What Stage A deliberately does
not include is listed in `docs/delivery-notes.md`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Storage) ·
Vercel · Resend · Cloudflare Turnstile

## Prerequisites

- **Node.js 20 or newer**
- **pnpm 10.14.0** — pinned in `package.json` under `packageManager`. Use
  `corepack enable` and pnpm will match it automatically. npm and yarn are not
  supported; the lockfile is pnpm's.
- Accounts, if you are setting this up fresh: Supabase, Vercel, Resend, Cloudflare
  (Turnstile only).

## Setup from a clean checkout

```bash
git clone <repo> && cd procurement-static-site
corepack enable
pnpm install
cp .env.example .env.local     # then fill it in — see below
pnpm dev                       # http://localhost:3000
```

`src/lib/env.ts` validates every variable at startup and throws with the specific
key name if one is missing or malformed, so a bad `.env.local` fails immediately
and loudly rather than at the first form submission.

## Environment variables

All of these are set in Vercel across Production, Preview and Development. Locally
they live in `.env.local`, which is git-ignored. `.env.example` is the template.

| Variable                               | Public | Required | What it is                                                                                                                                                                                                                                 |
| -------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                 | yes    | yes      | The origin, no trailing slash. **Drives every canonical URL, the sitemap and the Open Graph image.** Wrong here breaks all three together and silently. `https://malameran.com` in Production.                                             |
| `NEXT_PUBLIC_SUPABASE_URL`             | yes    | yes      | Supabase project URL. Also the origin injected into the Content-Security-Policy at build time — see `next.config.ts`.                                                                                                                      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes    | yes      | `sb_publishable_…`. Safe in the browser: every table has RLS on with zero policies, and the role has no grants.                                                                                                                            |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | yes    | yes      | Cloudflare Turnstile site key, invisible widget. The widget's hostname allowlist must include the domain you are serving from.                                                                                                             |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`        | yes    | **no**   | `G-…`. Absent by default: with no value nothing loads and no request reaches Google. **Setting it also makes the published privacy policy false** — see `docs/delivery-notes.md`.                                                          |
| `SUPABASE_SECRET_KEY`                  | no     | yes      | `sb_secret_…`. **Bypasses RLS.** Server only.                                                                                                                                                                                              |
| `TURNSTILE_SECRET_KEY`                 | no     | yes      | Verifies the Turnstile token server-side.                                                                                                                                                                                                  |
| `RATE_LIMIT_IP_SALT`                   | no     | yes      | ≥32 chars. Salts the IP hash so the raw address never reaches the database. Rotating it resets every active rate-limit window. Same value in all three environments.                                                                       |
| `SUBMISSION_TOKEN_SECRET`              | no     | yes      | ≥32 chars. HMAC key tying the file-verification call to its request row. Deliberately its own secret so rotating the Supabase key does not invalidate in-flight submissions.                                                               |
| `RESEND_API_KEY`                       | no     | yes      | Resend API key.                                                                                                                                                                                                                            |
| `EMAIL_FROM`                           | no     | yes      | `name@send.malameran.com` or `Name <name@send.malameran.com>`. **Must be on the `send.` subdomain** — the schema refuses to boot otherwise, because automated mail on the root domain damages the reputation of the client's own outreach. |
| `TEAM_NOTIFICATION_EMAIL`              | no     | yes      | Where new-submission notifications go.                                                                                                                                                                                                     |

Generate the two secrets with `openssl rand -hex 32`.

## Commands

```bash
pnpm dev               # local dev server
pnpm build             # must pass before any commit
pnpm start             # serve the production build locally
pnpm lint
pnpm typecheck         # tsc --noEmit
pnpm check:css         # no colour property is fed a gradient variable
pnpm check:routes      # every page has a ROUTES entry in src/lib/seo.ts
pnpm check:classnames  # no className override fights a component's own layout
pnpm format            # Prettier
```

The three `check:*` scripts are project-specific guards, each written after a real
bug reached review. They are part of the definition of done in `CLAUDE.md`, and
`check:css` reads the built CSS, so run `pnpm build` first.

## Database and migrations

Migrations are files in `supabase/migrations/`, committed to the repository. Nothing
is ever applied by pasting SQL into the Supabase dashboard — the repository is the
record of what the schema is.

```bash
pnpm dlx supabase migration new <name>   # create
pnpm dlx supabase db push                # apply to the LINKED project
pnpm dlx supabase projects list          # check which project is linked
```

**The CLI is linked to the development project.** Production migrations are applied
by hand, deliberately, by the project owner — see `docs/delivery-notes.md`. Do not
link the CLI to production for routine work.

Four tables, all with RLS enabled and forced and **zero policies**, plus
`revoke all … from anon, authenticated` as an independent second layer:
`sourcing_requests`, `supplier_applications`, `request_files`, `rate_limits`.
Only the secret key reaches them, and only from server code.

Regenerate `src/types/database.ts` after a schema change:

```bash
pnpm dlx supabase gen types typescript --linked > src/types/database.ts
```

## Dev and production are separate Supabase projects

They share no data and no keys. The development project is where you run migrations,
test forms and leave rows behind. The production project holds real submissions.

Storage is one private bucket, `request-files`, with a MIME whitelist and a 4MB
per-file limit. Nothing in it is ever publicly readable: uploads go through short-lived
signed upload URLs, and downloads through short-lived signed download URLs.

## Deployment

Vercel, connected to the repository.

- **Push to `main` → Production.** The domain is `malameran.com`.
- **Any other branch or pull request → a Preview deployment** with its own URL and the
  Preview environment's variables.
- The build runs `next build`. If any required environment variable is missing the
  build fails at that point rather than deploying something broken.

Before a production deploy that touches the schema, apply the migration to production
first — the application expects the columns to exist.

## Where things are

```
src/app/(site)/       marketing pages, full header and footer
src/app/(form)/       /request and /suppliers/apply, reduced header, no footer
src/app/api/          three route handlers, all server-side
src/components/ui/    Button, Card, Eyebrow, Rule, Marker, BrandMark
src/components/form/  the field layer shared by both forms
src/content/          every user-visible string, marked TODO(copy) where unreviewed
src/lib/              env, schemas, email, storage, rate limiting, SEO
design/               the design canvas export. Reference only, never imported
docs/                 scope, roadmap, decisions, design system, tasks, delivery notes
```

`/tokens` renders every design token and component variant. It exists in development
and on previews and **returns 404 in production** — it is a complete inventory of the
design system at a guessable URL. Every new component variant is added to it in the
same change that introduces it.

## Documentation

- `CLAUDE.md` — how to work in this repository. Read it first.
- `docs/scope.md`, `docs/roadmap.md` — what is being built, and in what order.
- `docs/decisions.md` — every decision that would otherwise get re-litigated, with
  the reasoning and the consequence. Newest at the top.
- `docs/design.md` — the token table and layout rules, extracted from the design.
- `docs/tasks/f1-a.md` — the Stage A checklist and every open item.
- `docs/delivery-notes.md` — what the client needs to know and act on.
