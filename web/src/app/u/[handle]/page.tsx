import React from "react";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { PublicDashboard } from "@/components/profile/PublicDashboard";
import { HANDLE_PATTERN } from "@/lib/profile-resolver";
import { buildPublicProfile } from "@/lib/public-profile";
import { MOCK_LEADERBOARD, MOCK_PROFILE } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const view = buildPublicProfile(handle);
  return {
    title: `${view.displayName} (@${handle}): AI Token Usage — whoburnedmore`,
    description: `Lifetime burn ${view.lifetimeTokens} tokens on the public AI coding token leaderboard.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!HANDLE_PATTERN.test(handle)) notFound();

  const view = buildPublicProfile(handle);
  const entry = MOCK_LEADERBOARD.find((row) => row.handle === handle);
  const spark = entry?.spark7d ?? MOCK_PROFILE.spark7d;

  return (
    <SiteChrome>
      <PublicDashboard view={view} spark={spark} />
    </SiteChrome>
  );
}
