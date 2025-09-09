"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/lib/i18n";

type GroupId = keyof Dictionary["stacks"]["groups"];

interface StackGroup {
  id: GroupId;
  accent: string;
  technologies: string[];
}

const GROUPS: StackGroup[] = [
  {
    id: "interface",
    accent: "var(--layer-grid)",
    technologies: [
      "Vue.js",
      "Nuxt",
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "Flutter",
    ],
  },
  {
    id: "state",
    accent: "var(--layer-content)",
    technologies: [
      "Pinia",
      "Redux",
      "RxJS",
      "APIs REST",
      "WebSocket / STOMP",
      "RabbitMQ",
    ],
  },
  {
    id: "style",
    accent: "var(--layer-padding)",
    technologies: [
      "Tailwind CSS",
      "PrimeVue",
      "PrimeNG",
      "Vuetify",
      "Angular Material",
      "Chart.js / ApexCharts",
      "Leaflet / MapLibre",
    ],
  },
  {
    id: "quality",
    accent: "var(--layer-grid)",
    technologies: [
      "Vitest",
      "Jest",
      "Playwright",
      "WCAG / VLibras",
      "Core Web Vitals",
      "Keycloak (OAuth2/OIDC)",
    ],
  },
  {
    id: "flow",
    accent: "var(--layer-margin)",
    technologies: [
      "Git / GitFlow",
      "Docker",
      "Nginx",
      "Kubernetes",
      "Jenkins",
      "Azure DevOps",
    ],
  },
  {
    id: "ai",
    accent: "var(--layer-border)",
    technologies: ["Claude Code", "MCP", "TensorFlow.js", "three.js"],
  },
];

export function StacksSection() {
  const { t } = useI18n();

  return (
    <section
      id="stacks"
      className="relative border-t border-rule bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t.stacks.eyebrow}</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                {t.stacks.title}
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              {t.stacks.note}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {GROUPS.map((group, index) => (
            <Reveal key={group.id} delay={index * 80}>
              <div
                className="border-l pl-5"
                style={{ borderColor: group.accent }}
              >
                <h3 className="display-tight text-xl">
                  {t.stacks.groups[group.id].category}
                </h3>
                <p className="mono-label mt-1 text-muted-foreground">
                  {t.stacks.groups[group.id].note}
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

      </div>
    </section>
  );
}
