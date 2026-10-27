import * as vscode from 'vscode';
import type {
  IdeationDomain,
  IdeationPersona,
  IdeationWizardInput,
  TimeBudget,
} from '@skillforge/shared';

export interface WizardResult {
  isWildcard: boolean;
  input: IdeationWizardInput;
}

export class ProjectIdeationWizard {
  public static async run(): Promise<WizardResult | undefined> {
    // 1. Choose Mode
    const modeSelection = await vscode.window.showQuickPick(
      [
        {
          label: '$(milestone) Guided Questionnaire',
          description: 'Step-by-step guidance tailored to your experience, stack & time',
          id: 'guided',
        },
        {
          label: '$(sparkle) 🎲 I\'m Feeling Lucky',
          description: 'Instant inspiration pairing modern paradigms with an unexpected twist',
          id: 'wildcard',
        },
      ],
      {
        placeHolder: 'How would you like to formulate your project idea?',
        title: 'SkillForge Project Studio — Mode Selection',
      }
    );

    if (!modeSelection) {
      return undefined;
    }

    if (modeSelection.id === 'wildcard') {
      return {
        isWildcard: true,
        input: {
          persona: 'fresher-student',
          domain: 'devtools-cli',
          ecosystem: 'recommend',
          timeBudget: 'two-week-deep-dive',
        },
      };
    }

    // Guided Flow: Step 1 - Target Persona
    const personaPick = await vscode.window.showQuickPick(
      [
        {
          label: '$(mortar-board) Fresher / College Student',
          description: 'Focus on fundamentals, clean structure, resume talking points & avoid tutorial hell',
          id: 'fresher-student',
        },
        {
          label: '$(tools) Intermediate Developer',
          description: 'Focus on realistic architecture, database modeling, auth & robust testing',
          id: 'intermediate',
        },
        {
          label: '$(briefcase) Working Professional / Senior',
          description: 'Focus on high throughput, distributed state, observability & novel agentic patterns',
          id: 'working-professional',
        },
      ],
      {
        placeHolder: 'Select your target experience level for this project',
        title: 'SkillForge Project Studio (Step 1 of 5): Experience Persona',
      }
    );

    if (!personaPick) {
      return undefined;
    }

    const persona = personaPick.id as IdeationPersona;

    // Step 2 - Domain of Interest
    const domainPick = await vscode.window.showQuickPick(
      [
        { label: '$(terminal) DevTools & CLI', description: 'Linters, analyzers, git utilities, workflow tools', id: 'devtools-cli' },
        { label: '$(circuit-board) AI & LLM Agents', description: 'Local embeddings, offline RAG, tool-calling agents, evals', id: 'ai-agents' },
        { label: '$(organization) Campus & Social Utilities', description: 'Club portals, matchmakers, attendance, peer tools', id: 'campus-social' },
        { label: '$(broadcast) Real-Time Collaboration', description: 'Local-first sync, WebSockets, CRDTs, live whiteboards', id: 'realtime-collab' },
        { label: '$(shield) Observability & Security', description: 'Proxy sentinels, token spend trackers, PII scrubbers', id: 'observability-security' },
        { label: '$(credit-card) FinTech & Personal Finance', description: 'Plain-text accounting, cashflow visualizers, alerts', id: 'fintech' },
        { label: '$(globe) Full-Stack Web Application', description: 'Interactive dashboards, productivity portals', id: 'web-fullstack' },
        { label: '$(package) Open Source Utility', description: 'Fast dead-link checker, markdown parser, formatters', id: 'open-source-utility' },
        { label: '$(edit) Custom Domain...', description: 'Type your own custom problem domain', id: 'custom' },
      ],
      {
        placeHolder: 'Select the domain or industry for your project',
        title: 'SkillForge Project Studio (Step 2 of 5): Domain',
      }
    );

    if (!domainPick) {
      return undefined;
    }

    let domain = domainPick.id as IdeationDomain;
    let customDomain: string | undefined;

    if (domain === 'custom') {
      const customInput = await vscode.window.showInputBox({
        prompt: 'Enter your custom project domain or topic',
        placeHolder: 'e.g., Music Synthesizer, Bioinformatics Pipeline, Smart Home IoT',
      });
      if (!customInput || !customInput.trim()) {
        return undefined;
      }
      customDomain = customInput.trim();
    }

    // Step 3 - Preferred Language / Stack
    const ecoPick = await vscode.window.showQuickPick(
      [
        { label: '$(symbol-keyword) Architect Recommendation', description: 'Let SkillForge select the optimal language and tools', id: 'recommend' },
        { label: '$(symbol-variable) TypeScript / Node.js / React', description: 'Modern full-stack web, API & CLI ecosystem', id: 'typescript' },
        { label: '$(symbol-method) Python / FastAPI / AI', description: 'Data science, machine learning, modern backends', id: 'python' },
        { label: '$(gear) Rust / Systems', description: 'Memory-safe systems programming, blazingly fast CLIs', id: 'rust' },
        { label: '$(server) Go / Cloud Native', description: 'High-concurrency microservices, network tools', id: 'go' },
        { label: '$(coffee) Java / Kotlin', description: 'Enterprise backend, Spring Boot, Android', id: 'java' },
        { label: '$(file-code) C++ / Systems', description: 'Low-latency engines, game logic, memory management', id: 'c++' },
      ],
      {
        placeHolder: 'Select your preferred language or comfort zone',
        title: 'SkillForge Project Studio (Step 3 of 5): Tech Ecosystem',
      }
    );

    if (!ecoPick) {
      return undefined;
    }

    const ecosystem = ecoPick.id;

    // Step 4 - Time Commitment & Scope
    const timePick = await vscode.window.showQuickPick(
      [
        {
          label: '$(watch) Weekend Hackathon (8–12 hours)',
          description: 'Strict MVP limit: 1-2 core flows, local persistence, instant completion',
          id: 'weekend-hackathon',
        },
        {
          label: '$(calendar) 2-Week Deep Dive (20–40 hours)',
          description: 'Polished portfolio piece: Storage, auth, business logic & automated tests',
          id: 'two-week-deep-dive',
        },
        {
          label: '$(rocket) Production MVP (1+ months)',
          description: 'Comprehensive system: Migration scripts, CI/CD, telemetry, production posture',
          id: 'production-mvp',
        },
      ],
      {
        placeHolder: 'How much time do you want to invest in this project?',
        title: 'SkillForge Project Studio (Step 4 of 5): Time Budget',
      }
    );

    if (!timePick) {
      return undefined;
    }

    const timeBudget = timePick.id as TimeBudget;

    // Step 5 - Optional Learning Goal
    const goalInput = await vscode.window.showInputBox({
      prompt: '(Optional) What specific concept, library, or pattern do you want to master? (Press Enter to skip)',
      placeHolder: 'e.g., SQLite full-text search, WebSockets, regex bloom filters, local embeddings',
    });

    const learningGoal = goalInput?.trim() ? goalInput.trim() : undefined;

    return {
      isWildcard: false,
      input: {
        persona,
        domain,
        customDomain,
        ecosystem,
        timeBudget,
        learningGoal,
      },
    };
  }
}
