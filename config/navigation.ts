import type { Market } from "@/lib/market";

export type NavLink = { href: string; label: string; description?: string };

export const SERVICES_NAV: NavLink[] = [
  { href: "/services", label: "All services", description: "How the four systems connect" },
  { href: "/services/crm", label: "CRM systems", description: "Leads, clients, members, follow-ups" },
  { href: "/services/operations", label: "Operations systems", description: "Jobs, scheduling, approvals, inventory" },
  { href: "/services/accounting", label: "Accounting systems", description: "Invoicing, collections, reports" },
  { href: "/services/bookkeeping", label: "Bookkeeping systems", description: "Capture, categorize, reconcile" },
];

const SOLUTIONS: Record<"cooperatives" | "agencies" | "local-service", NavLink> = {
  cooperatives: { href: "/solutions/cooperatives", label: "Cooperatives", description: "Members, loans, collections, board reports" },
  agencies: { href: "/solutions/agencies", label: "Agencies", description: "Onboarding, retainers, time, profitability" },
  "local-service": {
    href: "/solutions/local-service",
    label: "Local service businesses",
    description: "Bookings, dispatch, invoicing, repeat customers",
  },
};

/** SPEC 6.1 §5: order follows the market — cooperatives first in PH. */
export function solutionsNav(market: Market): NavLink[] {
  return market === "ph"
    ? [SOLUTIONS.cooperatives, SOLUTIONS.agencies, SOLUTIONS["local-service"]]
    : [SOLUTIONS["local-service"], SOLUTIONS.agencies, SOLUTIONS.cooperatives];
}

export const PRIMARY_NAV: NavLink[] = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
];

export const PRIMARY_CTA: NavLink = { href: "/contact", label: "Get your system plan" };

export const FOOTER_COLUMNS = (market: Market): { title: string; links: NavLink[] }[] => [
  { title: "Services", links: SERVICES_NAV.slice(1) },
  { title: "Solutions", links: solutionsNav(market) },
  {
    title: "Company",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/demo", label: "Try the demo" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms" },
      { href: "/data-request", label: "Your data" },
    ],
  },
];
