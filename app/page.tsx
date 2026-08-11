import { HomeActions } from "@/components/home-actions";
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
        <HomeActions hasServerUser={Boolean(user)} />
      </div>
    </main>
  );
}
