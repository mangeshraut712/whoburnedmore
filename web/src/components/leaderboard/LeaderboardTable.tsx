"use client";

import React, { useMemo, useState } from "react";
import { MOCK_LEADERBOARD } from "@/lib/mock-data";
import {
  LeaderboardDesktopRows,
  LeaderboardMobileRows,
} from "./LeaderboardRows";
import { LeaderboardToolbar } from "./LeaderboardToolbar";
import {
  rowCost,
  rowTokens,
  type HistoryDate,
  type Period,
  type RankedEntry,
} from "./leaderboard-utils";

export const LeaderboardTable: React.FC = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [toolFilter, setToolFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [historyDate, setHistoryDate] = useState<HistoryDate>("today");

  const rows = useMemo((): RankedEntry[] => {
    const q = searchQuery.trim().toLowerCase();
    const scored: RankedEntry[] = [];

    for (const entry of MOCK_LEADERBOARD) {
      const tool = entry.topTool || "";
      if (toolFilter !== "all" && tool.indexOf(toolFilter) === -1) continue;
      if (
        q &&
        entry.handle.toLowerCase().indexOf(q) === -1 &&
        entry.displayName.toLowerCase().indexOf(q) === -1
      ) {
        continue;
      }
      scored.push({
        ...entry,
        sortTokens: rowTokens(entry, period, historyDate),
        sortCost: rowCost(entry, period, historyDate),
        displayRank: 0,
      });
    }

    scored.sort((a, b) => b.sortTokens - a.sortTokens);
    for (let i = 0; i < scored.length; i += 1) {
      scored[i]!.displayRank = i + 1;
    }
    return scored;
  }, [period, toolFilter, searchQuery, historyDate]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <LeaderboardToolbar
        period={period}
        onPeriodChange={setPeriod}
        toolFilter={toolFilter}
        onToolFilterChange={setToolFilter}
        onSearchChange={setSearchQuery}
        historyDate={historyDate}
        onHistoryDateChange={setHistoryDate}
      />
      {rows.length === 0 ? (
        <p className="px-6 py-10 text-sm text-muted-foreground">
          No builders match that filter. Clear search or pick another tool.
        </p>
      ) : (
        <>
          <LeaderboardDesktopRows rows={rows} />
          <LeaderboardMobileRows rows={rows} />
        </>
      )}
    </div>
  );
};
