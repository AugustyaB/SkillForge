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
import { createSkillForgeMcpServer } from '../server.js';

describe('SkillForge MCP Server', () => {
  const repository = new SkillsRepository();
  const suggestionEngine = new SuggestionEngine({ repository });
  const comparisonEngine = new ComparisonEngine({ repository });
  const agentSkillGenerator = new AgentSkillGenerator(repository);
  const workspaceScanner = new WorkspaceScanner();

  describe('Server Initialization', () => {
    it('creates an McpServer instance with registered skillforge tools', () => {
      const server = createSkillForgeMcpServer();
      expect(server).toBeDefined();
    });
  });

  describe('Tool: skillforge_suggest (Anti-Happy-Path & Reliability)', () => {
    it('returns ranked skills with trust tier badges and install commands', async () => {
      const res = await handleSuggestTool(
        { intent: 'state management for react' },
        suggestionEngine,
        workspaceScanner
      );

      expect(res).toContain('### SkillForge Recommended Libraries');
      expect(res).toContain('Verified');
      expect(res).toContain('npm install');
      expect(res.toLowerCase()).toContain('state-management');
    });

    it('handles dirty/hostile inputs gracefully (c++, regex, punctuation)', async () => {
      const hostileQueries = [
        'c++ template metaprogramming',
        'regex /.*test/g',
        '   whitespace query   ',
        '???!!!',
      ];

      for (const q of hostileQueries) {
        const res = await handleSuggestTool({ intent: q }, suggestionEngine, workspaceScanner);
        expect(typeof res).toBe('string');
        expect(res.length).toBeGreaterThan(0);
      }
    });

    it('rejects empty/null intent with descriptive prompt', async () => {
      const emptyRes = await handleSuggestTool({ intent: '' }, suggestionEngine, workspaceScanner);
      expect(emptyRes).toContain('Please provide a non-empty `intent`');

      const whitespaceRes = await handleSuggestTool({ intent: '    ' }, suggestionEngine, workspaceScanner);
      expect(whitespaceRes).toContain('Please provide a non-empty `intent`');
    });

    it('filters recommendations by target ecosystem', async () => {
      const res = await handleSuggestTool(
        { intent: 'web api server', ecosystem: 'python' },
        suggestionEngine,
        workspaceScanner
      );

      expect(res).toContain('FastAPI');
      expect(res).toContain('pip install');
      expect(res).not.toContain('Express');
    });

    it('handles non-existent or invalid workspace paths gracefully', async () => {
      const res = await handleSuggestTool(
        { intent: 'state management', workspacePath: '/path/does/not/exist/999' },
        suggestionEngine,
        workspaceScanner
      );

      expect(res).toContain('Zustand');
    });
  });

  describe('Tool: skillforge_compare (Conflict Detection & Tradeoffs)', () => {
    it('generates a comparison matrix table for valid library pairs', async () => {
      const res = await handleCompareTool(
        { skillIds: ['fastapi', 'django'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('Side-by-Side Comparison');
      expect(res).toContain('FastAPI');
      expect(res).toContain('Django');
      expect(res).toContain('| Dimension |');
    });

    it('flags architectural conflicts between competing tools (e.g. Express vs Fastify)', async () => {
      const res = await handleCompareTool(
        { skillIds: ['express', 'fastify'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('Conflict Warning');
    });

    it('rejects out-of-bounds argument counts (<2 or >3) (Anti-Happy-Path)', async () => {
      const tooFew = await handleCompareTool(
        { skillIds: ['react'] },
        comparisonEngine,
        workspaceScanner
      );
      expect(tooFew).toContain('Please provide exactly 2 or 3 valid library IDs');

      const tooMany = await handleCompareTool(
        { skillIds: ['react', 'vue', 'svelte', 'solid'] },
        comparisonEngine,
        workspaceScanner
      );
      expect(tooMany).toContain('Please provide exactly 2 or 3 valid library IDs');
    });

    it('handles non-existent library IDs gracefully', async () => {
      const res = await handleCompareTool(
        { skillIds: ['zzzz_nonexistent_1', 'zzzz_nonexistent_2'] },
        comparisonEngine,
        workspaceScanner
      );

      expect(res).toContain('None of the requested libraries');
    });
  });

  describe('Tool: skillforge_create_rules (Agent Directives & Karpathy Rules)', () => {
    it('generates SKILL.md directive with YAML frontmatter and Karpathy coding rules', () => {
      const res = handleRulesTool(
        { skillId: 'zod', format: 'agent-skill' },
        agentSkillGenerator
      );

      expect(res).toContain('SkillForge AI Rules Directive Generated');
      expect(res).toContain('name: zod');
      expect(res).toContain('Operational Rules & Coding Disciplines');
      expect(res).toContain('Think Before Coding');
      expect(res).toContain('.agent/skills/zod/SKILL.md');
    });

    it('generates .cursor/rules/*.mdc format when requested', () => {
      const res = handleRulesTool(
        { skillId: 'tailwind', format: 'cursor-rule' },
        agentSkillGenerator
      );

      expect(res).toContain('.cursor/rules/tailwind.mdc');
      expect(res).toContain('globs:');
    });

    it('handles scoped packages (@modelcontextprotocol/sdk) and directory traversal attempts safely (Anti-Happy-Path)', () => {
      const res = handleRulesTool(
        { skillId: '@modelcontextprotocol/sdk', format: 'agent-skill' },
        agentSkillGenerator
      );

      expect(res).toContain('modelcontextprotocol-sdk');
      expect(res).not.toContain('../');

      const traversalRes = handleRulesTool(
        { skillId: '../../../../etc/passwd', format: 'agent-skill' },
        agentSkillGenerator
      );
      expect(traversalRes).toContain('.agent/skills/etc-passwd/SKILL.md');
      expect(traversalRes).not.toContain('.agent/skills/../../');
    });

    it('rejects empty skill ID', () => {
      const res = handleRulesTool({ skillId: '' }, agentSkillGenerator);
      expect(res).toContain('Please provide a valid `skillId`');
    });
  });

  describe('Tool: skillforge_get_catalog (Catalog Browsing)', () => {
    it('lists skills matching a specific category filter', () => {
      const res = handleCatalogTool(
        { category: 'state-management', limit: 10 },
        repository
      );

      expect(res).toContain('SkillForge Curated Catalog');
      expect(res).toContain('Zustand');
    });

    it('lists skills matching a specific ecosystem filter', () => {
      const res = handleCatalogTool(
        { ecosystem: 'rust', limit: 10 },
        repository
      );

      expect(res).toContain('Tokio');
    });

    it('honors result limits up to 100 max', () => {
      const res = handleCatalogTool({ limit: 5 }, repository);
      const lines = res.split('\n').filter((l) => l.startsWith('- **'));
      expect(lines.length).toBeLessThanOrEqual(5);
    });
  });
});
