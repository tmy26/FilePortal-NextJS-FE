import Link from "next/link";
import { getSessionUser } from "@/lib/auth/get-session-user";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <main className="page-shell">
      <div className="home-layout">
        <h1 className="brand-mark home-brand">
          File <span className="brand-mark-accent">Portal</span>
        </h1>
        <p className="home-lead">Send files. Stay in control.</p>
        <p>
          {user
            ? "Buy TuningPoints from the shop, then upload ECU or gearbox files through the portal."
            : "Use the account icon to sign in or create an account, then upload and manage files through the portal."}
        </p>
        <div className="home-actions">
          {user ? (
            <>
              <Link href="/upload" className="cta">
                New File Request
              </Link>
              <Link href="/shop" className="cta cta-secondary">
                Buy TuningPoints
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="cta">
                Sign in
              </Link>
              <Link href="/register" className="cta cta-secondary">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
