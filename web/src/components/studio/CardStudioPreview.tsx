"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Check, Sparkles } from "lucide-react";
import { encodeSvgDataUri } from "@/lib/svg-data-uri";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ExportTab = "markdown" | "url" | "html";

type CardStudioPreviewProps = {
  liveSvgMarkup: string;
  svgUrl: string;
  markdownCode: string;
  htmlEmbed: string;
};

export function CardStudioPreview({
  liveSvgMarkup,
  svgUrl,
  markdownCode,
  htmlEmbed,
}: CardStudioPreviewProps) {
  const [exportTab, setExportTab] = useState<ExportTab>("markdown");
  const { copied, copy } = useClipboard(2000);

  const previewSrc = useMemo(
    () => encodeSvgDataUri(liveSvgMarkup),
    [liveSvgMarkup],
  );

  const activeText =
    exportTab === "markdown" ? markdownCode : exportTab === "url" ? svgUrl : htmlEmbed;

  return (
    <Card className="border-border bg-card/50 shadow-none">
      <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-4 text-primary" />
          live preview
        </CardTitle>
        <CardDescription className="font-mono text-xs">vector svg</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center overflow-x-auto rounded-xl border border-border bg-background/80 p-6">
          <Image
            src={previewSrc}
            alt="whoburnedmore custom card preview"
            width={820}
            height={420}
            unoptimized
            className="max-h-[420px] w-full max-w-full object-contain"
          />
        </div>

        <Tabs
          value={exportTab}
          onValueChange={(value) => {
            if (value === "markdown" || value === "url" || value === "html") {
              setExportTab(value);
            }
          }}
          className="mt-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="h-10 rounded-xl bg-background/60">
              <TabsTrigger value="markdown">readme</TabsTrigger>
              <TabsTrigger value="url">svg url</TabsTrigger>
              <TabsTrigger value="html">html</TabsTrigger>
            </TabsList>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void copy(activeText)}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-primary" />
                  copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  copy snippet
                </>
              )}
            </Button>
          </div>

          <TabsContent value="markdown" className="mt-4">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
              {markdownCode}
            </pre>
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
              {svgUrl}
            </pre>
          </TabsContent>
          <TabsContent value="html" className="mt-4">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
              {htmlEmbed}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
