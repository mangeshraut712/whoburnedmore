import { describe, expect, it } from "vitest";
import { renderSvgCard } from "../lib/svg-builder";
import { MOCK_PROFILE } from "../lib/mock-data";
import { THEMES } from "../lib/theme-config";
import { simulateModelSubstitution } from "../lib/simulator";
import { formatTokens, formatUSD, getBurnTier } from "../lib/contracts";

describe("WhoBurnedMore SVG Card Generator Engine", () => {
  it("renders valid hero SVG with required elements", () => {
    const svg = renderSvgCard(MOCK_PROFILE, { layout: "hero", themeId: "openai" });
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("mangeshraut712");
    expect(svg).toContain("LIFETIME BURN");
    expect(svg).toContain("MODELS");
  });

  it("renders all 7 curated themes cleanly", () => {
    for (const themeId of Object.keys(THEMES)) {
      const svg = renderSvgCard(MOCK_PROFILE, { themeId });
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    }
  });

  it("masks exact USD spend when privacy mode is enabled", () => {
    const nonPrivateSvg = renderSvgCard(MOCK_PROFILE, { privacy: false });
    const privateSvg = renderSvgCard(MOCK_PROFILE, { privacy: true });

    expect(nonPrivateSvg).toContain("EST. SPEND");
    expect(privateSvg).toContain("BURN TIER");
    expect(privateSvg).toContain("Token Furnace");
  });

  it("renders compact and tachometer card layout archetypes", () => {
    const compactSvg = renderSvgCard(MOCK_PROFILE, { layout: "compact" });
    expect(compactSvg).toContain("width=\"460\"");
    expect(compactSvg).toContain("TOTAL BURN");

    const tachometerSvg = renderSvgCard(MOCK_PROFILE, { layout: "tachometer" });
    expect(tachometerSvg).toContain("width=\"540\"");
    expect(tachometerSvg).toContain("BURN VELOCITY TACHOMETER");
  });
});

describe("Financial Optimizer Simulator", () => {
  it("calculates realistic savings and extended runway", () => {
    const sim = simulateModelSubstitution(100_000_000, "claude-3-7-sonnet", "gpt-5-mini", 0.3);
    expect(sim.currentMonthlyCostUSD).toBeGreaterThan(0);
    expect(sim.projectedMonthlyCostUSD).toBeLessThan(sim.currentMonthlyCostUSD);
    expect(sim.monthlySavingsUSD).toBeGreaterThan(0);
    expect(sim.savingsPercentage).toBeGreaterThan(0);
    expect(sim.extendedRunwayDays).toBeGreaterThan(0);
  });
});

describe("Formatters and Tiers", () => {
  it("formats tokens cleanly", () => {
    expect(formatTokens(1_500_000_000)).toBe("1.50B");
    expect(formatTokens(45_200_000)).toBe("45.2M");
    expect(formatTokens(850_000)).toBe("850k");
  });

  it("determines correct burn tiers", () => {
    expect(getBurnTier(2_000_000_000).tier).toBe("GigaBurner");
    expect(getBurnTier(300_000_000).tier).toBe("Token Furnace");
    expect(getBurnTier(60_000_000).tier).toBe("Prompt Architect");
  });
});
