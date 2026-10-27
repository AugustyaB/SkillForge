import { describe, expect, it } from 'vitest';
import { safeValidateSkill } from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { AgentSkillGenerator } from '../engine/agent-skill-generator.js';
import { ComparisonEngine } from '../engine/comparison-engine.js';

describe('Phase 1: Schema & Semantic Metadata Depth', () => {
  const repository = new SkillsRepository();
  const generator = new AgentSkillGenerator(repository);
  const comparisonEngine = new ComparisonEngine({ repository });

  describe('License Schema & Backfill', () => {
    it('defaults license to MIT when omitted in legacy records', () => {
      const legacySkill = {
        id: 'legacy-tool',
        name: 'Legacy Tool',
        category: 'utility',
        difficulty: 'beginner',
        description: 'A legacy tool without explicit license field.',
        whyUseIt: 'Essential for testing backward compatibility.',
        tags: ['legacy', 'tool'],
        ecosystem: 'javascript',
        officialUrl: 'https://example.com',
        learnResources: [{ label: 'Docs', url: 'https://example.com/docs' }],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: ['legacy-tool'],
      };

      const result = safeValidateSkill(legacySkill);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.license).toBe('MIT');
      }
    });

    it('verifies all catalog skills have non-empty license attributes', () => {
      const allSkills = repository.getAllSkills();
      expect(allSkills.length).toBeGreaterThanOrEqual(378);

      for (const skill of allSkills) {
        expect(skill.license, `Skill "${skill.id}" missing license`).toBeDefined();
        expect(typeof skill.license).toBe('string');
        expect(skill.license!.length).toBeGreaterThan(0);
      }

      // Check specific known licenses
      const docker = repository.getSkillById('docker');
      expect(docker?.license).toBe('Apache-2.0');

      const k8s = repository.getSkillById('kubernetes');
      expect(k8s?.license).toBe('Apache-2.0');

      const gin = repository.getSkillById('gin');
      expect(gin?.license).toBe('BSD-3-Clause');

      const auth0 = repository.getSkillById('auth0');
      expect(auth0?.license).toBe('Proprietary');
    });

    it('surfaces license in generated agent skill frontmatter and overview section', () => {
      const res = generator.generate({ skillId: 'prisma', format: 'agent-skill' });
      expect(res.frontmatter.license).toBe('MIT');
      expect(res.markdownContent).toContain('- **License**: `MIT`');
    });

    it('surfaces license in comparison matrix pros', () => {
      const matrix = comparisonEngine.compare({ skillIds: ['zustand', 'redux-toolkit'] });
      const zustandCol = matrix.columns.find((c) => c.id === 'zustand');
      expect(zustandCol?.pros.some((p) => p.includes('License: MIT'))).toBe(true);
    });
  });

  describe('Deprecation Lifecycle & Migration Guidance', () => {
    it('identifies deprecated tools and specifies active migration targets', () => {
      const recoil = repository.getSkillById('recoil');
      expect(recoil).toBeDefined();
      expect(recoil?.isDeprecated).toBe(true);
      expect(recoil?.deprecatedReason).toContain('Meta has archived');
      expect(recoil?.migrationTarget).toBe('jotai');
    });

    it('generates high-visibility deprecation warnings in agent directives', () => {
      const res = generator.generate({ skillId: 'recoil', format: 'agent-skill' });
      expect(res.markdownContent).toContain('DEPRECATION NOTICE');
      expect(res.markdownContent).toContain('Meta has archived');
      expect(res.markdownContent).toContain('**Recommended Migration Target**: `jotai`');
    });

    it('includes deprecation warnings in comparison caveats', () => {
      const matrix = comparisonEngine.compare({ skillIds: ['recoil', 'jotai'] });
      const recoilCol = matrix.columns.find((c) => c.id === 'recoil');
      expect(recoilCol?.caveats).toContain('DEPRECATED:');
      expect(recoilCol?.caveats).toContain('Consider migrating to jotai');
    });
  });

  describe('Tool-Specific Negative Boundaries (whenNotToUse)', () => {
    it('verifies whenNotToUse is defined on representative architectural skills', () => {
      const prisma = repository.getSkillById('prisma');
      expect(prisma?.whenNotToUse).toBeDefined();
      expect(prisma?.whenNotToUse!.length).toBeGreaterThan(0);
      expect(prisma?.whenNotToUse![0]).toContain('Ultra-high-throughput');

      const mongodb = repository.getSkillById('mongodb');
      expect(mongodb?.whenNotToUse).toBeDefined();
      expect(mongodb?.whenNotToUse!.length).toBeGreaterThan(0);
      expect(mongodb?.whenNotToUse![0]).toContain('Strict relational architectures');

      const zustand = repository.getSkillById('zustand');
      expect(zustand?.whenNotToUse).toBeDefined();
      expect(zustand?.whenNotToUse!.length).toBeGreaterThan(0);
    });

    it('incorporates whenNotToUse directly into Section 4 of generated agent directives', () => {
      const res = generator.generate({ skillId: 'prisma', format: 'agent-skill' });
      expect(res.markdownContent).toContain('### When NOT to Use');
      expect(res.markdownContent).toContain('Ultra-high-throughput bulk write operations');
      expect(res.markdownContent).toContain('### Operational Failure Modes');
    });

    it('surfaces avoid-if guidance in comparison column caveats', () => {
      const matrix = comparisonEngine.compare({ skillIds: ['prisma', 'drizzle-orm'] });
      const prismaCol = matrix.columns.find((c) => c.id === 'prisma');
      expect(prismaCol?.caveats).toContain('Avoid if: Ultra-high-throughput');
    });
  });

  describe('Runtime Environment Metadata', () => {
    it('verifies runtimes attribute exists across catalog tools', () => {
      const react = repository.getSkillById('react');
      expect(react?.runtimes).toContain('node');
      expect(react?.runtimes).toContain('browser');

      const fastapi = repository.getSkillById('fastapi');
      expect(fastapi?.runtimes).toContain('cpython');

      const tokio = repository.getSkillById('tokio');
      expect(tokio?.runtimes).toContain('native');
    });
  });
});
