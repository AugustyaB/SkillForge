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
  type SuggestedSkill,
} from '@skillforge/shared';

/**
 * Baseline foundation skills for initial bootstrap responses
 */
const BASELINE_SKILLS: SuggestedSkill[] = [
  {
    id: 'express',
    name: 'Express.js',
    category: 'backend-framework',
    difficulty: 'beginner',
    description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    whyUseIt: 'The de facto standard for building REST APIs in Node.js with huge community support.',
    tags: ['rest', 'api', 'backend', 'http', 'routing', 'node'],
    ecosystem: 'javascript',
    officialUrl: 'https://expressjs.com',
    learnResources: [
      { label: 'Official Guide', url: 'https://expressjs.com/en/starter/installing.html', type: 'docs' },
    ],
    alternatives: ['fastify', 'koa', 'nest'],
    worksWellWith: ['socket.io', 'pg', 'prisma'],
    prerequisites: ['javascript', 'nodejs'],
    stackIndicators: ['express'],
    trustTier: 'verified',
    confidence: 0.95,
    reasoning: 'Essential for Node.js REST API and server architecture.',
    isInstalledInWorkspace: false,
  },
  {
    id: 'socket-io',
    name: 'Socket.io',
    category: 'api-protocol',
    difficulty: 'beginner',
    description: 'Bidirectional, low-latency and event-based communication between client and server.',
    whyUseIt: 'Ideal for real-time messaging, chat applications, and live collaborative updates.',
    tags: ['websocket', 'realtime', 'chat', 'events'],
    ecosystem: 'javascript',
    officialUrl: 'https://socket.io',
    learnResources: [
      { label: 'Get Started Guide', url: 'https://socket.io/get-started/chat', type: 'tutorial' },
    ],
    alternatives: ['ws', 'pusher'],
    worksWellWith: ['express', 'react'],
    prerequisites: ['javascript', 'nodejs'],
    stackIndicators: ['socket.io', 'socket.io-client'],
    trustTier: 'verified',
    confidence: 0.92,
    reasoning: 'Standard library for real-time event communication.',
    isInstalledInWorkspace: false,
  },
  {
    id: 'react',
    name: 'React',
    category: 'frontend-framework',
    difficulty: 'beginner',
    description: 'A JavaScript library for building component-driven user interfaces.',
    whyUseIt: 'Declarative component architecture suitable for single-page applications and web apps.',
    tags: ['frontend', 'ui', 'components', 'spa'],
    ecosystem: 'javascript',
    officialUrl: 'https://react.dev',
    learnResources: [
      { label: 'React Documentation', url: 'https://react.dev/learn', type: 'docs' },
    ],
    alternatives: ['vue', 'svelte', 'angular'],
    worksWellWith: ['tailwind', 'zustand', 'tanstack-query'],
    prerequisites: ['javascript', 'html', 'css'],
    stackIndicators: ['react', 'react-dom'],
    trustTier: 'verified',
    confidence: 0.9,
    reasoning: 'Most widely used library for interactive web UIs.',
    isInstalledInWorkspace: false,
  },
];

export class SkillForgeServer {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.registerHandlers();
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
      this.connection.console.log('[SkillForge LSP] Server initialized and ready.');
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

        const lowerIntent = intent.toLowerCase();
        // Match against baseline tags or return all baseline if general query
        let matched = BASELINE_SKILLS.filter((skill) => {
          return (
            skill.tags.some((tag) => lowerIntent.includes(tag)) ||
            lowerIntent.includes(skill.name.toLowerCase()) ||
            lowerIntent.includes(skill.category.toLowerCase())
          );
        });

        // Fallback to top baseline skills if no direct keyword match
        const fallbackUsed = matched.length === 0;
        if (fallbackUsed) {
          matched = BASELINE_SKILLS.slice(0, 2);
        }

        // Apply maxResults limit if provided
        const maxResults = params.options?.maxResults ?? 5;
        const results = matched.slice(0, maxResults);

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
}
