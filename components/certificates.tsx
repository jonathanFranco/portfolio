"use client";

import { Reveal } from "@/components/reveal";
import { ArrowUpRight } from "lucide-react";

export interface Certificate {
  name: string;
  issuer: string;
  year?: string;
  url?: string;
}


export const CERTIFICATES: Certificate[] = [
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    year: "ago 2026",
    url: "https://verify.skilljar.com/c/hc2andy36dgt",
  },
  {
    name: "Angular 7/8 — Material Design + Node.js + MongoDB + Firebase",
    issuer: "Udemy",
    year: "ago 2026",
    url: "https://www.udemy.com/certificate/UC-428cfeeb-891a-447e-ba2e-dd00e910673d/",
  },
  {
    name: "API Restful Javascript com Node.js, Typescript, TypeORM etc",
    issuer: "Udemy",
    year: "ago 2026",
    url: "https://www.udemy.com/certificate/UC-7258ab9a-a8ab-4dde-937a-bbe011ac88cb/",
  },
  {
    name: "Spring Boot 2026 REST API's do 0 à AWS e GCP c Java e Docker",
    issuer: "Udemy",
    year: "ago 2026",
    url: "https://www.udemy.com/certificate/UC-02cab135-5197-406e-ae1c-70f3b00f6fa5/",
  },
  {
    name: "React Js do zero ao avançado na pratica",
    issuer: "Udemy",
    year: "ago 2022",
    url: "https://www.udemy.com/certificate/UC-d05bb644-ddbe-45f0-a0c4-d3efff012f3d/",
  },
];

export function Certificates() {
  if (CERTIFICATES.length === 0) return null;

  return (
    <Reveal delay={80}>
      <div className="mt-20 border-t border-rule pt-12 lg:mt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Certificados</p>
            <h3 className="display-tight mt-4 text-[clamp(1.35rem,2.4vw,1.9rem)]">
              Formação contínua
            </h3>
          </div>
          <p className="mono-label text-muted-foreground">
            {CERTIFICATES.length} certificados · credenciais verificáveis
          </p>
        </div>

        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {CERTIFICATES.map((certificate) => {
            const row = (
              <>
                <span className="min-w-0">
                  <span className="block font-medium">{certificate.name}</span>
                  <span className="mono-label mt-1 block text-muted-foreground">
                    {certificate.issuer}
                  </span>
                </span>
                <span className="mono-label flex shrink-0 items-center gap-2 text-muted-foreground">
                  {certificate.year}
                  {certificate.url && (
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  )}
                </span>
              </>
            );

            return (
              <li key={`${certificate.issuer}-${certificate.name}`}>
                {certificate.url ? (
                  <a
                    href={certificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rule-row group flex items-start justify-between gap-6 py-4 text-sm transition-colors duration-300 hover:text-primary"
                  >
                    {row}
                  </a>
                ) : (
                  <div className="rule-row flex items-start justify-between gap-6 py-4 text-sm">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
