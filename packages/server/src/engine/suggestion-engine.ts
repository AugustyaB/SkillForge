import type {
  SkillSuggestionParams,
  SkillSuggestionResult,
  SuggestedSkill,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { IntentParser } from './intent-parser.js';
import { QueryCache } from './query-cache.js';
import { ConflictDetector } from '../reliability/conflict-detector.js';
import { TrustTierClassifier } from '../reliability/trust-tier-classifier.js';
import { FallbackCascade } from '../reliability/fallback-cascade.js';

export interface SuggestionEngineOptions {
  repository?: SkillsRepository;
  intentParser?: IntentParser;
  cache?: QueryCache;
  conflictDetector?: ConflictDetector;
  trustTierClassifier?: TrustTierClassifier;
  fallbackCascade?: FallbackCascade;
}

export class SuggestionEngine {
  private repository: SkillsRepository;
  private intentParser: IntentParser;
  private cache: QueryCache;
  private conflictDetector: ConflictDetector;
  private trustTierClassifier: TrustTierClassifier;
  private fallbackCascade: FallbackCascade;

  constructor(options?: SuggestionEngineOptions) {
    this.repository = options?.repository ?? new SkillsRepository();
    this.intentParser = options?.intentParser ?? new IntentParser();
    this.cache = options?.cache ?? new QueryCache();
    this.conflictDetector =
      options?.conflictDetector ?? new ConflictDetector(this.repository);
    this.trustTierClassifier =
      options?.trustTierClassifier ?? new TrustTierClassifier();
    this.fallbackCascade =
      options?.fallbackCascade ?? new FallbackCascade(this.repository);
  }

  public getRepository(): SkillsRepository {
    return this.repository;
  }

  public getCache(): QueryCache {
    return this.cache;
  }

  public async suggest(params?: SkillSuggestionParams): Promise<SkillSuggestionResult> {
    const startTime = Date.now();
    const intent = typeof params?.intent === 'string' ? params.intent.trim() : '';

    if (!intent) {
      const elapsed = Date.now() - startTime;
      return {
        skills: [],
        timings: { localMs: elapsed, totalMs: elapsed },
        queryEcho: '',
      };
    }

    const context = params?.context;
    const options = params?.options;
    const alreadyInstalled = new Set(
      (context?.alreadyInstalled || [])
        .filter((pkg): pkg is string => typeof pkg === 'string' && pkg.trim().length > 0)
        .map((pkg) => pkg.toLowerCase().trim())
    );

    const safeSignals = (context?.activeFileSignals || [])
      .map((s) => s?.language)
      .filter((lang): lang is string => typeof lang === 'string' && lang.trim().length > 0)
      .map((lang) => lang.toLowerCase().trim());

    // Dynamically load workspace private skills if workspace paths are present in context
    if (context?.scope?.paths && context.scope.paths.length > 0) {
      this.repository.loadWorkspaceSkills(context.scope.paths);
    }

    // Defensive clamping on maxResults: strictly between 1 and 50 (prevents negative buffer floods)
    const maxResults = Math.max(1, Math.min(50, Math.floor(Number(options?.maxResults) || 5)));

    // 1. Check Query Cache (BUG-04: hash complete request context and options)
    const cacheKey = this.cache.generateKey({
      intent,
      scopePaths: context?.scope?.paths || [],
      installed: Array.from(alreadyInstalled),
      difficulty: options?.difficulty || 'all',
      ecosystem: context?.ecosystem || '',
      activeSignals: safeSignals,
      maxResults,
      minTrustTier: options?.minTrustTier,
    });

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        timings: {
          localMs: 0,
          totalMs: 0,
        },
      };
    }

    // 2. Parse natural language intent
    const parsedIntent = this.intentParser.parse(intent);

    // Determine target ecosystem (explicit query intent takes precedence over ambient workspace context - BUG-03)
    const targetEcosystem =
      parsedIntent.explicitEcosystem ??
      (context?.ecosystem && context.ecosystem !== 'multi'
        ? context.ecosystem
        : undefined);

    // 3. Search candidates from repository (explicit options.difficulty acts as hard filter; inferred intent difficulty acts as soft boost below)
    const candidates = this.repository.search(intent, {
      difficulty: options?.difficulty ?? 'all',
      ecosystem: targetEcosystem,
      maxResults: Math.max(30, maxResults * 5), // retrieve broader pool to re-score with context
    });

    let results: SuggestedSkill[];
    let fallbackUsed = false;

    if (candidates.length > 0) {
      // Map installed packages to canonical skill IDs using stack indicators (BUG-02)
      const installedSkillIds = new Set<string>();
      for (const pkg of alreadyInstalled) {
        installedSkillIds.add(pkg.toLowerCase().trim());
        const matched = this.repository.getSkillByIndicator(pkg);
        if (matched) {
          installedSkillIds.add(matched.id.toLowerCase());
        }
      }

      // 4. Apply Context-Aware Relevance Adjustments
      const adjusted = candidates.map(({ skill, score, matchReasons }) => {
        let finalScore = score;
        const reasons = [...matchReasons];
        let isInstalled = false;

        // A. Already-Installed Detection
        const isIndicatorInstalled = skill.stackIndicators.some((ind) =>
          installedSkillIds.has(ind.toLowerCase())
        );
        const isIdInstalled = installedSkillIds.has(skill.id.toLowerCase());

        if (isIndicatorInstalled || isIdInstalled) {
          isInstalled = true;
          reasons.unshift('Already installed in your project workspace');
        }

        // B. Compatibility Boost (+30 pts)
        const compatibleTools = skill.worksWellWith.filter((compat) => {
          const lowerCompat = compat.toLowerCase();
          if (installedSkillIds.has(lowerCompat)) return true;
          const compatSkill = this.repository.getSkillById(compat);
          return compatSkill?.stackIndicators.some((ind) =>
            installedSkillIds.has(ind.toLowerCase())
          );
        });
        if (compatibleTools.length > 0) {
          finalScore += 30;
          reasons.push(`Integrates seamlessly with your project's ${compatibleTools.join(', ')}`);
        }

        // C. Active File Signal Boost (+15 pts)
        if (safeSignals.length > 0) {
          if (skill.ecosystem !== 'multi' && safeSignals.includes(skill.ecosystem.toLowerCase())) {
            finalScore += 15;
            reasons.push(`Matches active editor file ecosystem (${skill.ecosystem})`);
          }
        }

        // D. Category Intent Alignment Boost (+35 pts)
        if (
          parsedIntent.detectedCategories.length > 0 &&
          parsedIntent.detectedCategories.includes(skill.category)
        ) {
          finalScore += 35;
          reasons.push(`Directly satisfies detected category intent (${skill.category})`);
        }

        // E. Inferred Difficulty Alignment Boost (+10 pts)
        if (
          parsedIntent.difficultyPreference &&
          skill.difficulty === parsedIntent.difficultyPreference
        ) {
          finalScore += 10;
          reasons.push(`Matches preferred difficulty tier (${skill.difficulty})`);
        }

        const confidence = Math.min(
          0.99,
          Number((0.6 + Math.min(finalScore, 40) / 100).toFixed(2))
        );

        // 5. Trust Tier Classification — all curated DB skills are 'verified'
        const isCurated = this.repository.getSkillById(skill.id) !== undefined;
        const trustTier = this.trustTierClassifier.classify(isCurated);

        return {
          skill,
          score: finalScore,
          suggestedSkill: {
            ...skill,
            trustTier,
            confidence,
            reasoning: reasons.length > 0 ? reasons.join('. ') : skill.whyUseIt,
            isInstalledInWorkspace: isInstalled,
          },
        };
      });

      // Sort by adjusted score
      adjusted.sort((a, b) => b.score - a.score);
      results = adjusted.slice(0, maxResults).map((a) => a.suggestedSkill);

      // 6. Conflict Detection — annotate mutually exclusive alternatives
      results = this.conflictDetector.detectConflicts(
        results,
        Array.from(installedSkillIds)
      );

      // 7. Filter by minimum trust tier if specified
      if (options?.minTrustTier) {
        results = this.trustTierClassifier.filterByMinTier(
          results,
          options.minTrustTier
        );
      }
    } else {
      // 8. Fallback Cascade — guaranteed non-empty response
      fallbackUsed = true;
      const fallbackResult = this.fallbackCascade.executeFallback(intent, context);
      const elapsed = Date.now() - startTime;
      const finalResult: SkillSuggestionResult = {
        ...fallbackResult,
        timings: {
          localMs: elapsed,
          totalMs: elapsed,
        },
      };
      this.cache.set(cacheKey, finalResult);
      return finalResult;
    }

    const elapsed = Date.now() - startTime;
    const finalResult: SkillSuggestionResult = {
      skills: results,
      timings: {
        localMs: elapsed,
        totalMs: elapsed,
      },
      fallbackUsed,
      queryEcho: intent,
    };

    // Store in cache
    this.cache.set(cacheKey, finalResult);

    return finalResult;
  }
}
