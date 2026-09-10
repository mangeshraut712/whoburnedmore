import { UserProfile, formatTokens, formatUSD, getBurnTier } from "./contracts";
import { getTheme, ThemePalette } from "./theme-config";

export interface SvgCardOptions {
  themeId?: string;
  layout?: "hero" | "compact" | "tachometer";
  privacy?: boolean; // If true, masks exact USD with tier badge
  showSparkline?: boolean;
  showBreakdown?: boolean;
  showStreak?: boolean;
  showTer?: boolean;
}

/**
 * Generates an SVG path string for a mini sparkline given 7 data points.
 */
function generateSparklinePath(
  data: number[],
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
): { linePath: string; areaPath: string } {
  if (!data || data.length === 0) {
    return { linePath: "", areaPath: "" };
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = offsetX + i * stepX;
    const normalized = (val - min) / range;
    const y = offsetY + height - normalized * height;
    return { x, y };
  });

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, "");

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const baseBaseline = offsetY + height;
  const areaPath = `${linePath} L ${lastPt.x.toFixed(1)} ${baseBaseline.toFixed(1)} L ${firstPt.x.toFixed(1)} ${baseBaseline.toFixed(1)} Z`;

  return { linePath, areaPath };
}

/**
 * Escapes XML strings for safe SVG embedding.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Pure vector SVG generator for GitHub profile READMEs and live cards.
 */
export function renderSvgCard(profile: UserProfile, options: SvgCardOptions = {}): string {
  const theme = getTheme(options.themeId);
  const layout = options.layout || "hero";
  const privacy = options.privacy ?? false;
  const showSparkline = options.showSparkline ?? true;
  const showStreak = options.showStreak ?? true;
  const showBreakdown = options.showBreakdown ?? true;

  const tier = getBurnTier(profile.totals.tokens);
  const tokenDisplay = formatTokens(profile.totals.tokens);
  const costDisplay = privacy ? tier.tier : formatUSD(profile.totals.costUSD);
  const costLabel = privacy ? "BURN TIER" : "EST. SPEND";

  if (layout === "compact") {
    return renderCompactCard(profile, theme, {
      tokenDisplay,
      costDisplay,
      costLabel,
      tier,
      showStreak,
    });
  }

  if (layout === "tachometer") {
    return renderTachometerCard(profile, theme, {
      tokenDisplay,
      costDisplay,
      costLabel,
      tier,
      showSparkline,
    });
  }

  return renderHeroCard(profile, theme, {
    tokenDisplay,
    costDisplay,
    costLabel,
    tier,
    showSparkline,
    showBreakdown,
    showStreak,
  });
}

