import { describe, expect, it } from "vitest";
import {
  countryFromHeaders,
  formatMoney,
  isMarket,
  marketFromCountry,
  normalizePhone,
  resolveMarket,
} from "@/lib/market";
import { isSafePath, safeReturnPath } from "@/lib/safe-redirect";

describe("market detection (SPEC 3.3)", () => {
  it("maps the Philippines to PH and everything else to US", () => {
    expect(marketFromCountry("PH")).toBe("ph");
    expect(marketFromCountry("ph")).toBe("ph");
    expect(marketFromCountry("US")).toBe("us");
    expect(marketFromCountry("SG")).toBe("us");
    expect(marketFromCountry(null)).toBe("us");
  });

  it("lets the switcher cookie override geolocation", () => {
    expect(resolveMarket({ cookie: "us", country: "PH" })).toBe("us");
    expect(resolveMarket({ cookie: "ph", country: "US" })).toBe("ph");
  });

  it("ignores an invalid cookie value", () => {
    expect(resolveMarket({ cookie: "xx", country: "PH" })).toBe("ph");
    expect(resolveMarket({ cookie: "", country: null })).toBe("us");
  });

  it("reads Vercel and Cloudflare country headers and rejects junk", () => {
    expect(countryFromHeaders(new Headers({ "x-vercel-ip-country": "PH" }))).toBe("PH");
    expect(countryFromHeaders(new Headers({ "cf-ipcountry": "us" }))).toBe("US");
    expect(countryFromHeaders(new Headers({ "x-vercel-ip-country": "<script>" }))).toBeNull();
    expect(countryFromHeaders(new Headers())).toBeNull();
  });

  it("validates market ids", () => {
    expect(isMarket("ph")).toBe(true);
    expect(isMarket("PH")).toBe(false);
    expect(isMarket(undefined)).toBe(false);
  });
});

describe("per-market formatting (SPEC 3.2)", () => {
  it("formats minor units in the market currency", () => {
    expect(formatMoney(5_000_000, "ph")).toBe("₱50,000");
    expect(formatMoney(250_050, "us")).toBe("$2,500.50");
  });

  it("normalizes PH phone numbers to +63 and 10 digits", () => {
    expect(normalizePhone("0917 123 4567", "ph")).toBe("+639171234567");
    expect(normalizePhone("+63 917-123-4567", "ph")).toBe("+639171234567");
    expect(normalizePhone("917 123 456", "ph")).toBeNull();
    expect(normalizePhone("+1 415 555 0123", "ph")).toBeNull();
  });

  it("normalizes US phone numbers to +1 and 10 digits", () => {
    expect(normalizePhone("(415) 555-0123", "us")).toBe("+14155550123");
    expect(normalizePhone("1 415 555 0123", "us")).toBe("+14155550123");
    expect(normalizePhone("555-0123", "us")).toBeNull();
  });
});

describe("safe redirects", () => {
  const origin = "https://lcs.example";

  it("accepts same-site paths", () => {
    expect(isSafePath("/services/crm")).toBe(true);
    expect(safeReturnPath("/about?x=1", null, origin)).toBe("/about?x=1");
  });

  it("rejects open-redirect tricks", () => {
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "evil", "/a\nb", ""]) {
      expect(isSafePath(bad), bad).toBe(false);
    }
    expect(safeReturnPath("//evil.com", null, origin)).toBe("/");
  });

  it("falls back to a same-origin referer, never a foreign one", () => {
    expect(safeReturnPath(undefined, "https://lcs.example/about", origin)).toBe("/about");
    expect(safeReturnPath(undefined, "https://evil.com/x", origin)).toBe("/");
  });
});
