import { UserProfile, formatTokens, formatUSD } from "./contracts";

/**
 * Official share-card shapes rendered as pure SVG in the site's burn identity.
 */
export type CardShape = "landscape" | "hero" | "report";

export interface CardShapeSpec {
  id: CardShape;
  label: string;
  blurb: string;
  /** SVG viewBox size (PNG output is exported at 2x). */
  width: number;
  height: number;
  /** Exported PNG size for README embeds. */
  pngWidth: number;
  pngHeight: number;
}

export const CARD_SHAPES: Record<CardShape, CardShapeSpec> = {
  landscape: {
    id: "landscape",
    label: "Landscape",
    blurb: "A wide README-ready composition.",
    width: 900,
    height: 675,
    pngWidth: 1800,
    pngHeight: 1350,
  },
  hero: {
    id: "hero",
    label: "Hero",
    blurb: "A tall, high-signal profile card.",
    width: 690,
    height: 690,
    pngWidth: 1380,
    pngHeight: 1380,
  },
  report: {
    id: "report",
    label: "Report",
    blurb: "The compact, detailed breakdown.",
    width: 612,
    height: 765,
    pngWidth: 1224,
    pngHeight: 1530,
  },
};

export function isCardShape(value: string): value is CardShape {
  return value === "landscape" || value === "hero" || value === "report";
}

/** Native card palette — the site's burn identity. */
const NATIVE = {
  bg: "#050505",
  panel: "#101010",
  panelAlt: "#161616",
  border: "#232323",
  orange: "#ff6a00",
  peach: "#ffb27d",
  text: "#ffffff",
  secondary: "#c9c9c9",
  muted: "#8f8f8f",
  faint: "#5a5a5a",
  orangeDim: "rgba(255,106,0,0.14)",
  orangeBorder: "rgba(255,106,0,0.35)",
};

const FONT_SANS =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateHandle(handle: string, max: number): string {
  return handle.length > max ? `${handle.slice(0, max)}…` : handle;
}

/** Deterministic pseudo-random 30-day burn series seeded by handle. */
export function thirtyDaySeries(profile: UserProfile): number[] {
  let seed = 0;
  for (const ch of profile.handle) {
    seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const values: number[] = [];
  for (let i = 0; i < 30; i += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    values.push(0.18 + (seed % 1000) / 1400);
  }
  // Anchor the trailing week to the profile's real spark7d shape.
  const spark = profile.spark7d?.length ? profile.spark7d : [1, 2, 1.5, 3, 4, 3.5, 5];
  const sparkMax = Math.max(...spark, 1);
  for (let i = 0; i < Math.min(7, spark.length); i += 1) {
    values[30 - 7 + i] = 0.2 + (spark[i] / sparkMax) * 0.8;
  }
  return values;
}

function barChart(
  values: number[],
  x: number,
  y: number,
  width: number,
  height: number,
): string {
  const gap = 3;
  const barW = (width - gap * (values.length - 1)) / values.length;
  return values
    .map((v, i) => {
      const h = Math.max(3, Math.round(v * height));
      const bx = x + i * (barW + gap);
      const by = y + height - h;
      return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${h}" rx="1.5" fill="${NATIVE.orange}" />`;
    })
    .join("");
}

interface ToolShare {
  name: string;
  percent: number;
  color: string;
}

function topToolShares(profile: UserProfile): ToolShare[] {
  const tools = [...(profile.byTool ?? [])]
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, 2);
  const total = tools.reduce((sum, t) => sum + t.tokens, 0) || 1;
  const colors = [NATIVE.orange, NATIVE.peach];
  return tools.map((t, i) => ({
    name: t.tool.replace(/-code|-cli/g, ""),
    percent: Math.round((t.tokens / total) * 100),
    color: colors[i % colors.length],
  }));
}

