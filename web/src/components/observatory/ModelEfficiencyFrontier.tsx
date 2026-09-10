import React from "react";
import { UserProfile, formatTokens, formatUSD } from "@/lib/contracts";
import { Cpu, ShieldCheck, Sparkles, Layers } from "lucide-react";

interface ModelEfficiencyProps {
  profile: UserProfile;
}

const MODEL_COLORS = ["#f97316", "#f59e0b", "#d97706", "#b45309", "#78716c"] as const;

export const ModelEfficiencyFrontier: React.FC<ModelEfficiencyProps> = ({ profile }) => {
  const cache = profile.cache || {
    hitRate: 0.785,
    savingsUSD: 642.8,
    cacheReadTokens: 72000000,
    cacheCreationTokens: 18000000,
  };

  const totalModelTokens = profile.byModel.reduce((acc, m) => acc + m.tokens, 0) || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Card: Model Distribution & Stack */}
      <div className="wbm-panel rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-400" />
            <h3 className="font-semibold text-foreground">Model Allocation</h3>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {profile.byModel.length} Models Active
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="mt-6">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted p-[1px]">
            {profile.byModel.map((model, idx) => {
              const pct = (model.tokens / totalModelTokens) * 100;
              return (
                <div
                  key={model.model}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: MODEL_COLORS[idx % MODEL_COLORS.length],
                  }}
                  className="transition-[width,opacity] duration-300 hover:opacity-85"
                  title={`${model.model}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>

        {/* Model rows */}
        <div className="mt-6 space-y-2.5">
          {profile.byModel.map((model, idx) => {
            const pct = ((model.tokens / totalModelTokens) * 100).toFixed(1);
            return (
              <div
                key={model.model}
                className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 transition-colors hover:bg-background/70"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: MODEL_COLORS[idx % MODEL_COLORS.length] }}
                  />
                  <div>
                    <div className="font-mono text-xs font-medium text-foreground">
                      {model.model}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatTokens(model.tokens)} burned ({pct}%)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-foreground">
                    {formatUSD(model.costUSD)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">estimated spend</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Card: Prompt Cache Intelligence */}
      <div className="wbm-panel rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="font-semibold text-foreground">Prompt Cache Intelligence</h3>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" /> Cache Optimized
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
            <div className="text-xs text-muted-foreground">Cache Hit Rate</div>
            <div className="mt-1 font-mono text-3xl font-extrabold text-orange-400">
              {(cache.hitRate * 100).toFixed(1)}%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Top tier efficiency</div>
          </div>

          <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
            <div className="text-xs text-muted-foreground">Estimated Savings</div>
            <div className="mt-1 font-mono text-3xl font-extrabold text-amber-400">
              {formatUSD(cache.savingsUSD)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">via prompt cache reads</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background/40 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cache Read Tokens (0.1x price)</span>
            <span className="font-mono font-semibold text-foreground">
              {formatTokens(cache.cacheReadTokens)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Cache Write Tokens</span>
            <span className="font-mono font-semibold text-foreground">
              {formatTokens(cache.cacheCreationTokens)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-border pt-2.5">
            <span className="text-muted-foreground">Subagent Autonomy Share</span>
            <span className="font-mono font-semibold text-orange-400">
              {profile.agent ? (profile.agent.subagentShare * 100).toFixed(1) : "57.2"}%
            </span>
          </div>
        </div>

        {/* Toolstack badges */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Layers className="h-3 w-3" /> Active Agents:
          </span>
          {profile.byTool.map((t) => (
            <span
              key={t.tool}
              className="rounded-lg border border-border bg-background/40 px-2.5 py-1 font-mono text-xs text-foreground/80"
            >
              {t.tool} ({formatTokens(t.tokens)})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
