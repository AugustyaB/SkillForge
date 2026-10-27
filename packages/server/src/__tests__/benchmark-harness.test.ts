import { describe, expect, it } from 'vitest';
import {
  calculateDCG,
  calculateIDCG,
  calculateNDCG,
  calculateReciprocalRank,
  calculateMRR,
  calculateHitRate,
} from '../benchmarks/ir-metrics.js';
import { GOLDEN_QUERIES } from '../benchmarks/golden-queries.js';
import { AgentDirectiveEvaluator } from '../benchmarks/agent-directive-evaluator.js';
import { BenchmarkRunner } from '../benchmarks/benchmark-runner.js';
import { SuggestionEngine } from '../engine/suggestion-engine.js';
import { AgentSkillGenerator } from '../engine/agent-skill-generator.js';

describe('SkillForge Evaluation Benchmark Suite', () => {
  describe('Mathematical Precision of IR Metrics', () => {
    it('calculates DCG@k correctly using 2^{rel} - 1 formulation', () => {
      const relevanceMap: Record<string, number> = {
        skillA: 3, // (2^3 - 1) / log2(2) = 7 / 1 = 7.0
        skillB: 2, // (2^2 - 1) / log2(3) = 3 / 1.58496 = 1.892789
        skillC: 1, // (2^1 - 1) / log2(4) = 1 / 2 = 0.5
      };

      // Ranked: [skillA, skillB, skillC]
      const dcgIdeal = calculateDCG(['skillA', 'skillB', 'skillC'], relevanceMap, 3);
      const idcg = calculateIDCG(relevanceMap, 3);
      expect(dcgIdeal).toBe(idcg);
      expect(dcgIdeal).toBeCloseTo(7.0 + 1.892789 + 0.5, 4);

      // Ranked: [skillC, skillB, skillA] (suboptimal)
      const dcgSuboptimal = calculateDCG(['skillC', 'skillB', 'skillA'], relevanceMap, 3);
      // skillC at 1: (2-1)/1 = 1.0; skillB at 2: 3/1.58496 = 1.892789; skillA at 3: 7/2 = 3.5
      expect(dcgSuboptimal).toBeCloseTo(1.0 + 1.892789 + 3.5, 4);
      expect(dcgSuboptimal).toBeLessThan(dcgIdeal);
    });

    it('calculates NDCG@k between 0.0 and 1.0 with ideal ranking yielding exactly 1.0', () => {
      const relevanceMap: Record<string, number> = {
        zustand: 3,
        jotai: 3,
        'redux-toolkit': 2,
      };

      const idealOrder = ['zustand', 'jotai', 'redux-toolkit'];
      const ndcgIdeal = calculateNDCG(idealOrder, relevanceMap, 3);
      expect(ndcgIdeal).toBe(1.0);

      const imperfectOrder = ['redux-toolkit', 'zustand', 'jotai'];
      const ndcgImperfect = calculateNDCG(imperfectOrder, relevanceMap, 3);
      expect(ndcgImperfect).toBeGreaterThan(0.7);
      expect(ndcgImperfect).toBeLessThan(1.0);

      const irrelevantOrder = ['unknown-1', 'unknown-2'];
      const ndcgZero = calculateNDCG(irrelevantOrder, relevanceMap, 3);
      expect(ndcgZero).toBe(0.0);
    });

    it('calculates Reciprocal Rank and MRR accurately', () => {
      const relevanceMap: Record<string, number> = { target: 3 };

      expect(calculateReciprocalRank(['target', 'other'], relevanceMap)).toBe(1.0);
      expect(calculateReciprocalRank(['other', 'target'], relevanceMap)).toBe(0.5);
      expect(calculateReciprocalRank(['other', 'another', 'target'], relevanceMap)).toBeCloseTo(
        1 / 3,
        4
      );
      expect(calculateReciprocalRank(['other', 'another'], relevanceMap)).toBe(0.0);

      const mrr = calculateMRR([
        { queryId: 'q1', query: 'q1', retrieved: ['target'], relevanceMap },
        { queryId: 'q2', query: 'q2', retrieved: ['other', 'target'], relevanceMap },
      ]);
      expect(mrr).toBeCloseTo(0.75, 4);
    });

    it('calculates HitRate@k correctly', () => {
      const records = [
        {
          queryId: '1',
          query: 'q1',
          retrieved: ['match', 'other'],
          relevanceMap: { match: 3 },
        },
        {
          queryId: '2',
          query: 'q2',
          retrieved: ['other', 'match'],
          relevanceMap: { match: 3 },
        },
        {
          queryId: '3',
          query: 'q3',
          retrieved: ['other', 'another'],
          relevanceMap: { match: 3 },
        },
      ];

      expect(calculateHitRate(records, 1)).toBeCloseTo(1 / 3, 4);
      expect(calculateHitRate(records, 2)).toBeCloseTo(2 / 3, 4);
      expect(calculateHitRate(records, 3)).toBeCloseTo(2 / 3, 4);
    });
  });

  describe('Retrieval Benchmark on Golden Query Set (Industry Standards)', () => {
    it('meets or exceeds industry thresholds: MRR >= 0.85, NDCG@5 >= 0.80, HitRate@3 >= 0.90', async () => {
      const runner = new BenchmarkRunner();
      const summary = await runner.runRetrievalBenchmark(GOLDEN_QUERIES);

      // Verify dataset coverage
      expect(summary.totalQueries).toBe(46);
      expect(summary.evaluatableQueries).toBeGreaterThanOrEqual(38);

      // Industry Benchmark Assertions
      expect(summary.mrr).toBeGreaterThanOrEqual(0.85);
      expect(summary.ndcgAt5).toBeGreaterThanOrEqual(0.8);
      expect(summary.hitRateAt3).toBeGreaterThanOrEqual(0.9);
      expect(summary.hitRateAt5).toBeGreaterThanOrEqual(0.95);

      // Latency performance: local search should resolve in sub-millisecond to low millisecond
      expect(summary.latencies.p50Ms).toBeLessThan(15);
      expect(summary.latencies.p95Ms).toBeLessThan(30);
    });
  });

  describe('Agent Directive Quality (SkillsBench & Anthropic Rubric)', () => {
    it('certifies generated skills across ecosystems against all 5 pillars', () => {
      const generator = new AgentSkillGenerator();
      const evaluator = new AgentDirectiveEvaluator();

      const sampleSkills = ['zustand', 'fastapi', 'prisma', 'tokio', 'gin', 'docker', 'vitest'];
      const formats = ['agent-skill', 'claude-skill', 'cursor-rule', 'root-agents'] as const;

      for (const skillId of sampleSkills) {
        for (const format of formats) {
          const generated = generator.generate({ skillId, format });
          const evaluation = evaluator.evaluate(generated);

          expect(
            evaluation.passed,
            `Skill "${skillId}" format "${format}" failed directive evaluation: ${JSON.stringify(evaluation.pillarScores)}`
          ).toBe(true);

          expect(evaluation.overallScore).toBeGreaterThanOrEqual(90);
          expect(evaluation.pillarScores.tokenBudget.passed).toBe(true);
          expect(evaluation.pillarScores.frontmatterIntegrity.passed).toBe(true);
          expect(evaluation.pillarScores.progressiveDisclosure.passed).toBe(true);
          expect(evaluation.pillarScores.deterministicVerification.passed).toBe(true);
          expect(evaluation.pillarScores.codePatternsAndPitfalls.passed).toBe(true);

          // Verify token budget boundaries (between 1,000 and 6,500 characters)
          expect(evaluation.charCount).toBeGreaterThanOrEqual(1000);
          expect(evaluation.charCount).toBeLessThanOrEqual(6500);

          // Verify negative boundary section is present to prevent model hallucinations
          expect(generated.markdownContent).toMatch(
            /(When NOT to Use|When to Avoid|Alternatives to Consider|Anti-Patterns|Common Pitfalls)/i
          );

          // Verify deterministic verification commands exist
          expect(generated.markdownContent).toMatch(
            /(Verification Protocol|Verification Commands?|How to Verify|Testing & Conformance)/i
          );
        }
      }
    });

    it('produces a passing full benchmark report scorecard', async () => {
      const runner = new BenchmarkRunner();
      const report = await runner.runFullReport();

      expect(report.databaseVersion).toBe('DB-v1.2');
      expect(report.allPassed).toBe(true);
      expect(report.directive.complianceRate).toBe(100);

      const scorecard = runner.formatScorecard(report);
      expect(scorecard).toContain('SKILLFORGE EVALUATION BENCHMARK SCORECARD');
      expect(scorecard).toContain('DB-v1.2');
      expect(scorecard).toContain('CERTIFIED PRODUCTION READY');
    });
  });

  describe('Adversarial Query & Fuzzing Resilience', () => {
    it('safely handles hostile inputs without runtime crashes or uncaught exceptions', async () => {
      const engine = new SuggestionEngine();

      // 1. Hostile context with dirty installed array (null, undefined, numbers)
      const dirtyContextRes = await engine.suggest({
        intent: 'state management',
        context: {
          alreadyInstalled: [null as unknown as string, undefined as unknown as string, 42 as unknown as string, 'zustand'],
          activeFileSignals: [null as unknown as { filePath: string; language: string; imports: string[] }, { filePath: '', language: null as unknown as string, imports: [] }],
        },
        options: {
          maxResults: -10, // negative maxResults
        },
      });
      expect(dirtyContextRes).toBeDefined();
      expect(Array.isArray(dirtyContextRes.skills)).toBe(true);
      // Max results should have been clamped between 1 and 50
      expect(dirtyContextRes.skills.length).toBeGreaterThan(0);
      expect(dirtyContextRes.skills.length).toBeLessThanOrEqual(50);

      // 2. Regex syntax characters
      const regexRes = await engine.suggest({
        intent: 'c++ compiler & [regex] (test.*)',
      });
      expect(regexRes).toBeDefined();
      expect(Array.isArray(regexRes.skills)).toBe(true);

      // 3. Typo query tolerance
      const typoRes = await engine.suggest({
        intent: 'dockr compose',
      });
      expect(typoRes.skills.some((s) => s.id === 'docker' || s.id === 'docker-compose')).toBe(true);

      // 4. Pure whitespace and punctuation
      const whitespaceRes = await engine.suggest({
        intent: '     \n\t   ',
      });
      expect(whitespaceRes.skills).toHaveLength(0);

      const punctuationRes = await engine.suggest({
        intent: '!@#$%^&*()_+{}[]:;',
      });
      expect(punctuationRes).toBeDefined();
      expect(Array.isArray(punctuationRes.skills)).toBe(true);
    });
  });
});
