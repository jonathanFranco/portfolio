"use client";

import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { id: "about", label: "Sobre" },
  { id: "stacks", label: "Stacks" },
  { id: "projects", label: "Projetos" },
  { id: "contact", label: "Contato" },
];

function ThemeToggleButton({
  theme,
  setTheme,
}: {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 rounded-full hover:bg-accent transition-all duration-200"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

function NavLinks({
  onClick,
  className = "",
}: {
  onClick: (id: string) => void;
  className?: string;
}) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <button
          key={link.id}
          onClick={() => onClick(link.id)}
          className={className}
        >
          {link.label}
        </button>
      ))}
    </>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 w-full backdrop-blur-xl bg-background/80 border-b border-border/40 z-50 animate-fade-in-up">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-primary">JF</div>
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks
            onClick={scrollToSection}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
          />
          <div className="ml-4 pl-4 border-l border-border/40">
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
          </div>
        </nav>
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggleButton theme={theme} setTheme={setTheme} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-9 w-9 rounded-full hover:bg-accent transition-all duration-200"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-background/95 border-t border-border/40 animate-fade-in-up">
          <nav className="max-w-6xl mx-auto px-8 py-6 flex flex-col space-y-2">
            <NavLinks
              onClick={scrollToSection}
              className="text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
            />
          </nav>
        </div>
      )}
    </header>
  );
}
