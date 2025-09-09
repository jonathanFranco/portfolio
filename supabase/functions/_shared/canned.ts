import { BUSINESS_RULES, CONTEXT_PILLS, DEVELOPER, GREETING, UI } from "./config.ts";
import type { ComplexitySignals, LeadState } from "./types.ts";

export interface CannedReply {
  reply: string;
  quickReplies?: string[];
  intent: string;
  statePatch?: Partial<LeadState>;
  signalsPatch?: Partial<ComplexitySignals>;
}

const CANNED_MAX_LENGTH = 90;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GREETING_ONLY =
  /^(oi+|ola+|opa|eae|e ai|hey|hi|hello|bom dia|boa tarde|boa noite|tudo bem( \?)?|tudo bom( \?)?|oi tudo bem|blz|beleza)[\s?!]*$/;

const PRICE = /(quanto custa|quanto sai|quanto fica|qual (o )?(preco|valor|custo)|preco|valores|tabela de preco|orcamento|quanto vou pagar|quanto cobra|cobra quanto|e caro|barato)/;

const DEADLINE = /(quanto tempo|prazo|quantos dias|em quanto tempo|demora quanto|quando fica pronto)/;

const IS_BOT = /(voce e (um )?(robo|bot|ia|inteligencia artificial|humano|pessoa|real)|e (um )?(robo|bot|ia)|chatgpt|gpt|gemini|qual (modelo|ia) (voce )?(usa|e)|fala com humano|quero falar com (uma )?pessoa)/;

const CONTACT = /(whatsapp|whats|zap|telefone|numero|email|e mail|contato|falar com o jonathan|falar direto|linkedin|curriculo)/;

const THANKS = /^(obrigado|obrigada|obg|vlw|valeu|show|otimo|perfeito|legal|ok|okay|entendi|tks|thanks|tchau|ate mais|falou)[\s!.]*$/;

const WHO = /(quem e (voce|o jonathan)|o que voce faz|o que ele faz|quais (servicos|tecnologias)|com o que (voce|ele) trabalha|portfolio)/;

export interface CannedContext {
  isFirstTurn: boolean;
  hasProposal: boolean;
  state: LeadState;
}

export function matchCanned(
  rawMessage: string,
  context: CannedContext
): CannedReply | null {
  const message = normalize(rawMessage);
  if (!message) return null;

  if (
    rawMessage.trim() === UI.confirmLabel ||
    rawMessage.trim() === UI.editLabel
  ) {
    return null;
  }

  const pill = matchContextPill(rawMessage, message);
  if (pill) return pill;

  if (message.length > CANNED_MAX_LENGTH) return null;

  if (GREETING_ONLY.test(message)) {
    return {
      intent: "greeting",
      reply: context.isFirstTurn
        ? GREETING
        : "Tô por aqui. Me conta o que você precisa construir.",
      quickReplies: [...UI.starters],
    };
  }

  if (THANKS.test(message)) {
    return {
      intent: "thanks",
      reply: context.hasProposal
        ? `Qualquer coisa é só chamar. O ${DEVELOPER.firstName} segue daqui pelo WhatsApp.`
        : "Fechou. Se quiser, me conta mais sobre o projeto que eu monto um resumo.",
      quickReplies: context.hasProposal ? undefined : [...UI.starters],
    };
  }

  if (PRICE.test(message) && !context.hasProposal) {
    return {
      intent: "price",
      reply:
        "O valor depende do tamanho do projeto. Me conta rapidinho o que ele " +
        "precisa fazer que eu já monto um resumo com a faixa de investimento.",
      quickReplies: suggestQuickReplies(context.state),
    };
  }

  if (DEADLINE.test(message)) {
    return {
      intent: "deadline",
      reply: `Prazo real fica ${BUSINESS_RULES.deadlineDisclaimer}. Me diz o que o projeto precisa fazer que eu dimensiono o escopo primeiro.`,
      quickReplies: suggestQuickReplies(context.state),
    };
  }

  if (IS_BOT.test(message)) {
    return {
      intent: "identity",
      reply: `Sou o assistente comercial do ${DEVELOPER.firstName}. Faço o pré-atendimento aqui e ele assume a conversa no WhatsApp. Me conta o que você precisa.`,
      quickReplies: suggestQuickReplies(context.state),
    };
  }

  if (WHO.test(message)) {
    return {
      intent: "about",
      reply: `${DEVELOPER.firstName} é ${DEVELOPER.role}. Trabalha com ${DEVELOPER.stack.slice(0, 5).join(", ")} — sites, sistemas web, dashboards, apps e integrações. Qual desses é o seu caso?`,
      quickReplies: [...UI.starters],
    };
  }

  if (CONTACT.test(message)) {
    return {
      intent: "contact",
      reply: context.hasProposal
        ? "É só usar o botão de enviar a proposta pelo WhatsApp aqui embaixo."
        : `Dá para falar direto com o ${DEVELOPER.firstName} pelo WhatsApp. Se quiser, me conta o projeto antes que eu já mando o resumo junto.`,
      quickReplies: context.hasProposal ? undefined : [...UI.starters],
    };
  }

  return null;
}

const PILL_MAX_LENGTH = 32;

function matchContextPill(
  rawMessage: string,
  normalized: string
): CannedReply | null {
  const typed = rawMessage.trim();

  for (const pill of CONTEXT_PILLS) {
    const isClick = typed === pill.label;
    const isTyped =
      typed.length <= PILL_MAX_LENGTH && pill.keywords.test(normalized);
    if (!isClick && !isTyped) continue;

    return {
      intent: `context:${pill.category}`,
      reply: pill.followUp,
      quickReplies: [...pill.options],
      statePatch: { project_type: [pill.category] },
      signalsPatch: pill.signals,
    };
  }

  return null;
}

const FIELD_OPTIONS: Partial<Record<keyof LeadState, string[]>> = {
  objective: [
    "Vender mais / captar clientes",
    "Automatizar um processo manual",
    "Organizar dados internos",
    "Modernizar o que já existe",
  ],
  features: [
    "Login de usuários",
    "Painel administrativo",
    "Relatórios e dashboard",
    "Pagamento online",
  ],
  integrations: [
    "Nenhuma integração",
    "WhatsApp",
    "ERP / sistema atual",
    "Gateway de pagamento",
  ],
  existing_system: [
    "Começar do zero",
    "Já tenho sistema rodando",
    "Tenho só o design",
  ],
};

function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  return value === null || value === undefined || String(value).trim() === "";
}

export function suggestQuickReplies(state: LeadState): string[] | undefined {
  if (isEmpty(state.project_type) && isEmpty(state.project_description)) {
    return [...UI.starters];
  }

  for (const field of BUSINESS_RULES.questionPriority) {
    const options = FIELD_OPTIONS[field as keyof LeadState];
    if (!options) continue;
    if (isEmpty(state[field as keyof LeadState])) return [...options];
  }

  return undefined;
}
