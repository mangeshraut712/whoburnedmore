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
  title: "ccusage Alternative With a Leaderboard — whoburnedmore",
  description:
    "ccusage reads local logs. whoburnedmore uses the same class of local totals, then adds a public board, profile, and friends boards.",
};

const ROWS = [
  { feature: "Local log parsing", ccusage: "core", wbm: "same local logs" },
  { feature: "Token + cost breakdown", ccusage: "yes", wbm: "yes" },
  { feature: "Public leaderboard", ccusage: "—", wbm: "whoburnedmore.com" },
  { feature: "Claimable profile", ccusage: "—", wbm: "/u/handle" },
  { feature: "Friends / team boards", ccusage: "—", wbm: "--board / --org" },
  { feature: "Share cards", ccusage: "—", wbm: "studio + PNG/SVG" },
  { feature: "Offline mode", ccusage: "always", wbm: "--local" },
] as const;

export default function CcusageGuidePage() {
  return (
    <GuideArticle
      title="ccusage alternative with a leaderboard"
      subtitle="ccusage shows your numbers. whoburnedmore shows your numbers next to everyone else — and lets you share them."
    >
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">what each tool is for</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            ccusage is a local reader. It is excellent when you only want a terminal breakdown.
            whoburnedmore reads the same kind of on-disk usage logs, then adds a public board, a
            claimable profile, friends and org boards, and share cards.
          </p>
          <p>
            If you never want a network call, both tools can stay local. Use{" "}
            <code className="text-foreground">npx whoburnedmore --local</code> for the offline
            dashboard.
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border bg-card/50 shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Feature</TableHead>
              <TableHead>ccusage</TableHead>
              <TableHead>whoburnedmore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.feature}>
                <TableCell>{row.feature}</TableCell>
                <TableCell className="text-muted-foreground">{row.ccusage}</TableCell>
                <TableCell>{row.wbm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </GuideArticle>
  );
}
