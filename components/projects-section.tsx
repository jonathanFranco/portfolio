"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n";
import { stackSceneLength, stackWindow } from "@/lib/scenes";
import { ArrowUpRight } from "lucide-react";

type ProjectId = keyof Dictionary["projects"]["items"];

interface Project {
  id: ProjectId;
  title: string;
  image: string;
  demo: string;
}

const PROJECTS: Project[] = [
  {
    id: "homero",
    title: "Homero",
    image: "/homero.jpg",
    demo: "https://homero.app.br/",
  },
  {
    id: "avaIfce",
    title: "AVA Jovens Empreendedores Digitais",
    image: "/ava-ifce.jpg",
    demo: "https://ava.empreendedoresdigitais.ifce.edu.br/",
  },
  {
    id: "vaiBoy",
    title: "Vai Boy",
    image: "/vaiboy.jpg",
    demo: "https://app.vaiboy.com.br/",
  },
  {
    id: "multiSupport",
    title: "Grupo Multi Suporte",
    image: "/multi.jpg",
    demo: "https://suporte.grupomulti.com.br",
  },
  {
    id: "multiGov",
    title: "Grupo Multi Governo",
    image: "/multi-gov.jpg",
    demo: "https://governo.grupomulti.com.br/",
  },
  {
    id: "fortalConnect",
    title: "Fortal Connect",
    image: "/fortal-connect.jpg",
    demo: "https://fortalconnect.com.br/",
  },
  {
    id: "boraAssistir",
    title: "Bora Assistir",
    image: "/bora-assistir.jpg",
    demo: "https://boraassistir.vercel.app/pt",
  },
  {
    id: "pirataflix",
    title: "Pirataflix",
    image: "/pirataflix.jpg",
    demo: "https://pirataflix.netlify.app",
  },
];

const PROJECT_STEP = 0.6;

const projectWindow = (index: number) =>
  stackWindow(index, PROJECTS.length, PROJECT_STEP);

export const PROJECTS_SCENE_LENGTH = stackSceneLength(
  PROJECTS.length,
  PROJECT_STEP
);

function domainOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ProjectsSection() {
  const { t } = useI18n();

  return (
    <section
      id="projects"
      className="relative border-t border-rule py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t.projects.eyebrow}</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                {t.projects.title}
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              {t.projects.note}
            </p>
          </div>
        </Reveal>

        <ol aria-hidden="true" className="project-progress">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.title} as="li" {...projectWindow(index)}>
              <span className="mono-label">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Reveal>
          ))}
        </ol>

        <div className="scene-stack mt-16 space-y-20 md:space-y-28">
          {PROJECTS.map((project, index) => {
            const flipped = index % 2 === 1;
            const copy = t.projects.items[project.id];
            return (
              <Reveal key={project.title} {...projectWindow(index)}>
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
                        src={project.image}
                        alt=""
                        loading="lazy"
                        className="block aspect-[16/10] w-full object-contain"
                      />
                    </div>
                  </a>

                  <div
                    className={`lg:col-span-5 ${
                      flipped ? "lg:order-1 lg:col-start-1" : ""
                    }`}
                  >
                    <p className="eyebrow text-primary">{copy.context}</p>
                    <h3 className="display-tight mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)]">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                      {copy.description}
                    </p>

                    <ul className="mono-label mt-6 flex flex-wrap gap-x-3 gap-y-2 text-muted-foreground">
                      {copy.tech.map((tech, techIndex) => (
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
                      {t.projects.open(domainOf(project.demo))}
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
              href="https://www.linkedin.com/in/jonathan-franco-dev/details/projects/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw inline-flex items-center gap-2 text-sm font-semibold"
            >
              {t.projects.more}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
