import type { IdeationPersona, TimeBudget } from '@skillforge/shared';

export interface WildcardSeed {
  domain: string;
  title: string;
  tagline: string;
  twist: string;
  ecosystem: string;
  persona: IdeationPersona;
  timeBudget: TimeBudget;
  recommendedSkills: string[];
}

export const WILDCARD_SEEDS: WildcardSeed[] = [
  {
    domain: 'devtools-cli',
    title: 'Git Commit Sentinel',
    tagline: 'High-speed local git commit auditor and secret leakage barrier',
    twist: 'Zero-config pre-commit binary using regex bloom filters and instant entropy scoring to block accidental API key pushes.',
    ecosystem: 'rust',
    persona: 'intermediate',
    timeBudget: 'weekend-hackathon',
    recommendedSkills: ['rust', 'clap'],
  },
  {
    domain: 'campus-social',
    title: 'Campus Beacon: Lost & Found',
    tagline: 'Telegram-powered campus lost & found with image classification and fuzzy match',
    twist: 'Reverse image matching using lightweight local embeddings + instant Telegram bot notification to matching item owners.',
    ecosystem: 'python',
    persona: 'fresher-student',
    timeBudget: 'two-week-deep-dive',
    recommendedSkills: ['fastapi', 'sqlite3', 'pydantic', 'sentence-transformers'],
  },
  {
    domain: 'ai-agents',
    title: 'Local DocuQuery Engine',
    tagline: '100% offline document search and retrieval engine for research papers',
    twist: 'Runs pure local embeddings with FAISS vector search and ONNX runtime - zero cloud API costs or data privacy leaks.',
    ecosystem: 'python',
    persona: 'intermediate',
    timeBudget: 'two-week-deep-dive',
    recommendedSkills: ['fastapi', 'faiss', 'onnxruntime', 'pydantic'],
  },
  {
    domain: 'observability-security',
    title: 'AI Proxy Sentinel',
    tagline: 'Local reverse proxy intercepting outbound LLM calls for token spend and PII scrubbing',
    twist: 'Calculates real-time token burn per session and redacts credit cards / passwords before requests leave developer machines.',
    ecosystem: 'typescript',
    persona: 'working-professional',
    timeBudget: 'weekend-hackathon',
    recommendedSkills: ['fastify', 'zod', 'pino'],
  },
  {
    domain: 'realtime-collab',
    title: 'SyncFlow: Minimal Collaborative Markdown',
    tagline: 'Local-first collaborative scratchpad with CRDT conflict resolution',
    twist: 'P2P synchronization over WebSockets with zero database dependency, saving directly to local markdown files.',
    ecosystem: 'typescript',
    persona: 'working-professional',
    timeBudget: 'production-mvp',
    recommendedSkills: ['fastify', 'zod', 'ws'],
  },
  {
    domain: 'fintech',
    title: 'LedgerCraft: Plain-Text Accounting Dashboard',
    tagline: 'Double-entry personal finance visualizer from simple text ledgers',
    twist: 'Parses hledger/beancount syntax into interactive cashflow graphs and anomaly detectors without uploading financial data.',
    ecosystem: 'python',
    persona: 'intermediate',
    timeBudget: 'two-week-deep-dive',
    recommendedSkills: ['fastapi', 'pydantic', 'sqlite3'],
  },
  {
    domain: 'open-source-utility',
    title: 'Markdown Dead-Link Terminator',
    tagline: 'Concurrent asynchronous link-rot auditor for large monorepo documentation',
    twist: 'Uses connection pooling and caching to verify 10,000+ links across markdown files in under 3 seconds with CI output.',
    ecosystem: 'go',
    persona: 'intermediate',
    timeBudget: 'weekend-hackathon',
    recommendedSkills: ['go'],
  },
  {
    domain: 'campus-social',
    title: 'StudySquad: Peer Coding Matchmaker',
    tagline: 'College hackathon and project team formation platform based on complementary tech stacks',
    twist: 'Graph-based recommendation engine matching students based on target tech stack and commit streaks.',
    ecosystem: 'typescript',
    persona: 'fresher-student',
    timeBudget: 'two-week-deep-dive',
    recommendedSkills: ['nextjs', 'tailwind', 'prisma', 'postgresql'],
  },
  {
    domain: 'ai-agents',
    title: 'Agentic Workflow Evaluator',
    tagline: 'Harness for measuring AI agent tool-calling accuracy and cost efficiency',
    twist: 'Runs repeatable mock environments with deterministic evaluation metrics (hit rate, token expenditure, latency).',
    ecosystem: 'python',
    persona: 'working-professional',
    timeBudget: 'production-mvp',
    recommendedSkills: ['fastapi', 'pydantic', 'pytest', 'ragas'],
  },
];

export class WildcardIdeaSynthesizer {
  public static getRandomSeed(): WildcardSeed {
    const idx = Math.floor(Math.random() * WILDCARD_SEEDS.length);
    return WILDCARD_SEEDS[idx] ?? WILDCARD_SEEDS[0]!;
  }

  public static getSeedForPersona(persona: IdeationPersona): WildcardSeed {
    const matching = WILDCARD_SEEDS.filter((s) => s.persona === persona);
    if (matching.length === 0) {
      return this.getRandomSeed();
    }
    const idx = Math.floor(Math.random() * matching.length);
    return matching[idx] ?? this.getRandomSeed();
  }

  public static getAllSeeds(): WildcardSeed[] {
    return [...WILDCARD_SEEDS];
  }
}
