import { UserProfile } from "./contracts";
import { MOCK_PROFILE } from "./mock-data";

export const HANDLE_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * Resolves a profile for card rendering: attempts the live whoburnedmore.com
 * profile API, falling back to the local mock profile re-labelled with the
 * requested handle (private or unknown profiles).
 */
export async function resolveProfile(handle: string): Promise<UserProfile> {
  let profile: UserProfile = { ...MOCK_PROFILE, handle: handle || "mangeshraut712" };

  if (handle && handle !== "mangeshraut712" && handle !== "demo") {
    try {
      const res = await fetch(
        `https://whoburnedmore.com/api/u/${encodeURIComponent(handle)}`,
        {
          headers: { "User-Agent": "whoburnedmore-card-studio/2.0" },
          next: { revalidate: 300 },
        },
      );
      if (res.ok) {
        const live = await res.json();
        if (live && live.totals) {
          profile = {
            ...profile,
            handle: live.handle || handle,
            displayName: live.displayName || live.handle || handle,
            avatarUrl: live.avatarUrl || null,
            rank: live.rank ?? null,
            totals: {
              tokens: live.totals.tokens ?? 0,
              costUSD: live.totals.costUSD ?? 0,
              inputTokens: live.totals.inputTokens ?? 0,
              outputTokens: live.totals.outputTokens ?? 0,
              cacheCreationTokens: live.totals.cacheCreationTokens ?? 0,
              cacheReadTokens: live.totals.cacheReadTokens ?? 0,
              days: live.totals.days ?? 1,
              streakDays: live.totals.streakDays ?? 0,
            },
            byModel: live.byModel ?? profile.byModel,
            byTool: live.byTool ?? profile.byTool,
            spark7d: live.spark7d ?? profile.spark7d,
          };
        }
      }
    } catch {
      // Fall back to the local profile on network timeout or private profile.
    }
  }

  return profile;
}
