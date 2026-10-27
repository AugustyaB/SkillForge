import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { LocalSkillsManager } from '../data/local-skills-manager.js';
import { SkillsRepository } from '../data/skills-repository.js';
import { QueryCache } from '../engine/query-cache.js';
import type { Skill } from '@skillforge/shared';

describe('Phase 4: Local Skills Database & Interactive Management Engine', () => {
  let tempDir: string;
  let repository: SkillsRepository;
  let cache: QueryCache;
  let manager: LocalSkillsManager;

  const validLocalSkill: Skill = {
    id: 'corp-auth-guard',
    name: 'CorpAuthGuard',
    category: 'authentication',
    difficulty: 'intermediate',
    description: 'Internal zero-trust authentication guard for microservices.',
    whyUseIt: 'Enforces corporate JWT validation and automated mTLS rotation.',
    tags: ['auth', 'security', 'jwt', 'mtls', 'corp'],
    ecosystem: 'javascript',
    officialUrl: 'https://security.internal.corp/auth-guard',
    learnResources: [
      { label: 'Security Portal', url: 'https://security.internal.corp/docs', type: 'docs' },
    ],
    alternatives: ['next-auth', 'clerk'],
    worksWellWith: ['fastify'],
    prerequisites: ['node'],
    stackIndicators: ['@corp/auth-guard', 'corp-auth-guard'],
    license: 'Proprietary',
    isDeprecated: false,
    whenNotToUse: ['Do not use in public unauthenticated edge proxies'],
    runtimes: ['node'],
    source: 'workspace',
  };

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-local-manager-test-'));
    repository = new SkillsRepository();
    cache = new QueryCache();
    manager = new LocalSkillsManager({ repository, cache });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Local Database CRUD Lifecycle', () => {
    it('creates database file and persists local skill atomically', async () => {
      const res = await manager.addSkill(tempDir, validLocalSkill);
      expect(res.success).toBe(true);
      expect(res.skillId).toBe('corp-auth-guard');

      // Verify file written to .skillforge/skills.json
      const dbPath = path.join(tempDir, '.skillforge', 'skills.json');
      expect(fs.existsSync(dbPath)).toBe(true);

      const content = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      expect(content.version).toBe('1.0');
      expect(content.skills).toHaveLength(1);
      expect(content.skills[0]?.id).toBe('corp-auth-guard');
      expect(content.skills[0]?.source).toBe('workspace');
    });

    it('lists all locally saved skills', async () => {
      await manager.addSkill(tempDir, validLocalSkill);

      const listRes = await manager.listSkills(tempDir);
      expect(listRes.success).toBe(true);
      expect(listRes.skills).toHaveLength(1);
      expect(listRes.skills?.[0]?.id).toBe('corp-auth-guard');
    });

    it('removes local skill from disk and returns updated list', async () => {
      await manager.addSkill(tempDir, validLocalSkill);
      const removeRes = await manager.removeSkill(tempDir, 'corp-auth-guard');

      expect(removeRes.success).toBe(true);
      expect(removeRes.skillId).toBe('corp-auth-guard');

      const listRes = await manager.listSkills(tempDir);
      expect(listRes.skills).toHaveLength(0);

      const dbPath = path.join(tempDir, '.skillforge', 'skills.json');
      const content = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      expect(content.skills).toHaveLength(0);
    });
  });

  describe('Live In-Memory Cache Coherence & Ranking Synergy', () => {
    it('immediately reflects added skill in repository search with Workspace Affinity Boost', async () => {
      // Prior to adding, skill does not exist
      expect(repository.getSkillById('corp-auth-guard')).toBeUndefined();

      await manager.addSkill(tempDir, validLocalSkill);

      // Immediately searchable in repository
      const skill = repository.getSkillById('corp-auth-guard');
      expect(skill).toBeDefined();
      expect(skill?.name).toBe('CorpAuthGuard');
      expect(skill?.source).toBe('workspace');

      // Workspace Affinity Boost (+40 pts)
      const searchRes = repository.search('corp auth guard');
      expect(searchRes.length).toBeGreaterThan(0);
      expect(searchRes[0]?.skill.id).toBe('corp-auth-guard');
      expect(
        searchRes[0]?.matchReasons.some((r) =>
          r.includes('Workspace private skill defined in .skillforge.json')
        )
      ).toBe(true);
    });

    it('immediately deletes skill from repository indices when removed', async () => {
      await manager.addSkill(tempDir, validLocalSkill);
      expect(repository.getSkillById('corp-auth-guard')).toBeDefined();

      await manager.removeSkill(tempDir, 'corp-auth-guard');
      expect(repository.getSkillById('corp-auth-guard')).toBeUndefined();
      expect(repository.getSkillsByTag('mtls')).toHaveLength(0);
      expect(repository.getSkillByIndicator('@corp/auth-guard')).toBeUndefined();
    });
  });

  describe('Backup Rotation & Corrupted Database Auto-Recovery', () => {
    it('creates .bak copy when modifying existing database', async () => {
      await manager.addSkill(tempDir, validLocalSkill);

      const updatedSkill: Skill = {
        ...validLocalSkill,
        name: 'CorpAuthGuard V2',
      };
      await manager.addSkill(tempDir, updatedSkill);

      const bakPath = path.join(tempDir, '.skillforge', 'skills.json.bak');
      expect(fs.existsSync(bakPath)).toBe(true);

      const bakContent = JSON.parse(fs.readFileSync(bakPath, 'utf-8'));
      expect(bakContent.skills[0]?.name).toBe('CorpAuthGuard');
    });

    it('recovers from corrupt database JSON by rotating to .corrupt file and starting fresh', async () => {
      const dbDir = path.join(tempDir, '.skillforge');
      fs.mkdirSync(dbDir, { recursive: true });
      const dbPath = path.join(dbDir, 'skills.json');
      fs.writeFileSync(dbPath, '{"broken": [malformed, syntax', 'utf-8');

      const res = await manager.addSkill(tempDir, validLocalSkill);
      expect(res.success).toBe(true);

      // Verify the new clean database was written
      const cleanDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      expect(cleanDb.skills).toHaveLength(1);

      // Verify corrupt file was rotated
      const files = fs.readdirSync(dbDir);
      expect(files.some((f) => f.includes('.corrupt.'))).toBe(true);
    });
  });

  describe('Anti-Happy-Path & Adversarial Guardrails', () => {
    it('rejects duplicate skill ID when overwrite is false', async () => {
      await manager.addSkill(tempDir, validLocalSkill);

      const dupRes = await manager.addSkill(tempDir, validLocalSkill, false);
      expect(dupRes.success).toBe(false);
      expect(dupRes.error).toBe('ALREADY_EXISTS');
    });

    it('rejects malformed skill payloads with validation error', async () => {
      const invalidSkill = {
        id: 'bad ID with spaces',
        name: 'Bad',
      };

      const res = await manager.addSkill(tempDir, invalidSkill);
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('gracefully handles non-existent skill removal', async () => {
      const res = await manager.removeSkill(tempDir, 'non-existent-skill');
      expect(res.success).toBe(false);
      expect(res.error).toBe('NOT_FOUND');
    });

    it('gracefully handles empty or hostile parameters', async () => {
      expect((await manager.removeSkill(tempDir, '')).success).toBe(false);
      expect((await manager.removeSkill(tempDir, null as unknown as string)).success).toBe(false);
      expect((await manager.removeSkill(tempDir, 'constructor')).error).toBe('NOT_FOUND');
      expect((await manager.listSkills(null as unknown as string)).success).toBe(false);
    });
  });
});
