/**
 * SkillForge Benchmark Golden Evaluation Queries (42 Curated Queries).
 * Covers diverse ecosystems:
 * - TypeScript / JavaScript / React / Node
 * - Python / FastAPI / Django / ML
 * - Go / Gin / GORM / Chi
 * - Rust / Tokio / Actix / Axum / Serde
 * - DevOps / Docker / Kubernetes / Terraform
 * - Adversarial / Boundary / Typo resilience
 *
 * Graded relevance scale:
 * 3 = Ideal primary recommendation
 * 2 = Strong secondary / direct alternative
 * 1 = Acceptable domain match
 */

export interface GoldenQuery {
  id: string;
  query: string;
  category: string;
  targetEcosystem?: string;
  alreadyInstalled?: string[];
  expectedSkills: Record<string, number>;
  adversarial?: boolean;
}

export const GOLDEN_QUERIES: GoldenQuery[] = [
  // --- FRONTEND & REACT (10 Queries) ---
  {
    id: 'fe-01',
    query: 'state management with atomic stores and minimal boilerplate',
    category: 'state-management',
    targetEcosystem: 'javascript',
    expectedSkills: {
      zustand: 3,
      jotai: 3,
      'redux-toolkit': 2,
      recoil: 2,
      mobx: 1,
    },
  },
  {
    id: 'fe-02',
    query: 'accessible headless ui primitives for design system',
    category: 'ui-library',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'headless-ui': 3,
      'radix-ui': 3,
      'shadcn-ui': 3,
      'tailwind-css': 2,
      'chakra-ui': 1,
    },
  },
  {
    id: 'fe-03',
    query: 'declarative react animations and gestures',
    category: 'ui-library',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'framer-motion': 3,
      'react-native-reanimated': 2,
      'react-native-gesture-handler': 2,
    },
  },
  {
    id: 'fe-04',
    query: 'typescript schema validation with static type inference',
    category: 'utility',
    targetEcosystem: 'javascript',
    expectedSkills: {
      zod: 3,
      valibot: 3,
      yup: 2,
    },
  },
  {
    id: 'fe-05',
    query: 'fullstack react framework with server components and ssr',
    category: 'frontend-framework',
    targetEcosystem: 'javascript',
    expectedSkills: {
      nextjs: 3,
      remix: 3,
      react: 2,
    },
  },
  {
    id: 'fe-06',
    query: 'server state management caching and background revalidation',
    category: 'state-management',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'tanstack-query': 3,
      swr: 3,
      zustand: 1,
    },
  },
  {
    id: 'fe-07',
    query: 'utility-first css framework with responsive classes',
    category: 'ui-library',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'tailwind-css': 3,
      'styled-components': 1,
      emotion: 1,
    },
  },
  {
    id: 'fe-08',
    query: 'headless table data grid for complex sorting and pagination',
    category: 'ui-library',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'tanstack-table': 3,
      'ag-grid': 2,
    },
  },
  {
    id: 'fe-09',
    query: 'date manipulation formatting and timezone arithmetic',
    category: 'utility',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'date-fns': 3,
      dayjs: 3,
      luxon: 2,
    },
  },
  {
    id: 'fe-10',
    query: 'react icons svg bundle with tree shaking',
    category: 'ui-library',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'lucide-react': 3,
    },
  },

  // --- BACKEND & APIS (7 Queries) ---
  {
    id: 'be-01',
    query: 'high throughput fast nodejs web framework with low overhead',
    category: 'backend-framework',
    targetEcosystem: 'javascript',
    expectedSkills: {
      fastify: 3,
      express: 2,
      hono: 2,
      koa: 1,
    },
  },
  {
    id: 'be-02',
    query: 'python async rest api framework with pydantic schemas',
    category: 'backend-framework',
    targetEcosystem: 'python',
    expectedSkills: {
      fastapi: 3,
      pydantic: 3,
      django: 1,
      flask: 1,
    },
  },
  {
    id: 'be-03',
    query: 'enterprise modular node backend architecture with dependency injection',
    category: 'backend-framework',
    targetEcosystem: 'javascript',
    expectedSkills: {
      nestjs: 3,
      express: 2,
      fastify: 2,
    },
  },
  {
    id: 'be-04',
    query: 'end to end typesafe rpc api without code generation',
    category: 'api-protocol',
    targetEcosystem: 'javascript',
    expectedSkills: {
      trpc: 3,
      grpc: 2,
      'apollo-graphql': 1,
    },
  },
  {
    id: 'be-05',
    query: 'realtime websocket bidirectional event communication',
    category: 'api-protocol',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'socket-io': 3,
      ws: 3,
    },
  },
  {
    id: 'be-06',
    query: 'go web framework and http router',
    category: 'backend-framework',
    targetEcosystem: 'go',
    expectedSkills: {
      gin: 3,
      'go-chi': 3,
      'echo-go': 3,
      'fiber-go': 3,
    },
  },
  {
    id: 'be-07',
    query: 'rust async web server framework and routing',
    category: 'backend-framework',
    targetEcosystem: 'rust',
    expectedSkills: {
      axum: 3,
      'actix-web': 3,
      tokio: 2,
    },
  },

  // --- DATABASE & ORM (6 Queries) ---
  {
    id: 'db-01',
    query: 'typesafe typescript orm with automated migrations for postgres',
    category: 'orm',
    targetEcosystem: 'javascript',
    expectedSkills: {
      prisma: 3,
      'drizzle-orm': 3,
      typeorm: 2,
      postgresql: 1,
    },
  },
  {
    id: 'db-02',
    query: 'sql toolkit and orm for python applications',
    category: 'orm',
    targetEcosystem: 'python',
    expectedSkills: {
      sqlalchemy: 3,
      'tortoise-orm': 2,
    },
  },
  {
    id: 'db-03',
    query: 'in-memory key-value data structure store and redis cache',
    category: 'database',
    expectedSkills: {
      redis: 3,
      'ioredis-pkg': 3,
      'go-redis-pkg': 2,
    },
  },
  {
    id: 'db-04',
    query: 'document oriented nosql database for node',
    category: 'database',
    targetEcosystem: 'javascript',
    expectedSkills: {
      mongodb: 3,
      mongoose: 3,
    },
  },
  {
    id: 'db-05',
    query: 'rust async orm and query builder',
    category: 'orm',
    targetEcosystem: 'rust',
    expectedSkills: {
      'sqlx-rust': 3,
      diesel: 3,
      'sea-orm': 3,
    },
  },
  {
    id: 'db-06',
    query: 'relational database with jsonb support and acid compliance',
    category: 'database',
    expectedSkills: {
      postgresql: 3,
      mysql: 2,
      sqlite: 2,
      supabase: 2,
    },
  },

  // --- DEVOPS & CLOUD (5 Queries) ---
  {
    id: 'ops-01',
    query: 'containerization engine for packaging and running applications',
    category: 'devops-container',
    expectedSkills: {
      docker: 3,
      'docker-compose': 2,
    },
  },
  {
    id: 'ops-02',
    query: 'container orchestration platform for scaling microservices',
    category: 'devops-container',
    expectedSkills: {
      kubernetes: 3,
      helm: 2,
    },
  },
  {
    id: 'ops-03',
    query: 'declarative infrastructure as code cloud provisioning',
    category: 'devops-container',
    expectedSkills: {
      terraform: 3,
      pulumi: 2,
      'aws-cdk': 2,
    },
  },
  {
    id: 'ops-04',
    query: 'automated ci cd workflows and pipeline automation',
    category: 'devops-container',
    expectedSkills: {
      'github-actions': 3,
    },
  },
  {
    id: 'ops-05',
    query: 'frontend and serverless edge deployment platform',
    category: 'cloud-hosting',
    expectedSkills: {
      vercel: 3,
      'cloudflare-workers': 3,
      railway: 2,
    },
  },

  // --- TESTING & QUALITY (5 Queries) ---
  {
    id: 'test-01',
    query: 'fast unit test runner with vite native ESM support',
    category: 'testing',
    targetEcosystem: 'javascript',
    expectedSkills: {
      vitest: 3,
      jest: 2,
    },
  },
  {
    id: 'test-02',
    query: 'reliable end-to-end web browser automation testing',
    category: 'testing',
    expectedSkills: {
      playwright: 3,
      cypress: 3,
    },
  },
  {
    id: 'test-03',
    query: 'python test framework with fixtures and parameterization',
    category: 'testing',
    targetEcosystem: 'python',
    expectedSkills: {
      pytest: 3,
      'pytest-mock': 3,
      'pytest-asyncio': 2,
    },
  },
  {
    id: 'test-04',
    query: 'react component testing DOM utilities',
    category: 'testing',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'testing-library': 3,
      vitest: 1,
      jest: 1,
    },
  },
  {
    id: 'test-05',
    query: 'go unit testing assertion library and mocking suite',
    category: 'testing',
    targetEcosystem: 'go',
    expectedSkills: {
      'testify-go': 3,
    },
  },

  // --- AI & ML (4 Queries) ---
  {
    id: 'ai-01',
    query: 'llm agent orchestration framework with prompts and chains',
    category: 'ai-ml',
    expectedSkills: {
      langchain: 3,
      llamaindex: 3,
      'openai-sdk': 2,
    },
  },
  {
    id: 'ai-02',
    query: 'official openai models api sdk client',
    category: 'ai-ml',
    expectedSkills: {
      'openai-sdk': 3,
    },
  },
  {
    id: 'ai-03',
    query: 'deep learning dynamic neural network computation graph',
    category: 'ai-ml',
    expectedSkills: {
      pytorch: 3,
      tensorflow: 3,
      keras: 2,
    },
  },
  {
    id: 'ai-04',
    query: 'open-source vector database for embeddings and rag search',
    category: 'ai-ml',
    expectedSkills: {
      chromadb: 3,
      qdrant: 3,
      weaviate: 2,
      pgvector: 2,
    },
  },

  // --- SECURITY & AUTH (3 Queries) ---
  {
    id: 'sec-01',
    query: 'authentication and user identity management for nextjs',
    category: 'authentication',
    targetEcosystem: 'javascript',
    expectedSkills: {
      clerk: 3,
      'next-auth': 3,
      lucia: 2,
    },
  },
  {
    id: 'sec-02',
    query: 'http security headers middleware for express and node',
    category: 'security',
    targetEcosystem: 'javascript',
    expectedSkills: {
      helmet: 3,
      cors: 2,
    },
  },
  {
    id: 'sec-03',
    query: 'secure password hashing algorithm',
    category: 'security',
    expectedSkills: {
      argon2: 3,
      bcrypt: 3,
      passlib: 2,
    },
  },

  // --- MOBILE (2 Queries) ---
  {
    id: 'mob-01',
    query: 'cross platform native mobile apps with react and typescript',
    category: 'mobile',
    targetEcosystem: 'javascript',
    expectedSkills: {
      'react-native': 3,
      expo: 3,
      'expo-router': 2,
    },
  },
  {
    id: 'mob-02',
    query: 'multi platform native ui toolkit with dart',
    category: 'mobile',
    expectedSkills: {
      flutter: 3,
    },
  },

  // --- ADVERSARIAL / BOUNDARY / HOSTILE (4 Queries) ---
  {
    id: 'adv-01',
    query: 'c++ regex symbols and compiler flags',
    category: 'utility',
    expectedSkills: {},
    adversarial: true,
  },
  {
    id: 'adv-02',
    query: 'dockr compose container orchestration',
    category: 'devops-container',
    expectedSkills: {
      docker: 3,
      'docker-compose': 3,
    },
    adversarial: true,
  },
  {
    id: 'adv-03',
    query: '   ',
    category: 'empty',
    expectedSkills: {},
    adversarial: true,
  },
  {
    id: 'adv-04',
    query: '!@#$%^&*()_+',
    category: 'punctuation',
    expectedSkills: {},
    adversarial: true,
  },
];
