# Loyal Creative Systems — website

Marketing site and fully automated lead-to-client pipeline. **[SPEC.md](SPEC.md) is the source of truth**; [PLAN.md](PLAN.md) tracks build progress phase by phase.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Supabase (Postgres, auth, storage, realtime) · Inngest · Claude API · Resend · Cal.com · Vercel. See SPEC 21.

> Next.js 16 differs from older versions (e.g. `middleware.ts` is now `proxy.ts`). Read `node_modules/next/dist/docs/` before changing framework-level code — see [AGENTS.md](AGENTS.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what the current phase needs
npm run dev
```

Test the PH market locally with `DEV_COUNTRY=PH npm run dev`, or visit `/ph` (sets the market cookie) and `/us` to switch back.

## Tests

```bash
npm run typecheck
npm run lint
npm run test:unit
export TEST_DATABASE_URL=$(scripts/local-postgres.sh start)   # throwaway local Postgres 16
npm run test:integration                                       # schema + row-level security
npm run build && npm run test:e2e                              # Playwright: routing, a11y, responsive
```

The database tests apply `supabase/tests/supabase-shim.sql` (Supabase's `auth` schema and roles) and every migration to a fresh database per test file, then query as `anon`, client users and staff.

## Layout

```
app/(marketing)/[market]/   Public pages, statically generated once per market (ph, us)
app/design-system/          Component reference (not indexed)
app/api/                    Route handlers
components/ui/              Design system
components/site/            Header, footer, market switcher
config/                     Site constants, navigation (later: catalog, pricing, templates)
lib/                        market, env, db clients (later: ai, email, payments, booking, scoring)
supabase/migrations/        Schema and security policies
tests/{unit,integration,e2e}
proxy.ts                    Market detection → internal rewrite to /ph or /us
```

## Brand assets

`logo.png` (root) is the master file. `python3 scripts/brand-assets.py` (needs Pillow and NumPy) regenerates `public/brand/*`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` and `app/opengraph-image.png` from it.

## How market routing works

Public URLs never contain the market. `proxy.ts` picks `ph` or `us` (switcher cookie first, then the edge country header; Philippines → PH, everything else → US) and rewrites internally to `app/(marketing)/[market]/…`. Each market's pages are prerendered, so pages stay static and fast. `/ph/...` and `/us/...` links set the cookie and redirect to the clean URL.
