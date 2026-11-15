/**
 * Site-wide constants. Values that depend on open decisions are marked.
 */
export const SITE = {
  name: "Loyal Creative Systems",
  shortName: "LCS",
  tagline: "Expert Strategy, Automated Solutions.",
  description:
    "Custom automated CRM, operations, accounting, and bookkeeping systems, connected into one flow. Built for cooperatives, agencies, and local service businesses.",
  /** [DECISION] D3: domain. Preview URL until confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** [DECISION] D3: sending / contact address. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  /** [DECISION] D7: postal address required in email footers before launch. */
  postalAddress: null as string | null,
} as const;

/**
 * Brand assets (SPEC 2.1), derived from /logo.png by scripts/brand-assets.py.
 *   logo.png / logo-white.png            mark + wordmark (header, footer)
 *   logo-full.png / logo-full-white.png  mark + wordmark + tagline (large placements)
 *   mark.png / mark-white.png            "LCS" letters only
 */
export const BRAND = {
  logo: { src: "/brand/logo.png", white: "/brand/logo-white.png", width: 1021, height: 328 },
  logoFull: { src: "/brand/logo-full.png", white: "/brand/logo-full-white.png", width: 1021, height: 378 },
  mark: { src: "/brand/mark.png", white: "/brand/mark-white.png", width: 814, height: 237 },
} as const;
