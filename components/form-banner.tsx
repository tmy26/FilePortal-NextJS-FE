import type { ReactNode } from "react";

type FormBannerTone = "error" | "success" | "info";

type FormBannerProps = {
  children: ReactNode;
  tone?: FormBannerTone;
};

export function FormBanner({ children, tone = "info" }: FormBannerProps) {
  const role = tone === "error" ? "alert" : "status";
  const className = [
    "form-banner",
    tone === "success" ? "form-banner-success" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={className} role={role}>
      {children}
    </p>
  );
}
