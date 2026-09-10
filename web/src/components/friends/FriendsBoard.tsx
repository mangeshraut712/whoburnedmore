import React from "react";
import { Flame } from "lucide-react";
import { formatTokens, formatUSD } from "@/lib/contracts";
import { FRIENDS_DEMO } from "@/lib/friends-demo";
import { relativeActivity } from "@/components/leaderboard/leaderboard-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FriendsBoard() {
  return (
    <Card className="overflow-hidden border-border bg-card/50 shadow-none">
      <Table>
        <TableHeader>
          <TableRow className="border-border/70 hover:bg-transparent">
            {["#", "dev", "tokens", "cost", "top tool", "updated"].map((head) => (
              <TableHead
                key={head}
                className="h-auto pb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {FRIENDS_DEMO.map((entry) => (
            <TableRow key={entry.handle} className="border-border/70">
              <TableCell className="font-mono text-sm text-muted-foreground">
                #{entry.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 ring-1 ring-border">
                    <AvatarImage src={entry.avatarUrl || undefined} alt="" />
                    <AvatarFallback>{entry.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{entry.displayName}</div>
                    {entry.handle === "you" && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] uppercase">
                        you
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm font-bold text-primary tnum">
                {formatTokens(entry.totalTokens)}
              </TableCell>
              <TableCell className="font-mono text-sm tnum">
                {formatUSD(entry.totalCostUSD)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal capitalize">
                  {entry.topTool}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3 text-primary" />
                  {relativeActivity(entry.lastCodedAt)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
