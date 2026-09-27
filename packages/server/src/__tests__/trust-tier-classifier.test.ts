import { describe, it, expect } from 'vitest';
import type { PackageHealth, SuggestedSkill, TrustTier } from '@skillforge/shared';
import { TrustTierClassifier } from '../reliability/trust-tier-classifier.js';

function makeSuggested(
  overrides: Partial<SuggestedSkill> & { id: string; name: string; trustTier: TrustTier }
): SuggestedSkill {
  return {
    category: 'backend-framework',
    difficulty: 'intermediate',
    description: `${overrides.name} tool.`,
    whyUseIt: `${overrides.name} provides value.`,
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
    confidence: 0.85,
    reasoning: 'Test',
    ...overrides,
  };
}

describe('TrustTierClassifier', () => {
  const classifier = new TrustTierClassifier();

  it('classifies curated skill as verified', () => {
    const tier = classifier.classify(true);
    expect(tier).toBe('verified');
  });

  it('classifies curated skill with healthy health as verified', () => {
    const health: PackageHealth = {
      packageExists: true,
      healthVerdict: 'healthy',
      cachedAt: Date.now(),
    };
    const tier = classifier.classify(true, health);
    expect(tier).toBe('verified');
  });

  it('classifies abandoned package as deprecated (even if curated)', () => {
    const health: PackageHealth = {
      packageExists: true,
      healthVerdict: 'abandoned',
      cachedAt: Date.now(),
    };
    const tier = classifier.classify(true, health);
    expect(tier).toBe('deprecated');
  });

  it('classifies non-curated healthy package as validated', () => {
    const health: PackageHealth = {
      packageExists: true,
      healthVerdict: 'healthy',
      cachedAt: Date.now(),
    };
    const tier = classifier.classify(false, health);
    expect(tier).toBe('validated');
  });

  it('classifies non-curated aging package as validated', () => {
    const health: PackageHealth = {
      packageExists: true,
      healthVerdict: 'aging',
      cachedAt: Date.now(),
    };
    const tier = classifier.classify(false, health);
    expect(tier).toBe('validated');
  });

  it('classifies non-curated risky package as suggested', () => {
    const health: PackageHealth = {
      packageExists: true,
      healthVerdict: 'risky',
      cachedAt: Date.now(),
    };
    const tier = classifier.classify(false, health);
    expect(tier).toBe('suggested');
  });

  it('classifies unknown (no health data) as suggested', () => {
    const tier = classifier.classify(false);
    expect(tier).toBe('suggested');
  });

  describe('filterByMinTier', () => {
    const skills: SuggestedSkill[] = [
      makeSuggested({ id: 'a', name: 'A', trustTier: 'verified' }),
      makeSuggested({ id: 'b', name: 'B', trustTier: 'validated' }),
      makeSuggested({ id: 'c', name: 'C', trustTier: 'suggested' }),
      makeSuggested({ id: 'd', name: 'D', trustTier: 'deprecated' }),
    ];

    it('filters out deprecated when minTier is suggested', () => {
      const filtered = classifier.filterByMinTier(skills, 'suggested');
      expect(filtered).toHaveLength(3);
      expect(filtered.map((s) => s.id)).toEqual(['a', 'b', 'c']);
    });

    it('filters to validated and above', () => {
      const filtered = classifier.filterByMinTier(skills, 'validated');
      expect(filtered).toHaveLength(2);
      expect(filtered.map((s) => s.id)).toEqual(['a', 'b']);
    });

    it('filters to verified only', () => {
      const filtered = classifier.filterByMinTier(skills, 'verified');
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.id).toBe('a');
    });

    it('returns all skills when no minTier specified', () => {
      const filtered = classifier.filterByMinTier(skills);
      expect(filtered).toHaveLength(4);
    });
  });
});
