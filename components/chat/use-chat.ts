"use client";

import { DEVELOPER } from "@/lib/chatbot/config";
import {
  type Answers,
  answerLabel,
  buildStep,
  buildWhatsappMessage,
  type ChatCopy,
  currentStep,
  isAnswered,
  type Step,
  type StepId,
  serviceFromLabel,
  stepsFor,
  whatsappUrl,
} from "@/lib/chatbot/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  preview?: boolean;
}

const TYPING_MS = 550;

function transcript(
  copy: ChatCopy,
  answers: Answers,
  message: string | null
): ChatMessage[] {
  const out: ChatMessage[] = [];

  for (const id of stepsFor(copy, answers)) {
    const step = buildStep(copy, id, answers);
    step.lines.forEach((content, index) =>
      out.push({ id: `${id}-q${index}`, role: "assistant", content })
    );
    if (!isAnswered(id, answers)) return out;
    out.push({ id: `${id}-a`, role: "user", content: answerLabel(copy, id, answers) });
  }

  copy.done(DEVELOPER.firstName).forEach((content, index) =>
    out.push({ id: `done-${index}`, role: "assistant", content })
  );
  if (message) {
    out.push({ id: "preview", role: "assistant", content: message, preview: true });
  }
  return out;
}

export function useChat(copy: ChatCopy) {
  const [answers, setAnswers] = useState<Answers>({});
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const stepId = currentStep(copy, answers);
  const step: Step | null = stepId ? buildStep(copy, stepId, answers) : null;
  const message = stepId ? null : buildWhatsappMessage(copy, answers);

  const all = useMemo(
    () => transcript(copy, answers, message),
    [copy, answers, message]
  );

  const messages = useMemo(() => {
    if (!typing) return all;
    const lastUser = all.map((item) => item.role).lastIndexOf("user");
    return all.slice(0, lastUser + 1);
  }, [all, typing]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pulseTyping = useCallback(() => {
    clearTimeout(timer.current);
    setTyping(true);
    timer.current = setTimeout(() => setTyping(false), TYPING_MS);
  }, []);

  const answer = useCallback(
    (id: StepId, value: string | string[]) => {
      setAnswers((current) => {
        if (id === "service" && typeof value === "string") {
          return { service: serviceFromLabel(copy, value) ?? "other" };
        }
        return { ...current, [id]: value };
      });
      pulseTyping();
    },
    [copy, pulseTyping]
  );

  const back = useCallback(() => {
    clearTimeout(timer.current);
    setTyping(false);
    setAnswers((current) => {
      const answered = stepsFor(copy, current).filter((id) => isAnswered(id, current));
      const last = answered[answered.length - 1];
      if (!last) return current;
      const next = { ...current };
      delete next[last];
      return next;
    });
  }, [copy]);

  const restart = useCallback(() => {
    clearTimeout(timer.current);
    setTyping(false);
    setAnswers({});
  }, []);

  return {
    messages,
    step,
    typing,
    message,
    whatsappUrl: message ? whatsappUrl(message) : null,
    isFresh: answers.service === undefined,
    answer,
    back,
    restart,
  };
}
