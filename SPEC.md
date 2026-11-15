# Loyal Creative Systems — Website Specification

Version 1.0 · 2026-11-15

This document specifies the Loyal Creative Systems (LCS) website: a marketing site joined to a fully automated lead-to-client pipeline. It is written to be handed to Claude Code as the source of truth for the build.

Items marked **[DECISION]** are unresolved and listed together in section 27. Do not guess at them; ask.

---

## 1. Overview

### 1.1 Company
Loyal Creative Systems builds custom automated internal systems for businesses: CRM, operations, accounting, and bookkeeping systems, connected into one flow.

Tagline: **Expert Strategy, Automated Solutions.**

### 1.2 Purpose of the website
The site has two jobs:

1. **Sell.** Turn visitors into booked calls and paying clients.
2. **Prove.** Every step from first click to onboarded client runs without a human touching it, and the site shows that automation working. The site is the first case study a prospect sees.

### 1.3 Goals
| Goal | Measure | Target |
|---|---|---|
| Fast response to leads | Time from form submit to personalized reply | Under 60 seconds |
| Hands-off pipeline | Share of leads reaching "call booked" with zero manual steps | 100% of those that book |
| Hands-off closing | Share of accepted proposals onboarded with zero manual steps | 100% |
| No lost leads | Leads with no record or no reply | 0 |
| Site quality | Lighthouse performance, accessibility, best practices, SEO | 90+ each, on mobile |

### 1.4 Non-goals
- The website is not the product LCS delivers to clients. It does not include the CRM, operations, accounting, or bookkeeping systems themselves.
- No public pricing calculator in version 1 unless pricing rules are fixed packages (see **[DECISION]** D2).
- No native mobile app.
- No languages other than English in version 1.

### 1.5 What LCS is not
LCS builds systems. It is not an accounting, bookkeeping, tax, or audit firm. No page, email, chat reply, or proposal may state or imply that LCS provides licensed accounting, tax, or audit services, or guarantees regulatory compliance. (See **[DECISION]** D4.)

---

## 2. Brand and design

### 2.1 Logo
- File: `logo.png` in the project root. Copy to `public/brand/`.
- Use the file as supplied. Do not redraw, recolor, or re-letter it.
- Produce from it: a transparent-background version, a square mark-only crop ("LCS" letters) for the favicon and app icons, and a white version for dark backgrounds. If a clean result is not possible from the PNG, ask for a vector file.
- Clear space around the logo: at least the height of the letter "L" in the mark on all sides.

### 2.2 Color
Sample exact values from the logo file. Approximate values:

| Token | Approx. value | Use |
|---|---|---|
| `navy-900` | #0B1F5C | Primary: headings, nav, footer background, primary buttons |
| `blue-500` | #0A84FF | Accent: links, highlights, active pipeline stages, focus rings |
| `blue-700` | #0B4FC4 | Hover states, gradient midpoint |
| `ink` | #0F172A | Body text |
| `slate-500` | #64748B | Secondary text |
| `surface` | #FFFFFF | Page background |
| `surface-alt` | #F4F7FB | Alternating sections, cards |
| `success` | #16A34A | Completed steps |
| `warning` | #D97706 | Waiting states |
| `danger` | #DC2626 | Errors, failed runs |

The navy-to-blue gradient from the "S" in the logo may be used on hero accents and the pipeline diagram only. All text and background pairs must meet WCAG AA contrast.

### 2.3 Typography
- Headings: a geometric sans-serif close to the logo wordmark (Montserrat or similar), weights 600 and 700.
- Body: Inter or similar, weights 400 and 500.
- The tagline style from the logo (uppercase, wide letter spacing) is reused for small section labels.
- Self-host fonts. Base size 16px, line height 1.6 for body.

### 2.4 Shape and motion
- The angled cut from the "S" is the recurring shape: section dividers, card corners, button accents.
- Motion represents systems working: data moving along a line, a step ticking complete, a counter updating. No decorative animation.
- Respect `prefers-reduced-motion`: replace animation with static states.

### 2.5 Components
Build a design system page at `/design-system` (not indexed) showing: buttons (primary, secondary, ghost, loading, disabled), form fields (text, select, radio cards, checkbox, textarea, error and success states), cards, badges, status pills, tables, tabs, modal, toast, stepper, pipeline node, stat counter, timeline, empty state, skeleton loader.

### 2.6 Voice
Direct, specific, confident. Short sentences. Describe outcomes in the client's terms ("Your invoice is created the moment the job is marked done") rather than technology terms. No hype words. No invented statistics.

---

## 3. Audiences

### 3.1 Segments
| Segment | Who | Main pains | What LCS builds for them |
|---|---|---|---|
| Cooperatives | Credit, multi-purpose, and service cooperatives; managers, bookkeepers, board officers | Member records in spreadsheets or paper, manual loan and collection tracking, slow report preparation for the board and general assembly | Member database, share capital and savings tracking, loan and collection management, patronage refund and dividend calculations, board and member reports |
| Agencies | Marketing, creative, staffing, and virtual assistant agencies; owners and operations leads | Manual client onboarding, scattered project tracking, missed billable time, no view of profit per client | Client onboarding flow, project and retainer tracking, time capture and billing, profitability per client |
| Local service businesses | Clinics, repair, cleaning, trades, salons, logistics; owners | Missed inquiries, double bookings, late invoices, uncollected payments, no repeat-customer follow-up | Booking and dispatch, job tracking, invoicing and payment collection, repeat-customer follow-up |

