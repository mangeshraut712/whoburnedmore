import { NextRequest, NextResponse } from "next/server";
import { renderSvgCard } from "@/lib/svg-builder";
import { resolveProfile } from "@/lib/profile-resolver";

export const runtime = "nodejs";

/**
 * Custom studio SVG endpoint:
 *   GET /api/card/{handle}?theme=…&layout=…&privacy=1&sparkline=0…
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const searchParams = request.nextUrl.searchParams;

  const themeId = searchParams.get("theme") || "openai";
  const layout = (searchParams.get("layout") as "hero" | "compact" | "tachometer") || "hero";
  const privacy = searchParams.get("privacy") === "1" || searchParams.get("privacy") === "true";
  const showSparkline = searchParams.get("sparkline") !== "0";
  const showBreakdown = searchParams.get("breakdown") !== "0";
  const showStreak = searchParams.get("streak") !== "0";

  const profile = await resolveProfile(handle);

  const svgContent = renderSvgCard(profile, {
    themeId,
    layout,
    privacy,
    showSparkline,
    showBreakdown,
    showStreak,
  });

  return new NextResponse(svgContent, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
