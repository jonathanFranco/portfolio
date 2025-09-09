import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  at?: number;
  until?: number;
  className?: string;
  as?: "div" | "li";
}

export function Reveal({
  children,
  delay = 0,
  at,
  until,
  className,
  as = "div",
}: RevealProps) {
  const windowed = at !== undefined || until !== undefined;
  const style = {
    "--d": `${delay}ms`,
    ...(at === undefined ? {} : { "--at": at }),
    ...(until === undefined ? {} : { "--until": until }),
  } as CSSProperties;

  const Component = as;

  return (
    <Component
      data-reveal=""
      data-window={windowed ? "" : undefined}
      style={style}
      className={className}
    >
      {children}
    </Component>
  );
}