### 3.2 Markets
| | Philippines | USA |
|---|---|---|
| Currency | PHP (₱) | USD ($) |
| Expected payment methods | GCash, Maya, bank transfer, card | Card, ACH |
| Phone format | +63, 10 digits after | +1, 10 digits |
| Address | Barangay, city or municipality, province, ZIP | Street, city, state, ZIP |
| Privacy law | Data Privacy Act of 2012 | CCPA and state laws |
| Context to reference | CDA reporting for cooperatives, BIR-ready records | Sales tax, 1099 tracking, QuickBooks and Xero familiarity |

Cooperatives are primarily a Philippine segment. The cooperative landing page is shown in both markets but its examples are Philippine.

### 3.3 Market handling
- Detect country from the request (edge geolocation header). Philippines → PH market; everything else → US market.
- A market switcher in the header and footer overrides detection. Store the choice in a cookie for 12 months.
- Market sets: currency, pricing rules, example copy, testimonials, case studies shown first, phone and address field formats, payment methods.
- Market-specific regulatory terms are described only as things the systems help organize. Never as a compliance guarantee.

---

## 4. Services

Four services, each with its own page, plus an overview.

| Service | What it covers | Example automations to show |
|---|---|---|
| CRM systems | Leads, clients or members, pipelines, follow-ups, communication history | New inquiry is logged, assigned, and answered instantly; follow-ups send themselves until the person replies |
| Operations systems | Tasks, scheduling, job tracking, approvals, inventory | A closed sale creates the job, assigns the team, and schedules it; approvals route to the right person |
| Accounting systems | Invoicing, collections, expenses, financial reports | A completed job creates and sends the invoice; overdue invoices trigger reminders; reports build themselves |
| Bookkeeping systems | Transaction capture, categorization, reconciliation, month-end summaries | Receipts and bank transactions are captured and categorized; month-end summary arrives without anyone compiling it |

**The core message** is the connection between the four: a sale in the CRM creates the job in operations, which creates the invoice in accounting, which posts to the books, with no re-typing. The Services overview page presents this as an interactive diagram (section 6.3).

---

## 5. Sitemap

```
/                               Home
/services                       Services overview
/services/crm
/services/operations
/services/accounting
/services/bookkeeping
/solutions/cooperatives         Segment landing pages
/solutions/agencies
/solutions/local-service
/how-it-works                   Our automated process, shown live
/case-studies                   Index
/case-studies/[slug]
/blog                           Index
/blog/[slug]
/about
/contact                        Smart intake form
/demo                           Interactive "Try it" pipeline demo
/proposal/[token]               Private proposal page (not indexed)
/proposal/[token]/accept        Agreement and payment
/book/[token]                   Booking for a known lead
/privacy
/terms
/data-request                   Request access to or deletion of personal data
/login
/portal/...                     Client portal (section 16)
/admin/...                      Admin dashboard (section 17)
/design-system                  Component reference (not indexed)
```

Global header: logo, Services (menu), Solutions (menu), How It Works, Case Studies, About, market switcher, primary button "Get your system plan" → `/contact`.

Global footer: logo, tagline, link columns, market switcher, contact email, privacy and terms links, copyright.

A chat launcher (section 9) appears on every public page except proposal acceptance and login.

---

## 6. Page specifications

### 6.1 Home
Sections in order:

1. **Hero.** Headline stating the offer in the client's terms, one supporting sentence, primary button "Get your system plan", secondary button "Watch it work" → `/demo`. Beside the text: the animated pipeline diagram (6.2) in compact form.
2. **Proof strip.** Live counters (section 18). Hidden until thresholds are met.
3. **The problem.** Three short cards on the cost of disconnected, manual back-office work.
4. **The four systems.** Four cards linking to the service pages, joined by an animated line showing data passing between them.
5. **Who we build for.** Three cards linking to segment pages. Order follows the visitor's market (cooperatives first in PH).
6. **This site runs itself.** The full pipeline diagram (6.2) with the live activity feed beside it (section 18).
7. **Case studies.** Up to three, filtered to the visitor's market first.
8. **Final call to action.** "Tell us about your business. You'll have a tailored plan in your inbox in under a minute."

### 6.2 Pipeline diagram (Home and How It Works)
Seven stages, left to right on desktop, top to bottom on mobile:

`Lead in → AI qualifies → Proposal sent → Call booked → Agreement and payment → Onboarding → Reporting`

- A pulse travels along the line continuously. When a real pipeline event occurs (section 18), the matching stage lights up.
- Clicking a stage opens a panel: what happens, what triggers it, how long it takes on average (real number once available), and what the client receives.
- Keyboard accessible. Each stage is a button with a descriptive label.

### 6.3 Services overview
- Interactive four-node diagram (CRM, Operations, Accounting, Bookkeeping). Selecting a segment (cooperative, agency, local service) replays a short example of one record travelling through all four systems for that segment.
- Four service summaries linking to their pages.

### 6.4 Service pages (×4)
Template: what the system does in one sentence → the manual work it replaces → three to five example automations with small diagrams → how it connects to the other three systems → segment-specific examples (tabs) → frequently asked questions → call to action.

### 6.5 Segment landing pages (×3)
Template: headline naming the segment → their top pains → a "day before / day after" comparison → the systems most relevant to them → a relevant case study if one exists → frequently asked questions → intake form embedded with the segment pre-selected.

### 6.6 How It Works
The full pipeline diagram with each stage expanded into a section: what the visitor experiences, what the system does behind the scenes, and a real anonymized example. Ends with the "Try it" demo link.

### 6.7 Case studies
- Index with filters: segment, service, market.
- Detail template: client type and market, the problem, what was built, the result with real numbers, a quote if approved.
- Only real, client-approved case studies are published. If none exist at launch, the page shows the LCS site itself as the first case study, with real pipeline numbers.

