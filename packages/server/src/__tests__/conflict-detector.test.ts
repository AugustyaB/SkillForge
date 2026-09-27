import { describe, it, expect } from 'vitest';
import type { SuggestedSkill, TrustTier } from '@skillforge/shared';
import { ConflictDetector } from '../reliability/conflict-detector.js';

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
});
