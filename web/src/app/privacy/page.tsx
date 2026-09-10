import React from "react";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "privacy — whoburnedmore",
  description: "Privacy policy for whoburnedmore.",
};

export default function PrivacyPage() {
  return (
    <SiteChrome title="privacy" subtitle="What we collect and what we don't.">
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">published aggregates only</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            whoburnedmore collects optional published usage aggregates when you choose to join the
            public leaderboard.
          </p>
          <p className="rounded-lg border border-border bg-background/40 p-3">
            Prompts, source code, and chat history stay on your machine. Delist with{" "}
            <code className="text-foreground">private</code> or delete everything with{" "}
            <code className="text-foreground">remove</code>.
          </p>
        </CardContent>
      </Card>
    </SiteChrome>
  );
}
