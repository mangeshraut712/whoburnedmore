import type { LeaderboardEntry } from "@/lib/contracts";

export type Period = "daily" | "weekly" | "all";

export type HistoryDate = "today" | "yesterday" | "2 days ago" | "3 days ago";

export function historyFactor(date: HistoryDate): number {
  switch (date) {
    case "today":
      return 1;
    case "yesterday":
      return 0.86;
    case "2 days ago":
      return 0.74;
    case "3 days ago":
      return 0.61;
    default: {
      const _never: never = date;
      return _never;
    }
  }
}

export type RankedEntry = LeaderboardEntry & {
  sortTokens: number;
  sortCost: number;
  displayRank: number;
};

export function relativeActivity(iso?: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "coded just now";
  if (hours < 24) return `coded ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `coded ${days}d ago`;
}

export function rowTokens(
  entry: LeaderboardEntry,
  period: Period,
  historyDate: HistoryDate = "today",
): number {
  const scale = period === "daily" ? historyFactor(historyDate) : 1;
  switch (period) {
    case "daily":
      return Math.round(entry.todayTokens * scale);
    case "weekly":
      return Math.round(entry.spark7d.reduce((a, b) => a + b, 0) * 1_000_000);
    case "all":
      return entry.totalTokens;
    default: {
      const _never: never = period;
      return _never;
    }
  }
}

export function rowCost(
  entry: LeaderboardEntry,
  period: Period,
  historyDate: HistoryDate = "today",
): number {
  const tokens = rowTokens(entry, period, historyDate);
  switch (period) {
    case "daily":
    case "weekly":
      return entry.totalCostUSD * (tokens / Math.max(entry.totalTokens, 1));
    case "all":
      return entry.totalCostUSD;
    default: {
      const _never: never = period;
      return _never;
    }
  }
}
