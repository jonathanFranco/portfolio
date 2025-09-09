import type { ChatCopy } from "@/lib/chatbot/script";

const chatScript: ChatCopy = {
  services: {
    site: {
      label: "Site ou landing page",
      reaction: "Boa! Site rápido e bem feito é o cartão de visita da empresa.",
      goalQuestion: "Qual o papel principal do site?",
      goalOptions: [
        "Apresentar a empresa",
        "Captar clientes de campanha",
        "Vender um produto ou curso",
        "Mostrar meu portfólio",
      ],
      featureOptions: [
        "Formulário de contato",
        "Botão de WhatsApp",
        "Blog",
        "SEO para o Google",
        "Várias páginas",
        "Versão em inglês",
      ],
    },
    system: {
      label: "Sistema web",
      reaction: "Show. Sistema sob medida é onde eu mais trabalho.",
      goalQuestion: "Qual processo o sistema vai organizar?",
      goalOptions: [
        "Clientes e cadastros",
        "Ordens de serviço",
        "Estoque e vendas",
        "Financeiro",
        "Agendamentos",
      ],
      featureOptions: [
        "Login de usuários",
        "Painel administrativo",
        "Relatórios e gráficos",
        "Níveis de permissão",
        "Avisos por e-mail ou WhatsApp",
        "Integração com outro sistema",
      ],
    },
    store: {
      label: "Loja virtual",
      reaction: "Legal! Vamos colocar sua loja para vender.",
      goalQuestion: "O que você vende?",
      goalOptions: [
        "Produtos físicos",
        "Produtos digitais",
        "Serviços",
        "Já tenho loja e quero migrar",
      ],
      featureOptions: [
        "Pagamento por Pix e cartão",
        "Cálculo de frete",
        "Cupons de desconto",
        "Painel de pedidos",
        "Integração com ERP",
      ],
    },
    app: {
      label: "Aplicativo mobile",
      reaction: "Massa. App em Flutter sai para Android e iOS de uma vez.",
      goalQuestion: "Para quem é o app?",
      goalOptions: ["Meus clientes", "Minha equipe interna", "Os dois"],
      featureOptions: [
        "Login e cadastro",
        "Notificações push",
        "Pagamento no app",
        "Funciona offline",
        "Publicação nas lojas",
      ],
    },
    dashboard: {
      label: "Dashboard / painel de dados",
      reaction: "Boa! Dado bem mostrado vira decisão mais rápida.",
      goalQuestion: "De onde vêm os dados hoje?",
      goalOptions: [
        "Planilhas",
        "Um sistema que já uso",
        "Banco de dados próprio",
        "Ainda não sei",
      ],
      featureOptions: [
        "Gráficos e indicadores",
        "Filtros por período",
        "Exportar PDF ou Excel",
        "Acesso por usuário",
        "Atualização automática",
      ],
    },
    improve: {
      label: "Melhorar site ou sistema existente",
      reaction: "Certo. Dá para evoluir sem parar o que já funciona.",
      goalQuestion: "O que mais incomoda hoje?",
      goalOptions: [
        "Está lento",
        "Visual desatualizado",
        "Ruim de usar no celular",
        "Problemas de acessibilidade",
        "Tecnologia antiga para migrar",
      ],
      featureOptions: [
        "Auditoria com relatório",
        "Redesign das telas",
        "Migração em etapas",
        "Correção de bugs",
      ],
    },
    design_system: {
      label: "Design system",
      reaction: "Ótimo. Padronizar cedo economiza muito retrabalho.",
      goalQuestion: "Como está hoje?",
      goalOptions: [
        "Telas sem padrão entre si",
        "Vários produtos, cada um de um jeito",
        "Tenho no Figma, falta o código",
      ],
      featureOptions: [
        "Cores e tipografia (tokens)",
        "Biblioteca de componentes",
        "Documentação de uso",
        "Tema claro e escuro",
      ],
    },
    support: {
      label: "Manutenção mensal",
      reaction: "Fechado. Horas mensais deixam o projeto sempre em dia.",
      goalQuestion: "Que tipo de apoio você precisa?",
      goalOptions: [
        "Correções e ajustes",
        "Novas funcionalidades",
        "Atualizações e segurança",
        "Um pouco de tudo",
      ],
      featureOptions: [],
    },
    other: {
      label: "Outra coisa",
      reaction: "Sem problema, me conta com suas palavras.",
      goalQuestion: "Em uma frase: o que você precisa?",
      goalOptions: [],
      featureOptions: [],
    },
  },
  intro: (developer) => [
    `Oi! 👋 Sou o assistente do ${developer}.`,
    "Em menos de um minuto a gente monta juntos a mensagem do seu pedido de orçamento, já pronta para enviar no WhatsApp dele.",
    "O que você precisa?",
  ],
  goalPlaceholder: "Ex.: um sistema para agendar aulas",
  featuresQuestion: "Quais desses recursos você imagina? Pode marcar vários.",
  stageQuestion: "Anotado. E em que ponto o projeto está?",
  stageOptions: [
    "Só a ideia",
    "Tenho o design pronto",
    "Já tenho algo no ar",
    "Tenho tudo descrito por escrito",
  ],
  deadlineQuestion: "Para quando você precisa?",
  deadlineOptions: [
    "O quanto antes",
    "Em até 1 mês",
    "De 1 a 3 meses",
    "Sem data definida",
  ],
  budgetQuestion:
    "Tem uma faixa de investimento em mente? Ajuda a propor o escopo certo.",
  budgetOptions: [
    "Até R$ 2 mil",
    "R$ 2 a 5 mil",
    "R$ 5 a 10 mil",
    "Acima de R$ 10 mil",
    "Prefiro receber uma proposta",
  ],
  detailsQuestion:
    "Quase lá. Quer acrescentar algum detalhe? Um site de referência, uma regra do negócio…",
  detailsPlaceholder: "Opcional: escreva um detalhe",
  nameQuestion:
    "Por último: como posso te chamar? Se quiser, diga a empresa também.",
  namePlaceholder: "Ex.: Ana, da Clínica Sorriso",
  noneSelected: "Nenhum desses",
  skipped: "Pular",
  done: (developer) => [
    `Pronto! Essa é a mensagem que vai para o WhatsApp do ${developer}.`,
    "Confira e toque em enviar: o WhatsApp abre com tudo já escrito.",
  ],
  message: {
    greeting: (developer) =>
      `Olá, ${developer}! Vim pelo seu portfólio e gostaria de um orçamento.`,
    service: "Serviço",
    goal: "Objetivo",
    features: "Recursos",
    stage: "Situação atual",
    deadline: "Prazo",
    budget: "Investimento",
    details: "Detalhes",
    closing: "Podemos conversar sobre o projeto?",
    closingWithName: (name) => `Sou ${name}. Podemos conversar sobre o projeto?`,
  },
};

