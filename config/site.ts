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
 * Brand assets (SPEC 2.1).
 * logo.png was not supplied with the spec, so the header and footer use a plain-text
 * wordmark. Set `logoAvailable` to true once public/brand/ holds the processed files.
 */
export const BRAND = {
  logoAvailable: false,
  logo: "/brand/logo.png",
  logoWhite: "/brand/logo-white.png",
  logoWidth: 180,
  logoHeight: 48,
} as const;