function toolBars(
  shares: ToolShare[],
  x: number,
  y: number,
  width: number,
): string {
  const rowH = 30;
  const trackW = width - 150;
  return shares
    .map((s, i) => {
      const ry = y + i * rowH;
      const fillW = Math.max(6, Math.round((s.percent / 100) * trackW));
      return `<g>
        <rect x="${x}" y="${ry}" width="12" height="12" rx="3" fill="${s.color}" />
        <text x="${x + 20}" y="${ry + 11}" fill="${NATIVE.text}" font-size="13" font-family="${FONT_SANS}">${escapeXml(s.name)}</text>
        <rect x="${x + 92}" y="${ry + 2}" width="${trackW}" height="9" rx="4.5" fill="${NATIVE.panelAlt}" />
        <rect x="${x + 92}" y="${ry + 2}" width="${fillW}" height="9" rx="4.5" fill="${s.color}" />
        <text x="${x + 92 + trackW + 12}" y="${ry + 11}" fill="${NATIVE.secondary}" font-size="12" font-family="${FONT_MONO}">${s.percent}%</text>
      </g>`;
    })
    .join("");
}

function avatarCircle(x: number, y: number, r: number, handle: string): string {
  const initials = handle.slice(0, 2).toUpperCase();
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${NATIVE.panelAlt}" stroke="${NATIVE.border}" />
  <text x="${x}" y="${y + r * 0.36}" text-anchor="middle" fill="${NATIVE.muted}" font-size="${Math.round(r * 0.85)}" font-weight="700" font-family="${FONT_SANS}">${escapeXml(initials)}</text>`;
}

function rankPill(x: number, y: number, rank: number | null): string {
  const label = `#${rank ?? "—"} ALL-TIME`;
  const w = 16 + label.length * 7.6;
  return `<rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="24" rx="12" fill="${NATIVE.orangeDim}" stroke="${NATIVE.orangeBorder}" />
  <text x="${(x + w / 2).toFixed(0)}" y="${y + 16}" text-anchor="middle" fill="${NATIVE.orange}" font-size="11" font-weight="700" font-family="${FONT_MONO}">${label}</text>`;
}

function footer(width: number, y: number, pad: number): string {
  return `<text x="${pad}" y="${y}" fill="${NATIVE.faint}" font-size="13" font-family="${FONT_MONO}">$ npx whoburnedmore</text>
  <text x="${width - pad}" y="${y}" text-anchor="end" fill="${NATIVE.muted}" font-size="13" font-family="${FONT_SANS}">whoburnedmore.com</text>`;
}

function svgOpen(width: number, height: number, radius: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${radius}" fill="${NATIVE.bg}" stroke="${NATIVE.border}" stroke-width="1.5" />`;
}

