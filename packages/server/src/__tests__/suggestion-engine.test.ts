import { describe, it, expect, beforeEach } from 'vitest';
import { SuggestionEngine } from '../engine/suggestion-engine.js';
import { IntentParser } from '../engine/intent-parser.js';
import { QueryCache } from '../engine/query-cache.js';

describe('SuggestionEngine & IntentParser', () => {
  describe('IntentParser', () => {
    let parser: IntentParser;

    beforeEach(() => {
      parser = new IntentParser();
    });

    it('extracts action verb and category for real-time chat query', () => {
      const parsed = parser.parse('I want to build a real-time chat app');
      expect(parsed.actionVerb).toBe('build');
      expect(parsed.detectedCategories).toContain('api-protocol');
      expect(parsed.tokens).toContain('chat');
      expect(parsed.tokens).toContain('realtime');
    });

    it('extracts authentication category and ecosystem for python auth query', () => {
      const parsed = parser.parse('Integrate secure login into my python backend');
      expect(parsed.actionVerb).toBe('integrate');
      expect(parsed.detectedCategories).toContain('authentication');
      expect(parsed.explicitEcosystem).toBe('python');
    });

    it('extracts difficulty and constraints from query', () => {
      const parsed = parser.parse('Fast, lightweight starter database for beginners');
      expect(parsed.difficultyPreference).toBe('beginner');
      expect(parsed.constraints).toContain('fast');
      expect(parsed.constraints).toContain('lightweight');
      expect(parsed.detectedCategories).toContain('database');
    });
  });

  describe('QueryCache', () => {
    let cache: QueryCache;

    beforeEach(() => {
      cache = new QueryCache(5000); // 5s TTL for test
    });

    it('stores and retrieves cached suggestion result', () => {
      const key = cache.generateKey('chat app', ['/my-project'], ['express']);
      const mockResult = {
        skills: [],
        timings: { localMs: 12, totalMs: 12 },
        queryEcho: 'chat app',
      };

      cache.set(key, mockResult);
      const retrieved = cache.get(key);

      expect(retrieved).toBeDefined();
      expect(retrieved?.queryEcho).toBe('chat app');
    });

    it('returns undefined for non-existent or expired key', async () => {
      const shortTtlCache = new QueryCache(10); // 10ms
      const key = shortTtlCache.generateKey('test');
      shortTtlCache.set(key, { skills: [], timings: { localMs: 1, totalMs: 1 }, queryEcho: 'test' });

      // Wait 15ms for expiration
      await new Promise((r) => setTimeout(r, 15));
      expect(shortTtlCache.get(key)).toBeUndefined();
    });
  });

  describe('SuggestionEngine', () => {
    let engine: SuggestionEngine;

    beforeEach(() => {
      engine = new SuggestionEngine();
    });

    it('returns suggestions for basic intent query', async () => {
      const result = await engine.suggest({
        intent: 'real-time messaging',
      });

      expect(result.skills.length).toBeGreaterThan(0);
      const ids = result.skills.map((s) => s.id);
      expect(ids).toContain('socket-io');
      expect(result.skills[0]?.trustTier).toBe('verified');
      expect(result.timings.localMs).toBeGreaterThanOrEqual(0);
    });

    it('applies compatibility boost when complementary tool is installed', async () => {
      // With express installed, Prisma or Socket.io (worksWellWith: ['express']) should receive a boost
      const result = await engine.suggest({
        intent: 'database orm for node',
        context: {
          alreadyInstalled: ['express'],
          ecosystem: 'javascript',
        },
      });

      expect(result.skills.length).toBeGreaterThan(0);
      const prismaSkill = result.skills.find((s) => s.id === 'prisma');
      expect(prismaSkill).toBeDefined();
      // Should mention integration in reasoning
      expect(prismaSkill?.reasoning).toMatch(/express/i);
    });

    it('detects and flags already-installed packages in workspace', async () => {
      const result = await engine.suggest({
        intent: 'frontend component library',
        context: {
          alreadyInstalled: ['react', 'react-dom'],
          ecosystem: 'javascript',
        },
      });

      expect(result.skills.length).toBeGreaterThan(0);
      const reactSkill = result.skills.find((s) => s.id === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.isInstalledInWorkspace).toBe(true);
      expect(reactSkill?.reasoning).toMatch(/already installed/i);
    });

    it('serves repeat query instantly from cache with timings.localMs === 0', async () => {
      const params = {
        intent: 'modern web framework',
      };

      // First query (cache miss)
      const first = await engine.suggest(params);
      expect(first.skills.length).toBeGreaterThan(0);

      // Second query (cache hit)
      const second = await engine.suggest(params);
      expect(second.skills.length).toBe(first.skills.length);
      expect(second.timings.localMs).toBe(0);
      expect(second.timings.totalMs).toBe(0);
    });

    it('handles empty query gracefully', async () => {
      const result = await engine.suggest({ intent: '' });
      expect(result.skills).toHaveLength(0);
    });

    it('prioritizes explicit query ecosystem over ambient workspace context (BUG-03)', async () => {
      // User is in a Python workspace, but explicitly asks for a Rust backend
      const result = await engine.suggest({
        intent: 'suggest a rust backend framework',
        context: {
          ecosystem: 'python',
          alreadyInstalled: ['django', 'flask'],
        },
      });

      expect(result.skills.length).toBeGreaterThan(0);
      const skillIds = result.skills.map((s) => s.id);
      expect(skillIds.some((id) => id === 'axum' || id === 'actix-web')).toBe(true);
      expect(skillIds).not.toContain('django');
      expect(skillIds).not.toContain('flask');
    });

    it('resolves manifest package names to canonical skill IDs for compatibility boost (BUG-02)', async () => {
      // Project has package manifest names: "next" (ID: nextjs) and "tailwindcss" (ID: tailwind-css)
      const result = await engine.suggest({
        intent: 'react frontend',
        context: {
          alreadyInstalled: ['next', 'tailwindcss'],
          ecosystem: 'javascript',
        },
      });

      const reactSkill = result.skills.find((s) => s.id === 'react');
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.reasoning).toMatch(/nextjs|tailwind-css/i);
    });

    it('generates distinct cache keys for different options and signals (BUG-04)', async () => {
      // Query with maxResults: 2
      const res2 = await engine.suggest({
        intent: 'web framework',
        options: { maxResults: 2 },
      });
      expect(res2.skills).toHaveLength(2);

      // Query with maxResults: 4 — must NOT return cached 2-item list
      const res4 = await engine.suggest({
        intent: 'web framework',
        options: { maxResults: 4 },
      });
      expect(res4.skills).toHaveLength(4);
    });

    it('safely handles null or undefined params without throwing (BUG-07)', async () => {
      const resUndefined = await engine.suggest(undefined as any);
      expect(resUndefined.skills).toHaveLength(0);

      const resNull = await engine.suggest(null as any);
      expect(resNull.skills).toHaveLength(0);

      const resEmptyObj = await engine.suggest({} as any);
      expect(resEmptyObj.skills).toHaveLength(0);
    });
  });
});
