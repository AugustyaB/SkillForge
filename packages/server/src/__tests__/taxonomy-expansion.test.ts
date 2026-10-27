import { describe, expect, it } from 'vitest';
import { expandQueryWithTaxonomy } from '../data/taxonomy.js';
import { IntentParser } from '../engine/intent-parser.js';
import { SkillsRepository } from '../data/skills-repository.js';
import { SuggestionEngine } from '../engine/suggestion-engine.js';

describe('Phase 2: Structured Synonym & Acronym Taxonomy', () => {
  describe('Taxonomy Dictionary & expansion rules', () => {
    it('accurately maps authn, authz, and sso to authentication domain', () => {
      const authn = expandQueryWithTaxonomy('authn');
      expect(authn.detectedCategories).toContain('authentication');
      expect(authn.synonymTokens).toContain('auth');
      expect(authn.synonymTokens).toContain('authentication');
      expect(authn.explanations.length).toBeGreaterThan(0);

      const authz = expandQueryWithTaxonomy('authz');
      expect(authz.detectedCategories).toContain('authentication');
      expect(authz.synonymTokens).toContain('authorization');

      const sso = expandQueryWithTaxonomy('sso');
      expect(sso.detectedCategories).toContain('authentication');
      expect(sso.synonymTokens).toContain('sso');
    });

    it('accurately maps devops and cloud shorthands (tf, k8s, iac)', () => {
      const tf = expandQueryWithTaxonomy('tf');
      expect(tf.canonicalToolIds).toContain('terraform');
      expect(tf.synonymTokens).toContain('terraform');
      expect(tf.synonymTokens).toContain('iac');

      const k8s = expandQueryWithTaxonomy('k8s');
      expect(k8s.detectedCategories).toContain('devops-container');
      expect(k8s.canonicalToolIds).toContain('kubernetes');

      const iac = expandQueryWithTaxonomy('iac');
      expect(iac.canonicalToolIds).toContain('terraform');
      expect(iac.synonymTokens).toContain('infrastructure');
    });

    it('accurately maps protocols and API paradigms (gql, ws, sse, mq, pubsub)', () => {
      const gql = expandQueryWithTaxonomy('gql');
      expect(gql.detectedCategories).toContain('api-protocol');
      expect(gql.canonicalToolIds).toContain('apollo-graphql');
      expect(gql.synonymTokens).toContain('graphql');

      const mq = expandQueryWithTaxonomy('mq');
      expect(mq.canonicalToolIds).toContain('bullmq');
      expect(mq.synonymTokens).toContain('queue');

      const pubsub = expandQueryWithTaxonomy('pubsub');
      expect(pubsub.canonicalToolIds).toContain('redis');
      expect(pubsub.synonymTokens).toContain('messaging');
    });

    it('accurately maps testing terminology (e2e, tdd, bdd, mock)', () => {
      const e2e = expandQueryWithTaxonomy('e2e');
      expect(e2e.detectedCategories).toContain('testing');
      expect(e2e.canonicalToolIds).toContain('playwright');
      expect(e2e.canonicalToolIds).toContain('cypress');

      const mock = expandQueryWithTaxonomy('mock');
      expect(mock.detectedCategories).toContain('testing');
      expect(mock.canonicalToolIds).toContain('msw');
    });

    it('accurately maps database paradigms (rdbms, nosql, key-value)', () => {
      const rdbms = expandQueryWithTaxonomy('rdbms');
      expect(rdbms.detectedCategories).toContain('database');
      expect(rdbms.synonymTokens).toContain('sql');

      const kv = expandQueryWithTaxonomy('key-value');
      expect(kv.detectedCategories).toContain('database');
      expect(kv.canonicalToolIds).toContain('redis');
    });

    it('accurately maps language and ecosystem shorthands (py, ts, rs, c++)', () => {
      const py = expandQueryWithTaxonomy('py');
      expect(py.detectedEcosystem).toBe('python');

      const ts = expandQueryWithTaxonomy('ts');
      expect(ts.detectedEcosystem).toBe('javascript');

      const rs = expandQueryWithTaxonomy('rs');
      expect(rs.detectedEcosystem).toBe('rust');

      const cpp = expandQueryWithTaxonomy('c++');
      expect(cpp.detectedEcosystem).toBe('cpp');
    });
  });

  describe('Anti-Happy-Path & Substring Boundary Defenses', () => {
    it('does not trigger false positive taxonomy matches for words containing acronym substrings', () => {
      // 'platform' contains 'tf'
      const platformRes = expandQueryWithTaxonomy('platform');
      expect(platformRes.canonicalToolIds).not.toContain('terraform');
      expect(platformRes.tokens).toEqual(['platform']);

      // 'rates' contains 'ts'
      const ratesRes = expandQueryWithTaxonomy('rates');
      expect(ratesRes.detectedEcosystem).toBeUndefined();

      // 'shift' contains 'tf'
      const shiftRes = expandQueryWithTaxonomy('shift');
      expect(shiftRes.canonicalToolIds).not.toContain('terraform');

      // 'spy' contains 'py'
      const spyRes = expandQueryWithTaxonomy('spy');
      expect(spyRes.detectedEcosystem).toBeUndefined();
    });

    it('safely handles hostile inputs, prototype properties, and malformed queries', () => {
      // Prototype injection attempt
      const protoRes = expandQueryWithTaxonomy('constructor __proto__ toString valueOf');
      expect(protoRes.tokens).toEqual(['constructor', '__proto__', 'tostring', 'valueof']);
      expect(protoRes.synonymTokens).toHaveLength(0);
      expect(protoRes.detectedCategories).toHaveLength(0);

      // Punctuation only
      const punctRes = expandQueryWithTaxonomy('!@#$%^&*()_+');
      expect(punctRes.tokens).toHaveLength(0);
      expect(punctRes.synonymTokens).toHaveLength(0);

      // Empty and whitespace
      expect(expandQueryWithTaxonomy('').tokens).toHaveLength(0);
      expect(expandQueryWithTaxonomy('   \t\n  ').tokens).toHaveLength(0);

      // Null / undefined casting safety
      expect(expandQueryWithTaxonomy(null as unknown as string).tokens).toHaveLength(0);
      expect(expandQueryWithTaxonomy(undefined as unknown as string).tokens).toHaveLength(0);
    });
  });

  describe('IntentParser Integration with Taxonomy', () => {
    const parser = new IntentParser();

    it('enriches detectedCategories and ecosystem from taxonomy', () => {
      const intent = parser.parse('build authn in nextjs');
      expect(intent.actionVerb).toBe('build');
      expect(intent.detectedCategories).toContain('authentication');
      expect(intent.tokens).toContain('auth');
      expect(intent.tokens).toContain('authentication');

      const pyIntent = parser.parse('py backend with rdbms');
      expect(pyIntent.explicitEcosystem).toBe('python');
      expect(pyIntent.detectedCategories).toContain('backend-framework');
      expect(pyIntent.detectedCategories).toContain('database');
    });

    it('enriches devops intent with terraform when tf acronym is used', () => {
      const intent = parser.parse('deploy tf scripts');
      expect(intent.actionVerb).toBe('deploy');
      expect(intent.tokens).toContain('terraform');
      expect(intent.tokens).toContain('iac');
    });
  });

  describe('SkillsRepository & SuggestionEngine End-to-End Ranking', () => {
    const repository = new SkillsRepository();
    const engine = new SuggestionEngine({ repository });

    it('ranks terraform at #1 when querying "tf"', () => {
      const searchRes = repository.search('tf');
      expect(searchRes.length).toBeGreaterThan(0);
      expect(searchRes[0]?.skill.id).toBe('terraform');
      expect(searchRes[0]?.matchReasons.some((r) => r.includes('Canonical tool match'))).toBe(true);
    });

    it('ranks kubernetes at #1 when querying "k8s"', () => {
      const searchRes = repository.search('k8s');
      expect(searchRes.length).toBeGreaterThan(0);
      expect(searchRes[0]?.skill.id).toBe('kubernetes');
    });

    it('ranks authentication tools high when querying "authn"', async () => {
      const result = await engine.suggest({ intent: 'authn' });
      expect(result.skills.length).toBeGreaterThan(0);
      // All top results should be authentication category
      const topCategories = result.skills.slice(0, 3).map((s) => s.category);
      expect(topCategories).toContain('authentication');
    });

    it('ranks apollo-graphql high when querying "gql"', () => {
      const searchRes = repository.search('gql');
      expect(searchRes.length).toBeGreaterThan(0);
      const topIds = searchRes.slice(0, 3).map((s) => s.skill.id);
      expect(topIds).toContain('apollo-graphql');
    });

    it('ranks playwright and cypress high when querying "e2e"', () => {
      const searchRes = repository.search('e2e');
      expect(searchRes.length).toBeGreaterThan(0);
      const topIds = searchRes.slice(0, 5).map((s) => s.skill.id);
      expect(topIds.some((id) => id === 'playwright' || id === 'cypress')).toBe(true);
    });

    it('ranks relational databases high when querying "rdbms"', () => {
      const searchRes = repository.search('rdbms');
      expect(searchRes.length).toBeGreaterThan(0);
      const topCategories = searchRes.slice(0, 3).map((s) => s.skill.category);
      expect(topCategories).toContain('database');
      const topIds = searchRes.map((s) => s.skill.id);
      expect(topIds.some((id) => id === 'postgresql' || id === 'mysql' || id === 'sqlite')).toBe(true);
    });

    it('ranks task queues high when querying "mq"', () => {
      const searchRes = repository.search('mq');
      expect(searchRes.length).toBeGreaterThan(0);
      const topIds = searchRes.slice(0, 5).map((s) => s.skill.id);
      expect(topIds.some((id) => id === 'bullmq' || id === 'celery' || id === 'redis')).toBe(true);
    });

    it('resolves Wave 1 Machine Learning and JavaScript taxonomy expansions accurately', () => {
      // 1. JavaScript shorthand
      const jsRes = repository.search('js');
      expect(jsRes.slice(0, 3).map((s) => s.skill.id)).toContain('javascript');

      const esRes = repository.search('ecmascript');
      expect(esRes[0]?.skill.id).toBe('javascript');

      // 2. JAX & XLA
      const jaxRes = repository.search('jax');
      expect(jaxRes[0]?.skill.id).toBe('jax');

      const xlaRes = repository.search('xla');
      expect(xlaRes.slice(0, 3).map((s) => s.skill.id)).toContain('jax');

      // 3. ONNX Runtime
      const onnxRes = repository.search('onnx');
      expect(onnxRes.slice(0, 3).map((s) => s.skill.id)).toContain('onnxruntime');

      // 4. DeepSpeed & ZeRO
      const dsRes = repository.search('deepspeed');
      expect(dsRes[0]?.skill.id).toBe('deepspeed');

      const zeroRes = repository.search('zero');
      expect(zeroRes.slice(0, 3).map((s) => s.skill.id)).toContain('deepspeed');
    });

    it('resolves Wave 2 LLM Serving, Quantization, and Vector Retrieval expansions accurately', () => {
      // 1. SGLang & RadixAttention
      const sgRes = repository.search('sglang');
      expect(sgRes[0]?.skill.id).toBe('sglang');

      const radixRes = repository.search('radix');
      expect(radixRes.slice(0, 3).map((s) => s.skill.id)).toContain('sglang');

      // 2. llama-cpp-python & GGUF
      const ggufRes = repository.search('gguf');
      expect(ggufRes.slice(0, 3).map((s) => s.skill.id)).toContain('llama-cpp-python');

      const lcRes = repository.search('llamacpp');
      expect(lcRes.slice(0, 3).map((s) => s.skill.id)).toContain('llama-cpp-python');

      // 3. FAISS & HNSW
      const faissRes = repository.search('faiss');
      expect(faissRes[0]?.skill.id).toBe('faiss');

      const hnswRes = repository.search('hnsw');
      expect(hnswRes.slice(0, 3).map((s) => s.skill.id)).toContain('faiss');

      // 4. Sentence Transformers & SBERT
      const sbertRes = repository.search('sbert');
      expect(sbertRes.slice(0, 3).map((s) => s.skill.id)).toContain('sentence-transformers');
    });

    it('resolves Wave 3 Generative Vision, Alignment, and Evaluation expansions accurately', () => {
      // 1. diffusers, diffusion, flux
      const diffRes = repository.search('diffusers');
      expect(diffRes[0]?.skill.id).toBe('diffusers');

      const fluxRes = repository.search('flux');
      expect(fluxRes.slice(0, 3).map((s) => s.skill.id)).toContain('diffusers');

      // 2. timm & vit
      const timmRes = repository.search('timm');
      expect(timmRes[0]?.skill.id).toBe('timm');

      const vitRes = repository.search('vit');
      expect(vitRes.slice(0, 3).map((s) => s.skill.id)).toContain('timm');

      // 3. trl, dpo, grpo
      const trlRes = repository.search('trl');
      expect(trlRes[0]?.skill.id).toBe('trl');

      const dpoRes = repository.search('dpo');
      expect(dpoRes.slice(0, 3).map((s) => s.skill.id)).toContain('trl');

      const grpoRes = repository.search('grpo');
      expect(grpoRes.slice(0, 3).map((s) => s.skill.id)).toContain('trl');

      // 4. ragas
      const ragasRes = repository.search('ragas');
      expect(ragasRes[0]?.skill.id).toBe('ragas');

      // 5. guardrails
      const guardRes = repository.search('guardrails');
      expect(guardRes.slice(0, 3).map((s) => s.skill.id)).toContain('guardrails-ai');
    });
  });
});
