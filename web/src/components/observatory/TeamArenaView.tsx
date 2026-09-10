import React from "react";
import { formatTokens, formatUSD, type OrganizationSummary } from "@/lib/contracts";
import { MOCK_ORGANIZATION } from "@/lib/efficiency";
import { Users, Flame, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function orgFromSlug(slug?: string): OrganizationSummary {
  if (!slug || slug === MOCK_ORGANIZATION.slug) return MOCK_ORGANIZATION;
  const name = slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return {
    ...MOCK_ORGANIZATION,
    slug,
    name: name || MOCK_ORGANIZATION.name,
  };
}

export function TeamArenaView({ slug }: { slug?: string }) {
  const org = orgFromSlug(slug);

  return (
    <Card className="border-border bg-card/50 shadow-none">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Users className="size-3.5" />
            team board
          </div>
          <CardTitle className="mt-1 text-xl">{org.name}</CardTitle>
          <CardDescription className="mt-1">
            Aggregated burn velocity and roster rankings for this board.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
            {org.type}
          </Badge>
          <Badge variant="outline">{org.memberCount} builders</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">team total burn</div>
            <div className="mt-2 font-mono text-3xl font-bold text-primary tnum">
              {formatTokens(org.totalTokens)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">estimated cost</div>
            <div className="mt-2 font-mono text-3xl font-bold tnum">
              {formatUSD(org.totalCostUSD)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-xs text-muted-foreground">top tool</div>
            <div className="mt-2 text-2xl font-semibold capitalize">{org.topTool}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{org.topModel}</div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {org.members.map((member) => (
            <div
              key={member.handle}
              className="flex items-center gap-3 rounded-lg border border-border bg-background/30 px-3 py-3"
            >
              <span className="tnum w-6 font-mono text-sm text-muted-foreground">
                {member.rank}
              </span>
              <Avatar className="size-8 ring-1 ring-border">
                <AvatarImage src={member.avatarUrl || undefined} alt="" />
                <AvatarFallback>{member.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {member.displayName || member.handle}
                  {member.verified && <CheckCircle2 className="size-3.5 text-primary" />}
                </div>
                <div className="text-[11px] text-muted-foreground">@{member.handle}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-primary tnum">
                  {formatTokens(member.totalTokens)}
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Flame className="size-3 text-primary" />
                  {member.streakDays}d
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
