import { describe, it, expect, beforeEach } from 'vitest';
import type * as vscode from 'vscode';
import { BookmarkManager } from '../bookmarks/bookmark-manager.js';

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

describe('BookmarkManager', () => {
  let memento: MockMemento;
  let manager: BookmarkManager;

  const sampleSkill1 = {
    id: 'fastify',
    name: 'Fastify',
    category: 'backend-framework' as const,
    difficulty: 'intermediate' as const,
    description: 'Fast web framework',
    whyUseIt: 'High throughput and schema validation',
    officialUrl: 'https://fastify.dev',
    tags: ['fastify', 'backend'],
    stackIndicators: ['fastify'],
    ecosystem: 'javascript',
    learnResources: [{ label: 'Docs', url: 'https://fastify.dev' }],
    alternatives: ['express'],
    worksWellWith: ['pino'],
    prerequisites: [],
  };

  const sampleSkill2 = {
    id: 'zod',
    name: 'Zod',
    category: 'utility' as const,
    difficulty: 'beginner' as const,
    description: 'TypeScript schema declaration',
    whyUseIt: 'Static type inference',
    officialUrl: 'https://zod.dev',
    tags: ['validation'],
    stackIndicators: ['zod'],
    ecosystem: 'typescript',
    learnResources: [{ label: 'Docs', url: 'https://zod.dev' }],
    alternatives: ['valibot'],
    worksWellWith: ['react-hook-form'],
    prerequisites: [],
  };

  beforeEach(() => {
    memento = new MockMemento();
    manager = new BookmarkManager(memento);
  });

  describe('Core Bookmarking Operations', () => {
    it('adds and retrieves bookmarks sorted by timestamp descending', async () => {
      await manager.addBookmark(sampleSkill1);
      await manager.addBookmark(sampleSkill2);

      const bookmarks = manager.getBookmarks();
      expect(bookmarks).toHaveLength(2);
      expect(bookmarks[0]?.id).toBe('zod'); // Latest first
      expect(bookmarks[1]?.id).toBe('fastify');
    });

    it('identifies bookmarked status case-insensitively', async () => {
      await manager.addBookmark(sampleSkill1);
      expect(manager.isBookmarked('fastify')).toBe(true);
      expect(manager.isBookmarked('FASTIFY')).toBe(true);
      expect(manager.isBookmarked('FaStIfY')).toBe(true);
      expect(manager.isBookmarked('express')).toBe(false);
    });

    it('updates existing bookmark notes without creating duplicate', async () => {
      await manager.addBookmark(sampleSkill1, 'Initial note');
      expect(manager.getBookmarks()).toHaveLength(1);
      expect(manager.getBookmarks()[0]?.notes).toBe('Initial note');

      await manager.addBookmark(sampleSkill1, 'Updated note');
      const bookmarks = manager.getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0]?.notes).toBe('Updated note');
    });

    it('removes bookmark by ID', async () => {
      await manager.addBookmark(sampleSkill1);
      await manager.addBookmark(sampleSkill2);

      const removed = await manager.removeBookmark('FASTIFY');
      expect(removed).toBe(true);
      expect(manager.isBookmarked('fastify')).toBe(false);
      expect(manager.getBookmarks()).toHaveLength(1);

      // Removing non-existent item returns false
      expect(await manager.removeBookmark('unknown-pkg')).toBe(false);
    });

    it('toggles bookmark state on successive calls', async () => {
      // Toggle ON
      const state1 = await manager.toggleBookmark(sampleSkill1);
      expect(state1).toBe(true);
      expect(manager.isBookmarked('fastify')).toBe(true);

      // Toggle OFF
      const state2 = await manager.toggleBookmark(sampleSkill1);
      expect(state2).toBe(false);
      expect(manager.isBookmarked('fastify')).toBe(false);
    });

    it('clears all bookmarks', async () => {
      await manager.addBookmark(sampleSkill1);
      await manager.addBookmark(sampleSkill2);
      expect(manager.getBookmarks()).toHaveLength(2);

      await manager.clearBookmarks();
      expect(manager.getBookmarks()).toHaveLength(0);
    });
  });

  describe('Categorization & Grouping', () => {
    it('groups bookmarks by category and ecosystem', async () => {
      await manager.addBookmark(sampleSkill1); // backend-framework, javascript
      await manager.addBookmark(sampleSkill2); // utility, typescript

      const byCat = manager.getBookmarksByCategory();
      expect(byCat.get('backend-framework')).toHaveLength(1);
      expect(byCat.get('utility')).toHaveLength(1);

      const byEco = manager.getBookmarksByEcosystem();
      expect(byEco.get('javascript')).toHaveLength(1);
      expect(byEco.get('typescript')).toHaveLength(1);
    });
  });

  describe('Hostile Storage & Dirty Inputs (Anti-Happy-Path)', () => {
    it('handles regex special characters and unusual package names (e.g. c++, c#)', async () => {
      const hostileSkill = {
        ...sampleSkill1,
        id: 'c++',
        name: 'C++ Modern Core',
        ecosystem: 'cpp',
      };

      await manager.addBookmark(hostileSkill);
      expect(manager.isBookmarked('c++')).toBe(true);

      const removed = await manager.removeBookmark('c++');
      expect(removed).toBe(true);
      expect(manager.isBookmarked('c++')).toBe(false);
    });

    it('gracefully recovers from corrupted / hostile memento values without crashing', () => {
      memento.setRaw(BookmarkManager.STORAGE_KEY, 'corrupted_string');
      expect(manager.getBookmarks()).toEqual([]);
      expect(manager.isBookmarked('fastify')).toBe(false);

      memento.setRaw(BookmarkManager.STORAGE_KEY, { invalid: 'object' });
      expect(manager.getBookmarks()).toEqual([]);

      memento.setRaw(BookmarkManager.STORAGE_KEY, null);
      expect(manager.getBookmarks()).toEqual([]);
    });

    it('skips invalid items in storage array while keeping valid ones intact', () => {
      memento.setRaw(BookmarkManager.STORAGE_KEY, [
        { id: 'valid', name: 'Valid', category: 'utility', difficulty: 'beginner', ecosystem: 'multi', whyUseIt: 'Good', officialUrl: 'https://valid.dev', timestamp: 100 },
        { id: 'broken_missing_fields' },
        null,
        12345,
        'random_string',
      ]);

      const bookmarks = manager.getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0]?.id).toBe('valid');
    });
  });
});
