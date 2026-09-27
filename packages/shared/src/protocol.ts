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
}

export interface SkillSuggestionResult {
  skills: SuggestedSkill[];
  timings: {
    localMs: number;
    totalMs: number;
  };
  fallbackUsed?: boolean;
  queryEcho: string;
}

export interface PingResult {
  status: 'ok';
  version: string;
  timestamp: number;
}
