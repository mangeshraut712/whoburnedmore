import React from "react";
import { CARD_SHAPES } from "@/lib/card-shapes";

/**
 * Endpoint documentation for the official share cards.
 */
export function CardDocs() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          official cards. documented.
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          One image tag, for every README.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          GitHub requests the image, the endpoint renders the native card, and a
          15-minute CDN cache keeps the README fresh and inexpensive. Cards are
          rendered on demand — no screenshots, no browser farm, no preparation step.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Object.values(CARD_SHAPES).map((s) => (
          <div key={s.id} className="wbm-panel rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{s.label}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {s.pngWidth}×{s.pngHeight}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.blurb}</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
              /api/card/HANDLE/{s.id}.png
            </pre>
          </div>
        ))}
      </div>

      <div className="wbm-panel rounded-2xl border border-border bg-card/50 p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          readme markup
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`<p align="center">
  <a href="https://whoburnedmore.com/u/your-handle">
    <img
      src="/api/card/your-handle/landscape.png"
    />
  </a>
</p>`}
        </pre>
        <p className="mt-3 text-xs text-muted-foreground">
          Use the same URL pattern with <span className="font-mono">hero.png</span> or{" "}
          <span className="font-mono">report.png</span>. Append{" "}
          <span className="font-mono">.svg</span> instead of{" "}
          <span className="font-mono">.png</span> for a crisp vector embed. Invalid or
          private handles return a readable image error, never a broken tag.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/30 p-5">
          <div className="text-sm font-semibold text-foreground">The native card.</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Rendered from the profile&apos;s own telemetry with the site&apos;s burn
            identity — never rebuilt from guessed stats.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/30 p-5">
          <div className="text-sm font-semibold text-foreground">For every public profile.</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            The endpoint resolves live profile data from whoburnedmore.com and falls
            back gracefully when a profile is private.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/30 p-5">
          <div className="text-sm font-semibold text-foreground">One stable image.</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            A 15-minute CDN cache keeps READMEs refreshed and inexpensive, with
            stale-while-revalidate for instant loads.
          </p>
        </div>
      </div>
    </section>
  );
}
