"use client";

import { Reveal } from "@/components/reveal";

/** Ficha técnica: só fatos verificáveis, na linguagem de quem contrata. */
const SPEC: Array<{ key: string; value: string }> = [
  { key: "stack principal", value: "React · Next.js · TypeScript" },
  { key: "também entrego em", value: "Vue · Nuxt · Angular" },
  { key: "mobile", value: "Flutter" },
  { key: "3D na web", value: "three.js · Babylon.js" },
  { key: "foco", value: "design system, acessibilidade, performance" },
  { key: "domínios", value: "suporte B2C · governo · educação" },
  { key: "base", value: "Fortaleza, Brasil · remoto" },
  { key: "disponibilidade", value: "aberto a novos projetos" },
];

export function AboutSection() {
  return (
    <section id="about" className="relative border-t border-rule py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Sobre</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                Trabalho no front-end de portais que as pessoas usam para
                resolver alguma coisa.
              </h2>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Abrir um chamado de suporte, achar uma informação de governo,
                  assistir uma aula. Isso muda como eu decido: um componente que
                  ninguém entende, uma animação que atrapalha e um bundle grande
                  são bug, não detalhe.
                </p>
                <p>
                  Na prática, isso é construir o design system junto com a
                  primeira tela, medir o que carrega, testar no teclado antes de
                  achar bonito, e deixar o código legível para quem chega depois
                  de mim.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <dl className="text-sm">
                {SPEC.map((row) => (
                  <div
                    key={row.key}
                    className="rule-row grid grid-cols-[9.5rem_1fr] gap-4 py-4"
                  >
                    <dt className="mono-label text-muted-foreground">
                      {row.key}
                    </dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
