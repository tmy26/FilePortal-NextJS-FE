import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_SEO.name,
    short_name: SITE_SEO.shortName,
    description: SITE_SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0c1422",
    theme_color: "#0c1422",
    lang: "en",
  };
}
