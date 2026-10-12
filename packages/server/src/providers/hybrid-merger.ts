import type {
  SkillSuggestionResult,
  SuggestedSkill,
  TrustTier,
} from '@skillforge/shared';
import type { SkillsRepository } from '../data/skills-repository.js';
import { ConflictDetector } from '../reliability/conflict-detector.js';
import { TrustTierClassifier } from '../reliability/trust-tier-classifier.js';

export interface HybridMergerOptions {
  maxResults?: number;
  alreadyInstalled?: string[];
  minTrustTier?: TrustTier;
  repository?: SkillsRepository;
}

/**
 * HybridMerger — Combines high-speed curated local database results with
 * dynamic AI discoveries.
 *
 * Guarantees:
 * 1. Curated local recommendations take precedence (verified trust tier, exact docs).
 * 2. Deduplicates on canonical ID and package stack indicators.
 * 3. Incorporates novel AI-discovered skills not present in the local database.
 * 4. Runs cross-source conflict detection, workspace installed tagging, and trust-tier filtering.
 * 5. Preserves accurate local vs total execution timings and fallback category recommendations.
 */
export class HybridMerger {
  public static merge(
    localResult: SkillSuggestionResult,
    aiResult: SkillSuggestionResult,
    options?: HybridMergerOptions
  ): SkillSuggestionResult {
    const maxResults = options?.maxResults ?? 5;
    const alreadyInstalled = options?.alreadyInstalled ?? [];
    const seenIds = new Set<string>();
    const seenIndicators = new Set<string>();
    const mergedSkills: SuggestedSkill[] = [];

    // Build normalized installed set (including repository indicator mappings)
    const installedSet = new Set(
      alreadyInstalled.map((pkg) => pkg.toLowerCase().trim()).filter(Boolean)
    );
    if (options?.repository) {
      for (const pkg of alreadyInstalled) {
        const matched = options.repository.getSkillByIndicator(pkg);
        if (matched) {
          installedSet.add(matched.id.toLowerCase());
        }
      }
    }

    const checkIsInstalled = (skill: SuggestedSkill): boolean => {
      if (skill.isInstalledInWorkspace) return true;
      if (installedSet.has(skill.id.toLowerCase())) return true;
      return (skill.stackIndicators || []).some((ind) =>
        installedSet.has(ind.toLowerCase())
      );
    };

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
          mergedSkills.push({
            ...skill,
            isInstalledInWorkspace: checkIsInstalled(skill),
          });
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
          isInstalledInWorkspace: checkIsInstalled(skill),
        });
        registerIdentifiers(skill);
        aiSkillsAdded += 1;
      }
    }

    // 3. If local was fallback and AI produced nothing, retain local fallback cards
    if (mergedSkills.length === 0 && localResult.fallbackUsed) {
      for (const skill of localResult.skills) {
        mergedSkills.push({
          ...skill,
          isInstalledInWorkspace: checkIsInstalled(skill),
        });
      }
    }

    // 4. Filter by minTrustTier if requested
    let postProcessed = mergedSkills;
    if (options?.minTrustTier) {
      const classifier = new TrustTierClassifier();
      postProcessed = classifier.filterByMinTier(postProcessed, options.minTrustTier);
    }

    // 5. Slice to maxResults and run cross-source ConflictDetector
    const detector = new ConflictDetector(options?.repository);
    const finalSkills = detector.detectConflicts(
      postProcessed.slice(0, maxResults),
      alreadyInstalled
    );

    const hasAiSkills = aiSkillsAdded > 0 && finalSkills.some((s) => s.llmEnhanced);
    const isFallback = Boolean(
      finalSkills.length === 0 || (localResult.fallbackUsed && !hasAiSkills)
    );

    return {
      skills: finalSkills,
      timings: {
        localMs: localResult.timings.localMs,
        totalMs: Math.max(localResult.timings.totalMs, aiResult.timings.totalMs),
      },
      fallbackUsed: isFallback,
      queryEcho: localResult.queryEcho || aiResult.queryEcho,
      ...(isFallback && localResult.categoryRecommendations
        ? { categoryRecommendations: localResult.categoryRecommendations }
        : {}),
      providerUsed: hasAiSkills ? aiResult.providerUsed : localResult.providerUsed || 'local',
      llmEnhanced: hasAiSkills,
      privacyNotice: hasAiSkills
        ? aiResult.privacyNotice
        : localResult.privacyNotice || '100% Offline & Private (Zero code leaves your machine)',
    };
  }
}
