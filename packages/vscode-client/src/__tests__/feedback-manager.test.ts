import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as vscode from 'vscode';
import { FeedbackManager } from '../feedback/feedback-manager.js';

class MockMemento implements vscode.Memento {
  private storage = new Map<string, any>();

  get<T>(key: string, defaultValue?: T): T {
    if (this.storage.has(key)) {
      return this.storage.get(key);
    }
    return defaultValue as T;
  }

  update(key: string, value: any): Thenable<void> {
    if (value === undefined) {
      this.storage.delete(key);
    } else {
      this.storage.set(key, value);
    }
    return Promise.resolve();
  }

  keys(): readonly string[] {
    return Array.from(this.storage.keys());
  }

  setRaw(key: string, val: any): void {
    this.storage.set(key, val);
  }
}

describe('FeedbackManager', () => {
  let memento: MockMemento;
  let manager: FeedbackManager;

  beforeEach(() => {
    memento = new MockMemento();
    manager = new FeedbackManager(memento);
  });

  describe('Cadence & Frequency Controls', () => {
    it('prompts every 5 queries under normal operation', async () => {
      expect(await manager.registerQuery(false)).toBe(false); // 1
      expect(await manager.registerQuery(false)).toBe(false); // 2
      expect(await manager.registerQuery(false)).toBe(false); // 3
      expect(await manager.registerQuery(false)).toBe(false); // 4
      expect(await manager.registerQuery(false)).toBe(true);  // 5 -> prompt!

      expect(await manager.registerQuery(false)).toBe(false); // 6
      expect(await manager.registerQuery(false)).toBe(false); // 7
      expect(await manager.registerQuery(false)).toBe(false); // 8
      expect(await manager.registerQuery(false)).toBe(false); // 9
      expect(await manager.registerQuery(false)).toBe(true);  // 10 -> prompt!
    });

    it('always prompts when fallback cascade is used', async () => {
      expect(await manager.registerQuery(false)).toBe(false); // 1
      expect(await manager.registerQuery(true)).toBe(true);   // 2 (fallback) -> prompt!
      expect(await manager.registerQuery(false)).toBe(false); // 3
    });

    it('suppresses prompt during 24-hour cooldown after rating submission', async () => {
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);

      // Register 5 queries -> prompt shows
      for (let i = 0; i < 4; i++) {
        await manager.registerQuery(false);
      }
      expect(await manager.registerQuery(false)).toBe(true);

      // Submit feedback (helpful)
      await manager.recordFeedback({
        query: 'react state management',
        rating: 'helpful',
        timestamp: now,
      });

      // Query 5 more times within cooldown -> should NOT prompt
      for (let i = 0; i < 4; i++) {
        await manager.registerQuery(false);
      }
      expect(await manager.registerQuery(false)).toBe(false);

      // Even a fallback query within cooldown should NOT prompt
      expect(await manager.registerQuery(true)).toBe(false);

      vi.restoreAllMocks();
    });

    it('resumes prompt cadence after 24 hours have elapsed', async () => {
      const start = 1700000000000;
      vi.spyOn(Date, 'now').mockReturnValue(start);

      // Submit feedback
      await manager.recordFeedback({
        query: 'zustand stores',
        rating: 'helpful',
        timestamp: start,
      });

      // Fast forward 24 hours + 1 minute
      const afterCooldown = start + FeedbackManager.COOLDOWN_MS + 60000;
      vi.spyOn(Date, 'now').mockReturnValue(afterCooldown);

      // Fallback query now prompts
      expect(manager.shouldShowFeedback(true)).toBe(true);

      // Normal cadence resumes
      for (let i = 0; i < 4; i++) {
        await manager.registerQuery(false);
      }
      expect(await manager.registerQuery(false)).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe('Zero-Friction Dislike Flow & History Storage', () => {
    it('records 1-click "other" dislike feedback without mandatory text', async () => {
      await manager.recordFeedback({
        query: 'web scraping',
        skillId: 'cheerio',
        rating: 'unhelpful',
        reason: 'other',
        timestamp: 1700000000000,
      });

      const history = manager.getFeedbackHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual({
        query: 'web scraping',
        skillId: 'cheerio',
        rating: 'unhelpful',
        reason: 'other',
        timestamp: 1700000000000,
      });
    });

    it('records unhelpful feedback with optional elaboration if provided', async () => {
      await manager.recordFeedback({
        query: 'modern http server',
        skillId: 'express',
        rating: 'unhelpful',
        reason: 'outdated',
        details: 'Prefer Hono or Fastify in 2026',
        timestamp: 1700000005000,
      });

      const history = manager.getFeedbackHistory();
      expect(history).toHaveLength(1);
      expect(history[0]?.details).toBe('Prefer Hono or Fastify in 2026');
      expect(history[0]?.reason).toBe('outdated');
    });

    it('records skill contribution requests', async () => {
      await manager.recordSkillRequest({
        skillName: 'effect-ts',
        reason: 'Robust functional effect system for TypeScript',
        timestamp: 1700000010000,
      });

      const requests = manager.getSkillRequests();
      expect(requests).toHaveLength(1);
      expect(requests[0]?.skillName).toBe('effect-ts');
      expect(requests[0]?.reason).toBe('Robust functional effect system for TypeScript');
    });

    it('clears state on clear()', async () => {
      await manager.recordFeedback({
        query: 'orm',
        rating: 'helpful',
        timestamp: Date.now(),
      });
      expect(manager.getFeedbackHistory()).toHaveLength(1);

      await manager.clear();
      expect(manager.getFeedbackHistory()).toHaveLength(0);
    });
  });

  describe('URL Encoding & Hostile / Dirty Inputs (Anti-Happy-Path)', () => {
    it('properly encodes GitHub issue URLs with special symbols (e.g. c++, &)', () => {
      const url = manager.generateSkillRequestIssueUrl(
        'c++ & asio tools',
        'Need boost/asio & c++20 networking'
      );

      expect(url).toContain('https://github.com/skillforge/skillforge/issues/new');
      expect(url).toContain('title=%5BSkill%20Request%5D%3A%20c%2B%2B%20%26%20asio%20tools');
      expect(url).toContain('labels=skill-request');
      expect(url).toContain('boost%2Fasio%20%26%20c%2B%2B20%20networking');
    });

    it('trims whitespace and handles missing reason gracefully', () => {
      const url = manager.generateSkillRequestIssueUrl('   polars   ');
      expect(url).toContain('title=%5BSkill%20Request%5D%3A%20polars');
      expect(url).toContain('Widely%20adopted%20tool%20in%20modern%20development.');
    });

    it('handles corrupted memento state gracefully without throwing', async () => {
      // Simulate corrupted / hostile non-object or wrong-type memento state
      memento.setRaw(FeedbackManager.STORAGE_KEY, {
        queryCount: 'corrupted_string',
        lastFeedbackTimestamp: null,
        feedbackHistory: 'not an array',
        skillRequests: 12345,
      });

      // Should sanitize gracefully to default zero state
      expect(manager.shouldShowFeedback(false)).toBe(false);
      expect(manager.getFeedbackHistory()).toEqual([]);
      expect(manager.getSkillRequests()).toEqual([]);

      // Next query increments cleanly from 0 -> 1
      await manager.registerQuery(false);
      expect(memento.get<any>(FeedbackManager.STORAGE_KEY).queryCount).toBe(1);
    });
  });
});
