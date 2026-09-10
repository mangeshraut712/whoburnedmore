import {
  TokenEfficiencyRatio,
  CircuitBreakerTelemetry,
  OrganizationSummary,
} from "./contracts";
import { MOCK_LEADERBOARD } from "./mock-data";

/**
 * Calculates Token Efficiency Ratio (TER) — linking AI token expenditure
 * directly to tangible software engineering outputs (PRs, commits, verified tests).
 */
export function calculateTokenEfficiency(
  totalTokens: number,
  prsMerged: number,
  commitsCount: number,
  testsPassed: number,
  cacheHitRate: number = 0.75,
): TokenEfficiencyRatio {
  const safeTokens = Math.max(totalTokens, 1_000_000);
  const safePrs = Math.max(prsMerged, 1);
  const safeCommits = Math.max(commitsCount, 1);

  const tokensPerPr = Math.round(safeTokens / safePrs);
  const tokensPerCommit = Math.round(safeTokens / safeCommits);

  // Efficiency formula:
  // Base score rewards high work output per million tokens burned,
  // multiplied by prompt cache optimization bonus.
  const workOutputUnits = prsMerged * 20 + commitsCount * 4 + testsPassed * 0.1;
  const rawScore = (workOutputUnits / (safeTokens / 1_000_000)) * 25 * (0.8 + cacheHitRate * 0.4);
  const efficiencyScore = Math.min(Math.max(Math.round(rawScore), 25), 98);

  let grade: "A+" | "A" | "B+" | "B" | "C" = "B";
  let status: TokenEfficiencyRatio["status"] = "Balanced";

  if (efficiencyScore >= 90) {
    grade = "A+";
    status = "Master Craftsman";
  } else if (efficiencyScore >= 80) {
    grade = "A";
    status = "High Velocity";
  } else if (efficiencyScore >= 65) {
    grade = "B+";
    status = "Balanced";
  } else if (efficiencyScore >= 50) {
    grade = "B";
    status = "Balanced";
  } else {
    grade = "C";
    status = "Context Bloated";
  }

  return {
    prsMerged,
    commitsCount,
    testsPassed,
    efficiencyScore,
    tokensPerPr,
    tokensPerCommit,
    grade,
    status,
  };
}

/**
 * Evaluates in-flight runaway subagent loop heuristics.
 */
export function evaluateCircuitBreaker(
  consecutiveNoChangeTurns: number,
  currentSessionCostUSD: number,
  budgetCeilingUSD: number = 50.0,
): CircuitBreakerTelemetry {
  let status: "nominal" | "warning" | "tripped" = "nominal";
  let autoHaltTrippedAt: string | null = null;

  if (consecutiveNoChangeTurns >= 8 || currentSessionCostUSD >= budgetCeilingUSD) {
    status = "tripped";
    autoHaltTrippedAt = new Date().toISOString();
  } else if (consecutiveNoChangeTurns >= 5 || currentSessionCostUSD >= budgetCeilingUSD * 0.8) {
    status = "warning";
  }

  return {
    status,
    activeSubagents: status === "tripped" ? 0 : 3,
    recursionDepth: consecutiveNoChangeTurns,
    burnSpeedTokensPerSec: status === "tripped" ? 0 : 4250,
    budgetCeilingUSD,
    currentSessionCostUSD,
    autoHaltTrippedAt,
    consecutiveNoChangeTurns,
  };
}

export const MOCK_ORGANIZATION: OrganizationSummary = {
  slug: "codex-build-house",
  name: "Codex Build House (SF)",
  type: "hackerhouse",
  memberCount: 14,
  totalTokens: 2_450_000_000,
  totalCostUSD: 16_840,
  topTool: "claude-code",
  topModel: "claude-3-7-sonnet",
  members: MOCK_LEADERBOARD,
};
