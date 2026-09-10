"use client";

import dynamic from "next/dynamic";
import { MOCK_PROFILE } from "@/lib/mock-data";

const BurnTachometer = dynamic(
  () =>
    import("@/components/observatory/BurnTachometer").then((m) => m.BurnTachometer),
  { loading: () => <WidgetFallback label="burn tachometer" /> },
);
const TokenEfficiencyEngine = dynamic(
  () =>
    import("@/components/observatory/TokenEfficiencyEngine").then(
      (m) => m.TokenEfficiencyEngine,
    ),
  { loading: () => <WidgetFallback label="efficiency engine" /> },
);
const RunawayCircuitBreaker = dynamic(
  () =>
    import("@/components/observatory/RunawayCircuitBreaker").then(
      (m) => m.RunawayCircuitBreaker,
    ),
  { loading: () => <WidgetFallback label="circuit breaker" /> },
);
const CircadianHeatmap = dynamic(
  () =>
    import("@/components/observatory/CircadianHeatmap").then((m) => m.CircadianHeatmap),
  { loading: () => <WidgetFallback label="circadian heatmap" /> },
);
const ModelEfficiencyFrontier = dynamic(
  () =>
    import("@/components/observatory/ModelEfficiencyFrontier").then(
      (m) => m.ModelEfficiencyFrontier,
    ),
  { loading: () => <WidgetFallback label="model frontier" /> },
);
const FinancialOptimizer = dynamic(
  () =>
    import("@/components/observatory/FinancialOptimizer").then(
      (m) => m.FinancialOptimizer,
    ),
  { loading: () => <WidgetFallback label="financial optimizer" /> },
);

function WidgetFallback({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-8 text-sm text-muted-foreground">
      Loading {label}…
    </div>
  );
}

/** Lazily loads heavy observatory widgets so the dashboard shell stays light. */
export function ObservatoryStack() {
  const profile = MOCK_PROFILE;

  return (
    <div className="space-y-8">
      <BurnTachometer profile={profile} />
      <TokenEfficiencyEngine profile={profile} />
      <RunawayCircuitBreaker profile={profile} />
      <CircadianHeatmap hourlyGrid={profile.hourlyGrid} />
      <ModelEfficiencyFrontier profile={profile} />
      <FinancialOptimizer profile={profile} />
    </div>
  );
}
