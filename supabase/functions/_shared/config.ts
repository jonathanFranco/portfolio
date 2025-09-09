import type { ComplexitySignals, ProjectCategory } from "./types.ts";

function envWhatsappNumber(): string | undefined {
  const deno = (globalThis as {
    Deno?: { env: { get(key: string): string | undefined } };
  }).Deno;
  const fromDeno = deno?.env.get("WHATSAPP_NUMBER");
  if (fromDeno) return fromDeno;

  const fromNext =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER
      : undefined;
  return fromNext ?? undefined;
}

export const DEVELOPER = {
  name: "Jonathan Franco",
  firstName: "Jonathan",
  role: "Desenvolvedor Front-End Sênior",
  location: "Fortaleza, Brasil · atende remoto",
  whatsappNumber: envWhatsappNumber() ?? "5585988661417",
  email: "jonathanfranco01@outlook.com",
  bio:
    "Desenvolvedor front-end sênior com foco em portais de suporte, governo e " +
    "educação. Trabalha com React, Next.js, Vue, Nuxt e Angular, design systems, " +
    "acessibilidade e performance web.",
  stack: [
    "React",
    "Next.js",
    "Vue",
    "Nuxt",
    "Angular",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "three.js",
    "Flutter",
  ],
} as const;

export const GREETING =
  "Olá! 👋 Posso te ajudar a transformar sua ideia em um projeto. Me conte o que você precisa.";

export const ASSISTANT_NAME = "Assistente comercial";

export interface ServiceDefinition {
  category: ProjectCategory;
  label: string;
  summary: string;
  keywords: string[];
}

export const SERVICES: ServiceDefinition[] = [
  {
    category: "landing_page",
    label: "Landing page",
    summary: "Página única focada em conversão, com formulário e analytics.",
    keywords: ["landing", "página de vendas", "captura de lead", "campanha", "anúncio"],
  },
  {
    category: "institutional_website",
    label: "Site institucional",
    summary: "Site de presença da empresa, rápido, responsivo e com SEO técnico.",
    keywords: ["site", "site da empresa", "presença online", "blog", "portfólio", "SEO"],
  },
  {
    category: "ecommerce",
    label: "E-commerce",
    summary: "Loja virtual com catálogo, carrinho, pagamento e frete.",
    keywords: ["loja", "vender online", "carrinho", "checkout", "pagamento", "frete"],
  },
  {
    category: "shopify",
    label: "Shopify",
    summary: "Loja em Shopify: tema personalizado, apps e integrações.",
    keywords: ["shopify", "tema", "liquid", "app de loja"],
  },
  {
    category: "web_system",
    label: "Sistema web personalizado",
    summary: "Sistema sob medida com login, cadastros, regras de negócio e relatórios.",
    keywords: [
      "sistema",
      "gestão",
      "controle",
      "cadastro",
      "CRUD",
      "ERP",
      "CRM",
      "área logada",
      "portal",
      "contratos",
      "ordem de serviço",
    ],
  },
  {
    category: "dashboard",
    label: "Dashboard",
    summary: "Painel com indicadores, gráficos e filtros sobre dados existentes.",
    keywords: ["dashboard", "painel", "BI", "indicador", "gráfico", "relatório", "KPI"],
  },
  {
    category: "saas",
    label: "SaaS",
    summary: "Produto multiusuário com planos, assinatura e onboarding.",
    keywords: ["saas", "assinatura", "plano", "multiempresa", "multi-tenant", "produto"],
  },
  {
    category: "chatbot",
    label: "Chatbot / atendimento com IA",
    summary: "Assistente que atende, qualifica e encaminha conversas.",
    keywords: ["chatbot", "bot", "atendimento automático", "assistente", "WhatsApp bot"],
  },
  {
    category: "automation",
    label: "Automação de processos",
    summary: "Rotinas que eliminam trabalho manual e repetitivo.",
    keywords: ["automação", "automatizar", "planilha", "robô", "importar dados", "rotina"],
  },
  {
    category: "api_integration",
    label: "Integração com APIs e sistemas",
    summary: "Conexão entre sistemas, ERPs, gateways e serviços externos.",
    keywords: ["integração", "API", "webhook", "ERP", "gateway", "sincronizar", "importar"],
  },
  {
    category: "frontend",
    label: "Desenvolvimento front-end (React, Vue, Angular)",
    summary: "Implementação de interface a partir de design ou API já existentes.",
    keywords: ["front-end", "react", "vue", "angular", "spa", "interface", "tela", "layout"],
  },
  {
    category: "design_system",
    label: "Design system",
    summary: "Biblioteca de componentes, tokens e documentação de uso.",
    keywords: ["design system", "componentes", "tokens", "storybook", "padronizar"],
  },
  {
    category: "mobile_app",
    label: "Aplicativo mobile (Flutter)",
    summary: "App Android e iOS a partir de uma base de código, com publicação nas lojas.",
    keywords: ["aplicativo", "app", "android", "ios", "flutter", "loja de apps"],
  },
  {
    category: "performance",
    label: "Performance e acessibilidade",
    summary: "Auditoria e correção de site lento ou inacessível, com medição antes e depois.",
    keywords: ["lento", "performance", "lighthouse", "acessibilidade", "a11y", "core web vitals"],
  },
  {
    category: "maintenance",
    label: "Modernização, migração e sustentação",
    summary:
      "Redesign de front legado, migração em etapas e horas mensais de evolução contínua.",
    keywords: [
      "legado",
      "migrar",
      "modernizar",
      "refatorar",
      "atualizar sistema",
      "manutenção",
      "sustentação",
    ],
  },
];