### 6.8 About
Who LCS is, how it works, the team (**[DECISION]** D7: names and photos or not), and service areas.

### 6.9 Contact
The smart intake form (section 8) as the main content. A plain contact email is also shown. No phone number unless supplied.

### 6.10 Demo
The interactive "Try it" demo (section 18.3).

### 6.11 Legal pages
Privacy policy, terms, and data request form. Draft from standard templates covering both markets and flag them for legal review before launch. The drafts are not legal advice.

---

## 7. The automated pipeline

### 7.1 Stages
| # | Stage | Trigger | System actions | Target time | Lead status after |
|---|---|---|---|---|---|
| 1 | Lead in | Intake form submitted or chat intake completed | Validate, check for spam, check for duplicate, save lead, log event | Under 2 s | `new` |
| 2 | AI qualifies | Lead saved | Score lead (section 10), write summary, assign tier, send confirmation email to lead, send notification to team | Under 60 s | `qualified` or `nurture` |
| 3 | Proposal sent | Tier is hot or warm | Generate proposal (section 11), run checks, publish private page, email link | Under 5 min | `proposal_sent` |
| 4 | Call booked | Lead books a slot | Save booking, send confirmation and calendar invite, stop proposal reminders, start call reminders, generate call brief for team | Instant | `call_booked` |
| 5 | Agreement and payment | Lead accepts proposal | Collect e-signature, take payment, issue receipt, store signed agreement | Instant | `won` |
| 6 | Onboarding | Payment confirmed | Create client account, create project from template, send welcome email and onboarding questionnaire | Under 2 min | `onboarding` → `active` |
| 7 | Reporting | Weekly schedule and project events | Generate and send weekly summary, update portal status | Scheduled | `active` |

Other statuses: `nurture` (cold lead in email sequence), `lost` (declined or sequence exhausted), `spam`, `unsubscribed`.

### 7.2 Workflow engine rules
- Every stage is a durable background job with a unique idempotency key. Re-running a job must not send a duplicate email, create a duplicate record, or charge twice.
- Retries: up to 5 attempts with exponential backoff (30 s, 2 min, 10 min, 1 h, 6 h).
- After the final failure: mark the run `failed`, log the error, email the team with a link to the run in the admin dashboard.
- Every job writes an `automation_runs` row and every state change writes an `events` row (section 19).
- A lead never sits in a status without a pending action or an explicit end state. A daily job finds stalled leads (no event in 48 h while in a non-terminal status) and alerts the team.
- Each sequence can be paused, resumed, or skipped per lead from the admin dashboard.

### 7.3 Duplicate handling
Match on normalized email. If a match exists: attach the new submission to the existing lead, re-score, do not restart sequences already running, and note the repeat in the team notification.

### 7.4 Spam handling
- Honeypot field and a minimum time-to-submit check.
- Invisible challenge (Cloudflare Turnstile or similar).
- Rate limit: 5 submissions per IP per hour.
- AI check flags obvious spam or abuse; flagged leads go to `spam` with no emails sent, visible in the admin dashboard for review.

---

## 8. Smart intake form

### 8.1 Behavior
- Multi-step, one question group per screen, progress indicator, back button, answers saved between steps (so a partial lead is kept if email was already given).
- Later questions depend on earlier answers.
- Works without JavaScript for the basic fields (name, email, message).
- All fields labelled, errors announced to screen readers.

### 8.2 Steps
**Step 1 — About you**
- Full name (required)
- Work email (required)
- Phone (optional; format by market)
- Business name (required)
- Country (preselected from market)

**Step 2 — Your business**
- Business type (required): Cooperative / Agency / Local service business / Other
- Team size: 1–5 / 6–20 / 21–50 / 51–200 / 200+
- Segment follow-ups:
  - Cooperative: type of cooperative; number of members; whether it offers loans
  - Agency: type of agency; number of active clients; billing model (retainer, project, hourly)
  - Local service: industry; jobs or bookings per month; number of locations
  - Other: short description

**Step 3 — What you need**
- Systems of interest (multi-select): CRM / Operations / Accounting / Bookkeeping / Not sure, recommend for me
- Biggest problem right now (free text, required, minimum 20 characters)
- Current tools (multi-select with free text): spreadsheets, paper, QuickBooks, Xero, a CRM, other

