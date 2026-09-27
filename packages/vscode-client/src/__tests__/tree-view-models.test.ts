import { describe, it, expect } from 'vitest';
import {
  buildContextTreeItems,
  buildQuickActionItems,
  buildRecentQueriesItems,
  type RecentQueryEntry,
} from '../views/tree-view-models.js';

describe('TreeViewModels', () => {
  describe('buildContextTreeItems', () => {
    it('builds context items for root workspace with no installed packages', () => {
      const items = buildContextTreeItems({
        scopeLabel: 'Entire Workspace',
        scopeRelativePath: '',
        scopeAbsolutePath: '/workspace/project',
        isRoot: true,
      });

      expect(items).toHaveLength(3);

      // 1. Scope selector
      expect(items[0]!.id).toBe('scope-selector');
      expect(items[0]!.label).toBe('Scope: Entire Workspace');
      expect(items[0]!.iconId).toBe('root-folder');
      expect(items[0]!.commandId).toBe('skillforge.selectScope');

      // 2. Ecosystem indicator
      expect(items[1]!.id).toBe('ecosystem-indicator');
      expect(items[1]!.label).toBe('Ecosystem: Auto-detecting...');
      expect(items[1]!.description).toBe('Multi-stack');

      // 3. Empty stack indicator
      expect(items[2]!.id).toBe('detected-stack-empty');
      expect(items[2]!.label).toBe('No packages detected');
    });

    it('builds context items for subfolder scope with detected packages and versions', () => {
      const items = buildContextTreeItems({
        scopeLabel: 'server',
        scopeRelativePath: 'packages/server',
        scopeAbsolutePath: '/workspace/project/packages/server',
        isRoot: false,
        ecosystem: 'javascript',
        installedPackages: [
          { name: 'fastify', version: '^4.20.0', ecosystem: 'javascript' },
          { name: 'zod', ecosystem: 'javascript' },
        ],
      });

      expect(items).toHaveLength(3);

      // Scope selector
      expect(items[0]!.label).toBe('Scope: server');
      expect(items[0]!.iconId).toBe('folder');

      // Ecosystem indicator
      expect(items[1]!.label).toBe('Ecosystem: Javascript');
      expect(items[1]!.description).toBeUndefined();

      // Stack group with children
      const stackGroup = items[2]!;
      expect(stackGroup.id).toBe('detected-stack-group');
      expect(stackGroup.label).toBe('Detected Stack (2 tools)');
      expect(stackGroup.children).toHaveLength(2);
      expect(stackGroup.children![0]!.label).toBe('fastify');
      expect(stackGroup.children![0]!.description).toBe('^4.20.0');
      expect(stackGroup.children![1]!.label).toBe('zod');
      expect(stackGroup.children![1]!.description).toBeUndefined();
    });

    it('handles hostile inputs gracefully (null/undefined fields, weird chars)', () => {
      const items = buildContextTreeItems({
        scopeLabel: 'c++ / <hostile>',
        scopeRelativePath: '',
        scopeAbsolutePath: '',
        isRoot: false,
        ecosystem: undefined,
        installedPackages: undefined,
      });

      expect(items).toHaveLength(3);
      expect(items[0]!.label).toBe('Scope: c++ / <hostile>');
      expect(items[1]!.label).toBe('Ecosystem: Auto-detecting...');
      expect(items[2]!.id).toBe('detected-stack-empty');
    });
  });

  describe('buildQuickActionItems', () => {
    it('returns standard quick action items with correct commands and icons', () => {
      const items = buildQuickActionItems();
      expect(items).toHaveLength(3);

      const commandIds = items.map((i) => i.commandId);
      expect(commandIds).toEqual([
        'skillforge.suggestForCurrentFile',
        'skillforge.suggest',
        'skillforge.rescanWorkspace',
      ]);

      const icons = items.map((i) => i.iconId);
      expect(icons).toEqual(['sparkle', 'search', 'refresh']);
    });
  });

  describe('buildRecentQueriesItems', () => {
    it('returns empty placeholder when queries array is empty or undefined', () => {
      const emptyItems = buildRecentQueriesItems([]);
      expect(emptyItems).toHaveLength(1);
      expect(emptyItems[0]!.id).toBe('recent-empty');
      expect(emptyItems[0]!.label).toBe('No recent discoveries yet');

      const nullItems = buildRecentQueriesItems(null as unknown as RecentQueryEntry[]);
      expect(nullItems).toHaveLength(1);
      expect(nullItems[0]!.id).toBe('recent-empty');
    });

    it('renders list of recent queries up to 10 items with suggest replay command', () => {
      const queries: RecentQueryEntry[] = Array.from({ length: 15 }, (_, i) => ({
        intent: `Query ${i + 1}`,
        timestamp: Date.now() - i * 1000,
        resultCount: i + 1,
      }));

      const items = buildRecentQueriesItems(queries);
      // Capped at 10 items
      expect(items).toHaveLength(10);
      expect(items[0]!.label).toBe('Query 1');
      expect(items[0]!.description).toBe('1 tools');
      expect(items[0]!.commandId).toBe('skillforge.suggest');
      expect(items[0]!.commandArgs).toEqual([{ intent: 'Query 1' }]);
    });

    it('handles hostile queries with special regex characters and missing result count', () => {
      const hostile: RecentQueryEntry[] = [
        { intent: 'c++ regex /.*test/g', timestamp: Date.now() },
        { intent: '   ', timestamp: Date.now(), resultCount: 0 },
      ];

      const items = buildRecentQueriesItems(hostile);
      expect(items).toHaveLength(2);
      expect(items[0]!.label).toBe('c++ regex /.*test/g');
      expect(items[0]!.description).toBeUndefined();
      expect(items[1]!.description).toBe('0 tools');
    });
  });
});
