import { describe, expect, it } from "vitest";
import { buildPublicProfile, ranksForHandle } from "../lib/public-profile";
import { historyFactor, rowTokens } from "../components/leaderboard/leaderboard-utils";
import { MOCK_LEADERBOARD } from "../lib/mock-data";

describe("public profile 1.0 dashboard", () => {
  it("keeps mangeshraut712 lifetime totals aligned with the board", () => {
    const view = buildPublicProfile("mangeshraut712");
    expect(view.lifetimeTokens).toBe(428_650_000);
    expect(view.lifetimeCostUSD).toBe(2_840.5);
    expect(view.ranks.allTime).toBe(9);
    expect(view.vsAverage.tokenMultiple).toBeGreaterThan(0);
  });

  it("ranks daily vs all-time independently", () => {
    const ranks = ranksForHandle("mangeshraut712");
    expect(ranks.daily).toBeGreaterThan(0);
    expect(ranks.allTime).toBe(9);
    expect(ranks.of).toBe(306);
  });
});

describe("leaderboard history snapshots", () => {
  it("scales daily tokens for past boards", () => {
    const king = MOCK_LEADERBOARD[0]!;
    expect(historyFactor("today")).toBe(1);
    expect(rowTokens(king, "daily", "yesterday")).toBeLessThan(king.todayTokens);
    expect(rowTokens(king, "all", "yesterday")).toBe(king.totalTokens);
  });
});
