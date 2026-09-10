import React from "react";
import { LandingSidebar } from "@/components/landing/LandingSidebar";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export default function HomePage() {
  return (
    <div className="fixed inset-0 bg-background">
      <section className="relative h-full">
        <div className="glow-burn pointer-events-none absolute left-0 top-0 h-80 w-1/2 opacity-75" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />

        <div
          data-landing-layout="true"
          className="relative flex h-dvh min-h-0 flex-col overflow-y-auto bg-background lg:grid lg:grid-cols-[minmax(18rem,32vw)_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[minmax(19rem,30vw)_minmax(0,1fr)]"
        >
          <LandingSidebar active="leaderboard" />

          <div
            data-landing-board="true"
            className="board-surface relative z-10 min-h-0 flex-none overflow-visible max-lg:mx-0 max-lg:rounded-none max-lg:border-0 max-lg:shadow-none lg:h-full lg:flex-1 lg:overflow-y-auto scrollbar-slim"
          >
            <LeaderboardTable />
          </div>
        </div>
      </section>
    </div>
  );
}
