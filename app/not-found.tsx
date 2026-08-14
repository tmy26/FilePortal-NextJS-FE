import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist.",
  keywords: [],
  alternates: {
    canonical: null,
  },
  openGraph: {
    url: null,
    title: "Page not found",
    description: "This page does not exist.",
  },
  twitter: {
    title: "Page not found",
    description: "This page does not exist.",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NotFound() {
  return (
    <PageShell variant="plain">
      <header className="auth-header">
        <h1>Page not found</h1>
        <p>This URL does not exist. It is not a File Portal page.</p>
      </header>
      <p>
        <Link href="/" className="cta">
          Back to home
        </Link>
      </p>
    </PageShell>
  );
}
