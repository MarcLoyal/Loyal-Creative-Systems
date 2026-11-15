import type { Market } from "@/lib/market";

/** Copy that is the same in both markets, or differs per market (SPEC 3.3). */
export type MarketText = string | { ph: string; us: string };

export function t(text: MarketText, market: Market): string {
  return typeof text === "string" ? text : text[market];
}

export type SegmentId = "cooperative" | "agency" | "local_service";
export type ServiceId = "crm" | "operations" | "accounting" | "bookkeeping";

export type Faq = { q: string; a: MarketText };
