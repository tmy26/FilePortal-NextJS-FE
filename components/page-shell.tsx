import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  /** Use shop/auth centered layout (default true). */
  variant?: "app" | "plain";
};

export function PageShell({ children, variant = "app" }: PageShellProps) {
  if (variant === "plain") {
    return <main className="page-shell">{children}</main>;
  }

  return (
    <main className="page-shell">
      <div className="auth-layout shop-layout">{children}</div>
    </main>
  );
}

type AppPageHeaderProps = {
  kicker?: string;
  title: string;
  description?: ReactNode;
};

export function AppPageHeader({
  kicker,
  title,
  description,
}: AppPageHeaderProps) {
  return (
    <header className="auth-header shop-header">
      {kicker ? <p className="shop-kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
