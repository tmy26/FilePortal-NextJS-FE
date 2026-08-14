"use client";

import { useEffect, useRef, type ReactNode } from "react";

type HomeScrollRevealProps = {
  children: ReactNode;
};

/** Progressive enhancement: content stays visible without JS. */
export function HomeScrollReveal({ children }: HomeScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll("[data-reveal]");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    root.classList.add("is-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="home-seo">
      {children}
    </div>
  );
}
