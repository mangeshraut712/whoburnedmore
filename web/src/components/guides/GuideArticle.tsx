import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GuideArticle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <SiteChrome title={title} subtitle={subtitle}>
      <div className="mx-auto max-w-3xl space-y-6">
        {children}
        <Card className="border-border bg-card/50 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">see your own numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyCommand />
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/install">install guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">live leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteChrome>
  );
}
