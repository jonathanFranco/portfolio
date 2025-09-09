"use client";

import { Code, LucideIcon, Smartphone, Zap } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const spring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 40,
    config: { tension: 170, friction: 26 },
  });
  return (
    <animated.div
      ref={ref}
      style={{
        opacity: spring.opacity,
        transform: spring.y.to((y) => `translateY(${y}px)`),
      }}
      className="space-y-4"
    >
      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </animated.div>
  );
}

const features: FeatureProps[] = [
  {
    icon: Code,
    title: "Código Limpo",
    description:
      "Escrevo código limpo, escalável e seguindo as melhores práticas da indústria.",
  },
  {
    icon: Smartphone,
    title: "Design Responsivo",
    description:
      "Interfaces que funcionam perfeitamente em todos os dispositivos e tamanhos de tela.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Otimizo aplicações para máxima velocidade e melhor experiência do usuário.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Sobre <span className="font-medium">mim</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Desenvolvedor front-end apaixonado por criar experiências digitais
            elegantes e funcionais. Especializado em React, Angular, Vue e
            tecnologias modernas.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
