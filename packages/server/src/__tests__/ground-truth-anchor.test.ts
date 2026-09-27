import { describe, it, expect } from 'vitest';
import type { Skill } from '@skillforge/shared';
import { validateSkill } from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { GroundTruthAnchor } from '../reliability/ground-truth-anchor.js';

/**
 * Minimal valid skill fixture for test repository injection
 */
function makeSkill(overrides: Partial<Skill> & { id: string; name: string }): Skill {
  return {
    category: 'backend-framework',
    difficulty: 'intermediate',
    description: `${overrides.name} is a development tool for building applications.`,
    whyUseIt: `${overrides.name} provides an excellent developer experience.`,
    tags: [overrides.id],
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

describe('GroundTruthAnchor', () => {
  const expressSkill = makeSkill({
    id: 'express',
    name: 'Express',
    alternatives: ['fastify', 'koa'],
    worksWellWith: ['helmet', 'morgan'],
  });
  const reactSkill = makeSkill({
    id: 'react',
    name: 'React',
    category: 'frontend-framework',
    alternatives: ['vue', 'svelte'],
  });

  const repo = new SkillsRepository([expressSkill, reactSkill]);
  const anchor = new GroundTruthAnchor(repo);

  it('anchors by exact ID match and sets verified trust tier', () => {
    const result = anchor.anchor({ name: 'Express', id: 'express' });

    expect(result.isAnchored).toBe(true);
    expect(result.suggestedSkill.trustTier).toBe('verified');
    expect(result.suggestedSkill.id).toBe('express');
    expect(result.suggestedSkill.officialUrl).toBe('https://express.dev');
    expect(result.suggestedSkill.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('anchors by normalized name match (e.g., "Express.js" -> "express-js" fails, but "Express" -> "express" works)', () => {
    const result = anchor.anchor({ name: 'Express' });

    expect(result.isAnchored).toBe(true);
    expect(result.suggestedSkill.trustTier).toBe('verified');
    expect(result.suggestedSkill.id).toBe('express');
  });

  it('anchors by fuzzy search match when name differs from ID', () => {
    const result = anchor.anchor({ name: 'React' });

    expect(result.isAnchored).toBe(true);
    expect(result.suggestedSkill.trustTier).toBe('verified');
    expect(result.suggestedSkill.id).toBe('react');
    expect(result.suggestedSkill.category).toBe('frontend-framework');
  });

  it('returns unanchored result for unknown external skill', () => {
    const result = anchor.anchor({
      name: 'SuperFramework3000',
      reasoning: 'An AI-suggested framework',
      confidence: 0.4,
    });

    expect(result.isAnchored).toBe(false);
    expect(result.suggestedSkill.trustTier).toBe('suggested');
    expect(result.suggestedSkill.name).toBe('SuperFramework3000');
    expect(result.suggestedSkill.confidence).toBe(0.4);
    expect(result.suggestedSkill.reasoning).toBe('An AI-suggested framework');
  });

  it('preserves external reasoning when anchoring a known skill', () => {
    const result = anchor.anchor({
      name: 'Express',
      id: 'express',
      reasoning: 'Perfect for your REST API project with Node.js',
    });

    expect(result.isAnchored).toBe(true);
    expect(result.suggestedSkill.reasoning).toBe(
      'Perfect for your REST API project with Node.js'
    );
  });

  it('sets minimum confidence of 0.8 for anchored skills', () => {
    const result = anchor.anchor({
      name: 'Express',
      id: 'express',
      confidence: 0.3, // artificially low
    });

    expect(result.isAnchored).toBe(true);
    expect(result.suggestedSkill.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('anchorAll processes multiple raw suggestions', () => {
    const results = anchor.anchorAll([
      { name: 'Express', id: 'express' },
      { name: 'UnknownLib' },
      { name: 'React' },
    ]);

    expect(results).toHaveLength(3);
    expect(results[0]!.isAnchored).toBe(true);
    expect(results[1]!.isAnchored).toBe(false);
    expect(results[2]!.isAnchored).toBe(true);
  });

  it('unanchored skills get sensible defaults (id, category, ecosystem)', () => {
    const result = anchor.anchor({ name: 'My New Tool' });

    expect(result.isAnchored).toBe(false);
    expect(result.suggestedSkill.id).toBe('my-new-tool');
    expect(result.suggestedSkill.category).toBe('other');
    expect(result.suggestedSkill.ecosystem).toBe('multi');
    expect(result.suggestedSkill.stackIndicators).toContain('my-new-tool');
  });

  it('unanchored skills generate valid officialUrl complying with SkillSchema (BUG-05)', () => {
    // Omitting officialUrl in raw external suggestion
    const result = anchor.anchor({ name: 'Unanchored External AI Tool' });
    expect(result.isAnchored).toBe(false);
    expect(result.suggestedSkill.officialUrl).toMatch(/^https?:\/\//);

    // Must not throw ZodError when validated against SkillSchema
    expect(() => validateSkill(result.suggestedSkill)).not.toThrow();
  });
});
