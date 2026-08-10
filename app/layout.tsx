import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { AppChrome } from "@/components/app-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { SITE_SEO, SITE_TITLE_BRAND, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

export const dynamic = "force-dynamic";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

const sans = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_SEO.title,
  description: SITE_SEO.description,
  applicationName: SITE_SEO.shortName,
  authors: [{ name: SITE_SEO.creator, url: SITE_URL }],
  creator: SITE_SEO.creator,
  publisher: SITE_SEO.publisher,
  keywords: [...SITE_SEO.keywords],
  category: SITE_SEO.category,
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llm.txt", title: "llm.txt" },
        { url: "/llms.txt", title: "llms.txt" },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_SEO.locale,
    url: SITE_URL,
    siteName: SITE_TITLE_BRAND,
    title: SITE_SEO.ogTitle,
    description: SITE_SEO.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SEO.twitterTitle,
    description: SITE_SEO.twitterDescription,
  },
  other: {
    "geo.region": SITE_SEO.geo.region,
    "geo.placename": SITE_SEO.geo.placename,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1422" },
  ],
};

const themeBootScript = `(function(){try{var t=localStorage.getItem('file-portal-theme');var mobile=window.matchMedia('(max-width: 767px)').matches;if(t==='dark'||(t!=='light'&&(mobile||window.matchMedia('(prefers-color-scheme: dark)').matches))){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="h-full">
        <SiteJsonLd />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <div className="site-backdrop" aria-hidden="true" />
        <ThemeProvider>
          <div className="site-frame">
            <AppChrome user={user}>{children}</AppChrome>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
