"use client";

import { useI18n } from "@/components/i18n-provider";
import type { Step, StepId } from "@/lib/chatbot/script";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  Copy,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatOptionsProps {
  step: Step | null;
  disabled: boolean;
  canGoBack: boolean;
  message: string | null;
  whatsappUrl: string | null;
  onAnswer: (id: StepId, value: string | string[]) => void;
  onBack: () => void;
  onRestart: () => void;
}

const CHIP =
  "mono-label rounded-full border px-3 py-2 text-left transition-colors duration-300 disabled:opacity-50 sm:py-1.5";

export function ChatOptions({
  step,
  disabled,
  canGoBack,
  message,
  whatsappUrl,
  onAnswer,
  onBack,
  onRestart,
}: ChatOptionsProps) {
  const { t } = useI18n();

  return (
    <div className="shrink-0 border-t border-rule bg-card px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-3.5">
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="mono-label mb-2.5 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-3 w-3" />
          {t.chat.back}
        </button>
      )}

      {step?.input.kind === "choice" && (
        <ul className="flex flex-wrap gap-2">
          {step.input.options.map((option) => (
            <li key={option}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(step.id, option)}
                className={cn(
                  CHIP,
                  "border-primary/40 text-foreground hover:border-primary hover:text-primary"
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}

      {step?.input.kind === "multi" && (
        <MultiChoice
          key={step.id}
          options={step.input.options}
          disabled={disabled}
          onDone={(values) => onAnswer(step.id, values)}
        />
      )}

      {step?.input.kind === "text" && (
        <TextAnswer
          key={step.id}
          placeholder={step.input.placeholder}
          optional={step.input.optional}
          disabled={disabled}
          onDone={(value) => onAnswer(step.id, value)}
        />
      )}

      {!step && message && whatsappUrl && (
        <Finish message={message} whatsappUrl={whatsappUrl} onRestart={onRestart} />
      )}
    </div>
  );
}

function MultiChoice({
  options,
  disabled,
  onDone,
}: {
  options: string[];
  disabled: boolean;
  onDone: (values: string[]) => void;
}) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (option: string) =>
    setPicked((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = picked.includes(option);
          return (
            <li key={option}>
              <button
                type="button"
                aria-pressed={on}
                disabled={disabled}
                onClick={() => toggle(option)}
                className={cn(
                  CHIP,
                  "inline-flex items-center gap-1.5",
                  on
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-rule text-muted-foreground hover:border-primary hover:text-foreground"
                )}
              >
                {on && <Check aria-hidden="true" className="h-3 w-3" />}
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDone(picked)}
        className="mt-3 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
      >
        {picked.length ? t.chat.continueWith(picked.length) : t.chat.continueNone}
      </button>
    </>
  );
}

function TextAnswer({
  placeholder,
  optional,
  disabled,
  onDone,
}: {
  placeholder: string;
  optional: boolean;
  disabled: boolean;
  onDone: (value: string) => void;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const submit = () => {
    const text = value.trim();
    if (!text && !optional) return;
    onDone(text);
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex items-center gap-2"
      >
        <label htmlFor="chat-input" className="sr-only">
          {placeholder}
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={value}
          maxLength={240}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="send"
          onChange={(event) => setValue(event.target.value)}
          className="min-h-[2.75rem] flex-1 rounded-xl border border-rule bg-input px-3.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none disabled:opacity-60 sm:text-sm"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label={t.chat.send}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 sm:h-10 sm:w-10"
        >
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      {optional && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDone("")}
          className="mono-label mt-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.chat.skip}
        </button>
      )}
    </>
  );
}

function Finish({
  message,
  whatsappUrl,
  onRestart,
}: {
  message: string;
  whatsappUrl: string;
  onRestart: () => void;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-layer-padding px-5 py-2.5 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        {t.chat.sendWhatsapp}
      </a>
      <div className="mt-2.5 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={copy}
          className="mono-label inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-3 w-3" />
          ) : (
            <Copy aria-hidden="true" className="h-3 w-3" />
          )}
          <span aria-live="polite">{copied ? t.chat.copied : t.chat.copy}</span>
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="mono-label inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw aria-hidden="true" className="h-3 w-3" />
          {t.chat.restartShort}
        </button>
      </div>
    </>
  );
}
