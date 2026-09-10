"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Copy, Check, Link2 } from "lucide-react";
import { CARD_SHAPES, renderShapeCard, type CardShape } from "@/lib/card-shapes";
import { MOCK_PROFILE } from "@/lib/mock-data";
import { HANDLE_PATTERN } from "@/lib/profile-resolver";
import { encodeSvgDataUri } from "@/lib/svg-data-uri";
import { useCardStudioStore } from "@/stores/card-studio-store";
import { useClipboard } from "@/hooks/use-clipboard";
import { useClientOrigin } from "@/hooks/use-client-origin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type CardFormat = "png" | "svg";

/**
 * Official card workshop: pick a handle and a shape, preview the native card,
 * copy the stable image URL or README snippet.
 */
export function ShapeWorkshop() {
  const searchParams = useSearchParams();
  const handle = useCardStudioStore((s) => s.handle);
  const setHandle = useCardStudioStore((s) => s.setHandle);
  const [shape, setShape] = useState<CardShape>("landscape");
  const [format, setFormat] = useState<CardFormat>("png");
  const { copied, copy } = useClipboard(2000);
  const [copiedKind, setCopiedKind] = useState<"url" | "readme" | null>(null);
  const origin = useClientOrigin();

  useEffect(() => {
    const raw = searchParams.get("handle");
    if (!raw) return;
    const next = raw.trim().replace(/^@/, "");
    if (next) setHandle(next);
  }, [searchParams, setHandle]);

  useEffect(() => {
    if (!copied) setCopiedKind(null);
  }, [copied]);

  const handleValid = HANDLE_PATTERN.test(handle);
  const safeHandle = handleValid ? handle : "your-handle";

  const previewSrc = useMemo(() => {
    const markup = renderShapeCard(
      { ...MOCK_PROFILE, handle: safeHandle, displayName: safeHandle },
      shape,
    );
    return encodeSvgDataUri(markup);
  }, [safeHandle, shape]);

  const cardUrl = `${origin}/api/card/${encodeURIComponent(safeHandle)}/${shape}.${format}`;
  const readmeSnippet = `<a href="https://whoburnedmore.com/u/${safeHandle}">
  <img
    src="${cardUrl}"
    alt="whoburnedmore card for @${safeHandle}"
  />
</a>`;

  const copyText = async (text: string, which: "url" | "readme") => {
    const ok = await copy(text);
    if (ok) setCopiedKind(which);
  };

  const spec = CARD_SHAPES[shape];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-5">
        <div className="wbm-panel rounded-2xl border border-border bg-card/50 p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            whoburnedmore handle
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">@</span>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value.trim().replace(/^@/, ""))}
              placeholder="your-handle"
              className="font-mono"
              aria-label="whoburnedmore handle"
            />
          </div>
          <p
            className={cn(
              "mt-2 text-[11px]",
              handleValid ? "text-muted-foreground" : "text-primary",
            )}
          >
            Public profiles only. Use letters, numbers, hyphens, and underscores.
          </p>
        </div>

        <div className="wbm-panel rounded-2xl border border-border bg-card/50 p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            same signal. different footprint.
          </div>
          <ToggleGroup
            type="single"
            value={shape}
            onValueChange={(value) => {
              if (value === "landscape" || value === "hero" || value === "report") {
                setShape(value);
              }
            }}
            variant="outline"
            className="mt-3 grid w-full grid-cols-3"
            aria-label="card shape"
          >
            {Object.values(CARD_SHAPES).map((s) => (
              <ToggleGroupItem
                key={s.id}
                value={s.id}
                className="h-auto flex-col gap-0.5 rounded-lg px-2 py-2.5 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/15 data-[state=on]:text-white"
              >
                <span className="text-xs font-semibold">{s.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {s.pngWidth}×{s.pngHeight}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="mt-2 text-[11px] text-muted-foreground">{spec.blurb}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              format
            </span>
            <Tabs
              value={format}
              onValueChange={(value) => {
                if (value === "png" || value === "svg") setFormat(value);
              }}
            >
              <TabsList className="h-8 rounded-lg bg-background/60">
                <TabsTrigger value="png" className="px-3 text-xs">
                  png
                </TabsTrigger>
                <TabsTrigger value="svg" className="px-3 text-xs">
                  svg
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="wbm-panel rounded-2xl border border-border bg-card/50 p-5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Link2 className="size-3.5 text-primary" />
            stable image url
          </div>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted-foreground">
            {cardUrl}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => void copyText(cardUrl, "url")}
              className="gap-1.5"
            >
              {copiedKind === "url" ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copiedKind === "url" ? "copied" : "copy url"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void copyText(readmeSnippet, "readme")}
              className="gap-1.5"
            >
              {copiedKind === "readme" ? (
                <Check className="size-3.5 text-primary" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copiedKind === "readme" ? "copied" : "copy readme snippet"}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="wbm-panel flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-background/80 p-6">
          <Image
            src={previewSrc}
            alt={`whoburnedmore ${spec.label} card preview for @${safeHandle}`}
            width={spec.width}
            height={spec.height}
            unoptimized
            className="h-auto max-h-[560px] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          live preview · served from{" "}
          <span className="font-mono">
            /api/card/{safeHandle}/{shape}.{format}
          </span>{" "}
          with a 15-minute CDN cache
        </p>
      </div>
    </div>
  );
}
