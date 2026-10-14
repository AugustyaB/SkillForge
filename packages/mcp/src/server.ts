import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  AgentSkillGenerator,
  ComparisonEngine,
  SkillsRepository,
  SuggestionEngine,
  WorkspaceScanner,
} from '@skillforge/server';
import { handleSuggestTool } from './tools/suggest-tool.js';
import { handleCompareTool } from './tools/compare-tool.js';
import { handleRulesTool } from './tools/rules-tool.js';
import { handleCatalogTool } from './tools/catalog-tool.js';

export function createSkillForgeMcpServer(): McpServer {
  const repository = new SkillsRepository();
  const suggestionEngine = new SuggestionEngine({ repository });
  const comparisonEngine = new ComparisonEngine({ repository });
  const agentSkillGenerator = new AgentSkillGenerator(repository);
  const workspaceScanner = new WorkspaceScanner();

  const server = new McpServer({
    name: 'skillforge',
    version: '0.1.1',
  });

  // Tool 1: skillforge_suggest
  server.tool(
    'skillforge_suggest',
    {
      intent: z
        .string()
        .describe(
          'Plain-English description of the feature, library, or architecture capability you want to find (e.g. "state management", "fast web framework with validation", "pdf generator")'
        ),
      workspacePath: z
        .string()
        .optional()
        .describe(
          'Optional absolute path to the local project folder to detect existing dependencies and avoid conflicts'
        ),
      ecosystem: z
        .enum(['typescript', 'javascript', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'csharp'])
        .optional()
        .describe('Optional target programming language ecosystem filter'),
      maxResults: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .optional()
        .describe('Maximum number of recommendations to return (default: 5)'),
    },
    async (params) => {
      const text = await handleSuggestTool(params, suggestionEngine, workspaceScanner);
      return {
        content: [{ type: 'text', text }],
      };
    }
  );

  // Tool 2: skillforge_compare
  server.tool(
    'skillforge_compare',
    {
      skillIds: z
        .array(z.string())
        .min(2)
        .max(3)
        .describe(
          'List of 2 or 3 library IDs to compare side-by-side (e.g. ["fastapi", "django"] or ["zustand", "redux-toolkit"])'
        ),
      workspacePath: z
        .string()
        .optional()
        .describe(
          'Optional absolute path to the local project folder to check which candidate is already installed'
        ),
    },
    async (params) => {
      const text = await handleCompareTool(params, comparisonEngine, workspaceScanner);
      return {
        content: [{ type: 'text', text }],
      };
    }
  );

  // Tool 3: skillforge_create_rules
  server.tool(
    'skillforge_create_rules',
    {
      skillId: z
        .string()
        .describe(
          'The library ID to generate rules for (e.g. "zod", "fastapi", "tailwind", "prisma")'
        ),
      format: z
        .enum(['agent-skill', 'cursor-rule', 'claude-skill', 'root-agents'])
        .default('agent-skill')
        .optional()
        .describe(
          'Target agent file format (agent-skill for .agent/skills/SKILL.md, cursor-rule for .cursor/rules/*.mdc, claude-skill for .claude/skills/SKILL.md, root-agents for AGENTS.md)'
        ),
      workspacePath: z
        .string()
        .optional()
        .describe(
          'Optional project root directory path where the directive should be created or referenced'
        ),
    },
    async (params) => {
      const text = handleRulesTool(params, agentSkillGenerator);
      return {
        content: [{ type: 'text', text }],
      };
    }
  );

  // Tool 4: skillforge_get_catalog
  server.tool(
    'skillforge_get_catalog',
    {
      category: z
        .string()
        .optional()
        .describe(
          'Filter by skill category (e.g., "state-management", "authentication", "database", "ai-agent", "utility")'
        ),
      ecosystem: z
        .string()
        .optional()
        .describe('Filter by ecosystem (e.g., "typescript", "python", "rust")'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(30)
        .optional()
        .describe('Maximum skills to return (default: 30)'),
    },
    async (params) => {
      const text = handleCatalogTool(params, repository);
      return {
        content: [{ type: 'text', text }],
      };
    }
  );

  return server;
}
