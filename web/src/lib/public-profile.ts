import {
  formatTokens,
  formatUSD,
  type DailyPoint,
  type LeaderboardEntry,
  type ToolBreakdown,
  type UserProfile,
} from "./contracts";
import { MOCK_LEADERBOARD, MOCK_PROFILE, SITE_STATS } from "./mock-data";

export type PublicRanks = {
  daily: number;
  weekly: number;
  allTime: number;
  of: number;
};

export type NamedBurn = {
  name: string;
  tokens: number;
};

export type PublicProfileView = {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  githubHandle: string | null;
  xHandle: string | null;
  bio: string | null;
  claimed: boolean;
  verified: boolean;
  ranks: PublicRanks;
  lifetimeTokens: number;
  lifetimeCostUSD: number;
  activeDays: number;
  streakDays: number;
  todayTokens: number;
  todayCostUSD: number;
  weekTokens: number;
  weekCostUSD: number;
  avgDailyTokens: number;
  messageCount: number;
  subagentShare: number;
  vsAverage: {
    tokenMultiple: number;
    costMultiple: number;
    percentileLabel: string;
  };
  daily: DailyPoint[];
  byTool: ToolBreakdown[];
  byModel: UserProfile["byModel"];
  weekdayTokens: number[];
  toolCalls: NamedBurn[];
  skills: NamedBurn[];
};

function weeklyTokens(entry: LeaderboardEntry): number {
  return Math.round(entry.spark7d.reduce((sum, point) => sum + point, 0) * 1_000_000);
}

function rankBy(
  entries: LeaderboardEntry[],
  score: (entry: LeaderboardEntry) => number,
  handle: string,
): number {
  const ordered = [...entries].sort((a, b) => score(b) - score(a));
  const index = ordered.findIndex((entry) => entry.handle === handle);
  return index === -1 ? entries.length : index + 1;
}

export function ranksForHandle(handle: string): PublicRanks {
  const published = MOCK_LEADERBOARD.find((entry) => entry.handle === handle);
  return {
    daily: rankBy(MOCK_LEADERBOARD, (entry) => entry.todayTokens, handle),
    weekly: rankBy(MOCK_LEADERBOARD, weeklyTokens, handle),
    allTime: published?.rank ?? rankBy(MOCK_LEADERBOARD, (entry) => entry.totalTokens, handle),
    of: SITE_STATS.indexedDevs,
  };
}

function scaleSeries(values: number[], targetTotal: number): number[] {
  const current = values.reduce((sum, value) => sum + value, 0);
  if (current <= 0) return values.map(() => 0);
  return values.map((value) => Math.round((value / current) * targetTotal));
}

function weekdayTotals(profile: UserProfile): number[] {
  const days = [0, 0, 0, 0, 0, 0, 0];
  for (const block of profile.hourlyGrid) {
    days[block.dayOfWeek] += block.tokens;
  }
  return days;
}

function percentileLabel(rank: number, of: number): string {
  const pct = Math.max(1, Math.round((rank / Math.max(of, 1)) * 100));
  return `top ${pct}%`;
}

export function buildPublicProfile(handle: string): PublicProfileView {
  const entry = MOCK_LEADERBOARD.find((row) => row.handle === handle);
  const base = MOCK_PROFILE;
  const tokens = entry?.totalTokens ?? base.totals.tokens;
  const cost = entry?.totalCostUSD ?? base.totals.costUSD;
  const today = entry?.todayTokens ?? base.pace?.todayTokens ?? 0;
  const week = entry ? weeklyTokens(entry) : base.spark7d.reduce((a, b) => a + b, 0) * 1_000_000;
  const tokenScale = tokens / Math.max(base.totals.tokens, 1);
  const ranks = ranksForHandle(handle);
  const avgTokens = SITE_STATS.combinedBurn / SITE_STATS.indexedDevs;
  const avgCost = SITE_STATS.estimatedCost / SITE_STATS.indexedDevs;
  const daily = scaleSeries(
    base.daily.map((point) => point.tokens),
    week || tokens * 0.08,
  ).map((value, index) => ({
    date: base.daily[index]?.date ?? `d${index}`,
    tokens: value,
    costUSD: Number(((value / Math.max(tokens, 1)) * cost).toFixed(2)),
  }));

  return {
    handle,
    displayName: entry?.displayName || (handle === base.handle ? base.displayName : handle),
    avatarUrl: entry?.avatarUrl ?? base.avatarUrl,
    githubHandle: entry?.githubHandle ?? (handle === base.handle ? base.githubHandle ?? null : handle),
    xHandle: entry?.xHandle ?? (handle === base.handle ? base.xHandle ?? null : null),
    bio: handle === base.handle ? base.bio ?? null : null,
    claimed: entry?.claimed ?? true,
    verified: entry?.verified ?? false,
    ranks,
    lifetimeTokens: tokens,
    lifetimeCostUSD: cost,
    activeDays: Math.max(7, Math.round(base.totals.days * Math.min(tokenScale, 3))),
    streakDays: entry?.streakDays ?? base.totals.streakDays,
    todayTokens: today,
    todayCostUSD: Number(((today / Math.max(tokens, 1)) * cost).toFixed(2)),
    weekTokens: week,
    weekCostUSD: Number(((week / Math.max(tokens, 1)) * cost).toFixed(2)),
    avgDailyTokens: Math.round(tokens / Math.max(base.totals.days, 1)),
    messageCount: Math.round((base.agent?.messageCount ?? 0) * Math.max(tokenScale, 0.2)),
    subagentShare: base.agent?.subagentShare ?? 0.19,
    vsAverage: {
      tokenMultiple: roundMultiple(tokens / Math.max(avgTokens, 1)),
      costMultiple: roundMultiple(cost / Math.max(avgCost, 1)),
      percentileLabel: percentileLabel(ranks.allTime, ranks.of),
    },
    daily,
    byTool: base.byTool.map((tool) => ({
      ...tool,
      tokens: Math.round(tool.tokens * tokenScale),
      costUSD: Number((tool.costUSD * tokenScale).toFixed(2)),
    })),
    byModel: base.byModel.map((model) => ({
      ...model,
      tokens: Math.round(model.tokens * tokenScale),
      costUSD: Number((model.costUSD * tokenScale).toFixed(2)),
    })),
    weekdayTokens: weekdayTotals(base).map((value) => Math.round(value * tokenScale)),
    toolCalls: [
      { name: "Bash", tokens: Math.round(tokens * 0.42) },
      { name: "Read", tokens: Math.round(tokens * 0.11) },
      { name: "Write", tokens: Math.round(tokens * 0.09) },
      { name: "Agent", tokens: Math.round(tokens * 0.07) },
    ],
    skills: [
      { name: "code review", tokens: Math.round(tokens * 0.08) },
      { name: "plan", tokens: Math.round(tokens * 0.05) },
      { name: "tdd", tokens: Math.round(tokens * 0.03) },
    ],
  };
}

function roundMultiple(n: number): number {
  if (n >= 1) return Number(n.toFixed(1));
  return Number(n.toFixed(2));
}

export function formatMultiple(n: number): string {
  return `${n >= 1 ? n.toFixed(1) : n.toFixed(2)}×`;
}

export function formatShare(tokens: number, total: number): string {
  if (total <= 0) return "0%";
  return `${((tokens / total) * 100).toFixed(1)}%`;
}

export { formatTokens, formatUSD };
