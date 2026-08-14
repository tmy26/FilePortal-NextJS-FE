import type { MoneyPageDef } from "@/lib/seo/money-pages";
import {
  buildBreadcrumbListJsonLd,
  buildOrganizationJsonLd,
  homeBreadcrumb,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

type MoneyPageJsonLdProps = {
  page: MoneyPageDef;
};

function breadcrumbItems(page: MoneyPageDef) {
  const items = [homeBreadcrumb()];
  if (page.breadcrumbParent) {
    items.push({
      name: page.breadcrumbParent.name,
      path: page.breadcrumbParent.path,
    });
  }
  items.push({ name: page.h1, path: `/${page.slug}` });
  return items;
}

export function MoneyPageJsonLd({ page }: MoneyPageJsonLdProps) {
  const url = `${SITE_URL}/${page.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.h1,
      description: page.metaDescription,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
    },
    buildBreadcrumbListJsonLd(breadcrumbItems(page)),
    {
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  if (page.slug === "about") {
    graph.splice(1, 0, buildOrganizationJsonLd());
  }

  if (page.schema === "service") {
    graph.splice(1, 0, {
      "@type": "Service",
      name: page.h1,
      description: page.lead,
      url,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: "Online",
    });
  }

  if (page.slug === "pricing") {
    graph.push({
      "@type": "Offer",
      name: "TuningPoint",
      price: "10.00",
      priceCurrency: "EUR",
      url: `${SITE_URL}/shop`,
    });
  }

  if (page.slug === "how-it-works") {
    graph.push({
      "@type": "HowTo",
      name: page.h1,
      description: page.lead,
      url,
      step: page.sections.map((section, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: section.heading,
        text: section.paragraphs.join(" "),
      })),
    });
  }

  if (page.slug === "contact") {
    graph.push({
      "@type": "ContactPage",
      url,
      name: page.h1,
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
