import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  /** Use shop/auth centered layout (default true). */
  variant?: "app" | "plain";
  className?: string;
};

export function PageShell({
  children,
  variant = "app",
  className,
}: PageShellProps) {
  const shellClass = ["page-shell", variant === "plain" ? "page-shell-auth" : "", className]
    .filter(Boolean)
    .join(" ");

  if (variant === "plain") {
    return <main className={shellClass}>{children}</main>;
  }

  return (
    <main className={shellClass}>
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
