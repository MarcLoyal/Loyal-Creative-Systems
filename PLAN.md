# Build plan

Phases from SPEC 26. One phase at a time; each ends with tests, a browser check, a demo, and approval before the next starts.

| Phase | Status |
|---|---|
| 1. Foundation | **Built — awaiting approval** (preview deployment blocked on accounts, see below) |
| 2. Marketing site | Not started |
| 3. Capture and qualification | Not started |
| 4. Proposal and booking | Not started |
| 5. Closing and onboarding | Not started |
| 6. Client portal | Not started |
| 7. Admin dashboard | Not started |
| 8. Live proof | Not started |
| 9. Content and growth | Not started |
| 10. Hardening and launch | Not started |

---

## Phase 1 — Foundation (SPEC 2, 3.3, 20, 21)

### Done
- [x] Repository and stack: Next.js 16.4 (App Router, Cache Components), TypeScript strict, Tailwind 4, ESLint, Vitest, Playwright.
- [x] Design tokens from SPEC 2.2 in `app/globals.css`; contrast checked (see "Deviations").
- [x] Self-hosted fonts: Montserrat (headings) and Inter (body), variable woff2 in `app/fonts/`.
- [x] Angled "S" cut as reusable shapes: `cut-corners`, `cut-corner-tr`, `divider-angle`.
- [x] Design system page `/design-system` (noindex header + meta, disallowed in robots): buttons (primary, secondary, ghost, loading, disabled), form fields (text, select, radio cards, checkbox cards, checkbox, textarea, error and success states), cards, badges, status pills, table, tabs, modal, toast, stepper, pipeline node, stat counter, timeline, empty state, skeleton loader.
- [x] Layout, header (Services and Solutions menus, primary CTA, market switcher, mobile menu), footer (columns, switcher, contact email, legal links). Menus work without JavaScript; Escape and outside-click close them.
- [x] Market detection and switcher (SPEC 3.3): `proxy.ts`; cookie `lcs_market` for 12 months; switcher is a plain form POST so it works without JavaScript; open-redirect protected.
- [x] Database schema for every SPEC 20 table + security policies: `supabase/migrations/20261115000000_initial_schema.sql`.
- [x] Security policy tests: 66 integration tests against real Postgres (anonymous, client-vs-client isolation, staff 2FA, owner-only settings, append-only audit log, constraints). Mutation-checked: loosening a policy makes them fail.
- [x] Security headers: CSP, HSTS, frame-ancestors none / X-Frame-Options DENY, nosniff, strict referrer policy, permissions policy. `X-Robots-Tag: noindex` on private routes.
- [x] `.env.example` with a comment per variable and the phase that needs it.
- [x] CI workflow: audit, typecheck, lint, unit, integration (Postgres service), build; e2e on main.
- [x] Lighthouse (mobile, simulated 4G), home: performance 96, accessibility 100, best practices 96, SEO 100; LCP 2.1 s.

### Blocked / waiting
- [ ] **Preview deployment** — needs a Vercel project linked to this repo and a Supabase project (see accounts below).
- [ ] **Logo** — `logo.png` was not supplied. A plain-text wordmark and a placeholder "LCS" favicon stand in; flip `BRAND.logoAvailable` in `config/site.ts` once the processed files are in `public/brand/`. Colour tokens still need re-sampling from the file.
- [ ] Apply the migration to the Supabase project (`supabase db push` or SQL editor) once it exists.

### Deviations from the spec (for review)
1. **Text colours.** `blue-500` is 3.65:1 on white and `slate-500` is 4.43:1 on `surface-alt`, both below AA for body text. So: links and small accent text use `blue-700`; secondary text uses a new `muted` token (#475569); success and warning text use `-700` variants. The spec colours are unchanged for buttons, icons, borders, focus rings and large display text.
2. **Links are underlined** in running text so they don't rely on colour alone (WCAG 1.4.1).
3. **Fonts use `display: optional`**, not `swap`: a late font swap pushed hero LCP to 2.9 s. On a slow first visit the metric-matched fallback font may show instead of Montserrat/Inter.
4. **Schema additions** (each required elsewhere in the spec): `public_events` (23.2 separate field set), `access_tokens` (23.1 single-purpose expiring tokens), `invoice_counters` + `next_invoice_number()` (14.2 sequential per market), `ai_calls` (21.2 logging), lead status `partial` (8.1 keep partial leads), `proposals.token_hash` (only a SHA-256 of the token is stored, never the token), `milestones.position` (SPEC's `order` is a reserved word).
5. **Staff access requires two-factor at the database level**: staff policies only match sessions with `aal2`. A staff member signed in without 2FA sees nothing.
6. **Client users cannot write files or questionnaire answers directly**; those go through server routes (virus scan, validation). Clients can post portal messages directly, only on their own project and as themselves.
7. **CSP allows `'unsafe-inline'` scripts** so marketing pages stay statically generated (a nonce forces dynamic rendering). Tighten with nonces on admin/portal in phase 10.
8. Stat counter "method" is a disclosure ("How this is counted") instead of a hover tooltip, so it works on touch and with keyboards.

### Known, expected until phase 2
- Header and footer link to pages that don't exist yet (404). Lighthouse best-practices shows 96 only because of 404 prefetches of `/contact` and `/demo`.
- Home page is a shell to prove layout and market routing; the real home page is phase 2.

---

## Accounts and keys

**Phase 1 (to finish):** Vercel (project + preview deployments for this repo), Supabase (project URL, anon key, service-role key).

**Phase 2:** none new. Needs answers to D4 (systems only?), D7 (team on About page), D9 (case studies/testimonials).

**Phase 3:** Anthropic API key; Inngest (event + signing keys); Resend (API key, webhook secret, verified sending domain → D3); Cloudflare Turnstile (site + secret key); Upstash Redis (REST URL + token); team notification email. Sentry DSN recommended from here.

**Phase 4:** Cal.com (API key, webhook secret, event type); D2 pricing, D6 review mode, D8 hours.

**Phase 5:** Payment provider accounts per D1; D5 agreement text.

## Open decisions (SPEC 27)
D1 payments · D2 pricing · D3 domain/email · D4 systems-only · D5 agreement · D6 review mode · D7 team/address · D8 call hours · D9 case studies · D10 blog keywords. Defaults in SPEC 27 apply until answered.