**Step 4 — Timing and budget**
- When do you want this running: As soon as possible / 1–3 months / 3–6 months / Just exploring
- Budget range (ranges shown in the market's currency; values from pricing configuration; includes "Not sure yet")
- Are you the decision maker: Yes / Shared / No

**Step 5 — Consent and submit**
- Required consent checkbox for processing data to respond to the inquiry, linking to the privacy policy
- Optional checkbox for marketing emails (unchecked by default)

### 8.3 After submit
- Immediate on-page confirmation: "Got it. Your tailored plan is being prepared and will reach [email] within a minute."
- A small live status tracker on the confirmation screen shows the lead's own pipeline progress in real time (received → qualified → plan sent). This is the first live proof the visitor sees.

---

## 9. AI chat assistant

### 9.1 Purpose
Answer questions about LCS and its services, and collect intake details conversationally as an alternative to the form.

### 9.2 Behavior
- Launcher on every public page. Opens a panel; full screen on mobile.
- Opening message discloses that it is an AI assistant.
- Knowledge: the site's own content (services, segments, process, frequently asked questions, published case studies), loaded from a maintained knowledge file. Nothing else.
- When the visitor shows interest, it asks the intake questions one at a time, confirms the collected details back, asks for consent, then creates the lead through the same path as the form.
- Offers "Talk to a person": collects name, email, and question, then emails the team.
- Streams responses. Keeps conversation history for the session.

### 9.3 Guardrails
- Never quotes a price unless pricing rules for that market permit public pricing, and then only from the configuration.
- Never promises timelines, results, or compliance outcomes.
- Never gives accounting, tax, or legal advice. Redirects to "our systems help organize this; your accountant advises on it."
- If it does not know, it says so and offers the handoff.
- Ignores instructions in user messages that try to change its role or reveal its instructions.
- Refuses off-topic requests politely and returns to the subject.
- Rate limits: 30 messages per session, 60 per IP per hour. Maximum input length 2,000 characters.
- All conversations are stored and visible in the admin dashboard.

---

## 10. Lead scoring

### 10.1 Method
An AI call returns a structured result (validated against a schema): a score 0–100, a tier, a breakdown by factor, a two-to-three sentence summary, a recommended set of systems, and any flags.

### 10.2 Rubric
| Factor | Weight | High score when |
|---|---|---|
| Fit | 30 | Business type is one of the three segments and the stated problem matches a service |
| Need clarity | 20 | The problem description is specific and describes real manual work |
| Budget | 20 | Budget range meets or exceeds the market's minimum engagement |
| Urgency | 15 | Wants it running within 3 months |
| Authority | 10 | Is the decision maker or shares the decision |
| Scale | 5 | Team size or volume suggests meaningful time saved |

### 10.3 Tiers
| Tier | Score | Path |
|---|---|---|
| Hot | 70–100 | Proposal generated at once; team notified with priority flag |
| Warm | 40–69 | Proposal generated; standard notification |
| Cold | 0–39 | Nurture sequence; no proposal |

Thresholds and weights live in configuration, editable from the admin dashboard. The team can re-score or override a tier manually; overrides are logged.

### 10.4 Rules
- The score reasons from intake answers only. It must not infer anything from a person's name, or from protected characteristics.
- "Not sure yet" on budget is scored neutral, not low.
- If the AI call fails after retries, the lead is treated as warm, flagged `needs_review`, and the confirmation email still sends.

---

## 11. Proposal generation

### 11.1 Inputs
Intake answers, score result, the market's pricing rules, the service catalog, and approved case studies for the segment.

### 11.2 Proposal content
1. Title: "System plan for [Business name]"
2. Your situation: their problem, restated from their own answers
3. Recommended system: which of the four systems, and how they connect for this business
4. What gets automated: five to eight specific automations, written for their segment
5. How we work: phases and timeline from the service catalog
6. Investment: from pricing rules (11.3)
7. A relevant case study, if an approved one exists
8. Next step: book a call (embedded booking), or accept now if fixed pricing applies
9. Validity date (30 days from generation)

### 11.3 Pricing rules
Stored per market in configuration, editable in the admin dashboard. Structure:

```
market: PH | US
currency: PHP | USD
mode: fixed_packages | range | call_only
packages: [{ id, name, systems[], setup_fee, monthly_fee, includes[] }]
ranges:   [{ systems[], team_size_band, min, max }]
minimum_engagement: number
deposit_percent: number
```

- `fixed_packages`: the proposal shows the matching package and price, and can be accepted online.
- `range`: the proposal shows a range and states that the final figure is confirmed on the call.
- `call_only`: the proposal shows no figure and leads to booking.

Prices are never generated by AI. The AI selects from configuration; the application inserts the figures. See **[DECISION]** D2.

### 11.4 Checks before sending
Automated checks on every generated proposal:
- Every price and timeline in the text matches configuration exactly.
- Business name, contact name, and segment match the lead record.
- No banned claims (guarantees, compliance promises, licensed accounting services).
- No placeholders or empty sections.

A failed check triggers one regeneration. A second failure holds the proposal for manual review and alerts the team; the lead is told the plan is being finalized.

### 11.5 Proposal page
- URL `/proposal/[token]`: unguessable token (at least 128 bits), not indexed, expires with the validity date.
- Branded page matching the site, with the lead's business name.
- Tracks first open, each view, and time on page. Shown in the admin dashboard.
- Download as PDF.
- Buttons: "Book a call" (embedded booking) and, where allowed, "Accept and get started".

### 11.6 Review mode
A setting `proposal_review` with values `auto` or `hold`. In `hold`, proposals wait for one-click team approval before sending. Default at launch: `hold` for the first 20 proposals, then switch to `auto` by decision. See **[DECISION]** D6.

---

## 12. Booking

- Embedded on the proposal page and at `/book/[token]`, prefilled with the lead's name and email.
- Call length: 30 minutes. Video link created automatically.
- Team availability is set in Philippine time. Slots are shown in the visitor's time zone. For US visitors, only offer slots that fall between 8:00 and 20:00 their local time.
- Minimum notice 12 hours. Maximum 14 days ahead. 15-minute buffer between calls.
- On booking: confirmation email with calendar invite, reschedule and cancel links, and the proposal link.
- A call brief is generated for the team: lead summary, score breakdown, proposal link, suggested questions.
- Reschedule and cancel update the lead status and restart the relevant reminders.
- No-show (marked by the team or by absence of a join signal): triggers the no-show sequence.

---

## 13. Email

### 13.1 General rules
- Sent from a verified domain with SPF, DKIM, and DMARC configured.
- Every email has a plain-text version, the company name and address in the footer, and an unsubscribe link on anything that is not strictly transactional.
- Scheduled emails send between 9:00 and 18:00 in the recipient's time zone, Monday to Friday. Transactional emails send at once.
- Templates are stored in code with editable copy in the admin dashboard. Personalized passages are AI-written from the lead's data and inserted into fixed templates.
- A sequence stops the moment the lead takes the action it is asking for, replies, or unsubscribes.
- Replies go to a monitored team inbox and are logged on the lead.

### 13.2 Catalog
| ID | Email | Trigger | Timing |
|---|---|---|---|
| T1 | Inquiry received (personalized) | Lead qualified | At once |
| T2 | Team notification: new lead | Lead qualified | At once |
| T3 | Your system plan is ready | Proposal published | At once |
| P1 | Proposal reminder 1 | Proposal unopened | +2 days |
| P2 | Proposal reminder 2 (opened, not booked) | Proposal opened, no booking | +2 days after open |
| P3 | Proposal reminder 3 | Still no booking | +5 days |
| P4 | Last note before the plan expires | Still no booking | 3 days before expiry |
| B1 | Call confirmed | Booking made | At once |
| B2 | Call reminder | Booking | 24 hours before |
| B3 | Call reminder | Booking | 1 hour before |
| B4 | Sorry we missed you (rebook link) | No-show | +1 hour |
| C1 | Follow-up after call with accept link | Call completed | +2 hours |
| C2 | Accept reminder | Not accepted | +3 days |
| C3 | Accept reminder | Not accepted | +7 days |
| W1 | Welcome and receipt | Payment confirmed | At once |
| W2 | Onboarding questionnaire | Payment confirmed | At once |
| W3 | Questionnaire reminder | Not completed | +2 days, +5 days |
| W4 | Portal access | Client account created | At once |
| R1 | Weekly progress summary | Schedule | Mondays 9:00 client time |
| R2 | Milestone completed | Milestone marked done | At once |
| R3 | Invoice issued / payment reminder | Invoice events | At once; +3, +7 days overdue |
| F1 | Project complete and review request | Project closed | +3 days |
| N1–N5 | Nurture sequence | Cold tier, with marketing consent | Days 0, 4, 10, 20, 35 |
| A1 | Team alert: automation failed | Run failed | At once |
| A2 | Team alert: stalled lead | Daily check | Daily 9:00 PH time |

Nurture content: one useful, segment-specific idea per email, each with a link back to the intake form. Cold leads without marketing consent receive T1 only.

After P4 or C3 with no action, the lead moves to `lost` and, with marketing consent, into the nurture sequence.

---

## 14. Agreement and payment

### 14.1 Acceptance page
`/proposal/[token]/accept`, single page:
1. Summary of what is being bought and the amount due now.
2. Service agreement, generated from a fixed template with the proposal's scope and price inserted. The template needs legal review before launch (**[DECISION]** D5).
3. E-signature: typed full name, checkbox "I agree", timestamp, IP address, and user agent recorded. A signed PDF is generated and stored.
4. Payment for the deposit or first period, per pricing rules.

### 14.2 Payment
- Implemented behind a provider interface: `createCheckout`, `handleWebhook`, `refund`, `getStatus`. One implementation per market if needed.
- Provider choice is **[DECISION]** D1. Requirements: PH market supports GCash, Maya, card, and bank transfer; US market supports card and ACH.
- Card data never touches LCS servers. Use the provider's hosted fields or checkout.
- The payment webhook is the only source of truth for "paid". Verify webhook signatures. Handle duplicates idempotently.
- Bank transfer in the PH market: show instructions and a reference code; mark as `awaiting_payment`; the team confirms receipt in the admin dashboard, which then triggers onboarding. This is the one permitted manual step, and it is labelled as such.
- Receipts are sent automatically. Invoices are numbered sequentially per market.
- Failed or abandoned payment: status `payment_pending`, reminder emails at +1 hour and +1 day.

---

## 15. Onboarding

Triggered by confirmed payment:

1. Lead becomes a client record; the contact becomes a portal user with a magic-link invitation.
2. A project is created from the template for the purchased systems, with phases, milestones, and default tasks.
3. Welcome email and receipt (W1), questionnaire (W2), portal access (W4).
4. The onboarding questionnaire is segment- and service-specific: current tools and access, key people and roles, existing data and its format, priorities, and preferred working hours. File upload supported.
5. Completing the questionnaire marks the first milestone done, notifies the team, and offers a kickoff call booking.

Project templates are stored as configuration, one per service, combinable.

---

## 16. Client portal

### 16.1 Access
- Login by magic link (email). Optional password. Sessions expire after 30 days of inactivity.
- A client user sees only their own organization's data, enforced at the database level by row-level security.
- A client organization can have multiple users, invited by an existing user.

### 16.2 Screens
| Screen | Contents |
|---|---|
| Overview | Current phase, progress bar, next milestone and date, anything waiting on the client, latest update |
| Timeline | Phases and milestones with status and dates |
| Updates | Feed of progress updates and weekly summaries |
| Files | Shared files in both directions, with upload; 25 MB per file; virus-scanned |
| Messages | Threaded messages with the team; email notification on new messages |
| Billing | Invoices, payment status, receipts, pay-now for open invoices |
| Agreement | Signed agreement and proposal |
| Account | Users, notification preferences, data export request |

### 16.3 Weekly summary
Generated each week from that week's actual project data (tasks completed, milestones reached, items waiting on the client, next week's planned work). The AI writes the prose; every fact comes from the data. If nothing changed, the summary says so plainly. Posted to the portal and emailed (R1).

