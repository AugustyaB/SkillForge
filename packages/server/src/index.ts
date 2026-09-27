import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { SkillForgeServer } from './server.js';

// Instantiate server with stdio JSON-RPC transport
const connection = createConnection(ProposedFeatures.all);
const server = new SkillForgeServer(connection);

server.listen();

export { SkillForgeServer };
export { SkillsRepository } from './data/skills-repository.js';
export { SuggestionEngine } from './engine/suggestion-engine.js';
export { IntentParser } from './engine/intent-parser.js';
export { QueryCache } from './engine/query-cache.js';
export {
  GroundTruthAnchor,
  ConflictDetector,
  HealthVerifier,
  TrustTierClassifier,
  FallbackCascade,
} from './reliability/index.js';
