import { describe, expect, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  checkUrl,
  auditSkills,
  applyRedirectFixes,
  readCache,
  writeCache,
  parseCliArgs,
} from '../../scripts/audit-link-rot.cjs';
import type { Skill } from '@skillforge/shared';

describe('Phase 5: Automated Link Health & Link Rot Audit Suite', () => {
  let server: http.Server;
  let serverUrl: string;
  let tempDir: string;
  let rateLimitAttempt = 0;

  beforeAll(async () => {
    // Spin up a deterministic local mock HTTP server
    server = http.createServer((req, res) => {
      const url = req.url || '/';

      if (url === '/ok') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      } else if (url === '/head-not-allowed') {
        if (req.method === 'HEAD') {
          res.writeHead(405, { 'Content-Type': 'text/plain' });
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('GET OK');
        }
      } else if (url === '/redirect-301') {
        res.writeHead(301, { Location: `${serverUrl}/ok` });
        res.end();
      } else if (url === '/redirect-loop-a') {
        res.writeHead(302, { Location: `${serverUrl}/redirect-loop-b` });
        res.end();
      } else if (url === '/redirect-loop-b') {
        res.writeHead(302, { Location: `${serverUrl}/redirect-loop-a` });
        res.end();
      } else if (url === '/not-found') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else if (url === '/gone') {
        res.writeHead(410, { 'Content-Type': 'text/plain' });
        res.end('Gone');
      } else if (url === '/rate-limit') {
        rateLimitAttempt++;
        if (rateLimitAttempt === 1) {
          res.writeHead(429, { 'Retry-After': '0', 'Content-Type': 'text/plain' });
          res.end('Too Many Requests');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Rate Limit Recovered');
        }
      } else if (url === '/timeout') {
        // Delay response to trigger client-side timeout
        setTimeout(() => {
          if (!res.writableEnded) {
            res.writeHead(200);
            res.end('Delayed');
          }
        }, 1500);
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as { port: number };
        serverUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-link-audit-test-'));
    rateLimitAttempt = 0;
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Core Link Verification Engine', () => {
    it('verifies healthy 200 OK endpoints using HEAD request', async () => {
      const res = await checkUrl(`${serverUrl}/ok`);
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.redirected).toBe(false);
      expect(res.error).toBeUndefined();
    });

    it('falls back to GET when server rejects HEAD with 405 Method Not Allowed', async () => {
      const res = await checkUrl(`${serverUrl}/head-not-allowed`);
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(res.finalUrl).toBe(`${serverUrl}/head-not-allowed`);
    });

    it('resolves permanent 301 redirects and tracks target URL', async () => {
      const res = await checkUrl(`${serverUrl}/redirect-301`);
      expect(res.ok).toBe(true);
      expect(res.redirected).toBe(true);
      expect(res.finalUrl).toBe(`${serverUrl}/ok`);
      expect(res.redirectChain?.length).toBeGreaterThan(1);
    });

    it('detects 404 Not Found and 410 Gone accurately', async () => {
      const res404 = await checkUrl(`${serverUrl}/not-found`);
      expect(res404.ok).toBe(false);
      expect(res404.status).toBe(404);
      expect(res404.error).toBe('HTTP_404');

      const res410 = await checkUrl(`${serverUrl}/gone`);
      expect(res410.ok).toBe(false);
      expect(res410.status).toBe(410);
      expect(res410.error).toBe('HTTP_410');
    });

    it('retries with backoff on 429 Rate Limiting and succeeds', async () => {
      const res = await checkUrl(`${serverUrl}/rate-limit`);
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
      expect(rateLimitAttempt).toBe(2);
    });
  });

  describe('Anti-Happy-Path & Adversarial Protections', () => {
    it('detects and terminates cyclic redirect loops without freezing', async () => {
      const res = await checkUrl(`${serverUrl}/redirect-loop-a`);
      expect(res.ok).toBe(false);
      expect(res.error).toBe('REDIRECT_LOOP');
      expect(res.redirectChain?.length).toBeLessThanOrEqual(5);
    });

    it('aborts cleanly within configured timeoutMs on stalled connections', async () => {
      const startTime = Date.now();
      const res = await checkUrl(`${serverUrl}/timeout`, { timeoutMs: 250 });
      const elapsed = Date.now() - startTime;

      expect(res.ok).toBe(false);
      expect(res.error).toBe('TIMEOUT');
      expect(elapsed).toBeLessThan(1200);
    });

    it('rejects unsupported protocols and malformed URL strings', async () => {
      expect((await checkUrl('ftp://example.com/file')).error).toBe('UNSUPPORTED_PROTOCOL');
      expect((await checkUrl('javascript:void(0)')).error).toBe('UNSUPPORTED_PROTOCOL');
      expect((await checkUrl('not a valid url')).error).toBe('MALFORMED_URL');
      expect((await checkUrl('')).error).toBe('INVALID_URL');
      expect((await checkUrl(null as unknown as string)).error).toBe('INVALID_URL');
    });
  });

  describe('Caching & Resilience', () => {
    it('uses cached responses to avoid redundant network hits', async () => {
      const cache: Record<string, unknown> = {};
      const url = `${serverUrl}/ok`;

      // 1. Initial check (fills cache)
      const res1 = await checkUrl(url, {}, cache);
      expect(res1.ok).toBe(true);
      expect(res1.cached).toBeUndefined();

      // 2. Second check (hits cache)
      const res2 = await checkUrl(url, {}, cache);
      expect(res2.ok).toBe(true);
      expect(res2.cached).toBe(true);
    });

    it('recovers gracefully from corrupted cache files on disk', () => {
      const corruptCacheFile = path.join(tempDir, '.corrupt-cache.json');
      fs.writeFileSync(corruptCacheFile, '{"broken": [syntax, error', 'utf-8');

      const cache = readCache(corruptCacheFile);
      expect(cache).toEqual({});

      // Writing cache restores valid JSON
      writeCache({ 'https://react.dev': { ok: true, status: 200 } }, corruptCacheFile);
      const restored = readCache(corruptCacheFile);
      expect(restored['https://react.dev']).toBeDefined();
    });
  });

  describe('Batch Catalog Auditing & Auto-Fix Mode', () => {
    const mockSkills: Skill[] = [
      {
        id: 'skill-alpha',
        name: 'Skill Alpha',
        category: 'frontend-framework',
        difficulty: 'beginner',
        description: 'Mock skill for link audit unit testing.',
        whyUseIt: 'Validates automated link health audit suite.',
        tags: ['test'],
        ecosystem: 'javascript',
        officialUrl: '', // will be set below
        learnResources: [],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: ['alpha'],
      },
      {
        id: 'skill-beta',
        name: 'Skill Beta',
        category: 'backend-framework',
        difficulty: 'intermediate',
        description: 'Second mock skill for link audit unit testing.',
        whyUseIt: 'Validates redirect auto-fixing.',
        tags: ['test'],
        ecosystem: 'javascript',
        officialUrl: '', // will be set below
        learnResources: [],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: ['beta'],
      },
    ];

    it('audits skill catalog and deduplicates shared URLs', async () => {
      const skills = [
        {
          ...mockSkills[0],
          officialUrl: `${serverUrl}/ok`,
          learnResources: [{ label: 'Docs', url: `${serverUrl}/ok`, type: 'docs' as const }],
        },
        {
          ...mockSkills[1],
          officialUrl: `${serverUrl}/ok`,
          learnResources: [{ label: 'Guide', url: `${serverUrl}/not-found`, type: 'docs' as const }],
        },
      ];

      const cacheFile = path.join(tempDir, 'test-cache.json');
      const summary = await auditSkills(skills, { cacheFile, silent: true });

      expect(summary.totalSkills).toBe(2);
      expect(summary.totalUrls).toBe(2); // ${serverUrl}/ok is deduplicated
      expect(summary.healthyCount).toBe(1);
      expect(summary.brokenCount).toBe(1);
      expect(summary.broken[0]?.url).toBe(`${serverUrl}/not-found`);
    });

    it('applies redirect fixes to skill definitions cleanly', () => {
      const skillsFile = path.join(tempDir, 'skills.json');
      const skills = [
        {
          ...mockSkills[0],
          officialUrl: `${serverUrl}/redirect-301`,
          learnResources: [{ label: 'Docs', url: `${serverUrl}/redirect-301`, type: 'docs' as const }],
        },
      ];
      fs.writeFileSync(skillsFile, JSON.stringify(skills, null, 2), 'utf-8');

      const redirectedLinks = [
        {
          url: `${serverUrl}/redirect-301`,
          finalUrl: `${serverUrl}/ok`,
        },
      ];

      const fixRes = applyRedirectFixes(skills, redirectedLinks, skillsFile);
      expect(fixRes.appliedCount).toBe(2);

      const updated = JSON.parse(fs.readFileSync(skillsFile, 'utf-8'));
      expect(updated[0].officialUrl).toBe(`${serverUrl}/ok`);
      expect(updated[0].learnResources[0].url).toBe(`${serverUrl}/ok`);
    });

    it('correctly parses CLI arguments and flags', () => {
      const options = parseCliArgs([
        '--sample=25',
        '--skill=react',
        '--timeout=3000',
        '--concurrency=4',
        '--fix',
        '--report',
        '--no-cache',
      ]);

      expect(options.sample).toBe(25);
      expect(options.skillId).toBe('react');
      expect(options.timeoutMs).toBe(3000);
      expect(options.concurrency).toBe(4);
      expect(options.fix).toBe(true);
      expect(options.report).toBe(true);
      expect(options.noCache).toBe(true);
    });
  });
});
