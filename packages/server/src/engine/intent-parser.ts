import type { SkillCategory, Difficulty } from '@skillforge/shared';

export type ActionVerb =
  | 'build'
  | 'create'
  | 'add'
  | 'integrate'
  | 'migrate'
  | 'test'
  | 'secure'
  | 'deploy'
  | 'optimize'
  | 'unknown';

export interface ParsedIntent {
  rawQuery: string;
  cleanQuery: string;
  tokens: string[];
  actionVerb: ActionVerb;
  detectedCategories: SkillCategory[];
  explicitEcosystem?: string;
  difficultyPreference?: Difficulty;
  constraints: string[];
}

const ACTION_VERBS: Record<string, ActionVerb> = {
  build: 'build',
  create: 'create',
  make: 'build',
  add: 'add',
  integrate: 'integrate',
  connect: 'integrate',
  migrate: 'migrate',
  convert: 'migrate',
  test: 'test',
  verify: 'test',
  secure: 'secure',
  protect: 'secure',
  deploy: 'deploy',
  host: 'deploy',
  ship: 'deploy',
  optimize: 'optimize',
  scale: 'optimize',
};

const CATEGORY_KEYWORDS: Record<string, SkillCategory> = {
  // Frontend
  frontend: 'frontend-framework',
  ui: 'ui-library',
  css: 'ui-library',
  styling: 'ui-library',
  components: 'ui-library',
  design: 'ui-library',
  spa: 'frontend-framework',
  // State
  state: 'state-management',
  store: 'state-management',
  flux: 'state-management',
  // Backend
  backend: 'backend-framework',
  server: 'backend-framework',
  api: 'backend-framework',
  rest: 'backend-framework',
  microservice: 'backend-framework',
  // Database & ORM
  database: 'database',
  db: 'database',
  sql: 'database',
  nosql: 'database',
  orm: 'orm',
  odm: 'orm',
  migrations: 'orm',
  // Auth & Security
  auth: 'authentication',
  login: 'authentication',
  oauth: 'authentication',
  jwt: 'authentication',
  session: 'authentication',
  security: 'security',
  // Protocols & Realtime
  realtime: 'api-protocol',
  websocket: 'api-protocol',
  chat: 'api-protocol',
  events: 'api-protocol',
  graphql: 'api-protocol',
  rpc: 'api-protocol',
  // DevOps & Cloud
  docker: 'devops-container',
  container: 'devops-container',
  k8s: 'devops-container',
  kubernetes: 'devops-container',
  deploy: 'cloud-hosting',
  cloud: 'cloud-hosting',
  hosting: 'cloud-hosting',
  serverless: 'cloud-hosting',
  // Testing
  test: 'testing',
  testing: 'testing',
  e2e: 'testing',
  unit: 'testing',
  mock: 'testing',
  // AI
  ai: 'ai-ml',
  llm: 'ai-ml',
  rag: 'ai-ml',
  gpt: 'ai-ml',
  embeddings: 'ai-ml',
};

const ECOSYSTEM_KEYWORDS: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'javascript',
  typescript: 'javascript',
  node: 'javascript',
  nodejs: 'javascript',
  python: 'python',
  py: 'python',
  rust: 'rust',
  go: 'go',
  golang: 'go',
  java: 'java',
  dotnet: 'dotnet',
  csharp: 'dotnet',
  ruby: 'ruby',
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'he',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'that',
  'the',
  'to',
  'was',
  'were',
  'will',
  'with',
  'i',
  'want',
  'need',
  'like',
  'how',
  'can',
  'my',
  'some',
  'app',
  'apps',
  'application',
  'project',
]);

export class IntentParser {
  public parse(rawQuery: string): ParsedIntent {
    const cleanQuery = rawQuery.trim().toLowerCase();
    const rawTokens = cleanQuery.split(/[\s,]+/).filter(Boolean);

    let actionVerb: ActionVerb = 'unknown';
    const detectedCategories = new Set<SkillCategory>();
    let explicitEcosystem: string | undefined;
    let difficultyPreference: Difficulty | undefined;
    const constraints: string[] = [];
    const tokens: string[] = [];

    for (const rawToken of rawTokens) {
      const token = rawToken.replace(/[?!.:;()]/g, '');
      if (!token) continue;

      // 1. Action verb detection
      if (actionVerb === 'unknown' && ACTION_VERBS[token]) {
        actionVerb = ACTION_VERBS[token]!;
      }

      // 2. Category affinity detection
      if (CATEGORY_KEYWORDS[token]) {
        detectedCategories.add(CATEGORY_KEYWORDS[token]!);
      }

      // 3. Ecosystem detection
      if (!explicitEcosystem && ECOSYSTEM_KEYWORDS[token]) {
        explicitEcosystem = ECOSYSTEM_KEYWORDS[token];
      }

      // 4. Difficulty detection
      if (token === 'beginner' || token === 'simple' || token === 'starter' || token === 'easy') {
        difficultyPreference = 'beginner';
        constraints.push('beginner-friendly');
      } else if (token === 'advanced' || token === 'complex' || token === 'enterprise') {
        difficultyPreference = 'advanced';
        constraints.push('enterprise');
      } else if (token === 'intermediate') {
        difficultyPreference = 'intermediate';
      }

      // 5. Constraints
      if (
        token === 'fast' ||
        token === 'performance' ||
        token === 'lightweight' ||
        token === 'minimal' ||
        token === 'typesafe'
      ) {
        constraints.push(token);
      }

      // 6. Keywords (filter noise stop words)
      if (token.length >= 2 && !STOP_WORDS.has(token)) {
        tokens.push(token);
        if (token.includes('-')) {
          const noHyphen = token.replace(/-/g, '');
          if (noHyphen.length >= 2 && !STOP_WORDS.has(noHyphen)) {
            tokens.push(noHyphen);
          }
        }
      }
    }

    return {
      rawQuery,
      cleanQuery,
      tokens,
      actionVerb,
      detectedCategories: Array.from(detectedCategories),
      explicitEcosystem,
      difficultyPreference,
      constraints,
    };
  }
}
