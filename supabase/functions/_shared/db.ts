/**
 * Postgres access. Uses the service role key, which exists only inside the
 * Edge Function environment — the browser never talks to the database
 * directly (RLS closed, no policies).
 */

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { LIMITS } from "./config.ts";
import type { Complexity, Estimate, LeadState, ProjectCategory } from "./types.ts";

export interface ConversationRow {
  id: string;
  session_id: string;
  status: string;
  state: unknown;
  summary: string | null;
  project_type: string[];
}

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
}

export function createDbClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anonymous key: a hash of the IP, so the raw address is never stored. */
export async function rateLimitKey(request: Request): Promise<string> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "desconhecido";

  const salt = Deno.env.get("RATE_LIMIT_SALT") ?? "portfolio-chat";
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkRateLimit(
  db: SupabaseClient,
  key: string
): Promise<{ allowed: boolean; retryAfter: number }> {
  const { data, error } = await db.rpc("chat_rate_limit_hit", {
    p_key: key,
    p_window_seconds: LIMITS.rateLimit.windowSeconds,
    p_max: LIMITS.rateLimit.maxRequests,
  });

  if (error) {
    console.error("rate limit indisponível:", error.message);
    return { allowed: true, retryAfter: 0 };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: row?.allowed !== false,
    retryAfter: Number(row?.retry_after ?? 0),
  };
}

export async function getOrCreateConversation(
  db: SupabaseClient,
  sessionId: string
): Promise<ConversationRow> {
  const { data: existing, error: selectError } = await db
    .from("conversations")
    .select("id, session_id, status, state, summary, project_type")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (selectError) throw new Error(`Falha ao ler a conversa: ${selectError.message}`);
  if (existing) return existing as ConversationRow;

  const { data: created, error: insertError } = await db
    .from("conversations")
    .insert({ session_id: sessionId })
    .select("id, session_id, status, state, summary, project_type")
    .single();

  if (insertError) {
    const { data: raced } = await db
      .from("conversations")
      .select("id, session_id, status, state, summary, project_type")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (raced) return raced as ConversationRow;
    throw new Error(`Falha ao criar a conversa: ${insertError.message}`);
  }

  return created as ConversationRow;
}

export async function getRecentMessages(
  db: SupabaseClient,
  conversationId: string
): Promise<{ messages: StoredMessage[]; total: number }> {
  const { data, error, count } = await db
    .from("messages")
    .select("role, content", { count: "exact" })
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(LIMITS.historyWindow);

  if (error) throw new Error(`Falha ao ler mensagens: ${error.message}`);

  return {
    messages: ((data ?? []) as StoredMessage[]).slice().reverse(),
    total: count ?? 0,
  };
}

export async function saveMessages(
  db: SupabaseClient,
  conversationId: string,
  messages: StoredMessage[]
): Promise<void> {
  const { error } = await db.from("messages").insert(
    messages.map((message) => ({
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
    }))
  );
  if (error) console.error("falha ao gravar mensagens:", error.message);
}

export async function updateConversation(
  db: SupabaseClient,
  conversationId: string,
  patch: {
    state: unknown;
    summary: string | null;
    projectType: ProjectCategory[];
    status: string;
  }
): Promise<void> {
  const { error } = await db
    .from("conversations")
    .update({
      state: patch.state,
      summary: patch.summary,
      project_type: patch.projectType,
      status: patch.status,
    })
    .eq("id", conversationId);
  if (error) console.error("falha ao atualizar a conversa:", error.message);
}

export async function upsertLead(
  db: SupabaseClient,
  conversationId: string,
  state: LeadState,
  estimate: Estimate,
  proposalMessage: string | null
): Promise<void> {
  const { error } = await db.from("leads").upsert(
    {
      conversation_id: conversationId,
      name: state.client_name,
      company: state.company,
      email: state.email,
      whatsapp: state.whatsapp,
      project_type: state.project_type,
      description: state.project_description,
      objective: state.objective,
      features: state.features,
      integrations: state.integrations,
      deadline: state.deadline,
      budget: state.budget,
      complexity: estimate.complexity as Complexity,
      estimated_min: estimate.min,
      estimated_max: estimate.max,
      proposal: proposalMessage,
    },
    { onConflict: "conversation_id" }
  );
  if (error) console.error("falha ao gravar o lead:", error.message);
}
