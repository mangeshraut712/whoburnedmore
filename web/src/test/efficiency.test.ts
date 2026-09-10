import { describe, expect, it } from "vitest";
import { calculateTokenEfficiency, evaluateCircuitBreaker } from "../lib/efficiency";
import { renderSvgCard } from "../lib/svg-builder";
import { MOCK_PROFILE } from "../lib/mock-data";

describe("Next Frontier: Token Efficiency Ratio (TER)", () => {
  it("computes Master Craftsman A+ for high work output", () => {
    const ter = calculateTokenEfficiency(40_000_000, 25, 120, 300, 0.82);
    expect(ter.efficiencyScore).toBeGreaterThanOrEqual(90);
    expect(ter.grade).toBe("A+");
    expect(ter.status).toBe("Master Craftsman");
    expect(ter.tokensPerPr).toBe(1_600_000);
  });

  it("penalizes context bloat with low work output", () => {
    const ter = calculateTokenEfficiency(500_000_000, 1, 3, 5, 0.2);
    expect(ter.efficiencyScore).toBeLessThanOrEqual(50);
    expect(ter.grade).toBe("C");
    expect(ter.status).toBe("Context Bloated");
  });
});

describe("Next Frontier: In-Flight Runaway Circuit Breaker", () => {
  it("remains nominal under normal turns", () => {
    const breaker = evaluateCircuitBreaker(2, 12.0, 50.0);
    expect(breaker.status).toBe("nominal");
    expect(breaker.autoHaltTrippedAt).toBeNull();
  });

  it("raises warning at 5 consecutive no-change turns", () => {
    const breaker = evaluateCircuitBreaker(5, 20.0, 50.0);
    expect(breaker.status).toBe("warning");
  });

  it("trips auto-halt when 8 consecutive no-change turns occur", () => {
    const breaker = evaluateCircuitBreaker(8, 25.0, 50.0);
    expect(breaker.status).toBe("tripped");
    expect(breaker.autoHaltTrippedAt).toBeTruthy();
    expect(breaker.activeSubagents).toBe(0);
  });

  it("trips auto-halt when session cost breaches budget ceiling", () => {
    const breaker = evaluateCircuitBreaker(2, 55.0, 50.0);
    expect(breaker.status).toBe("tripped");
  });
});

describe("Next Frontier: SVG Card TER Rendering", () => {
  it("renders TER grade badge directly on SVG card", () => {
    const svg = renderSvgCard(MOCK_PROFILE, { layout: "hero" });
    expect(svg).toContain("TER: A+ (94)");
  });
});
