import type { MarketText, SegmentId, ServiceId } from "./types";

/**
 * The LCS lead-to-client pipeline (SPEC 6.2, 6.6, 7.1).
 * Target times come from SPEC 7.1. Real averages replace them once the pipeline is live
 * (phase 8); until then the site says so instead of inventing a number.
 */

export type PipelineStage = {
  id: "lead_in" | "qualified" | "proposal_sent" | "call_booked" | "agreement_payment" | "onboarding" | "reporting";
  index: number;
  name: string;
  short: string;
  trigger: string;
  whatHappens: string;
  target: string;
  clientReceives: string;
  /** How It Works page: what the visitor experiences vs. what the system does. */
  visitor: string;
  behindTheScenes: string[];
};

export const PIPELINE: PipelineStage[] = [
  {
    id: "lead_in",
    index: 1,
    name: "Lead in",
    short: "Your details are saved",
    trigger: "You send the intake form or finish a chat.",
    whatHappens: "Your answers are checked, saved, and logged before anything else happens.",
    target: "Under 2 seconds",
    clientReceives: "An on-screen confirmation with a live tracker.",
    visitor: "You answer a few questions about your business, about five minutes in all. When you submit, a tracker shows your request moving through the next steps.",
    behindTheScenes: [
      "Answers are validated and checked for spam.",
      "If you have written to us before, the new request is attached to your existing record.",
      "Your request is saved first, so it is never lost even if another service is slow.",
    ],
  },
  {
    id: "qualified",
    index: 2,
    name: "AI qualifies",
    short: "We read your needs",
    trigger: "Your request is saved.",
    whatHappens: "Your answers are scored against a published rubric and summarized for our team.",
    target: "Under 60 seconds",
    clientReceives: "A personal reply that responds to what you wrote.",
    visitor: "Within a minute you receive an email that reflects what you told us, not a generic “thanks for reaching out”.",
    behindTheScenes: [
      "Fit, need, budget, timing, decision role, and scale are scored. The score uses your answers only, never your name.",
      "Our team is notified with a short summary.",
      "If anything fails, your request is flagged for a person to check and you still get your reply.",
    ],
  },
  {
    id: "proposal_sent",
    index: 3,
    name: "Proposal sent",
    short: "Your system plan arrives",
    trigger: "Your needs match what we build.",
    whatHappens: "A tailored system plan is written, checked, and published on a private page.",
    target: "Under 5 minutes",
    clientReceives: "A link to your private system plan.",
    visitor: "You receive a link to a private page titled with your business name: your situation, the system we recommend, what gets automated, how we work, and the next step.",
    behindTheScenes: [
      "The plan is generated from your answers and our service catalog.",
      "Prices come only from our pricing settings, never written by AI.",
      "Every plan is checked for accuracy and for claims we do not make before it is sent.",
    ],
  },
  {
    id: "call_booked",
    index: 4,
    name: "Call booked",
    short: "You pick a time",
    trigger: "You book a slot from your plan.",
    whatHappens: "The call is confirmed, reminders are scheduled, and our team gets a briefing.",
    target: "Instant",
    clientReceives: "A calendar invite with a video link.",
    visitor: "You choose a 30-minute slot shown in your own time zone. A confirmation and calendar invite arrive at once, with reminders the day before and an hour before.",
    behindTheScenes: [
      "Proposal reminders stop the moment you book.",
      "Our team receives a call brief: your summary, your plan, and questions worth asking.",
      "Rescheduling or cancelling updates everything automatically.",
    ],
  },
  {
    id: "agreement_payment",
    index: 5,
    name: "Agreement and payment",
    short: "You sign and pay online",
    trigger: "You accept your plan.",
    whatHappens: "You sign the agreement online and pay the deposit through a secure checkout.",
    target: "Instant",
    clientReceives: "A signed agreement and a receipt.",
    visitor: "One page shows what you are buying, the agreement, a place to sign, and secure payment.",
    behindTheScenes: [
      "Your signature is recorded with a timestamp and stored as a signed PDF.",
      "Card details go straight to the payment provider and never touch our servers.",
      "Payment is confirmed by the provider, not by a person refreshing a screen.",
    ],
  },
  {
    id: "onboarding",
    index: 6,
    name: "Onboarding",
    short: "Your project starts",
    trigger: "Your payment is confirmed.",
    whatHappens: "Your client account and project are created, and onboarding begins.",
    target: "Under 2 minutes",
    clientReceives: "A welcome email, portal access, and a short questionnaire.",
    visitor: "You get a welcome email with your receipt, a link to your client portal, and a questionnaire about your current tools and people.",
    behindTheScenes: [
      "Your project is created from a template for the systems you chose, with phases and milestones.",
      "Finishing the questionnaire completes the first milestone and lets you book the kickoff.",
    ],
  },
  {
    id: "reporting",
    index: 7,
    name: "Reporting",
    short: "You always know where things stand",
    trigger: "Every Monday, and whenever a milestone is reached.",
    whatHappens: "A progress summary is written from your project’s actual data and sent to you.",
    target: "Every week",
    clientReceives: "A weekly summary and live status in your portal.",
    visitor: "Every Monday you receive a plain summary: what was done, what is next, and anything we are waiting on from you.",
    behindTheScenes: [
      "Every fact in the summary comes from your project records.",
      "If nothing changed that week, the summary says so plainly.",
    ],
  },
];

