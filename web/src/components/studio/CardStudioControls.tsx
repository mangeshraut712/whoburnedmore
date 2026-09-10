"use client";

import { Shield, Palette, Layout, Sliders } from "lucide-react";
import { THEMES } from "@/lib/theme-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type LayoutId = "hero" | "compact" | "tachometer";

type CardStudioControlsProps = {
  themeId: string;
  layout: LayoutId;
  privacy: boolean;
  showSparkline: boolean;
  showBreakdown: boolean;
  showStreak: boolean;
  onThemeChange: (id: string) => void;
  onLayoutChange: (layout: LayoutId) => void;
  onPrivacyChange: (value: boolean) => void;
  onSparklineChange: (value: boolean) => void;
  onBreakdownChange: (value: boolean) => void;
  onStreakChange: (value: boolean) => void;
};

/** Theme / layout / toggle controls for the custom SVG studio (handle lives in ShapeWorkshop). */
export function CardStudioControls({
  themeId,
  layout,
  privacy,
  showSparkline,
  showBreakdown,
  showStreak,
  onThemeChange,
  onLayoutChange,
  onPrivacyChange,
  onSparklineChange,
  onBreakdownChange,
  onStreakChange,
}: CardStudioControlsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Palette className="size-3.5 text-primary" />
            finish & palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.values(THEMES).map((th) => {
              const isSelected = themeId === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onThemeChange(th.id)}
                  className={cn(
                    "flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 ring-1 ring-primary/25"
                      : "border-border bg-background/40 hover:bg-background/70",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">{th.name}</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: th.bg }}
                      />
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: th.accentPrimary }}
                      />
                    </span>
                  </div>
                  <span className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                    {th.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Layout className="size-3.5 text-primary" />
            form factor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={layout}
            onValueChange={(value) => {
              if (value === "hero" || value === "compact" || value === "tachometer") {
                onLayoutChange(value);
              }
            }}
            variant="outline"
            className="grid w-full grid-cols-3"
          >
            {(
              [
                { id: "hero", label: "Banner", desc: "820×240" },
                { id: "compact", label: "Compact", desc: "460×150" },
                { id: "tachometer", label: "Tacho", desc: "540×210" },
              ] as const
            ).map((item) => (
              <ToggleGroupItem
                key={item.id}
                value={item.id}
                className="h-auto flex-col gap-0.5 rounded-lg px-2 py-2.5 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/15 data-[state=on]:text-white"
              >
                <span className="text-xs font-semibold">{item.label}</span>
                <span className="text-[10px] text-muted-foreground">{item.desc}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sliders className="size-3.5 text-primary" />
            toggles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              {
                id: "privacy",
                label: "Mask exact USD",
                hint: "Replace dollars with tier badge",
                checked: privacy,
                onChange: onPrivacyChange,
                icon: true,
              },
              {
                id: "spark",
                label: "7-day sparkline",
                hint: null,
                checked: showSparkline,
                onChange: onSparklineChange,
                icon: false,
              },
              {
                id: "breakdown",
                label: "Model stack bar",
                hint: null,
                checked: showBreakdown,
                onChange: onBreakdownChange,
                icon: false,
              },
              {
                id: "streak",
                label: "Show streak",
                hint: null,
                checked: showStreak,
                onChange: onStreakChange,
                icon: false,
              },
            ] as const
          ).map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3"
            >
              <div className="flex items-center gap-2.5">
                {row.icon && <Shield className="size-4 text-primary" />}
                <div>
                  <Label htmlFor={row.id} className="text-xs font-medium text-foreground">
                    {row.label}
                  </Label>
                  {row.hint && (
                    <p className="text-[11px] text-muted-foreground">{row.hint}</p>
                  )}
                </div>
              </div>
              <Switch id={row.id} checked={row.checked} onCheckedChange={row.onChange} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
