#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSkillForgeMcpServer } from './server.js';

export { createSkillForgeMcpServer } from './server.js';

async function main() {
  const server = createSkillForgeMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[SkillForge MCP] Server running on stdio');
}

// Only launch standalone stdio transport if running directly via CLI or npx
const isDirectExecution =
  process.argv[1] &&
  (process.argv[1].endsWith('index.js') ||
    process.argv[1].endsWith('index.ts') ||
    process.argv[1].includes('skillforge-mcp'));

if (isDirectExecution) {
  main().catch((err) => {
    console.error('[SkillForge MCP] Fatal error:', err);
    process.exit(1);
  });
}
