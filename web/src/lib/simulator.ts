export interface SimulationResult {
  currentMonthlyCostUSD: number;
  projectedMonthlyCostUSD: number;
  monthlySavingsUSD: number;
  savingsPercentage: number;
  extendedRunwayDays: number;
}

/**
 * Standard 2026 Model Pricing per Million Tokens (USD)
 */
export const MODEL_PRICING: Record<
  string,
  {
    name: string;
    inputUSD: number;
    outputUSD: number;
    cacheReadUSD: number;
  }
> = {
  "claude-3-7-sonnet": {
    name: "Claude 3.7 Sonnet (Hybrid)",
    inputUSD: 3.0,
    outputUSD: 15.0,
    cacheReadUSD: 0.3,
  },
  "claude-3-5-haiku": {
    name: "Claude 3.5 Haiku",
    inputUSD: 0.8,
    outputUSD: 4.0,
    cacheReadUSD: 0.08,
  },
  "gpt-5": {
    name: "GPT-5 (Frontier)",
    inputUSD: 5.0,
    outputUSD: 20.0,
    cacheReadUSD: 0.5,
  },
  "gpt-5-mini": {
    name: "GPT-5 Mini",
    inputUSD: 0.4,
    outputUSD: 1.6,
    cacheReadUSD: 0.04,
  },
  "o3-reasoning": {
    name: "o3 Deep Reasoning",
    inputUSD: 10.0,
    outputUSD: 40.0,
    cacheReadUSD: 1.0,
  },
  "gemini-2-5-pro": {
    name: "Gemini 2.5 Pro",
    inputUSD: 1.25,
    outputUSD: 5.0,
    cacheReadUSD: 0.125,
  },
  "gemini-2-5-flash": {
    name: "Gemini 2.5 Flash",
    inputUSD: 0.075,
    outputUSD: 0.3,
    cacheReadUSD: 0.0075,
  },
};

/**
 * Calculates financial forecasting and savings when substituting a percentage of heavy reasoning calls with efficient tier models.
 */
export function simulateModelSubstitution(
  monthlyTokens: number,
  baseModelKey: string,
  targetModelKey: string,
  substitutionFraction: number, // 0..1 (e.g. 0.30 for 30%)
): SimulationResult {
  const baseModel = MODEL_PRICING[baseModelKey] || MODEL_PRICING["claude-3-7-sonnet"];
  const targetModel = MODEL_PRICING[targetModelKey] || MODEL_PRICING["gpt-5-mini"];

  // Assume typical distribution: 70% input, 15% output, 15% cache read
  const inputTok = monthlyTokens * 0.7;
  const outputTok = monthlyTokens * 0.15;
  const cacheReadTok = monthlyTokens * 0.15;

  const currentMonthlyCostUSD =
    (inputTok / 1_000_000) * baseModel.inputUSD +
    (outputTok / 1_000_000) * baseModel.outputUSD +
    (cacheReadTok / 1_000_000) * baseModel.cacheReadUSD;

  const shiftedTokens = monthlyTokens * substitutionFraction;
  const remainingTokens = monthlyTokens * (1 - substitutionFraction);

  const costRemaining =
    ((remainingTokens * 0.7) / 1_000_000) * baseModel.inputUSD +
    ((remainingTokens * 0.15) / 1_000_000) * baseModel.outputUSD +
    ((remainingTokens * 0.15) / 1_000_000) * baseModel.cacheReadUSD;

  const costShifted =
    ((shiftedTokens * 0.7) / 1_000_000) * targetModel.inputUSD +
    ((shiftedTokens * 0.15) / 1_000_000) * targetModel.outputUSD +
    ((shiftedTokens * 0.15) / 1_000_000) * targetModel.cacheReadUSD;

  const projectedMonthlyCostUSD = costRemaining + costShifted;
  const monthlySavingsUSD = Math.max(0, currentMonthlyCostUSD - projectedMonthlyCostUSD);
  const savingsPercentage = currentMonthlyCostUSD > 0 ? (monthlySavingsUSD / currentMonthlyCostUSD) * 100 : 0;

  // Estimate runway extension
  const extendedRunwayDays = currentMonthlyCostUSD > 0 ? Math.round((monthlySavingsUSD / (currentMonthlyCostUSD / 30)) * 1.5) : 0;

  return {
    currentMonthlyCostUSD: Math.round(currentMonthlyCostUSD),
    projectedMonthlyCostUSD: Math.round(projectedMonthlyCostUSD),
    monthlySavingsUSD: Math.round(monthlySavingsUSD),
    savingsPercentage: Math.round(savingsPercentage),
    extendedRunwayDays,
  };
}
