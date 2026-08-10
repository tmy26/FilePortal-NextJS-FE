import { buildWebsiteJsonLd } from "@/lib/seo/json-ld";

export function SiteJsonLd() {
  const data = buildWebsiteJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
