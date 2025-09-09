"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative border-t border-rule py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{t.about.eyebrow}</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                {t.about.title}
              </h2>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <dl className="text-sm">
                {t.about.spec.map((row) => (
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
