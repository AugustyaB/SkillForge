import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('vscode', () => {
  class TreeItem {
    id?: string;
    description?: string;
    tooltip?: string;
    iconPath?: any;
    command?: any;
    contextValue?: string;
    constructor(public label: string, public collapsibleState?: number) {}
  }

  return {
    EventEmitter: class {
      event = vi.fn();
      fire = vi.fn();
    },
    TreeItem,
    TreeItemCollapsibleState: {
      None: 0,
      Collapsed: 1,
      Expanded: 2,
    },
    ThemeIcon: class {
      constructor(public id: string) {}
    },
  };
});

import type * as vscode from 'vscode';
import { BookmarkManager } from '../bookmarks/bookmark-manager.js';
import { BookmarksTreeProvider } from '../views/bookmarks-tree-provider.js';

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
}

describe('BookmarksTreeProvider', () => {
  let memento: MockMemento;
  let bookmarkManager: BookmarkManager;
  let provider: BookmarksTreeProvider;

  beforeEach(() => {
    memento = new MockMemento();
    bookmarkManager = new BookmarkManager(memento);
    provider = new BookmarksTreeProvider(bookmarkManager);
  });

  it('renders placeholder item when no bookmarks are saved', async () => {
    const rootItems = await provider.getChildren();
    expect(rootItems).toHaveLength(1);
    expect(rootItems![0]?.id).toBe('bookmarks-empty');
    expect(rootItems![0]?.contextValue).toBe('bookmarkEmpty');
  });

  it('renders category groups with nested skill items when bookmarks exist', async () => {
    await bookmarkManager.addBookmark({
      id: 'fastify',
      name: 'Fastify',
      category: 'backend-framework',
      difficulty: 'intermediate',
      whyUseIt: 'High performance',
      officialUrl: 'https://fastify.dev',
      ecosystem: 'javascript',
      tags: ['backend'],
      stackIndicators: ['fastify'],
      timestamp: Date.now(),
    });

    await bookmarkManager.addBookmark({
      id: 'express',
      name: 'Express',
      category: 'backend-framework',
      difficulty: 'beginner',
      whyUseIt: 'Huge ecosystem',
      officialUrl: 'https://expressjs.com',
      ecosystem: 'javascript',
      tags: ['backend'],
      stackIndicators: ['express'],
      timestamp: Date.now() + 10,
    });

    await bookmarkManager.addBookmark({
      id: 'zod',
      name: 'Zod',
      category: 'utility',
      difficulty: 'beginner',
      whyUseIt: 'Schema declaration',
      officialUrl: 'https://zod.dev',
      ecosystem: 'typescript',
      tags: ['validation'],
      stackIndicators: ['zod'],
      timestamp: Date.now() + 20,
    });

    // Root items should be Category folders
    const rootItems = await provider.getChildren();
    expect(rootItems).toHaveLength(2); // 'backend-framework' and 'utility'

    const backendGroup = rootItems!.find((i) => i.id === 'bookmark-cat-backend-framework');
    expect(backendGroup).toBeDefined();
    expect(backendGroup?.label).toContain('Backend Framework');
    expect(backendGroup?.children).toHaveLength(2);

    const utilityGroup = rootItems!.find((i) => i.id === 'bookmark-cat-utility');
    expect(utilityGroup).toBeDefined();
    expect(utilityGroup?.children).toHaveLength(1);
    expect(utilityGroup?.children![0]?.label).toBe('Zod');
  });

  it('converts element to vscode.TreeItem with proper command and icon', async () => {
    await bookmarkManager.addBookmark({
      id: 'prisma',
      name: 'Prisma ORM',
      category: 'database',
      difficulty: 'intermediate',
      whyUseIt: 'Type-safe database client',
      officialUrl: 'https://prisma.io',
      ecosystem: 'typescript',
      tags: ['database', 'orm'],
      stackIndicators: ['prisma'],
      timestamp: Date.now(),
    });

    const rootItems = await provider.getChildren();
    const dbGroup = rootItems![0];
    const skillItem = dbGroup?.children![0]!;

    const treeItem = provider.getTreeItem(skillItem);
    expect(treeItem.label).toBe('Prisma ORM');
    expect(treeItem.command?.command).toBe('skillforge.suggest');
  });
});
