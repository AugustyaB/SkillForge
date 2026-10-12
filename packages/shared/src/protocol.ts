import type {
  ComparisonMatrix,
  Difficulty,
  FeedbackPayload,
  PackageHealth,
  ProviderConfig,
  ProviderType,
  Skill,
  SkillRequestPayload,
  TrustTier,
  WorkspaceContext,
} from './types.js';

/**
 * Custom LSP Protocol Methods
 */
export const SKILLFORGE_SUGGEST_METHOD = 'skillforge/suggest';
export const SKILLFORGE_PING_METHOD = 'skillforge/ping';
export const SKILLFORGE_FEEDBACK_METHOD = 'skillforge/feedback';
export const SKILLFORGE_SKILL_REQUEST_METHOD = 'skillforge/skillRequest';
export const SKILLFORGE_COMPARE_METHOD = 'skillforge/compare';
export const SKILLFORGE_GENERATE_AGENT_SKILL_METHOD = 'skillforge/generateAgentSkill';

export interface SuggestionOptions {
  maxResults?: number;
  minTrustTier?: TrustTier;
  difficulty?: Difficulty | 'all';
  enableLlm?: boolean;
  providerConfig?: ProviderConfig;
}

export interface SkillSuggestionParams {
  intent: string;
  context?: Partial<WorkspaceContext>;
  options?: SuggestionOptions;
  providerConfig?: ProviderConfig;
}

export interface SuggestedSkill extends Skill {
  trustTier: TrustTier;
  confidence: number;
  reasoning: string;
  caveats?: string;
  health?: PackageHealth;
  isInstalledInWorkspace?: boolean;
  /** Whether this skill was discovered or enriched via an LLM provider */
  llmEnhanced?: boolean;
  /** IDs of skills or installed packages that conflict with this suggestion */
  conflictWith?: string[];
  /** User-facing conflict warning message */
  conflictWarning?: string;
}

/** Structured recommendation for a skill category (used in fallback/browse) */
export interface CategoryRecommendation {
  category: string;
  label: string;
  description: string;
  skillIds: string[];
}

export interface SkillSuggestionResult {
  skills: SuggestedSkill[];
  timings: {
    localMs: number;
    totalMs: number;
  };
  fallbackUsed?: boolean;
  queryEcho: string;
  /** Structured category browsing recommendations (populated on fallback) */
  categoryRecommendations?: CategoryRecommendation[];
  /** The suggestion provider that fulfilled the request */
  providerUsed?: ProviderType;
  /** Whether the results were dynamically enhanced by an LLM */
  llmEnhanced?: boolean;
  /** Transparency disclaimer regarding data privacy and network scope */
  privacyNotice?: string;
}

export interface FeedbackParams {
  feedback: FeedbackPayload;
}

export interface SkillRequestParams {
  request: SkillRequestPayload;
}

export interface CompareParams {
  skillIds: string[];
}

export interface CompareResult {
  matrix: ComparisonMatrix;
}

export interface FeedbackResult {
  success: boolean;
  message: string;
}

export interface PingResult {
  status: 'ok';
  version: string;
  timestamp: number;
}
