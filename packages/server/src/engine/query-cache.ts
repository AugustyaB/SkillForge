import * as crypto from 'node:crypto';
import type { SkillSuggestionResult } from '@skillforge/shared';

export interface CacheEntry {
  result: SkillSuggestionResult;
  expiresAt: number;
}

export class QueryCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTtlMs: number;
  private readonly maxEntries: number;

  constructor(defaultTtlMs = 10 * 60 * 1000, maxEntries = 500) {
    this.defaultTtlMs = defaultTtlMs;
    this.maxEntries = maxEntries;
  }

  /**
   * Generates a deterministic SHA-256 cache key from query and context
   */
  public generateKey(
    intent: string,
    scopePaths: string[] = [],
    installed: string[] = [],
    difficulty = 'all'
  ): string {
    const sortedPaths = [...scopePaths].sort().join(';');
    const sortedInstalled = [...installed].sort().join(';');
    const payload = `${intent.trim().toLowerCase()}|${sortedPaths}|${sortedInstalled}|${difficulty}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  public get(key: string): SkillSuggestionResult | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.result;
  }

  public set(key: string, result: SkillSuggestionResult, ttlMs?: number): void {
    // Evict oldest if capacity exceeded
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.cache.set(key, { result, expiresAt });
  }

  public clear(): void {
    this.cache.clear();
  }

  public get size(): number {
    return this.cache.size;
  }
}
