"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, LucideIcon, Mail } from "lucide-react";

interface SocialButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const SOCIALS: SocialButtonProps[] = [
  {
    href: "https://github.com/jonathanFranco",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/in/jonathan-franco-a9612016a/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:jonathanfranco01@outlook.com",
    label: "E-mail",
    icon: Mail,
  },
];

function SocialButton({ href, label, icon: Icon }: SocialButtonProps) {
  const isMail = href.startsWith("mailto:");
  return (
    <Button
      variant="ghost"
      size="lg"
      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift"
      asChild
      aria-label={label}
    >
      {isMail ? (
        <a href={href}>
          <Icon className="h-6 w-6" />
        </a>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Icon className="h-6 w-6" />
        </a>
      )}
    </Button>
  );
}

export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`absolute block w-1.5 h-1.5 rounded-full bg-primary/30 animate-particle z-0`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className="animate-fade-in-up animate-hero-awesome">
          <div className="mb-8 animate-scale-in animate-delay-200">
            <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-6">
              Disponível para novos projetos
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance animate-slide-in-left animate-delay-300">
            Olá, eu sou{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary-foreground bg-clip-text text-transparent animate-gradient-move drop-shadow-lg">
              Jonathan Franco
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground mb-6 animate-fade-in-up animate-delay-400">
            Desenvolvedor Front-End
          </p>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-500">
            Especializado em criar experiências digitais excepcionais e
            interfaces elegantes usando React, Next.js e as mais recentes
            tecnologias web.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-in-up animate-delay-600">
            <Button
              onClick={scrollToAbout}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium hover-lift shadow-lg"
            >
              Ver meu trabalho
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                <SocialButton key={social.label} {...social} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
