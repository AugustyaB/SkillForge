import { describe, it, expect } from 'vitest';
import { HealthVerifier } from '../reliability/health-verifier.js';
import type { FetchFunction } from '../reliability/health-verifier.js';

/**
 * Create a mock fetch function that returns controlled responses.
 */
function createMockFetch(
  handler: (url: string) => { status: number; body: unknown }
): FetchFunction {
  return (async (input: string | URL | Request, _init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const { status, body } = handler(url);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response;
  }) as FetchFunction;
}

describe('HealthVerifier', () => {
  it('returns healthy verdict for recently published package', async () => {
    const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week ago

    const mockFetch = createMockFetch((url) => {
      if (url.includes('registry.npmjs.org')) {
        return {
          status: 200,
          body: {
            name: 'express',
            time: { modified: recentDate },
          },
        };
      }
      return { status: 200, body: { downloads: 30000000 } };
    });

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('express');

    expect(health.packageExists).toBe(true);
    expect(health.healthVerdict).toBe('healthy');
    expect(health.lastPublished).toBe(recentDate);
  });

  it('returns abandoned verdict for deprecated package', async () => {
    const mockFetch = createMockFetch(() => ({
      status: 200,
      body: {
        name: 'request',
        deprecated: true,
        time: { modified: '2020-01-01T00:00:00.000Z' },
      },
    }));

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('request');

    expect(health.packageExists).toBe(true);
    expect(health.healthVerdict).toBe('abandoned');
  });

  it('returns abandoned verdict for package not updated in 3+ years', async () => {
    const oldDate = new Date(
      Date.now() - 4 * 365 * 24 * 60 * 60 * 1000
    ).toISOString(); // 4 years ago

    const mockFetch = createMockFetch(() => ({
      status: 200,
      body: {
        name: 'old-lib',
        time: { modified: oldDate },
      },
    }));

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('old-lib');

    expect(health.packageExists).toBe(true);
    expect(health.healthVerdict).toBe('abandoned');
  });

  it('returns aging verdict for package not updated in 1.5-3 years', async () => {
    const agingDate = new Date(
      Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
    ).toISOString(); // 2 years ago

    const mockFetch = createMockFetch(() => ({
      status: 200,
      body: {
        name: 'aging-lib',
        time: { modified: agingDate },
      },
    }));

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('aging-lib');

    expect(health.packageExists).toBe(true);
    expect(health.healthVerdict).toBe('aging');
  });

  it('returns packageExists: false for 404 response', async () => {
    const mockFetch = createMockFetch(() => ({
      status: 404,
      body: {},
    }));

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('nonexistent-package-xyz');

    expect(health.packageExists).toBe(false);
    expect(health.healthVerdict).toBeUndefined();
  });

  it('returns graceful offline fallback on network error', async () => {
    const mockFetch = (async () => {
      throw new Error('Network unreachable');
    }) as FetchFunction;

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('some-package');

    // Should not throw — returns safe fallback
    expect(health.packageExists).toBe(true);
    expect(health.cachedAt).toBeDefined();
  });

  it('returns cached result on second query within TTL', async () => {
    let registryFetchCount = 0;
    const mockFetch = createMockFetch((url) => {
      if (url.includes('registry.npmjs.org')) {
        registryFetchCount++;
        return {
          status: 200,
          body: {
            name: 'cached-lib',
            time: { modified: new Date().toISOString() },
          },
        };
      }
      // Downloads endpoint
      return { status: 200, body: { downloads: 1000 } };
    });

    const verifier = new HealthVerifier({ fetchFn: mockFetch, cacheTtlMs: 60000 });

    const first = await verifier.checkPackage('cached-lib');
    const second = await verifier.checkPackage('cached-lib');

    expect(first.packageExists).toBe(true);
    expect(second.packageExists).toBe(true);
    // Only 1 registry fetch — second served from cache
    expect(registryFetchCount).toBe(1);
  });

  it('returns stale cache data when network fails (BUG-06)', async () => {
    let registryCallCount = 0;
    const mockFetch = createMockFetch((url) => {
      if (url.includes('registry.npmjs.org')) {
        registryCallCount++;
        if (registryCallCount === 1) {
          return {
            status: 200,
            body: {
              name: 'stale-lib',
              time: { modified: '2026-01-01T00:00:00.000Z' },
            },
          };
        }
        throw new Error('Network down');
      }
      return { status: 200, body: { downloads: 100 } };
    });

    // TTL=0 ensures the 2nd call attempts to re-fetch from network
    const verifier = new HealthVerifier({ fetchFn: mockFetch, cacheTtlMs: 0 });
    const first = await verifier.checkPackage('stale-lib');
    expect(first.packageExists).toBe(true);
    expect(first.lastPublished).toBe('2026-01-01T00:00:00.000Z');

    // 2nd call: network throws Error('Network down'), verifier falls back to stale cache
    const second = await verifier.checkPackage('stale-lib');
    expect(second.packageExists).toBe(true);
    expect(second.lastPublished).toBe('2026-01-01T00:00:00.000Z');
    expect(registryCallCount).toBe(2);
  });

  it('prioritizes latest release version publish date over modified metadata date (BUG-10)', async () => {
    const fourYearsAgo = new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString();

    const mockFetch = createMockFetch(() => ({
      status: 200,
      body: {
        name: 'abandoned-with-recent-tweak',
        'dist-tags': { latest: '1.0.0' },
        time: {
          modified: today, // Metadata changed today
          '1.0.0': fourYearsAgo, // But actual code published 4 years ago!
        },
      },
    }));

    const verifier = new HealthVerifier({ fetchFn: mockFetch });
    const health = await verifier.checkPackage('abandoned-with-recent-tweak');

    expect(health.packageExists).toBe(true);
    expect(health.lastPublished).toBe(fourYearsAgo);
    expect(health.healthVerdict).toBe('abandoned');
  });
});
