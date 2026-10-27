import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IdeaPromptCompiler } from '../engine/idea-prompt-compiler.js';
import { WildcardIdeaSynthesizer } from '../engine/wildcard-idea-synthesizer.js';
import { ProjectScaffolderEngine } from '../engine/project-scaffolder.js';
import type { ProjectCharter } from '@skillforge/shared';

describe('Project Studio: Ideation, Wildcards & Scaffolding Engine (v1.2.0)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-ideation-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  describe('WildcardIdeaSynthesizer', () => {
    it('returns a well-formed random seed with non-empty fields', () => {
      const seed = WildcardIdeaSynthesizer.getRandomSeed();
      expect(seed.title).toBeTruthy();
      expect(seed.tagline).toBeTruthy();
      expect(seed.twist).toBeTruthy();
      expect(seed.recommendedSkills.length).toBeGreaterThan(0);
      expect(seed.persona).toBeDefined();
    });

    it('returns persona-matched seeds when requested', () => {
      const studentSeed = WildcardIdeaSynthesizer.getSeedForPersona('fresher-student');
      expect(studentSeed.persona).toBe('fresher-student');

      const proSeed = WildcardIdeaSynthesizer.getSeedForPersona('working-professional');
      expect(proSeed.persona).toBe('working-professional');
    });

    it('provides a catalog of curated seeds', () => {
      const all = WildcardIdeaSynthesizer.getAllSeeds();
      expect(all.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('IdeaPromptCompiler', () => {
    const compiler = new IdeaPromptCompiler();

    it('compiles prompt tailored for fresher student with anti-tutorial-hell guidance', () => {
      const compiled = compiler.compile({
        input: {
          persona: 'fresher-student',
          domain: 'campus-social',
          ecosystem: 'python',
          timeBudget: 'two-week-deep-dive',
          learningGoal: 'SQLite & REST API',
        },
        isWildcard: false,
      });

      expect(compiled.systemPrompt).toContain('TARGET DEVELOPER PERSONA: FRESHER-STUDENT');
      expect(compiled.systemPrompt).toContain('Avoid tutorial hell');
      expect(compiled.systemPrompt).toContain('Strictly discourage complex enterprise overhead');
      expect(compiled.userPrompt).toContain('Experience Level: fresher-student');
      expect(compiled.recommendedCatalogSkills).toContain('fastapi');
    });

    it('compiles prompt tailored for working professional with production posture', () => {
      const compiled = compiler.compile({
        input: {
          persona: 'working-professional',
          domain: 'observability-security',
          ecosystem: 'typescript',
          timeBudget: 'production-mvp',
          learningGoal: 'Distributed telemetry & PII scrub',
        },
        isWildcard: false,
      });

      expect(compiled.systemPrompt).toContain('TARGET DEVELOPER PERSONA: WORKING-PROFESSIONAL');
      expect(compiled.systemPrompt).toContain('distributed state');
      expect(compiled.systemPrompt).toContain('COMPREHENSIVE ROADMAP');
    });

    it('enforces strict MVP limit for weekend hackathon time budgets', () => {
      const compiled = compiler.compile({
        input: {
          persona: 'intermediate',
          domain: 'devtools-cli',
          ecosystem: 'rust',
          timeBudget: 'weekend-hackathon',
        },
        isWildcard: false,
      });

      expect(compiled.systemPrompt).toContain('STRICT MVP LIMIT');
      expect(compiled.systemPrompt).toContain('8-12 hours');
    });

    it('safely handles hostile inputs with regex chars without crashing (ADV-01)', () => {
      const compiled = compiler.compile({
        input: {
          persona: 'intermediate',
          domain: 'custom',
          customDomain: 'C++ & Rust Regex Engine [a-z0-9]+ (.*)',
          ecosystem: 'c++',
          timeBudget: 'weekend-hackathon',
          learningGoal: 'Build Paxos DB in 2 hours with ${env:PATH} and \\d+',
        },
        isWildcard: false,
      });

      expect(compiled.userPrompt).toContain('C++ & Rust Regex Engine');
      expect(compiled.userPrompt).toContain('ProjectCharterSchema');
      expect(compiled.systemPrompt).toContain('VALID JSON ONLY');
    });

    it('compiles wildcard prompt with injected twist seed', () => {
      const compiled = compiler.compile({
        input: {
          persona: 'fresher-student',
          domain: 'devtools-cli',
          ecosystem: 'recommend',
          timeBudget: 'two-week-deep-dive',
        },
        isWildcard: true,
      });

      expect(compiled.suggestedTwistSeed).toBeDefined();
      expect(compiled.userPrompt).toContain('Inspirational Seed');
    });
  });

  describe('ProjectScaffolderEngine', () => {
    const scaffolder = new ProjectScaffolderEngine();

    const sampleCharter: ProjectCharter = {
      id: 'git-sentinel',
      title: 'Git Sentinel CLI',
      tagline: 'High-speed local secret leakage barrier',
      targetPersona: 'intermediate',
      domain: 'devtools-cli',
      problemStatement: 'Engineers accidentally commit production credentials to public repositories.',
      technicalTwist: 'Sub-millisecond regex bloom filters with entropy heuristic scoring.',
      timeBudget: 'weekend-hackathon',
      recommendedSkills: ['fastify', 'zod'],
      architecturePattern: 'CLI Binary',
      milestones: [
        {
          phase: 1,
          name: 'Parser & Pattern Matching',
          objective: 'Set up CLI argument parsing and regex scanner',
          deliverables: ['Scanner core', 'Pattern test suite'],
        },
      ],
      antiPatternsToAvoid: ['Do not send codebase files to remote cloud APIs'],
    };

    it('scaffolds complete project files into a clean workspace', () => {
      const result = scaffolder.scaffold({
        workspacePath: tempDir,
        charter: sampleCharter,
        targetRulesFormat: 'cursor-rule',
        overwriteExisting: false,
      });

      expect(result.success).toBe(true);
      expect(result.createdFiles).toContain('PROJECT_SPEC.md');
      expect(result.createdFiles).toContain('README.md');
      expect(result.createdFiles).toContain('.skillforge.json');

      // Verify PROJECT_SPEC.md content
      const specContent = fs.readFileSync(path.join(tempDir, 'PROJECT_SPEC.md'), 'utf8');
      expect(specContent).toContain('# 📋 Git Sentinel CLI — Project Specification');
      expect(specContent).toContain('Sub-millisecond regex bloom filters');
      expect(specContent).toContain('### Phase 1: Parser & Pattern Matching');

      // Verify .skillforge.json content
      const configJson = JSON.parse(fs.readFileSync(path.join(tempDir, '.skillforge.json'), 'utf8'));
      expect(configJson.projectName).toBe('Git Sentinel CLI');
      expect(configJson.recommendedSkills).toEqual(['fastify', 'zod']);

      // Verify Cursor rules were generated
      const cursorRulePath = path.join(tempDir, '.cursor', 'rules', 'fastify.mdc');
      expect(fs.existsSync(cursorRulePath)).toBe(true);
    });

    it('preserves existing README.md and creates README.skillforge.md non-destructively (ADV-04)', () => {
      const existingReadmePath = path.join(tempDir, 'README.md');
      fs.writeFileSync(existingReadmePath, '# Existing Important User Documentation\n', 'utf8');

      const result = scaffolder.scaffold({
        workspacePath: tempDir,
        charter: sampleCharter,
        targetRulesFormat: 'cursor-rule',
        overwriteExisting: false,
      });

      expect(result.success).toBe(true);
      // Original README untouched
      const currentReadme = fs.readFileSync(existingReadmePath, 'utf8');
      expect(currentReadme).toBe('# Existing Important User Documentation\n');

      // Non-destructive fallback written
      expect(result.createdFiles).toContain('README.skillforge.md');
      expect(fs.existsSync(path.join(tempDir, 'README.skillforge.md'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('Existing README.md preserved'))).toBe(true);
    });

    it('creates workspace directory automatically if missing', () => {
      const nestedWorkspace = path.join(tempDir, 'nested', 'project', 'dir');
      const result = scaffolder.scaffold({
        workspacePath: nestedWorkspace,
        charter: sampleCharter,
        targetRulesFormat: 'agent-skill',
        overwriteExisting: false,
      });

      expect(result.success).toBe(true);
      expect(fs.existsSync(path.join(nestedWorkspace, 'PROJECT_SPEC.md'))).toBe(true);
      expect(fs.existsSync(path.join(nestedWorkspace, '.agent', 'skills', 'fastify', 'SKILL.md'))).toBe(true);
    });
  });
});
