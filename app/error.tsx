"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-shell">
      <div className="auth-layout">
        <header className="auth-header">
          <h1>Something went wrong</h1>
          <p className="muted">
            This page could not be loaded. Try again, or go back home.
          </p>
        </header>
        <div className="shop-result-actions">
          <button type="button" className="cta" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="cta cta-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
