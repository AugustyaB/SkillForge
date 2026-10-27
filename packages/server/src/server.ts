import {
  type Connection,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';
import {
  SKILLFORGE_COMPARE_METHOD,
  SKILLFORGE_GENERATE_AGENT_SKILL_METHOD,
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  SKILLFORGE_LOCAL_SKILLS_ADD_METHOD,
  SKILLFORGE_LOCAL_SKILLS_REMOVE_METHOD,
  SKILLFORGE_LOCAL_SKILLS_LIST_METHOD,
  SKILLFORGE_COMPILE_IDEA_PROMPT_METHOD,
  SKILLFORGE_SCAFFOLD_PROJECT_METHOD,
  type CompareParams,
  type CompareResult,
  type GenerateAgentSkillRequest,
  type GeneratedAgentSkill,
  type PingResult,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
  type AddLocalSkillParams,
  type RemoveLocalSkillParams,
  type ListLocalSkillsParams,
  type LocalSkillOperationResult,
  type CompileIdeaPromptParams,
  type CompileIdeaPromptResult,
  type ScaffoldProjectParams,
  type ScaffoldProjectResponse,
} from '@skillforge/shared';
import { SkillsRepository } from './data/skills-repository.js';
import { LocalSkillsManager } from './data/local-skills-manager.js';
import { SuggestionEngine } from './engine/suggestion-engine.js';
import { ComparisonEngine } from './engine/comparison-engine.js';
import { AgentSkillGenerator } from './engine/agent-skill-generator.js';
import { IdeaPromptCompiler } from './engine/idea-prompt-compiler.js';
import { ProjectScaffolderEngine } from './engine/project-scaffolder.js';
import { ProviderRegistry } from './providers/provider-registry.js';

export class SkillForgeServer {
  private connection: Connection;
  private engine: SuggestionEngine;
  private comparisonEngine: ComparisonEngine;
  private agentSkillGenerator: AgentSkillGenerator;
  private localSkillsManager: LocalSkillsManager;
  private ideaPromptCompiler: IdeaPromptCompiler;
  private projectScaffolder: ProjectScaffolderEngine;
  private providerRegistry: ProviderRegistry;

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
    this.comparisonEngine = new ComparisonEngine({
      repository: this.engine.getRepository(),
    });
    this.agentSkillGenerator = new AgentSkillGenerator(this.engine.getRepository());
    this.ideaPromptCompiler = new IdeaPromptCompiler(this.engine.getRepository());
    this.projectScaffolder = new ProjectScaffolderEngine(this.engine.getRepository());
    this.localSkillsManager = new LocalSkillsManager({
      repository: this.engine.getRepository(),
      cache: this.engine.getCache(),
    });
    this.providerRegistry = new ProviderRegistry({ engine: this.engine });
    this.registerHandlers();
  }

  public getLocalSkillsManager(): LocalSkillsManager {
    return this.localSkillsManager;
  }

  public getEngine(): SuggestionEngine {
    return this.engine;
  }

  public getComparisonEngine(): ComparisonEngine {
    return this.comparisonEngine;
  }

  public getAgentSkillGenerator(): AgentSkillGenerator {
    return this.agentSkillGenerator;
  }

  public getProviderRegistry(): ProviderRegistry {
    return this.providerRegistry;
  }

  public getRepository(): SkillsRepository {
    return this.engine.getRepository();
  }

  private registerHandlers(): void {
    // 1. Lifecycle: Initialize
    this.connection.onInitialize((params: InitializeParams): InitializeResult => {
      this.connection.console.log('[SkillForge LSP] Server initializing...');

      // Auto-load private skills from workspace folders if declared
      const roots: string[] = [];
      if (Array.isArray(params.workspaceFolders)) {
        for (const folder of params.workspaceFolders) {
          if (folder.uri) roots.push(folder.uri);
        }
      } else if (params.rootUri) {
        roots.push(params.rootUri);
      } else if (params.rootPath) {
        roots.push(params.rootPath);
      }

      if (roots.length > 0) {
        const loadRes = this.engine.getRepository().loadWorkspaceSkills(roots);
        if (loadRes.loadedCount > 0) {
          this.connection.console.log(
            `[SkillForge LSP] Loaded ${loadRes.loadedCount} private workspace skills (${loadRes.overriddenCount} overrides).`
          );
        }
      }

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
          `[SkillForge LSP] Handling suggest request: "${intent}" (provider: ${params?.providerConfig?.provider || 'local'})`
        );
        try {
          return await this.providerRegistry.suggest(
            params || { intent: '' },
            params?.providerConfig
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Suggest handler error: ${message}`);
          return {
            skills: [],
            timings: { localMs: 0, totalMs: 0 },
            queryEcho: intent,
            privacyNotice: `Internal error in suggestion provider: ${message}`,
          };
        }
      }
    );

    // 5. Custom compare request
    this.connection.onRequest(
      SKILLFORGE_COMPARE_METHOD,
      async (params?: CompareParams): Promise<CompareResult> => {
        const skillIds = Array.isArray(params?.skillIds) ? params.skillIds : [];
        const installedPackages = Array.isArray(params?.installedPackages)
          ? params.installedPackages
          : [];
        this.connection.console.log(
          `[SkillForge LSP] Handling compare request for skills: [${skillIds.join(', ')}]`
        );
        try {
          const matrix = this.comparisonEngine.compare({ skillIds }, installedPackages);
          return { matrix };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Compare handler error: ${message}`);
          return {
            matrix: {
              columns: [],
              conflictsDetected: [],
              isCrossEcosystem: false,
              categories: [],
              summary: `Comparison error: ${message}`,
            },
          };
        }
      }
    );

    // 6. Custom generate agent skill request
    this.connection.onRequest(
      SKILLFORGE_GENERATE_AGENT_SKILL_METHOD,
      async (params?: GenerateAgentSkillRequest): Promise<GeneratedAgentSkill> => {
        if (!params || !params.skillId || typeof params.skillId !== 'string') {
          return {
            skillId: params?.skillId || 'unknown',
            skillName: params?.skillId || 'unknown',
            format: params?.format || 'agent-skill',
            markdownContent: '# Error: A valid skillId string is required to generate an agent skill.\n',
            suggestedFilePath: '.agent/skills/unknown/SKILL.md',
            frontmatter: {
              name: 'unknown',
              description: 'Error: skillId is required',
            },
          };
        }
        this.connection.console.log(
          `[SkillForge LSP] Handling generateAgentSkill request for: "${params.skillId}" (format: ${params.format || 'agent-skill'})`
        );
        try {
          return this.agentSkillGenerator.generate(params);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] GenerateAgentSkill error: ${message}`);
          return {
            skillId: params.skillId,
            skillName: params.skillId,
            format: params.format || 'agent-skill',
            markdownContent: `# Error generating agent skill directive: ${message}\n`,
            suggestedFilePath: `.agent/skills/${params.skillId}/SKILL.md`,
            frontmatter: {
              name: params.skillId,
              description: `Generation error: ${message}`,
            },
          };
        }
      }
    );

    // 7. Custom local skills CRUD requests
    this.connection.onRequest(
      SKILLFORGE_LOCAL_SKILLS_ADD_METHOD,
      async (params?: AddLocalSkillParams): Promise<LocalSkillOperationResult> => {
        try {
          if (!params?.workspaceRoot || !params?.skill) {
            return {
              success: false,
              message: 'workspaceRoot and skill payload are required.',
              error: 'INVALID_PARAMS',
            };
          }
          return await this.localSkillsManager.addSkill(
            params.workspaceRoot,
            params.skill,
            params.overwrite ?? true
          );
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Add local skill error: ${msg}`);
          return { success: false, message: msg, error: msg };
        }
      }
    );

    this.connection.onRequest(
      SKILLFORGE_LOCAL_SKILLS_REMOVE_METHOD,
      async (params?: RemoveLocalSkillParams): Promise<LocalSkillOperationResult> => {
        try {
          if (!params?.workspaceRoot || !params?.skillId) {
            return {
              success: false,
              message: 'workspaceRoot and skillId are required.',
              error: 'INVALID_PARAMS',
            };
          }
          return await this.localSkillsManager.removeSkill(params.workspaceRoot, params.skillId);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Remove local skill error: ${msg}`);
          return { success: false, message: msg, error: msg };
        }
      }
    );

    this.connection.onRequest(
      SKILLFORGE_LOCAL_SKILLS_LIST_METHOD,
      async (params?: ListLocalSkillsParams): Promise<LocalSkillOperationResult> => {
        try {
          if (!params?.workspaceRoot) {
            return {
              success: false,
              message: 'workspaceRoot is required.',
              error: 'INVALID_PARAMS',
            };
          }
          return await this.localSkillsManager.listSkills(params.workspaceRoot);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] List local skills error: ${msg}`);
          return { success: false, message: msg, error: msg };
        }
      }
    );

    // 8. Custom compile idea prompt request (Project Studio v1.2.0)
    this.connection.onRequest(
      SKILLFORGE_COMPILE_IDEA_PROMPT_METHOD,
      async (params?: CompileIdeaPromptParams): Promise<CompileIdeaPromptResult> => {
        try {
          if (!params?.request) {
            throw new Error('request payload is required.');
          }
          const compiled = this.ideaPromptCompiler.compile(params.request);
          return { compiled };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Compile idea prompt error: ${msg}`);
          throw err;
        }
      }
    );

    // 9. Custom scaffold project request (Project Studio v1.2.0)
    this.connection.onRequest(
      SKILLFORGE_SCAFFOLD_PROJECT_METHOD,
      async (params?: ScaffoldProjectParams): Promise<ScaffoldProjectResponse> => {
        try {
          if (!params?.request) {
            throw new Error('request payload is required.');
          }
          const result = this.projectScaffolder.scaffold(params.request);
          return { result };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.connection.console.error(`[SkillForge LSP] Scaffold project error: ${msg}`);
          return {
            result: {
              success: false,
              createdFiles: [],
              skippedFiles: [],
              warnings: [msg],
              message: `Scaffolding failure: ${msg}`,
            },
          };
        }
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
