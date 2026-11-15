import { NextResponse, type NextRequest } from "next/server";
import { MARKET_COOKIE, MARKET_COOKIE_MAX_AGE, isMarket } from "@/lib/market";
import { safeReturnPath } from "@/lib/safe-redirect";

/** Sets the market cookie from the switcher form and returns the visitor to the same page. */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const market = form?.get("market");
  const returnTo = safeReturnPath(form?.get("returnTo"), request.headers.get("referer"), request.nextUrl.origin);

  const res = NextResponse.redirect(new URL(returnTo, request.nextUrl.origin), 303);
  if (isMarket(market)) {
    res.cookies.set(MARKET_COOKIE, market, {
      maxAge: MARKET_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}
