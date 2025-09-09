"use client";

/**
 * Chat session in the browser.
 *
 * The `sessionId` identifies the conversation in Supabase. It lives in
 * localStorage so the visitor can reload the page without losing the thread.
 * No personal data is stored here beyond what the visitor typed.
 */

const SESSION_KEY = "jf-chat-session";
const TRANSCRIPT_KEY = "jf-chat-transcript";
const PROPOSAL_KEY = "jf-chat-proposal";

const TRANSCRIPT_LIMIT = 40;

export interface StoredTranscriptMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `s${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) return existing;
    const created = randomId();
    window.localStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    // Private browsing with storage blocked: session stays in memory only.
    return randomId();
  }
}

export function resetSession(): string {
  if (typeof window === "undefined") return "";
  try {
    window.localStorage.removeItem(TRANSCRIPT_KEY);
    window.localStorage.removeItem(PROPOSAL_KEY);
    const created = randomId();
    window.localStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return randomId();
  }
}

export function loadTranscript(): StoredTranscriptMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TRANSCRIPT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is StoredTranscriptMessage =>
          item && typeof item.content === "string" &&
          (item.role === "user" || item.role === "assistant")
      )
      .slice(-TRANSCRIPT_LIMIT);
  } catch {
    return [];
  }
}

export function saveTranscript(messages: StoredTranscriptMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TRANSCRIPT_KEY,
      JSON.stringify(messages.slice(-TRANSCRIPT_LIMIT))
    );
  } catch {
    // No storage available: the conversation lives only in this tab.
  }
}

export function clearStoredProposal(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROPOSAL_KEY);
  } catch {
    // No storage: nothing to clear.
  }
}

export { randomId as createMessageId };
