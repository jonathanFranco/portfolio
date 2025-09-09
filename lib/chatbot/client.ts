/**
 * Call to the `chat` Edge Function.
 *
 * The browser only knows the function URL and the Supabase anon key — both
 * public by nature. The Gemini key and the service role key live exclusively
 * inside the function environment.
 */

import type { ChatResponse } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CUSTOM_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT;

const TIMEOUT_MS = 30_000;

export class ChatRequestError extends Error {
  constructor(
    message: string,
    readonly retryAfter?: number,
    readonly status?: number
  ) {
    super(message);
    this.name = "ChatRequestError";
  }
}

export function chatEndpoint(): string | null {
  if (CUSTOM_ENDPOINT) return CUSTOM_ENDPOINT;
  if (SUPABASE_URL) return `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/chat`;
  return null;
}

export function isChatConfigured(): boolean {
  return Boolean(chatEndpoint() && ANON_KEY);
}

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  const endpoint = chatEndpoint();
  if (!endpoint || !ANON_KEY) {
    throw new ChatRequestError(
      "Chat não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: ANON_KEY,
        authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ sessionId, message }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | (ChatResponse & { error?: string; retryAfter?: number })
      | null;

    if (!response.ok) {
      throw new ChatRequestError(
        payload?.error ??
          "Não consegui responder agora. Tente novamente em alguns segundos.",
        payload?.retryAfter,
        response.status
      );
    }

    if (!payload?.message) {
      throw new ChatRequestError("Resposta inesperada do servidor.");
    }

    return payload;
  } catch (error) {
    if (error instanceof ChatRequestError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ChatRequestError(
        "A resposta demorou mais que o esperado. Pode tentar de novo?"
      );
    }
    throw new ChatRequestError(
      "Falha de conexão. Verifique sua internet e tente de novo."
    );
  } finally {
    clearTimeout(timeout);
  }
}
