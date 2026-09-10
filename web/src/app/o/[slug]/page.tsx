import React from "react";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { TeamArenaView } from "@/components/observatory/TeamArenaView";

export const metadata = {
  title: "team board — whoburnedmore",
  description:
    "Free internal leaderboard for your company or friends to compare AI usage.",
};

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <SiteChrome
      active="my friends"
      title={`${slug} board`}
      subtitle="Compare multi-developer token burn on a private or org board."
    >
      <TeamArenaView slug={slug} />
    </SiteChrome>
  );
}
