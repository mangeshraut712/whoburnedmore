import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { formatTokens, formatUSD } from "@/lib/contracts";
import { MOCK_LEADERBOARD, SITE_STATS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "State of AI coding token usage — whoburnedmore",
  description: "Snapshot of combined burn, estimated cost, and who is leading the public board.",
};

export default function StateOfUsagePage() {
  const topTools = MOCK_LEADERBOARD.reduce<Record<string, number>>((acc, row) => {
    const tool = (row.topTool || "other").replace(/-code|-cli/g, "");
    acc[tool] = (acc[tool] ?? 0) + row.todayTokens;
    return acc;
  }, {});
  const toolRows = Object.entries(topTools).sort((a, b) => b[1] - a[1]);

  return (
    <SiteChrome
      title="State of AI coding usage"
      subtitle="A public snapshot of how much the indexed board is burning right now."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "combined burn", value: formatTokens(SITE_STATS.combinedBurn) },
          { label: "estimated cost", value: formatUSD(SITE_STATS.estimatedCost) },
          { label: "burned today", value: formatTokens(SITE_STATS.burnedToday) },
          { label: "indexed devs", value: SITE_STATS.indexedDevs.toLocaleString() },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-2xl font-semibold tnum">{stat.value}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">today’s top tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {toolRows.map(([tool, tokens]) => (
              <div key={tool} className="flex justify-between">
                <span className="capitalize">{tool}</span>
                <span className="font-mono text-muted-foreground">{formatTokens(tokens)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">how to read this</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              These totals are published aggregates from developers who chose to sync. They are not
              a census of every AI coding session on earth, and cost is estimated at public API
              rates.
            </p>
            <Button asChild size="sm">
              <Link href="/">see the live leaderboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteChrome>
  );
}
