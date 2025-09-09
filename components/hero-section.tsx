"use client";

import {
  Github,
  Linkedin,
  type LucideIcon,
  Mail,
  MessageCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const DomLayers = dynamic(() => import("@/components/dom-layers"), {
  ssr: false,
});

interface SocialProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const SOCIALS: SocialProps[] = [
  {
    href: "https://wa.me/5585988661417?text=Oi%20Jonathan%2C%20vim%20pelo%20seu%20portf%C3%B3lio",
    label: "WhatsApp (85) 98866-1417",
    icon: MessageCircle,
  },
  { href: "https://github.com/jonathanFranco", label: "GitHub", icon: Github },
  {
    href: "https://linkedin.com/in/jonathan-franco-a9612016a/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:jonathanfranco01@outlook.com",
    label: "E-mail",
    icon: Mail,
  },
];

const CORE_STACK = [
  "React",
  "Next.js",
  "Vue",
  "Nuxt",
  "Angular",
  "TypeScript",
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-24 lg:pt-28">
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-6 md:px-10">
        <div className="grid flex-1 items-center gap-10 py-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow fade-up delay-1">
              Desenvolvedor front-end sênior
              <span className="mx-2 opacity-40">/</span>
              Fortaleza, Brasil
            </p>

            <h1 className="display mt-5 text-[clamp(2.75rem,8vw,6rem)]">
              <span className="line-mask">
                <span className="delay-1 block">Jonathan</span>
              </span>
              <span className="line-mask">
                <span className="delay-2 block">Franco</span>
              </span>
            </h1>

            <p className="display-tight fade-up delay-3 mt-7 max-w-xl text-[clamp(1.25rem,2.5vw,1.75rem)]">
              Transformo sistemas complicados em telas{" "}
              <span className="text-primary">simples de usar</span>.
            </p>

            <p className="fade-up delay-4 mt-5 max-w-lg leading-relaxed text-muted-foreground md:text-lg">
              Portais de suporte, governo e educação em React, Vue e Angular —
              do design system ao deploy.
            </p>

            <div className="fade-up delay-5 mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollTo("projects")}
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Ver projetos
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center rounded-full border border-rule px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                Falar comigo
              </button>

              <div className="ml-1 flex items-center gap-1">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground"
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="pointer-events-none relative -mx-6 h-[30svh] min-h-44 md:-mx-10 lg:absolute lg:inset-x-0 lg:left-[46%] lg:top-8 lg:bottom-20 lg:mx-0 lg:h-auto">
          <DomLayers />
        </div>

        <p className="mono-label fade-up delay-6 absolute bottom-28 right-6 hidden text-right text-muted-foreground lg:block md:right-10">
          árvore do DOM em camadas
          <br />
          <span className="text-muted-foreground/60">
            mova o cursor · role sobre ela para achatar
          </span>
        </p>

        <div className="fade-up delay-7 flex flex-col gap-3 border-t border-rule py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <ul className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            {CORE_STACK.map((tech, i) => (
              <li key={tech} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="opacity-40">
                    ·
                  </span>
                )}
                {tech}
              </li>
            ))}
          </ul>

          <p className="mono-label flex items-center gap-2 text-layer-padding">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-layer-padding opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-layer-padding" />
            </span>
            Disponível para novos projetos
          </p>
        </div>
      </div>
    </section>
  );
}
