import { matchCanned, suggestQuickReplies } from "../_shared/canned.ts";
import { BUSINESS_RULES, GREETING, LIMITS, UI } from "../_shared/config.ts";
import { corsHeaders, isOriginAllowed, json } from "../_shared/cors.ts";
import {
  checkRateLimit,
  createDbClient,
  getOrCreateConversation,
  getRecentMessages,
  rateLimitKey,
  saveMessages,
  updateConversation,
  upsertLead,
  type StoredMessage,
} from "../_shared/db.ts";
import { buildEstimate } from "../_shared/estimate.ts";
import { callGemini, GeminiError, type GeminiTurn } from "../_shared/gemini.ts";
import { buildContextBlock, buildSystemPrompt } from "../_shared/prompt.ts";
import {
  buildProposal,
  buildWhatsappUrl,
  hasMinimumInfo,
} from "../_shared/proposal.ts";
import {
  hydrateState,
  mergeState,
  normalizeIncomingState,
  normalizeSignals,
  sanitizeUserMessage,
  wrapUserMessage,
} from "../_shared/state.ts";
import type { ChatResponse } from "../_shared/types.ts";

const SYSTEM_PROMPT = buildSystemPrompt();

function hashText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,64}$/.test(value);
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return json({ error: "Método não permitido" }, origin, 405);
  }

  if (!isOriginAllowed(origin)) {
    return json({ error: "Origem não autorizada" }, origin, 403);
  }

  let payload: { sessionId?: unknown; message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Corpo da requisição inválido" }, origin, 400);
  }

  if (!isValidSessionId(payload.sessionId)) {
    return json({ error: "sessionId inválido" }, origin, 400);
  }
  const sessionId = payload.sessionId;

  const message = sanitizeUserMessage(payload.message);
  if (!message) {
    return json({ error: "Mensagem vazia" }, origin, 400);
  }

  try {
    const db = createDbClient();

    const limitKey = await rateLimitKey(request);
    const limit = await checkRateLimit(db, limitKey);
    if (!limit.allowed) {
      return json(
        {
          error:
            "Muitas mensagens em pouco tempo. Aguarde um instante e tente de novo.",
          retryAfter: limit.retryAfter,
        },
        origin,
        429,
        { "retry-after": String(limit.retryAfter) }
      );
    }

    const conversation = await getOrCreateConversation(db, sessionId);
    const { messages: history, total } = await getRecentMessages(
      db,
      conversation.id
    );

    const stored = (conversation.state ?? {}) as Record<string, unknown>;
    const { state: previousState, signals: previousSignals } = hydrateState(stored);
    const lastProposalHash =
      typeof stored.last_proposal_hash === "string"
        ? stored.last_proposal_hash
        : null;
    const llmTurns =
      typeof stored.llm_turns === "number" && stored.llm_turns > 0
        ? stored.llm_turns
        : 0;

    const canned = matchCanned(message, {
      isFirstTurn: total === 0,
      hasProposal: Boolean(lastProposalHash),
      state: previousState,
    });

    if (canned) {
      const cannedState = canned.statePatch
        ? mergeState(previousState, normalizeIncomingState(canned.statePatch))
        : previousState;
      const cannedSignals = canned.signalsPatch
        ? normalizeSignals({ ...previousSignals, ...canned.signalsPatch })
        : previousSignals;

      await saveMessages(db, conversation.id, [
        { role: "user", content: message },
        { role: "assistant", content: canned.reply },
      ]);

      if (canned.statePatch || canned.signalsPatch) {
        await updateConversation(db, conversation.id, {
          state: {
            state: cannedState,
            signals: cannedSignals,
            confidence: 0,
            last_proposal_hash: lastProposalHash,
            llm_turns: llmTurns,
          },
          summary: conversation.summary,
          projectType: cannedState.project_type,
          status: "active",
        });
      }

      const cannedResponse: ChatResponse = {
        message: canned.reply,
        state: cannedState,
        proposalReady: false,
        quickReplies: canned.quickReplies,
        sessionId,
      };
      return json(cannedResponse, origin);
    }

    if (
      total >= LIMITS.maxMessagesPerConversation ||
      llmTurns >= LIMITS.maxLlmTurns
    ) {
      const estimate = buildEstimate(previousState, previousSignals, 1);
      const proposal = buildProposal(previousState, estimate);
      const response: ChatResponse = {
        message:
          "Já temos bastante material aqui. Melhor seguir direto com o " +
          "Jonathan pelo WhatsApp para fechar os detalhes.",
        state: previousState,
        proposalReady: hasMinimumInfo(previousState),
        proposal: hasMinimumInfo(previousState) ? proposal : undefined,
        whatsappUrl: hasMinimumInfo(previousState)
          ? buildWhatsappUrl(proposal.whatsappMessage)
          : undefined,
        sessionId,
      };
      return json(response, origin);
    }

    const trimmedHistory = [...history];
    while (trimmedHistory.length && trimmedHistory[0].role !== "user") {
      trimmedHistory.shift();
    }

    const HISTORY_ENTRY_MAX = 500;
    const turns: GeminiTurn[] = trimmedHistory.map((entry) => ({
      role: entry.role === "assistant" ? "model" : "user",
      text:
        entry.content.length > HISTORY_ENTRY_MAX
          ? `${entry.content.slice(0, HISTORY_ENTRY_MAX)}…`
          : entry.content,
    }));

    const contextBlock = buildContextBlock(previousState, conversation.summary);
    turns.push({
      role: "user",
      text: `${contextBlock}\n\n${wrapUserMessage(message)}`,
    });

    const result = await callGemini(SYSTEM_PROMPT, turns);

    const state = mergeState(previousState, normalizeIncomingState(result.state));
    const signals = normalizeSignals({ ...previousSignals, ...result.signals });
    const confidence = Number.isFinite(result.confidence)
      ? Math.min(Math.max(result.confidence, 0), 1)
      : 0;

    const estimate = buildEstimate(state, signals, confidence);
    const proposal = buildProposal(state, estimate);

    const turnsUsed = llmTurns + 1;
    const mustClose = turnsUsed >= LIMITS.forceProposalAfterTurns;
    const proposalReady =
      (result.proposalReady || mustClose) && hasMinimumInfo(state);
    const proposalHash = hashText(proposal.markdown);

    let reply = result.reply || GREETING;
    let quickReplies: string[] | undefined;

    if (proposalReady) {
      if (proposalHash !== lastProposalHash) {
        reply = `${reply}\n\n${proposal.markdown}\n\n${BUSINESS_RULES.handoffMessage}\n\nEsse resumo está correto?`;
        quickReplies = [UI.confirmLabel, UI.editLabel];
      }
      if (estimate.min === null && !reply.includes(BUSINESS_RULES.uncertaintyMessage)) {
        reply = `${reply}\n\n${BUSINESS_RULES.uncertaintyMessage}`;
      }
    } else {
      quickReplies = suggestQuickReplies(state);
      if (turnsUsed >= LIMITS.maxLlmTurns - 1) {
        reply = `${reply}\n\n${BUSINESS_RULES.wrapUpMessage}`;
      }
    }

    const response: ChatResponse = {
      message: reply,
      state,
      proposalReady,
      proposal: proposalReady ? proposal : undefined,
      whatsappUrl: proposalReady
        ? buildWhatsappUrl(proposal.whatsappMessage)
        : undefined,
      quickReplies,
      sessionId,
    };

    const toStore: StoredMessage[] = [
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ];

    await saveMessages(db, conversation.id, toStore);

    await updateConversation(db, conversation.id, {
      state: {
        state,
        signals,
        confidence,
        last_proposal_hash: proposalReady ? proposalHash : lastProposalHash,
        llm_turns: turnsUsed,
      },
      summary: total + 2 >= LIMITS.summarizeAfter ? result.summary || conversation.summary : null,
      projectType: state.project_type,
      status: proposalReady ? "proposal_ready" : "active",
    });

    if (hasMinimumInfo(state)) {
      await upsertLead(
        db,
        conversation.id,
        state,
        estimate,
        proposalReady ? proposal.whatsappMessage : null
      );
    }

    return json(response, origin);
  } catch (error) {
    console.error("erro no chat:", error);

    if (error instanceof GeminiError && error.status === 429) {
      const retryAfter = error.retryAfter ?? LIMITS.geminiQuotaRetrySeconds;
      return json(
        {
          error: BUSINESS_RULES.quotaMessage,
          retryAfter,
        },
        origin,
        429,
        { "retry-after": String(retryAfter) }
      );
    }

    return json(
      {
        error:
          "Tive um problema para processar sua mensagem. Tente de novo em alguns segundos.",
      },
      origin,
      500
    );
  }
});