export function categoryLabel(category: ProjectCategory): string {
  return SERVICES.find((s) => s.category === category)?.label ?? "Projeto sob medida";
}

export interface PriceRange {
  min: number;
  max: number | null;
  monthly?: boolean;
}

export const PRICING: Record<ProjectCategory, PriceRange | null> = {
  landing_page: { min: 900, max: 2200 },
  institutional_website: { min: 1600, max: 3800 },
  ecommerce: { min: 2800, max: 9000 },
  shopify: { min: 2000, max: 6000 },
  web_system: { min: 3500, max: 11000 },
  dashboard: { min: 3000, max: 9000 },
  saas: { min: 5500, max: null },
  chatbot: { min: 2000, max: 6500 },
  automation: { min: 1400, max: 5000 },
  api_integration: { min: 1800, max: 6000 },
  frontend: { min: 2200, max: 7500 },
  design_system: { min: 4500, max: 13000 },
  mobile_app: { min: 5500, max: 18000 },
  performance: { min: 1200, max: 4000 },
  maintenance: { min: 800, max: 3000, monthly: true },
  other: null,
};

export const COMPLEXITY_RULES = {
  featurePoints: [
    { upTo: 3, points: 0 },
    { upTo: 6, points: 1 },
    { upTo: 10, points: 2 },
    { upTo: Infinity, points: 3 },
  ],
  screenPoints: [
    { upTo: 3, points: 0 },
    { upTo: 8, points: 1 },
    { upTo: 15, points: 2 },
    { upTo: Infinity, points: 3 },
  ],
  integrationPoints: [
    { upTo: 0, points: 0 },
    { upTo: 1, points: 1 },
    { upTo: 2, points: 2 },
    { upTo: Infinity, points: 3 },
  ],
  featureFlagPoints: {
    has_auth: 1,
    has_admin_panel: 1,
    has_database: 1,
    has_payments: 2,
    has_ai: 2,
  },
  businessPoints: { low: 0, medium: 1, high: 2 },

  bands: [
    { upTo: 3, complexity: "small" as const },
    { upTo: 8, complexity: "medium" as const },
    { upTo: 13, complexity: "large" as const },
    { upTo: Infinity, complexity: "custom" as const },
  ],

  bandPosition: {
    small: { from: 0, to: 0.3 },
    medium: { from: 0.1, to: 0.5 },
    large: { from: 0.4, to: 0.85 },
    custom: { from: 0.7, to: 1 },
  },

  addOns: {
    has_payments: 1000,
    has_ai: 1200,
    perExtraIntegration: 500,
    maxExtraIntegrations: 4,
  },

  multiCategoryUplift: 0.15,
  maxMultiCategoryUplift: 0.45,

  roundTo: 500,

  minConfidenceForEstimate: 0.5,
} as const;

