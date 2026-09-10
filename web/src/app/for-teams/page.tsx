import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { TeamArenaView } from "@/components/observatory/TeamArenaView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "AI Token Leaderboards for Teams — whoburnedmore",
  description: "Free internal leaderboard for your company, hackathon, or hacker house.",
};

const TEAM_POINTS = [
  "A private team board on its own slug, instantly — no approval wait.",
  "Join by invite link, join code, or verified email domain.",
  "Admin controls for members, access, visibility, and adoption.",
] as const;

export default function ForTeamsPage() {
  return (
    <SiteChrome
      title="Your team's own AI token-burn board."
      subtitle="One board for the whole team — roles, invites, visibility, and live roster rankings."
    >
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border bg-card/50 shadow-none lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">team boards</CardTitle>
            <CardDescription>companies, hackathons, hacker houses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyCommand command="npx whoburnedmore@latest --org your-team" />
            <ul className="space-y-2 text-sm text-muted-foreground">
              {TEAM_POINTS.map((point) => (
                <li key={point}>— {point}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/o/codex-build-house">open demo board</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/install">install</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <TeamArenaView slug="codex-build-house" />
        </div>
      </div>
    </SiteChrome>
  );
}
