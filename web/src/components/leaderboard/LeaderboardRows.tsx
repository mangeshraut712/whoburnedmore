"use client";

import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { formatTokens, formatUSD } from "@/lib/contracts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RankBadge, Sparkline } from "./RankBadge";
import { relativeActivity, type RankedEntry } from "./leaderboard-utils";

export function LeaderboardDesktopRows({ rows }: { rows: RankedEntry[] }) {
  return (
    <div className="hidden px-4 pb-4 pt-1 sm:px-5 lg:block lg:px-6 lg:pb-5">
      <div className="overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-border/70 hover:bg-transparent">
              {["#", "dev", "tokens", "cost", "streak", "top tool", "usage", "activity"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className={cn(
                      "h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                      h === "activity" && "text-right",
                    )}
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((entry) => (
              <TableRow
                key={entry.handle}
                className={cn(
                  "border-border/70",
                  entry.displayRank === 1 && "bg-primary/[0.08]",
                )}
              >
                <TableCell className="py-3">
                  <RankBadge rank={entry.displayRank} />
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/u/${encodeURIComponent(entry.handle)}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <Avatar className="size-9 ring-1 ring-border">
                      <AvatarImage
                        src={entry.avatarUrl || "https://github.com/ghost.png"}
                        alt=""
                      />
                      <AvatarFallback>
                        {entry.handle.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-[0.9375rem] font-semibold text-foreground">
                        {entry.displayName || entry.handle}
                      </span>
                      {entry.displayRank === 1 && (
                        <Badge className="rounded bg-primary/20 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-primary hover:bg-primary/20">
                          king
                        </Badge>
                      )}
                      {entry.displayRank === 2 && (
                        <Badge
                          variant="secondary"
                          className="rounded px-1.5 py-0 text-[9px] font-bold uppercase"
                        >
                          #2
                        </Badge>
                      )}
                      {entry.displayRank === 3 && (
                        <Badge
                          variant="secondary"
                          className="rounded px-1.5 py-0 text-[9px] font-bold uppercase"
                        >
                          #3
                        </Badge>
                      )}
                      </div>
                      {(entry.githubHandle || entry.xHandle) && (
                        <div className="mt-0.5 flex gap-2 text-[11px] text-muted-foreground">
                          {entry.githubHandle && <span>{entry.githubHandle}</span>}
                          {entry.xHandle && <span>@{entry.xHandle}</span>}
                        </div>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <span className="tnum font-mono text-base font-bold text-primary">
                    {formatTokens(entry.sortTokens)}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="tnum font-mono text-sm text-foreground">
                    {formatUSD(entry.sortCost)}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="inline-flex items-center gap-1 font-mono text-sm">
                    <Flame className="size-3.5 text-primary" />
                    {entry.streakDays}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="font-normal text-muted-foreground">
                    {(entry.topTool || "—").replace(/-code|-cli/g, "")}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Sparkline values={entry.spark7d} />
                </TableCell>
                <TableCell className="py-3 text-right text-xs text-muted-foreground">
                  {relativeActivity(entry.lastCodedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function LeaderboardMobileRows({ rows }: { rows: RankedEntry[] }) {
  return (
    <div className="space-y-2 px-4 pb-4 pt-1 sm:px-5 lg:hidden">
      {rows.map((entry) => (
        <Link
          key={entry.handle}
          href={`/u/${encodeURIComponent(entry.handle)}`}
          className={cn(
            "grid min-w-0 grid-cols-[minmax(2.4rem,auto)_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 transition-colors",
            entry.displayRank === 1
              ? "border-border bg-primary/[0.15] ring-1 ring-inset ring-primary/25 hover:bg-primary/[0.19]"
              : "border-border bg-card/30 hover:bg-card/50",
          )}
        >
          <RankBadge rank={entry.displayRank} />
          <Avatar className="size-9 ring-1 ring-border">
            <AvatarImage
              src={entry.avatarUrl || "https://github.com/ghost.png"}
              alt=""
            />
            <AvatarFallback>{entry.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-[0.9375rem] font-semibold">
              {entry.displayName || entry.handle}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {relativeActivity(entry.lastCodedAt)}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="tnum font-mono text-sm font-bold text-primary">
              {formatTokens(entry.sortTokens)}
            </div>
            <div className="tnum font-mono text-[11px] text-muted-foreground">
              {formatUSD(entry.sortCost)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