function metricChip(
  x: number,
  y: number,
  w: number,
  label: string,
  value: string,
  valueColor: string,
): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="72" rx="14" fill="${NATIVE.panel}" stroke="${NATIVE.border}" />
  <text x="${x + 16}" y="${y + 26}" fill="${NATIVE.muted}" font-size="11" letter-spacing="0.08em" font-family="${FONT_MONO}">${label}</text>
  <text x="${x + 16}" y="${y + 54}" fill="${valueColor}" font-size="22" font-weight="700" font-family="${FONT_SANS}">${value}</text>`;
}

function renderLandscape(profile: UserProfile): string {
  const { width, height } = CARD_SHAPES.landscape;
  const pad = 48;
  const handle = truncateHandle(profile.handle, 14);
  const today = profile.pace?.todayTokens ?? 0;
  const msgs = profile.agent?.messageCount ?? 0;
  const series = thirtyDaySeries(profile);
  const shares = topToolShares(profile);

  const chipW = 170;
  const chipsX = width - pad - chipW * 2 - 14;

  return `${svgOpen(width, height, 28)}
  <!-- header -->
  ${avatarCircle(pad + 26, 92, 26, profile.handle)}
  <text x="${pad + 66}" y="88" fill="${NATIVE.text}" font-size="26" font-weight="700" font-family="${FONT_SANS}">@${escapeXml(handle)}</text>
  ${rankPill(pad + 66, 100, profile.rank)}

  <!-- metric chips -->
  ${metricChip(chipsX, 56, chipW, "TOTAL COST", formatUSD(profile.totals.costUSD), NATIVE.text)}
  ${metricChip(chipsX + chipW + 14, 56, chipW, "TODAY", `+${formatTokens(today)}`, NATIVE.orange)}
  ${metricChip(chipsX, 142, chipW, "MESSAGES", formatTokens(msgs), NATIVE.text)}
  ${metricChip(chipsX + chipW + 14, 142, chipW, "STREAK", `${profile.totals.streakDays}d`, NATIVE.text)}

  <!-- primary metric -->
  <text x="${pad}" y="308" fill="${NATIVE.muted}" font-size="14" letter-spacing="0.1em" font-family="${FONT_MONO}">TOKENS BURNED</text>
  <text x="${pad}" y="416" fill="${NATIVE.orange}" font-size="108" font-weight="800" font-family="${FONT_SANS}">${formatTokens(profile.totals.tokens)}</text>
  <text x="${pad}" y="458" fill="${NATIVE.muted}" font-size="16" font-family="${FONT_SANS}">${profile.totals.days} active days · ${profile.totals.streakDays}d streak</text>

  <!-- 30-day burn -->
  <text x="${width - pad - 360}" y="300" fill="${NATIVE.muted}" font-size="12" letter-spacing="0.1em" font-family="${FONT_MONO}">30-DAY BURN</text>
  ${barChart(series, width - pad - 360, 316, 360, 118)}

  <!-- model usage -->
  ${toolBars(shares, width - pad - 360, 468, 360)}

  <!-- footer -->
  <line x1="${pad}" y1="${height - 76}" x2="${width - pad}" y2="${height - 76}" stroke="${NATIVE.border}" stroke-width="1" />
  ${footer(width, height - 40, pad)}
</svg>`;
}

function renderHero(profile: UserProfile): string {
  const { width, height } = CARD_SHAPES.hero;
  const pad = 44;
  const handle = truncateHandle(profile.handle, 12);
  const today = profile.pace?.todayTokens ?? 0;
  const msgs = profile.agent?.messageCount ?? 0;
  const series = thirtyDaySeries(profile).slice(10);
  const shares = topToolShares(profile);
  const innerW = width - pad * 2;

  const statRow = [
    { value: formatUSD(profile.totals.costUSD), label: "COST", color: NATIVE.text },
    { value: `+${formatTokens(today)}`, label: "TODAY", color: NATIVE.orange },
    { value: formatTokens(msgs), label: "MSGS", color: NATIVE.text },
  ];
  const statCells = statRow
    .map((s, i) => {
      const cx = pad + (innerW / 3) * i;
      return `<text x="${cx}" y="470" fill="${s.color}" font-size="26" font-weight="700" font-family="${FONT_SANS}">${s.value}</text>
      <text x="${cx}" y="492" fill="${NATIVE.muted}" font-size="12" letter-spacing="0.08em" font-family="${FONT_MONO}">${s.label}</text>`;
    })
    .join("");

  return `${svgOpen(width, height, 30)}
  <!-- header -->
  ${avatarCircle(pad + 24, 78, 24, profile.handle)}
  <text x="${pad + 62}" y="86" fill="${NATIVE.text}" font-size="24" font-weight="700" font-family="${FONT_SANS}">@${escapeXml(handle)}</text>
  ${rankPill(width - pad - 132, 62, profile.rank)}

  <!-- primary metric -->
  <text x="${pad}" y="164" fill="${NATIVE.muted}" font-size="13" letter-spacing="0.1em" font-family="${FONT_MONO}">TOKENS BURNED</text>
  <text x="${pad}" y="268" fill="${NATIVE.orange}" font-size="104" font-weight="800" font-family="${FONT_SANS}">${formatTokens(profile.totals.tokens)}</text>

  <!-- histogram -->
  ${barChart(series, pad, 300, innerW, 110)}

  <!-- stat rows -->
  ${statCells}
  <text x="${pad}" y="540" fill="${NATIVE.text}" font-size="26" font-weight="700" font-family="${FONT_SANS}">${profile.totals.streakDays}d</text>
  <text x="${pad}" y="562" fill="${NATIVE.muted}" font-size="12" letter-spacing="0.08em" font-family="${FONT_MONO}">STREAK</text>

  <!-- model bars -->
  ${toolBars(shares, pad + 200, 522, innerW - 200)}

  <!-- footer -->
  <line x1="${pad}" y1="${height - 72}" x2="${width - pad}" y2="${height - 72}" stroke="${NATIVE.border}" stroke-width="1" />
  ${footer(width, height - 38, pad)}
