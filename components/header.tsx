"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "about", label: "Sobre", hint: "quem eu sou e como trabalho" },
  { id: "stacks", label: "Stacks", hint: "tecnologias que uso no dia a dia" },
  { id: "projects", label: "Projetos", hint: "o que já entreguei" },
  { id: "services", label: "Serviços", hint: "no que posso te ajudar" },
  { id: "contact", label: "Contato", hint: "vamos conversar" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground sm:h-10 sm:w-10"
      aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {mounted && isDark ? (
        <Sun className="h-[1.05rem] w-[1.05rem]" />
      ) : (
        <Moon className="h-[1.05rem] w-[1.05rem]" />
      )}
    </button>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span
        className={cn(
          "absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ease-out",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
        )}
      />
      <span
        className={cn(
          "absolute left-0 block h-[1.5px] rounded-full bg-current transition-[transform,width] duration-300 ease-out",
          open
            ? "top-1/2 w-full -translate-y-1/2 -rotate-45"
            : "top-[11px] w-3/5"
        )}
      />
    </span>
  );
}

export function Header() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [entered, setEntered] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
      setScrolled(window.scrollY > 8);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setRendered(true);
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    setEntered(false);
    const timer = setTimeout(() => setRendered(false), 320);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  const closeMenu = useCallback((returnFocus = true) => {
    setMenuOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled])"
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    const focusTimer = setTimeout(() => firstItemRef.current?.focus(), 120);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 640px)");
    const onChange = () => {
      if (query.matches) closeMenu(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen, closeMenu]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeLink = NAV_LINKS.find((link) => link.id === active);

  return (
    <>
      <header
        data-scrolled={scrolled}
        className="group fixed top-0 z-50 w-full border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 data-[scrolled=true]:border-rule data-[scrolled=true]:bg-background/75 data-[scrolled=true]:backdrop-blur-xl"
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:justify-center sm:px-6 sm:py-4 md:px-10">
          <p className="mono-label truncate text-muted-foreground sm:hidden">
            {activeLink ? activeLink.label.toLowerCase() : "início"}
          </p>

          <nav
            aria-label="Seções do site"
            className="hidden items-center gap-8 sm:flex"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goTo(link.id)}
                data-active={active === link.id}
                aria-current={active === link.id ? "true" : undefined}
                className="link-draw text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground data-[active=true]:text-primary"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:absolute sm:right-4 sm:gap-0 md:right-8">
            <ThemeToggle />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="nav-sheet"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-300 hover:bg-secondary sm:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary opacity-0 transition-opacity duration-500 group-data-[scrolled=true]:opacity-100"
        />
      </header>

      {rendered && (
        <div className="fixed inset-0 z-[80] sm:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => closeMenu()}
            className={cn(
              "absolute inset-0 h-full w-full cursor-default bg-background/70 backdrop-blur-md transition-opacity duration-300",
              entered ? "opacity-100" : "opacity-0"
            )}
          />

          <div
            id="nav-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navegação"
            className={cn(
              "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-rule bg-card pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/25",
              "transition-transform duration-300 ease-out",
              entered ? "translate-y-0" : "translate-y-full"
            )}
          >
            <span
              aria-hidden="true"
              className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-rule-strong"
            />

            <p className="eyebrow px-5 pb-1 pt-4">Ir para</p>

            <ul className="px-2.5">
              {NAV_LINKS.map((link, index) => {
                const isActive = active === link.id;
                return (
                  <li
                    key={link.id}
                    className="border-t border-rule first:border-t-0"
                  >
                    <button
                      ref={index === 0 ? firstItemRef : undefined}
                      type="button"
                      onClick={() => {
                        closeMenu(false);
                        setTimeout(() => goTo(link.id), 220);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      style={{
                        transitionDelay: entered
                          ? `${60 + index * 45}ms`
                          : "0ms",
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-2.5 py-3.5 text-left transition-[opacity,transform,background-color] duration-300",
                        entered
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0",
                        isActive ? "bg-secondary/60" : "active:bg-secondary/40"
                      )}
                    >
                      <span
                        className={cn(
                          "mono-label w-6 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground/70"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-base font-semibold",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {link.label}
                        </span>
                        <span className="mono-label block truncate text-muted-foreground">
                          {link.hint}
                        </span>
                      </span>

                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-[1px] bg-primary"
                        />
                      ) : (
                        <ChevronRight
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-muted-foreground/60"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
