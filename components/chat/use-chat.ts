"use client";

import { ChatRequestError, sendChatMessage } from "@/lib/chatbot/client";
import { GREETING } from "@/lib/chatbot/config";
import {
  clearStoredProposal,
  createMessageId,
  getSessionId,
  loadTranscript,
  resetSession,
  saveTranscript,
} from "@/lib/chatbot/session";
import type { Proposal } from "@/lib/chatbot/types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type ChatStatus = "idle" | "sending" | "error";

function greetingMessage(): ChatMessage {
  return { id: "greeting", role: "assistant", content: GREETING };
}

export function useChat() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage()]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const lastSent = useRef<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    setSessionId(getSessionId());

    const stored = loadTranscript();
    if (stored.length) {
      setMessages([greetingMessage(), ...stored]);
    }

    clearStoredProposal();

    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveTranscript(
      messages
        .filter((message) => message.id !== "greeting")
        .map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
        }))
    );
  }, [messages]);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || status === "sending") return;

      const id = sessionId || getSessionId();
      if (!sessionId) setSessionId(id);

      lastSent.current = text;
      setError(null);
      setRetryAfter(null);
      setQuickReplies([]);
      setStatus("sending");
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "user", content: text },
      ]);

      try {
        const response = await sendChatMessage(id, text);

        setMessages((current) => [
          ...current,
          { id: createMessageId(), role: "assistant", content: response.message },
        ]);

        if (response.proposalReady && response.proposal && response.whatsappUrl) {
          setProposal(response.proposal);
          setWhatsappUrl(response.whatsappUrl);
        }

        setQuickReplies(response.quickReplies ?? []);
        setStatus("idle");
        lastSent.current = null;
      } catch (cause) {
        const failure =
          cause instanceof ChatRequestError
            ? cause
            : new ChatRequestError("Algo deu errado. Tente novamente.");
        setError(failure.message);
        setRetryAfter(failure.retryAfter ?? null);
        setStatus("error");
      }
    },
    [sessionId, status]
  );

  const retry = useCallback(async () => {
    const text = lastSent.current;
    if (!text || status === "sending") return;

    setError(null);
    setRetryAfter(null);
    setStatus("sending");

    try {
      const id = sessionId || getSessionId();
      const response = await sendChatMessage(id, text);

      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "assistant", content: response.message },
      ]);

      if (response.proposalReady && response.proposal && response.whatsappUrl) {
        setProposal(response.proposal);
        setWhatsappUrl(response.whatsappUrl);
      }

      setQuickReplies(response.quickReplies ?? []);
      setStatus("idle");
      lastSent.current = null;
    } catch (cause) {
      const failure =
        cause instanceof ChatRequestError
          ? cause
          : new ChatRequestError("Algo deu errado. Tente novamente.");
      setError(failure.message);
      setRetryAfter(failure.retryAfter ?? null);
      setStatus("error");
    }
  }, [sessionId, status]);

  const restart = useCallback(() => {
    setSessionId(resetSession());
    setMessages([greetingMessage()]);
    setStatus("idle");
    setError(null);
    setRetryAfter(null);
    setProposal(null);
    setWhatsappUrl(null);
    setQuickReplies([]);
    clearStoredProposal();
    lastSent.current = null;
  }, []);

  return {
    messages,
    status,
    error,
    retryAfter,
    proposal,
    whatsappUrl,
    quickReplies,
    isFresh: messages.length <= 1,
    send,
    retry,
    restart,
  };
}
