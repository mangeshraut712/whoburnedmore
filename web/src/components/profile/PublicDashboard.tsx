import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { formatTokens, formatUSD } from "@/lib/contracts";
import { formatMultiple, formatShare, type PublicProfileView } from "@/lib/public-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileCardPreview } from "@/components/studio/ProfileCardPreview";
import { BurnBars } from "./BurnBars";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function RankChip({ label, rank }: { label: string; rank: number }) {
  return (
    <Badge variant="outline" className="gap-1 font-normal">
      <span className="text-primary">#{rank}</span>
      <span className="text-muted-foreground">{label}</span>
    </Badge>
  );
}

export function PublicDashboard({
  view,
  spark,
}: {
  view: PublicProfileView;
  spark: number[];
}) {
  const toolTotal = view.byTool.reduce((sum, tool) => sum + tool.tokens, 0);
  const weekdayPeak = Math.max(...view.weekdayTokens, 1);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 ring-1 ring-border">
              <AvatarImage src={view.avatarUrl || undefined} alt="" />
              <AvatarFallback>{view.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{view.displayName}</CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>@{view.handle}</span>
                {view.githubHandle && (
                  <a
                    href={`https://github.com/${view.githubHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    github
                  </a>
                )}
                {view.xHandle && (
                  <a
                    href={`https://x.com/${view.xHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    @{view.xHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <RankChip label="daily" rank={view.ranks.daily} />
            <RankChip label="weekly" rank={view.ranks.weekly} />
            <RankChip label="all-time" rank={view.ranks.allTime} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              lifetime burn
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-3xl font-bold text-primary tnum">
                {formatTokens(view.lifetimeTokens)}
              </span>
              <span className="font-mono text-lg text-foreground tnum">
                {formatUSD(view.lifetimeCostUSD)}
              </span>
              <span className="text-sm text-muted-foreground">
                · {view.activeDays} active days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CompareStat
              label="your burn"
              value={`${formatMultiple(view.vsAverage.tokenMultiple)} theirs`}
              hint={`avg ${formatTokens(view.lifetimeTokens / Math.max(view.vsAverage.tokenMultiple, 0.1))}`}
            />
            <CompareStat
              label="your spend"
              value={`${formatMultiple(view.vsAverage.costMultiple)} theirs`}
              hint={`avg ${formatUSD(view.lifetimeCostUSD / Math.max(view.vsAverage.costMultiple, 0.1))}`}
            />
            <CompareStat
              label="your rank"
              value={view.vsAverage.percentileLabel}
              hint={`#${view.ranks.allTime} of ${view.ranks.of}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MiniStat label="today" value={formatTokens(view.todayTokens)} hint={formatUSD(view.todayCostUSD)} />
            <MiniStat label="this week" value={formatTokens(view.weekTokens)} hint={formatUSD(view.weekCostUSD)} />
            <MiniStat label="messages" value={view.messageCount.toLocaleString()} hint="aggregate turns" />
            <MiniStat
              label="subagent share"
              value={`${Math.round(view.subagentShare * 100)}%`}
              hint="delegated tokens"
            />
            <MiniStat label="avg / day" value={formatTokens(view.avgDailyTokens)} hint="lifetime pace" />
            <MiniStat
              label="streak"
              value={`${view.streakDays}d`}
              hint="consecutive coded days"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardContent className="pt-6">
          <BurnBars daily={view.daily} spark={spark} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">tool share</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {view.byTool.map((tool) => (
              <div key={tool.tool}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{tool.tool.replace(/-code|-cli/g, "")}</span>
                  <span className="font-mono text-muted-foreground">
                    {formatShare(tool.tokens, toolTotal)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: formatShare(tool.tokens, toolTotal) }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">by model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {view.byModel.map((model) => (
              <div key={model.model} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{model.model}</span>
                <span className="shrink-0 font-mono text-muted-foreground">
                  {formatTokens(model.tokens)} · {formatUSD(model.costUSD)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">weekday pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-24 items-end gap-2">
              {view.weekdayTokens.map((tokens, index) => (
                <div key={WEEKDAYS[index]} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-primary/70"
                    style={{ height: `${Math.max(8, (tokens / weekdayPeak) * 100)}%` }}
                  />
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {WEEKDAYS[index]}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Every number here is an aggregate your CLI submitted — never prompts, code, or file
              names.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">tool calls + skills</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {view.toolCalls.map((item) => (
                <div key={item.name} className="flex justify-between gap-2">
                  <span>{item.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {formatTokens(item.tokens)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {view.skills.map((item) => (
                <div key={item.name} className="flex justify-between gap-2">
                  <span>{item.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {formatTokens(item.tokens)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">share your burn</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Official share cards plus a studio for custom shapes.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/studio?handle=${encodeURIComponent(view.handle)}`}>
              <Flame className="size-3.5" />
              open card studio
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ProfileCardPreview
            handle={view.handle}
            displayName={view.displayName}
            rank={view.ranks.allTime}
            totalTokens={view.lifetimeTokens}
            totalCostUSD={view.lifetimeCostUSD}
            streakDays={view.streakDays}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CompareStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-semibold tnum">{value}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}
