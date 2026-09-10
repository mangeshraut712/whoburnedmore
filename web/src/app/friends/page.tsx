import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { FriendsBoard } from "@/components/friends/FriendsBoard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Private AI Token Leaderboards for Friends — whoburnedmore",
  description: "One command, one shared board. Everyone signs in — no anonymous rows.",
};

const STEPS = [
  { n: "1", title: "Sign in", body: "Your board stays tied to you." },
  { n: "2", title: "Share one command", body: "Friends run it to join." },
  { n: "3", title: "Compare", body: "Ranked once they sign in." },
] as const;

export default function FriendsPage() {
  return (
    <SiteChrome
      active="my friends"
      title="Start a leaderboard with friends."
      subtitle="One command, one shared board. Everyone signs in — no anonymous rows."
    >
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">friends board</CardTitle>
            <CardDescription>Only usage totals join the board.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyCommand command="npx whoburnedmore --board=CODE" />
            <ol className="space-y-3">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                    {step.n}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.body}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" size="sm">
              <Link href="/">See the open ranking.</Link>
            </Button>
          </CardContent>
        </Card>

        <div>
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              My friends
            </div>
            <p className="text-sm text-muted-foreground">A private board for your circle.</p>
          </div>
          <FriendsBoard />
        </div>
      </div>
    </SiteChrome>
  );
}
