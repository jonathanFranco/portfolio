"use client";

import { useI18n } from "@/components/i18n-provider";
import { LOCALE_COOKIE, LOCALES } from "@/lib/i18n/config";
import { SCENE_CHANGE_EVENT, scrollToSection } from "@/lib/scenes";
import { cn } from "@/lib/utils";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_IDS = [
  "inicio",
  "about",
  "experience",
  "stacks",
  "projects",
  "services",
  "contact",
] as const;

type NavId = (typeof NAV_IDS)[number];

const isNavId = (id: string): id is NavId => NAV_IDS.includes(id as NavId);

function Brand() {
  const { t } = useI18n();

  return (
    <a
      href="#inicio"
      onClick={(event) => {
        event.preventDefault();
        scrollToSection("inicio");
      }}
      aria-label={t.header.brand}
      className="brand group inline-flex items-baseline whitespace-nowrap rounded-sm py-1"
    >
      <span aria-hidden="true" className="brand-bracket">
        {"<"}
      </span>
      <span aria-hidden="true" className="brand-name">
        jonathan<span className="text-primary">.</span>franco
      </span>
      <span aria-hidden="true" className="brand-caret">
        _
      </span>
      <span aria-hidden="true" className="brand-bracket">
        {"/>"}
      </span>
    </a>
  );
}

function LocaleSwitch() {
  const { lang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.header.language}
      className="mono-label flex h-11 items-center px-1.5 sm:h-10"
    >
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="px-0.5 text-muted-foreground/40">
              /
            </span>
          )}
          <Link
            href={`/${locale}`}
            hrefLang={locale}
            lang={locale}
            scroll={false}
            aria-current={locale === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={cn(
              "rounded-sm px-1 py-1 uppercase transition-colors duration-300",
              locale === lang
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground sm:h-10 sm:w-10"
      aria-label={isDark ? t.header.themeLight : t.header.themeDark}
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
  const { t } = useI18n();
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
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));

    const onScene = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (isNavId(id)) setActive(id);
    };
    window.addEventListener(SCENE_CHANGE_EVENT, onScene);

    const observer = new IntersectionObserver(
      (entries) => {
        if (document.documentElement.classList.contains("scenes-on")) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.removeEventListener(SCENE_CHANGE_EVENT, onScene);
    };
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
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (query.matches) closeMenu(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen, closeMenu]);

  const goTo = (id: string) => scrollToSection(id);

  const links = NAV_IDS.map((id) => ({ id, ...t.header.nav[id] }));

  return (
    <>
      <header
        data-scrolled={scrolled}
        className="group fixed top-0 z-50 w-full border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 data-[scrolled=true]:border-rule data-[scrolled=true]:bg-background/75 data-[scrolled=true]:backdrop-blur-xl"
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 py-2 pl-4 pr-2 sm:px-6 sm:py-4 md:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Brand />

          <nav
            aria-label={t.header.sections}
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {links.map((link) => (
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

          <div className="flex shrink-0 items-center gap-0.5 lg:justify-self-end">
            <LocaleSwitch />
            <ThemeToggle />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="nav-sheet"
              aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-300 hover:bg-secondary lg:hidden"
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
        <div className="fixed inset-0 z-[80] lg:hidden">
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
            aria-label={t.header.navigation}
            className={cn(
              "absolute inset-x-0 bottom-0 mx-auto max-w-lg rounded-t-2xl border-t border-rule bg-card sm:border-x pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/25",
              "transition-transform duration-300 ease-out",
              entered ? "translate-y-0" : "translate-y-full"
            )}
          >
            <span
              aria-hidden="true"
              className="mx-auto mt-2.5 block h-1 w-10 rounded-full bg-rule-strong"
            />

            <p className="eyebrow px-5 pb-1 pt-4">{t.header.goTo}</p>

            <ul className="px-2.5">
              {links.map((link, index) => {
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
