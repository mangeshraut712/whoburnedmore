"use client";

import React, { useEffect, useRef, useState } from "react";
import { UserProfile, formatUSD } from "@/lib/contracts";
import { ShieldAlert, ShieldCheck, AlertTriangle, Play, RotateCcw, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface RunawayCircuitBreakerProps {
  profile: UserProfile;
}

type BreakerStatus = "nominal" | "warning" | "tripped";

function resolveStatus(
  consecutiveTurns: number,
  sessionCost: number,
  budgetCeiling: number,
): BreakerStatus {
  if (consecutiveTurns >= 8 || sessionCost >= budgetCeiling) return "tripped";
  if (consecutiveTurns >= 5 || sessionCost >= budgetCeiling * 0.8) return "warning";
  return "nominal";
}

function StatusBadge({ status }: { status: BreakerStatus }) {
  switch (status) {
    case "nominal":
      return (
        <Badge className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
          <ShieldCheck className="size-4" /> NOMINAL · ARMED
        </Badge>
      );
    case "warning":
      return (
        <Badge className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10">
          <AlertTriangle className="size-4" /> RECURSION WARNING
        </Badge>
      );
    case "tripped":
      return (
        <Badge className="gap-1.5 animate-pulse border-rose-500/40 bg-rose-500/20 text-rose-400 hover:bg-rose-500/20">
          <ShieldAlert className="size-4" /> AUTO-HALT TRIPPED
        </Badge>
      );
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export const RunawayCircuitBreaker: React.FC<RunawayCircuitBreakerProps> = ({
  profile: _profile,
}) => {
  const [consecutiveTurns, setConsecutiveTurns] = useState(1);
  const [sessionCost, setSessionCost] = useState(18.4);
  const [budgetCeiling, setBudgetCeiling] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status = resolveStatus(consecutiveTurns, sessionCost, budgetCeiling);
  const isTripped = status === "tripped";

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const triggerRunawayLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSimulating(true);
    let count = consecutiveTurns;
    let cost = sessionCost;
    intervalRef.current = setInterval(() => {
      count += 1;
      cost += 4.2;
      setConsecutiveTurns(count);
      setSessionCost(cost);
      if (count >= 8 || cost >= budgetCeiling) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsSimulating(false);
      }
    }, 400);
  };

  const resetCircuit = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
    setConsecutiveTurns(1);
    setSessionCost(18.4);
  };

  return (
    <Card className="border-border bg-card/50 shadow-none">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <ShieldAlert className="size-3.5" />
            in-flight guardrails
          </div>
          <CardTitle className="mt-1 text-xl">Runaway Subagent Circuit Breaker</CardTitle>
          <CardDescription className="mt-1">
            Loop detection heuristics to stop autonomous agents from burning budget on recursive errors.
          </CardDescription>
        </div>
        <StatusBadge status={status} />
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">Consecutive 0-Diff Turns</div>
            <div
              className={`mt-2 font-mono text-3xl font-bold tnum ${
                consecutiveTurns >= 8
                  ? "text-rose-400"
                  : consecutiveTurns >= 5
                    ? "text-amber-400"
                    : "text-foreground"
              }`}
            >
              {consecutiveTurns}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ 8 max</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">Active Session Spend</div>
            <div className="mt-2 font-mono text-3xl font-bold text-primary tnum">
              {formatUSD(sessionCost)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Ceiling: {formatUSD(budgetCeiling)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">Estimated Cash Protected</div>
            <div className="mt-2 font-mono text-3xl font-bold text-emerald-400 tnum">
              {isTripped ? formatUSD(32.5) : "$0.00"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerRunawayLoop}
              disabled={isSimulating || isTripped}
              className="gap-2 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Play className="size-3.5" />
              {isSimulating ? "Simulating…" : "Simulate Runaway Loop"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={resetCircuit} className="gap-2">
              <RotateCcw className="size-3.5" />
              Reset Breaker
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <Sliders className="size-3.5" />
            <Label htmlFor="budget-ceiling" className="text-xs font-mono">
              Ceiling
            </Label>
            <input
              id="budget-ceiling"
              type="range"
              min={20}
              max={200}
              step={10}
              value={budgetCeiling}
              onChange={(e) => setBudgetCeiling(Number(e.target.value))}
              aria-label="Budget ceiling in USD"
              className="h-1.5 w-28 cursor-pointer appearance-none rounded-lg bg-muted accent-[var(--burn)]"
            />
            <span className="font-bold text-foreground tnum">${budgetCeiling}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
