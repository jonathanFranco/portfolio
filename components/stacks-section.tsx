"use client";

import { Code, Palette, Wrench } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

const techStacks = [
  {
    category: "Frontend",
    icon: Code,
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "Angular", icon: "🅰️" },
      { name: "Vue.js", icon: "💚" },
      { name: "Next.js", icon: "▲" },
      { name: "Nuxt", icon: "💚" },
      { name: "TypeScript", icon: "🔷" },
    ],
  },
  {
    category: "Ferramentas",
    icon: Wrench,
    technologies: [
      { name: "Git", icon: "🔀" },
      { name: "VS Code", icon: "💙" },
      { name: "Figma", icon: "🎯" },
      { name: "Vercel", icon: "▲" },
      { name: "npm/yarn", icon: "📦" },
      { name: "ESLint", icon: "🔍" },
    ],
  },
  {
    category: "Bibliotecas",
    icon: Palette,
    technologies: [
      { name: "RxJS", icon: "🔄" },
      { name: "Pinia", icon: "🍍" },
      { name: "Vuex", icon: "💚" },
      { name: "Redux", icon: "🔮" },
      { name: "Zod", icon: "🛡️" },
      { name: "Vuetify", icon: "🎨" },
    ],
  },
];

export function StacksSection() {
  return (
    <section id="stacks" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Minhas <span className="font-medium">stacks</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tecnologias e ferramentas que uso para criar aplicações modernas e
            eficientes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {techStacks.map((stack, index) => {
            const IconComponent = stack.icon;
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
                className="group"
              >
                <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">{stack.category}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {stack.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className="flex items-center gap-2 p-3 bg-background/60 border border-border/30 rounded-lg hover:bg-background/80 hover:border-primary/20 transition-all duration-200 group/tech"
                      >
                        <span className="text-lg">{tech.icon}</span>
                        <span className="text-sm font-medium text-foreground/80 group-hover/tech:text-foreground transition-colors">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </animated.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
