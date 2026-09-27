import {
  type Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';
import {
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  type PingResult,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
} from '@skillforge/shared';
import { SkillsRepository } from './data/skills-repository.js';
import { SuggestionEngine } from './engine/suggestion-engine.js';

export class SkillForgeServer {
  private connection: Connection;
  private engine: SuggestionEngine;

  constructor(
    connection: Connection,
    repositoryOrEngine?: SkillsRepository | SuggestionEngine
  ) {
    this.connection = connection;
    if (repositoryOrEngine instanceof SuggestionEngine) {
      this.engine = repositoryOrEngine;
    } else if (repositoryOrEngine instanceof SkillsRepository) {
      this.engine = new SuggestionEngine({ repository: repositoryOrEngine });
    } else {
      this.engine = new SuggestionEngine();
    }
    this.registerHandlers();
  }

  public getEngine(): SuggestionEngine {
    return this.engine;
  }

  public getRepository(): SkillsRepository {
    return this.engine.getRepository();
  }

  private registerHandlers(): void {
    // 1. Lifecycle: Initialize
    this.connection.onInitialize((_params: InitializeParams): InitializeResult => {
      this.connection.console.log('[SkillForge LSP] Server initializing...');
      return {
        capabilities: {
          textDocumentSync: TextDocumentSyncKind.Incremental,
        },
        serverInfo: {
          name: 'skillforge-lsp-server',
          version: '0.1.0',
        },
      };
    });

    // 2. Lifecycle: Initialized
    this.connection.onInitialized(() => {
      this.connection.console.log(
        `[SkillForge LSP] Server initialized with ${this.engine.getRepository().count} verified skills.`
      );
    });

    // 3. Custom ping request
    this.connection.onRequest(SKILLFORGE_PING_METHOD, (): PingResult => {
      return {
        status: 'ok',
        version: '0.1.0',
        timestamp: Date.now(),
      };
    });

    // 4. Custom suggest request
    this.connection.onRequest(
      SKILLFORGE_SUGGEST_METHOD,
      async (params?: SkillSuggestionParams): Promise<SkillSuggestionResult> => {
        const intent = typeof params?.intent === 'string' ? params.intent : '';
        this.connection.console.log(
          `[SkillForge LSP] Handling suggest request: "${intent}"`
        );
        return await this.engine.suggest(params || { intent: '' });
      }
    );
  }

  public listen(): void {
    this.connection.listen();
  }

  public dispose(): void {
    this.connection.dispose();
  }
}
