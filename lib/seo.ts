import type { Metadata } from "next";
import { SITE } from "@/config/site";
import type { Faq } from "@/config/content/types";
import { t } from "@/config/content/types";
import type { Market } from "@/lib/market";

/**
 * Per-page metadata (SPEC 24): unique title and description, canonical URL on the public,
 * market-free path. Both market copies of a page share one canonical URL.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/brand/logo.png"),
    slogan: SITE.tagline,
    email: SITE.contactEmail,
    description: SITE.description,
  };
}

export function serviceJsonLd(s: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: absoluteUrl(s.path),
    serviceType: s.name,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: [
      { "@type": "Country", name: "Philippines" },
      { "@type": "Country", name: "United States" },
    ],
  };
}

export function faqJsonLd(faqs: Faq[], market: Market) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: t(f.a, market) },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
