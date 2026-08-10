import { SITE_SEO, SITE_URL } from "./site";

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_SEO.name,
        alternateName: [...SITE_SEO.alternateNames],
        url: `${SITE_URL}/`,
        inLanguage: "en-GB",
        description: SITE_SEO.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": ["Organization", "AutomotiveBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_SEO.legalName,
        legalName: SITE_SEO.legalName,
        alternateName: [...SITE_SEO.alternateNames],
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        description: SITE_SEO.description,
        email: SITE_SEO.contactEmail,
        areaServed: [
          {
            "@type": "City",
            name: "Plovdiv",
            alternateName: "Пловдив",
          },
          "Bulgaria",
        ],
        knowsAbout: [
          "ECU files",
          "Gearbox files",
          "Chip tuning",
          "File portal",
          "TuningPoints",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: SITE_SEO.title.default,
        description: SITE_SEO.description,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