---

## 17. Admin dashboard

Access: team members only, with roles `owner` and `member`. Two-factor authentication required.

| Screen | Contents |
|---|---|
| Pipeline | Board of leads by status, with counts and value per column; filters for market, segment, tier, date |
| Lead detail | All intake answers, score with breakdown and summary, full event timeline, emails sent with open and click status, chat transcript, proposal with view tracking, bookings, notes. Actions: re-score, change tier, resend any email, regenerate proposal, pause or resume sequences, mark lost, delete |
| Automations | Every run with stage, status, duration, attempts, and error. Filter by failed. Retry button |
| Proposals | List with status (held, sent, opened, booked, accepted, expired). Approve or edit held proposals |
| Clients and projects | Client list; project detail with tasks, milestones, updates, files, messages. Marking a task or milestone done here drives the portal and summaries |
| Payments | Invoices and payments per market; confirm bank transfers |
| Content | Blog and case study drafts awaiting approval; edit, approve, schedule, reject |
| Conversations | Chat transcripts and handoff requests |
| Metrics | Leads over time, conversion per stage, median time per stage, response time, revenue per market, source breakdown |
| Settings | Pricing rules, scoring weights and thresholds, email copy, availability, proposal review mode, proof thresholds, team members, knowledge file for the chat |
| Audit log | Every manual action and settings change, with who and when |

