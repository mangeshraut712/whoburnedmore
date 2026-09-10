import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CLI_DRY_RUN,
  CLI_UNINSTALL_SYNC,
  NEVER_LEAVES,
  PAYLOAD_FIELDS,
} from "@/lib/site-content";

export const metadata = {
  title: "your data, exactly — whoburnedmore",
  description: "The CLI submits six aggregate numbers per day, tool, and model. Never prompts or code.",
};

export default function TrustPage() {
  return (
    <SiteChrome
      title="Your data, exactly"
      subtitle="The CLI submits six aggregate numbers per day, tool, and model. Never prompts, code, file names, project names, or generated text."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline">payload 6 fields</Badge>
        <Badge variant="outline">prompts never</Badge>
        <Badge variant="outline">code local</Badge>
        <Badge variant="outline">verify dry-run</Badge>
      </div>

      <CopyCommand command={CLI_DRY_RUN} className="mb-6" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">what leaves your machine</CardTitle>
            <CardDescription>
              For each day, tool, and model the CLI submits exactly six numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PAYLOAD_FIELDS.map((field) => (
                <li
                  key={field.id}
                  className="rounded-lg border border-border bg-background/40 px-3 py-2 font-mono text-sm"
                >
                  {field.label}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">never submitted</CardTitle>
            <CardDescription>See for yourself before sending anything.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Never: {NEVER_LEAVES.join(", ")}, or anything you typed or generated.</p>
            <p>
              <code className="text-foreground">{CLI_DRY_RUN}</code> prints the exact payload and
              exits.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">how it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Coding agents keep local usage logs on your machine. The CLI reads those logs locally,
              aggregates them into daily totals, and submits only the totals.
            </p>
            <p>
              Submissions pass server-side sanity checks — plausible volumes, consistent math, no
              future dates — before they count.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">background sync</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Optional, and offered — never silently installed. It re-runs the same aggregation
              every 15 minutes so your stats stay live.
            </p>
            <p>
              Remove it anytime: <code className="text-foreground">{CLI_UNINSTALL_SYNC}</code>
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/install">install safely</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteChrome>
  );
}
