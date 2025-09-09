"use client";

import { CONTEXT_PILLS, LIMITS, UI } from "@/lib/chatbot/config";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface ChatComposerProps {
  disabled: boolean;
  quickReplies: string[];
  showStarters: boolean;
  onSend: (text: string) => void;
  autoFocus?: boolean;
}

const MAX_INPUT_HEIGHT = 176;
const MAX_INPUT_VIEWPORT_RATIO = 0.34;

export function ChatComposer({
  disabled,
  quickReplies,
  showStarters,
  onSend,
  autoFocus,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const engaged = useRef(false);

  const focusInput = useCallback(() => {
    const node = textareaRef.current;
    if (!node || node.disabled) return;
    node.focus({ preventScroll: true });
  }, []);

  const resize = useCallback(() => {
    const node = textareaRef.current;
    if (!node) return;
    const ceiling = Math.max(
      64,
      Math.min(
        MAX_INPUT_HEIGHT,
        Math.round(window.innerHeight * MAX_INPUT_VIEWPORT_RATIO)
      )
    );
    node.style.height = "auto";
    const content = node.scrollHeight;
    node.style.height = `${Math.min(content, ceiling)}px`;
    node.style.overflowY = content > ceiling ? "auto" : "hidden";
  }, []);

  useLayoutEffect(resize, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [resize]);

  useEffect(() => {
    if (!autoFocus) return;
    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (finePointer || engaged.current) focusInput();
  }, [autoFocus, focusInput]);

  useEffect(() => {
    if (disabled || !engaged.current) return;
    focusInput();
  }, [disabled, focusInput]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    engaged.current = true;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(focusInput);
  }

  const remaining = LIMITS.maxMessageLength - value.length;
  const suggestions = quickReplies.length
    ? quickReplies
    : showStarters
      ? [...UI.starters]
      : [];

  const pillLabels = CONTEXT_PILLS.map((pill) => pill.label);
  const showingContext =
    suggestions.length === pillLabels.length &&
    suggestions.every((suggestion) => pillLabels.includes(suggestion));

  return (
    <div className="shrink-0 border-t border-rule bg-card px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-3.5">
      {suggestions.length > 0 && (
        <div className="mb-3">
          {showingContext && (
            <p className="mono-label mb-2 px-0.5 text-muted-foreground/70">
              {UI.contextPrompt}
            </p>
          )}
          <ul className="scrollbar-none -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="shrink-0 snap-start sm:shrink">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => submit(suggestion)}
                  className={cn(
                    "mono-label whitespace-nowrap rounded-full border px-3 py-2 text-left transition-colors duration-300 disabled:opacity-50 sm:whitespace-normal sm:py-1.5",
                    showingContext
                      ? "border-primary/40 text-foreground hover:border-primary hover:text-primary"
                      : "border-rule text-muted-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
        className="flex items-end gap-2"
      >
        <label htmlFor="chat-input" className="sr-only">
          Escreva sua mensagem
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          rows={1}
          maxLength={LIMITS.maxMessageLength}
          disabled={disabled}
          placeholder="Conte o que você precisa…"
          autoComplete="off"
          enterKeyHint="send"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(value);
            }
          }}
          className={cn(
            "scrollbar-none min-h-[2.75rem] flex-1 resize-none overflow-hidden rounded-xl border border-rule bg-input px-3.5 py-2.5",
            "text-base leading-relaxed text-foreground placeholder:text-muted-foreground/70 sm:text-sm",
            "focus:border-primary focus:outline-none disabled:opacity-60"
          )}
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensagem"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 sm:h-10 sm:w-10",
            "hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
          )}
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>

      {remaining < 120 && (
        <p className="mono-label mt-2 text-right text-muted-foreground">
          {remaining} caracteres
        </p>
      )}
    </div>
  );
}
