# Build plan

Phases from SPEC 26. One phase at a time; each ends with tests, a browser check, a demo, and approval before the next starts.

| Phase | Status |
|---|---|
| 1. Foundation | Built (preview deployment and Supabase deferred by the owner) |
| 2. Marketing site | **Built — awaiting review** |
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
- [x] Logo (SPEC 2.1): `logo.png` in the root; `scripts/brand-assets.py` derives transparent and white versions, a mark-only crop, favicon, app icons and the Open Graph image (`public/brand/`, `app/`). Artwork is cropped and background-removed only, never redrawn.
- [x] Colour tokens re-sampled from the logo: navy-900 #011E56, blue-700 #0054C5, blue-500 #0085FC, gradient end #008DF8.
- [x] Lighthouse (mobile, simulated 4G), home, median of 5 runs: performance 98 (min 91), accessibility 100, best practices 96, SEO 100; LCP 2.2 s (range 2.1–3.0 s, variance from font timing in the test sandbox).

### Blocked / waiting
- [ ] **Preview deployment** — needs a Vercel project linked to this repo and a Supabase project (see accounts below).
- [ ] Apply the migration to the Supabase project (`supabase db push` or SQL editor) once it exists.

### Deviations from the spec (for review)
1. **Text colours.** `blue-500` is 3.65:1 on white and `slate-500` is 4.43:1 on `surface-alt`, both below AA for body text. So: links and small accent text use `blue-700`; secondary text uses a new `muted` token (#475569); success and warning text use `-700` variants. The spec colours are unchanged for buttons, icons, borders, focus rings and large display text.
2. **Links are underlined** in running text so they don't rely on colour alone (WCAG 1.4.1).
3. **Fonts use `display: optional`**, not `swap`: a late font swap pushed hero LCP to 2.9 s. On a slow first visit the metric-matched fallback font may show instead of Montserrat/Inter.
4. **Schema additions** (each required elsewhere in the spec): `public_events` (23.2 separate field set), `access_tokens` (23.1 single-purpose expiring tokens), `invoice_counters` + `next_invoice_number()` (14.2 sequential per market), `ai_calls` (21.2 logging), lead status `partial` (8.1 keep partial leads), `proposals.token_hash` (only a SHA-256 of the token is stored, never the token), `milestones.position` (SPEC's `order` is a reserved word).
5. **Staff access requires two-factor at the database level**: staff policies only match sessions with `aal2`. A staff member signed in without 2FA sees nothing.
6. **Client users cannot write files or questionnaire answers directly**; those go through server routes (virus scan, validation). Clients can post portal messages directly, only on their own project and as themselves.
7. **CSP allows `'unsafe-inline'` scripts** so marketing pages stay statically generated (a nonce forces dynamic rendering). Tighten with nonces on admin/portal in phase 10.
8. **Header and footer use the logo without the tagline.** At navigation size (48 px tall) the tagline would be about 3 px high and unreadable; the footer shows the tagline as text beneath. The full logo with tagline is used for large placements and the social image.
9. **Logo clear space = width of the "L" stem**, not the full height of the "L". The full height (about 70% of the logo's height) would need a header roughly 130 px tall. Confirm or tell me otherwise.
10. Stat counter "method" is a disclosure ("How this is counted") instead of a hover tooltip, so it works on touch and with keyboards.


---

## Phase 2 — Marketing site (SPEC 5, 6)

Open decisions use the SPEC 27 defaults: D4 systems only, D7 company name only (no team section), D9 no client case studies (the site is the first case study), D2 `call_only` (no prices shown).

### Done
- [x] All public pages, in both markets: Home (8 sections), Services overview, 4 service pages, 3 segment pages, How It Works, Case Studies index + "This website" case study, Blog index (empty state), About, Contact, Demo, Privacy, Terms, Data request.
- [x] Copy lives in `config/content/` (services, segments, pipeline, case studies, demo), with per-market variants (PH: GCash, Maya, BIR, CDA; US: QuickBooks, Xero, sales tax, ACH).
- [x] Pipeline diagram (SPEC 6.2): 7 stages, travelling pulse, each stage a button opening a details panel; vertical on mobile. Shows target times and says real averages appear once live. Compact animated version in the home hero.
- [x] Services diagram (SPEC 6.3): segment selector replays one record through CRM → Operations → Accounting → Bookkeeping.
- [x] Service and segment templates per SPEC 6.4 / 6.5: automation mini-diagrams, connections, segment tabs, day before / day after, FAQs.
- [x] Demo page: scripted playback for 3 fictional sample businesses (score breakdown, sample plan, emails, project), clearly labelled; ends with "Run this for real" → `/contact?segment=…`.
- [x] Legal drafts covering both markets (DPA 2012, CCPA), visibly flagged for legal review.
- [x] SEO: unique title + description per page, canonical on the market-free URL, Open Graph, structured data (Organization, Service, FAQPage, BreadcrumbList), full sitemap, robots.
- [x] Reduced motion: every animation has a still state; diagrams' text content never depends on animation.
- [x] Fonts subset to the characters and weights used (85 KB → 42 KB): `scripts/subset-fonts.py`.
- [x] Tests: 108 Playwright checks — every page in both markets for status, single h1, no horizontal scroll, canonical, valid JSON-LD, axe WCAG 2.1 AA; unique titles; sitemap exactness; diagrams and demo interaction; banned-claims scan.
- [x] Lighthouse mobile (simulated 4G): performance 94–99, accessibility 100, best practices 100, SEO 100 on every page tested.

### Left for later phases (placeholders say so on the page)
- Smart intake form on `/contact` and embedded on segment pages → phase 3. Until then `/contact` shows the email address.
- Chat launcher → phase 3.
- Live counters, activity feed, live stage lighting, and the real "Try it" demo on visitor input → phase 8.
- Blog posts and client case studies from the database, with filters → phase 9.
- Self-service data request form with email verification → later phase; `/data-request` uses email for now.

### Watch
- **LCP:** Lighthouse's simulated LCP median is 2.5–2.7 s on content pages (range 2.0–2.8 s), against a 2.5 s target. The hero text paints at 0.8 s; the estimate is pushed up by the framework's JavaScript in Lighthouse's pessimistic model. Re-measure on the real deployment (field data) in phase 10 before further work.

---

## Accounts and keys

**Phase 1 (to finish):** Vercel (project + preview deployments for this repo), Supabase (project URL, anon key, service-role key).

**Phase 2:** none new. Needs answers to D4 (systems only?), D7 (team on About page), D9 (case studies/testimonials).

**Phase 3:** Anthropic API key; Inngest (event + signing keys); Resend (API key, webhook secret, verified sending domain → D3); Cloudflare Turnstile (site + secret key); Upstash Redis (REST URL + token); team notification email. Sentry DSN recommended from here.

**Phase 4:** Cal.com (API key, webhook secret, event type); D2 pricing, D6 review mode, D8 hours.

**Phase 5:** Payment provider accounts per D1; D5 agreement text.

## Open decisions (SPEC 27)
D1 payments · D2 pricing · D3 domain/email · D4 systems-only · D5 agreement · D6 review mode · D7 team/address · D8 call hours · D9 case studies · D10 blog keywords. Defaults in SPEC 27 apply until answered.
