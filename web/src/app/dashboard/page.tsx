import React from "react";
import Link from "next/link";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { ObservatoryStack } from "@/components/observatory/ObservatoryStack";
import { PublicDashboard } from "@/components/profile/PublicDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPublicProfile } from "@/lib/public-profile";
import { MOCK_PROFILE } from "@/lib/mock-data";

export const metadata = {
  title: "dashboard — whoburnedmore",
  description:
    "Your 1.0 burn dashboard plus 2.0 observatory telemetry: velocity, efficiency, circadian heat, and model routing.",
};

export default function DashboardPage() {
  const view = buildPublicProfile(MOCK_PROFILE.handle);

  return (
    <SiteChrome
      active="dashboard"
      title="dashboard"
      subtitle="Personal burn report from 1.0, plus observatory telemetry added in 2.0."
    >
      <Tabs defaultValue="burn" className="gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="burn">burn report</TabsTrigger>
            <TabsTrigger value="observatory">observatory</TabsTrigger>
          </TabsList>
          <Button asChild size="sm" variant="outline">
            <Link href="/studio">open card studio</Link>
          </Button>
        </div>
        <TabsContent value="burn">
          <PublicDashboard view={view} spark={MOCK_PROFILE.spark7d} />
        </TabsContent>
        <TabsContent value="observatory">
          <ObservatoryStack />
        </TabsContent>
      </Tabs>
    </SiteChrome>
  );
}
