import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { SkillForgeServer } from './server.js';

export function startLspServer(): void {
  const connection = createConnection(ProposedFeatures.all);
  const server = new SkillForgeServer(connection);
  server.listen();
}

// Auto-run when executed directly via node or CLI (not in vitest tests)
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  try {
    startLspServer();
  } catch {
    // Ignore when not attached to an LSP stdio stream
  }
}

export * from './api.js';
