"use client";

import { usePathname } from "next/navigation";
import { MARKETS, MARKET_CONFIG, type Market } from "@/lib/market";
import { cn } from "@/lib/cn";
import { GlobeIcon } from "@/components/ui/icons";

/**
 * Market switcher (SPEC 3.3). A plain form POST so it works without JavaScript:
 * /api/market sets the 12-month cookie and redirects back to the same page.
 */
export function MarketSwitcher({ current, tone = "light" }: { current: Market; tone?: "light" | "dark" }) {
  const pathname = usePathname() || "/";
  return (
    <form action="/api/market" method="post" className="flex items-center gap-2">
      <input type="hidden" name="returnTo" value={pathname} />
      <GlobeIcon className={cn("size-4", tone === "dark" ? "text-slate-300" : "text-muted")} />
      <span className="sr-only">Market: {MARKET_CONFIG[current].label}. Switch market:</span>
      <div
        role="group"
        aria-label="Choose market"
        className={cn("flex rounded-md p-0.5", tone === "dark" ? "bg-white/10" : "bg-surface-alt")}
      >
        {MARKETS.map((m) => {
          const active = m === current;
          return (
            <button
              key={m}
              type="submit"
              name="market"
              value={m}
              aria-pressed={active}
              title={MARKET_CONFIG[m].label}
              className={cn(
                "min-h-8 rounded px-2.5 font-heading text-xs font-semibold tracking-wider",
                active
                  ? tone === "dark"
                    ? "bg-white text-navy-900"
                    : "bg-navy-900 text-white"
                  : tone === "dark"
                    ? "text-slate-300 hover:text-white"
                    : "text-muted hover:text-ink",
              )}
            >
              <span aria-hidden="true">{MARKET_CONFIG[m].shortLabel}</span>
              <span className="sr-only">{MARKET_CONFIG[m].label}</span>
            </button>
          );
        })}
      </div>
    </form>
  );
}
