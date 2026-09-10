import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/trust", label: "data + trust" },
  { href: "/guides/check-ai-token-usage", label: "usage guide" },
  { href: "/privacy", label: "privacy" },
  { href: "/terms", label: "terms" },
  { href: "/contact", label: "contact" },
  { href: "/studio", label: "card studio" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6">
        <p>whoburnedmore · open source token leaderboard</p>
        <nav className="flex flex-wrap gap-x-3 gap-y-1" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
