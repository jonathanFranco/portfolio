"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";
import { whatsappUrl } from "@/lib/chatbot/script";
import { DOC_COLORS } from "@/lib/doc-colors";
import { ArrowUpRight, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ProposalDoc = dynamic(() => import("@/components/proposal-doc"), {
  ssr: false,
});

const STEP_ACCENTS = [
  "var(--layer-grid)",
  "var(--layer-content)",
  "var(--layer-padding)",
  "var(--layer-border)",
  "var(--layer-margin)",
];

export function ServicesSection() {
  const { t } = useI18n();

  return (
    <section
      id="services"
      className="relative border-t border-rule py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t.services.eyebrow}</p>
              <h2 className="display-tight mt-5 max-w-2xl text-[clamp(1.75rem,3.4vw,2.75rem)]">
                {t.services.title}
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              {t.services.note}
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {t.services.steps.map((step, index) => {
            const accent = STEP_ACCENTS[index % STEP_ACCENTS.length];
            return (
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
                        "--accent": accent,
                        "--sweep-delay": `${index * 0.35}s`,
                      } as React.CSSProperties
                    }
                  />
                  <div className="pt-5">
                    <span
                      className="step-index mono-label font-medium"
                      style={{ color: accent }}
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
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function ServiceCatalogSection() {
  const { t } = useI18n();
  const { catalog } = t.services;

  return (
    <section
      id="service-catalog"
      className="relative py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="border-t border-rule pt-12">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{catalog.eyebrow}</p>
                <h3 className="display-tight mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)]">
                  {catalog.title}
                </h3>
              </div>
              <p className="mono-label text-muted-foreground">
                {catalog.count(catalog.items.length)}
              </p>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
            {catalog.items.map((service, index) => (
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
      </div>
    </section>
  );
}

export function ProposalSection() {
  const { t } = useI18n();
  const { proposal } = t.services;
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const activeDocItem = hovered ?? pinned;

  return (
    <section id="proposal" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-12 border-t border-rule pt-14 lg:grid-cols-12 lg:gap-14">
          <div className="order-1 lg:order-2 lg:col-span-6">
            <Reveal>
              <p className="eyebrow flex items-center gap-2">
                <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                {proposal.eyebrow}
              </p>
              <h3 className="display-tight mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)]">
                {proposal.title}
              </h3>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                {proposal.body}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="mt-8 text-sm">
                {proposal.items.map((item, index) => {
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
                {proposal.hint}
              </p>

              <a
                href={whatsappUrl(proposal.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                {proposal.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Reveal>
          </div>

          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <div className="h-[360px] w-full sm:h-[460px] lg:h-[560px]">
              <ProposalDoc active={activeDocItem} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
