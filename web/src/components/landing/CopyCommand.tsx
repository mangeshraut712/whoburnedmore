"use client";

import { Copy, Check } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_COMMAND = "npx whoburnedmore@latest";

export function CopyCommand({
  command = DEFAULT_COMMAND,
  className,
}: {
  command?: string;
  className?: string;
}) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => void copy(command)}
      className={cn(
        "npx-command h-auto w-full justify-start gap-3 rounded-lg border-transparent bg-card/60 px-4 py-3 font-mono text-base font-normal text-foreground hover:border-primary/30 hover:bg-card/80",
        className,
      )}
      aria-label={`Copy $ ${command}`}
    >
      <span className="truncate">
        <span className="text-muted-foreground">$ </span>
        {command}
      </span>
      {copied ? (
        <Check className="ml-auto size-4 shrink-0 text-primary" />
      ) : (
        <Copy className="ml-auto size-4 shrink-0 text-muted-foreground" />
      )}
    </Button>
  );
}