---

## 18. Live proof

### 18.1 Activity feed
- Shows recent real pipeline events, anonymized: stage, duration, segment, and country only. Example: "Proposal sent to a cooperative in the Philippines · 2 min 10 s after inquiry".
- Never shows names, business names, emails, or amounts.
- Updates in real time. Shows the latest 10 events.
- If there are fewer than 5 events in the last 30 days, the feed is replaced by a link to the demo.

### 18.2 Counters
| Counter | Source |
|---|---|
| Median response time to an inquiry | `events` timestamps |
| Workflows run | Count of successful `automation_runs` |
| Manual steps in our own pipeline | Count of manual overrides, expected to read 0 |
| Hours of manual work saved | Workflows run × configured minutes per workflow type, with the method stated in a tooltip |

Each counter is hidden until it passes a configurable threshold. No number on the site is ever hard-coded or estimated without its method shown.

### 18.3 "Try it" demo
- The visitor enters a sample business (name, type, one problem) or picks a preset.
- The pipeline runs on that input in a sandbox and plays back step by step: the score with its reasoning, a short sample proposal, the emails that would be sent, the project that would be created.
- Clearly labelled as a demonstration. Nothing is emailed and no lead is created.
- Ends with "Run this for real with your business" → intake form, prefilled.
- Rate limit: 3 runs per IP per hour. Inputs screened for abuse.

---

## 19. Content automation

### 19.1 Blog
- Weekly job proposes five topics from the service catalog, segment pains, and a maintained keyword list.
- The team picks topics (or a setting auto-picks the top one). A draft is generated with title, description, outline-based body of 800–1,200 words, and suggested internal links.
- Drafts wait in the admin dashboard. Nothing publishes without approval.
- Drafts must not include statistics, quotes, or client stories that are not supplied in the inputs.
- Published posts get structured data, an Open Graph image, and sitemap entry automatically.

### 19.2 Case studies
When a project is marked complete, a draft case study is generated from project data and held. Publishing requires team approval and recorded client consent.

### 19.3 Reviews
F1 asks the client for a short review with a one-click rating and optional text. Publishing a review as a testimonial requires the client's explicit consent, recorded with a timestamp.

---

## 20. Data model

All tables have `id` (UUID), `created_at`, and `updated_at`. Money is stored as integer minor units with a currency code. Timestamps are stored in UTC.

| Table | Key fields |
|---|---|
| `leads` | name, email, phone, business_name, country, market, segment, team_size, segment_answers (JSON), systems_interest[], problem, current_tools[], timeline, budget_range, decision_maker, status, tier, score, source, utm fields, consent_processing_at, consent_marketing_at, time_zone |
| `lead_scores` | lead_id, score, tier, breakdown (JSON), summary, recommended_systems[], flags[], model, overridden_by |
| `events` | lead_id or client_id, type, stage, payload (JSON), actor (system or user id), duration_ms, public (boolean, for the feed) |
| `automation_runs` | workflow, lead_id or client_id, idempotency_key (unique), status, attempts, started_at, finished_at, error |
| `conversations` | session_id, lead_id (nullable), page, handoff_requested |
| `messages_chat` | conversation_id, role, content |
| `proposals` | lead_id, token (unique), market, content (JSON), pricing_snapshot (JSON), status, review_status, expires_at, first_opened_at, view_count |
| `bookings` | lead_id, provider_id, starts_at, time_zone, status, meeting_url |
| `emails` | lead_id or client_id, template_id, subject, status, provider_id, sent_at, opened_at, clicked_at |
| `sequences` | lead_id, type, step, status (active, paused, stopped, done), next_run_at |
| `agreements` | proposal_id, signer_name, signed_at, ip, user_agent, pdf_path |
| `payments` | client_id or lead_id, provider, provider_id, amount, currency, method, status, invoice_id |
| `invoices` | client_id, number, market, amount, currency, status, due_at, paid_at |
| `clients` | lead_id, organization_name, market, segment, status |
| `users` | email, name, role (owner, member, client), client_id (nullable) |
| `projects` | client_id, name, systems[], status, phase, started_at, target_end_at |
| `milestones` | project_id, name, order, status, due_at, done_at |
| `tasks` | project_id, milestone_id, name, status, assignee_id, waiting_on_client |
| `updates` | project_id, type (manual, weekly_summary), body, published_at |
| `files` | project_id, uploaded_by, path, name, size, scan_status |
| `messages_portal` | project_id, sender_id, body, read_at |
| `questionnaires` | client_id, template, answers (JSON), completed_at |
| `posts` | slug, title, description, body, status (draft, approved, published), published_at |
| `case_studies` | slug, client_id (nullable), segment, market, body, status, consent_at |
| `reviews` | client_id, rating, text, consent_to_publish_at |
| `settings` | key, value (JSON) |
| `audit_log` | user_id, action, target, before, after |
| `data_requests` | email, type (access, deletion), status, completed_at |

