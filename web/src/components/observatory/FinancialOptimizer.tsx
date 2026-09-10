"use client";

import React, { useState } from "react";
import { formatUSD, UserProfile } from "@/lib/contracts";
import { simulateModelSubstitution, MODEL_PRICING } from "@/lib/simulator";
import { Calculator, ArrowRight, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface FinancialOptimizerProps {
  profile: UserProfile;
}

export const FinancialOptimizer: React.FC<FinancialOptimizerProps> = ({ profile }) => {
  const [baseModel, setBaseModel] = useState("claude-3-7-sonnet");
  const [targetModel, setTargetModel] = useState("gpt-5-mini");
  const [ratio, setRatio] = useState(35);

  const monthlyTokens = (profile.totals.tokens / (profile.totals.days || 30)) * 30;
  const sim = simulateModelSubstitution(monthlyTokens, baseModel, targetModel, ratio / 100);

  return (
    <Card className="border-border bg-card/50 shadow-none">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4 border-b border-border">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="size-4 text-primary" />
            Predictive Financial Router
          </CardTitle>
          <CardDescription className="mt-1">
            Simulate subagent workload delegation to lower spend while keeping quality.
          </CardDescription>
        </div>
        <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
          Save {sim.savingsPercentage}% Monthly
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="base-model" className="font-mono text-xs text-muted-foreground">
              Current Frontier Model
            </Label>
            <select
              id="base-model"
              value={baseModel}
              onChange={(e) => setBaseModel(e.target.value)}
              aria-label="Current frontier model"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs text-foreground outline-none focus:border-primary"
            >
              {Object.entries(MODEL_PRICING).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name} (${v.inputUSD}/M)
                </option>
              ))}
            </select>
          </div>

          <div className="hidden items-center justify-center pt-6 sm:flex">
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>

          <div>
            <Label htmlFor="target-model" className="font-mono text-xs text-muted-foreground">
              Subagent Target Model
            </Label>
            <select
              id="target-model"
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              aria-label="Subagent target model"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs text-foreground outline-none focus:border-primary"
            >
              {Object.entries(MODEL_PRICING).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name} (${v.inputUSD}/M)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between font-mono text-xs text-muted-foreground">
            <Label htmlFor="delegate-ratio" className="font-mono text-xs">
              Delegate {ratio}% of subagent turns to {MODEL_PRICING[targetModel]?.name}
            </Label>
            <span className="font-bold text-primary">{ratio}% delegated</span>
          </div>
          <input
            id="delegate-ratio"
            type="range"
            min={5}
            max={90}
            step={5}
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            aria-label="Delegation percentage"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-[var(--burn)]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="size-3.5 text-primary" />
              Projected Monthly Spend
            </div>
            <div className="mt-1.5 font-mono text-2xl font-bold tnum">
              {formatUSD(sim.projectedMonthlyCostUSD)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Down from {formatUSD(sim.currentMonthlyCostUSD)}/mo
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="size-3.5 text-amber-400" />
              Monthly Cash Saved
            </div>
            <div className="mt-1.5 font-mono text-2xl font-bold text-amber-300 tnum">
              {formatUSD(sim.monthlySavingsUSD)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5 text-primary" />
              Runway Extended
            </div>
            <div className="mt-1.5 font-mono text-2xl font-bold text-primary tnum">
              +{sim.extendedRunwayDays} Days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
