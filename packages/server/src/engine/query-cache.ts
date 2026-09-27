import * as crypto from 'node:crypto';
import type { SkillSuggestionResult } from '@skillforge/shared';

export interface CacheEntry {
  result: SkillSuggestionResult;
  expiresAt: number;
}

export interface CacheKeyParams {
  intent: string;
  scopePaths?: string[];
  installed?: string[];
  difficulty?: string;
  ecosystem?: string;
  activeSignals?: string[];
  maxResults?: number;
  minTrustTier?: string;
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
   * Generates a deterministic SHA-256 cache key from query, options, and context (BUG-04)
   */
  public generateKey(
    intentOrParams: string | CacheKeyParams,
    scopePaths: string[] = [],
    installed: string[] = [],
    difficulty = 'all'
  ): string {
    if (typeof intentOrParams === 'object' && intentOrParams !== null) {
      const p = intentOrParams;
      const sortedPaths = [...(p.scopePaths || [])].sort().join(';');
      const sortedInstalled = [...(p.installed || [])].sort().join(';');
      const sortedSignals = [...(p.activeSignals || [])].sort().join(';');
      const payload = JSON.stringify({
        intent: (p.intent || '').trim().toLowerCase(),
        paths: sortedPaths,
        installed: sortedInstalled,
        difficulty: p.difficulty || 'all',
        ecosystem: p.ecosystem || '',
        signals: sortedSignals,
        maxResults: p.maxResults ?? 5,
        minTrustTier: p.minTrustTier || '',
      });
      return crypto.createHash('sha256').update(payload).digest('hex');
    }

    const sortedPaths = [...scopePaths].sort().join(';');
    const sortedInstalled = [...installed].sort().join(';');
    const payload = `${(intentOrParams || '').trim().toLowerCase()}|${sortedPaths}|${sortedInstalled}|${difficulty}`;
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
