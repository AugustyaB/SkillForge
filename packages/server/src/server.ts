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
  type Skill,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
  type SuggestedSkill,
} from '@skillforge/shared';
import { SkillsRepository } from './data/skills-repository.js';

export class SkillForgeServer {
  private connection: Connection;
  private repository: SkillsRepository;

  constructor(connection: Connection, repository?: SkillsRepository) {
    this.connection = connection;
    this.repository = repository ?? new SkillsRepository();
    this.registerHandlers();
  }

  public getRepository(): SkillsRepository {
    return this.repository;
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
        `[SkillForge LSP] Server initialized with ${this.repository.count} verified skills.`
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
      async (params: SkillSuggestionParams): Promise<SkillSuggestionResult> => {
        const startTime = Date.now();
        const intent = params.intent ? params.intent.trim() : '';

        this.connection.console.log(`[SkillForge LSP] Handling suggest request: "${intent}"`);

        if (!intent) {
          const elapsed = Date.now() - startTime;
          return {
            skills: [],
            timings: { localMs: elapsed, totalMs: elapsed },
            queryEcho: '',
          };
        }

        const scored = this.repository.search(intent, {
          difficulty: params.options?.difficulty,
          maxResults: params.options?.maxResults ?? 5,
        });

        let results: SuggestedSkill[];
        let fallbackUsed = false;

        if (scored.length > 0) {
          results = scored.map(({ skill, score, matchReasons }) => ({
            ...skill,
            trustTier: 'verified',
            confidence: Math.min(0.99, Number((0.6 + Math.min(score, 40) / 100).toFixed(2))),
            reasoning: matchReasons.length > 0 ? matchReasons.join('. ') : skill.whyUseIt,
            isInstalledInWorkspace: false,
          }));
        } else {
          fallbackUsed = true;
          const fallbackIds = ['react', 'express', 'postgresql'];
          results = fallbackIds
            .map((id) => this.repository.getSkillById(id))
            .filter((s): s is Skill => Boolean(s))
            .map((skill) => ({
              ...skill,
              trustTier: 'verified',
              confidence: 0.65,
              reasoning: 'Baseline recommendation matching general application development.',
              isInstalledInWorkspace: false,
            }));
        }

        const elapsed = Date.now() - startTime;
        return {
          skills: results,
          timings: {
            localMs: elapsed,
            totalMs: elapsed,
          },
          fallbackUsed,
          queryEcho: intent,
        };
      },
    );
  }

  public listen(): void {
    this.connection.listen();
  }

  public dispose(): void {
    this.connection.dispose();
  }
}
