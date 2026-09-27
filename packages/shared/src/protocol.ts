import type { Difficulty, PackageHealth, Skill, TrustTier, WorkspaceContext } from './types.js';

/**
 * Custom LSP Protocol Methods
 */
export const SKILLFORGE_SUGGEST_METHOD = 'skillforge/suggest';
export const SKILLFORGE_PING_METHOD = 'skillforge/ping';

export interface SuggestionOptions {
  maxResults?: number;
  minTrustTier?: TrustTier;
  difficulty?: Difficulty | 'all';
  enableLlm?: boolean;
}

export interface SkillSuggestionParams {
  intent: string;
  context?: Partial<WorkspaceContext>;
  options?: SuggestionOptions;
}

export interface SuggestedSkill extends Skill {
  trustTier: TrustTier;
  confidence: number;
  reasoning: string;
  caveats?: string;
  health?: PackageHealth;
  isInstalledInWorkspace?: boolean;
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
}

export interface PingResult {
  status: 'ok';
  version: string;
  timestamp: number;
}
