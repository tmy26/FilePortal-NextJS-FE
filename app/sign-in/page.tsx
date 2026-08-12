import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./sign-in-form";
import { PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { safeInternalPath } from "@/lib/auth/safe-next-path";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to your File Portal account.",
  path: "/sign-in",
});

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next) ?? "/";

  const user = await getSessionUser();
  if (user) {
    redirect(nextPath);
  }

  return (
    <PageShell variant="plain">
      <div className="auth-layout">
        <header className="auth-header">
          <h1>Sign in</h1>
          <p>Access your File Portal account to manage uploads.</p>
        </header>

        <SignInForm
          googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? ""}
          nextPath={nextPath}
        />

        <p className="auth-footer muted">
          Need an account?{" "}
          <Link href="/register" className="text-link">
            Create account
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
