export const CLI_COMMAND = "npx whoburnedmore@latest";
export const CLI_LOCAL = "npx whoburnedmore --local";
export const CLI_DRY_RUN = "npx whoburnedmore --dry-run";
export const CLI_UNINSTALL_SYNC = "npx whoburnedmore uninstall-sync";

export const TRACKED_TOOLS = [
  "Claude Code",
  "Codex CLI",
  "Gemini CLI",
  "Cursor",
  "GitHub Copilot",
  "OpenCode",
  "Amp",
  "Droid",
  "Goose",
  "Kimi",
  "Qwen",
] as const;

export const PAYLOAD_FIELDS = [
  { id: "input", label: "input tokens" },
  { id: "output", label: "output tokens" },
  { id: "cache-write", label: "cache-write tokens" },
  { id: "cache-read", label: "cache-read tokens" },
  { id: "cost", label: "estimated cost" },
  { id: "date", label: "date" },
] as const;

export const NEVER_LEAVES = [
  "prompts",
  "code",
  "file names",
  "project names",
  "repo names",
  "generated text",
] as const;

export const DEEP_DIVES = [
  { href: "/guides/check-ai-token-usage", label: "check AI token usage" },
  { href: "/guides/ai-coding-token-leaderboard", label: "AI coding token leaderboard" },
  { href: "/guides/ccusage-alternative", label: "ccusage alternative" },
  {
    href: "/guides/ccusage-vs-tokscale-vs-whoburnedmore",
    label: "ccusage vs tokscale",
  },
  { href: "/state-of-ai-coding-token-usage", label: "state of AI coding usage" },
] as const;

export const SIDEBAR_LINKS = [
  { href: "https://x.com/arhamamiin", label: "built by @arhamamiin", external: true },
  { href: "https://arhamamin.com", label: "arhamamin.com", external: true },
  { href: "https://github.com/arhxam/whoburnedmore", label: "GitHub repo", external: true },
  { href: "https://x.com/whoburnedmore", label: "X @whoburnedmore", external: true },
  { href: "/trust", label: "data + trust", external: false },
  { href: "/privacy", label: "privacy", external: false },
  { href: "/terms", label: "terms", external: false },
  { href: "/for-teams", label: "teams", external: false },
  { href: "/studio", label: "card studio", external: false },
  { href: "/contact", label: "contact", external: false },
] as const;
