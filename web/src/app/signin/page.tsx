import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CLI_LOCAL } from "@/lib/site-content";

export const metadata = {
  title: "sign in — whoburnedmore",
  description: "Sign in with GitHub or Google from the CLI, or stay local.",
};

export default function SignInPage() {
  return (
    <SiteChrome
      title="sign in"
      subtitle="The default CLI run opens a short GitHub or Google approval in your browser."
    >
      <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle>GitHub or Google</CardTitle>
            <CardDescription>
              Production binds your machine through the CLI — no password form on this site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyCommand />
            <p className="text-xs text-muted-foreground">
              After you approve the code, your burn lands under your handle and this dashboard
              unlocks.
            </p>
            <Button asChild>
              <Link href="/dashboard">preview a signed-in dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle>stay offline</CardTitle>
            <CardDescription>
              {CLI_LOCAL} builds the same dashboard on your machine and never signs you in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyCommand command={CLI_LOCAL} />
            <Button asChild variant="outline">
              <Link href="/install">install instructions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteChrome>
  );
}
