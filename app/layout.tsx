import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/config/site";
import "./globals.css";

/*
 * Self-hosted fonts (SPEC 2.3). Variable files cover weights 400–700.
 * display "optional": preloaded fonts are used when they arrive within the first ~100 ms;
 * otherwise the metric-matched fallback stays, so a late font never re-renders the hero
 * and pushes Largest Contentful Paint past the 2.5 s target (SPEC 24).
 */
const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "optional",
});

const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght.woff2",
  variable: "--font-montserrat",
  weight: "600 700",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#011E56",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
