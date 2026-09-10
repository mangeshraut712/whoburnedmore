import { describe, expect, it } from "vitest";
import {
  CARD_SHAPES,
  isCardShape,
  renderShapeCard,
  thirtyDaySeries,
} from "../lib/card-shapes";
import { MOCK_PROFILE } from "../lib/mock-data";

describe("Official card shapes (wbm-card parity)", () => {
  it("renders all three shapes as valid SVG with core telemetry", () => {
    for (const spec of Object.values(CARD_SHAPES)) {
      const svg = renderShapeCard(MOCK_PROFILE, spec.id);
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      expect(svg).toContain(`width="${spec.width}"`);
      expect(svg).toContain(`height="${spec.height}"`);
      expect(svg).toContain("whoburnedmore.com");
      expect(svg).toContain("npx whoburnedmore");
    }
  });

  it("matches the original wbm-card PNG dimensions", () => {
    expect(CARD_SHAPES.landscape.pngWidth).toBe(1800);
    expect(CARD_SHAPES.landscape.pngHeight).toBe(1350);
    expect(CARD_SHAPES.hero.pngWidth).toBe(1380);
    expect(CARD_SHAPES.hero.pngHeight).toBe(1380);
    expect(CARD_SHAPES.report.pngWidth).toBe(1224);
    expect(CARD_SHAPES.report.pngHeight).toBe(1530);
  });

  it("shows the handle and rank on every shape", () => {
    for (const spec of Object.values(CARD_SHAPES)) {
      const svg = renderShapeCard(MOCK_PROFILE, spec.id);
      expect(svg).toContain("mangeshra");
      expect(svg).toContain(`#${MOCK_PROFILE.rank}`);
    }
  });

  it("escapes XML-sensitive characters in handles", () => {
    const svg = renderShapeCard(
      { ...MOCK_PROFILE, handle: "a<b>&c", displayName: "a<b>&c" },
      "report",
    );
    expect(svg).not.toContain("<b>");
    expect(svg).toContain("&lt;b&gt;");
  });

  it("produces a deterministic, profile-anchored 30-day series", () => {
    const a = thirtyDaySeries(MOCK_PROFILE);
    const b = thirtyDaySeries(MOCK_PROFILE);
    expect(a).toEqual(b);
    expect(a).toHaveLength(30);
    expect(Math.max(...a)).toBeLessThanOrEqual(1);
    expect(Math.min(...a)).toBeGreaterThan(0);
  });

  it("validates shape names", () => {
    expect(isCardShape("landscape")).toBe(true);
    expect(isCardShape("hero")).toBe(true);
    expect(isCardShape("report")).toBe(true);
    expect(isCardShape("banner")).toBe(false);
  });
});
