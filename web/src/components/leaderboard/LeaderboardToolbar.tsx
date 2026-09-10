"use client";

import React from "react";
import { History, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { HistoryDate, Period } from "./leaderboard-utils";

type LeaderboardToolbarProps = {
  period: Period;
  onPeriodChange: (period: Period) => void;
  toolFilter: string;
  onToolFilterChange: (tool: string) => void;
  onSearchChange: (query: string) => void;
  historyDate: HistoryDate;
  onHistoryDateChange: (date: HistoryDate) => void;
};

export function LeaderboardToolbar({
  period,
  onPeriodChange,
  toolFilter,
  onToolFilterChange,
  onSearchChange,
  historyDate,
  onHistoryDateChange,
}: LeaderboardToolbarProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/90 px-4 py-2 backdrop-blur-md sm:px-5 lg:px-6">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value) => {
            if (value === "daily" || value === "weekly" || value === "all") {
              onPeriodChange(value);
            }
          }}
          variant="outline"
          spacing={0}
          aria-label="time period"
          className="h-11 min-w-0 max-w-[23rem] flex-1 rounded-xl bg-card/60 p-1.5 shadow-sm ring-1 ring-border"
        >
          {(
            [
              { id: "daily", label: "daily" },
              { id: "weekly", label: "weekly" },
              { id: "all", label: "all time" },
            ] as const
          ).map((opt) => (
            <ToggleGroupItem
              key={opt.id}
              value={opt.id}
              className="flex-1 rounded-md border border-transparent px-3 py-1 text-sm font-semibold text-muted-foreground data-[state=on]:border-primary/40 data-[state=on]:bg-primary/15 data-[state=on]:text-white data-[state=on]:shadow-[0_2px_12px_-6px_var(--burn)]"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="browse past daily leaderboards"
              className="size-9 text-muted-foreground"
            >
              <History className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 space-y-3">
            <div className="text-sm font-semibold">past daily boards</div>
            <div className="space-y-1">
              {(["today", "yesterday", "2 days ago", "3 days ago"] as const).map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={historyDate === d ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onHistoryDateChange(d);
                    onPeriodChange("daily");
                  }}
                >
                  {d}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Daily ranks recompute for the {historyDate} snapshot.
            </p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="filter the board"
              className="size-9 text-muted-foreground"
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 space-y-3">
            <div className="text-sm font-semibold">filter the board</div>
            <Input
              placeholder="search handle…"
              aria-label="Search handle"
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8"
            />
            <div className="flex flex-wrap gap-2">
              {(["all", "claude", "codex", "cursor", "gemini", "opencode"] as const).map(
                (tool) => (
                  <Button
                    key={tool}
                    type="button"
                    size="sm"
                    variant={toolFilter === tool ? "default" : "outline"}
                    onClick={() => onToolFilterChange(tool)}
                  >
                    {tool}
                  </Button>
                ),
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto hidden shrink-0 lg:block">
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {historyDate === "today" ? "live" : historyDate}
          </Badge>
        </div>
      </div>
    </div>
  );
}
