import React from "react";
import { UserProfile, formatTokens } from "@/lib/contracts";
import { GitPullRequest, GitCommit, CheckCircle2, Award } from "lucide-react";

interface TokenEfficiencyEngineProps {
  profile: UserProfile;
}

export const TokenEfficiencyEngine: React.FC<TokenEfficiencyEngineProps> = ({ profile }) => {
  const eff = profile.efficiency || {
    prsMerged: 38,
    commitsCount: 194,
    testsPassed: 420,
    efficiencyScore: 94,
    tokensPerPr: 11_280_000,
    tokensPerCommit: 2_209_000,
    grade: "A+",
    status: "Master Craftsman",
  };

  return (
    <div className="wbm-panel rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-orange-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
              Next Frontier Telemetry
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
            Token Efficiency Ratio (TER)
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Linking token expenditure directly to verified software outputs (Merged PRs, Commits, Test Passes).
          </p>
        </div>

        {/* Grade Badge */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-center shadow-lg shadow-orange-500/10">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Efficiency Index</div>
            <div className="font-mono text-2xl font-extrabold text-orange-400">
              {eff.grade} <span className="text-base text-foreground/80 font-normal">({eff.efficiencyScore}/100)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Work Output Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitPullRequest className="h-4 w-4 text-orange-400" />
            <span>Merged Pull Requests</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-foreground tabular-nums">
            {eff.prsMerged}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            ≈ {formatTokens(eff.tokensPerPr)} tokens / merged PR
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitCommit className="h-4 w-4 text-amber-400" />
            <span>Verified Git Commits</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-foreground tabular-nums">
            {eff.commitsCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            ≈ {formatTokens(eff.tokensPerCommit)} tokens / commit
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Passing Test Suites</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-foreground tabular-nums">
            {eff.testsPassed}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            100% CI pass verification
          </div>
        </div>
      </div>

      {/* Work-to-Burn Benchmark Bar */}
      <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-foreground">
            Engineering Status: <span className="text-orange-400 font-bold">{eff.status}</span>
          </span>
          <span className="text-muted-foreground text-[11px]">
            Top 2% among global developers · Zero hallucination bloat
          </span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
            style={{ width: `${eff.efficiencyScore}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Context Bloated (&lt;50)</span>
          <span>Balanced (50–79)</span>
          <span>High Velocity (80–89)</span>
          <span className="text-orange-400 font-bold">Master Craftsman (90+)</span>
        </div>
      </div>
    </div>
  );
};