/**
 * Services overview diagram (SPEC 6.3): one record travelling through all four systems,
 * per segment.
 */
export type FlowStep = { system: ServiceId; text: MarketText };

export const SYSTEM_FLOW: Record<SegmentId, { record: string; steps: FlowStep[] }> = {
  cooperative: {
    record: "A loan application",
    steps: [
      { system: "crm", text: "Maria, a member, applies for a loan. Her profile, share capital, and history are already on file." },
      { system: "operations", text: "The application routes to the credit committee. When approved, the release is scheduled." },
      { system: "accounting", text: "The payment schedule is created, and Maria is reminded before each due date." },
      { system: "bookkeeping", text: "Each payment posts to her ledger and the month-end summary. Nobody re-types it." },
    ],
  },
  agency: {
    record: "A new retainer client",
    steps: [
      { system: "crm", text: "A prospect accepts your proposal. The deal is marked won with the agreed scope and fee." },
      { system: "operations", text: "The project, month-one tasks, and kickoff meeting are created and assigned." },
      { system: "accounting", text: "The first retainer invoice goes out with a pay-now link." },
      { system: "bookkeeping", text: "Payment and project costs post to the books, tagged to that client." },
    ],
  },
  local_service: {
    record: "A repair job",
    steps: [
      { system: "crm", text: "A customer requests a repair at 9 pm and gets prices and open slots at once." },
      { system: "operations", text: "The booking is assigned to a technician and added to tomorrow’s route." },
      { system: "accounting", text: "The technician marks the job done. The invoice is sent before they leave." },
      {
        system: "bookkeeping",
        text: { ph: "The GCash payment is matched to the invoice, and the parts receipt is filed against the job.", us: "The card payment is matched to the invoice, and the parts receipt is filed against the job." },
      },
    ],
  },
};

/** Server-side: resolve the services diagram data for one market. */
export function diagramSegments(
  market: "ph" | "us",
  order: SegmentId[],
  labels: Record<SegmentId, string>,
  systemNames: Record<ServiceId, string>,
) {
  return order.map((id) => ({
    id,
    label: labels[id],
    record: SYSTEM_FLOW[id].record,
    steps: SYSTEM_FLOW[id].steps.map((st) => ({
      system: systemNames[st.system],
      text: typeof st.text === "string" ? st.text : st.text[market],
    })),
  }));
}