export const BUSINESS_RULES = {
  deadlineDisclaimer: "a definir após levantamento técnico",
  uncertaintyMessage:
    "Para esse projeto preciso entender alguns detalhes antes de estimar um investimento com mais precisão.",
  handoffMessage:
    "O que faltar de detalhe o Jonathan fecha com você direto no WhatsApp.",
  wrapUpMessage:
    "Com isso já consigo montar o resumo. O Jonathan continua daqui pelo " +
    "WhatsApp com os detalhes.",
  quotaMessage:
    "Atingi o limite de mensagens do assistente por agora. Tente de novo mais " +
    "tarde ou fale direto pelo WhatsApp — respondo por lá.",
  estimateDisclaimer:
    "Faixa de referência, não é orçamento final. O valor fechado sai no PDF de proposta.",
  requiredForProposal: [
    "project_type",
    "project_description",
  ] as const,

  questionPriority: [
    "objective",
    "features",
    "integrations",
    "existing_system",
  ] as const,
} as const;

export const LIMITS = {
  maxMessageLength: 800,
  historyWindow: 6,
  summarizeAfter: 6,
  maxMessagesPerConversation: 30,
  maxLlmTurns: 4,
  forceProposalAfterTurns: 3,
  rateLimit: { windowSeconds: 600, maxRequests: 25 },
  geminiQuotaRetrySeconds: 30,
} as const;

export interface ContextPill {
  category: ProjectCategory;
  label: string;
  keywords: RegExp;
  followUp: string;
  options: string[];
  signals: Partial<ComplexitySignals>;
}

export const CONTEXT_PILLS: ContextPill[] = [
  {
    category: "institutional_website",
    label: "Site",
    keywords: /^(site|website|web site|pagina|landing( page)?|site institucional|quero um site|preciso de um site)$/,
    followUp:
      "Boa. Esse site é mais para apresentar a empresa ou para captar clientes de campanha?",
    options: [
      "Apresentar a empresa",
      "Captar clientes / campanha",
      "Blog e conteúdo",
      "Portfólio",
    ],
    signals: { business_complexity: "low" },
  },
  {
    category: "mobile_app",
    label: "Aplicativo",
    keywords: /^(app|aplicativo|aplicativo mobile|mobile|android|ios|quero um app|preciso de um app)$/,
    followUp: "Legal. Esse app é para os seus clientes ou para a equipe interna?",
    options: [
      "Para clientes",
      "Para equipe interna",
      "Com login e cadastro",
      "Com pagamento no app",
    ],
    signals: { has_auth: true, has_database: true, business_complexity: "medium" },
  },
  {
    category: "web_system",
    label: "Sistema de gestão",
    keywords: /^(sistema|sistema de gestao|gestao|erp|crm|sistema interno|portal|quero um sistema|preciso de um sistema)$/,
    followUp: "Certo. Qual processo esse sistema precisa controlar?",
    options: [
      "Cadastros e contratos",
      "Ordens de serviço",
      "Estoque e produtos",
      "Financeiro",
    ],
    signals: {
      has_auth: true,
      has_admin_panel: true,
      has_database: true,
      business_complexity: "medium",
    },
  },
  {
    category: "ecommerce",
    label: "E-commerce",
    keywords: /^(ecommerce|e commerce|loja|loja virtual|vender online|shopify|quero uma loja|preciso de uma loja)$/,
    followUp: "Show. Você vende produto físico, digital ou serviço?",
    options: [
      "Produto físico",
      "Produto digital",
      "Serviço",
      "Já tenho loja e quero migrar",
    ],
    signals: {
      has_payments: true,
      has_admin_panel: true,
      has_database: true,
      business_complexity: "medium",
    },
  },
];

export const UI = {
  contextPrompt: "Sobre o que é o projeto?",
  starters: CONTEXT_PILLS.map((pill) => pill.label),
  confirmLabel: "Está correto",
  editLabel: "Quero alterar algo",
  whatsappLabel: "Enviar proposta pelo WhatsApp",
} as const;
