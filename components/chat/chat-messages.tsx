"use client";

import type { ChatMessage } from "@/components/chat/use-chat";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  typing: boolean;
}

function TypingIndicator() {
  const { t } = useI18n();

  return (
    <div
      className="flex items-center gap-1.5 px-1 py-2"
      role="status"
      aria-label={t.chat.typingLabel}
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
      <span className="mono-label ml-1 text-muted-foreground">
        {t.chat.typing}
      </span>
    </div>
  );
}

function whatsappBold(text: string): ReactNode[] {
  return text.split(/(\*[^*\n]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <strong key={index} className="font-semibold">
        {part.slice(1, -1)}
      </strong>
    ) : (
      part
    )
  );
}

export function ChatMessages({ messages, typing }: ChatMessagesProps) {
  const { t } = useI18n();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-5"
      aria-live="polite"
      aria-atomic="false"
    >
      <ul className="space-y-2.5">
        {messages.map((message) => {
          const isUser = message.role === "user";

          if (message.preview) {
            return (
              <li key={message.id}>
                <div className="rounded-xl border border-layer-padding/40 bg-layer-padding/10 px-3.5 py-3">
                  <p className="mono-label mb-2 text-layer-padding">
                    {t.chat.preview}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {whatsappBold(message.content)}
                  </p>
                </div>
              </li>
            );
          }

          return (
            <li
              key={message.id}
              className={cn(
                "chat-bubble-in flex",
                isUser ? "justify-end pt-1.5" : "justify-start"
              )}
            >
              <p
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[88%]",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "border border-rule bg-secondary/50 text-foreground"
                )}
              >
                {message.content}
              </p>
            </li>
          );
        })}

        {typing && (
          <li>
            <TypingIndicator />
          </li>
        )}
      </ul>

      <div ref={endRef} />
    </div>
  );
}
