import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CLI_DRY_RUN, CLI_LOCAL, TRACKED_TOOLS } from "@/lib/site-content";

export const metadata = {
  title: "AI Coding Token Tracker CLI: Install Guide — whoburnedmore",
  description:
    "Run one command to read local AI coding usage, preview the payload, and optionally join the leaderboard.",
};

const BEFORE_YOU_RUN = [
  {
    q: "Do I need to install anything?",
    a: "No. npx downloads and runs the command for you.",
  },
  {
    q: "Do I need an account?",
    a: "To publish your rank, yes — the default run signs you in with GitHub or Google. Stay offline with --local and decline the optional publish offer.",
  },
  {
    q: "What leaves my machine?",
    a: "Usage totals: token counts, estimated cost, dates, tools, and models. Not prompts, code, file names, or project names.",
  },
  {
    q: "How do I keep it local?",
    a: `${CLI_LOCAL} builds a dashboard on your machine. Decline the optional publish offer to skip sign-in and the leaderboard.`,
  },
] as const;

export default function InstallPage() {
  return (
    <SiteChrome
      active="install"
      title="Before you run it"
      subtitle="One command reads your local AI coding usage, totals your burn, and opens a dashboard."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card className="border-border bg-card/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-0">
                {BEFORE_YOU_RUN.map((item, index) => (
                  <AccordionItem key={item.q} value={`item-${index}`} className="border-border/80">
                    <AccordionTrigger className="text-sm hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Here is how this works</CardTitle>
              <CardDescription>
                Needs Node.js 20 or newer. Works on macOS, Linux, and Windows. Tracks{" "}
                {TRACKED_TOOLS.slice(0, 5).join(", ")} and 20+ other agents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  n: "1",
                  title: "Run the command",
                  body: "Paste npx whoburnedmore into your terminal.",
                },
                {
                  n: "2",
                  title: "See your numbers",
                  body: `You get tokens, estimated cost, tool breakdowns, and rank. Use ${CLI_DRY_RUN} to preview the summary first.`,
                },
                {
                  n: "3",
                  title: "Claim your spot",
                  body: "Sign in and add a handle when you want to be public. Until then, your name is not on the leaderboard.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm text-primary">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
              <CopyCommand />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border bg-card/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Your work stays local</CardTitle>
              <CardDescription>
                We do not send prompts, code, file names, project names, or anything you typed.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border bg-card/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">See it first</CardTitle>
              <CardDescription>
                Use <code className="text-foreground">--dry-run</code> to print the exact summary
                before sending anything.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CopyCommand command={CLI_DRY_RUN} />
            </CardContent>
          </Card>
          <Card className="border-border bg-card/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Public is a choice</CardTitle>
              <CardDescription>
                Add a handle when you want to show up on the board. You can keep your dashboard
                private.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href="/trust">privacy details</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">see the live leaderboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteChrome>
  );
}
