"use client";

import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "lucide-react";

interface Project {
  title: string;
  context: string;
  description: string;
  image: string;
  tech: string[];
  demo: string;
}

const PROJECTS: Project[] = [
  {
    title: "Homero",
    context: "Educação · IA adaptativa",
    description:
      "Plataforma de ensino adaptativo que ajusta a trilha ao ritmo de cada aluno. O progresso aparece como um mapa de conceitos dominados, não como uma lista de aulas.",
    image: "/homero.jpg",
    tech: ["Vue 3", "TypeScript", "Tailwind", "Pinia", "PrimeVue"],
    demo: "https://homero.app.br/",
  },
  {
    title: "Grupo Multi Suporte",
    context: "Suporte · B2C",
    description:
      "Portal de suporte com FAQ, atendimento e acompanhamento de reparos. Dá autonomia ao cliente e tira volume do atendimento humano.",
    image: "/multi.jpeg",
    tech: ["Nuxt 3", "TypeScript", "Tailwind", "Pinia", "Vuetify"],
    demo: "https://suporte.grupomulti.com.br",
  },
  {
    title: "Grupo Multi Governo",
    context: "Governo · Institucional",
    description:
      "Portal institucional para o setor público, com informação e comunicação oficial em um só lugar. Qualquer cidadão precisa achar o que procura sem ajuda.",
    image: "/multi-gov.png",
    tech: ["Nuxt 3", "TypeScript", "Tailwind", "Pinia", "Vuetify"],
    demo: "https://governo.grupomulti.com.br/",
  },
  {
    title: "Bora Assistir",
    context: "Projeto próprio · Sorteio",
    description:
      "Sorteia o que assistir a partir do Top 250 do IMDb, com filtro opcional por streaming, gênero e década. Nasceu de gastar meia hora escolhendo e não assistir nada.",
    image: "/bora-assistir.jpg",
    tech: ["Next.js", "TypeScript", "Tailwind", "i18n PT/EN", "Vercel"],
    demo: "https://boraassistir.vercel.app/pt",
  },
];

function domainOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative border-t border-rule py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Projetos</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                No ar agora
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              Quatro projetos no ar. Abra qualquer um.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-20 md:space-y-28">
          {PROJECTS.map((project, index) => {
            const flipped = index % 2 === 1;
            return (
              <Reveal key={project.title}>
                <article className="project-row grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                    className={`lg:col-span-7 ${
                      flipped ? "lg:order-2 lg:col-start-6" : ""
                    }`}
                  >
                    <div className="chrome-frame">
                      <div className="chrome-bar">
                        <span className="chrome-dot" />
                        <span className="chrome-dot" />
                        <span className="chrome-dot" />
                        <span className="mono-label ml-2 truncate text-muted-foreground">
                          {domainOf(project.demo)}
                        </span>
                      </div>
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover object-top"
                      />
                    </div>
                  </a>

                  <div
                    className={`lg:col-span-5 ${
                      flipped ? "lg:order-1 lg:col-start-1" : ""
                    }`}
                  >
                    <p className="eyebrow text-primary">{project.context}</p>
                    <h3 className="display-tight mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)]">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    <ul className="mono-label mt-6 flex flex-wrap gap-x-3 gap-y-2 text-muted-foreground">
                      {project.tech.map((tech, techIndex) => (
                        <li key={tech} className="flex items-center gap-3">
                          {techIndex > 0 && (
                            <span aria-hidden="true" className="opacity-40">
                              ·
                            </span>
                          )}
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                    >
                      Abrir {domainOf(project.demo)}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-24 border-t border-rule pt-8">
            <a
              href="https://www.linkedin.com/in/jonathan-franco-a9612016a/details/projects/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw inline-flex items-center gap-2 text-sm font-semibold"
            >
              Ver mais projetos no LinkedIn
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
