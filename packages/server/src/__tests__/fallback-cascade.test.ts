import { describe, it, expect } from 'vitest';
import type { Skill } from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { FallbackCascade } from '../reliability/fallback-cascade.js';

/**
 * Minimal skill fixture factory for fallback cascade tests
 */
function makeSkill(overrides: Partial<Skill> & { id: string; name: string }): Skill {
  return {
    category: 'backend-framework',
    difficulty: 'intermediate',
    description: `${overrides.name} is a development tool for building apps.`,
    whyUseIt: `${overrides.name} provides an excellent developer experience.`,
    tags: [overrides.id, 'tool'],
    ecosystem: 'javascript',
    officialUrl: `https://${overrides.id}.dev`,
    learnResources: [
      { label: 'Docs', url: `https://${overrides.id}.dev/docs`, type: 'docs' as const },
    ],
    alternatives: [],
    worksWellWith: [],
    prerequisites: [],
    stackIndicators: [overrides.id],
    ...overrides,
  };
}

describe('FallbackCascade', () => {
  const skills = [
    makeSkill({ id: 'react', name: 'React', category: 'frontend-framework' }),
    makeSkill({ id: 'vue', name: 'Vue', category: 'frontend-framework' }),
    makeSkill({ id: 'express', name: 'Express' }),
    makeSkill({ id: 'fastify', name: 'Fastify' }),
    makeSkill({ id: 'postgresql', name: 'PostgreSQL', category: 'database' }),
    makeSkill({ id: 'vitest', name: 'Vitest', category: 'testing' }),
  ];

  const repo = new SkillsRepository(skills);
  const cascade = new FallbackCascade(repo);

  it('getCategoryBrowserRecommendations returns structured categories', () => {
    const recommendations = cascade.getCategoryBrowserRecommendations();

    expect(recommendations.length).toBeGreaterThan(0);

    // Should have frontend, backend, database, testing categories
    const categories = recommendations.map((r) => r.category);
    expect(categories).toContain('frontend-framework');
    expect(categories).toContain('backend-framework');
    expect(categories).toContain('database');
    expect(categories).toContain('testing');
  });

  it('category browser only includes skill IDs that exist in repository', () => {
    const recommendations = cascade.getCategoryBrowserRecommendations();

    for (const rec of recommendations) {
      for (const skillId of rec.skillIds) {
        expect(repo.getSkillById(skillId)).toBeDefined();
      }
    }
  });

  it('executeFallback returns non-empty result with fallbackUsed flag', () => {
    const result = cascade.executeFallback('xyzzy gibberish query');

    expect(result.fallbackUsed).toBe(true);
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.queryEcho).toBe('xyzzy gibberish query');
  });

  it('executeFallback includes category browser recommendations', () => {
    const result = cascade.executeFallback('something obscure');

    expect(result.categoryRecommendations).toBeDefined();
    expect(result.categoryRecommendations!.length).toBeGreaterThan(0);
  });

  it('all fallback skills have verified trust tier', () => {
    const result = cascade.executeFallback('unknown topic');

    for (const skill of result.skills) {
      expect(skill.trustTier).toBe('verified');
    }
  });

  it('executeFallback uses broader search before category browser', () => {
    // "react" exists in our repo — broader search should find it
    const result = cascade.executeFallback('react');

    expect(result.fallbackUsed).toBe(true);
    expect(result.skills.length).toBeGreaterThan(0);
    // Should have found React via broader search
    const skillIds = result.skills.map((s) => s.id);
    expect(skillIds).toContain('react');
  });
});
