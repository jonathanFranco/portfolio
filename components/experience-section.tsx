"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";
import { STACK_STEP, stackWindow } from "@/lib/scenes";

export function ExperienceSection() {
  const { t } = useI18n();
  const { experience } = t;
  const count = experience.items.length;

  return (
    <section
      id="experience"
      className="relative border-t border-rule py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{experience.eyebrow}</p>
              <h2 className="display-tight mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">
                {experience.title}
              </h2>
            </div>
            <p className="mono-label max-w-sm text-muted-foreground">
              {experience.note}
            </p>
          </div>
        </Reveal>

        <ol className="scene-stack mt-14">
          {experience.items.map((job, index) => (
            <Reveal
              key={`${job.company}-${job.period}`}
              as="li"
              {...stackWindow(index, count, STACK_STEP)}
            >
              <article className="rule-row grid gap-6 py-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <p className="mono-label text-primary">{job.period}</p>
                  <h3 className="display-tight mt-3 text-xl">{job.role}</h3>
                  <p className="mt-2 text-sm font-medium">{job.company}</p>
                  <p className="mono-label mt-1 text-muted-foreground">
                    {job.location}
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <ul className="space-y-3 leading-relaxed text-muted-foreground">
                    {job.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mono-label mt-6 flex flex-wrap gap-x-3 gap-y-2 text-muted-foreground">
                    {job.tech.map((tech, techIndex) => (
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
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="rule-row grid gap-2 py-8 lg:grid-cols-12 lg:gap-12">
            <p className="eyebrow lg:col-span-4">{experience.education.label}</p>
            <p className="text-sm lg:col-span-8">
              <span className="font-medium">{experience.education.degree}</span>
              <span className="text-muted-foreground">
                {" "}
                · {experience.education.school} · {experience.education.period}
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
