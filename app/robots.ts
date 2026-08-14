import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Crawl budget only. Indexing is controlled by noindex / 404 / 410, not by
 * listing private HTML paths here — Google must recrawl those URLs to drop them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
