import type { SegmentId } from "./types";

/**
 * Scripted sample runs for /demo until the live sandbox demo (SPEC 18.3, phase 8).
 * Every business here is fictional and every figure is a labelled sample, not a result.
 */
export type DemoRun = {
  segment: SegmentId;
  label: string;
  business: string;
  type: string;
  problem: string;
  score: number;
  tier: "Hot" | "Warm" | "Cold";
  breakdown: { factor: string; points: number; max: number; why: string }[];
  summary: string;
  systems: string[];
  automations: string[];
  emails: { id: string; subject: string; when: string }[];
  milestones: string[];
};

export const DEMO_RUNS: DemoRun[] = [
  {
    segment: "cooperative",
    label: "Cooperative",
    business: "Sample Multi-Purpose Cooperative",
    type: "Multi-purpose cooperative, 1,200 members, offers loans",
    problem: "Loan payments are tracked in a ledger and spreadsheets. Reminders are sent by hand and board reports take a week.",
    score: 82,
    tier: "Hot",
    breakdown: [
      { factor: "Fit", points: 28, max: 30, why: "Cooperative with loan tracking: a core segment and service." },
      { factor: "Need clarity", points: 18, max: 20, why: "Describes specific manual work: ledgers, hand reminders, report prep." },
      { factor: "Budget", points: 14, max: 20, why: "Budget range meets the minimum engagement." },
      { factor: "Urgency", points: 12, max: 15, why: "Wants it running within 1–3 months." },
      { factor: "Authority", points: 7, max: 10, why: "Shares the decision with the board." },
      { factor: "Scale", points: 3, max: 5, why: "1,200 members means meaningful time saved." },
    ],
    summary: "A multi-purpose cooperative tracking loans and collections by hand, with slow board reporting. Strong fit for loans and collections, member records, and automated reports.",
    systems: ["Accounting: loans and collections", "CRM: member database", "Bookkeeping: month-end summaries"],
    automations: [
      "Payment schedule created at loan release",
      "Reminder to each member before every due date",
      "Collections recorded once, balances updated everywhere",
      "Arrears list sent to the collections officer every Monday",
      "Board report generated from live records",
    ],
    emails: [
      { id: "T1", subject: "We read your note about loan tracking", when: "At once" },
      { id: "T3", subject: "Your system plan for Sample Multi-Purpose Cooperative", when: "Within 5 minutes" },
      { id: "P1", subject: "Your plan is waiting", when: "+2 days if unopened" },
    ],
    milestones: ["Onboarding questionnaire", "Member data migration", "Loans and collections live", "Board reports live"],
  },
  {
    segment: "agency",
    label: "Agency",
    business: "Sample Creative Agency",
    type: "Marketing agency, 14 people, 22 active clients, retainers",
    problem: "Onboarding new clients takes a week of emails and we only find out which retainers lose money at year-end.",
    score: 72,
    tier: "Hot",
    breakdown: [
      { factor: "Fit", points: 27, max: 30, why: "Agency with onboarding and profitability pains." },
      { factor: "Need clarity", points: 16, max: 20, why: "Names the onboarding delay and the profitability blind spot." },
      { factor: "Budget", points: 10, max: 20, why: "Budget is “Not sure yet”, scored neutral (half marks), not low." },
      { factor: "Urgency", points: 9, max: 15, why: "Wants it within 3–6 months." },
      { factor: "Authority", points: 10, max: 10, why: "Is the decision maker." },
      { factor: "Scale", points: 0, max: 5, why: "Smaller team; less volume to automate." },
    ],
    summary: "A 14-person marketing agency losing time on manual onboarding, with no view of profit per client. Fit for onboarding, time capture, and per-client profitability.",
    systems: ["Operations: onboarding and projects", "Accounting: retainer billing", "Bookkeeping: cost per client"],
    automations: [
      "Signed proposal triggers the onboarding checklist",
      "Kickoff meeting booked automatically",
      "Time captured against client tasks",
      "Retainer invoices sent on the first of the month",
      "Profit-per-client view updated weekly",
    ],
    emails: [
      { id: "T1", subject: "Onboarding in a day, not a week", when: "At once" },
      { id: "T3", subject: "Your system plan for Sample Creative Agency", when: "Within 5 minutes" },
      { id: "B1", subject: "Your call is confirmed", when: "When you book" },
    ],
    milestones: ["Onboarding questionnaire", "Client onboarding flow live", "Time capture and billing live", "Profitability reporting live"],
  },
  {
    segment: "local_service",
    label: "Local service",
    business: "Sample Aircon and Repair Services",
    type: "Repair and cleaning service, 3 technicians, about 150 jobs a month",
    problem: "We miss inquiries at night, double-book technicians, and invoices go out days after the job.",
    score: 69,
    tier: "Warm",
    breakdown: [
      { factor: "Fit", points: 28, max: 30, why: "Local service business; booking and invoicing are core services." },
      { factor: "Need clarity", points: 17, max: 20, why: "Three concrete problems: missed inquiries, double bookings, late invoices." },
      { factor: "Budget", points: 8, max: 20, why: "Budget is below the minimum engagement." },
      { factor: "Urgency", points: 13, max: 15, why: "Wants it as soon as possible." },
      { factor: "Authority", points: 0, max: 10, why: "Not the decision maker." },
      { factor: "Scale", points: 3, max: 5, why: "150 jobs a month." },
    ],
    summary: "A repair and cleaning service missing after-hours inquiries and invoicing late. Fit for booking, dispatch, and invoicing on job completion.",
    systems: ["CRM: inquiries answered at once", "Operations: booking and dispatch", "Accounting: invoice on completion"],
    automations: [
      "After-hours inquiries answered with prices and open slots",
      "Bookings assigned without conflicts",
      "Arrival window sent to the customer",
      "Invoice sent when the job is marked done",
      "Reminder when the next service is due",
    ],
    emails: [
      { id: "T1", subject: "No more missed 10 pm inquiries", when: "At once" },
      { id: "T3", subject: "Your system plan for Sample Aircon and Repair Services", when: "Within 5 minutes" },
      { id: "P2", subject: "Questions about your plan?", when: "+2 days after opening" },
    ],
    milestones: ["Onboarding questionnaire", "Booking and dispatch live", "Invoicing live", "Repeat-customer reminders live"],
  },
];
