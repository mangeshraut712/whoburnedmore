"use client";

import React, { useEffect, useRef, useState } from "react";
import { formatTokens, formatUSD, UserProfile } from "@/lib/contracts";
import { Zap, Flame, Clock, TrendingUp } from "lucide-react";

interface BurnTachometerProps {
  profile: UserProfile;
}

export const BurnTachometer: React.FC<BurnTachometerProps> = ({ profile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [velocity, setVelocity] = useState<number>(
    profile.pace?.currentBurnRateTokensPerSec ?? 4250,
  );
  const [isSimulatingBurst, setIsSimulatingBurst] = useState<boolean>(false);

  // Ambient flame particle hearth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }> = [];

    const emberColors = ["#facc15", "#fb923c", "#f97316", "#ea580c"];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle particle spawning
      const spawnCount = Math.min(Math.floor(velocity / 600), 8);
      for (let i = 0; i < spawnCount; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 140,
          y: canvas.height - 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2 + 1.8) * (velocity / 3000),
          size: Math.random() * 3.5 + 1.5,
          alpha: 0.8,
          decay: Math.random() * 0.015 + 0.01,
          color: emberColors[Math.floor(Math.random() * emberColors.length)],
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [velocity]);

  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    };
  }, []);

  const handleBurst = () => {
    setIsSimulatingBurst(true);
    setVelocity((prev) => prev * 2.2);
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    burstTimerRef.current = setTimeout(() => {
      setVelocity(profile.pace?.currentBurnRateTokensPerSec ?? 4250);
      setIsSimulatingBurst(false);
      burstTimerRef.current = null;
    }, 2500);
  };

  const costPerHour = (velocity * 3600 * 0.0000052).toFixed(2);
  const normalizedGauge = Math.min(Math.max(velocity / 9000, 0.08), 1.0);

  return (
    <div className="wbm-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
      {/* Subtle warm ambient backlight */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange-500/8 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-amber-500/8 blur-[90px]" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-orange-400 ring-4 ring-orange-500/20" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
              Telemetry Stream
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
            Burn Velocity Tachometer
          </h2>
        </div>

        <button
          onClick={handleBurst}
          disabled={isSimulatingBurst}
          className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-background/70 active:scale-98 disabled:opacity-50"
        >
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span>{isSimulatingBurst ? "Simulating Subagent Burst..." : "Simulate Agent Turn"}</span>
        </button>
      </div>

      {/* Main Tachometer Gauge & Canvas */}
      <div className="relative my-6 flex flex-col items-center justify-center pt-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          className="pointer-events-none absolute inset-0 mx-auto opacity-70"
        />

        <div className="relative z-10 text-center">
          <div className="font-mono text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl tabular-nums">
            {Math.round(velocity).toLocaleString()}
            <span className="ml-2.5 text-base font-normal text-muted-foreground">tokens/sec</span>
          </div>
          <p className="mt-2 text-sm font-medium text-orange-400/90">
            Est. ${costPerHour} USD / hour active burn rate
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-[width,opacity] duration-300 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
            style={{ width: `${normalizedGauge * 100}%` }}
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-background/40 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            <span>Today's Burn</span>
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">
            {formatTokens(profile.pace?.todayTokens ?? 14820000)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {formatUSD(profile.pace?.todayCostUSD ?? 98.4)} spent
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span>Day-End Projection</span>
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">
            {formatUSD(profile.pace?.projectedTodayCostUSD ?? 185.0)}
          </div>
          <div className="text-[11px] text-muted-foreground">at current velocity</div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            <span>Daily Average</span>
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">
            {formatTokens(profile.pace?.avgDailyTokens ?? 18200000)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {formatUSD(profile.pace?.avgDailyCostUSD ?? 118.3)} / day
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Active Streak</span>
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-orange-300 tabular-nums">
            {profile.totals.streakDays} Days
          </div>
          <div className="text-[11px] text-muted-foreground">
            Peak: {profile.totals.longestStreakDays ?? 31}d
          </div>
        </div>
      </div>
    </div>
  );
};