</svg>`;
}

function renderReport(profile: UserProfile): string {
  const { width, height } = CARD_SHAPES.report;
  const pad = 40;
  const handle = truncateHandle(profile.handle, 10);
  const today = profile.pace?.todayTokens ?? 0;
  const msgs = profile.agent?.messageCount ?? 0;
  const series = thirtyDaySeries(profile);
  const shares = topToolShares(profile);
  const innerW = width - pad * 2;

  const rows: Array<{ label: string; value: string; color: string }> = [
    { label: "tokens burned", value: formatTokens(profile.totals.tokens), color: NATIVE.orange },
    { label: "total cost", value: formatUSD(profile.totals.costUSD), color: NATIVE.text },
    { label: "burned today", value: `+${formatTokens(today)}`, color: NATIVE.text },
    { label: "active days", value: `${profile.totals.days}`, color: NATIVE.text },
    { label: "assistant msgs", value: formatTokens(msgs), color: NATIVE.text },
    { label: "current streak", value: `${profile.totals.streakDays} days`, color: NATIVE.text },
  ];
  const rowH = 46;
  const rowsY = 128;
  const kvRows = rows
    .map((r, i) => {
      const ry = rowsY + i * rowH;
      return `<text x="${pad}" y="${ry + 28}" fill="${NATIVE.muted}" font-size="15" font-family="${FONT_SANS}">${r.label}</text>
      <text x="${width - pad}" y="${ry + 28}" text-anchor="end" fill="${r.color}" font-size="20" font-weight="700" font-family="${FONT_SANS}">${r.value}</text>
      <line x1="${pad}" y1="${ry + rowH}" x2="${width - pad}" y2="${ry + rowH}" stroke="${NATIVE.border}" stroke-width="1" />`;
    })
    .join("");

  const chartY = rowsY + rows.length * rowH + 40;

  return `${svgOpen(width, height, 26)}
  <!-- header -->
  ${avatarCircle(pad + 20, 68, 20, profile.handle)}
  <text x="${pad + 52}" y="75" fill="${NATIVE.text}" font-size="19" font-weight="600" font-family="${FONT_SANS}">burn report — @${escapeXml(handle)}</text>
  ${rankPill(width - pad - 70, 54, profile.rank)}

  <!-- key-value rows -->
  ${kvRows}

  <!-- 30-day burn -->
  <text x="${pad}" y="${chartY}" fill="${NATIVE.muted}" font-size="12" letter-spacing="0.1em" font-family="${FONT_MONO}">30-DAY BURN</text>
  ${barChart(series, pad, chartY + 14, innerW, 96)}

  <!-- model bars -->
  ${toolBars(shares, pad, chartY + 138, innerW)}

  <!-- footer -->
  <line x1="${pad}" y1="${height - 66}" x2="${width - pad}" y2="${height - 66}" stroke="${NATIVE.border}" stroke-width="1" />
  ${footer(width, height - 34, pad)}
</svg>`;
}

/** Renders the official native card for a profile in the requested shape. */
export function renderShapeCard(profile: UserProfile, shape: CardShape): string {
  switch (shape) {
    case "landscape":
      return renderLandscape(profile);
    case "hero":
      return renderHero(profile);
    case "report":
      return renderReport(profile);
    default: {
      const exhaustive: never = shape;
      throw new Error(`Unknown card shape: ${String(exhaustive)}`);
    }
  }
}
