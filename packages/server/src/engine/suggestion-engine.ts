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
      (context?.alreadyInstalled || []).map((pkg) => pkg.toLowerCase().trim())
    );

    // 1. Check Query Cache (BUG-04: hash complete request context and options)
    const cacheKey = this.cache.generateKey({
      intent,
      scopePaths: context?.scope?.paths || [],
      installed: Array.from(alreadyInstalled),
      difficulty: options?.difficulty || 'all',
      ecosystem: context?.ecosystem || '',
      activeSignals: context?.activeFileSignals?.map((s) => s.language) || [],
      maxResults: options?.maxResults ?? 5,
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

    // 3. Search candidates from repository
    const maxResults = options?.maxResults ?? 5;
    const candidates = this.repository.search(intent, {
      difficulty: options?.difficulty ?? parsedIntent.difficultyPreference,
      ecosystem: targetEcosystem,
      maxResults: maxResults * 3, // retrieve broader pool to re-score with context
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
        if (context?.activeFileSignals && context.activeFileSignals.length > 0) {
          const activeLangs = context.activeFileSignals.map((s) => s.language.toLowerCase());
          if (skill.ecosystem !== 'multi' && activeLangs.includes(skill.ecosystem)) {
            finalScore += 15;
            reasons.push(`Matches active editor file ecosystem (${skill.ecosystem})`);
          }
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
