import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateUserForm } from "./create-user-form";
import { PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Create account",
  description: "Create a File Portal account to upload and manage tuning files.",
  path: "/register",
  index: false,
});

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
  }

  return (
    <PageShell variant="plain">
      <div className="auth-layout">
        <header className="auth-header">
          <h1>Create your account</h1>
          <p>Set up access to upload and manage files through the portal.</p>
        </header>
        <CreateUserForm
          googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? ""}
        />
        <p className="auth-footer muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-link">
            Sign in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
