import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { CARD_SHAPES, isCardShape, renderShapeCard } from "@/lib/card-shapes";
import { HANDLE_PATTERN, resolveProfile } from "@/lib/profile-resolver";

export const runtime = "nodejs";

const CACHE_HEADER = "public, max-age=300, s-maxage=900, stale-while-revalidate=3600";

function imageError(message: string, status: number): NextResponse {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120">
  <rect x="1" y="1" width="598" height="118" rx="14" fill="#050505" stroke="#232323" stroke-width="1.5" />
  <text x="24" y="52" fill="#ff6a00" font-size="16" font-weight="700" font-family="system-ui, sans-serif">whoburnedmore cards</text>
  <text x="24" y="82" fill="#8f8f8f" font-size="13" font-family="ui-monospace, monospace">${message}</text>
</svg>`;
  return new NextResponse(svg, {
    status,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

/**
 * Official share-card endpoint:
 *   GET /api/card/{handle}/{landscape|hero|report}.{png|svg}
 * Serves the native card as a stable image with a 15-minute CDN cache.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ handle: string; style: string }> },
) {
  const { handle, style } = await params;

  const dot = style.lastIndexOf(".");
  const shape = dot === -1 ? style : style.slice(0, dot);
  const ext = dot === -1 ? "png" : style.slice(dot + 1);

  if (!HANDLE_PATTERN.test(handle)) {
    return imageError("Invalid handle. Use letters, numbers, hyphens, underscores.", 404);
  }
  if (!isCardShape(shape) || (ext !== "png" && ext !== "svg")) {
    return imageError(`Unknown card style "${style}". Try landscape.png, hero.png, or report.png.`, 404);
  }

  const profile = await resolveProfile(handle);
  const svgContent = renderShapeCard(profile, shape);

  if (ext === "svg") {
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": CACHE_HEADER,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const { pngWidth } = CARD_SHAPES[shape];
  const png = await sharp(Buffer.from(svgContent), { density: 192 })
    .resize(pngWidth)
    .png()
    .toBuffer();

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "inline",
      "Cache-Control": CACHE_HEADER,
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
