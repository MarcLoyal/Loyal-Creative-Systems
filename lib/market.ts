/**
 * Market detection and per-market formatting (SPEC 3.2, 3.3).
 * Edge-safe: imported by proxy.ts, server components and client components.
 */

export const MARKETS = ["ph", "us"] as const;
export type Market = (typeof MARKETS)[number];

export const MARKET_COOKIE = "lcs_market";
/** 12 months, per SPEC 3.3. */
export const MARKET_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isMarket(value: unknown): value is Market {
  return typeof value === "string" && (MARKETS as readonly string[]).includes(value);
}

/**
 * Edge geolocation headers, in order of preference.
 * Vercel sets x-vercel-ip-country; Cloudflare sets cf-ipcountry.
 */
const COUNTRY_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "x-country-code"] as const;

export function countryFromHeaders(headers: Headers): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name);
    if (value && /^[A-Za-z]{2}$/.test(value)) return value.toUpperCase();
  }
  return null;
}

/** Philippines → PH market; everything else (including unknown) → US market. */
export function marketFromCountry(country: string | null | undefined): Market {
  return country?.toUpperCase() === "PH" ? "ph" : "us";
}

/** Cookie choice overrides detection. */
export function resolveMarket(input: { cookie?: string | null; country?: string | null }): Market {
  if (isMarket(input.cookie)) return input.cookie;
  return marketFromCountry(input.country);
}

export type MarketConfig = {
  id: Market;
  label: string;
  shortLabel: string;
  country: "PH" | "US";
  currency: "PHP" | "USD";
  currencySymbol: string;
  locale: string;
  phone: { prefix: string; digits: number; placeholder: string };
  paymentMethods: string[];
  privacyLaw: string;
};

export const MARKET_CONFIG: Record<Market, MarketConfig> = {
  ph: {
    id: "ph",
    label: "Philippines",
    shortLabel: "PH",
    country: "PH",
    currency: "PHP",
    currencySymbol: "₱",
    locale: "en-PH",
    phone: { prefix: "+63", digits: 10, placeholder: "917 123 4567" },
    paymentMethods: ["GCash", "Maya", "Bank transfer", "Card"],
    privacyLaw: "Data Privacy Act of 2012",
  },
  us: {
    id: "us",
    label: "United States",
    shortLabel: "US",
    country: "US",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    phone: { prefix: "+1", digits: 10, placeholder: "415 555 0123" },
    paymentMethods: ["Card", "ACH"],
    privacyLaw: "CCPA and applicable state laws",
  },
};

/** Money is stored as integer minor units (SPEC 20). */
export function formatMoney(minorUnits: number, market: Market): string {
  const cfg = MARKET_CONFIG[market];
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.currency,
    maximumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100);
}

/**
 * Normalize a phone number for the market. Returns E.164 or null if invalid.
 * Accepts local forms such as "0917 123 4567" (PH) or "(415) 555-0123" (US).
 */
export function normalizePhone(raw: string, market: Market): string | null {
  const { prefix, digits } = MARKET_CONFIG[market].phone;
  const cc = prefix.slice(1);
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) {
    d = d.slice(1);
    if (!d.startsWith(cc)) return null;
    d = d.slice(cc.length);
  } else if (market === "ph" && d.startsWith("0")) {
    d = d.slice(1);
  } else if (market === "us" && d.length === digits + 1 && d.startsWith("1")) {
    d = d.slice(1);
  }
  return d.length === digits && /^\d+$/.test(d) ? `${prefix}${d}` : null;
}
