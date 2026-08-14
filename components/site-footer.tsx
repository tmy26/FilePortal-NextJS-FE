import Link from "next/link";
import { ORGANIZATION_SOCIAL_LINKS } from "@/lib/seo/json-ld";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-copy">© {year} ECUFilePortal</p>
        <nav className="site-footer-links" aria-label="Company">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <nav className="site-footer-links" aria-label="Legal">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>
        <nav className="site-footer-links" aria-label="TMY Tuned on the web">
          {ORGANIZATION_SOCIAL_LINKS.map((link) => (
            <a key={link.href} href={link.href} rel="me noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
