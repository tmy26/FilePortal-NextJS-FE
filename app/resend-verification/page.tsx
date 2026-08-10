import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResendVerificationForm } from "./resend-verification-form";
import { PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Resend verification email",
  description: "Request a new File Portal account activation email.",
  path: "/resend-verification",
  index: false,
});

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResendVerificationPage({ searchParams }: PageProps) {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <PageShell variant="plain">
      <div className="auth-layout">
        <header className="auth-header">
          <h1>Resend verification email</h1>
          <p>
            Didn&apos;t get the activation link? Enter the email you registered
            with and we&apos;ll send a new one.
          </p>
        </header>

        <ResendVerificationForm initialEmail={email} />

        <p className="auth-footer muted">
          Already verified?{" "}
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
