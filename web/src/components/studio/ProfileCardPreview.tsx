import React from "react";
import Image from "next/image";
import Link from "next/link";
import { renderShapeCard, CARD_SHAPES, type CardShape } from "@/lib/card-shapes";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { encodeSvgDataUri } from "@/lib/svg-data-uri";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/contracts";

type ProfileCardPreviewProps = {
  handle: string;
  shape?: CardShape;
  displayName?: string;
  rank?: number | null;
  totalTokens?: number;
  totalCostUSD?: number;
  streakDays?: number;
};

/**
 * Server-friendly read-only native card for a public profile.
 * Links to /studio for customization instead of embedding the full editor.
 */
export function ProfileCardPreview({
  handle,
  shape = "landscape",
  displayName,
  rank,
  totalTokens,
  totalCostUSD,
  streakDays,
}: ProfileCardPreviewProps) {
  const safeHandle = handle.replace(/^@/, "") || "your-handle";
  const profile: UserProfile = {
    ...MOCK_PROFILE,
    handle: safeHandle,
    displayName: displayName || safeHandle,
    rank: rank ?? MOCK_PROFILE.rank,
    totals: {
      ...MOCK_PROFILE.totals,
      tokens: totalTokens ?? MOCK_PROFILE.totals.tokens,
      costUSD: totalCostUSD ?? MOCK_PROFILE.totals.costUSD,
      streakDays: streakDays ?? MOCK_PROFILE.totals.streakDays,
    },
  };
  const svg = renderShapeCard(profile, shape);
  const previewSrc = encodeSvgDataUri(svg);
  const spec = CARD_SHAPES[shape];
  const cardUrl = `/api/card/${encodeURIComponent(safeHandle)}/${shape}.png`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center overflow-x-auto rounded-2xl border border-border bg-background/80 p-6">
        <Image
          src={previewSrc}
          alt={`whoburnedmore ${spec.label} card for @${safeHandle}`}
          width={spec.width}
          height={spec.height}
          unoptimized
          className="h-auto max-h-[420px] w-auto max-w-full object-contain"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <code className="truncate font-mono text-xs text-muted-foreground">
          {cardUrl}
        </code>
        <Button asChild size="sm" variant="outline">
          <Link href={`/studio?handle=${encodeURIComponent(safeHandle)}`}>
            customize in card studio
          </Link>
        </Button>
      </div>
    </div>
  );
}