const pt = {
  meta: {
    title: "Jonathan Franco — Desenvolvedor Front-End Sênior",
    description:
      "Plataformas de educação, logística, suporte e governo em Vue, React, Angular e Flutter. Portfólio de Jonathan Franco, desenvolvedor front-end sênior em Fortaleza, Brasil.",
    keywords: [
      "Jonathan Franco",
      "Desenvolvedor Front-End",
      "Front-End Sênior",
      "Portfólio",
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "Angular",
      "TypeScript",
      "Design System",
      "Acessibilidade",
      "Performance Web",
      "Fortaleza",
    ],
  },
  skipLink: "Pular para o conteúdo",
  loader: {
    label: "Carregando a página",
    status: "montando camadas",
  },
  available: "Disponível para novos projetos",
  whatsappHello: "Oi Jonathan, vim pelo seu portfólio",
  backdrops: {
    about: "Sobre",
    experience: "Experiência",
    stacks: "Stacks",
    education: "Certificados",
    projects: "Projetos",
    process: "Processo",
    services: "Serviços",
    proposal: "Proposta",
    contact: "Contato",
  },
  header: {
    nav: {
      inicio: { label: "Início", hint: "voltar ao começo" },
      about: { label: "Sobre", hint: "quem eu sou e como trabalho" },
      experience: { label: "Experiência", hint: "onde trabalhei e o que entreguei" },
      stacks: { label: "Stacks", hint: "tecnologias que uso no dia a dia" },
      projects: { label: "Projetos", hint: "o que já entreguei" },
      services: { label: "Serviços", hint: "no que posso te ajudar" },
      contact: { label: "Contato", hint: "vamos conversar" },
    },
    sections: "Seções do site",
    brand: "Jonathan Franco, voltar ao início",
    language: "Idioma",
    themeLight: "Usar tema claro",
    themeDark: "Usar tema escuro",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    navigation: "Navegação",
    goTo: "Ir para",
  },
  hero: {
    role: "Desenvolvedor front-end sênior",
    location: "Fortaleza, Brasil",
    taglineStart: "Transformo sistemas complicados em telas",
    taglineHighlight: "simples de usar",
    taglineEnd: ".",
    summary:
      "6 anos construindo plataformas de educação, logística, suporte e governo em Vue, React, Angular e Flutter — do design system ao deploy.",
    viewProjects: "Ver projetos",
    talkToMe: "Falar comigo",
    domCaption: "árvore do DOM em camadas",
    domHint: "mova o cursor · role sobre ela para achatar",
  },
  about: {
    eyebrow: "Sobre",
    title:
      "Trabalho no front-end de portais que as pessoas usam para resolver alguma coisa.",
    paragraphs: [
      "Abrir um chamado de suporte, achar uma informação de governo, assistir uma aula. Isso muda como eu decido: um componente que ninguém entende, uma animação que atrapalha e um bundle grande são bug, não detalhe.",
      "Na prática, isso é construir o design system junto com a primeira tela, medir o que carrega, testar no teclado antes de achar bonito, e deixar o código legível para quem chega depois de mim.",
    ],
    spec: [
      { key: "experiência", value: "6 anos · front-end e mobile" },
      { key: "stack principal", value: "Vue · React · Angular · TypeScript" },
      { key: "também entrego em", value: "Nuxt (SSR) · Next.js" },
      { key: "mobile", value: "Flutter (Android e iOS)" },
      { key: "integração", value: "Keycloak · WebSocket/STOMP · RabbitMQ" },
      { key: "foco", value: "design system, acessibilidade, performance" },
      { key: "domínios", value: "educação · logística · suporte · governo" },
      { key: "base", value: "Fortaleza, Brasil · remoto" },
      { key: "disponibilidade", value: "aberto a novos projetos" },
    ],
  },
  stacks: {
    eyebrow: "Stacks",
    title: "Ferramentas por função",
    note: "O que uso em produção, agrupado pelo papel que cumpre.",
    groups: {
      interface: { category: "Interface", note: "onde a tela nasce" },
      state: { category: "Estado e dados", note: "o que a tela sabe" },
      style: { category: "Estilo e sistema", note: "consistência visual" },
      quality: { category: "Qualidade e segurança", note: "o que não pode quebrar" },
      flow: { category: "Entrega", note: "do commit ao ar" },
      ai: { category: "IA e 3D", note: "IA no fluxo · three.js neste site" },
    },
  },
  experience: {
    eyebrow: "Experiência",
    title: "Onde trabalhei",
    note: "6 anos de front-end, com mobile desde 2025.",
    items: [
      {
        role: "Desenvolvedor Front-end Sênior",
        company: "iREDE – Instituto de Gestão, Redes Tecnológicas e Energias",
        period: "02/2022 – 11/2026",
        location: "Fortaleza, CE",
        highlights: [
          "Principal contribuidor do front-end do Homero, plataforma EAD adaptativa com mais de 100 telas (~730 commits, ~49% do repositório).",
          "Detecção de atenção e emoções no navegador com TensorFlow.js, player HLS, quizzes, H5P, fórum e painéis com ApexCharts.",
          "Design system interno (Atomic Design), Keycloak (OAuth2/OIDC, RBAC), acessibilidade com VLibras e i18n PT/EN.",
          "Portais Grupo Multi em Nuxt SSR e AVA do IFCE; plugins Moodle em PHP; skills de IA para Claude Code (code review, QA visual, release notes).",
        ],
        tech: ["Vue 3", "Nuxt", "TypeScript", "PrimeVue", "Pinia", "Docker"],
      },
      {
        role: "Desenvolvedor Front-end e Mobile (Freelance)",
        company: "Juraboy / Vai Boy – Plataforma de logística de entregas",
        period: "04/2025 – 10/2026",
        location: "Remoto",
        highlights: [
          "App do entregador em Flutter (Android e iOS): 18 telas em MVVM, check-in por GPS, push com Firebase e integração iFood e Saipos.",
          "Painel web em Angular: ~58% dos commits, 99 componentes, migração Angular 18→19 e PrimeNG 17→18.",
          "Rastreamento de entregas em tempo real com React 19, MapLibre e WebSocket/STOMP sobre RabbitMQ.",
        ],
        tech: ["Flutter", "Angular", "PrimeNG", "React", "RabbitMQ", "Firebase"],
      },
      {
        role: "Desenvolvedor Front-end",
        company: "LDS – Pesquisa, Desenvolvimento & Inovação",
        period: "08/2021 – 01/2022",
        location: "Fortaleza, CE",
        highlights: [
          "Aplicações em Angular e React com TypeScript, SOLID e componentização; melhoria de Web Vitals em telas críticas.",
        ],
        tech: ["Angular", "React", "TypeScript", "Angular Material", "SCSS"],
      },
      {
        role: "Desenvolvedor Front-end",
        company: "Softbuilder",
        period: "10/2020 – 07/2021",
        location: "Fortaleza, CE",
        highlights: [
          "Sistemas internos em React do protótipo à produção e biblioteca de componentes mobile-first.",
        ],
        tech: ["React", "JavaScript", "Git"],
      },
    ],
    education: {
      label: "Formação acadêmica",
      degree: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      school: "Estácio",
      period: "2017 – 2020",
    },
  },
  certificates: {
    eyebrow: "Certificados",
    title: "Formação contínua",
    count: (n: number) => `${n} certificados · credenciais verificáveis`,
    months: [
      "jan", "fev", "mar", "abr", "mai", "jun",
      "jul", "ago", "set", "out", "nov", "dez",
    ],
  },
  projects: {
    eyebrow: "Projetos",
    title: "No ar agora",
    note: "Oito projetos no ar. Abra qualquer um.",
    open: (domain: string) => `Abrir ${domain}`,
    more: "Ver mais projetos no LinkedIn",
    items: {
      homero: {
        context: "Educação · IA adaptativa",
        description:
          "Plataforma EAD adaptativa com mais de 100 telas para alunos, professores e administradores. Fui o principal contribuidor do front-end: quizzes, H5P, livro interativo, detecção de atenção com TensorFlow.js e acessibilidade com VLibras.",
        tech: ["Vue 3", "TypeScript", "Tailwind", "Pinia", "PrimeVue", "TensorFlow.js"],
      },
      avaIfce: {
        context: "Educação · Governo",
        description:
          "AVA do programa Jovens Empreendedores Digitais do IFCE. Painel geográfico com mapa do Brasil por região, estado e município, exportação em PDF, Excel e CSV, 5 perfis de acesso e Libras com Hand Talk.",
        tech: ["Vue 3", "TypeScript", "PrimeVue", "Tailwind", "Pinia", "Leaflet"],
      },
      vaiBoy: {
        context: "Logística · Entregas",
        description:
          "Plataforma de entregas com painel web para empresas e app para entregadores. Fui o principal contribuidor do painel em Angular (~58% dos commits) e do app em Flutter, e criei o rastreamento em tempo real com React, MapLibre e WebSocket/STOMP.",
        tech: ["Angular", "PrimeNG", "Flutter", "React", "RabbitMQ", "Firebase"],
      },
      multiSupport: {
        context: "Suporte · B2C",
        description:
          "Portal de suporte com manuais e drivers, rastreio de reparo por protocolo, mapa de assistências técnicas e busca por CEP. Fui o principal desenvolvedor (~63% dos commits), com 32 arquivos de teste e deploy em Kubernetes.",
        tech: ["Nuxt 3 (SSR)", "TypeScript", "Vuetify", "Pinia", "Vitest", "Docker"],
      },
      multiGov: {
        context: "Governo · Institucional",
        description:
          "Portal institucional para o setor público, com informação e comunicação oficial em um só lugar. Qualquer cidadão precisa achar o que procura sem ajuda.",
        tech: ["Nuxt 3 (SSR)", "TypeScript", "Vuetify", "Pinia", "i18n"],
      },
      fortalConnect: {
        context: "Tecnologia · Institucional",
        description:
          "Site de uma empresa de informática e segurança eletrônica em Fortaleza, com globo 3D interativo de rede no hero. Serviços, contratos de manutenção e kits de câmeras levam direto ao orçamento no WhatsApp, em tema claro ou escuro.",
        tech: ["Next.js", "React", "Tailwind", "Three.js", "Tema claro e escuro"],
      },
      boraAssistir: {
        context: "Projeto próprio · Sorteio",
        description:
          "Sorteia o que assistir a partir do Top 250 do IMDb, com filtro opcional por streaming, gênero e década. Nasceu de gastar meia hora escolhendo e não assistir nada.",
        tech: ["Next.js", "TypeScript", "Tailwind", "i18n PT/EN", "Vercel"],
      },
      pirataflix: {
        context: "Projeto próprio · Streaming",
        description:
          "Catálogo de filmes e séries com dados do TMDB, trailers, busca, sorteio e lista de favoritos. A mesma base roda no navegador e num app para Android TV.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind", "Firebase", "TMDB API"],
      },
    },
  },
  services: {
    eyebrow: "Serviços",
    title: "Da conversa ao PDF de orçamento",
    note: "Todo projeto começa por um documento. Preço, escopo e prazo por escrito antes da primeira linha de código.",
    steps: [
      {
        title: "Conversa",
        description:
          "Você me conta o problema, para quem é e o prazo que tem. Eu pergunto o que falta para o escopo ficar de pé.",
      },
      {
        title: "Categoria",
        description:
          "Encaixo a demanda em uma das categorias abaixo. É ela que define entregáveis, etapas e faixa de preço.",
      },
      {
        title: "PDF de orçamento",
        description:
          "Você recebe um documento com escopo, entregáveis, etapas, prazo, valor e o que fica de fora. Sem surpresa depois.",
      },
      {
        title: "Execução",
        description:
          "Entrego em etapas, com link no ar a cada uma. Você acompanha rodando, não em print de apresentação.",
      },
      {
        title: "Entrega",
        description:
          "Código, deploy e um passo a passo de como manter. Mudança fora do escopo vira um novo PDF, nunca um débito silencioso.",
      },
    ],
    catalog: {
      eyebrow: "Categorias",
      title: "O que eu faço",
      count: (n: number) => `${n} categorias · combináveis no mesmo projeto`,
      items: [
        {
          name: "Site institucional e landing page",
          summary:
            "Presença que carrega rápido, aparece na busca e converte contato.",
          deliverables: ["Design responsivo", "SEO técnico", "Formulário e analytics"],
        },
        {
          name: "Portal e sistema web",
          summary:
            "Área logada, painel e fluxo de atendimento sobre a API que você já tem.",
          deliverables: ["Autenticação", "Telas de CRUD", "Integração de API"],
        },
        {
          name: "Aplicativo mobile",
          summary:
            "App em Flutter para Android e iOS a partir de uma base de código.",
          deliverables: ["Build das duas lojas", "Push e offline", "Publicação"],
        },
        {
          name: "Design system",
          summary:
            "Biblioteca de componentes para várias telas ficarem parecidas sem combinar por WhatsApp.",
          deliverables: ["Tokens e tema", "Componentes", "Documentação de uso"],
        },
        {
          name: "Redesign de front legado",
          summary:
            "Modernizo a interface existente sem parar o produto nem reescrever tudo de uma vez.",
          deliverables: ["Diagnóstico", "Migração em etapas", "Paridade de função"],
        },
        {
          name: "Performance e acessibilidade",
          summary:
            "Site pesado ou barrado por teclado e leitor de tela é bug. Meço antes e depois.",
          deliverables: ["Auditoria", "Correções", "Relatório de ganho"],
        },
        {
          name: "3D e visualização na web",
          summary:
            "Cena, produto ou dado em three.js quando o eixo Z explica melhor que uma imagem.",
          deliverables: ["Cena otimizada", "Interação", "Fallback 2D"],
        },
        {
          name: "Sustentação mensal",
          summary:
            "Horas reservadas por mês para ajuste, correção e evolução contínua.",
          deliverables: ["Fila priorizada", "Correção de bug", "Relatório mensal"],
        },
      ],
    },
    proposal: {
      eyebrow: "Documento",
      title: "O que vem no PDF",
      body: "Uma proposta serve para você comparar e decidir. Por isso ela chega inteira, com o que está fora do escopo escrito do mesmo tamanho do que está dentro.",
      items: [
        { title: "Escopo", detail: "O problema e a solução em linguagem de contrato" },
        { title: "Entregáveis", detail: "Lista item por item do que fica pronto" },
        { title: "Etapas e prazo", detail: "Cada fase com data de entrega" },
        { title: "Valor", detail: "Preço fechado e forma de pagamento" },
        { title: "Fora do escopo", detail: "O que não está incluído, por escrito" },
        { title: "Validade", detail: "Até quando a proposta vale, e assinatura" },
      ],
      hint: "passe o cursor por um item para achá-lo na folha ao lado",
      cta: "Pedir um orçamento",
      whatsappText: "Oi Jonathan, quero um orçamento",
    },
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos conversar",
    body: "Me conte o que precisa sair do papel e em quanto tempo. Respondo com o que faria primeiro.",
    locationKey: "onde estou",
    locationValue: "Fortaleza, Brasil · remoto",
  },
  footer: {
    backToTop: "Voltar ao topo ↑",
  },
  chat: {
    assistantName: "Assistente comercial",
    open: "Falar sobre seu projeto",
    close: "Fechar conversa",
    closeShort: "Fechar",
    restart: "Reiniciar conversa",
    typing: "digitando",
    typingLabel: "Escrevendo resposta",
    preview: "prévia da mensagem",
    back: "voltar uma etapa",
    continueWith: (n: number) => `Continuar com ${n}`,
    continueNone: "Nenhum desses, continuar",
    send: "Enviar resposta",
    skip: "pular esta etapa →",
    sendWhatsapp: "Enviar pelo WhatsApp",
    copy: "copiar mensagem",
    copied: "copiada",
    restartShort: "recomeçar",
  },
  chatScript,
};

export type Dictionary = typeof pt;

export default pt;
