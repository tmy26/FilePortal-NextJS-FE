import { SITE_SEO, SITE_URL, absoluteUrl } from "./site";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Official profiles only — do not invent extra social URLs. */
export const ORGANIZATION_SAME_AS = [
  "https://www.instagram.com/tmytuned/",
  "https://www.facebook.com/profile.php?id=61570931755775",
  "https://tmytuned.com",
] as const;

export const ORGANIZATION_SOCIAL_LINKS = [
  { href: "https://www.instagram.com/tmytuned/", label: "Instagram" },
  {
    href: "https://www.facebook.com/profile.php?id=61570931755775",
    label: "Facebook",
  },
] as const;

export function buildOrganizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_SEO.legalName,
    legalName: SITE_SEO.legalName,
    alternateName: ["ECUFilePortal", ...SITE_SEO.alternateNames],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
    },
    image: `${SITE_URL}/opengraph-image`,
    email: SITE_SEO.contactEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_SEO.geo.placename,
      addressCountry: "BG",
    },
    sameAs: [...ORGANIZATION_SAME_AS],
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbListJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homeBreadcrumb(): BreadcrumbItem {
  return { name: "Home", path: "/" };
}

export function buildWebsiteJsonLd() {
  const organization = buildOrganizationJsonLd();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_SEO.name,
        alternateName: [...SITE_SEO.alternateNames],
        url: `${SITE_URL}/`,
        inLanguage: "en-GB",
        description: SITE_SEO.description,
        publisher: { "@id": ORGANIZATION_ID },
      },
      organization,
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: SITE_SEO.title.default,
        description: SITE_SEO.description,
        inLanguage: "en-GB",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}
