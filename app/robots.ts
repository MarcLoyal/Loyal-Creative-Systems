import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/portal", "/login", "/proposal/", "/book/", "/design-system"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
