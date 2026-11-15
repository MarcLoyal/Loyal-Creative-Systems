import { notFound } from "next/navigation";
import { isMarket, type Market } from "@/lib/market";

/** Reads and validates the market segment that proxy.ts rewrote into the URL. */
export async function marketParam(params: Promise<{ market: string }>): Promise<Market> {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return market;
}
