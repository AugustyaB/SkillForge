import type { SkillCategory } from '@skillforge/shared';

export interface TaxonomyMapping {
  /** Canonical expansion phrase (e.g. 'authentication', 'kubernetes') */
  expansion: string;
  /** SkillCategory if this term implies a specific category */
  category?: SkillCategory;
  /** Target ecosystem if this term implies a language/platform */
  ecosystem?: string;
  /** Canonical tags associated with this concept */
  tags?: string[];
  /** Specific skill IDs directly associated with this acronym/synonym (e.g. 'tf' -> ['terraform']) */
  canonicalTools?: string[];
  /** Human-readable description/explanation of the synonym */
  description?: string;
}

export interface TaxonomyExpansionResult {
  /** Original clean tokens parsed from query */
  tokens: string[];
  /** Additional synonym tokens derived from taxonomy */
  synonymTokens: string[];
  /** Categories detected via taxonomy */
  detectedCategories: SkillCategory[];
  /** Ecosystem detected via taxonomy */
  detectedEcosystem?: string;
  /** Specific canonical tool IDs mapped via acronyms */
  canonicalToolIds: string[];
  /** Explanations of why mappings occurred (for audit/match reasons) */
  explanations: string[];
}

/**
 * Curated dictionary of software engineering acronyms, abbreviations, and synonyms.
 * Bridges real-world developer shorthand with SkillForge canonical metadata.
 */
