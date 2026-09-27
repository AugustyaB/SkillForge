import type {
  Skill,
  SkillSuggestionParams,
  SkillSuggestionResult,
  SuggestedSkill,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { IntentParser } from './intent-parser.js';
import { QueryCache } from './query-cache.js';

export interface SuggestionEngineOptions {
  repository?: SkillsRepository;
  intentParser?: IntentParser;
  cache?: QueryCache;
}

export class SuggestionEngine {
  private repository: SkillsRepository;
  private intentParser: IntentParser;
  private cache: QueryCache;

  constructor(options?: SuggestionEngineOptions) {
    this.repository = options?.repository ?? new SkillsRepository();
    this.intentParser = options?.intentParser ?? new IntentParser();
    this.cache = options?.cache ?? new QueryCache();
  }

  public getRepository(): SkillsRepository {
    return this.repository;
  }

  public getCache(): QueryCache {
    return this.cache;
  }

  public async suggest(params: SkillSuggestionParams): Promise<SkillSuggestionResult> {
    const startTime = Date.now();
    const intent = params.intent ? params.intent.trim() : '';

    if (!intent) {
      const elapsed = Date.now() - startTime;
      return {
        skills: [],
        timings: { localMs: elapsed, totalMs: elapsed },
        queryEcho: '',
      };
    }

    const context = params.context;
    const options = params.options;
    const alreadyInstalled = new Set(
      (context?.alreadyInstalled || []).map((pkg) => pkg.toLowerCase().trim())
    );

    // 1. Check Query Cache
    const cacheKey = this.cache.generateKey(
      intent,
      context?.scope?.paths || [],
      Array.from(alreadyInstalled),
      options?.difficulty || 'all'
    );

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

    // Determine target ecosystem (workspace context takes precedence if single ecosystem, else explicit query)
    const targetEcosystem =
      context?.ecosystem && context.ecosystem !== 'multi'
        ? context.ecosystem
        : parsedIntent.explicitEcosystem;

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
      // 4. Apply Context-Aware Relevance Adjustments
      const adjusted = candidates.map(({ skill, score, matchReasons }) => {
        let finalScore = score;
        const reasons = [...matchReasons];
        let isInstalled = false;

        // A. Already-Installed Detection
        const isIndicatorInstalled = skill.stackIndicators.some((ind) =>
          alreadyInstalled.has(ind.toLowerCase())
        );
        const isIdInstalled = alreadyInstalled.has(skill.id.toLowerCase());

        if (isIndicatorInstalled || isIdInstalled) {
          isInstalled = true;
          reasons.unshift('Already installed in your project workspace');
        }

        // B. Compatibility Boost (+30 pts)
        const compatibleTools = skill.worksWellWith.filter((compat) =>
          alreadyInstalled.has(compat.toLowerCase())
        );
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

        return {
          skill,
          score: finalScore,
          suggestedSkill: {
            ...skill,
            trustTier: 'verified' as const,
            confidence,
            reasoning: reasons.length > 0 ? reasons.join('. ') : skill.whyUseIt,
            isInstalledInWorkspace: isInstalled,
          },
        };
      });

      // Sort by adjusted score
      adjusted.sort((a, b) => b.score - a.score);
      results = adjusted.slice(0, maxResults).map((a) => a.suggestedSkill);
    } else {
      // 5. Fallback recommendations
      fallbackUsed = true;
      const fallbackIds = ['react', 'express', 'postgresql'];
      results = fallbackIds
        .map((id) => this.repository.getSkillById(id))
        .filter((s): s is Skill => Boolean(s))
        .map((skill) => ({
          ...skill,
          trustTier: 'verified' as const,
          confidence: 0.65,
          reasoning: 'Baseline recommendation matching general application development.',
          isInstalledInWorkspace: alreadyInstalled.has(skill.id),
        }));
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
