import type {
  SkillSuggestionResult,
  SuggestedSkill,
} from '@skillforge/shared';

export interface HybridMergerOptions {
  maxResults?: number;
}

/**
 * HybridMerger — Combines high-speed curated local database results with
 * dynamic AI discoveries.
 *
 * Guarantees:
 * 1. Curated local recommendations take precedence (verified trust tier, exact docs).
 * 2. Deduplicates on canonical ID and package stack indicators.
 * 3. Incorporates novel AI-discovered skills not present in the local database.
 * 4. Preserves accurate local vs total execution timings.
 */
export class HybridMerger {
  public static merge(
    localResult: SkillSuggestionResult,
    aiResult: SkillSuggestionResult,
    options?: HybridMergerOptions
  ): SkillSuggestionResult {
    const maxResults = options?.maxResults ?? 5;
    const seenIds = new Set<string>();
    const seenIndicators = new Set<string>();
    const mergedSkills: SuggestedSkill[] = [];

    // Helper to register identifiers
    const registerIdentifiers = (skill: SuggestedSkill) => {
      seenIds.add(skill.id.toLowerCase());
      for (const ind of skill.stackIndicators || []) {
        seenIndicators.add(ind.toLowerCase());
      }
    };

    const isDuplicate = (skill: SuggestedSkill): boolean => {
      if (seenIds.has(skill.id.toLowerCase())) return true;
      for (const ind of skill.stackIndicators || []) {
        if (seenIndicators.has(ind.toLowerCase())) return true;
      }
      return false;
    };

    // 1. Add curated local skills first (if local didn't use generic fallback)
    if (!localResult.fallbackUsed) {
      for (const skill of localResult.skills) {
        if (!isDuplicate(skill)) {
          mergedSkills.push(skill);
          registerIdentifiers(skill);
        }
      }
    }

    // 2. Add AI suggestions
    let aiSkillsAdded = 0;
    for (const skill of aiResult.skills) {
      if (!isDuplicate(skill)) {
        mergedSkills.push({
          ...skill,
          llmEnhanced: true,
        });
        registerIdentifiers(skill);
        aiSkillsAdded += 1;
      }
    }

    // 3. If local was fallback and AI produced nothing, retain local fallback cards
    if (mergedSkills.length === 0 && localResult.fallbackUsed) {
      for (const skill of localResult.skills) {
        mergedSkills.push(skill);
      }
    }

    const finalSkills = mergedSkills.slice(0, maxResults);
    const hasAiSkills = aiSkillsAdded > 0;

    return {
      skills: finalSkills,
      timings: {
        localMs: localResult.timings.localMs,
        totalMs: Math.max(localResult.timings.totalMs, aiResult.timings.totalMs),
      },
      fallbackUsed: finalSkills.length === 0 || (localResult.fallbackUsed && !hasAiSkills),
      queryEcho: localResult.queryEcho || aiResult.queryEcho,
      providerUsed: hasAiSkills ? aiResult.providerUsed : localResult.providerUsed || 'local',
      llmEnhanced: hasAiSkills,
      privacyNotice: hasAiSkills
        ? aiResult.privacyNotice
        : localResult.privacyNotice || '100% Offline & Private (Zero code leaves your machine)',
    };
  }
}