export const TAXONOMY_MAP: Record<string, TaxonomyMapping> = {
  // --- AUTHENTICATION & SECURITY ---
  authn: {
    expansion: 'authentication',
    category: 'authentication',
    tags: ['auth', 'authentication'],
    description: 'Authentication (authn)',
  },
  authz: {
    expansion: 'authorization',
    category: 'authentication',
    tags: ['auth', 'authorization', 'security'],
    description: 'Authorization (authz)',
  },
  sso: {
    expansion: 'single sign on',
    category: 'authentication',
    tags: ['auth', 'sso', 'oauth'],
    description: 'Single Sign-On (SSO)',
  },
  mfa: {
    expansion: 'multi-factor authentication',
    category: 'authentication',
    tags: ['auth', 'security', 'mfa'],
    description: 'Multi-Factor Authentication (MFA)',
  },
  '2fa': {
    expansion: 'two-factor authentication',
    category: 'authentication',
    tags: ['auth', 'security', 'mfa'],
    description: 'Two-Factor Authentication (2FA)',
  },
  rbac: {
    expansion: 'role-based access control',
    category: 'authentication',
    tags: ['auth', 'authorization', 'security'],
    description: 'Role-Based Access Control (RBAC)',
  },
  saml: {
    expansion: 'saml',
    category: 'authentication',
    tags: ['auth', 'sso', 'security'],
    description: 'Security Assertion Markup Language (SAML)',
  },
  iam: {
    expansion: 'identity and access management',
    category: 'authentication',
    tags: ['auth', 'security', 'cloud'],
    description: 'Identity & Access Management (IAM)',
  },
  jwt: {
    expansion: 'json web token',
    category: 'authentication',
    tags: ['auth', 'jwt', 'security'],
    description: 'JSON Web Token (JWT)',
  },
  oauth: {
    expansion: 'oauth',
    category: 'authentication',
    tags: ['auth', 'oauth', 'jwt'],
    description: 'OAuth Authorization',
  },
  oauth2: {
    expansion: 'oauth',
    category: 'authentication',
    tags: ['auth', 'oauth', 'jwt'],
    description: 'OAuth 2.0 Authorization',
  },
  login: {
    expansion: 'login',
    category: 'authentication',
    tags: ['auth', 'authentication'],
    description: 'User Login & Auth',
  },

  // --- DATABASES & ORM ---
  rdbms: {
    expansion: 'relational database',
    category: 'database',
    tags: ['database', 'sql'],
    description: 'Relational Database Management System (RDBMS)',
  },
  sql: {
    expansion: 'sql',
    category: 'database',
    tags: ['database', 'sql'],
    description: 'SQL Database',
  },
  nosql: {
    expansion: 'nosql',
    category: 'database',
    tags: ['database', 'nosql'],
    description: 'NoSQL Database',
  },
  db: {
    expansion: 'database',
    category: 'database',
    tags: ['database'],
    description: 'Database Engine',
  },
  orm: {
    expansion: 'object-relational mapping',
    category: 'orm',
    tags: ['orm', 'database'],
    description: 'Object-Relational Mapping (ORM)',
  },
  odm: {
    expansion: 'object-document mapping',
    category: 'orm',
    tags: ['orm', 'database', 'nosql'],
    description: 'Object-Document Mapping (ODM)',
  },
  'key-value': {
    expansion: 'key-value store',
    category: 'database',
    tags: ['database', 'cache'],
    canonicalTools: ['redis'],
    description: 'Key-Value Store',
  },
  keyvalue: {
    expansion: 'key-value store',
    category: 'database',
    tags: ['database', 'cache'],
    canonicalTools: ['redis'],
    description: 'Key-Value Store',
  },

  // --- TESTING & QUALITY ASSURANCE ---
  e2e: {
    expansion: 'end to end testing',
    category: 'testing',
    tags: ['testing', 'test', 'e2e'],
    canonicalTools: ['playwright', 'cypress'],
    description: 'End-to-End Testing (E2E)',
  },
  tdd: {
    expansion: 'test-driven development',
    category: 'testing',
    tags: ['testing', 'test', 'unit'],
    description: 'Test-Driven Development (TDD)',
  },
  bdd: {
    expansion: 'behavior-driven development',
    category: 'testing',
    tags: ['testing', 'test'],
    description: 'Behavior-Driven Development (BDD)',
  },
  unit: {
    expansion: 'unit testing',
    category: 'testing',
    tags: ['testing', 'test', 'unit'],
    description: 'Unit Testing',
  },
  integration: {
    expansion: 'integration testing',
    category: 'testing',
    tags: ['testing', 'test'],
    description: 'Integration Testing',
  },
  mock: {
    expansion: 'mocking',
    category: 'testing',
    tags: ['testing', 'test', 'mock'],
    canonicalTools: ['msw', 'mockito'],
    description: 'Mocking & Test Doubles',
  },

  // --- PROTOCOLS, REALTIME & MESSAGING ---
  gql: {
    expansion: 'graphql',
    category: 'api-protocol',
    tags: ['graphql', 'api'],
    canonicalTools: ['apollo-graphql', 'strawberry-graphql'],
    description: 'GraphQL (GQL)',
  },
  graphql: {
    expansion: 'graphql',
    category: 'api-protocol',
    tags: ['graphql', 'api'],
    canonicalTools: ['apollo-graphql', 'strawberry-graphql'],
    description: 'GraphQL API',
  },
  ws: {
    expansion: 'websocket',
    category: 'api-protocol',
    tags: ['websocket', 'realtime'],
    description: 'WebSocket (WS)',
  },
  websocket: {
    expansion: 'websocket',
    category: 'api-protocol',
    tags: ['websocket', 'realtime'],
    description: 'WebSocket Protocol',
  },
  sse: {
    expansion: 'server-sent events',
    category: 'api-protocol',
    tags: ['realtime', 'streaming'],
    description: 'Server-Sent Events (SSE)',
  },
  grpc: {
    expansion: 'grpc',
    category: 'api-protocol',
    tags: ['grpc', 'rpc', 'protobuf'],
    description: 'gRPC Protocol',
  },
  mq: {
    expansion: 'message queue',
    tags: ['queue', 'messaging', 'async'],
    canonicalTools: ['bullmq', 'celery', 'redis', 'asynq-go'],
    description: 'Message Queue (MQ)',
  },
  pubsub: {
    expansion: 'publish-subscribe',
    tags: ['pubsub', 'messaging', 'events'],
    canonicalTools: ['redis'],
    description: 'Publish/Subscribe (PubSub)',
  },
  'pub-sub': {
    expansion: 'publish-subscribe',
    tags: ['pubsub', 'messaging', 'events'],
    canonicalTools: ['redis'],
    description: 'Publish/Subscribe (PubSub)',
  },

  // --- DEVOPS, CONTAINERS, IAC & CI/CD ---
  k8s: {
    expansion: 'kubernetes',
    category: 'devops-container',
    tags: ['kubernetes', 'k8s', 'container'],
    canonicalTools: ['kubernetes', 'helm', 'minikube-k8s', 'skaffold-k8s'],
    description: 'Kubernetes (K8s)',
  },
  tf: {
    expansion: 'terraform',
    tags: ['terraform', 'iac', 'infrastructure'],
    canonicalTools: ['terraform'],
    description: 'Terraform (TF)',
  },
  iac: {
    expansion: 'infrastructure as code',
    tags: ['iac', 'infrastructure', 'devops'],
    canonicalTools: ['terraform'],
    description: 'Infrastructure as Code (IaC)',
  },
  ci: {
    expansion: 'continuous integration',
    category: 'devops-container',
    tags: ['ci', 'cd', 'devops'],
    description: 'Continuous Integration (CI)',
  },
  cd: {
    expansion: 'continuous delivery',
    category: 'devops-container',
    tags: ['ci', 'cd', 'devops'],
    description: 'Continuous Delivery (CD)',
  },
  cicd: {
    expansion: 'continuous integration and delivery',
    category: 'devops-container',
    tags: ['ci', 'cd', 'devops'],
    description: 'CI/CD Automation',
  },
  docker: {
    expansion: 'docker',
    category: 'devops-container',
    tags: ['docker', 'container'],
    canonicalTools: ['docker', 'docker-compose'],
    description: 'Docker Containerization',
  },

  // --- INTERNATIONALIZATION & LOCALIZATION ---
  i18n: {
    expansion: 'internationalization',
    tags: ['i18n', 'localization', 'internationalization'],
    canonicalTools: ['intl-flutter'],
    description: 'Internationalization (i18n)',
  },
  l10n: {
    expansion: 'localization',
    tags: ['localization', 'i18n'],
    description: 'Localization (l10n)',
  },
  intl: {
    expansion: 'internationalization',
    tags: ['i18n', 'localization'],
    canonicalTools: ['intl-flutter'],
    description: 'Internationalization (Intl)',
  },

  // --- PROGRAMMING LANGUAGES & ECOSYSTEMS ---
  ts: {
    expansion: 'typescript',
    ecosystem: 'javascript',
    tags: ['typescript', 'typesafe'],
    description: 'TypeScript (TS)',
  },
  js: {
    expansion: 'javascript',
    ecosystem: 'javascript',
    canonicalTools: ['javascript'],
    tags: ['javascript'],
    description: 'JavaScript (JS)',
  },
  ecmascript: {
    expansion: 'javascript',
    ecosystem: 'javascript',
    canonicalTools: ['javascript'],
    tags: ['javascript', 'ecmascript'],
    description: 'ECMAScript (JavaScript standard)',
  },
  py: {
    expansion: 'python',
    ecosystem: 'python',
    tags: ['python'],
    description: 'Python (Py)',
  },
  rs: {
    expansion: 'rust',
    ecosystem: 'rust',
    tags: ['rust'],
    description: 'Rust (RS)',
  },
  go: {
    expansion: 'golang',
    ecosystem: 'go',
    tags: ['go', 'golang'],
    description: 'Go / Golang',
  },
  golang: {
    expansion: 'golang',
    ecosystem: 'go',
    tags: ['go', 'golang'],
    description: 'Go / Golang',
  },
  cs: {
    expansion: 'c#',
    ecosystem: 'dotnet',
    tags: ['c#', 'csharp', 'dotnet'],
    description: 'C# (.NET)',
  },
  csharp: {
    expansion: 'c#',
    ecosystem: 'dotnet',
    tags: ['c#', 'csharp', 'dotnet'],
    description: 'C# (.NET)',
  },
  'c#': {
    expansion: 'c#',
    ecosystem: 'dotnet',
    tags: ['c#', 'csharp', 'dotnet'],
    description: 'C# (.NET)',
  },
  cpp: {
    expansion: 'c++',
    ecosystem: 'cpp',
    tags: ['cpp', 'c++'],
    description: 'C++',
  },
  'c++': {
    expansion: 'c++',
    ecosystem: 'cpp',
    tags: ['cpp', 'c++'],
    description: 'C++',
  },

  // --- UI, CLI & APPLICATION ARCHITECTURE ---
  tui: {
    expansion: 'terminal user interface',
    tags: ['cli', 'terminal', 'tui'],
    canonicalTools: ['textual', 'rich'],
    description: 'Terminal UI (TUI)',
  },
  cli: {
    expansion: 'command line interface',
    tags: ['cli', 'terminal'],
    description: 'Command-Line Interface (CLI)',
  },
  pwa: {
    expansion: 'progressive web app',
    category: 'frontend-framework',
    tags: ['pwa', 'mobile', 'web'],
    description: 'Progressive Web App (PWA)',
  },
  spa: {
    expansion: 'single page app',
    category: 'frontend-framework',
    tags: ['spa', 'frontend'],
    description: 'Single-Page Application (SPA)',
  },
  wasm: {
    expansion: 'webassembly',
    tags: ['webassembly', 'wasm'],
    canonicalTools: ['wasm-bindgen'],
    description: 'WebAssembly (WASM)',
  },

  // --- OBSERVABILITY & AI ---
  apm: {
    expansion: 'application performance monitoring',
    category: 'utility',
    tags: ['monitoring', 'telemetry', 'performance'],
    description: 'Application Performance Monitoring (APM)',
  },
  otel: {
    expansion: 'opentelemetry',
    category: 'utility',
    tags: ['opentelemetry', 'telemetry', 'tracing'],
    description: 'OpenTelemetry (OTel)',
  },
  llm: {
    expansion: 'large language model',
    category: 'ai-ml',
    tags: ['ai', 'llm', 'ml'],
    description: 'Large Language Model (LLM)',
  },
  rag: {
    expansion: 'retrieval-augmented generation',
    category: 'ai-ml',
    tags: ['rag', 'vector', 'embeddings', 'ai'],
    description: 'Retrieval-Augmented Generation (RAG)',
  },
  jax: {
    expansion: 'google jax autograd xla',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['jax'],
    tags: ['jax', 'autograd', 'xla', 'ai'],
    description: 'Google JAX Autograd & XLA Accelerator',
  },
  xla: {
    expansion: 'accelerated linear algebra',
    category: 'ai-ml',
    canonicalTools: ['jax', 'tensorflow'],
    tags: ['xla', 'compiler', 'gpu', 'tpu'],
    description: 'Accelerated Linear Algebra (XLA)',
  },
  onnx: {
    expansion: 'open neural network exchange',
    category: 'ai-ml',
    canonicalTools: ['onnxruntime'],
    tags: ['onnx', 'onnxruntime', 'inference', 'ai'],
    description: 'Open Neural Network Exchange (ONNX)',
  },
  ort: {
    expansion: 'onnx runtime accelerator',
    category: 'ai-ml',
    canonicalTools: ['onnxruntime'],
    tags: ['onnxruntime', 'inference'],
    description: 'ONNX Runtime (ORT)',
  },
  deepspeed: {
    expansion: 'distributed model training zero',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['deepspeed'],
    tags: ['deepspeed', 'distributed-training', 'zero'],
    description: 'Microsoft DeepSpeed & ZeRO Optimization',
  },
  zero: {
    expansion: 'zero redundancy optimizer',
    category: 'ai-ml',
    canonicalTools: ['deepspeed'],
    tags: ['deepspeed', 'zero', 'memory-optimization'],
    description: 'Zero Redundancy Optimizer (ZeRO)',
  },
  sglang: {
    expansion: 'high-throughput llm serving radix-attention',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['sglang'],
    tags: ['sglang', 'llm-serving', 'inference'],
    description: 'SGLang LLM Serving & Structured Decoding',
  },
  radix: {
    expansion: 'radix-attention prefix cache reuse',
    category: 'ai-ml',
    canonicalTools: ['sglang'],
    tags: ['sglang', 'radix-attention', 'inference'],
    description: 'RadixAttention Prefix Cache Reuse',
  },
  gguf: {
    expansion: 'quantized gguf local llm inference',
    category: 'ai-ml',
    canonicalTools: ['llama-cpp-python', 'ollama'],
    tags: ['gguf', 'quantization', 'local-llm'],
    description: 'GGUF Quantized Local LLM Format',
  },
  llamacpp: {
    expansion: 'llama.cpp quantized local inference',
    category: 'ai-ml',
    canonicalTools: ['llama-cpp-python', 'ollama'],
    tags: ['llamacpp', 'local-llm', 'inference'],
    description: 'llama.cpp Local Inference',
  },
  faiss: {
    expansion: 'dense vector similarity search clustering',
    category: 'ai-ml',
    canonicalTools: ['faiss'],
    tags: ['faiss', 'vector-search', 'embeddings'],
    description: 'Meta FAISS Similarity Search',
  },
  hnsw: {
    expansion: 'hierarchical navigable small world vector index',
    category: 'ai-ml',
    canonicalTools: ['faiss', 'qdrant'],
    tags: ['hnsw', 'vector-search', 'embeddings'],
    description: 'HNSW Vector Graph Index',
  },
  sbert: {
    expansion: 'sentence transformers text embeddings',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['sentence-transformers'],
    tags: ['sentence-transformers', 'embeddings', 'sbert'],
    description: 'Sentence-BERT (SBERT) Embeddings',
  },
  diffusers: {
    expansion: 'diffusion models image generation flux stable diffusion',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['diffusers'],
    tags: ['diffusers', 'diffusion', 'generative-ai', 'image-generation'],
    description: 'Hugging Face Diffusers Generative AI Library',
  },
  diffusion: {
    expansion: 'generative diffusion pipeline stable diffusion flux',
    category: 'ai-ml',
    canonicalTools: ['diffusers'],
    tags: ['diffusion', 'diffusers'],
    description: 'Diffusion Models',
  },
  flux: {
    expansion: 'flux generative diffusion transformer',
    category: 'ai-ml',
    canonicalTools: ['diffusers'],
    tags: ['flux', 'diffusers'],
    description: 'Flux Diffusion Architecture',
  },
  timm: {
    expansion: 'pytorch image models vision transformers timm',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['timm'],
    tags: ['timm', 'computer-vision', 'vit'],
    description: 'PyTorch Image Models (timm)',
  },
  vit: {
    expansion: 'vision transformer image classification',
    category: 'ai-ml',
    canonicalTools: ['timm'],
    tags: ['vit', 'vision-transformer', 'timm'],
    description: 'Vision Transformer (ViT)',
  },
  trl: {
    expansion: 'transformer reinforcement learning rlhf dpo ppo grpo',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['trl'],
    tags: ['trl', 'rlhf', 'dpo', 'grpo'],
    description: 'TRL Reinforcement Learning & Post-Training',
  },
  dpo: {
    expansion: 'direct preference optimization dpo alignment',
    category: 'ai-ml',
    canonicalTools: ['trl'],
    tags: ['dpo', 'trl', 'alignment'],
    description: 'Direct Preference Optimization (DPO)',
  },
  grpo: {
    expansion: 'group relative policy optimization deepseek r1 trl',
    category: 'ai-ml',
    canonicalTools: ['trl'],
    tags: ['grpo', 'trl', 'alignment'],
    description: 'Group Relative Policy Optimization (GRPO)',
  },
  ragas: {
    expansion: 'rag evaluation metrics faithfulness answer relevancy',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['ragas'],
    tags: ['ragas', 'rag', 'evaluation', 'faithfulness'],
    description: 'Ragas RAG Evaluation Framework',
  },
  guardrails: {
    expansion: 'guardrails ai structured output validation safety',
    category: 'ai-ml',
    ecosystem: 'python',
    canonicalTools: ['guardrails-ai'],
    tags: ['guardrails', 'guardrails-ai', 'validation', 'safety'],
    description: 'Guardrails AI Output Validation',
  },
};

