import React from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const size =
      rank === 1
        ? "h-8 min-w-11 gap-1 border-white/30 bg-white/12 px-2.5 text-sm shadow-[0_0_18px_-10px_rgba(255,255,255,0.4)]"
        : rank === 2
          ? "h-7 min-w-10 gap-1 border-white/20 bg-white/8 px-2 text-xs"
          : "h-6 min-w-9 gap-1 border-white/15 bg-white/8 px-1.5 text-[11px]";
    const icon = rank === 1 ? "size-3.5" : rank === 2 ? "size-3" : "size-2.5";
    return (
      <span
        title={`Rank ${rank}`}
        className={cn(
          "tnum inline-flex items-center justify-center rounded-full border font-mono font-bold leading-none text-white",
          size,
        )}
      >
        <Crown className={icon} />
        {rank}
      </span>
    );
  }
  return (
    <span className="tnum inline-grid min-w-7 place-items-center rounded-full border border-transparent px-2 py-0.5 font-mono text-xs font-semibold text-foreground/90">
      {rank}
    </span>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 56;
      const y = 18 - (v / max) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="56" height="20" viewBox="0 0 56 20" className="text-primary" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
