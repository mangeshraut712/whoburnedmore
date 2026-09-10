import React from "react";
import Link from "next/link";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_STATS } from "@/lib/mock-data";
import { formatTokens } from "@/lib/contracts";

export const metadata = {
  title: "AI Coding Token Leaderboard: Who Burned Most — whoburnedmore",
  description:
    "The public board ranks developers by cumulative tokens across Claude Code, Codex, Gemini CLI, Cursor and more.",
};

export default function LeaderboardGuidePage() {
  return (
    <GuideArticle
      title="How the AI coding token leaderboard works"
      subtitle="Rank is raw compute volume — the sum of tokens across every tool the CLI detected on that machine."
    >
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">what the rank means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Every public row is a developer who ran the command and chose to publish. Ranking is
            cumulative token count: input plus output, with cached tokens noted and included. Cost
            is informational and can differ from provider billing.
          </p>
          <p>
            The live board currently indexes {SITE_STATS.indexedDevs} developers and{" "}
            {formatTokens(SITE_STATS.combinedBurn)} combined burn. Filter by tool, search a handle,
            or open a past daily snapshot from the board toolbar.
          </p>
          <Button asChild size="sm">
            <Link href="/">open the live board</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">how you get on it</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Run the command so it can scan local agent logs.</p>
          <p>2. Review the local summary — or print it with --dry-run.</p>
          <p>3. Sign in and add a handle when you want the row to be public.</p>
          <p>
            Claiming replaces an anonymous slug with <code className="text-foreground">/u/your-handle</code>{" "}
            so friends can find you. Stay off the board with{" "}
            <code className="text-foreground">--local</code> or{" "}
            <code className="text-foreground">private</code>.
          </p>
        </CardContent>
      </Card>
    </GuideArticle>
  );
}
