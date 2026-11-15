import type { Faq, MarketText, SegmentId, ServiceId } from "./types";

/**
 * Service catalog copy (SPEC 4, 6.4). Voice (SPEC 2.6): outcomes in the client's terms,
 * no hype, no invented statistics. LCS builds systems; it does not provide accounting,
 * tax, or audit services (SPEC 1.5, D4 default).
 */

export type Automation = {
  title: string;
  /** Small diagram: trigger → what the system does → what the person sees. */
  trigger: string;
  action: string;
  result: string;
};

export type Service = {
  id: ServiceId;
  slug: string;
  name: string;
  shortName: string;
  /** One sentence: what the system does. */
  summary: string;
  metaDescription: string;
  replaces: string[];
  automations: Automation[];
  /** How it connects to each of the other three systems. */
  connections: Partial<Record<ServiceId, string>>;
  examples: Record<SegmentId, MarketText>;
  faqs: Faq[];
};

export const SERVICES: Service[] = [
  {
    id: "crm",
    slug: "crm",
    name: "CRM systems",
    shortName: "CRM",
    summary:
      "Every inquiry, client, or member in one place, answered at once and followed up until they reply.",
    metaDescription:
      "Custom CRM systems that log, assign, and answer every inquiry instantly, then follow up until the person replies.",
    replaces: [
      "Copying inquiries from Facebook, email, and forms into a spreadsheet",
      "Remembering who to call back, and when",
      "Searching old chats to find what a client was promised",
      "Asking around to find out who is handling which lead",
    ],
    automations: [
      {
        title: "New inquiry, answered in a minute",
        trigger: "Someone fills in your form or sends a message",
        action: "The inquiry is logged, tagged, and assigned to the right person",
        result: "They get a reply that answers their question, not a generic “we got it”",
      },
      {
        title: "Follow-ups that send themselves",
        trigger: "A lead has not replied in two days",
        action: "The next message in the sequence goes out on schedule",
        result: "The sequence stops the moment they reply or book",
      },
      {
        title: "One history per person",
        trigger: "Any email, call note, payment, or job",
        action: "It is attached to that person’s record automatically",
        result: "Anyone on your team can see the whole story in one screen",
      },
      {
        title: "Nobody falls through the cracks",
        trigger: "A lead sits untouched for 48 hours",
        action: "The owner and their manager are alerted",
        result: "Every lead has a next step or a clear end",
      },
    ],
    connections: {
      operations: "A won deal creates the job or project, with the client’s details already filled in.",
      accounting: "The agreed price flows to the first invoice. Nobody types it again.",
      bookkeeping: "Payments are matched to the client automatically, so you always know who has paid.",
    },
    examples: {
      cooperative: {
        ph: "A member inquiry about a loan from your Facebook page is logged, answered with the requirements list, and assigned to a loan officer before the end of the hour.",
        us: "A member inquiry about a loan is logged, answered with the requirements list, and assigned to a loan officer within the hour.",
      },
      agency: "A prospect who downloads your rate card gets a tailored reply, a booking link, and three timed follow-ups that stop the moment they book a call.",
      local_service: {
        ph: "A customer messages at 10 pm asking for an aircon cleaning. They get prices and open slots at once, and the booking is waiting for your team in the morning.",
        us: "A customer requests a quote at 10 pm. They get pricing and open slots at once, and the job request is waiting for your dispatcher in the morning.",
      },
    },
    faqs: [
      {
        q: "Can you use the CRM we already have?",
        a: "Often, yes. If your current tool has a way to connect to other systems, we build around it. If it doesn’t, we recommend a replacement and move your data over.",
      },
      {
        q: "Where do inquiries come from?",
        a: {
          ph: "Your website, email, and the channels you already use, such as Facebook Messenger. We connect the ones you rely on most.",
          us: "Your website, email, and the channels you already use. We connect the ones you rely on most.",
        },
      },
      {
        q: "Will replies sound like a robot?",
        a: "Replies are written from your own templates and the person’s actual question, in your voice. You approve the templates before anything is sent.",
      },
    ],
  },
  {
    id: "operations",
    slug: "operations",
    name: "Operations systems",
    shortName: "Operations",
    summary:
      "Jobs, schedules, approvals, and stock tracked in one system that assigns the work and tells the right people.",
    metaDescription:
      "Custom operations systems for jobs, scheduling, approvals, and inventory. A closed sale creates the job, assigns the team, and schedules it.",
    replaces: [
      "Group chats used as a job board",
      "Whiteboards and paper job orders",
      "Chasing approvals by message",
      "Counting stock by hand before every order",
    ],
    automations: [
      {
        title: "Sale in, job scheduled",
        trigger: "A deal is marked won",
        action: "The job is created, the team assigned, and the slot booked",
        result: "The client gets their schedule without anyone typing it up",
      },
      {
        title: "Approvals that find the right person",
        trigger: "A purchase, discount, or change needs sign-off",
        action: "It goes to the person with authority for that amount",
        result: "They approve from their phone; the requester is told at once",
      },
      {
        title: "Status without asking",
        trigger: "A job moves to a new stage",
        action: "The client and the team are updated",
        result: "No more “where are we on this?” messages",
      },
      {
        title: "Stock that reorders itself",
        trigger: "An item drops below its minimum",
        action: "A purchase request is drafted for approval",
        result: "You stop running out mid-job",
      },
    ],
    connections: {
      crm: "Jobs start from won deals, with everything the client told you attached.",
      accounting: "A job marked done creates its invoice the same minute.",
      bookkeeping: "Materials and expenses used on a job are recorded against it, so you see the real cost.",
    },
    examples: {
      cooperative: "A loan application moves from intake to credit committee to release, with each officer notified when it reaches them and the member told at each step.",
      agency: "A signed retainer creates the project, the task list for month one, and the kickoff meeting. The account manager just shows up.",
      local_service: "A booked repair is assigned to the nearest available technician, added to their route, and the customer gets an arrival window.",
    },
    faqs: [
      {
        q: "Can my team use it from their phones?",
        a: "Yes. Field teams update jobs, add photos, and mark work done from their phones.",
      },
      {
        q: "We have more than one branch. Does that work?",
        a: "Yes. Each branch sees its own jobs and stock, and owners see everything.",
      },
      {
        q: "What if our process is unusual?",
        a: "That is the point of a custom system. We map how your work actually moves today, then automate that, not a generic template.",
      },
    ],
  },
  {
    id: "accounting",
    slug: "accounting",
    name: "Accounting systems",
    shortName: "Accounting",
    summary:
      "Invoices that create and send themselves, payments that chase themselves, and reports that build themselves.",
    metaDescription:
      "Custom accounting systems: a completed job creates and sends the invoice, overdue invoices trigger reminders, and reports build themselves.",
    replaces: [
      "Typing invoices from job sheets at the end of the week",
      "Scrolling bank statements to see who has paid",
      "Awkward reminder messages written one by one",
      "Building the monthly report by hand",
    ],
    automations: [
      {
        title: "Invoice the moment the job is done",
        trigger: "A job or milestone is marked complete",
        action: "The invoice is created with the agreed price and sent",
        result: "Your client can pay from the link the same day",
      },
      {
        title: "Polite reminders, on time",
        trigger: "An invoice passes its due date",
        action: "Reminders go out on a schedule you set",
        result: "Reminders stop the moment payment arrives",
      },
      {
        title: "Payments matched for you",
        trigger: "A payment arrives",
        action: "It is matched to the invoice and the client",
        result: "The invoice is marked paid and a receipt goes out",
      },
      {
        title: "Reports that build themselves",
        trigger: "End of week or month",
        action: "Sales, collections, and what is still owed are compiled",
        result: "The report is in your inbox before you ask for it",
      },
    ],
    connections: {
      crm: "Invoices go to the right contact with the client’s full history beside them.",
      operations: "Completed jobs trigger invoices, so finished work is never left unbilled.",
      bookkeeping: "Every invoice and payment posts to the books automatically.",
    },
    examples: {
      cooperative: {
        ph: "Loan amortization schedules are generated at release, and members get a reminder before each due date with the amount and payment options, including GCash.",
        us: "Loan payment schedules are generated at release, and members get a reminder before each due date with the amount and how to pay.",
      },
      agency: "Retainer invoices go out on the first of the month; hourly work is billed from tracked time when the month closes.",
      local_service: {
        ph: "When the technician marks the job done, the customer receives the invoice and can pay by GCash, Maya, or card before the van leaves.",
        us: "When the technician marks the job done, the customer receives the invoice and can pay by card before the truck leaves.",
      },
    },
    faqs: [
      {
        q: "Do you do our accounting?",
        a: "No. We build the system that handles invoicing, collections, and reporting. Your accountant or bookkeeper still advises you and signs off on your financial statements.",
      },
      {
        q: "Does it work with our accounting software?",
        a: {
          ph: "We connect to the tools you already use where they allow it, or build the records in a format your accountant can import.",
          us: "We connect to tools like QuickBooks and Xero where they allow it, so invoices and payments appear there without re-typing.",
        },
      },
      {
        q: "Will it handle tax?",
        a: {
          ph: "The system can apply the tax settings your accountant gives us and keep records organized for BIR filing. It does not decide your tax treatment; your accountant does.",
          us: "The system can apply the sales tax settings your accountant gives us and keep records organized. It does not decide your tax treatment; your accountant does.",
        },
      },
    ],
  },
  {
    id: "bookkeeping",
    slug: "bookkeeping",
    name: "Bookkeeping systems",
    shortName: "Bookkeeping",
    summary:
      "Receipts and transactions captured, categorized, and reconciled as they happen, with a month-end summary nobody has to compile.",
    metaDescription:
      "Custom bookkeeping systems that capture and categorize receipts and bank transactions, reconcile them, and deliver a month-end summary automatically.",
    replaces: [
      "A shoebox, or a folder, of receipts",
      "Typing transactions from bank statements into a spreadsheet",
      "Reconciling at month-end in one long sitting",
      "Sending your bookkeeper a pile of files and questions",
    ],
    automations: [
      {
        title: "Snap a receipt, done",
        trigger: "A photo of a receipt, or a forwarded email",
        action: "The amount, date, and supplier are read and recorded",
        result: "It is filed under the right category and job",
      },
      {
        title: "Transactions that sort themselves",
        trigger: "New bank or e-wallet transactions",
        action: "Each is categorized by rules learned from your history",
        result: "Only the unusual ones wait for a person to check",
      },
      {
        title: "Reconciliation as you go",
        trigger: "A payment matches an invoice or bill",
        action: "Both sides are matched and marked",
        result: "Month-end has nothing left to chase",
      },
      {
        title: "Month-end summary, delivered",
        trigger: "The month closes",
        action: "Income, expenses, and balances are summarized",
        result: "It arrives ready for your bookkeeper or accountant",
      },
    ],
    connections: {
      crm: "Payments are linked to clients, so customer balances are always current.",
      operations: "Expenses are tagged to jobs and projects, showing the profit on each one.",
      accounting: "Invoices and payments from accounting arrive already recorded.",
    },
    examples: {
      cooperative: {
        ph: "Share capital and savings deposits are recorded per member as they come in, and the month-end summary is organized for your bookkeeper’s CDA reports.",
        us: "Member deposits and share purchases are recorded as they come in, and the month-end summary is ready for your bookkeeper.",
      },
      agency: "Software subscriptions and contractor payments are categorized and tagged to the client they were for, showing profit per client.",
      local_service: "Fuel and parts receipts are photographed in the field and recorded against the job before the technician gets back.",
    },
    faqs: [
      {
        q: "Does this replace our bookkeeper?",
        a: "No. It removes the data entry so your bookkeeper spends their time reviewing and advising, not typing.",
      },
      {
        q: "Which banks and wallets can it read?",
        a: {
          ph: "It depends on the bank. Where a direct connection is not available, the system imports the statement files your bank provides, including e-wallet exports.",
          us: "Many US banks can connect directly through a secure bank-data service. Where they cannot, the system imports the statement files your bank provides.",
        },
      },
      {
        q: "Is our financial data safe?",
        a: "Data is encrypted, access is limited to the people you choose, and every change is logged with who made it and when.",
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
