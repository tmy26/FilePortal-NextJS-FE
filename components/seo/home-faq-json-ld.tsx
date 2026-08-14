import { HOME_SEO_CONTENT } from "@/lib/seo/public-page-copy";
import { SITE_URL } from "@/lib/seo/site";

export function HomeFaqJsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_SEO_CONTENT.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: `${SITE_URL}/`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
    />
  );
}
