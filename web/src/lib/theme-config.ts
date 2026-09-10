export interface ThemePalette {
  id: string;
  name: string;
  tagline: string;
  isDark: boolean;
  bg: string;
  cardBg: string;
  cardBgAlt: string;
  border: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  sparklineColor: string;
  sparklineFill: string;
  flamePrimary: string;
  flameSecondary: string;
  fontMono: string;
  fontSans: string;
}

export const THEMES: Record<string, ThemePalette> = {
  openai: {
    id: "openai",
    name: "OpenAI Obsidian",
    tagline: "Ultra-dark obsidian surfaces with emerald particle glow",
    isDark: true,
    bg: "#050608",
    cardBg: "#0d0f12",
    cardBgAlt: "#13171d",
    border: "#1f242c",
    borderHover: "#10b981",
    textPrimary: "#f4f4f5",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    accentPrimary: "#10b981",
    accentSecondary: "#06b6d4",
    glowColor: "rgba(16, 185, 129, 0.25)",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#34d399",
    badgeBorder: "rgba(16, 185, 129, 0.3)",
    sparklineColor: "#10b981",
    sparklineFill: "rgba(16, 185, 129, 0.15)",
    flamePrimary: "#10b981",
    flameSecondary: "#3b82f6",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  terracotta: {
    id: "terracotta",
    name: "Claude Terracotta",
    tagline: "Warm charcoal with fiery amber and roasted terracotta hues",
    isDark: true,
    bg: "#0e0c0a",
    cardBg: "#171411",
    cardBgAlt: "#211c17",
    border: "#2d261f",
    borderHover: "#d97706",
    textPrimary: "#fafaf9",
    textSecondary: "#d6d3d1",
    textMuted: "#78716c",
    accentPrimary: "#d97706",
    accentSecondary: "#f59e0b",
    glowColor: "rgba(217, 119, 6, 0.25)",
    badgeBg: "rgba(217, 119, 6, 0.12)",
    badgeText: "#fbbf24",
    badgeBorder: "rgba(217, 119, 6, 0.3)",
    sparklineColor: "#f59e0b",
    sparklineFill: "rgba(245, 158, 11, 0.15)",
    flamePrimary: "#f97316",
    flameSecondary: "#ef4444",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  vercel: {
    id: "vercel",
    name: "Vercel Clean",
    tagline: "Architectural monochrome high-contrast minimalism",
    isDark: true,
    bg: "#000000",
    cardBg: "#0a0a0a",
    cardBgAlt: "#121212",
    border: "#262626",
    borderHover: "#ffffff",
    textPrimary: "#ffffff",
    textSecondary: "#a3a3a3",
    textMuted: "#525252",
    accentPrimary: "#ffffff",
    accentSecondary: "#e5e5e5",
    glowColor: "rgba(255, 255, 255, 0.15)",
    badgeBg: "rgba(255, 255, 255, 0.08)",
    badgeText: "#ffffff",
    badgeBorder: "rgba(255, 255, 255, 0.2)",
    sparklineColor: "#ffffff",
    sparklineFill: "rgba(255, 255, 255, 0.1)",
    flamePrimary: "#ffffff",
    flameSecondary: "#a3a3a3",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  tokyo: {
    id: "tokyo",
    name: "Tokyo Twilight",
    tagline: "Midnight cyberpunk violet and neon electric cyan",
    isDark: true,
    bg: "#070a14",
    cardBg: "#0f1629",
    cardBgAlt: "#16203a",
    border: "#1f2d52",
    borderHover: "#a855f7",
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#64748b",
    accentPrimary: "#a855f7",
    accentSecondary: "#06b6d4",
    glowColor: "rgba(168, 85, 247, 0.25)",
    badgeBg: "rgba(168, 85, 247, 0.12)",
    badgeText: "#c084fc",
    badgeBorder: "rgba(168, 85, 247, 0.3)",
    sparklineColor: "#06b6d4",
    sparklineFill: "rgba(6, 182, 212, 0.15)",
    flamePrimary: "#a855f7",
    flameSecondary: "#06b6d4",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Flame",
    tagline: "High-voltage molten plasma and carbon fiber mesh",
    isDark: true,
    bg: "#0a0808",
    cardBg: "#140f0f",
    cardBgAlt: "#1f1515",
    border: "#331c1c",
    borderHover: "#ff0055",
    textPrimary: "#fff1f2",
    textSecondary: "#fda4af",
    textMuted: "#9f1239",
    accentPrimary: "#ff0055",
    accentSecondary: "#f59e0b",
    glowColor: "rgba(255, 0, 85, 0.3)",
    badgeBg: "rgba(255, 0, 85, 0.12)",
    badgeText: "#fb7185",
    badgeBorder: "rgba(255, 0, 85, 0.3)",
    sparklineColor: "#ff0055",
    sparklineFill: "rgba(255, 0, 85, 0.15)",
    flamePrimary: "#ff0055",
    flameSecondary: "#eab308",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  matrix: {
    id: "matrix",
    name: "Matrix Terminal",
    tagline: "Retro-futurist phosphor green phosphor telemetry",
    isDark: true,
    bg: "#030804",
    cardBg: "#071208",
    cardBgAlt: "#0c1e0e",
    border: "#133017",
    borderHover: "#22c55e",
    textPrimary: "#dcfce7",
    textSecondary: "#86efac",
    textMuted: "#166534",
    accentPrimary: "#22c55e",
    accentSecondary: "#4ade80",
    glowColor: "rgba(34, 197, 94, 0.25)",
    badgeBg: "rgba(34, 197, 94, 0.12)",
    badgeText: "#4ade80",
    badgeBorder: "rgba(34, 197, 94, 0.3)",
    sparklineColor: "#22c55e",
    sparklineFill: "rgba(34, 197, 94, 0.15)",
    flamePrimary: "#22c55e",
    flameSecondary: "#a3e635",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  paper: {
    id: "paper",
    name: "Editorial Paper (Light)",
    tagline: "Swiss design studio typography with crisp ivory paper",
    isDark: false,
    bg: "#f8fafc",
    cardBg: "#ffffff",
    cardBgAlt: "#f1f5f9",
    border: "#e2e8f0",
    borderHover: "#2563eb",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    accentPrimary: "#2563eb",
    accentSecondary: "#0284c7",
    glowColor: "rgba(37, 99, 235, 0.15)",
    badgeBg: "rgba(37, 99, 235, 0.08)",
    badgeText: "#1d4ed8",
    badgeBorder: "rgba(37, 99, 235, 0.2)",
    sparklineColor: "#2563eb",
    sparklineFill: "rgba(37, 99, 235, 0.1)",
    flamePrimary: "#2563eb",
    flameSecondary: "#f97316",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

export const DEFAULT_THEME_ID = "openai";

export function getTheme(themeId?: string | null): ThemePalette {
  if (!themeId || !THEMES[themeId]) {
    return THEMES[DEFAULT_THEME_ID];
  }
  return THEMES[themeId];
}
