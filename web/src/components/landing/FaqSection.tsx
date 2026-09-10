"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "What is whoburnedmore?",
    a: "whoburnedmore, formerly BurnBar, is a free, open-source AI token leaderboard. Run npx whoburnedmore and it reads the local usage logs your AI coding agents already keep, shows a detailed breakdown of your token burn, and ranks token use across the public board and your friends.",
  },
  {
    q: 'Is it "who burned more" or "whoburnedmore"?',
    a: "BurnBar is the former macOS app name. The whoburnedmore.com domain and npx whoburnedmore command remain unchanged, so existing links, installs, and accounts keep working.",
  },
  {
    q: "How do I see who burned more AI tokens, me or my friends?",
    a: "Run npx whoburnedmore, sign in, and create a friends board — a private leaderboard that compares who burned more AI coding tokens this week across Claude Code, Codex, Gemini CLI, Cursor and more.",
  },
  {
    q: "Which AI coding tools does whoburnedmore track?",
    a: "Claude Code, Codex CLI, Gemini CLI, Cursor, GitHub Copilot, OpenCode, Amp, Droid, Goose, Kimi, Qwen and 20+ other coding agents — anything that keeps local usage logs on your machine.",
  },
  {
    q: "Is whoburnedmore free, and what data does it collect?",
    a: "It is free and open source. The standard command submits daily usage aggregates, never your code, prompts, or chat history. Run it with --local and decline the optional publish offer to keep the report on your machine.",
  },
] as const;

export function FaqSection() {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        faq
      </div>
      <Accordion type="single" collapsible defaultValue="item-0" className="mt-1">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`} className="border-border/80">
            <AccordionTrigger className="py-2.5 text-sm hover:no-underline [&>svg]:hidden">
              <span className="flex items-start gap-2 pr-2 text-left">
                <span className="mt-0.5 font-mono text-muted-foreground group-aria-expanded/accordion-trigger:hidden">
                  +
                </span>
                <span className="mt-0.5 hidden font-mono text-muted-foreground group-aria-expanded/accordion-trigger:inline">
                  −
                </span>
                <span>{item.q}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-5 text-xs leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