function renderHeroCard(
  profile: UserProfile,
  theme: ThemePalette,
  ctx: {
    tokenDisplay: string;
    costDisplay: string;
    costLabel: string;
    tier: ReturnType<typeof getBurnTier>;
    showSparkline: boolean;
    showBreakdown: boolean;
    showStreak: boolean;
  },
): string {
  const width = 820;
  const height = 240;

  // Calculate sparkline
  const sparkData = profile.spark7d?.length ? profile.spark7d : [10, 25, 18, 45, 60, 50, 95];
  const { linePath, areaPath } = generateSparklinePath(sparkData, 180, 50, 590, 95);

  // Model breakdown segments (top 3)
  const topModels = profile.byModel.slice(0, 3);
  const totalModelTokens = topModels.reduce((sum, m) => sum + m.tokens, 0) || 1;
  let currentOffset = 0;
  const barWidth = 320;
  const modelSegments = topModels.map((m, idx) => {
    const fraction = m.tokens / totalModelTokens;
    const segW = Math.max(Math.round(fraction * barWidth), 4);
    const x = 230 + currentOffset;
    currentOffset += segW + 2;
    const colors = [theme.accentPrimary, theme.accentSecondary, theme.flamePrimary];
    return {
      name: m.model.replace(/^claude-/, "").replace(/^gpt-/, ""),
      share: Math.round(fraction * 100),
      x,
      w: segW,
      color: colors[idx % colors.length],
    };
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <style>
      .mono { font-family: ${theme.fontMono}; font-variant-numeric: tabular-nums; }
      .sans { font-family: ${theme.fontSans}; }
      .bold { font-weight: 700; }
      .medium { font-weight: 500; }
    </style>
    <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgAlt}" />
    </linearGradient>
    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sparklineColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${theme.sparklineColor}" stop-opacity="0.0" />
    </linearGradient>
    <filter id="cardShadow" x="-10" y="-10" width="${width + 20}" height="${height + 20}">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="${theme.glowColor}" />
    </filter>
  </defs>

  <!-- Background Card -->
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="url(#bgGlow)" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Corner Glow Accent -->
  <circle cx="${width - 80}" cy="40" r="90" fill="${theme.accentPrimary}" opacity="0.06" filter="blur(40px)" />
  <circle cx="80" cy="${height - 40}" r="80" fill="${theme.accentSecondary}" opacity="0.04" filter="blur(30px)" />

  <!-- Brand Mark & Handle Header -->
  <g transform="translate(32, 28)">
    <!-- Flame Badge -->
    <rect x="0" y="0" width="34" height="34" rx="8" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" />
    <text x="17" y="23" text-anchor="middle" font-size="18">${ctx.tier.icon}</text>

    <!-- Handle & Verification -->
    <text x="46" y="17" fill="${theme.textPrimary}" font-size="18" class="sans bold">${escapeXml(profile.displayName || profile.handle)}</text>
    <text x="46" y="32" fill="${theme.textMuted}" font-size="12" class="mono">@${escapeXml(profile.handle)} · whoburnedmore.com</text>

    ${
      profile.verified
        ? `<g transform="translate(240, 4)">
            <rect x="0" y="0" width="76" height="18" rx="9" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" />
            <text x="38" y="13" text-anchor="middle" fill="${theme.badgeText}" font-size="10" class="mono bold">✓ VERIFIED</text>
          </g>`
        : ""
    }
    ${
      profile.efficiency
        ? `<g transform="translate(${profile.verified ? 324 : 240}, 4)">
            <rect x="0" y="0" width="94" height="18" rx="9" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.3)" />
            <text x="47" y="13" text-anchor="middle" fill="#fb923c" font-size="10" class="mono bold">TER: ${profile.efficiency.grade} (${profile.efficiency.efficiencyScore})</text>
          </g>`
        : ""
    }
  </g>

  <!-- Global Rank Pill (Top Right) -->
  <g transform="translate(${width - 180}, 28)">
    <rect x="0" y="0" width="148" height="34" rx="8" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" />
    <text x="14" y="22" fill="${theme.textMuted}" font-size="11" class="mono">GLOBAL RANK</text>
    <text x="134" y="22" text-anchor="end" fill="${theme.badgeText}" font-size="14" class="mono bold">#${profile.rank ?? "—"}</text>
  </g>

  <!-- Dividing Hairline -->
  <line x1="32" y1="78" x2="${width - 32}" y2="78" stroke="${theme.border}" stroke-width="1" />

  <!-- Metric 1: Total Tokens -->
  <g transform="translate(32, 102)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="11" class="mono bold" letter-spacing="0.08em">LIFETIME BURN</text>
    <text x="0" y="38" fill="${theme.accentPrimary}" font-size="36" class="mono bold">${ctx.tokenDisplay}</text>
    <text x="0" y="58" fill="${theme.textSecondary}" font-size="12" class="sans">${profile.totals.days || 1} active days tracked</text>
  </g>

  <!-- Metric 2: Spend / Tier -->
  <g transform="translate(230, 102)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="11" class="mono bold" letter-spacing="0.08em">${ctx.costLabel}</text>
    <text x="0" y="38" fill="${theme.textPrimary}" font-size="34" class="mono bold">${ctx.costDisplay}</text>
    <text x="0" y="58" fill="${theme.textSecondary}" font-size="12" class="sans">${ctx.tier.percentile} · ${ctx.tier.tier}</text>
  </g>

  <!-- Metric 3: Streak & Cache Hit Rate -->
  <g transform="translate(420, 102)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="11" class="mono bold" letter-spacing="0.08em">STREAK / EFFICIENCY</text>
    <g transform="translate(0, 10)">
      <text x="0" y="28" fill="${theme.flamePrimary}" font-size="28" class="mono bold">${profile.totals.streakDays}d</text>
      <text x="52" y="27" fill="${theme.textMuted}" font-size="14" class="mono">streak</text>
    </g>
    <text x="0" y="58" fill="${theme.badgeText}" font-size="12" class="mono">Cache: ${profile.cache ? Math.round(profile.cache.hitRate * 100) : 74}% saved</text>
  </g>

  <!-- Sparkline Graph (Trailing 7 Days) -->
  ${
    ctx.showSparkline
      ? `<g transform="translate(0, 0)">
          <text x="590" y="90" fill="${theme.textMuted}" font-size="10" class="mono" letter-spacing="0.06em">7-DAY BURN MOMENTUM</text>
          <path d="${areaPath}" fill="url(#sparklineGrad)" />
          <path d="${linePath}" fill="none" stroke="${theme.sparklineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>`
      : ""
  }

  <!-- Footer Model Stack Breakdown -->
  ${
    ctx.showBreakdown
      ? `<g transform="translate(32, 192)">
          <text x="0" y="16" fill="${theme.textMuted}" font-size="11" class="mono bold">MODELS</text>
          <!-- Stacked Bar -->
          <rect x="65" y="6" width="${barWidth}" height="12" rx="4" fill="${theme.border}" />
          ${modelSegments
            .map((s) => `<rect x="${s.x - 165}" y="6" width="${s.w}" height="12" rx="3" fill="${s.color}" />`)
            .join("")}

          <!-- Legend -->
          <g transform="translate(410, 15)">
            ${modelSegments
              .map(
                (s, i) =>
                  `<g transform="translate(${i * 125}, 0)">
                    <circle cx="4" cy="-4" r="4" fill="${s.color}" />
                    <text x="14" y="0" fill="${theme.textSecondary}" font-size="11" class="mono">${escapeXml(s.name)} ${s.share}%</text>
                  </g>`,
              )
              .join("")}
          </g>
        </g>`
      : ""
  }
</svg>`;
}

function renderCompactCard(
  profile: UserProfile,
  theme: ThemePalette,
  ctx: {
    tokenDisplay: string;
    costDisplay: string;
    costLabel: string;
    tier: ReturnType<typeof getBurnTier>;
    showStreak: boolean;
  },
): string {
  const width = 460;
  const height = 150;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <style>
      .mono { font-family: ${theme.fontMono}; font-variant-numeric: tabular-nums; }
      .sans { font-family: ${theme.fontSans}; }
      .bold { font-weight: 700; }
    </style>
    <linearGradient id="bgGlowCompact" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgAlt}" />
    </linearGradient>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" fill="url(#bgGlowCompact)" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Header -->
  <g transform="translate(20, 20)">
    <rect x="0" y="0" width="26" height="26" rx="6" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" />
    <text x="13" y="18" text-anchor="middle" font-size="14">${ctx.tier.icon}</text>
    <text x="34" y="14" fill="${theme.textPrimary}" font-size="15" class="sans bold">${escapeXml(profile.displayName || profile.handle)}</text>
    <text x="34" y="27" fill="${theme.textMuted}" font-size="11" class="mono">@${escapeXml(profile.handle)}</text>
  </g>

  <!-- Global Rank -->
  <g transform="translate(${width - 100}, 20)">
    <rect x="0" y="0" width="80" height="26" rx="6" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" />
    <text x="40" y="18" text-anchor="middle" fill="${theme.badgeText}" font-size="12" class="mono bold">#${profile.rank ?? "—"}</text>
  </g>

  <line x1="20" y1="58" x2="${width - 20}" y2="58" stroke="${theme.border}" stroke-width="1" />

  <!-- Metric: Lifetime Burn -->
  <g transform="translate(20, 78)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="10" class="mono bold">TOTAL BURN</text>
    <text x="0" y="28" fill="${theme.accentPrimary}" font-size="26" class="mono bold">${ctx.tokenDisplay}</text>
    <text x="0" y="44" fill="${theme.textSecondary}" font-size="10" class="sans">${ctx.tier.tier}</text>
  </g>

  <!-- Metric: Cost / Tier -->
  <g transform="translate(170, 78)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="10" class="mono bold">${ctx.costLabel}</text>
    <text x="0" y="28" fill="${theme.textPrimary}" font-size="24" class="mono bold">${ctx.costDisplay}</text>
    <text x="0" y="44" fill="${theme.textSecondary}" font-size="10" class="sans">${ctx.tier.percentile}</text>
  </g>

  <!-- Metric: Streak -->
  <g transform="translate(320, 78)">
    <text x="0" y="0" fill="${theme.textMuted}" font-size="10" class="mono bold">STREAK</text>
    <text x="0" y="28" fill="${theme.flamePrimary}" font-size="24" class="mono bold">${profile.totals.streakDays}d</text>
    <text x="0" y="44" fill="${theme.badgeText}" font-size="10" class="mono">Active coder</text>
  </g>
</svg>`;
}

function renderTachometerCard(
  profile: UserProfile,
  theme: ThemePalette,
  ctx: {
    tokenDisplay: string;
    costDisplay: string;
    costLabel: string;
    tier: ReturnType<typeof getBurnTier>;
    showSparkline: boolean;
  },
): string {
  const width = 540;
  const height = 210;

  // Tachometer angle calculations (180 degree semi-circle arc)
  // Clamp burn velocity between 0 and 100
  const rateTokensPerSec = profile.pace?.currentBurnRateTokensPerSec ?? 3420;
  const normalizedRate = Math.min(Math.max(rateTokensPerSec / 8000, 0.05), 0.95);
  const needleAngle = -180 + normalizedRate * 180; // -180deg to 0deg

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <style>
      .mono { font-family: ${theme.fontMono}; font-variant-numeric: tabular-nums; }
      .sans { font-family: ${theme.fontSans}; }
      .bold { font-weight: 700; }
    </style>
    <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accentSecondary}" />
      <stop offset="60%" stop-color="${theme.accentPrimary}" />
      <stop offset="100%" stop-color="${theme.flamePrimary}" />
    </linearGradient>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Header -->
  <g transform="translate(24, 24)">
    <text x="0" y="14" fill="${theme.textPrimary}" font-size="16" class="sans bold">${escapeXml(profile.displayName || profile.handle)}</text>
    <text x="0" y="30" fill="${theme.textMuted}" font-size="12" class="mono">BURN VELOCITY TACHOMETER · @${escapeXml(profile.handle)}</text>
  </g>

  <!-- Gauge Arc (Semi circle) -->
  <g transform="translate(130, 155)">
    <!-- Background Track -->
    <path d="M -80 0 A 80 80 0 0 1 80 0" fill="none" stroke="${theme.border}" stroke-width="12" stroke-linecap="round" />
    <!-- Value Track -->
    <path d="M -80 0 A 80 80 0 0 1 ${80 * Math.cos((needleAngle * Math.PI) / 180)} ${80 * Math.sin((needleAngle * Math.PI) / 180)}" fill="none" stroke="url(#arcGrad)" stroke-width="12" stroke-linecap="round" />
    <!-- Center Hub -->
    <circle cx="0" cy="0" r="8" fill="${theme.accentPrimary}" />
    <!-- Needle -->
    <line x1="0" y1="0" x2="${65 * Math.cos((needleAngle * Math.PI) / 180)}" y2="${65 * Math.sin((needleAngle * Math.PI) / 180)}" stroke="${theme.textPrimary}" stroke-width="3" stroke-linecap="round" />
    <text x="0" y="24" text-anchor="middle" fill="${theme.accentPrimary}" font-size="13" class="mono bold">${rateTokensPerSec.toLocaleString()} t/s</text>
  </g>

  <!-- Right Side Telemetry Metrics -->
  <g transform="translate(280, 56)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${theme.textMuted}" font-size="10" class="mono bold">CURRENT VELOCITY</text>
      <text x="0" y="24" fill="${theme.flamePrimary}" font-size="20" class="mono bold">${rateTokensPerSec.toLocaleString()} tokens/sec</text>
      <text x="0" y="40" fill="${theme.textSecondary}" font-size="11" class="sans">Est. ${formatUSD(profile.pace?.currentBurnRateCostPerHour ?? 18.5)}/hour burn speed</text>
    </g>

    <g transform="translate(0, 70)">
      <text x="0" y="0" fill="${theme.textMuted}" font-size="10" class="mono bold">LIFETIME BURN</text>
      <text x="0" y="24" fill="${theme.accentPrimary}" font-size="22" class="mono bold">${ctx.tokenDisplay}</text>
      <text x="0" y="40" fill="${theme.textSecondary}" font-size="11" class="sans">Rank #${profile.rank ?? "—"} · ${ctx.tier.tier}</text>
    </g>
  </g>
</svg>`;
}
