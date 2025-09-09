"use client";

import { Reveal } from "@/components/reveal";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const EMAIL = "jonathanfranco01@outlook.com";

const WHATSAPP = {
  display: "(85) 98866-1417",
  href: "https://wa.me/5585988661417?text=Oi%20Jonathan%2C%20vim%20pelo%20seu%20portf%C3%B3lio",
};

const CHANNELS = [
  {
    key: "github",
    value: "github.com/jonathanFranco",
    href: "https://github.com/jonathanFranco",
  },
  {
    key: "linkedin",
    value: "in/jonathan-franco-a9612016a",
    href: "https://linkedin.com/in/jonathan-franco-a9612016a/",
  },
  {
    key: "onde estou",
    value: "Fortaleza, Brasil · remoto",
    href: "https://maps.app.goo.gl/NrNzuwdt2VfRTKrA7",
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative border-t border-rule bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Contato</p>
              <h2 className="display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">
                Vamos conversar
              </h2>
              <p className="mt-7 max-w-lg leading-relaxed text-muted-foreground">
                Me conte o que precisa sair do papel e em quanto tempo. Respondo
                com o que faria primeiro.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-10 flex flex-col items-start gap-6">
                <a
                  href={WHATSAPP.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp {WHATSAPP.display}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="link-draw break-all font-mono text-lg text-primary md:text-2xl"
                >
                  {EMAIL}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <ul>
                {CHANNELS.map((channel) => (
                  <li key={channel.key} className="rule-row">
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 py-5 text-sm"
                    >
                      <span className="mono-label text-muted-foreground">
                        {channel.key}
                      </span>
                      <span className="flex items-center gap-3 font-medium transition-colors duration-300 group-hover:text-primary">
                        <span className="truncate">{channel.value}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mono-label mt-8 flex items-center gap-2 text-layer-padding">
                <span className="h-1.5 w-1.5 rounded-full bg-layer-padding" />
                Disponível para novos projetos
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
