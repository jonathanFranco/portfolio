/**
 * GENERATED FILE — do not edit by hand.
 * Source: lib/chatbot/types.ts
 * Regenerate: bun run edge:sync
 */

export type ProjectCategory =
  | "landing_page"
  | "institutional_website"
  | "ecommerce"
  | "web_system"
  | "dashboard"
  | "saas"
  | "chatbot"
  | "automation"
  | "api_integration"
  | "shopify"
  | "frontend"
  | "mobile_app"
  | "design_system"
  | "performance"
  | "maintenance"
  | "other";

export type Complexity = "small" | "medium" | "large" | "custom";

export interface LeadState {
  client_name: string | null;
  company: string | null;
  email: string | null;
  whatsapp: string | null;
  project_type: ProjectCategory[];
  project_description: string | null;
  objective: string | null;
  target_audience: string | null;
  features: string[];
  integrations: string[];
  existing_system: string | null;
  deadline: string | null;
  budget: string | null;
  references: string | null;
  additional_notes: string | null;
}

export interface ComplexitySignals {
  screens: number | null;
  has_auth: boolean;
  has_admin_panel: boolean;
  has_payments: boolean;
  has_ai: boolean;
  has_database: boolean;
  external_integrations: number;
  business_complexity: "low" | "medium" | "high";
}

export interface Estimate {
  complexity: Complexity;
  min: number | null;
  max: number | null;
  openEnded: boolean;
  label: string;
  score: number;
}

export interface Proposal {
  state: LeadState;
  estimate: Estimate;
  categoryLabels: string[];
  markdown: string;
  whatsappMessage: string;
}

export interface ChatResponse {
  message: string;
  state: Partial<LeadState>;
  proposalReady: boolean;
  proposal?: Proposal;
  whatsappUrl?: string;
  quickReplies?: string[];
  sessionId: string;
}

export interface ChatErrorResponse {
  error: string;
  retryAfter?: number;
}

export const EMPTY_LEAD_STATE: LeadState = {
  client_name: null,
  company: null,
  email: null,
  whatsapp: null,
  project_type: [],
  project_description: null,
  objective: null,
  target_audience: null,
  features: [],
  integrations: [],
  existing_system: null,
  deadline: null,
  budget: null,
  references: null,
  additional_notes: null,
};
