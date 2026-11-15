import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Checkbox, RadioCards, SelectField, TextField, TextareaField } from "@/components/ui/field";
import { EmptyState, PipelineNode, Skeleton, SkeletonCard, Timeline } from "@/components/ui/progress";
import { StatCounter } from "@/components/ui/stat-counter";
import { Table } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { LoadingButtonDemo, ModalDemo, StepperDemo, ToastDemo } from "./demos";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const COLORS: { token: string; hex: string; use: string }[] = [
  { token: "navy-900", hex: "#0B1F5C", use: "Headings, nav, footer, primary buttons" },
  { token: "blue-500", hex: "#0A84FF", use: "Focus rings, active stages, icons. Not for small text (3.65:1)" },
  { token: "blue-700", hex: "#0B4FC4", use: "Links, hover, gradient midpoint" },
  { token: "ink", hex: "#0F172A", use: "Body text" },
  { token: "muted", hex: "#475569", use: "Secondary text (AA on white and surface-alt)" },
  { token: "slate-500", hex: "#64748B", use: "Placeholders, borders, non-text" },
  { token: "surface", hex: "#FFFFFF", use: "Page background" },
  { token: "surface-alt", hex: "#F4F7FB", use: "Alternating sections, cards" },
  { token: "success", hex: "#16A34A", use: "Completed (icons); text uses success-700" },
  { token: "warning", hex: "#D97706", use: "Waiting (icons); text uses warning-700" },
  { token: "danger", hex: "#DC2626", use: "Errors, failed runs" },
];

type Run = { id: string; workflow: string; status: "done" | "running" | "waiting" | "failed"; duration: string; attempts: number };
const RUNS: Run[] = [
  { id: "r1", workflow: "lead.qualify", status: "done", duration: "41 s", attempts: 1 },
  { id: "r2", workflow: "proposal.generate", status: "running", duration: "—", attempts: 1 },
  { id: "r3", workflow: "email.proposal-reminder-1", status: "waiting", duration: "—", attempts: 0 },
  { id: "r4", workflow: "booking.confirm", status: "failed", duration: "2 s", attempts: 5 },
];

