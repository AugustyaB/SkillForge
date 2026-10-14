import { describe, it, expect } from 'vitest';
import type { Skill, SuggestedSkill, TrustTier } from '@skillforge/shared';
import { ConflictDetector } from '../reliability/conflict-detector.js';
import { SkillsRepository } from '../data/skills-repository.js';

/**
 * Build a minimal SuggestedSkill fixture for conflict detection tests.
 */
function makeSuggested(
  overrides: Partial<SuggestedSkill> & { id: string; name: string }
): SuggestedSkill {
  return {
    category: 'backend-framework',
    difficulty: 'intermediate',
    description: `${overrides.name} is a development tool.`,
    whyUseIt: `${overrides.name} provides great developer experience.`,
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
    trustTier: 'verified' as TrustTier,
    confidence: 0.85,
    reasoning: `Matched: ${overrides.name}`,
    ...overrides,
  };
}

describe('ConflictDetector', () => {
  const detector = new ConflictDetector();

  it('detects installed conflict: Fastify suggested when Express is installed', () => {
    const fastify = makeSuggested({
      id: 'fastify',
      name: 'Fastify',
      alternatives: ['express', 'koa', 'hapi'],
    });

    const results = detector.detectConflicts([fastify], ['express']);

    expect(results).toHaveLength(1);
    expect(results[0]!.conflictWith).toContain('express');
    expect(results[0]!.conflictWarning).toContain("already-installed 'express'");
  });

  it('detects co-suggestion conflict: React and Vue in same result set', () => {
    const react = makeSuggested({
      id: 'react',
      name: 'React',
      category: 'frontend-framework',
      alternatives: ['vue', 'svelte', 'angular'],
    });
    const vue = makeSuggested({
      id: 'vue',
      name: 'Vue',
      category: 'frontend-framework',
      alternatives: ['react', 'svelte', 'angular'],
    });

    const results = detector.detectConflicts([react, vue], []);

    // React should note that Vue is an alternative in the list
    const reactResult = results.find((r) => r.id === 'react')!;
    expect(reactResult.conflictWith).toContain('vue');
    expect(reactResult.conflictWarning).toContain("Alternative to 'vue'");
    expect(reactResult.conflictWarning).toContain('pick one, not both');

    // Vue should note that React is an alternative in the list
    const vueResult = results.find((r) => r.id === 'vue')!;
    expect(vueResult.conflictWith).toContain('react');
    expect(vueResult.conflictWarning).toContain("Alternative to 'react'");
  });

  it('detects both installed and co-suggestion conflicts simultaneously', () => {
    const fastify = makeSuggested({
      id: 'fastify',
      name: 'Fastify',
      alternatives: ['express', 'koa'],
    });
    const koa = makeSuggested({
      id: 'koa',
      name: 'Koa',
      alternatives: ['express', 'fastify'],
    });

    const results = detector.detectConflicts([fastify, koa], ['express']);

    // Fastify: installed conflict with express + co-suggestion with koa
    const fastifyResult = results.find((r) => r.id === 'fastify')!;
    expect(fastifyResult.conflictWith).toContain('express');
    expect(fastifyResult.conflictWith).toContain('koa');
    expect(fastifyResult.conflictWarning).toContain("already-installed 'express'");
    expect(fastifyResult.conflictWarning).toContain("Alternative to 'koa'");

    // Koa: installed conflict with express + co-suggestion with fastify
    const koaResult = results.find((r) => r.id === 'koa')!;
    expect(koaResult.conflictWith).toContain('express');
    expect(koaResult.conflictWith).toContain('fastify');
  });

  it('does not flag non-conflicting tools', () => {
    const react = makeSuggested({
      id: 'react',
      name: 'React',
      category: 'frontend-framework',
      alternatives: ['vue', 'svelte'],
    });
    const postgresql = makeSuggested({
      id: 'postgresql',
      name: 'PostgreSQL',
      category: 'database',
      alternatives: ['mysql', 'sqlite'],
    });

    const results = detector.detectConflicts([react, postgresql], []);

    // Neither should have conflicts with each other
    expect(results[0]!.conflictWith).toBeUndefined();
    expect(results[0]!.conflictWarning).toBeUndefined();
    expect(results[1]!.conflictWith).toBeUndefined();
    expect(results[1]!.conflictWarning).toBeUndefined();
  });

  it('handles case-insensitive matching for installed packages', () => {
    const fastify = makeSuggested({
      id: 'fastify',
      name: 'Fastify',
      alternatives: ['express'],
    });

    const results = detector.detectConflicts([fastify], ['Express']); // uppercase

    expect(results[0]!.conflictWith).toContain('express');
  });

  it('returns skills unchanged when there are no conflicts', () => {
    const helmet = makeSuggested({
      id: 'helmet',
      name: 'Helmet',
      category: 'security',
      alternatives: [],
    });

    const results = detector.detectConflicts([helmet], ['express']);

    expect(results).toHaveLength(1);
    expect(results[0]!.conflictWith).toBeUndefined();
    expect(results[0]!.conflictWarning).toBeUndefined();
    expect(results[0]!.id).toBe('helmet');
  });

  it('handles empty skills array gracefully', () => {
    const results = detector.detectConflicts([], ['express']);
    expect(results).toEqual([]);
  });

  it('handles empty installed array gracefully', () => {
    const react = makeSuggested({
      id: 'react',
      name: 'React',
      alternatives: ['vue'],
    });

    const results = detector.detectConflicts([react], []);
    expect(results[0]!.conflictWith).toBeUndefined();
  });

  it('detects installed conflict when raw package name differs from skill ID (BUG-02)', () => {
    // Angular package name is "@angular/core", while skill ID is "angular"
    const angularSkill: Skill = {
      id: 'angular',
      name: 'Angular',
      category: 'frontend-framework',
      difficulty: 'intermediate',
      description: 'Component-based framework.',
      whyUseIt: 'Enterprise-grade full-featured framework.',
      tags: ['angular', 'frontend'],
      ecosystem: 'javascript',
      officialUrl: 'https://angular.dev',
      learnResources: [{ label: 'Docs', url: 'https://angular.dev', type: 'docs' }],
      alternatives: ['react', 'vue'],
      worksWellWith: ['rxjs'],
      prerequisites: ['typescript'],
      stackIndicators: ['@angular/core', 'angular'],
    };

    const reactSkill: Skill = {
      id: 'react',
      name: 'React',
      category: 'frontend-framework',
      difficulty: 'intermediate',
      description: 'UI library.',
      whyUseIt: 'Virtual DOM, component ecosystem.',
      tags: ['react', 'frontend'],
      ecosystem: 'javascript',
      officialUrl: 'https://react.dev',
      learnResources: [{ label: 'Docs', url: 'https://react.dev', type: 'docs' }],
      alternatives: ['angular', 'vue'],
      worksWellWith: ['nextjs'],
      prerequisites: ['javascript'],
      stackIndicators: ['react', 'react-dom'],
    };

    const repo = new SkillsRepository([angularSkill, reactSkill]);
    const repoDetector = new ConflictDetector(repo);

    const reactSuggested = makeSuggested({
      id: 'react',
      name: 'React',
      alternatives: ['angular', 'vue'],
    });

    const results = repoDetector.detectConflicts([reactSuggested], ['@angular/core']);
    expect(results).toHaveLength(1);
    expect(results[0]!.conflictWith).toContain('angular');
    expect(results[0]!.conflictWarning).toContain("already-installed 'angular'");
  });

  describe('Clean Foundation / Utility Fitness Rubric (UFR) — Zero False Conflicts on Companions', () => {
    const fullRepo = new SkillsRepository();
    const liveDetector = new ConflictDetector(fullRepo);

    it('does not flag conflict between browser-use and installed playwright', () => {
      const browserUse = fullRepo.getSkillById('browser-use');
      expect(browserUse).toBeDefined();

      const suggested = makeSuggested({
        id: browserUse!.id,
        name: browserUse!.name,
        alternatives: browserUse!.alternatives,
        worksWellWith: browserUse!.worksWellWith,
      });

      const results = liveDetector.detectConflicts([suggested], ['playwright']);
      expect(results[0]!.conflictWith).toBeUndefined();
      expect(results[0]!.conflictWarning).toBeUndefined();
    });

    it('does not flag conflict between outlines-ai and installed pydantic', () => {
      const outlines = fullRepo.getSkillById('outlines-ai');
      expect(outlines).toBeDefined();

      const suggested = makeSuggested({
        id: outlines!.id,
        name: outlines!.name,
        alternatives: outlines!.alternatives,
        worksWellWith: outlines!.worksWellWith,
      });

      const results = liveDetector.detectConflicts([suggested], ['pydantic']);
      expect(results[0]!.conflictWith).toBeUndefined();
      expect(results[0]!.conflictWarning).toBeUndefined();
    });

    it('does not flag conflict between mcp-sdk and installed langchain', () => {
      const mcp = fullRepo.getSkillById('mcp-sdk');
      expect(mcp).toBeDefined();

      const suggested = makeSuggested({
        id: mcp!.id,
        name: mcp!.name,
        alternatives: mcp!.alternatives,
        worksWellWith: mcp!.worksWellWith,
      });

      const results = liveDetector.detectConflicts([suggested], ['langchain']);
      expect(results[0]!.conflictWith).toBeUndefined();
      expect(results[0]!.conflictWarning).toBeUndefined();
    });

    it('does not flag conflict between husky and installed lint-staged', () => {
      const husky = fullRepo.getSkillById('husky');
      expect(husky).toBeDefined();

      const suggested = makeSuggested({
        id: husky!.id,
        name: husky!.name,
        alternatives: husky!.alternatives,
        worksWellWith: husky!.worksWellWith,
      });

      const results = liveDetector.detectConflicts([suggested], ['lint-staged']);
      expect(results[0]!.conflictWith).toBeUndefined();
      expect(results[0]!.conflictWarning).toBeUndefined();
    });

    it('correctly flags genuine rival conflict: browser-use vs open-interpreter', () => {
      const browserUse = fullRepo.getSkillById('browser-use');
      expect(browserUse).toBeDefined();

      const suggested = makeSuggested({
        id: browserUse!.id,
        name: browserUse!.name,
        alternatives: browserUse!.alternatives,
        worksWellWith: browserUse!.worksWellWith,
      });

      const results = liveDetector.detectConflicts([suggested], ['open-interpreter']);
      expect(results[0]!.conflictWith).toContain('open-interpreter');
      expect(results[0]!.conflictWarning).toContain("already-installed 'open-interpreter'");
    });
  });
});

