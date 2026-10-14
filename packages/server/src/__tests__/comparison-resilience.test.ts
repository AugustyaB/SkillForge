import { describe, expect, it } from 'vitest';
import { SkillsRepository } from '../data/skills-repository.js';
import { ComparisonEngine } from '../engine/comparison-engine.js';

describe('ComparisonEngine Resilience & Uncataloged Alternatives Fallback', () => {
  const repo = new SkillsRepository();
  const engine = new ComparisonEngine({ repository: repo });

  describe('Uncataloged Alternatives Synthesis', () => {
    it('synthesizes resilient comparison column for declared alternatives (Pinia vs Vuex)', () => {
      // 'vuex' is in pinia.alternatives, but not in the core catalog
      const matrix = engine.compare({ skillIds: ['pinia', 'vuex'] });

      expect(matrix.columns).toHaveLength(2);
      const piniaCol = matrix.columns.find((c) => c.id === 'pinia');
      const vuexCol = matrix.columns.find((c) => c.id === 'vuex');

      expect(piniaCol).toBeDefined();
      expect(piniaCol?.trustTier).toBe('verified');

      expect(vuexCol).toBeDefined();
      expect(vuexCol?.name).toBe('Vuex');
      expect(vuexCol?.trustTier).toBe('suggested');
      expect(vuexCol?.ecosystem).toBe(piniaCol?.ecosystem);
      expect(vuexCol?.category).toBe('state-management');
      expect(vuexCol?.caveats).toContain('Third-party alternative');
      expect(vuexCol?.officialUrl).toContain('npmjs.com/package/vuex');

      // Conflict detector must detect that Pinia and Vuex are direct alternatives
      expect(matrix.conflictsDetected.length).toBeGreaterThan(0);
      expect(matrix.conflictsDetected[0]).toContain('"Pinia" and "Vuex" are direct alternatives in state-management');
      expect(matrix.summary).toContain('Pinia vs Vuex');
    });

    it('synthesizes multiple uncataloged alternatives (Zod vs Yup vs Joi)', () => {
      // 'yup' and 'joi' are both in zod.alternatives
      const matrix = engine.compare({ skillIds: ['zod', 'yup', 'joi'] });

      expect(matrix.columns).toHaveLength(3);
      expect(matrix.columns.map((c) => c.id)).toEqual(['zod', 'yup', 'joi']);
      expect(matrix.columns[1]?.trustTier).toBe('suggested');
      expect(matrix.columns[2]?.trustTier).toBe('suggested');
    });

    it('synthesizes uncataloged companion tools from worksWellWith', () => {
      // Test with a catalog skill that has uncataloged tools in worksWellWith
      const catalogSkills = repo.getAllSkills();
      const parent = catalogSkills.find((s) => s.worksWellWith && s.worksWellWith.length > 0);
      expect(parent).toBeDefined();

      if (parent && parent.worksWellWith.length > 0) {
        const companionId = parent.worksWellWith[0]!;
        const matrix = engine.compare({ skillIds: [parent.id, companionId] });
        expect(matrix.columns).toHaveLength(2);
      }
    });

    it('detects workspace installation on uncataloged synthesized alternatives', () => {
      const matrix = engine.compare(
        { skillIds: ['pinia', 'vuex'] },
        ['vuex']
      );

      const vuexCol = matrix.columns.find((c) => c.id === 'vuex');
      expect(vuexCol?.isInstalledInWorkspace).toBe(true);
    });
  });

  describe('Hostile & Dirty Input Handling (Anti-Happy-Path)', () => {
    it('throws descriptive error on completely unknown libraries not in alternatives', () => {
      expect(() => {
        engine.compare({ skillIds: ['react', 'totally-bogus-library-999'] });
      }).toThrow(/skill\(s\) not found: "totally-bogus-library-999"/i);
    });

    it('throws descriptive error when neither library exists in catalog or relations', () => {
      expect(() => {
        engine.compare({ skillIds: ['unknown_1', 'unknown_2'] });
      }).toThrow(/skill\(s\) not found: "unknown_1", "unknown_2"/i);
    });

    it('rejects comparisons with duplicate identical inputs', () => {
      expect(() => {
        engine.compare({ skillIds: ['pinia', 'pinia'] });
      }).toThrow(/requires at least 2 distinct skills/i);
    });

    it('handles whitespace-padded IDs cleanly', () => {
      const matrix = engine.compare({ skillIds: ['  pinia  ', '  vuex  '] });
      expect(matrix.columns).toHaveLength(2);
      expect(matrix.columns[0]?.id).toBe('pinia');
      expect(matrix.columns[1]?.id).toBe('vuex');
    });

    it('handles case-insensitive input matching', () => {
      const matrix = engine.compare({ skillIds: ['PINIA', 'VUEX'] });
      expect(matrix.columns).toHaveLength(2);
    });
  });
});
