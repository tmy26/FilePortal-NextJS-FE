import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./sign-in-form";
import { PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to your File Portal account.",
  path: "/sign-in",
  index: false,
});

export default async function SignInPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
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
