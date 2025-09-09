"use client";

import { Certificates } from "@/components/certificates";
import { Reveal } from "@/components/reveal";

interface StackGroup {
  category: string;
  note: string;
  accent: string;
  technologies: string[];
}

const GROUPS: StackGroup[] = [
  {
    category: "Interface",
    note: "onde a tela nasce",
    accent: "var(--layer-grid)",
    technologies: [
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt",
      "Angular",
      "TypeScript",
      "Flutter",
    ],
  },
  {
    category: "Estado e dados",
    note: "o que a tela sabe",
    accent: "var(--layer-content)",
    technologies: ["Pinia", "Vuex", "Redux", "RxJS", "Zod"],
  },
  {
    category: "Estilo e sistema",
    note: "consistência visual",
    accent: "var(--layer-padding)",
    technologies: [
      "Tailwind CSS",
      "Vuetify",
      "PrimeNG",
      "Material Design",
      "Bootstrap",
      "Figma",
    ],
  },
  {
    category: "Fluxo",
    note: "do commit ao ar",
    accent: "var(--layer-margin)",
    technologies: ["Git", "Vercel", "ESLint", "npm / yarn", "VS Code"],
  },
  {
    category: "3D na web",
    note: "quando a tela ganha eixo Z",
    accent: "var(--layer-border)",
    technologies: ["three.js", "Babylon.js"],
  },
];

export function StacksSection() {
  return (
    <section
      id="stacks"
      className="relative border-t border-rule bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Stacks</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                Ferramentas por função
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              Tudo abaixo já foi para produção em projeto de cliente.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {GROUPS.map((group, index) => (
            <Reveal key={group.category} delay={index * 80}>
              <div
                className="border-l pl-5"
                style={{ borderColor: group.accent }}
              >
                <h3 className="display-tight text-xl">
                  {group.category}
                </h3>
                <p className="mono-label mt-1 text-muted-foreground">
                  {group.note}
                </p>

                <ul className="mt-6">
                  {group.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rule-row group flex items-center justify-between py-3 text-sm transition-colors duration-300 hover:text-primary"
                    >
                      <span className="font-medium">{tech}</span>
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full opacity-25 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ background: group.accent }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Certificates />
      </div>
    </section>
  );
}
