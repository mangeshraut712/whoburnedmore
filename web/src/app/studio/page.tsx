import React, { Suspense } from "react";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { ShapeWorkshop } from "@/components/studio/ShapeWorkshop";
import { CardStudio } from "@/components/studio/CardStudio";
import { CardDocs } from "@/components/studio/CardDocs";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "card studio — whoburnedmore",
  description:
    "Put the burn in your README. Official share cards in three shapes plus a custom SVG studio.",
};

function StudioFallback() {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-8 text-sm text-muted-foreground">
      Loading card studio…
    </div>
  );
}

export default function StudioPage() {
  return (
    <SiteChrome active="cards">
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          official share cards, on demand
        </p>
        <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          <span className="text-foreground">Put the burn</span>{" "}
          <span className="text-primary">in your README.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Enter any public handle, select a shape, then drop the URL into a README,
          issue, or profile page.
        </p>
      </div>

      <Suspense fallback={<StudioFallback />}>
        <ShapeWorkshop />
      </Suspense>

      <Separator className="my-12" />

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          custom studio
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Design your own vector card.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Seven curated themes, three form factors, privacy masking, and live toggles.
          Uses the same handle from the workshop above.
        </p>
      </div>

      <Suspense fallback={<StudioFallback />}>
        <CardStudio />
      </Suspense>

      <Separator className="my-12" />

      <CardDocs />
    </SiteChrome>
  );
}
