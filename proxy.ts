import { NextResponse, type NextRequest } from "next/server";
import {
  MARKET_COOKIE,
  MARKET_COOKIE_MAX_AGE,
  countryFromHeaders,
  isMarket,
  resolveMarket,
} from "@/lib/market";

/**
 * Market routing (SPEC 3.3).
 *
 * Public URLs carry no market (/services, /about ...). Marketing pages live under
 * app/(marketing)/[market]/ and are statically generated once per market; this proxy
 * rewrites each request to the right copy:
 *
 *   cookie lcs_market (set by the switcher)  →  wins
 *   else edge geolocation country == PH      →  ph
 *   else                                     →  us
 *
 * A request to /ph/... or /us/... sets the cookie and redirects to the clean URL,
 * so a market-specific link can be shared.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = pathname.match(/^\/(ph|us)(\/.*)?$/);
  if (prefixed && isMarket(prefixed[1])) {
    const url = request.nextUrl.clone();
    url.pathname = prefixed[2] || "/";
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(MARKET_COOKIE, prefixed[1], {
      maxAge: MARKET_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  const market = resolveMarket({
    cookie: request.cookies.get(MARKET_COOKIE)?.value,
    country: countryFromHeaders(request.headers) ?? process.env.DEV_COUNTRY ?? null,
  });

  const url = request.nextUrl.clone();
  url.pathname = `/${market}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-lcs-market", market);
  return res;
}

export const config = {
  matcher: [
    /*
     * Run on marketing pages only. Skip: API routes, app areas that are not
     * market-scoped (admin, portal, login, proposal, book, design-system),
     * Next internals, metadata files, and anything with a file extension.
     */
    "/((?!api|admin|portal|login|proposal|book|design-system|_next|brand|fonts|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|.*\\..*).*)",
  ],
};
