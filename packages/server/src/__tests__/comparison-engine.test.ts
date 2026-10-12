import { describe, expect, it } from 'vitest';
import { SkillsRepository } from '../data/skills-repository.js';
import { ComparisonEngine } from '../engine/comparison-engine.js';

describe('ComparisonEngine', () => {
  const repo = new SkillsRepository();
  const engine = new ComparisonEngine({ repository: repo });

  it('generates a 2-skill comparison with conflict detection for direct alternatives', () => {
    const result = engine.compare({ skillIds: ['react', 'vue'] });

    expect(result.columns).toHaveLength(2);
    expect(result.columns[0]?.id).toBe('react');
    expect(result.columns[1]?.id).toBe('vue');
    expect(result.isCrossEcosystem).toBe(false);
    expect(result.categories).toContain('frontend-framework');

    // Conflict detection should catch that React and Vue are direct alternatives
    expect(result.conflictsDetected.length).toBeGreaterThan(0);
    expect(result.conflictsDetected[0]).toContain('direct alternatives');
  });

  it('generates a 3-skill comparison across compatible tools', () => {
    const result = engine.compare({ skillIds: ['react', 'vue', 'svelte'] });

    expect(result.columns).toHaveLength(3);
    expect(result.columns.map((c) => c.name)).toEqual(['React', 'Vue.js', 'Svelte']);
    expect(result.summary).toContain('React vs Vue.js vs Svelte');
  });

  it('detects cross-ecosystem comparison accurately', () => {
    const result = engine.compare({ skillIds: ['express', 'fastapi'] });

    expect(result.columns).toHaveLength(2);
    expect(result.isCrossEcosystem).toBe(true);
    expect(result.summary).toContain('spanning');
  });

  it('marks installed status when workspace packages match', () => {
    const result = engine.compare(
      { skillIds: ['react', 'vue'] },
      ['react']
    );

    expect(result.columns.find((c) => c.id === 'react')?.isInstalledInWorkspace).toBe(true);
    expect(result.columns.find((c) => c.id === 'vue')?.isInstalledInWorkspace).toBe(false);
  });

  it('resolves packages by stack indicator or alias', () => {
    // 'next' is a stack indicator for 'nextjs'
    const result = engine.compare({ skillIds: ['next', 'remix'] });

    expect(result.columns).toHaveLength(2);
    expect(result.columns.some((c) => c.id === 'nextjs')).toBe(true);
    expect(result.columns.some((c) => c.id === 'remix')).toBe(true);
  });

  it('rejects comparisons with fewer than 2 skills', () => {
    expect(() => {
      engine.compare({ skillIds: ['react'] } as any);
    }).toThrow();
  });

  it('rejects comparisons with more than 3 skills', () => {
    expect(() => {
      engine.compare({ skillIds: ['react', 'vue', 'svelte', 'angular'] });
    }).toThrow();
  });

  it('throws descriptive error on hostile or non-existent skill IDs', () => {
    expect(() => {
      engine.compare({ skillIds: ['react', 'unknown-library-xyz-123'] });
    }).toThrow(/skill\(s\) not found: "unknown-library-xyz-123"/i);
  });

  it('rejects duplicate or aliased IDs that resolve to the same single tool', () => {
    expect(() => {
      // react and react-dom both resolve to 'react'
      engine.compare({ skillIds: ['react', 'react-dom'] });
    }).toThrow(/requires at least 2 distinct skills/i);
  });

  it('forwards installedPackages through SkillForgeServer SKILLFORGE_COMPARE_METHOD handler (BUG-16)', async () => {
    const { SkillForgeServer } = await import('../server.js');
    const { SKILLFORGE_COMPARE_METHOD } = await import('@skillforge/shared');

    const handlers = new Map<string, (params?: any) => Promise<any>>();
    const mockConnection = {
      onInitialize: () => {},
      onInitialized: () => {},
      onRequest: (method: string, handler: (params?: any) => Promise<any>) => {
        handlers.set(method, handler);
      },
      console: { log: () => {} },
      listen: () => {},
      dispose: () => {},
    } as any;

    new SkillForgeServer(mockConnection, repo);
    const compareHandler = handlers.get(SKILLFORGE_COMPARE_METHOD);
    expect(compareHandler).toBeDefined();

    const response = await compareHandler!({
      skillIds: ['react', 'vue'],
      installedPackages: ['react'],
    });

    expect(response.matrix.columns.find((c: any) => c.id === 'react')?.isInstalledInWorkspace).toBe(
      true
    );
    expect(response.matrix.columns.find((c: any) => c.id === 'vue')?.isInstalledInWorkspace).toBe(
      false
    );
  });
});
