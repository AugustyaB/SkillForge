import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { SkillsRepository } from '../data/skills-repository.js';
import { SuggestionEngine } from '../engine/suggestion-engine.js';
import type { Skill } from '@skillforge/shared';

describe('Phase 3: Workspace Private Catalog Extensibility', () => {
  let tempDir: string;
  let repository: SkillsRepository;
  let engine: SuggestionEngine;

  const samplePrivateSkill: Skill = {
    id: 'corp-auth-client',
    name: 'CorpAuthClient',
    category: 'authentication',
    difficulty: 'intermediate',
    description: 'Internal company identity provider client with SSO, MFA, and audit logging.',
    whyUseIt: 'Mandatory authentication SDK enforcing enterprise zero-trust identity policies.',
    tags: ['auth', 'sso', 'mfa', 'security', 'enterprise', 'corp'],
    ecosystem: 'javascript',
    officialUrl: 'https://security.internal.corp/docs/auth-client',
    learnResources: [
      { label: 'Security Portal', url: 'https://security.internal.corp/docs', type: 'docs' },
    ],
    alternatives: ['next-auth', 'clerk'],
    worksWellWith: ['fastify', 'express'],
    prerequisites: ['node'],
    stackIndicators: ['@corp/auth-client', 'corp-auth-client'],
    license: 'Proprietary',
    isDeprecated: false,
    whenNotToUse: ['Do not use for external unauthenticated guest portals'],
    runtimes: ['node', 'browser'],
    source: 'workspace',
  };

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-workspace-test-'));
    repository = new SkillsRepository();
    engine = new SuggestionEngine({ repository });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Programmatic In-Memory Config Overlay', () => {
    it('loads private workspace skill and indexes across all dimensions', () => {
      const initialCount = repository.count;
      const loadRes = repository.loadWorkspaceConfig({
        skills: [samplePrivateSkill],
      });

      expect(loadRes.loadedCount).toBe(1);
      expect(repository.count).toBe(initialCount + 1);

      // Verify ID lookup
      const loaded = repository.getSkillById('corp-auth-client');
      expect(loaded).toBeDefined();
      expect(loaded?.name).toBe('CorpAuthClient');
      expect(loaded?.source).toBe('workspace');

      // Verify Category and Tag indexing
      const authSkills = repository.getSkillsByCategory('authentication');
      expect(authSkills.some((s) => s.id === 'corp-auth-client')).toBe(true);

      const corpSkills = repository.getSkillsByTag('corp');
      expect(corpSkills.some((s) => s.id === 'corp-auth-client')).toBe(true);

      // Verify Indicator indexing
      const matchedByIndicator = repository.getSkillByIndicator('@corp/auth-client');
      expect(matchedByIndicator?.id).toBe('corp-auth-client');
    });

    it('awards Workspace Affinity Boost (+40 pts) in search when intent matches', () => {
      repository.loadWorkspaceConfig({ skills: [samplePrivateSkill] });

      const searchRes = repository.search('corp auth client');
      expect(searchRes.length).toBeGreaterThan(0);

      const topResult = searchRes[0];
      expect(topResult?.skill.id).toBe('corp-auth-client');
      expect(
        topResult?.matchReasons.some((r) =>
          r.includes('Workspace private skill defined in .skillforge.json')
        )
      ).toBe(true);
    });

    it('shadows existing catalog skill cleanly on ID collision without inflating count', () => {
      const initialCount = repository.count;
      const customDocker: Skill = {
        ...samplePrivateSkill,
        id: 'docker',
        name: 'Corp Hardened Docker',
        description: 'Hardened corporate container runtime compliant with FedRAMP.',
      };

      const loadRes = repository.loadWorkspaceConfig({ skills: [customDocker] });
      expect(loadRes.loadedCount).toBe(1);
      // Total count must not change on shadowing
      expect(repository.count).toBe(initialCount);

      const shadowed = repository.getSkillById('docker');
      expect(shadowed?.name).toBe('Corp Hardened Docker');
      expect(shadowed?.source).toBe('workspace');
    });

    it('applies partial overrides to existing skills cleanly', () => {
      const loadRes = repository.loadWorkspaceConfig({
        overrides: {
          prisma: {
            isDeprecated: true,
            deprecatedReason: 'Corporate mandate: migrate to drizzle-orm for serverless compatibility',
            migrationTarget: 'drizzle-orm',
          },
        },
      });

      expect(loadRes.overriddenCount).toBe(1);

      const prisma = repository.getSkillById('prisma');
      expect(prisma?.isDeprecated).toBe(true);
      expect(prisma?.deprecatedReason).toContain('Corporate mandate');
      expect(prisma?.migrationTarget).toBe('drizzle-orm');
    });
  });

  describe('Declarative Filesystem Discovery (.skillforge.json & .skillforge/skills.json)', () => {
    it('discovers and loads .skillforge.json at workspace root', () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      fs.writeFileSync(configPath, JSON.stringify([samplePrivateSkill]), 'utf-8');

      const result = repository.loadWorkspaceSkills(tempDir);
      expect(result.loadedCount).toBe(1);
      expect(result.errors).toHaveLength(0);

      const skill = repository.getSkillById('corp-auth-client');
      expect(skill).toBeDefined();
      expect(skill?.source).toBe('workspace');
    });

    it('discovers and loads structured config in .skillforge/skills.json', () => {
      const dotDir = path.join(tempDir, '.skillforge');
      fs.mkdirSync(dotDir, { recursive: true });
      const configPath = path.join(dotDir, 'skills.json');
      fs.writeFileSync(
        configPath,
        JSON.stringify({
          version: '1.0',
          skills: [samplePrivateSkill],
          overrides: {
            fastapi: {
              license: 'Enterprise-Internal',
            },
          },
        }),
        'utf-8'
      );

      const result = repository.loadWorkspaceSkills(tempDir);
      expect(result.loadedCount).toBe(1);
      expect(result.overriddenCount).toBe(1);

      const fastapi = repository.getSkillById('fastapi');
      expect(fastapi?.license).toBe('Enterprise-Internal');
    });

    it('supports file:// URI schemes in workspace root paths', () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      fs.writeFileSync(configPath, JSON.stringify([samplePrivateSkill]), 'utf-8');

      const fileUri = `file://${tempDir.replace(/\\/g, '/')}`;
      const result = repository.loadWorkspaceSkills(fileUri);
      expect(result.loadedCount).toBe(1);
    });
  });

  describe('Anti-Happy-Path & Adversarial Edge Cases', () => {
    it('safely handles corrupted or invalid JSON without crashing the server', () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      fs.writeFileSync(configPath, '{"broken": [true, trailing, ]}', 'utf-8');

      const result = repository.loadWorkspaceSkills(tempDir);
      expect(result.loadedCount).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid JSON syntax');

      // Bundled catalog remains pristine
      expect(repository.count).toBeGreaterThan(300);
    });

    it('safely handles empty or whitespace-only config files', () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      fs.writeFileSync(configPath, '   \n\t  ', 'utf-8');

      const result = repository.loadWorkspaceSkills(tempDir);
      expect(result.loadedCount).toBe(0);
      expect(result.errors.some((e) => e.includes('whitespace') || e.includes('empty'))).toBe(true);
    });

    it('rejects oversized config files exceeding 5MB limit', () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      // Create a dummy oversized file
      const dummyBuffer = Buffer.alloc(5.2 * 1024 * 1024, ' ');
      fs.writeFileSync(configPath, dummyBuffer);

      const result = repository.loadWorkspaceSkills(tempDir);
      expect(result.loadedCount).toBe(0);
      expect(result.errors.some((e) => e.includes('exceeds 5MB size limit'))).toBe(true);
    });

    it('safely handles non-existent or hostile root paths (null, undefined, invalid path)', () => {
      expect(repository.loadWorkspaceSkills(null as unknown as string).loadedCount).toBe(0);
      expect(repository.loadWorkspaceSkills(undefined as unknown as string).loadedCount).toBe(0);
      expect(repository.loadWorkspaceSkills('').loadedCount).toBe(0);
      expect(
        repository.loadWorkspaceSkills('C:/non/existent/bogus/path/nowhere').loadedCount
      ).toBe(0);
    });

    it('does not force irrelevant workspace private skills when user query intent opposes it', async () => {
      // Workspace has an internal Python data pipeline skill
      const pyPrivateSkill: Skill = {
        ...samplePrivateSkill,
        id: 'corp-py-etl',
        name: 'CorpPyETL',
        category: 'backend-framework',
        ecosystem: 'python',
        tags: ['python', 'etl', 'pipeline'],
        stackIndicators: ['corp-py-etl'],
      };
      repository.loadWorkspaceConfig({ skills: [pyPrivateSkill] });

      // User explicitly queries for React frontend state management
      const searchRes = repository.search('react state management', {
        category: 'state-management',
        ecosystem: 'javascript',
      });

      // The irrelevant Python ETL tool must NOT appear in results
      expect(searchRes.some((s) => s.skill.id === 'corp-py-etl')).toBe(false);
    });

    it('resets cleanly when resetWorkspaceSkills is invoked', () => {
      const baselineCount = repository.count;
      repository.loadWorkspaceConfig({ skills: [samplePrivateSkill] });
      expect(repository.count).toBe(baselineCount + 1);

      repository.resetWorkspaceSkills();
      expect(repository.count).toBe(baselineCount);
      expect(repository.getSkillById('corp-auth-client')).toBeUndefined();
      expect(repository.getWorkspaceSkills()).toHaveLength(0);
    });
  });

  describe('SuggestionEngine Dynamic Workspace Discovery Integration', () => {
    it('discovers workspace skills automatically when workspace path is passed in context scope', async () => {
      const configPath = path.join(tempDir, '.skillforge.json');
      fs.writeFileSync(configPath, JSON.stringify([samplePrivateSkill]), 'utf-8');

      const result = await engine.suggest({
        intent: 'corp auth sso',
        context: {
          scope: {
            mode: 'folder',
            label: 'Test Workspace',
            paths: [tempDir],
          },
        },
      });

      expect(result.skills.length).toBeGreaterThan(0);
      const top = result.skills[0];
      expect(top?.id).toBe('corp-auth-client');
      expect(top?.source).toBe('workspace');
    });
  });
});
