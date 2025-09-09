"use client";

import { animated, useSpring } from "@react-spring/web";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface RevealProps {
  children: ReactNode;
  /** Atraso em ms, para escalonar itens de uma mesma lista. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
}

/**
 * Revelação de entrada por seção. Existe como componente para que o hook rode
 * uma vez por item renderizado, em vez de dentro de um `map`.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 16,
    delay: reduceMotion ? 0 : delay,
    immediate: reduceMotion,
    config: { tension: 190, friction: 26 },
  });

  const style = {
    opacity: spring.opacity,
    transform: spring.y.to((y) => `translate3d(0, ${y}px, 0)`),
  };

  const Component = as === "li" ? animated.li : animated.div;

  return (
    <Component ref={ref as never} style={style} className={className}>
      {children}
    </Component>
  );
}
