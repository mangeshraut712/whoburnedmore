import React from "react";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "ccusage vs tokscale vs whoburnedmore",
  description:
    "Pick a local reader, a spend estimator, or a public token leaderboard — they solve different jobs.",
};

const ROWS = [
  { job: "Local multi-tool totals", pick: "ccusage or whoburnedmore --local" },
  { job: "Compare yourself to other builders", pick: "whoburnedmore public board" },
  { job: "Private friends / team race", pick: "whoburnedmore --board / --org" },
  { job: "Shareable profile + cards", pick: "whoburnedmore /u/handle + studio" },
  { job: "One-off spend guess without logs", pick: "a calculator, not a log reader" },
] as const;

export default function CompareGuidePage() {
  return (
    <GuideArticle
      title="ccusage vs tokscale vs whoburnedmore"
      subtitle="Same question — how much did I burn? — three different answers depending on whether you want local stats, a guess, or a ranked board."
    >
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">the short version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            ccusage is a local parser. tokscale-style calculators estimate spend from rates you
            type in. whoburnedmore starts from local logs, then optionally publishes daily
            aggregates so you can rank, follow friends, and share a profile.
          </p>
          <p>
            None of these should send prompts or source. On this stack,{" "}
            <code className="text-foreground">--dry-run</code> prints the exact six-field payload
            before anything is submitted.
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border bg-card/50 shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>If you need…</TableHead>
              <TableHead>Use</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.job}>
                <TableCell>{row.job}</TableCell>
                <TableCell>{row.pick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </GuideArticle>
  );
}
