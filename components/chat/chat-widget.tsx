"use client";

import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatOptions } from "@/components/chat/chat-options";
import { useChat } from "@/components/chat/use-chat";
import { useI18n } from "@/components/i18n-provider";
import { DEVELOPER } from "@/lib/chatbot/config";
import { cn } from "@/lib/utils";
import { MessageSquare, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { t } = useI18n();
  const chat = useChat(t.chatScript);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    setEntered(false);
    const timer = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const root = document.documentElement;
    function apply() {
      if (!viewport) return;
      root.style.setProperty("--chat-vv-height", `${viewport.height}px`);
      root.style.setProperty("--chat-vv-top", `${viewport.offsetTop}px`);
    }

    apply();
    viewport.addEventListener("resize", apply);
    viewport.addEventListener("scroll", apply);
    return () => {
      viewport.removeEventListener("resize", apply);
      viewport.removeEventListener("scroll", apply);
      root.style.removeProperty("--chat-vv-height");
      root.style.removeProperty("--chat-vv-top");
    };
  }, [rendered]);

  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? t.chat.close : t.chat.open}
        className={cn(
          "group fixed right-4 z-[70] flex items-center gap-2.5 rounded-full bg-primary py-3 pl-4 pr-4 text-primary-foreground shadow-lg shadow-primary/20 sm:pr-5",
          "bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-5 md:bottom-8 md:right-8",
          "transition-[transform,opacity] duration-300 hover:-translate-y-0.5",
          open && "pointer-events-none scale-90 opacity-0",
        )}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <MessageSquare aria-hidden="true" className="h-5 w-5" />
          <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full bg-layer-padding" />
        </span>
        <span className="hidden text-sm font-semibold min-[380px]:inline">
          {t.chat.open}
        </span>
      </button>

      {rendered && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-panel-title"
          aria-hidden={!entered}
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden border-rule bg-card shadow-2xl shadow-black/20",
            "chat-panel-viewport inset-x-0 bottom-0 top-0 border-y-0",
            "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:rounded-xl sm:border",
            "sm:h-[min(640px,calc(100dvh-6rem))] sm:w-[min(400px,calc(100vw-3rem))] lg:w-[420px]",
            "origin-bottom-right transition-[opacity,transform] duration-300 ease-out",
            entered
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0",
          )}
        >
          <header className="chrome-bar shrink-0 justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="chrome-dot" />
                <span className="chrome-dot" />
                <span className="chrome-dot" />
              </span>
              <span
                id="chat-panel-title"
                className="mono-label text-foreground"
              >
                {t.chat.assistantName}
                <span className="text-muted-foreground">
                  {" "}
                  · {DEVELOPER.firstName.toLowerCase()}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={chat.restart}
                disabled={chat.isFresh}
                title={t.chat.restart}
                aria-label={t.chat.restart}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 sm:h-7 sm:w-7"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                title={t.chat.closeShort}
                aria-label={t.chat.close}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:h-7 sm:w-7"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </header>

          <ChatMessages messages={chat.messages} typing={chat.typing} />

          <ChatOptions
            step={chat.typing ? null : chat.step}
            disabled={chat.typing}
            canGoBack={!chat.isFresh}
            message={chat.typing ? null : chat.message}
            whatsappUrl={chat.whatsappUrl}
            onAnswer={chat.answer}
            onBack={chat.back}
            onRestart={chat.restart}
          />
        </div>
      )}
    </>
  );
}

export default ChatWidget;
