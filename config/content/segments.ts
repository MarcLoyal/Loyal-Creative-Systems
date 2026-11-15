import type { Faq, MarketText, SegmentId, ServiceId } from "./types";

/** Segment landing pages (SPEC 3.1, 6.5). Cooperative examples are Philippine in both markets (SPEC 3.2). */

export type Segment = {
  id: SegmentId;
  slug: string;
  name: string;
  /** Short label used in cards and the services diagram selector. */
  label: string;
  headline: string;
  intro: MarketText;
  metaDescription: string;
  pains: { title: string; body: MarketText }[];
  before: string[];
  after: string[];
  systems: ServiceId[];
  /** Why each of those systems matters to this segment. */
  systemNotes: Partial<Record<ServiceId, string>>;
  faqs: Faq[];
};

export const SEGMENTS: Segment[] = [
  {
    id: "cooperative",
    slug: "cooperatives",
    name: "Cooperatives",
    label: "Cooperative",
    headline: "Systems for cooperatives that keep every member, loan, and peso in order",
    intro:
      "Credit, multi-purpose, and service cooperatives run on trust and on records. We build the system that keeps member records, share capital, loans, and collections current, so board and general assembly reports come together without a week of spreadsheet work.",
    metaDescription:
      "Custom systems for credit, multi-purpose, and service cooperatives: member database, share capital and savings, loans and collections, patronage refunds, and board reports.",
    pains: [
      {
        title: "Member records in spreadsheets and folders",
        body: "Each officer keeps their own copy. Nobody is sure which one is current, and answering a member’s question means digging.",
      },
      {
        title: "Loans and collections tracked by hand",
        body: "Due dates live in a ledger. Reminders depend on someone remembering, and late payments are found at month-end.",
      },
      {
        title: "Report season takes over the office",
        body: "Board reports and general assembly reports are rebuilt from scratch every time, and figures are checked twice because nobody trusts them.",
      },
    ],
    before: [
      "A member asks for their share capital balance. An officer opens three files to find it.",
      "Loan due dates are checked in the ledger every morning; reminders go out when someone has time.",
      "Collections are recorded on paper, then typed into a spreadsheet at the end of the week.",
      "The treasurer spends the week before the board meeting building reports.",
      "Patronage refund and dividend figures are calculated by hand and checked twice.",
    ],
    after: [
      "The member’s balance is on screen in seconds, and the member can be sent a statement.",
      "Members are reminded before every due date automatically, with the amount and how to pay.",
      "Collections are recorded once, at the counter or in the field, and every balance updates.",
      "Board reports are generated from live records the day they are needed.",
      "Patronage refund and dividend calculations run from the rules your board sets.",
    ],
    systems: ["crm", "accounting", "bookkeeping", "operations"],
    systemNotes: {
      crm: "Member database: profiles, beneficiaries, share capital, savings, and every interaction.",
      accounting: "Loans and collections: schedules, reminders, payments, and arrears.",
      bookkeeping: "Records organized for your bookkeeper, ready for CDA reporting.",
      operations: "Loan application workflow from intake to committee approval to release.",
    },
    faqs: [
      {
        q: "Does the system file our CDA reports?",
        a: "No. It keeps your records organized and produces the figures and summaries your bookkeeper and officers need to prepare them. Filing and sign-off stay with your cooperative.",
      },
      {
        q: "Can members see their own balances?",
        a: "It can be built that way: members can receive statements by email or view their balances through a secure link.",
      },
      {
        q: "We have years of records on paper. Can you bring them in?",
        a: "Yes. Moving existing data in is part of the project. We agree with you which records are moved and how they are checked.",
      },
      {
        q: "How do you handle data privacy?",
        a: {
          ph: "The system is built with the Data Privacy Act of 2012 in mind: access by role, encrypted data, and a log of who viewed or changed what.",
          us: "The system is built with access by role, encrypted data, and a log of who viewed or changed what.",
        },
      },
    ],
  },
  {
    id: "agency",
    slug: "agencies",
    name: "Agencies",
    label: "Agency",
    headline: "Systems for agencies that onboard clients, track work, and bill every hour",
    intro:
      "Marketing, creative, staffing, and virtual assistant agencies lose money in the gaps: slow onboarding, scattered projects, untracked hours. We build the system that closes those gaps and shows you the profit on every client.",
    metaDescription:
      "Custom systems for marketing, creative, staffing, and VA agencies: client onboarding, project and retainer tracking, time capture and billing, and profit per client.",
    pains: [
      {
        title: "Onboarding a client takes a week of emails",
        body: "Contracts, access, briefs, and kickoff are chased by hand, and every new client starts a little differently.",
      },
      {
        title: "Projects live in five different places",
        body: "Tasks in one tool, files in another, client messages in a third. Nobody has the full picture.",
      },
      {
        title: "Billable time leaks, and margins are a guess",
        body: "Hours go unlogged, retainers are overserviced, and you find out which clients lose money months later.",
      },
    ],
    before: [
      "A new client signs. Someone emails the contract, the access request, and the brief form separately.",
      "The team asks in chat what is due this week.",
      "Time is logged on Friday from memory, if at all.",
      "Invoices are built from timesheets at month-end.",
      "Nobody knows which clients are profitable until the year-end review.",
    ],
    after: [
      "A signed proposal triggers onboarding: contract, access checklist, brief form, and kickoff booking.",
      "Every project has one board, and the team sees their week the moment they log in.",
      "Time is captured against tasks as people work.",
      "Retainer and hourly invoices go out on the first of the month by themselves.",
      "A profit-per-client view updates every week.",
    ],
    systems: ["crm", "operations", "accounting", "bookkeeping"],
    systemNotes: {
      crm: "Pipeline and client records, from first inquiry to signed retainer.",
      operations: "Onboarding flow, projects, tasks, and time capture.",
      accounting: "Retainer, project, and hourly billing with automatic reminders.",
      bookkeeping: "Costs tagged per client, so profitability is always visible.",
    },
    faqs: [
      {
        q: "We bill a mix of retainers, projects, and hourly work. Is that a problem?",
        a: "No. Each client can have its own billing model, and the system invoices each the right way.",
      },
      {
        q: "Can our clients see progress?",
        a: "Yes, through a client view showing status, deliverables, and what is waiting on them.",
      },
      {
        q: "Will my team have to learn a new tool?",
        a: "Some. We keep the screens simple and train your team as part of the rollout.",
      },
    ],
  },
  {
    id: "local_service",
    slug: "local-service",
    name: "Local service businesses",
    label: "Local service",
    headline: "Systems for local service businesses that book, dispatch, invoice, and bring customers back",
    intro: {
      ph: "Clinics, repair and aircon services, cleaning, trades, salons, and logistics run on bookings and follow-through. We build the system that answers every inquiry, schedules the job, sends the invoice, and reminds customers when it is time to come back.",
      us: "Clinics, repair, cleaning, trades, salons, and logistics run on bookings and follow-through. We build the system that answers every inquiry, schedules the job, sends the invoice, and reminds customers when it is time to come back.",
    },
    metaDescription:
      "Custom systems for clinics, repair, cleaning, trades, salons, and logistics: booking and dispatch, job tracking, invoicing and payment collection, and repeat-customer follow-up.",
    pains: [
      {
        title: "Inquiries go unanswered after hours",
        body: "A customer messages at night, hears nothing, and books with someone else in the morning.",
      },
      {
        title: "Double bookings and missed appointments",
        body: "The schedule lives in a notebook or a shared chat, and the team finds conflicts when they arrive.",
      },
      {
        title: "Invoices go out late, and some never get paid",
        body: {
          ph: "Billing waits until someone is back at the office. Unpaid invoices are noticed weeks later, and chasing GCash transfers is guesswork.",
          us: "Billing waits until someone is back at the office, and unpaid invoices are noticed weeks later.",
        },
      },
    ],
    before: [
      "Inquiries pile up overnight in three different inboxes.",
      "The dispatcher builds tomorrow’s schedule by phone and chat.",
      "Technicians write job notes on paper and hand them in at the end of the day.",
      "Invoices are typed up the next day and sent when someone remembers.",
      "Past customers are never contacted again unless they call.",
    ],
    after: [
      "Every inquiry gets an answer with prices and open slots, day or night.",
      "Bookings land in the schedule without conflicts, and customers get reminders.",
      "Technicians update jobs and add photos from their phones.",
      "The invoice goes out the moment the job is marked done, with a pay-now link.",
      "Customers are reminded when their next service is due.",
    ],
    systems: ["crm", "operations", "accounting", "bookkeeping"],
    systemNotes: {
      crm: "Every inquiry answered and every customer remembered.",
      operations: "Booking, dispatch, and job tracking across your locations.",
      accounting: "Invoicing and payment collection with reminders that stop when paid.",
      bookkeeping: "Receipts and expenses captured in the field and tagged to the job.",
    },
    faqs: [
      {
        q: "Can customers book online?",
        a: "Yes. Customers pick from real availability, and the booking goes straight into your schedule.",
      },
      {
        q: "What payment methods can customers use?",
        a: {
          ph: "The system can send pay-now links for GCash, Maya, cards, and bank transfer, depending on the payment provider you choose.",
          us: "The system can send pay-now links for cards and ACH, depending on the payment provider you choose.",
        },
      },
      {
        q: "We have more than one location. Does that work?",
        a: "Yes. Each location has its own schedule and team, and owners see all of them together.",
      },
    ],
  },
];

export function getSegment(slug: string) {
  return SEGMENTS.find((s) => s.slug === slug);
}

export function segmentById(id: SegmentId) {
  return SEGMENTS.find((s) => s.id === id)!;
}

/** Cooperatives first in PH, local service first in US (SPEC 6.1 §5). */
export function segmentsForMarket(market: "ph" | "us") {
  const order: SegmentId[] = market === "ph" ? ["cooperative", "agency", "local_service"] : ["local_service", "agency", "cooperative"];
  return order.map(segmentById);
}
