import type { PackageHealth } from '@skillforge/shared';

/**
 * Function signature for fetch — allows dependency injection for testing
 * without requiring live network access.
 */
export type FetchFunction = typeof globalThis.fetch;

export interface HealthVerifierOptions {
  /** Injectable fetch function (defaults to globalThis.fetch) */
  fetchFn?: FetchFunction;
  /** Cache TTL in milliseconds (defaults to 24 hours) */
  cacheTtlMs?: number;
  /** Timeout for network requests in milliseconds (defaults to 2000ms) */
  timeoutMs?: number;
}

interface CachedHealth {
  health: PackageHealth;
  cachedAt: number;
}

/**
 * HealthVerifier — Checks package registry (npm) to verify existence,
 * maintenance status, and download metrics. Results are cached with a
 * configurable TTL (default 24h) to minimize network overhead.
 *
 * Designed to be offline-safe: if the network is unreachable, returns a
 * graceful fallback rather than throwing an unhandled rejection.
 */
export class HealthVerifier {
  private fetchFn: FetchFunction;
  private cacheTtlMs: number;
  private timeoutMs: number;
  private cache = new Map<string, CachedHealth>();

  constructor(options?: HealthVerifierOptions) {
    this.fetchFn = options?.fetchFn ?? globalThis.fetch;
    this.cacheTtlMs = options?.cacheTtlMs ?? 24 * 60 * 60 * 1000; // 24 hours
    this.timeoutMs = options?.timeoutMs ?? 2000;
  }

  /**
   * Check the health of a package by querying the npm registry.
   * Returns cached result if available and within TTL.
   */
  public async checkPackage(packageName: string): Promise<PackageHealth> {
    const normalizedName = packageName.toLowerCase().trim();

    // 1. Check cache
    const cached = this.cache.get(normalizedName);
    if (cached && Date.now() - cached.cachedAt < this.cacheTtlMs) {
      return cached.health;
    }

    // 2. Query npm registry
    try {
      const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(normalizedName)}`;
      const response = await this.fetchFn(registryUrl, {
        signal: AbortSignal.timeout(this.timeoutMs),
        headers: { Accept: 'application/json' },
      });

      if (response.status === 404) {
        const health: PackageHealth = {
          packageExists: false,
          cachedAt: Date.now(),
        };
        this.cacheResult(normalizedName, health);
        return health;
      }

      if (!response.ok) {
        // Non-404 error — return graceful fallback
        return this.offlineFallback(normalizedName);
      }

      const data = (await response.json()) as NpmRegistryResponse;
      const health = this.parseRegistryResponse(data);
      this.cacheResult(normalizedName, health);

      // 3. Optionally fetch download counts (fire-and-forget enhancement)
      this.fetchDownloads(normalizedName, health).catch(() => {
        /* ignore download fetch failures */
      });

      return health;
    } catch {
      // Network error, timeout, or AbortError — return offline fallback
      return this.offlineFallback(normalizedName);
    }
  }

  /**
   * Get cache statistics (for diagnostics/debugging).
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Clear the entire health cache.
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Parse the npm registry response to extract health signals.
   */
  private parseRegistryResponse(data: NpmRegistryResponse): PackageHealth {
    const now = Date.now();
    const deprecated = data.deprecated || false;

    // Determine last publish date
    let lastPublished: string | undefined;
    let lastPublishedDate: Date | undefined;

    if (data.time?.modified) {
      lastPublished = data.time.modified;
      lastPublishedDate = new Date(data.time.modified);
    } else if (data['dist-tags']?.latest && data.time) {
      const latestVersion = data['dist-tags'].latest;
      const latestTime = data.time[latestVersion];
      if (latestTime) {
        lastPublished = latestTime;
        lastPublishedDate = new Date(latestTime);
      }
    }

    // Calculate age in years
    let healthVerdict: PackageHealth['healthVerdict'] = 'healthy';
    if (deprecated) {
      healthVerdict = 'abandoned';
    } else if (lastPublishedDate) {
      const ageMs = now - lastPublishedDate.getTime();
      const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
      if (ageYears > 3) {
        healthVerdict = 'abandoned';
      } else if (ageYears > 1.5) {
        healthVerdict = 'aging';
      }
    }

    return {
      packageExists: true,
      lastPublished,
      healthVerdict,
      cachedAt: now,
    };
  }

  /**
   * Fetch weekly download count from npm's downloads API.
   * Updates the cached health entry if available.
   */
  private async fetchDownloads(
    packageName: string,
    health: PackageHealth
  ): Promise<void> {
    try {
      const url = `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`;
      const response = await this.fetchFn(url, {
        signal: AbortSignal.timeout(this.timeoutMs),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = (await response.json()) as { downloads?: number };
        if (typeof data.downloads === 'number') {
          health.weeklyDownloads = data.downloads;
          // Re-cache with updated download count
          this.cacheResult(packageName, health);
        }
      }
    } catch {
      // Silently ignore download fetch failures
    }
  }

  /**
   * Return a safe offline fallback when the network is unreachable.
   * Assumes the package exists but health is unverified.
   */
  private offlineFallback(packageName: string): PackageHealth {
    // Check if we have a stale cache entry
    const stale = this.cache.get(packageName);
    if (stale) {
      return stale.health;
    }

    return {
      packageExists: true,
      cachedAt: Date.now(),
    };
  }

  private cacheResult(packageName: string, health: PackageHealth): void {
    this.cache.set(packageName, {
      health,
      cachedAt: Date.now(),
    });
  }
}

/**
 * Minimal type definitions for the npm registry JSON response.
 * Only the fields we actually parse are included.
 */
interface NpmRegistryResponse {
  name?: string;
  deprecated?: boolean;
  'dist-tags'?: {
    latest?: string;
  };
  time?: {
    modified?: string;
    [version: string]: string | undefined;
  };
}
