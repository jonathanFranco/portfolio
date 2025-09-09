"use client";

import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

export function ContactSection() {
  const contactCards = [
    {
      icon: Mail,
      title: "Email",
      value: "jonathanfranco01@outlook.com",
      href: "mailto:jonathanfranco01@outlook.com",
      description: "Envie um email",
    },
    {
      icon: Github,
      title: "GitHub",
      value: "github.com/jonathanfranco",
      href: "https://github.com/jonathanFranco",
      description: "Veja meus projetos",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "linkedin.com/in/jonathanfranco",
      href: "https://linkedin.com/in/jonathan-franco-a9612016a/",
      description: "Conecte-se comigo",
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Fortaleza, Brasil",
      href: "https://maps.app.goo.gl/NrNzuwdt2VfRTKrA7",
      description: "Disponível remotamente",
    },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Vamos <span className="font-medium">conversar</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Tem um projeto em mente? Estou sempre aberto para novos desafios e
            colaborações. Entre em contato através de qualquer um dos canais
            abaixo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
            const spring = useSpring({
              opacity: inView ? 1 : 0,
              y: inView ? 0 : 40,
              config: { tension: 170, friction: 26 },
              delay: index * 150,
            });
            return (
              <animated.a
                key={index}
                ref={ref}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  card.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                style={{
                  opacity: spring.opacity,
                  transform: spring.y.to((y) => `translateY(${y}px)`),
                }}
                className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 break-all">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {card.description}
                    </p>
                  </div>
                </div>
              </animated.a>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-background border border-border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              Disponível para novos projetos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
