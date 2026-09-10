"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import { WbmLogo } from "./WbmLogo";
import { FaqSection } from "./FaqSection";
import { SiteNav, type SiteNavLabel } from "./SiteNav";
import { CopyCommand } from "./CopyCommand";
import { formatTokens, formatUSD } from "@/lib/contracts";
import { SITE_STATS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DeepDives } from "./DeepDives";

type LandingSidebarProps = {
  active?: SiteNavLabel;
};

export function LandingSidebar({ active = "leaderboard" }: LandingSidebarProps) {
  return (
    <aside className="relative z-10 shrink-0 overflow-visible border-b border-border bg-background/95 px-4 py-4 backdrop-blur max-lg:py-3 lg:h-full lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:px-6 lg:py-5 scrollbar-none">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px]">
        <SiteNav active={active} />
        <Button
          asChild
          variant="link"
          className="ml-auto h-auto px-0 text-[15px] text-primary hover:text-primary/80"
        >
          <Link href="/signin">sign in</Link>
        </Button>
      </div>

      <div className="mt-2 lg:mt-6">
        <WbmLogo size={76} className="mb-2 wbm-logo-glow-soft lg:mb-3" />

        <h1 className="text-[2.15rem] font-bold leading-[1.05] tracking-tight sm:text-[2.4rem] lg:text-[2.7rem]">
          <span className="text-foreground">whoburnedmore</span>{" "}
          <span className="text-primary">token leaderboard</span>
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          whoburnedmore — formerly BurnBar
        </p>
        <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Run one command, get a detailed breakdown of your AI usage, and compare
          usage with your friends.
        </p>
      </div>

      <div id="install" className="mt-6 scroll-mt-8">
        <CopyCommand />
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3 opacity-70" />
            Only token totals leave your machine
          </span>
          <a
            href="https://github.com/arhxam/whoburnedmore"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            open source
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { label: "combined burn", value: formatTokens(SITE_STATS.combinedBurn), pill: "live" },
          { label: "estimated cost", value: formatUSD(SITE_STATS.estimatedCost), pill: "updating" },
          { label: "burned today", value: formatTokens(SITE_STATS.burnedToday), pill: "syncing" },
          { label: "indexed devs", value: SITE_STATS.indexedDevs.toLocaleString(), pill: "public" },
        ].map((stat) => (
          <div key={stat.label} className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold normal-case tracking-wide text-primary">
                {stat.pill}
              </span>
            </div>
            <div className="mt-1 font-mono text-xl font-semibold tracking-tight text-foreground tnum sm:text-2xl">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="group gap-0 border-border bg-card/40 py-0 shadow-none transition-colors hover:bg-card/70">
          <Link href="/for-teams" className="relative block p-3.5">
            <ArrowUpRight className="absolute right-3 top-3 size-3.5 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
            <Badge
              variant="secondary"
              className="h-auto bg-transparent px-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              team board
            </Badge>
            <CardTitle className="mt-1 text-sm font-semibold">
              Create an internal leaderboard
            </CardTitle>
            <CardDescription className="mt-1 text-xs leading-snug">
              Free internal leaderboard for your company to compare AI usage.
            </CardDescription>
          </Link>
        </Card>
        <Card className="group gap-0 border-border bg-card/40 py-0 shadow-none transition-colors hover:bg-card/70">
          <Link href="/friends" className="relative block p-3.5">
            <ArrowUpRight className="absolute right-3 top-3 size-3.5 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
            <Badge
              variant="secondary"
              className="h-auto bg-transparent px-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              friends board
            </Badge>
            <CardTitle className="mt-1 text-sm font-semibold">
              Compare usage with friends
            </CardTitle>
            <CardDescription className="mt-1 text-xs leading-snug">
              Create a private board and see who is burning more this week.
            </CardDescription>
          </Link>
        </Card>
      </div>

      <div className="mt-8 space-y-6 border-t border-border pb-4 pt-6">
        <DeepDives />
        <Separator className="opacity-40" />
        <FaqSection />
      </div>
    </aside>
  );
}
