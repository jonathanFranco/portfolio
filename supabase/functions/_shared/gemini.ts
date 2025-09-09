import { SERVICES } from "./config.ts";
import type { ComplexitySignals, LeadState } from "./types.ts";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.5-flash";
const DEFAULT_FALLBACK_MODELS = "gemini-3.5-flash-lite,gemini-2.5-flash";

export interface GeminiTurn {
  role: "user" | "model";
  text: string;
}

export interface GeminiResult {
  reply: string;
  state: Partial<Record<keyof LeadState, unknown>>;
  signals: Partial<ComplexitySignals>;
  confidence: number;
  proposalReady: boolean;
  summary: string;
  usage?: { input: number; output: number };
  model?: string;
}

const CATEGORY_ENUM = SERVICES.map((service) => service.category).concat("other");

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    summary: { type: "string" },
    confidence: { type: "number" },
    proposal_ready: { type: "boolean" },
    state: {
      type: "object",
      properties: {
        client_name: { type: "string" },
        company: { type: "string" },
        email: { type: "string" },
        whatsapp: { type: "string" },
        project_type: {
          type: "array",
          items: { type: "string", enum: CATEGORY_ENUM },
        },
        project_description: { type: "string" },
        objective: { type: "string" },
        target_audience: { type: "string" },
        features: { type: "array", items: { type: "string" } },
        integrations: { type: "array", items: { type: "string" } },
        existing_system: { type: "string" },
        deadline: { type: "string" },
        budget: { type: "string" },
        references: { type: "string" },
        additional_notes: { type: "string" },
      },
    },
    signals: {
      type: "object",
      properties: {
        screens: { type: "integer" },
        has_auth: { type: "boolean" },
        has_admin_panel: { type: "boolean" },
        has_payments: { type: "boolean" },
        has_ai: { type: "boolean" },
        has_database: { type: "boolean" },
        external_integrations: { type: "integer" },
        business_complexity: {
          type: "string",
          enum: ["low", "medium", "high"],
        },
      },
    },
  },
  required: ["reply", "state", "signals", "confidence", "proposal_ready"],
} as const;

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryAfter?: number
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

const FATAL_STATUS = new Set([401, 403]);
const THINKING_VARIANTS = 3;


function buildBody(
  model: string,
  systemPrompt: string,
  turns: GeminiTurn[],
  variant: number
): unknown {
  const generationConfig: Record<string, unknown> = {
    temperature: 0.6,
    topP: 0.95,
    maxOutputTokens: 700,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };

  const isGemini3 = /^gemini-3/.test(model);
  const order = isGemini3
    ? ["thinkingLevel", "thinkingConfigLevel", "none"]
    : ["thinkingBudget", "thinkingLevel", "none"];

  switch (order[Math.min(variant, order.length - 1)]) {
    case "thinkingBudget":
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
      break;
    case "thinkingLevel":
      generationConfig.thinkingLevel = "minimal";
      break;
    case "thinkingConfigLevel":
      generationConfig.thinkingConfig = { thinkingLevel: "minimal" };
      break;
    default:
      break;
  }

  return {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: turns.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    generationConfig,
  };
}

function modelChain(): string[] {
  const primary = Deno.env.get("GEMINI_MODEL") ?? DEFAULT_MODEL;
  const fallbacks =
    Deno.env.get("GEMINI_FALLBACK_MODELS") ?? DEFAULT_FALLBACK_MODELS;

  const chain = [primary, ...fallbacks.split(",")]
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set(chain)];
}

function retryHint(detail: string): number | undefined {
  const match = detail.match(/retry in ([0-9.]+)s/i);
  if (!match) return undefined;
  const seconds = Math.ceil(Number(match[1]));
  return Number.isFinite(seconds) && seconds > 0
    ? Math.min(seconds, 300)
    : undefined;
}

function textFromCandidate(payload: unknown): string {
  const candidate = (payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  })?.candidates?.[0];

  const parts = candidate?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("").trim();
}

export async function callGemini(
  systemPrompt: string,
  turns: GeminiTurn[]
): Promise<GeminiResult> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY não configurada");

  let lastError: GeminiError | null = null;
  const failures: string[] = [];

  for (const model of modelChain()) {
    try {
      return await requestModel(model, apiKey, (variant) =>
        buildBody(model, systemPrompt, turns, variant)
      );
    } catch (cause) {
      const failure =
        cause instanceof GeminiError
          ? cause
          : new GeminiError(String(cause));
      lastError = failure;
      failures.push(failure.message);

      if (failure.status && FATAL_STATUS.has(failure.status)) throw failure;
    }
  }

  throw new GeminiError(
    failures.join(" | ") || "Não foi possível falar com o Gemini",
    lastError?.status,
    lastError?.retryAfter
  );
}

async function requestModel(
  model: string,
  apiKey: string,
  makeBody: (variant: number) => unknown
): Promise<GeminiResult> {
  let lastError: GeminiError | null = null;
  let variant = 0;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 500));

    let response: Response;
    try {
      response = await fetch(`${ENDPOINT}/${model}:generateContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(makeBody(variant)),
      });
    } catch (cause) {
      lastError = new GeminiError(`Falha de rede ao chamar ${model}: ${cause}`);
      continue;
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const failure = new GeminiError(
        `${model} respondeu ${response.status}: ${detail.slice(0, 700)}`,
        response.status,
        retryHint(detail)
      );

      if (response.status === 400 && variant + 1 < THINKING_VARIANTS) {
        variant += 1;
        lastError = failure;
        continue;
      }

      if (response.status === 429 || response.status < 500) throw failure;
      lastError = failure;
      continue;
    }

    const payload = await response.json();
    const text = textFromCandidate(payload);
    if (!text) {
      lastError = new GeminiError(`${model} retornou resposta vazia`);
      continue;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      lastError = new GeminiError(`${model} retornou JSON inválido`);
      continue;
    }

    const usageMeta = (payload as {
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    }).usageMetadata;

    return {
      reply: String(parsed.reply ?? "").trim(),
      state: (parsed.state as Record<string, unknown>) ?? {},
      signals: (parsed.signals as Partial<ComplexitySignals>) ?? {},
      confidence: Number(parsed.confidence ?? 0),
      proposalReady: parsed.proposal_ready === true,
      summary: String(parsed.summary ?? "").trim(),
      usage: {
        input: usageMeta?.promptTokenCount ?? 0,
        output: usageMeta?.candidatesTokenCount ?? 0,
      },
      model,
    };
  }

  throw lastError ?? new GeminiError(`Não foi possível falar com ${model}`);
}
