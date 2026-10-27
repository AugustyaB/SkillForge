#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  AgentSkillGenerator,
  ComparisonEngine,
  SkillsRepository,
  SuggestionEngine,
  WorkspaceScanner,
} from '@skillforge/server';
import type { AgentSkillFormat } from '@skillforge/shared';
import { createSkillForgeMcpServer } from './server.js';
import { handleSuggestTool } from './tools/suggest-tool.js';
import { handleCompareTool } from './tools/compare-tool.js';
import { handleRulesTool } from './tools/rules-tool.js';

export { createSkillForgeMcpServer } from './server.js';

async function runMcp(): Promise<void> {
  const server = createSkillForgeMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[SkillForge MCP] Server running on stdio');
}

async function runCli(rawArgs: string[]): Promise<void> {
  const args = rawArgs.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
SkillForge MCP & CLI Server v1.2.0

USAGE:
  # Run as MCP Server (Claude Desktop, Cursor, Windsurf, Avante.nvim):
  npx skillforge-mcp-server

  # Run directly via CLI or Neovim:
  npx skillforge-mcp-server --suggest "<intent>" [--ecosystem <eco>]
  npx skillforge-mcp-server --compare "<id1>" "<id2>"
  npx skillforge-mcp-server --rules "<skillId>" [--format <fmt>]
  npx skillforge-mcp-server --version
`);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('0.1.2');
    process.exit(0);
  }

  const suggestIdx = args.indexOf('--suggest');
  if (suggestIdx !== -1) {
    const intent = args[suggestIdx + 1];
    if (!intent) {
      console.error('Error: --suggest requires an intent string, e.g. --suggest "state management"');
      process.exit(1);
    }
    const ecoIdx = args.indexOf('--ecosystem');
    const ecosystem = ecoIdx !== -1 ? args[ecoIdx + 1] : undefined;
    const repository = new SkillsRepository();
    const suggestionEngine = new SuggestionEngine({ repository });
    const workspaceScanner = new WorkspaceScanner();
    const output = await handleSuggestTool(
      { intent, ecosystem, workspacePath: process.cwd() },
      suggestionEngine,
      workspaceScanner
    );
    console.log(output);
    process.exit(0);
  }

  const compareIdx = args.indexOf('--compare');
  if (compareIdx !== -1) {
    const skillIds = args.slice(compareIdx + 1).filter((a) => !a.startsWith('--'));
    if (skillIds.length < 2) {
      console.error(
        'Error: --compare requires at least 2 skill IDs, e.g. --compare zustand redux-toolkit'
      );
      process.exit(1);
    }
    const repository = new SkillsRepository();
    const comparisonEngine = new ComparisonEngine({ repository });
    const workspaceScanner = new WorkspaceScanner();
    const output = await handleCompareTool(
      { skillIds, workspacePath: process.cwd() },
      comparisonEngine,
      workspaceScanner
    );
    console.log(output);
    process.exit(0);
  }

  const rulesIdx = args.indexOf('--rules');
  if (rulesIdx !== -1) {
    const skillId = args[rulesIdx + 1];
    if (!skillId) {
      console.error('Error: --rules requires a skill ID, e.g. --rules zod');
      process.exit(1);
    }
    const fmtIdx = args.indexOf('--format');
    const format = (fmtIdx !== -1 ? args[fmtIdx + 1] : 'agent-skill') as AgentSkillFormat;
    const repository = new SkillsRepository();
    const agentSkillGenerator = new AgentSkillGenerator(repository);
    const output = handleRulesTool(
      { skillId, format, workspacePath: process.cwd() },
      agentSkillGenerator
    );
    console.log(output);
    process.exit(0);
  }

  // No CLI flags provided -> run standard MCP stdio server
  await runMcp();
}

// Only launch standalone stdio transport or CLI if executed directly
const isDirectExecution =
  process.argv[1] &&
  (process.argv[1].endsWith('index.js') ||
    process.argv[1].endsWith('index.ts') ||
    process.argv[1].includes('skillforge-mcp'));

if (isDirectExecution) {
  runCli(process.argv).catch((err) => {
    console.error('[SkillForge MCP] Fatal error:', err);
    process.exit(1);
  });
}
