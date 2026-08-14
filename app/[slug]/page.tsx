import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPage } from "@/components/seo/money-page";
import { getMoneyPage, MONEY_PAGE_SLUGS } from "@/lib/seo/money-pages";
import { pageMetadata } from "@/lib/seo/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MONEY_PAGE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getMoneyPage(slug);
  if (!page) {
    return { robots: { index: false, follow: false } };
  }

  const base = pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/${page.slug}`,
  });

  return {
    ...base,
    title: { absolute: page.title },
    openGraph: {
      ...base.openGraph,
      title: page.title,
    },
    twitter: {
      ...base.twitter,
      title: page.title,
    },
  };
}

export default async function MoneySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getMoneyPage(slug);

  if (!page) {
    notFound();
  }

  return <MoneyPage page={page} />;
}