function Section({ id, title, children, note }: { id: string; title: string; children: ReactNode; note?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line py-12">
      <h2 id={`${id}-h`} className="text-2xl">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-3xl text-sm text-muted">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const TOC = [
  ["colors", "Color"],
  ["type", "Typography"],
  ["shape", "Shape"],
  ["buttons", "Buttons"],
  ["forms", "Form fields"],
  ["cards", "Cards"],
  ["badges", "Badges and status pills"],
  ["tables", "Tables"],
  ["tabs", "Tabs"],
  ["modal", "Modal"],
  ["toast", "Toast"],
  ["stepper", "Stepper"],
  ["pipeline", "Pipeline node"],
  ["stats", "Stat counter"],
  ["timeline", "Timeline"],
  ["empty", "Empty state"],
  ["skeleton", "Skeleton loader"],
] as const;

export default function DesignSystemPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <Badge tone="warning">Internal · not indexed</Badge>
      </header>
      <h1 className="mt-10 text-4xl">Design system</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Component reference for the Loyal Creative Systems site, portal and admin. Every component here is the one used
        in production.
      </p>
      <nav aria-label="Components" className="mt-8">
        <ul className="flex flex-wrap gap-2 text-sm">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block rounded-md bg-surface-alt px-3 py-1.5 no-underline hover:bg-info-50">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mt-10">
        <Section
          id="colors"
          title="Color"
          note="Approximate values from SPEC 2.2, to be re-sampled from the logo file. Contrast ratios checked against WCAG AA; see notes for tokens with limits."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <li key={c.token} className="overflow-hidden rounded-card border border-line">
                <div className="flex h-20 items-end p-3" style={{ background: c.hex }}>
                  <span className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-ink">{c.hex}</span>
                </div>
                <div className="p-3">
                  <p className="font-heading text-sm font-semibold">{c.token}</p>
                  <p className="text-sm text-muted">{c.use}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="brand-gradient mt-6 rounded-card p-6 text-white">
            Brand gradient — hero accents and the pipeline diagram only.
          </div>
        </Section>

        <Section id="type" title="Typography" note="Montserrat 600/700 for headings, Inter 400/500 for body. Self-hosted. Base 16px, line height 1.6.">
          <div className="space-y-4">
            <p className="eyebrow">Section label · uppercase, wide tracking</p>
            <p className="font-heading text-5xl font-bold text-navy-900">Heading 1</p>
            <p className="font-heading text-3xl font-bold text-navy-900">Heading 2</p>
            <p className="font-heading text-xl font-semibold text-navy-900">Heading 3</p>
            <p className="max-w-2xl">
              Body text. Your invoice is created the moment the job is marked done, and the payment is matched to it when
              it arrives. Nobody re-types anything.
            </p>
            <p className="text-sm text-muted">Secondary text, used for hints and metadata.</p>
            <p>
              <a href="#type">An inline link</a> uses blue-700.
            </p>
          </div>
        </Section>

        <Section id="shape" title="Shape" note="The angled cut from the “S” is the recurring shape: card corners, button accents, section dividers.">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="cut-corners bg-navy-900 p-6 text-white">Cut corners</div>
            <div className="cut-corner-tr bg-blue-700 p-6 text-white">Top-right cut</div>
            <div className="divider-angle brand-gradient h-24 p-6 text-white">Angled divider</div>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading loadingLabel="Sending…">
              Loading
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled secondary
            </Button>
            <LoadingButtonDemo />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <ButtonLink href="#buttons" variant="secondary">
              Link styled as button
            </ButtonLink>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 rounded-card bg-navy-900 p-6">
            <Button variant="inverse">Inverse on navy</Button>
          </div>
        </Section>

        <Section id="forms" title="Form fields" note="Every field has a visible label. Errors are linked with aria-describedby and marked aria-invalid.">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField label="Full name" name="ds-name" required autoComplete="name" />
            <TextField label="Phone" name="ds-phone" type="tel" hint="Format: +63 917 123 4567" />
            <TextField label="Work email" name="ds-email" type="email" required defaultValue="maria@" error="Enter a full email address, like name@company.com." />
            <TextField label="Business name" name="ds-biz" required defaultValue="Bayanihan Credit Cooperative" success="Looks good." />
            <SelectField
              label="Team size"
              name="ds-size"
              required
              placeholder="Choose one"
              options={["1–5", "6–20", "21–50", "51–200", "200+"].map((v) => ({ value: v, label: v }))}
            />
            <TextField label="Disabled field" name="ds-disabled" disabled defaultValue="Read only" />
            <TextareaField
              className="md:col-span-2"
              label="Biggest problem right now"
              name="ds-problem"
              required
              hint="At least 20 characters. Describe the manual work in your own words."
            />
            <RadioCards
              className="md:col-span-2"
              legend="Business type"
              name="ds-type"
              required
              defaultValue="cooperative"
              options={[
                { value: "cooperative", label: "Cooperative", description: "Credit, multi-purpose, or service" },
                { value: "agency", label: "Agency", description: "Marketing, creative, staffing, VA" },
                { value: "local", label: "Local service business", description: "Clinics, trades, salons, logistics" },
                { value: "other", label: "Other" },
              ]}
            />
            <RadioCards
              className="md:col-span-2"
              legend="Systems of interest"
              name="ds-systems"
              multiple
              error="Choose at least one, or “Not sure”."
              options={[
                { value: "crm", label: "CRM" },
                { value: "operations", label: "Operations" },
                { value: "accounting", label: "Accounting" },
                { value: "bookkeeping", label: "Bookkeeping" },
              ]}
            />
            <Checkbox
              className="md:col-span-2"
              name="ds-consent"
              label={
                <>
                  I agree to Loyal Creative Systems processing my details to respond to this inquiry, as described in the{" "}
                  <a href="#forms">privacy policy</a>.
                </>
              }
            />
            <Checkbox className="md:col-span-2" name="ds-consent-err" label="I agree to the terms." error="Please confirm to continue." />
          </div>
        </Section>

        <Section id="cards" title="Cards">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardTitle>Default card</CardTitle>
              <CardBody>White surface with a hairline border.</CardBody>
            </Card>
            <Card shape="cut" tone="alt" interactive>
              <CardTitle>Cut-corner card</CardTitle>
              <CardBody>Uses the angled corners from the logo.</CardBody>
            </Card>
            <Card tone="navy">
              <CardTitle>Navy card</CardTitle>
              <CardBody className="text-slate-300">
                For emphasis. <a href="#cards">Links</a> use blue-300.
              </CardBody>
            </Card>
          </div>
        </Section>

        <Section id="badges" title="Badges and status pills" note="Status is always conveyed by text and icon, never colour alone.">
          <div className="flex flex-wrap gap-3">
            <Badge>Neutral</Badge>
            <Badge tone="info">Warm</Badge>
            <Badge tone="navy">Hot</Badge>
            <Badge tone="success">Won</Badge>
            <Badge tone="warning">Held</Badge>
            <Badge tone="danger">Spam</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <StatusPill status="done" />
            <StatusPill status="running" />
            <StatusPill status="waiting" />
            <StatusPill status="failed" />
            <StatusPill status="idle" />
          </div>
        </Section>

        <Section id="tables" title="Tables" note="Scrolls inside its own region on narrow screens; the page never scrolls sideways.">
          <Table<Run>
            caption="Recent automation runs"
            rowKey={(r) => r.id}
            rows={RUNS}
            columns={[
              { key: "wf", header: "Workflow", cell: (r) => <code className="text-sm">{r.workflow}</code> },
              { key: "status", header: "Status", cell: (r) => <StatusPill status={r.status} /> },
              { key: "dur", header: "Duration", cell: (r) => r.duration, align: "right" },
              { key: "att", header: "Attempts", cell: (r) => r.attempts, align: "right" },
            ]}
          />
        </Section>

        <Section id="tabs" title="Tabs" note="Arrow keys move between tabs; Home and End jump to the ends.">
          <Tabs
            label="Segment examples"
            tabs={[
              { id: "coop", label: "Cooperatives", content: <p>A member’s loan payment posts to their ledger and the collection report updates.</p> },
              { id: "agency", label: "Agencies", content: <p>A signed retainer creates the client, the project, and the first invoice.</p> },
              { id: "local", label: "Local service", content: <p>A completed job creates and sends the invoice before the crew leaves.</p> },
            ]}
          />
        </Section>

        <Section id="modal" title="Modal" note="Native dialog: focus is trapped, Escape closes, focus returns to the button.">
          <ModalDemo />
        </Section>

        <Section id="toast" title="Toast" note="Announced via live regions: polite for success and info, assertive for errors.">
          <ToastDemo />
        </Section>

        <Section id="stepper" title="Stepper">
          <StepperDemo />
        </Section>

        <Section id="pipeline" title="Pipeline node" note="Each stage is a button with a descriptive label. The active state uses the brand gradient.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PipelineNode index={1} label="Lead in" state="done" description="Under 2 s" />
            <PipelineNode index={2} label="AI qualifies" state="active" description="Scoring now" />
            <PipelineNode index={3} label="Proposal sent" state="idle" description="Up next" />
            <PipelineNode index={4} label="Call booked" state="failed" description="Run failed" />
          </div>
        </Section>

        <Section id="stats" title="Stat counter" note="Counts up once in view; static under reduced motion. Every counter states its method.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCounter value={47} suffix=" s" label="Median response time" method="Median time between the lead-saved event and the T1 email-sent event, over the last 30 days." />
            <StatCounter value={1284} label="Workflows run" method="Count of automation runs with status succeeded." />
            <StatCounter value={0} label="Manual steps in our pipeline" method="Count of manual overrides logged in the audit log." />
            <StatCounter value={312} label="Hours of manual work saved" method="Workflows run × configured minutes per workflow type, ÷ 60." />
          </div>
          <p className="mt-3 text-sm text-muted">Sample values for the reference page only.</p>
        </Section>

        <Section id="timeline" title="Timeline">
          <Timeline
            items={[
              { id: "t1", title: "Inquiry received", time: "Nov 3, 09:12", dateTime: "2026-11-03T09:12", status: "done" },
              { id: "t2", title: "Plan sent", time: "Nov 3, 09:15", dateTime: "2026-11-03T09:15", status: "done", body: "Opened twice." },
              { id: "t3", title: "Call booked", time: "Nov 5, 14:00", dateTime: "2026-11-05T14:00", status: "current" },
              { id: "t4", title: "Agreement and payment", time: "Pending", dateTime: "2026-11-05", status: "upcoming" },
            ]}
          />
        </Section>

        <Section id="empty" title="Empty state">
          <EmptyState
            title="No failed runs"
            body="When an automation fails after all retries, it shows up here with a retry button."
            action={<Button variant="secondary">View all runs</Button>}
          />
        </Section>

        <Section id="skeleton" title="Skeleton loader">
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard />
            <div className="space-y-3" role="status" aria-label="Loading">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
