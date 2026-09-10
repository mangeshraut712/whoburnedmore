import React from "react";
import Link from "next/link";
import { WbmLogo } from "@/components/landing/WbmLogo";
import { SiteNav, type SiteNavLabel } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Button } from "@/components/ui/button";

export function SiteChrome({
  children,
  active,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  active?: SiteNavLabel;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 glow-burn opacity-50" />
      <header className="relative z-20 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <Link
            href="/"
            aria-label="whoburnedmore home"
            className="flex shrink-0 items-center gap-2.5"
          >
            <WbmLogo size={28} decorative className="wbm-logo-glow-soft" />
            <span className="hidden text-sm font-semibold sm:inline">
              whoburnedmore
            </span>
          </Link>
          <SiteNav active={active} className="min-w-0 flex-1 text-[14px] sm:text-[15px]" />
          <Button
            asChild
            variant="link"
            className="h-auto shrink-0 px-0 text-[15px] text-primary hover:text-primary/80"
          >
            <Link href="/signin">sign in</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {(title || subtitle) && (
          <div className="mb-8 border-b border-border pb-6">
            {title && (
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