/**
 * Parses and expands a user query using the taxonomy dictionary.
 * Strictly uses word-boundary token matching to avoid spurious substring hits
 * (e.g. 'platform' will never trigger 'tf', 'rates' will never trigger 'ts').
 */
export function expandQueryWithTaxonomy(rawQuery: string): TaxonomyExpansionResult {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return {
      tokens: [],
      synonymTokens: [],
      detectedCategories: [],
      canonicalToolIds: [],
      explanations: [],
    };
  }

  const cleanQuery = rawQuery.trim().toLowerCase();
  if (!cleanQuery) {
    return {
      tokens: [],
      synonymTokens: [],
      detectedCategories: [],
      canonicalToolIds: [],
      explanations: [],
    };
  }

  // Tokenize preserving language characters like 'c++', 'c#', and hyphenated identifiers
  const rawTokens = cleanQuery.split(/[\s,]+/).filter(Boolean);
  const tokens: string[] = [];
  const synonymTokens = new Set<string>();
  const detectedCategories = new Set<SkillCategory>();
  let detectedEcosystem: string | undefined;
  const canonicalToolIds = new Set<string>();
  const explanations: string[] = [];

  for (const rawToken of rawTokens) {
    // Strip peripheral punctuation but retain '+', '#', and internal '-'
    const token = rawToken.replace(/^[^\w+#-]+|[^\w+#-]+$/g, '');
    if (!token || !/[a-z0-9]/i.test(token)) continue;
    tokens.push(token);

    // Exact word taxonomy lookup (defensively guarded against Object prototype properties like 'constructor', '__proto__')
    if (Object.prototype.hasOwnProperty.call(TAXONOMY_MAP, token)) {
      const mapping = TAXONOMY_MAP[token];
      if (mapping && typeof mapping === 'object' && typeof mapping.expansion === 'string') {
        explanations.push(`Taxonomy match "${token}": ${mapping.description || mapping.expansion}`);

        if (mapping.category) {
          detectedCategories.add(mapping.category);
        }
        if (!detectedEcosystem && mapping.ecosystem) {
          detectedEcosystem = mapping.ecosystem;
        }
        if (Array.isArray(mapping.tags)) {
          for (const tag of mapping.tags) {
            synonymTokens.add(tag);
          }
        }
        if (Array.isArray(mapping.canonicalTools)) {
          for (const toolId of mapping.canonicalTools) {
            canonicalToolIds.add(toolId);
          }
        }
        // Add individual words from expansion phrase
        const expansionWords = mapping.expansion.split(/[\s-]+/).filter((w) => w.length >= 2);
        for (const word of expansionWords) {
          synonymTokens.add(word);
        }
      }
    }
  }

  return {
    tokens,
    synonymTokens: Array.from(synonymTokens),
    detectedCategories: Array.from(detectedCategories),
    detectedEcosystem,
    canonicalToolIds: Array.from(canonicalToolIds),
    explanations,
  };
}