Row-level security on every table. Public (anonymous) access is limited to inserting leads and chat messages through server routes, and reading published posts, published case studies, and public events.

---

## 21. Architecture

### 21.1 Stack
| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript, React Server Components |
| Styling | Tailwind CSS, design tokens from section 2 |
| Database, auth, storage, realtime | Supabase (Postgres) |
| Background workflows | Inngest (durable steps, retries, scheduling) |
| AI | Claude API |
| Email | Resend, with React Email templates |
| Booking | Cal.com (embed and webhooks) |
| Payments | Provider interface; providers per **[DECISION]** D1 |
| Spam protection | Cloudflare Turnstile |
| Rate limiting | Upstash Redis or equivalent |
| Error monitoring | Sentry |
| Analytics | Privacy-friendly analytics (Plausible or PostHog), loaded only after consent where required |
| Hosting | Vercel |

Read the current documentation for each service before integrating. If a listed service cannot be used, propose a replacement and wait for approval.

### 21.2 AI usage
| Task | Model tier | Output |
|---|---|---|
| Chat assistant | Fast, mid-tier model | Streamed text |
| Spam check and lead scoring | Fast, mid-tier model | Structured, schema-validated |
| Proposal generation | Most capable model | Structured sections, schema-validated |
| Email personalization | Fast, mid-tier model | Short text inserted in templates |
| Weekly summaries, blog and case study drafts | Most capable model | Structured |

- Model IDs are set in configuration, not scattered in code. Use the latest Claude models available at build time.
- All AI calls happen on the server. The API key is never sent to the browser.
- Every AI call logs model, token counts, latency, and outcome.
- Set a monthly spend alert and per-feature daily caps. When a cap is hit, the feature degrades as specified (chat shows the handoff form; scoring falls back per 10.4).
- Use prompt caching for the stable parts of prompts (service catalog, knowledge file).

### 21.3 Environment variables
Listed in `.env.example` with a comment for each. No secret is ever committed. At minimum: Supabase URL and keys, AI API key, Resend key, Cal.com key and webhook secret, payment keys and webhook secrets per provider, Turnstile keys, rate limiter credentials, Sentry DSN, Inngest keys, site URL, team notification email.

### 21.4 Repository layout
```
app/            Routes: (marketing), proposal, portal, admin, api
components/     Design system and feature components
lib/            ai/, email/, payments/, booking/, scoring/, proposals/, db/
workflows/      Background job definitions, one file per pipeline stage
config/         Service catalog, pricing rules defaults, project templates, chat knowledge
emails/         Email templates
supabase/       Migrations and security policies
tests/          Unit, integration, end-to-end
PLAN.md         Phase checklist, kept current
RUNBOOK.md      Operations guide, written in the final phase
```

---

## 22. AI guardrails (apply to every AI feature)

1. **Grounded only.** Output may use only the data passed in: intake answers, configuration, approved content. No invented facts, figures, clients, or testimonials.
2. **Prices from configuration.** The application inserts prices; the AI never writes a number that is a price or a date that is a commitment.
3. **No professional advice.** No accounting, tax, legal, or compliance advice.
4. **No guarantees.** No promised results, savings, or deadlines beyond the catalog's stated timelines.
5. **Structured and validated.** Every AI output that feeds a later step is validated against a schema. Invalid output is retried, then held.
6. **Untrusted input.** Everything a visitor types is treated as data, not instructions. Prompts keep visitor text clearly separated from instructions.
7. **Disclosure.** The chat says it is an AI. Emails are sent from LCS and do not pretend to be hand-typed by a named person.
8. **Review path.** Any AI output can be held for review by a setting, and every one is stored for audit.

---

## 23. Security and privacy

### 23.1 Security
- Row-level security on all tables; the service-role key is used only in server code and background jobs.
- Server-side validation of every input with a schema library. Output encoding everywhere; no raw HTML from user or AI content.
- Rate limiting on all public write endpoints and on login.
- Webhooks verify signatures and reject replays.
- Security headers: Content Security Policy, HSTS, frame restrictions, strict referrer policy.
- Proposal and booking tokens are random, at least 128 bits, single-purpose, and expire.
- File uploads: type and size checks, virus scan, stored privately, served by short-lived signed URLs.
- Two-factor authentication for admin users. Admin routes checked on the server, not only hidden in the interface.
- Dependencies scanned in continuous integration. No secrets in logs.
- Daily database backups with a tested restore.

### 23.2 Privacy
- Cookie consent banner; non-essential scripts load only after consent.
- Privacy policy covers both markets: what is collected, why, who processes it (list the service providers), retention, and rights.
- `/data-request` handles access and deletion requests; verified by email; completed within 30 days; logged.
- Retention: leads marked `lost` or `spam` are deleted or anonymized after 24 months; chat transcripts not linked to a lead after 90 days.
- Marketing emails only with recorded consent. Unsubscribe works in one click and is honored at once.
- Events exposed in the public feed contain no personal data by construction (a separate field set, not a filtered copy).

---

## 24. Quality requirements

