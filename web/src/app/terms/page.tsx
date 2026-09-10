import React from "react";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "terms — whoburnedmore",
  description: "Terms of use for whoburnedmore.",
};

export default function TermsPage() {
  return (
    <SiteChrome title="terms" subtitle="Free open-source tool. Use responsibly.">
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">use of the board</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc space-y-2 pl-5">
            <li>whoburnedmore is free and open source (MIT).</li>
            <li>Rankings and cost estimates are informational and may be approximate.</li>
            <li>Do not submit falsified usage data.</li>
            <li>Accounts that abuse verification may be delisted.</li>
          </ul>
        </CardContent>
      </Card>
    </SiteChrome>
  );
}
