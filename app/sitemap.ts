import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Public, market-free URLs only. Phase 2 extends this to every page; phase 9 adds
 * published posts and case studies from the database.
 */
const PATHS = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${SITE.url}${path}` }));
}
