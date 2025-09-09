"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/reveal";
import { whatsappUrl } from "@/lib/chatbot/script";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const EMAIL = "jonathanbz.franco@gmail.com";

const WHATSAPP_DISPLAY = "(85) 98866-1417";

const CHANNELS = [
  {
    key: "github",
    value: "github.com/jonathanFranco",
    href: "https://github.com/jonathanFranco",
  },
  {
    key: "linkedin",
    value: "in/jonathan-franco-dev",
    href: "https://linkedin.com/in/jonathan-franco-dev/",
  },
];

const MAPS_HREF = "https://maps.app.goo.gl/NrNzuwdt2VfRTKrA7";

export function ContactSection() {
  const { t } = useI18n();
  const channels = [
    ...CHANNELS,
    {
      key: t.contact.locationKey,
      value: t.contact.locationValue,
      href: MAPS_HREF,
    },
  ];

  return (
    <section
      id="contact"
      className="relative border-t border-rule bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2 className="display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">
                {t.contact.title}
              </h2>
              <p className="mt-7 max-w-lg leading-relaxed text-muted-foreground">
                {t.contact.body}
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-10 flex flex-col items-start gap-6">
                <a
                  href={whatsappUrl(t.whatsappHello)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp {WHATSAPP_DISPLAY}
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
                {channels.map((channel) => (
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
                {t.available}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
