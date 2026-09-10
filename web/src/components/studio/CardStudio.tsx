"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCardStudioStore } from "@/stores/card-studio-store";
import { renderSvgCard } from "@/lib/svg-builder";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { useClientOrigin } from "@/hooks/use-client-origin";
import { CardStudioControls } from "./CardStudioControls";
import { CardStudioPreview } from "./CardStudioPreview";

export const CardStudio: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    themeId,
    layout,
    privacy,
    showSparkline,
    showBreakdown,
    showStreak,
    handle,
    setThemeId,
    setLayout,
    setPrivacy,
    setShowSparkline,
    setShowBreakdown,
    setShowStreak,
    setHandle,
  } = useCardStudioStore();

  const origin = useClientOrigin();

  useEffect(() => {
    const raw = searchParams.get("handle");
    if (!raw) return;
    const next = raw.trim().replace(/^@/, "");
    if (next) setHandle(next);
  }, [searchParams, setHandle]);

  const queryHandle = searchParams.get("handle")?.trim().replace(/^@/, "") || "";
  const effectiveHandle = queryHandle || handle;

  const previewProfile = {
    ...MOCK_PROFILE,
    handle: effectiveHandle,
    displayName: effectiveHandle,
  };
  const liveSvgMarkup = renderSvgCard(previewProfile, {
    themeId,
    layout,
    privacy,
    showSparkline,
    showBreakdown,
    showStreak,
  });

  const params = new URLSearchParams();
  params.set("theme", themeId);
  params.set("layout", layout);
  if (privacy) params.set("privacy", "1");
  if (!showSparkline) params.set("sparkline", "0");
  if (!showBreakdown) params.set("breakdown", "0");
  if (!showStreak) params.set("streak", "0");
  const svgUrl = `${origin}/api/card/${encodeURIComponent(effectiveHandle)}?${params.toString()}`;
  const markdownCode = `<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${svgUrl}" />
    <img alt="whoburnedmore card for @${effectiveHandle}" width="820" src="${svgUrl}" />
  </picture>
</p>`;
  const htmlEmbed = `<img src="${svgUrl}" alt="whoburnedmore card for @${effectiveHandle}" />`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <CardStudioControls
          themeId={themeId}
          layout={layout}
          privacy={privacy}
          showSparkline={showSparkline}
          showBreakdown={showBreakdown}
          showStreak={showStreak}
          onThemeChange={setThemeId}
          onLayoutChange={setLayout}
          onPrivacyChange={setPrivacy}
          onSparklineChange={setShowSparkline}
          onBreakdownChange={setShowBreakdown}
          onStreakChange={setShowStreak}
        />
      </div>
      <div className="lg:col-span-7">
        <CardStudioPreview
          liveSvgMarkup={liveSvgMarkup}
          svgUrl={svgUrl}
          markdownCode={markdownCode}
          htmlEmbed={htmlEmbed}
        />
      </div>
    </div>
  );
};
