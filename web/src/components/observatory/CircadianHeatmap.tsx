"use client";

import React, { useState } from "react";
import { HourlyBlock, formatTokens, formatUSD } from "@/lib/contracts";
import { Moon, Sun, Flame } from "lucide-react";

interface CircadianHeatmapProps {
  hourlyGrid: HourlyBlock[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CircadianHeatmap: React.FC<CircadianHeatmapProps> = ({ hourlyGrid }) => {
  const [hoveredCell, setHoveredCell] = useState<HourlyBlock | null>(null);

  const maxTokens = Math.max(...hourlyGrid.map((b) => b.tokens), 1);

  const getCellColor = (tokens: number): string => {
    if (tokens === 0) return "rgba(255, 255, 255, 0.03)";
    const ratio = tokens / maxTokens;
    if (ratio < 0.2) return "rgba(249, 115, 22, 0.2)";
    if (ratio < 0.45) return "rgba(249, 115, 22, 0.45)";
    if (ratio < 0.75) return "rgba(249, 115, 22, 0.75)";
    return "#ea580c"; // Maximum burn window
  };

  return (
    <div className="wbm-panel rounded-2xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Circadian Chronotype
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-foreground">24×7 Token Burn Heatmap</h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-400" /> Daytime: 34%
          </span>
          <span className="flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5 text-orange-400" /> Night Owl: 66%
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Hour labels header */}
          <div className="flex text-[10px] font-mono text-muted-foreground pb-2.5 pl-10">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="flex-1 text-center">
                {h % 3 === 0 ? `${h.toString().padStart(2, "0")}h` : "·"}
              </div>
            ))}
          </div>

          {/* Days and cells */}
          {DAYS.map((dayName, dayIndex) => {
            const dayBlocks = hourlyGrid.filter((b) => b.dayOfWeek === dayIndex);
            return (
              <div key={dayName} className="flex items-center gap-1.5 mb-1.5">
                <span className="w-8 text-[11px] font-mono text-muted-foreground text-right pr-2">
                  {dayName}
                </span>
                <div className="flex flex-1 gap-1.5">
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const block = dayBlocks.find((b) => b.hour === hour) || {
                      hour,
                      dayOfWeek: dayIndex,
                      tokens: 0,
                      costUSD: 0,
                    };
                    return (
                      <div
                        key={hour}
                        onMouseEnter={() => setHoveredCell(block)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="h-6 flex-1 rounded-[4px] transition-[transform,box-shadow] duration-150 hover:scale-110 hover:ring-2 hover:ring-orange-400/80 cursor-pointer"
                        style={{ backgroundColor: getCellColor(block.tokens) }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Tooltip Bar */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-2.5 text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-4 text-foreground">
            <span className="font-semibold text-orange-400">
              {DAYS[hoveredCell.dayOfWeek]} {hoveredCell.hour.toString().padStart(2, "0")}:00
            </span>
            <span>Tokens: <strong className="font-mono">{formatTokens(hoveredCell.tokens)}</strong></span>
            <span>Spend: <strong className="font-mono">{formatUSD(hoveredCell.costUSD)}</strong></span>
          </div>
        ) : (
          <span className="text-muted-foreground">Hover over any hourly bucket to inspect token density</span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-[3px] bg-muted" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-orange-500/20" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-orange-500/50" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-orange-500/80" />
          <span className="h-2.5 w-2.5 rounded-[3px] bg-orange-600" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
