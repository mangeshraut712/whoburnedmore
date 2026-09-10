import React from "react";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRACKED_TOOLS } from "@/lib/site-content";

export const metadata = {
  title: "How to Check Your AI Coding Token Usage — whoburnedmore",
  description:
    "One command reads local logs from Claude Code, Codex, Gemini CLI, Cursor and more, then totals tokens and estimated cost.",
};

export default function CheckUsageGuidePage() {
  return (
    <GuideArticle
      title="How to check your AI coding token usage"
      subtitle="Every coding agent already logs usage locally. The trick is reading all of those logs at once."
    >
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">quick answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Run <code className="text-foreground">npx whoburnedmore</code>. It reads the usage logs
            your agents already keep, then totals tokens and estimated API-rate cost across every
            tool it finds. Only those totals ever leave the machine.
          </p>
          <p>
            Built-in <code className="text-foreground">/usage</code> and{" "}
            <code className="text-foreground">/status</code> commands answer “how much in this
            window.” This command answers “how much, everywhere, ever.”
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">why the number is scattered</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Claude Code, Codex, Gemini CLI, Copilot, Cursor and the rest each keep their own hidden
          log folder. There is no single native screen for a monthly total. Supported readers
          include {TRACKED_TOOLS.join(", ")}, plus other agents that keep local usage logs.
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">how cost is estimated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Tokens are converted with each model’s public per-token price. Input and output are
            priced separately, then summed. On a flat-rate plan this is what the same usage would
            cost at API rates — not your billed invoice.
          </p>
          <p>
            Prove the payload with <code className="text-foreground">--dry-run</code>, or keep
            everything on disk with <code className="text-foreground">--local</code>.
          </p>
        </CardContent>
      </Card>
    </GuideArticle>
  );
}
