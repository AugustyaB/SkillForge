import {
  type CompileIdeaPromptRequest,
  type CompiledIdeaPrompt,
  type IdeationWizardInput,
  validateCompileIdeaPromptRequest,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { WildcardIdeaSynthesizer } from './wildcard-idea-synthesizer.js';

export class IdeaPromptCompiler {
  private repository: SkillsRepository;

  constructor(repository?: SkillsRepository) {
    this.repository = repository || new SkillsRepository();
  }

  /**
   * Compiles user questionnaire or wildcard input into a hardened, context-aware prompt.
   */
  public compile(rawRequest: CompileIdeaPromptRequest): CompiledIdeaPrompt {
    const request = validateCompileIdeaPromptRequest(rawRequest);
    const { input, isWildcard } = request;

    let targetPersona = input.persona;
    let targetDomain = input.domain;
    let targetEco = input.ecosystem;
    let targetTime = input.timeBudget;
    let suggestedTwistSeed: string | undefined;

    if (isWildcard) {
      const seed = WildcardIdeaSynthesizer.getRandomSeed();
      targetPersona = seed.persona;
      targetDomain = seed.domain as any;
      targetEco = seed.ecosystem;
      targetTime = seed.timeBudget;
      suggestedTwistSeed = `Inspirational Seed: "${seed.title}" — ${seed.tagline}. Twist: ${seed.twist}`;
    }

    // Query repository for vetted skills matching the ecosystem
    const candidateSkills = this.resolveCandidateSkills(targetEco, targetDomain);
    const candidateIds = candidateSkills.slice(0, 25).map((s) => s.id);

    // Build persona-specific engineering principles
    const personaGuidance = this.getPersonaGuidance(targetPersona);

    // Build time-budget scope pruning rules
    const timeBudgetGuidance = this.getTimeBudgetGuidance(targetTime);

    // Build clean sanitized user prompt description
    const userPrompt = this.buildUserPrompt(input, isWildcard, suggestedTwistSeed);

    const systemPrompt = `You are the SkillForge Principal Software Architect and Engineering Project Mentor.
Your mission is to help a developer formulate a high-impact, non-clichéd software project idea and an actionable implementation specification.

### 👤 TARGET DEVELOPER PERSONA: ${targetPersona.toUpperCase()}
${personaGuidance}

### ⏱️ TIME BUDGET & SCOPE LIMIT: ${targetTime.toUpperCase()}
${timeBudgetGuidance}

### 📦 VETTED SKILLFORGE ECOSYSTEM CATALOG:
When recommending libraries, frameworks, or tools in "recommendedSkills", prioritize the following canonical vetted IDs from our knowledge graph whenever relevant:
${candidateIds.length > 0 ? candidateIds.join(', ') : 'fastapi, sqlite3, pydantic, zod, fastify, react, tailwind, pytest, vitest, rust, clap, go'}

### 🛡️ ANTI-SCOPE-CREEP & QUALITY RULES:
1. NO GENERIC TUTORIAL CLONES: Avoid basic To-Do lists, generic weather dashboards, and uninspired blog clones unless there is a strong technical twist.
2. CONCRETE TECHNICAL TWIST: Every project must include a specific architectural or product twist (e.g. offline-first with CRDTs, regex bloom filters, local embeddings search, Telegram webhooks, PII scrubber proxy).
3. EXTREME SCOPE PRUNING: If the requested goal is excessively complex for the time budget (e.g. building a distributed consensus database in 8 hours), you MUST prune the scope to an achievable micro-subset (e.g. single-threaded in-memory key-value store with binary protocol parsing) and clearly state this in the problem statement.
4. VALID JSON ONLY: You must respond ONLY with a single JSON object with no markdown formatting, backticks, or preamble, strictly conforming to the following structure:
{
  "id": "kebab-case-project-id",
  "title": "Clear Project Title",
  "tagline": "Punchy one-sentence description",
  "targetPersona": "${targetPersona}",
  "domain": "${targetDomain}",
  "problemStatement": "Detailed description of the real-world problem being solved...",
  "technicalTwist": "The unique technical edge or architectural differentiator...",
  "timeBudget": "${targetTime}",
  "recommendedSkills": ["skill-id-1", "skill-id-2", "skill-id-3"],
  "architecturePattern": "e.g., CLI Binary / REST API + SQLite / Event-driven Worker",
  "milestones": [
    {
      "phase": 1,
      "name": "Phase 1: Foundation & Core Logic",
      "objective": "Primary milestone objective",
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    },
    {
      "phase": 2,
      "name": "Phase 2: Integration & User Interface / CLI",
      "objective": "Secondary milestone objective",
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    },
    {
      "phase": 3,
      "name": "Phase 3: Verification & Polish",
      "objective": "Verification, tests, and documentation",
      "deliverables": ["Automated test suite", "README & Architecture docs"]
    }
  ],
  "antiPatternsToAvoid": [
    "Common anti-pattern 1 to avoid in this project",
    "Common anti-pattern 2 to avoid in this project"
  ]
}`;

    return {
      systemPrompt,
      userPrompt,
      recommendedCatalogSkills: candidateIds,
      suggestedTwistSeed,
    };
  }

  private resolveCandidateSkills(ecosystem: string, _domain: string) {
    const all = this.repository.getAllSkills();
    const ecoNorm = (ecosystem || '').toLowerCase().trim();

    return all.filter((s) => {
      if (ecoNorm !== 'recommend' && ecoNorm !== 'all' && ecoNorm !== '') {
        const matchesEco =
          s.ecosystem?.toLowerCase() === ecoNorm ||
          s.id.toLowerCase().includes(ecoNorm) ||
          s.tags.some((t) => t.toLowerCase() === ecoNorm);
        if (!matchesEco) return false;
      }
      return true;
    });
  }

  private getPersonaGuidance(persona: IdeationWizardInput['persona']): string {
    switch (persona) {
      case 'fresher-student':
        return `• Focus on strong Computer Science fundamentals, modular code structure, and interview talking points.
• Avoid tutorial hell. Guide them toward something recruiters immediately respect over generic clones.
• Strictly discourage complex enterprise overhead (e.g. multi-node Kafka, Kubernetes, or microservices). Keep deployment lightweight (SQLite, local files, Docker).`;
      case 'working-professional':
        return `• Focus on production-grade engineering: distributed state, concurrency, high throughput, novel AI agent patterns, observability, or developer productivity.
• Emphasize robust error handling, metrics collection, telemetry, and clean modular boundaries.
• Assume proficiency with fundamental syntax; dive straight into architectural trade-offs.`;
      case 'intermediate':
      default:
        return `• Focus on end-to-end craftsmanship: relational database modeling, auth boundaries, comprehensive testing, and clean REST/WebSocket APIs.
• Encourage standard engineering patterns (Repository pattern, Dependency Injection, validation schemas).`;
    }
  }

  private getTimeBudgetGuidance(timeBudget: IdeationWizardInput['timeBudget']): string {
    switch (timeBudget) {
      case 'weekend-hackathon':
        return `• STRICT MVP LIMIT: Must be achievable in 8-12 hours of total coding time.
• Single binary, single script, or minimal local web server. Local SQLite or JSON persistence.
• Maximum 2 core features. Everything else must be categorized as stretch deliverables.`;
      case 'production-mvp':
        return `• COMPREHENSIVE ROADMAP: Designed for 1+ months of dedicated engineering.
• Includes schema migrations, integration test pipelines, multi-service communication, and deployment manifests.`;
      case 'two-week-deep-dive':
      default:
        return `• POLISHED PORTFOLIO PIECE: Designed for 20-40 hours of focused work.
• Complete vertical slice: Storage + Business Logic + API/UI + Automated Test Harness.`;
    }
  }

  private buildUserPrompt(
    input: IdeationWizardInput,
    isWildcard: boolean,
    suggestedTwistSeed?: string
  ): string {
    if (isWildcard && suggestedTwistSeed) {
      return `Please formulate an innovative project charter based on the following wildcard inspiration:\n${suggestedTwistSeed}`;
    }

    const domainDisplay =
      input.domain === 'custom' && input.customDomain
        ? `Custom Domain: "${input.customDomain}"`
        : `Domain: ${input.domain}`;

    const ecoDisplay = input.ecosystem && input.ecosystem !== 'recommend'
      ? `Preferred Language/Stack: ${input.ecosystem}`
      : 'Preferred Language/Stack: Architect recommendation based on best fit';

    const goalDisplay = input.learningGoal
      ? `Specific Technical Focus: "${input.learningGoal}"`
      : 'Specific Technical Focus: Best modern engineering practices';

    return `Please formulate an innovative, achievable project charter for me:
- Experience Level: ${input.persona}
- ${domainDisplay}
- ${ecoDisplay}
- Time Commitment: ${input.timeBudget}
- ${goalDisplay}

Generate a project with a distinct technical twist that stands out from standard tutorials, and output strictly valid JSON conforming to ProjectCharterSchema.`;
  }
}
