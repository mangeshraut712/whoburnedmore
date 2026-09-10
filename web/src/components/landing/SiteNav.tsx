import Link from "next/link";
import { SITE_NAV, type SiteNavLabel } from "./site-nav";
import { cn } from "@/lib/utils";

export type { SiteNavLabel };

export function SiteNav({
  active,
  className,
}: {
  active?: SiteNavLabel;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-[15px]",
        className,
      )}
      aria-label="Primary"
    >
      {SITE_NAV.map((item) => {
        const isActive = item.label === active;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "transition-colors",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
