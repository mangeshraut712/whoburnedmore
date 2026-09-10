import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SiteChrome title="page not found" subtitle="That route is not on the board.">
      <div className="max-w-md space-y-4">
        <p className="text-sm text-muted-foreground">
          The public leaderboard, card studio, and dashboard are still here.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">leaderboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/studio">card studio</Link>
          </Button>
        </div>
      </div>
    </SiteChrome>
  );
}
