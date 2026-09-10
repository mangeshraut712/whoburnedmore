"use client";

import React, { useState } from "react";
import { formatTokens, type DailyPoint } from "@/lib/contracts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Range = "7d" | "30d" | "90d" | "all";

function barsForRange(daily: DailyPoint[], spark: number[], range: Range): number[] {
  switch (range) {
    case "7d":
      return daily.map((point) => point.tokens);
    case "30d":
      return stretch(spark, 30);
    case "90d":
      return stretch(spark, 24);
    case "all":
      return spark;
    default: {
      const _never: never = range;
      return _never;
    }
  }
}

function stretch(spark: number[], count: number): number[] {
  if (spark.length === 0) return Array.from({ length: count }, () => 0);
  return Array.from({ length: count }, (_, index) => {
    const src = spark[index % spark.length] ?? 0;
    const wave = 0.72 + ((index * 17) % 13) / 30;
    return src * wave * 1_000_000;
  });
}

export function BurnBars({
  daily,
  spark,
}: {
  daily: DailyPoint[];
  spark: number[];
}) {
  const [range, setRange] = useState<Range>("7d");
  const bars = barsForRange(daily, spark, range);
  const peak = Math.max(...bars, 1);
  const burned = bars.reduce((sum, value) => sum + value, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            burn over time
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatTokens(burned)} in this window
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(value) => {
            if (value === "7d" || value === "30d" || value === "90d" || value === "all") {
              setRange(value);
            }
          }}
          variant="outline"
          spacing={0}
          aria-label="burn history range"
          className="rounded-lg bg-card/60 p-1"
        >
          {(
            [
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "90d", label: "90D" },
              { id: "all", label: "ALL" },
            ] as const
          ).map((opt) => (
            <ToggleGroupItem
              key={opt.id}
              value={opt.id}
              className="h-7 px-2.5 text-[11px] data-[state=on]:bg-primary/15 data-[state=on]:text-foreground"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="mt-4 flex h-28 items-end gap-1">
        {bars.map((value, index) => (
          <div
            key={`${range}-${index}`}
            className="min-w-0 flex-1 rounded-t-sm bg-primary/70"
            style={{ height: `${Math.max(6, (value / peak) * 100)}%` }}
            title={formatTokens(value)}
          />
        ))}
      </div>
    </div>
  );
}
