"use client";

import { Markdown } from "@/components/chat/markdown";
import type { ChatMessage, ChatStatus } from "@/components/chat/use-chat";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  retryAfter: number | null;
  onRetry: () => void;
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5 px-1 py-2"
      role="status"
      aria-label="Escrevendo resposta"
    >
      {["var(--layer-grid)", "var(--layer-content)", "var(--layer-padding)"].map(
        (color, index) => (
          <span
            key={color}
            className="h-1.5 w-1.5 animate-pulse rounded-[1px]"
            style={{
              background: color,
              animationDelay: `${index * 0.18}s`,
              animationDuration: "1.1s",
            }}
          />
        )
      )}
      <span className="mono-label ml-1 text-muted-foreground">pensando</span>
    </div>
  );
}

export function ChatMessages({
  messages,
  status,
  error,
  retryAfter,
  onRetry,
}: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, status]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-5"
      aria-live="polite"
      aria-atomic="false"
    >
      <ul className="space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <li
              key={message.id}
              className={cn("flex", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 sm:max-w-[88%]",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "border border-rule bg-secondary/50 text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <Markdown content={message.content} />
                )}
              </div>
            </li>
          );
        })}

        {status === "sending" && (
          <li>
            <TypingIndicator />
          </li>
        )}

        {status === "error" && error && (
          <li>
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-3">
              <p className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                />
                <span>{error}</span>
              </p>
              {retryAfter ? (
                <p className="mono-label mt-2 text-muted-foreground">
                  tente de novo em {retryAfter}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mono-label mt-2 inline-flex items-center gap-1.5 text-primary transition-opacity hover:opacity-70"
                >
                  <RotateCcw aria-hidden="true" className="h-3 w-3" />
                  tentar de novo
                </button>
              )}
            </div>
          </li>
        )}
      </ul>

      <div ref={endRef} />
    </div>
  );
}
