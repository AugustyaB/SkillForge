import type {
  Skill,
  SuggestedSkill,
  SkillSuggestionResult,
  CategoryRecommendation,
  TrustTier,
  WorkspaceContext,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';

/**
 * Core category definitions for the fallback category browser.
 * Each entry maps a canonical category to a human-friendly label,
 * a description, and the curated skill IDs to recommend.
 */
const CATEGORY_BROWSER: CategoryRecommendation[] = [
  {
    category: 'frontend-framework',
    label: 'Frontend Frameworks',
    description: 'Build interactive user interfaces for the web.',
    skillIds: ['react', 'vue', 'svelte', 'angular', 'nextjs'],
  },
  {
    category: 'backend-framework',
    label: 'Backend Frameworks',
    description: 'Build APIs, servers, and business logic.',
    skillIds: ['express', 'fastify', 'nestjs', 'django', 'flask'],
  },
  {
    category: 'database',
    label: 'Databases',
    description: 'Store, query, and manage your application data.',
    skillIds: ['postgresql', 'mongodb', 'sqlite', 'redis', 'mysql'],
  },
  {
    category: 'testing',
    label: 'Testing Tools',
    description: 'Validate, test, and ensure code quality.',
    skillIds: ['vitest', 'jest', 'playwright', 'cypress', 'pytest'],
  },
];

/**
 * FallbackCascade — Provides intelligent multi-level fallback for queries
 * that return zero or too few results from the primary suggestion engine.
 *
 * Cascade levels:
 *  1. Broader tag/category search in the repository
 *  2. Category browser with curated starter recommendations
 *
 * Guarantees the user NEVER sees an empty result set.
 */
export class FallbackCascade {
  private repository: SkillsRepository;

  constructor(repository: SkillsRepository) {
    this.repository = repository;
  }

  /**
   * Get the structured category browser recommendations.
   * Each category returns only skill IDs that actually exist in the repository.
   */
  public getCategoryBrowserRecommendations(): CategoryRecommendation[] {
    return CATEGORY_BROWSER.map((cat) => ({
      ...cat,
      // Filter to only skill IDs that exist in the repository
      skillIds: cat.skillIds.filter(
        (id) => this.repository.getSkillById(id) !== undefined
      ),
    })).filter((cat) => cat.skillIds.length > 0);
  }

  /**
   * Execute the full fallback cascade for a query that produced zero results.
   * Returns a SkillSuggestionResult with baseline starter skills and
   * category browser recommendations.
   */
  public executeFallback(
    intent: string,
    _context?: Partial<WorkspaceContext>
  ): SkillSuggestionResult {
    const startTime = Date.now();

    // Level 1: Try broader search with fewer constraints
    const broaderResults = this.repository.search(intent, {
      maxResults: 5,
    });

    if (broaderResults.length > 0) {
      const elapsed = Date.now() - startTime;
      return {
        skills: broaderResults.map(({ skill }) => ({
          ...skill,
          trustTier: 'verified' as TrustTier,
          confidence: 0.6,
          reasoning: 'Matched via broader search (relaxed filters).',
        })),
        timings: { localMs: elapsed, totalMs: elapsed },
        fallbackUsed: true,
        queryEcho: intent,
        categoryRecommendations: this.getCategoryBrowserRecommendations(),
      };
    }

    // Level 2: Category browser — return curated starter skills
    const starterSkills = this.getStarterSkills();
    const categoryRecs = this.getCategoryBrowserRecommendations();
    const elapsed = Date.now() - startTime;

    return {
      skills: starterSkills,
      timings: { localMs: elapsed, totalMs: elapsed },
      fallbackUsed: true,
      queryEcho: intent,
      categoryRecommendations: categoryRecs,
    };
  }

  /**
   * Build a list of foundational starter skills from the curated database.
   * These are always-safe recommendations for users with unclear intents.
   */
  private getStarterSkills(): SuggestedSkill[] {
    const starterIds = ['react', 'express', 'postgresql', 'vitest'];
    return starterIds
      .map((id) => this.repository.getSkillById(id))
      .filter((s): s is Skill => Boolean(s))
      .map((skill) => ({
        ...skill,
        trustTier: 'verified' as TrustTier,
        confidence: 0.55,
        reasoning: 'Foundational recommendation — explore categories for more specific tools.',
      }));
  }
}
