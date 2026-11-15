import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { SERVICES } from "@/config/content/services";
import { SEGMENTS } from "@/config/content/segments";
import { CASE_STUDIES } from "@/config/content/case-studies";

/**
 * Public, market-free URLs only (private routes are excluded and noindexed).
 * Published blog posts are added from the database in phase 9.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...SEGMENTS.map((s) => `/solutions/${s.slug}`),
    "/how-it-works",
    "/case-studies",
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}`),
    "/blog",
    "/about",
    "/contact",
    "/demo",
    "/privacy",
    "/terms",
    "/data-request",
  ];
  return paths.map((path) => ({
    url: `${SITE.url}${path}`,
    priority: path === "/" ? 1 : path.startsWith("/services") || path.startsWith("/solutions") ? 0.8 : 0.5,
  }));
}
