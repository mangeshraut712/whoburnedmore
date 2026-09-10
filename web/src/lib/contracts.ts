export interface UserProfileTotals {
  tokens: number;
  costUSD: number;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  days: number;
  streakDays: number;
  longestStreakDays?: number;
}

export interface DailyPoint {
  date: string;
  tokens: number;
  costUSD: number;
  inputTokens?: number;
  outputTokens?: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
}

export interface ToolBreakdown {
  tool: string;
  tokens: number;
  costUSD: number;
}

export interface ModelBreakdown {
  model: string;
  tokens: number;
  costUSD: number;
}

export interface CacheEfficiency {
  hitRate: number; // 0..1
  savingsUSD: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}

export interface VelocityPace {
  todayTokens: number;
  todayCostUSD: number;
  projectedTodayCostUSD: number;
  avgDailyCostUSD: number;
  avgDailyTokens: number;
  currentBurnRateTokensPerSec: number;
  currentBurnRateCostPerHour: number;
}

export interface SubagentTelemetry {
  messageCount: number;
  subagentMessages: number;
  subagentTokens: number;
  totalTokens: number;
  subagentShare: number; // 0..1
  userMessageCount?: number;
}

export interface HourlyBlock {
  hour: number; // 0..23
  dayOfWeek: number; // 0..6 (Sun..Sat)
  tokens: number;
  costUSD: number;
}

export interface TokenEfficiencyRatio {
  prsMerged: number;
  commitsCount: number;
  testsPassed: number;
  efficiencyScore: number; // 0..100 index
  tokensPerPr: number;
  tokensPerCommit: number;
  grade: "A+" | "A" | "B+" | "B" | "C";
  status: "Master Craftsman" | "High Velocity" | "Balanced" | "Context Bloated";
}

export interface CircuitBreakerTelemetry {
  status: "nominal" | "warning" | "tripped";
  activeSubagents: number;
  recursionDepth: number;
  burnSpeedTokensPerSec: number;
  budgetCeilingUSD: number;
  currentSessionCostUSD: number;
  autoHaltTrippedAt: string | null;
  consecutiveNoChangeTurns: number;
}

export interface OrganizationSummary {
  slug: string;
  name: string;
  type: "company" | "hackathon" | "hackerhouse";
  memberCount: number;
  totalTokens: number;
  totalCostUSD: number;
  topTool: string;
  topModel: string;
  members: LeaderboardEntry[];
}

export interface UserProfile {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  githubHandle?: string | null;
  xHandle?: string | null;
  bio?: string | null;
  statusMessage?: string | null;
  claimed: boolean;
  verified?: boolean;
  rank: number | null;
  dailyRank?: number | null;
  weeklyRank?: number | null;
  totals: UserProfileTotals;
  daily: DailyPoint[];
  byTool: ToolBreakdown[];
  byModel: ModelBreakdown[];
  cache?: CacheEfficiency;
  pace?: VelocityPace;
  agent?: SubagentTelemetry;
  efficiency?: TokenEfficiencyRatio;
  circuitBreaker?: CircuitBreakerTelemetry;
  spark7d: number[];
  hourlyGrid: HourlyBlock[];
  lastCodedAt?: string | null;
  lastSubmittedAt: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  rankMovement?: {
    direction: "up" | "down" | "same" | "new";
    places: number;
  };
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  githubHandle?: string | null;
  xHandle?: string | null;
  claimed: boolean;
  verified?: boolean;
  totalTokens: number;
  totalCostUSD: number;
  todayTokens: number;
  streakDays: number;
  topTool: string | null;
  topModel: string | null;
  spark7d: number[];
  lastCodedAt?: string | null;
  statusMessage?: string | null;
}

/** Formats token count cleanly (e.g. 2.79T, 1.24B, 45.2M, 850k) */
export function formatTokens(n: number): string {
  if (n >= 1_000_000_000_000) {
    const t = n / 1_000_000_000_000;
    return `${t >= 10 ? t.toFixed(1) : t.toFixed(2)}T`;
  }
  if (n >= 1_000_000_000) {
    const b = n / 1_000_000_000;
    return `${b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)}B`;
  }
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 100 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}k`;
  }
  return n.toLocaleString();
}

/** Formats USD amount cleanly (e.g. $1,420, $48.20, $0.85) */
export function formatUSD(usd: number): string {
  if (usd >= 100) {
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  if (usd >= 10) {
    return `$${usd.toFixed(0)}`;
  }
  return `$${usd.toFixed(2)}`;
}

/** Determines tier badge based on total tokens burned */
export function getBurnTier(totalTokens: number): {
  tier: string;
  color: string;
  percentile: string;
  icon: string;
} {
  if (totalTokens >= 5_000_000_000) {
    return {
      tier: "Plasma Singularity",
      color: "#ec4899",
      percentile: "Top 0.01%",
      icon: "⚡",
    };
  }
  if (totalTokens >= 1_000_000_000) {
    return {
      tier: "GigaBurner",
      color: "#8b5cf6",
      percentile: "Top 0.1%",
      icon: "🌌",
    };
  }
  if (totalTokens >= 250_000_000) {
    return {
      tier: "Token Furnace",
      color: "#f97316",
      percentile: "Top 1%",
      icon: "🔥",
    };
  }
  if (totalTokens >= 50_000_000) {
    return {
      tier: "Prompt Architect",
      color: "#10b981",
      percentile: "Top 5%",
      icon: "✨",
    };
  }
  if (totalTokens >= 10_000_000) {
    return {
      tier: "Active Builder",
      color: "#06b6d4",
      percentile: "Top 15%",
      icon: "🛠️",
    };
  }
  return {
    tier: "Apprentice Coder",
    color: "#a1a1aa",
    percentile: "Initiate",
    icon: "🌱",
  };
}
