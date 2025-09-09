"use client";

import { UI } from "@/lib/chatbot/config";
import type { Proposal } from "@/lib/chatbot/types";
import { ArrowUpRight, MessageCircle } from "lucide-react";

interface ChatProposalProps {
  proposal: Proposal;
  whatsappUrl: string;
}

export function ChatProposal({ proposal, whatsappUrl }: ChatProposalProps) {
  const { estimate, categoryLabels } = proposal;

  return (
    <div className="shrink-0 border-t border-rule bg-secondary/40 px-3.5 py-3.5 sm:px-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow">Proposta pronta</p>
        {estimate.min !== null && (
          <p className="mono-label text-foreground">{estimate.label}</p>
        )}
      </div>

      {categoryLabels.length > 0 && (
        <p className="mono-label mt-1.5 text-muted-foreground">
          {categoryLabels.join(" + ")}
        </p>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 flex items-center justify-center gap-2 rounded-full bg-layer-padding px-5 py-2.5 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        {UI.whatsappLabel}
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>

      <p className="mono-label mt-2 text-center text-muted-foreground/80">
        abre o WhatsApp com a mensagem já escrita
      </p>
    </div>
  );
}
