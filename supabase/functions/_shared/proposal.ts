/**
 * GENERATED FILE — do not edit by hand.
 * Source: lib/chatbot/proposal.ts
 * Regenerate: bun run edge:sync
 */

import {
  BUSINESS_RULES,
  DEVELOPER,
  categoryLabel,
} from "./config.ts";
import { COMPLEXITY_LABEL } from "./estimate.ts";
import type { Estimate, LeadState, Proposal } from "./types.ts";

function clean(items: string[] | null | undefined): string[] {
  if (!items) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const item = String(raw ?? "").trim();
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function value(input: string | null | undefined): string | null {
  const text = String(input ?? "").trim();
  return text.length > 0 ? text : null;
}

export function effectiveDescription(state: LeadState): string | null {
  const direct = value(state.project_description);
  if (direct) return direct;

  const objective = value(state.objective);
  const features = clean(state.features);
  if (!objective && features.length === 0) return null;

  const parts: string[] = [];
  if (objective) parts.push(objective);
  if (features.length) parts.push(`Inclui: ${features.join(", ")}.`);
  return parts.join(" ");
}

export function hasMinimumInfo(state: LeadState): boolean {
  return state.project_type.length > 0 && effectiveDescription(state) !== null;
}

export function buildProposalMarkdown(
  state: LeadState,
  estimate: Estimate
): string {
  const labels = state.project_type.map(categoryLabel);
  const features = clean(state.features);
  const integrations = clean(state.integrations);
  const lines: string[] = [];

  lines.push("### Resumo do projeto", "");
  lines.push(`**Tipo:** ${labels.length ? labels.join(" + ") : "Projeto sob medida"}`);

  const objective = value(state.objective) ?? effectiveDescription(state);
  if (objective) lines.push(`**Objetivo:** ${objective}`);

  if (value(state.target_audience)) {
    lines.push(`**Público:** ${state.target_audience}`);
  }

  if (features.length) {
    lines.push("", "**Principais funcionalidades:**");
    for (const feature of features) lines.push(`- ${feature}`);
  }

  if (integrations.length) {
    lines.push("", "**Integrações:**");
    for (const integration of integrations) lines.push(`- ${integration}`);
  }

  if (value(state.existing_system)) {
    lines.push("", `**Sistema atual:** ${state.existing_system}`);
  }

  lines.push("", `**Complexidade:** ${COMPLEXITY_LABEL[estimate.complexity]}`);

  lines.push(
    estimate.min === null
      ? `**Estimativa:** ${BUSINESS_RULES.uncertaintyMessage}`
      : `**Estimativa:** ${estimate.label}`
  );

  lines.push(
    `**Prazo estimado:** ${value(state.deadline) ?? BUSINESS_RULES.deadlineDisclaimer}`
  );

  if (estimate.min !== null) {
    lines.push("", `_${BUSINESS_RULES.estimateDisclaimer}_`);
  }

  return lines.join("\n");
}

export function buildWhatsappMessage(
  state: LeadState,
  estimate: Estimate
): string {
  const labels = state.project_type.map(categoryLabel);
  const features = clean(state.features);
  const integrations = clean(state.integrations);
  const blocks: string[] = [];

  blocks.push(
    `Olá ${DEVELOPER.firstName}! Conversei com seu assistente no portfólio e gostaria de solicitar um orçamento.`
  );

  const identity: string[] = [];
  if (value(state.company)) identity.push(`Empresa: ${state.company}`);
  if (value(state.client_name)) identity.push(`Nome: ${state.client_name}`);
  if (value(state.email)) identity.push(`E-mail: ${state.email}`);
  if (value(state.whatsapp)) identity.push(`Contato: ${state.whatsapp}`);
  if (labels.length) identity.push(`Tipo: ${labels.join(" + ")}`);
  if (identity.length) blocks.push(`*Meu projeto*\n${identity.join("\n")}`);

  const objective = value(state.objective) ?? effectiveDescription(state);
  if (objective) blocks.push(`*Objetivo*\n${objective}`);

  if (
    value(state.project_description) &&
    value(state.objective) &&
    state.project_description !== state.objective
  ) {
    blocks.push(`*Descrição*\n${state.project_description}`);
  }

  if (value(state.target_audience)) {
    blocks.push(`*Quem vai usar*\n${state.target_audience}`);
  }

  if (features.length) {
    blocks.push(`*Funcionalidades*\n${features.map((f) => `• ${f}`).join("\n")}`);
  }

  if (integrations.length) {
    blocks.push(`*Integrações*\n${integrations.map((i) => `• ${i}`).join("\n")}`);
  }

  if (value(state.existing_system)) {
    blocks.push(`*Sistema atual*\n${state.existing_system}`);
  }

  blocks.push(`*Prazo desejado*\n${value(state.deadline) ?? "A definir"}`);

  const budget = value(state.budget);
  const investment = budget
    ? `Orçamento previsto pelo cliente: ${budget}`
    : estimate.min === null
      ? "Ainda não definido."
      : `Faixa indicada pelo assistente: ${estimate.label}`;
  blocks.push(`*Investimento*\n${investment}`);

  blocks.push(`*Complexidade estimada*\n${COMPLEXITY_LABEL[estimate.complexity]}`);

  if (value(state.references)) blocks.push(`*Referências*\n${state.references}`);
  if (value(state.additional_notes)) {
    blocks.push(`*Observações*\n${state.additional_notes}`);
  }

  blocks.push(
    "Gostaria de conversar sobre o projeto e entender os próximos passos."
  );

  return blocks.join("\n\n");
}

export function buildWhatsappUrl(
  message: string,
  numberOverride?: string
): string {
  const number = (numberOverride ?? DEVELOPER.whatsappNumber).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProposal(state: LeadState, estimate: Estimate): Proposal {
  return {
    state,
    estimate,
    categoryLabels: state.project_type.map(categoryLabel),
    markdown: buildProposalMarkdown(state, estimate),
    whatsappMessage: buildWhatsappMessage(state, estimate),
  };
}
