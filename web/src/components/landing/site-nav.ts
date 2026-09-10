export const SITE_NAV = [
  { href: "/", label: "leaderboard" },
  { href: "/install", label: "install" },
  { href: "/friends", label: "my friends" },
  { href: "/studio", label: "cards" },
  { href: "/dashboard", label: "dashboard" },
] as const;

export type SiteNavLabel = (typeof SITE_NAV)[number]["label"];
