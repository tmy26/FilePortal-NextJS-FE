import type { Metadata } from "next";
import Link from "next/link";
import { verifyEmailAction } from "@/app/actions/users";
import { PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Verify email",
  description: "Confirm your File Portal account email.",
  path: "/verify-email",
  index: false,
});

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const result = token
    ? await verifyEmailAction(token)
    : { ok: false as const, error: "This verification link is missing a token." };

  return (
    <PageShell variant="plain">
      <div className="auth-layout">
        <header className="auth-header">
          <h1>Email verification</h1>
        </header>

        {result.ok && result.user ? (
          <div className="success-panel" role="status">
            <h2>Account activated</h2>
            <p>
              <strong>{result.user.email}</strong> is confirmed. You can sign in
              now.
            </p>
            <p>
              <Link href="/sign-in" className="text-link">
                Continue to sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="success-panel" role="alert">
            <h2>Could not verify</h2>
            <p>{result.error}</p>
            <p className="muted">
              Need a new link?{" "}
              <Link href="/resend-verification" className="text-link">
                Resend verification email
              </Link>
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
