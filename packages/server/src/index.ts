import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { SkillForgeServer } from './server.js';

// Instantiate server with stdio JSON-RPC transport
const connection = createConnection(ProposedFeatures.all);
const server = new SkillForgeServer(connection);

server.listen();

export { SkillForgeServer };