| Area | Requirement |
|---|---|
| Performance | Largest Contentful Paint under 2.5 s on a mid-range phone on 4G; marketing pages statically generated; images optimized and lazy-loaded; chat and diagram code loaded on demand |
| Accessibility | WCAG 2.1 AA; full keyboard operation; visible focus; labelled forms; reduced-motion support; tested with a screen reader |
| Responsive | Works from 320 px wide upward; tested at 375, 768, 1280, 1920 |
| Browsers | Latest two versions of Chrome, Safari, Firefox, Edge; iOS Safari and Android Chrome |
| SEO | Unique title and description per page; structured data for organization, services, articles, and frequently asked questions; sitemap; robots file; canonical URLs; private routes excluded |
| Reliability | Lead capture must work even if AI, email, or booking services are down: the lead is saved first, everything else is a background job |
| Observability | Errors to Sentry; every workflow run logged; uptime check on the home page and the lead endpoint |

---

## 25. Testing

- **Unit:** scoring thresholds and tier mapping, pricing selection, proposal checks, time zone and send-window logic, duplicate matching, idempotency.
- **Integration:** each workflow stage with external services mocked; webhook handlers including duplicates and bad signatures; row-level security (a client cannot read another client's data; anonymous users cannot read leads).
- **End-to-end (Playwright):** the full journey for each segment in each market: submit form → confirmation email → proposal page → book → accept → pay (test mode) → portal login → weekly summary. Plus: chat intake path, cold lead nurture path, failed payment path, admin override path.
- **AI evaluation set:** at least 30 sample leads with expected tiers; scoring must match on 90% or more. At least 15 sample proposals pass all checks in 11.4. A set of adversarial chat inputs (attempts to extract instructions, get prices, get tax advice) all handled correctly.
- **Email:** render tests for every template in both markets; check links and unsubscribe.
- Continuous integration runs type checks, lint, unit, and integration tests on every change; end-to-end on the main branch.

---

## 26. Build phases

Work one phase at a time. At the end of each: run tests, run the app in a browser and check it, show what was built, and wait for approval. Before each phase, list the accounts and keys needed.

| Phase | Scope | Sections | Done when |
|---|---|---|---|
| 1. Foundation | Repository, stack, database schema and security policies, design system, layout, header, footer, market detection and switcher, preview deployment | 2, 3.3, 20, 21 | Preview URL loads; design system page complete; security policy tests pass; Lighthouse 90+ |
| 2. Marketing site | All public pages with drafted copy, pipeline diagram (static data), services diagram, legal page drafts, SEO | 5, 6 | Every page complete in both markets on mobile and desktop; sitemap and structured data valid |
| 3. Capture and qualification | Intake form, spam protection, lead storage, workflow engine, scoring, emails T1 and T2, chat assistant, status tracker | 7, 8, 9, 10, 13 | A test submission yields a scored lead, both emails, and events in under 60 s; chat intake creates the same lead; evaluation set passes |
| 4. Proposal and booking | Pricing configuration, proposal generation and checks, proposal page, booking, call brief, sequences P, B, N | 11, 12, 13 | A test lead goes from form to booked call with no manual step; every reminder fires on schedule in an accelerated test; sequences stop on action |
| 5. Closing and onboarding | Agreement, e-signature, payment interface and providers, receipts, client and project creation, questionnaire, sequences C and W | 14, 15 | A test-mode payment yields a signed agreement, receipt, client account, and project with no manual step |
| 6. Client portal | All portal screens, messages, files, billing, weekly summary | 16 | A test client sees only their own data and receives an accurate weekly summary |
| 7. Admin dashboard | All admin screens, overrides, settings, audit log, two-factor authentication | 17 | Any lead or run can be inspected and acted on from the dashboard; every action is audited |
| 8. Live proof | Public events, activity feed, counters with thresholds, live pipeline diagram, "Try it" demo | 18 | Feed and counters reflect real database events; demo runs end to end without creating a lead |
| 9. Content and growth | Blog pipeline, case study drafts, review requests, analytics and conversion tracking | 19 | One post goes generate → approve → publish; stage conversion visible in metrics |
| 10. Hardening and launch | Security review, full end-to-end suite, monitoring, backups and restore test, performance and accessibility pass, domain, email authentication, `RUNBOOK.md` | 23, 24, 25 | The full journey passes on the production domain in both markets; restore tested; runbook complete |

---

## 27. Open decisions

| ID | Decision | Why it matters | Default if not answered |
|---|---|---|---|
| D1 | Where the business is registered and which payment providers to use | Determines which providers LCS can open accounts with; Philippine clients expect GCash, Maya, and bank transfer | Build the interface; integrate nothing until confirmed |
| D2 | Pricing mode per market (fixed packages, range, or call only) and the actual figures | Controls what proposals can say and whether online acceptance is possible | `call_only` in both markets |
| D3 | Domain name and sending email address | Needed for deployment and email authentication | Preview URL only |
| D4 | Whether LCS also performs bookkeeping or accounting work for clients, or only builds the systems | Changes service copy and what may be claimed | Systems only, as written |
| D5 | Service agreement text | Clients sign it; needs legal review | Placeholder template, flagged, not usable in production |
| D6 | Proposal review mode at launch | Trade-off between speed and oversight | `hold` for the first 20, then decide |
| D7 | Team names, photos, and business address for the About page and email footers | Email footers legally need a postal address | Company name only; address required before launch |
| D8 | Team working hours for calls | Sets booking availability | Monday–Friday, 9:00–18:00 Philippine time, plus 20:00–23:00 for US calls |
| D9 | Existing approved case studies, testimonials, and client logos | Only real, consented material may be shown | None; the site itself is the first case study |
| D10 | Starting keyword list and any topics to avoid for the blog | Seeds the content pipeline | Derived from services and segments |
