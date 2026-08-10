import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXABLE_ROUTES } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...INDEXABLE_ROUTES]
    .sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path))
    .map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    }));
}
