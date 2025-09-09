"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

const projects = [
  {
    title: "Grupo Multi Suporte",
    description:
      "Portal de suporte do Grupo Multi com FAQ, atendimento e acompanhamento de reparos. Criado para aumentar a autonomia do cliente e otimizar processos internos.",
    image: "/multi.jpeg",
    tech: ["Nuxt 3", "TypeScript", "Tailwind", "Pinia", "Vuetify"],
    demo: "https://suporte.grupomulti.com.br",
  },
  {
    title: "Grupo Multi Governo",
    description:
      "Portal institucional do Grupo Multi para o setor público, centralizando informações e comunicação oficial. Criado para fortalecer e facilitar processos governamentais.",
    image: "/multi-gov.png",
    tech: ["Nuxt 3", "TypeScript", "Tailwind", "Pinia", "Vuetify"],
    demo: "https://governo.grupomulti.com.br/",
  },
  {
    title: "Iosi +",
    description:
      "Portal educacional IOSI+ com recomendação de aulas, conteúdo exclusivo e área de acesso personalizado. Criado para personalizar o aprendizado e engajar estudantes.",
    image: "/iosi.jpeg",
    tech: ["Angular", "Material Design", "RxJs", "Boostrap", "PrimeNG"],
    demo: "https://iosimais.iosi.com.br/",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Meus <span className="font-medium">projetos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Alguns dos projetos que desenvolvi, demonstrando minhas habilidades
            e experiência.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });
            const spring = useSpring({
              opacity: inView ? 1 : 0,
              y: inView ? 0 : 40,
              config: { tension: 170, friction: 26 },
              delay: index * 150,
            });
            return (
              <animated.div
                key={index}
                ref={ref}
                style={{
                  opacity: spring.opacity,
                  transform: spring.y.to((y) => `translateY(${y}px)`),
                }}
                className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-background border border-border text-foreground text-xs rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1" asChild>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            asChild
            size="lg"
            className="px-8 text-base font-medium hover:text-white hover:opacity-75"
            variant="outline"
          >
            <a
              href="https://www.linkedin.com/in/jonathan-franco-a9612016a/details/projects/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver mais projetos no LinkedIn
              <ExternalLink className="w-4 h-4 ml-2 inline" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
