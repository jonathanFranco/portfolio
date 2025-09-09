import { DEVELOPER } from "./config";

export type ServiceKey =
  | "site"
  | "system"
  | "store"
  | "app"
  | "dashboard"
  | "improve"
  | "design_system"
  | "support"
  | "other";

interface ServiceCopy {
  label: string;
  reaction: string;
  goalQuestion: string;
  goalOptions: string[];
  featureOptions: string[];
}

export interface ChatCopy {
  services: Record<ServiceKey, ServiceCopy>;
  intro: (developer: string) => string[];
  goalPlaceholder: string;
  featuresQuestion: string;
  stageQuestion: string;
  stageOptions: string[];
  deadlineQuestion: string;
  deadlineOptions: string[];
  budgetQuestion: string;
  budgetOptions: string[];
  detailsQuestion: string;
  detailsPlaceholder: string;
  nameQuestion: string;
  namePlaceholder: string;
  noneSelected: string;
  skipped: string;
  done: (developer: string) => string[];
  message: {
    greeting: (developer: string) => string;
    service: string;
    goal: string;
    features: string;
    stage: string;
    deadline: string;
    budget: string;
    details: string;
    closing: string;
    closingWithName: (name: string) => string;
  };
}

const SERVICE_KEYS: ServiceKey[] = [
  "site",
  "system",
  "store",
  "app",
  "dashboard",
  "improve",
  "design_system",
  "support",
  "other",
];

export interface Answers {
  service?: ServiceKey;
  goal?: string;
  features?: string[];
  stage?: string;
  deadline?: string;
  budget?: string;
  details?: string;
  name?: string;
}

export type StepId =
  | "service"
  | "goal"
  | "features"
  | "stage"
  | "deadline"
  | "budget"
  | "details"
  | "name";

export type StepInput =
  | { kind: "choice"; options: string[] }
  | { kind: "multi"; options: string[] }
  | { kind: "text"; placeholder: string; optional: boolean };

export interface Step {
  id: StepId;
  lines: string[];
  input: StepInput;
}

const ORDER: StepId[] = [
  "service",
  "goal",
  "features",
  "stage",
  "deadline",
  "budget",
  "details",
  "name",
];

export function serviceFromLabel(
  copy: ChatCopy,
  label: string
): ServiceKey | undefined {
  return SERVICE_KEYS.find((key) => copy.services[key].label === label);
}

function applies(copy: ChatCopy, id: StepId, answers: Answers): boolean {
  if (id === "features") {
    return Boolean(
      answers.service && copy.services[answers.service].featureOptions.length
    );
  }
  return true;
}

export function stepsFor(copy: ChatCopy, answers: Answers): StepId[] {
  return ORDER.filter((id) => applies(copy, id, answers));
}

export function isAnswered(id: StepId, answers: Answers): boolean {
  return answers[id] !== undefined;
}

export function currentStep(copy: ChatCopy, answers: Answers): StepId | null {
  return stepsFor(copy, answers).find((id) => !isAnswered(id, answers)) ?? null;
}

export function buildStep(copy: ChatCopy, id: StepId, answers: Answers): Step {
  const service = answers.service ? copy.services[answers.service] : undefined;

  switch (id) {
    case "service":
      return {
        id,
        lines: copy.intro(DEVELOPER.firstName),
        input: {
          kind: "choice",
          options: SERVICE_KEYS.map((key) => copy.services[key].label),
        },
      };
    case "goal":
      return {
        id,
        lines: [service?.reaction ?? "", service?.goalQuestion ?? ""].filter(Boolean),
        input: service?.goalOptions.length
          ? { kind: "choice", options: service.goalOptions }
          : {
              kind: "text",
              placeholder: copy.goalPlaceholder,
              optional: false,
            },
      };
    case "features":
      return {
        id,
        lines: [copy.featuresQuestion],
        input: { kind: "multi", options: service?.featureOptions ?? [] },
      };
    case "stage":
      return {
        id,
        lines: [copy.stageQuestion],
        input: { kind: "choice", options: copy.stageOptions },
      };
    case "deadline":
      return {
        id,
        lines: [copy.deadlineQuestion],
        input: { kind: "choice", options: copy.deadlineOptions },
      };
    case "budget":
      return {
        id,
        lines: [copy.budgetQuestion],
        input: { kind: "choice", options: copy.budgetOptions },
      };
    case "details":
      return {
        id,
        lines: [copy.detailsQuestion],
        input: {
          kind: "text",
          placeholder: copy.detailsPlaceholder,
          optional: true,
        },
      };
    case "name":
      return {
        id,
        lines: [copy.nameQuestion],
        input: {
          kind: "text",
          placeholder: copy.namePlaceholder,
          optional: true,
        },
      };
  }
}

export function answerLabel(
  copy: ChatCopy,
  id: StepId,
  answers: Answers
): string {
  const value = answers[id];
  if (Array.isArray(value)) return value.length ? value.join(", ") : copy.noneSelected;
  if (id === "service" && answers.service) return copy.services[answers.service].label;
  return value ? String(value) : copy.skipped;
}

export function buildWhatsappMessage(copy: ChatCopy, answers: Answers): string {
  const service = answers.service ? copy.services[answers.service] : undefined;
  const labels = copy.message;
  const lines: string[] = [labels.greeting(DEVELOPER.firstName), ""];

  if (service) lines.push(`*${labels.service}:* ${service.label}`);
  if (answers.goal) lines.push(`*${labels.goal}:* ${answers.goal}`);
  if (answers.features?.length) {
    lines.push(`*${labels.features}:*`, ...answers.features.map((item) => `• ${item}`));
  }
  if (answers.stage) lines.push(`*${labels.stage}:* ${answers.stage}`);
  if (answers.deadline) lines.push(`*${labels.deadline}:* ${answers.deadline}`);
  if (answers.budget) lines.push(`*${labels.budget}:* ${answers.budget}`);
  if (answers.details) lines.push(`*${labels.details}:* ${answers.details}`);

  lines.push(
    "",
    answers.name ? labels.closingWithName(answers.name) : labels.closing
  );

  return lines.join("\n");
}

export function whatsappUrl(message: string): string {
  const number = DEVELOPER.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
