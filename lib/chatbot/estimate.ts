import { BUSINESS_RULES, COMPLEXITY_RULES, PRICING } from "./config";
import type {
  Complexity,
  ComplexitySignals,
  Estimate,
  LeadState,
  ProjectCategory,
} from "./types";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatBRL(value: number): string {
  return BRL.format(value);
}

function pointsFor(
  table: ReadonlyArray<{ upTo: number; points: number }>,
  value: number
): number {
  for (const row of table) {
    if (value <= row.upTo) return row.points;
  }
  return table[table.length - 1]?.points ?? 0;
}

export const EMPTY_SIGNALS: ComplexitySignals = {
  screens: null,
  has_auth: false,
  has_admin_panel: false,
  has_payments: false,
  has_ai: false,
  has_database: false,
  external_integrations: 0,
  business_complexity: "low",
};

export function scoreComplexity(
  state: LeadState,
  signals: ComplexitySignals
): number {
  const rules = COMPLEXITY_RULES;
  let score = 0;

  score += pointsFor(rules.featurePoints, state.features.length);

  if (typeof signals.screens === "number" && signals.screens > 0) {
    score += pointsFor(rules.screenPoints, signals.screens);
  }

  const integrations = Math.max(
    state.integrations.length,
    signals.external_integrations ?? 0
  );
  score += pointsFor(rules.integrationPoints, integrations);

  for (const [flag, points] of Object.entries(rules.featureFlagPoints)) {
    if (signals[flag as keyof ComplexitySignals] === true) score += points;
  }

  score += rules.businessPoints[signals.business_complexity ?? "low"] ?? 0;

  return score;
}

export function classifyComplexity(score: number): Complexity {
  for (const band of COMPLEXITY_RULES.bands) {
    if (score <= band.upTo) return band.complexity;
  }
  return "custom";
}

function primaryPricedCategory(
  categories: ProjectCategory[]
): { category: ProjectCategory; min: number; max: number | null; monthly: boolean } | null {
  let best: {
    category: ProjectCategory;
    min: number;
    max: number | null;
    monthly: boolean;
  } | null = null;

  for (const category of categories) {
    const range = PRICING[category];
    if (!range) continue;
    const ceiling = range.max ?? Number.POSITIVE_INFINITY;
    const bestCeiling = best ? best.max ?? Number.POSITIVE_INFINITY : -1;
    if (ceiling > bestCeiling || (ceiling === bestCeiling && range.min > (best?.min ?? 0))) {
      best = {
        category,
        min: range.min,
        max: range.max,
        monthly: range.monthly === true,
      };
    }
  }

  return best;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function roundDown(value: number, step: number): number {
  return Math.floor(value / step) * step;
}

function uncertain(complexity: Complexity, score: number): Estimate {
  return {
    complexity,
    min: null,
    max: null,
    openEnded: false,
    label: BUSINESS_RULES.uncertaintyMessage,
    score,
  };
}

export function buildEstimate(
  state: LeadState,
  signals: ComplexitySignals,
  confidence = 1
): Estimate {
  const score = scoreComplexity(state, signals);
  const complexity = classifyComplexity(score);
  const rules = COMPLEXITY_RULES;

  if (confidence < rules.minConfidenceForEstimate) {
    return uncertain(complexity, score);
  }

  const base = primaryPricedCategory(state.project_type);
  if (!base) return uncertain(complexity, score);

  const position = rules.bandPosition[complexity];

  let addOns = 0;
  if (signals.has_payments) addOns += rules.addOns.has_payments;
  if (signals.has_ai) addOns += rules.addOns.has_ai;

  const integrations = Math.max(
    state.integrations.length,
    signals.external_integrations ?? 0
  );
  const extraIntegrations = Math.min(
    Math.max(integrations - 1, 0),
    rules.addOns.maxExtraIntegrations
  );
  addOns += extraIntegrations * rules.addOns.perExtraIntegration;

  const pricedCategories = state.project_type.filter((c) => PRICING[c]).length;
  const uplift = Math.min(
    Math.max(pricedCategories - 1, 0) * rules.multiCategoryUplift,
    rules.maxMultiCategoryUplift
  );

  const openEnded = base.max === null || complexity === "custom";

  if (openEnded) {
    const floor =
      base.max === null
        ? base.min * (1 + position.from)
        : base.min + (base.max - base.min) * position.from;

    const min = Math.max(
      roundDown((floor + addOns) * (1 + uplift), rules.roundTo),
      base.min
    );
    return {
      complexity,
      min,
      max: null,
      openEnded: true,
      label: `a partir de ${formatBRL(min)}${base.monthly ? "/mês" : ""}`,
      score,
    };
  }

  const span = (base.max as number) - base.min;
  const min = Math.max(
    roundDown((base.min + span * position.from + addOns) * (1 + uplift), rules.roundTo),
    base.min
  );
  const max = roundTo(
    (base.min + span * position.to + addOns) * (1 + uplift),
    rules.roundTo
  );

  return {
    complexity,
    min,
    max: Math.max(max, min + rules.roundTo),
    openEnded: false,
    label: `${formatBRL(min)} – ${formatBRL(Math.max(max, min + rules.roundTo))}${
      base.monthly ? "/mês" : ""
    }`,
    score,
  };
}

export const COMPLEXITY_LABEL: Record<Complexity, string> = {
  small: "Baixa",
  medium: "Média",
  large: "Alta",
  custom: "Sob consulta",
};
