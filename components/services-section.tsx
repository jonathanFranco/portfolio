"use client";

import { Reveal } from "@/components/reveal";
import { DOC_COLORS } from "@/lib/doc-colors";
import { ArrowUpRight, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ProposalDoc = dynamic(() => import("@/components/proposal-doc"), {
  ssr: false,
});

const ORCAMENTO_HREF =
  "https://wa.me/5585988661417?text=Oi%20Jonathan%2C%20quero%20um%20or%C3%A7amento";

interface Step {
  title: string;
  description: string;
  accent: string;
}

const STEPS: Step[] = [
  {
    title: "Conversa",
    description:
      "Você me conta o problema, para quem é e o prazo que tem. Eu pergunto o que falta para o escopo ficar de pé.",
    accent: "var(--layer-grid)",
  },
  {
    title: "Categoria",
    description:
      "Encaixo a demanda em uma das categorias abaixo. É ela que define entregáveis, etapas e faixa de preço.",
    accent: "var(--layer-content)",
  },
  {
    title: "PDF de orçamento",
    description:
      "Você recebe um documento com escopo, entregáveis, etapas, prazo, valor e o que fica de fora. Sem surpresa depois.",
    accent: "var(--layer-padding)",
  },
  {
    title: "Execução",
    description:
      "Entrego em etapas, com link no ar a cada uma. Você acompanha rodando, não em print de apresentação.",
    accent: "var(--layer-border)",
  },
  {
    title: "Entrega",
    description:
      "Código, deploy e um passo a passo de como manter. Mudança fora do escopo vira um novo PDF, nunca um débito silencioso.",
    accent: "var(--layer-margin)",
  },
];

interface Service {
  name: string;
  summary: string;
  deliverables: string[];
}

const SERVICES: Service[] = [
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
    summary: "App em Flutter para Android e iOS a partir de uma base de código.",
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
];

const DOCUMENT_ITEMS = [
  { title: "Escopo", detail: "O problema e a solução em linguagem de contrato" },
  { title: "Entregáveis", detail: "Lista item por item do que fica pronto" },
  { title: "Etapas e prazo", detail: "Cada fase com data de entrega" },
  { title: "Valor", detail: "Preço fechado e forma de pagamento" },
  { title: "Fora do escopo", detail: "O que não está incluído, por escrito" },
  { title: "Validade", detail: "Até quando a proposta vale, e assinatura" },
];

export function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const activeDocItem = hovered ?? pinned;

  return (
    <section
      id="services"
      className="relative border-t border-rule py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Serviços</p>
              <h2 className="display-tight mt-5 max-w-2xl text-[clamp(1.75rem,3.4vw,2.75rem)]">
                Da conversa ao PDF de orçamento
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              Todo projeto começa por um documento. Preço, escopo e prazo por
              escrito antes da primeira linha de código.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 70}
              as="li"
              className="tilt-scene"
            >
              <div className="tilt-card h-full">
                <span
                  className="step-rule"
                  style={
                    {
                      "--accent": step.accent,
                      "--sweep-delay": `${index * 0.35}s`,
                    } as React.CSSProperties
                  }
                />
                <div className="pt-5">
                  <span
                    className="step-index mono-label font-medium"
                    style={{ color: step.accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-tight mt-3 text-lg">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-24 border-t border-rule pt-12">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Categorias</p>
                <h3 className="display-tight mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)]">
                  O que eu faço
                </h3>
              </div>
              <p className="mono-label text-muted-foreground">
                {SERVICES.length} categorias · combináveis no mesmo projeto
              </p>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
            {SERVICES.map((service, index) => (
              <Reveal
                key={service.name}
                delay={index * 50}
                as="li"
                className="tilt-scene"
              >
                <div className="tilt-card service-row rule-row py-6">
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>
                  <ul className="mono-label mt-4 flex flex-wrap gap-x-3 gap-y-2 text-muted-foreground">
                    {service.deliverables.map((item, itemIndex) => (
                      <li key={item} className="flex items-center gap-3">
                        {itemIndex > 0 && (
                          <span aria-hidden="true" className="opacity-40">
                            ·
                          </span>
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="mt-24 grid items-center gap-12 border-t border-rule pt-14 lg:grid-cols-12 lg:gap-14">
          <div className="order-1 lg:order-2 lg:col-span-6">
            <Reveal>
              <p className="eyebrow flex items-center gap-2">
                <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                Documento
              </p>
              <h3 className="display-tight mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)]">
                O que vem no PDF
              </h3>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Uma proposta serve para você comparar e decidir. Por isso ela
                chega inteira, com o que está fora do escopo escrito do mesmo
                tamanho do que está dentro.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="mt-8 text-sm">
                {DOCUMENT_ITEMS.map((item, index) => {
                  const color = DOC_COLORS[index % DOC_COLORS.length];
                  const isActive = activeDocItem === index;
                  return (
                    <li key={item.title} className="rule-row">
                      <button
                        type="button"
                        aria-pressed={pinned === index}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(index)}
                        onBlur={() => setHovered(null)}
                        onClick={() =>
                          setPinned((current) =>
                            current === index ? null : index
                          )
                        }
                        className="grid w-full grid-cols-[1.75rem_1fr] items-baseline gap-4 py-4 text-left transition-colors duration-300"
                      >
                        <span
                          aria-hidden="true"
                          className="mono-label transition-opacity duration-300"
                          style={{ color, opacity: isActive ? 1 : 0.55 }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span
                            className="block font-medium transition-colors duration-300"
                            style={isActive ? { color } : undefined}
                          >
                            {item.title}
                          </span>
                          <span className="mono-label mt-1 block text-muted-foreground">
                            {item.detail}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mono-label mt-5 text-muted-foreground/70">
                passe o cursor por um item para achá-lo na folha ao lado
              </p>

              <a
                href={ORCAMENTO_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Pedir um orçamento
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Reveal>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="h-[360px] w-full sm:h-[460px] lg:h-[560px]">
              <ProposalDoc active={activeDocItem} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
