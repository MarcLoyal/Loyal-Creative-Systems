import type { SegmentId, ServiceId } from "./types";
import type { Market } from "@/lib/market";

/**
 * Case studies (SPEC 6.7). Only real, client-approved stories are published ([DECISION] D9:
 * none yet), so the first case study is this website itself. Its result numbers come from
 * the live pipeline in phase 8; until then the page says so rather than estimating.
 * Client case studies move to the database in phase 9.
 */
export type CaseStudy = {
  slug: string;
  title: string;
  clientType: string;
  segment: SegmentId | null;
  market: Market | null;
  services: ServiceId[];
  summary: string;
  problem: string[];
  built: string[];
  result: string[];
  quote?: { text: string; by: string };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "this-website",
    title: "This website: a lead-to-client pipeline with no manual steps",
    clientType: "Loyal Creative Systems (our own business)",
    segment: null,
    market: null,
    services: ["crm", "operations", "accounting", "bookkeeping"],
    summary:
      "We built our own sales and onboarding on the same principles we sell: every step from first inquiry to onboarded client runs without anyone touching it.",
    problem: [
      "A small team cannot answer every inquiry within minutes, write a tailored proposal for each, and chase every follow-up by hand.",
      "Leads that wait go cold. Proposals that take a week lose to whoever answers first.",
    ],
    built: [
      "An intake form and chat assistant that save every inquiry before anything else happens.",
      "Scoring against a published rubric, and a personal reply within a minute.",
      "A tailored system plan on a private page, with prices taken only from our pricing settings and checked before sending.",
      "Self-service booking, online agreement and payment, automatic onboarding, and weekly progress reports.",
      "Retries, alerts, and an audit trail, so a failed step is fixed rather than forgotten.",
    ],
    result: [
      "Real numbers from the running pipeline (response time, workflows run, manual steps) will be published here once there is enough activity to report honestly.",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
