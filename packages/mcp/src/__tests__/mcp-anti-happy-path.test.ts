import { describe, it, expect } from 'vitest';
import {
  AgentSkillGenerator,
  ComparisonEngine,
  SkillsRepository,
  SuggestionEngine,
  WorkspaceScanner,
} from '@skillforge/server';
import { handleSuggestTool } from '../tools/suggest-tool.js';
import { handleCompareTool } from '../tools/compare-tool.js';
import { handleRulesTool } from '../tools/rules-tool.js';
import { handleCatalogTool } from '../tools/catalog-tool.js';

describe('SkillForge MCP Server Anti-Happy-Path & Adversarial Resilience', () => {
  const repository = new SkillsRepository();
  const suggestionEngine = new SuggestionEngine({ repository });
  const comparisonEngine = new ComparisonEngine({ repository });
  const agentSkillGenerator = new AgentSkillGenerator(repository);
  const workspaceScanner = new WorkspaceScanner();

  describe('skillforge_suggest (Dirty & Hostile Inputs)', () => {
    it('handles regex characters, quantifiers, and C++ symbols without crashing', async () => {
      const inputs = [
        'c++',
        'c#',
        '(foo)+',
        '[a-z]*',
        '\\bword\\b',
        '${evilInjection}',
        '__proto__',
        'constructor',
      ];

      for (const input of inputs) {
        const res = await handleSuggestTool({ intent: input }, suggestionEngine, workspaceScanner);
        expect(typeof res).toBe('string');
        expect(res.length).toBeGreaterThan(0);
      }
    });

    it('gracefully handles extremely long intent strings', async () => {
      const longIntent = 'state management '.repeat(200);
      const res = await handleSuggestTool({ intent: longIntent }, suggestionEngine, workspaceScanner);
      expect(typeof res).toBe('string');
      expect(res).toContain('### SkillForge Recommended Libraries');
    });

    it('rejects empty or whitespace-only intents with a helpful guide', async () => {
      const emptyRes = await handleSuggestTool({ intent: '' }, suggestionEngine, workspaceScanner);
      expect(emptyRes).toContain('Please provide a non-empty `intent`');

      const whitespaceRes = await handleSuggestTool({ intent: '   \t\n   ' }, suggestionEngine, workspaceScanner);
      expect(whitespaceRes).toContain('Please provide a non-empty `intent`');
    });
  });

  describe('skillforge_compare (Partial & Uncataloged Comparisons)', () => {
    it('compares catalog library against uncataloged alternative (Pinia vs Vuex)', async () => {
      const res = await handleCompareTool(
        { skillIds: ['pinia', 'vuex'] },
        comparisonEngine,
        workspaceScanner
      );

      // Must succeed with a Markdown table, NOT a false "not found" message
      expect(res).toContain('### SkillForge Side-by-Side Comparison: Pinia vs Vuex');
      expect(res).toContain('| **Category** | `state-management` | `state-management` |');
      expect(res).toContain('✅ Verified');
      expect(res).toContain('💡 Suggested');
      expect(res).toContain('Architectural Conflict Warning');
    });

    it('compares catalog library against multiple uncataloged alternatives (Zod vs Yup)', async () => {
      const res = await handleCompareTool(
        { skillIds: ['zod', 'yup'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('Side-by-Side Comparison: Zod vs Yup');
      expect(res).toContain('| **Category** |');
    });

    it('reports clean guidance when neither library is known or related', async () => {
      const res = await handleCompareTool(
        { skillIds: ['unknown_tool_alpha', 'unknown_tool_beta'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('None of the requested libraries (unknown_tool_alpha, unknown_tool_beta) were found in the curated catalog or among direct alternatives.');
    });

    it('handles duplicate ID inputs gracefully', async () => {
      const res = await handleCompareTool(
        { skillIds: ['fastapi', 'fastapi'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('Comparison requires at least 2 distinct skills');
    });
  });

  describe('skillforge_create_rules (Path Traversal & Scoped Packages)', () => {
    it('sanitizes directory traversal attempts in suggestedFilePath', () => {
      const res = handleRulesTool(
        { skillId: '../../../etc/shadow', format: 'agent-skill' },
        agentSkillGenerator
      );

      expect(res).toContain('- **Suggested File Path**: `.agent/skills/etc-shadow/SKILL.md`');
      expect(res).not.toContain('.agent/skills/../');
      expect(res).not.toContain('.agent/skills/..\\');
    });

    it('sanitizes scoped packages without creating nested subdirectories in suggestedFilePath', () => {
      const res = handleRulesTool(
        { skillId: '@modelcontextprotocol/sdk', format: 'agent-skill' },
        agentSkillGenerator
      );

      expect(res).toContain('- **Suggested File Path**: `.agent/skills/modelcontextprotocol-sdk/SKILL.md`');
      expect(res).not.toContain('.agent/skills/@');
    });

    it('rejects empty or whitespace skillId', () => {
      const res = handleRulesTool({ skillId: '   ' }, agentSkillGenerator);
      expect(res).toContain('Please provide a valid `skillId`');
    });
  });

  describe('skillforge_get_catalog (Boundary Conditions)', () => {
    it('clamps limit correctly', () => {
      const res = handleCatalogTool({ limit: 1 }, repository);
      const items = res.split('\n').filter((l) => l.startsWith('- **'));
      expect(items.length).toBe(1);
    });

    it('handles unknown category gracefully', () => {
      const res = handleCatalogTool({ category: 'nonexistent-cat' }, repository);
      expect(res).toContain('0 of 0 matching tools');
    });

    it('handles unknown ecosystem gracefully', () => {
      const res = handleCatalogTool({ ecosystem: 'brainfuck' }, repository);
      expect(res).toContain('0 of 0 matching tools');
    });
  });
});

