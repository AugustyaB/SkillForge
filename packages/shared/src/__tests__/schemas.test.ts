import { describe, it, expect } from 'vitest';
import {
  DifficultySchema,
  SkillCategorySchema,
  SkillSchema,
  validateSkill,
  validateSkillsArray,
  safeValidateSkill,
  validateRawSuggestion,
  safeValidateRawSuggestion,
  ProviderTypeSchema,
  ProviderConfigSchema,
  FeedbackPayloadSchema,
  SkillRequestPayloadSchema,
  validateProviderConfig,
  validateFeedbackPayload,
  validateSkillRequestPayload,
  SkillBookmarkSchema,
  ComparisonRequestSchema,
  ComparisonMatrixSchema,
  validateSkillBookmark,
  validateComparisonRequest,
  validateComparisonMatrix,
} from '../index.js';

describe('SkillForge Zod Schemas', () => {
  const validSkill = {
    id: 'fastify',
    name: 'Fastify',
    category: 'backend-framework',
    difficulty: 'intermediate',
    description: 'Extremely fast and low overhead web framework for Node.js.',
    whyUseIt: 'High throughput, built-in schema validation, and TypeScript support.',
    tags: ['fastify', 'backend', 'rest', 'api', 'http'],
    ecosystem: 'javascript',
    officialUrl: 'https://fastify.dev',
    learnResources: [
      { label: 'Documentation', url: 'https://fastify.dev/docs/latest/', type: 'docs' },
    ],
    alternatives: ['express', 'koa', 'nest'],
    worksWellWith: ['pino', 'typebox', 'prisma'],
    prerequisites: ['javascript', 'nodejs'],
    stackIndicators: ['fastify'],
  };

  it('validates a well-formed skill object', () => {
    const result = validateSkill(validSkill);
    expect(result.id).toBe('fastify');
    expect(result.name).toBe('Fastify');
    expect(result.category).toBe('backend-framework');

    const directParsed = SkillSchema.parse(validSkill);
    expect(directParsed.id).toBe('fastify');
  });

  it('rejects skill with invalid ID format (uppercase or spaces)', () => {
    const invalidIdSkill = {
      ...validSkill,
      id: 'Fastify Framework!',
    };

    expect(() => validateSkill(invalidIdSkill)).toThrow();
    const safeResult = safeValidateSkill(invalidIdSkill);
    expect(safeResult.success).toBe(false);
  });

  it('rejects skill with invalid URL format', () => {
    const invalidUrlSkill = {
      ...validSkill,
      officialUrl: 'not-a-valid-url',
    };

    expect(() => validateSkill(invalidUrlSkill)).toThrow();
  });

  it('rejects skill with too short description', () => {
    const shortDescSkill = {
      ...validSkill,
      description: 'Short',
    };

    expect(() => validateSkill(shortDescSkill)).toThrow();
  });

  it('rejects skill with empty tags array', () => {
    const noTagsSkill = {
      ...validSkill,
      tags: [],
    };

    expect(() => validateSkill(noTagsSkill)).toThrow();
  });

  it('validates all difficulty levels', () => {
    expect(DifficultySchema.parse('beginner')).toBe('beginner');
    expect(DifficultySchema.parse('intermediate')).toBe('intermediate');
    expect(DifficultySchema.parse('advanced')).toBe('advanced');
    expect(() => DifficultySchema.parse('expert')).toThrow();
  });

  it('validates all 15 skill categories', () => {
    const categories = [
      'frontend-framework',
      'ui-library',
      'state-management',
      'backend-framework',
      'database',
      'orm',
      'authentication',
      'api-protocol',
      'devops-container',
      'cloud-hosting',
      'testing',
      'utility',
      'ai-ml',
      'security',
      'other',
    ];

    for (const cat of categories) {
      expect(SkillCategorySchema.parse(cat)).toBe(cat);
    }
    expect(() => SkillCategorySchema.parse('invalid-category')).toThrow();
  });

  it('validates array of skills and detects duplicate IDs', () => {
    const skillsList = [
      validSkill,
      {
        ...validSkill,
        id: 'express',
        name: 'Express',
        stackIndicators: ['express'],
      },
    ];

    const validList = validateSkillsArray(skillsList);
    expect(validList).toHaveLength(2);

    const duplicateList = [validSkill, { ...validSkill, name: 'Duplicate Fastify' }];
    expect(() => validateSkillsArray(duplicateList)).toThrow(/Duplicate skill ID/);
  });
});

describe('RawSuggestionSchema', () => {
  it('accepts a valid minimal raw suggestion (name only)', () => {
    const result = validateRawSuggestion({ name: 'Express' });
    expect(result.name).toBe('Express');
    expect(result.id).toBeUndefined();
    expect(result.confidence).toBeUndefined();
  });

  it('accepts a fully populated raw suggestion', () => {
    const raw = {
      name: 'Fastify',
      id: 'fastify',
      category: 'backend-framework',
      difficulty: 'intermediate',
      description: 'Fast and low overhead web framework for Node.js',
      whyUseIt: 'High throughput, built-in schema validation, and TypeScript support.',
      officialUrl: 'https://fastify.dev',
      confidence: 0.92,
      reasoning: 'Great for building REST APIs',
      ecosystem: 'javascript',
      tags: ['backend', 'api'],
    };

    const result = validateRawSuggestion(raw);
    expect(result.name).toBe('Fastify');
    expect(result.confidence).toBe(0.92);
    expect(result.category).toBe('backend-framework');
  });

  it('rejects raw suggestion with invalid URL', () => {
    expect(() =>
      validateRawSuggestion({
        name: 'BadUrl',
        officialUrl: 'not-a-url',
      })
    ).toThrow();
  });

  it('rejects raw suggestion with confidence > 1', () => {
    const safeResult = safeValidateRawSuggestion({
      name: 'TooConfident',
      confidence: 1.5,
    });
    expect(safeResult.success).toBe(false);
  });

  it('rejects raw suggestion with confidence < 0', () => {
    const safeResult = safeValidateRawSuggestion({
      name: 'NegativeConfidence',
      confidence: -0.1,
    });
    expect(safeResult.success).toBe(false);
  });

  it('rejects raw suggestion with missing name', () => {
    expect(() => validateRawSuggestion({ id: 'no-name' })).toThrow();
  });

  it('rejects raw suggestion with invalid ID format', () => {
    const safeResult = safeValidateRawSuggestion({
      name: 'BadId',
      id: 'Invalid ID!',
    });
    expect(safeResult.success).toBe(false);
  });

  describe('Provider Configuration Schemas', () => {
    it('validates supported provider types', () => {
      expect(ProviderTypeSchema.parse('local')).toBe('local');
      expect(ProviderTypeSchema.parse('openai')).toBe('openai');
      expect(ProviderTypeSchema.parse('gemini')).toBe('gemini');
      expect(ProviderTypeSchema.parse('hybrid')).toBe('hybrid');
      expect(() => ProviderTypeSchema.parse('anthropic')).toThrow();
      expect(() => ProviderTypeSchema.parse('')).toThrow();
    });

    it('validates provider config with defaults', () => {
      const config = validateProviderConfig({});
      expect(config.provider).toBe('local');
      expect(ProviderConfigSchema.parse({}).provider).toBe('local');
    });

    it('validates full BYOK provider config', () => {
      const config = validateProviderConfig({
        provider: 'openai',
        apiKey: 'sk-test-key-1234',
        model: 'gpt-4o-mini',
        endpoint: 'https://api.openai.com/v1',
        temperature: 0.2,
        dualPassValidation: true,
        timeoutMs: 4000,
      });

      expect(config.provider).toBe('openai');
      expect(config.apiKey).toBe('sk-test-key-1234');
      expect(config.endpoint).toBe('https://api.openai.com/v1');
      expect(config.timeoutMs).toBe(4000);
    });

    it('rejects provider config with invalid endpoint URL or temperature out of range', () => {
      expect(() =>
        validateProviderConfig({
          provider: 'openai',
          endpoint: 'not-a-valid-url',
        })
      ).toThrow();

      expect(() =>
        validateProviderConfig({
          provider: 'openai',
          temperature: 3.5,
        })
      ).toThrow();
    });
  });

  describe('Feedback & Skill Request Schemas', () => {
    it('validates positive feedback payload', () => {
      const payload = validateFeedbackPayload({
        query: 'rest api with auth',
        skillId: 'fastify',
        rating: 'helpful',
        timestamp: Date.now(),
      });

      expect(payload.rating).toBe('helpful');
      expect(payload.query).toBe('rest api with auth');
      expect(FeedbackPayloadSchema.parse(payload).rating).toBe('helpful');
    });

    it('validates negative feedback with 1-click other reason and no mandatory text', () => {
      const payload = validateFeedbackPayload({
        query: 'chat app',
        skillId: 'socketio',
        rating: 'unhelpful',
        reason: 'other',
        timestamp: Date.now(),
      });

      expect(payload.rating).toBe('unhelpful');
      expect(payload.reason).toBe('other');
      expect(payload.details).toBeUndefined();
    });

    it('validates negative feedback with optional details when provided', () => {
      const payload = validateFeedbackPayload({
        query: 'chat app',
        skillId: 'socketio',
        rating: 'unhelpful',
        reason: 'outdated',
        details: 'Prefer modern WebSockets or SSE alternatives like uWebSockets.js',
        timestamp: Date.now(),
      });

      expect(payload.reason).toBe('outdated');
      expect(payload.details).toContain('modern WebSockets');
    });

    it('rejects feedback with invalid reason or missing query', () => {
      expect(() =>
        validateFeedbackPayload({
          query: '',
          rating: 'helpful',
          timestamp: Date.now(),
        })
      ).toThrow();

      expect(() =>
        validateFeedbackPayload({
          query: 'fast db',
          rating: 'unhelpful',
          reason: 'completely_broken' as unknown as 'other',
          timestamp: Date.now(),
        })
      ).toThrow();
    });

    it('validates skill request contribution payload', () => {
      const req = validateSkillRequestPayload({
        skillName: 'effect-ts',
        category: 'backend-framework',
        ecosystem: 'typescript',
        reason: 'Robust functional effect system gaining huge traction in TS community',
        timestamp: Date.now(),
      });

      expect(req.skillName).toBe('effect-ts');
      expect(req.category).toBe('backend-framework');
      expect(SkillRequestPayloadSchema.parse(req).skillName).toBe('effect-ts');
    });

    it('rejects skill request with empty name', () => {
      expect(() =>
        validateSkillRequestPayload({
          skillName: '',
          timestamp: Date.now(),
        })
      ).toThrow();
    });
  });

  describe('SkillBookmark & Comparison Schemas (Phase 7)', () => {
    const sampleBookmark = {
      id: 'fastify',
      name: 'Fastify',
      ecosystem: 'javascript',
      category: 'backend-framework' as const,
      difficulty: 'intermediate' as const,
      description: 'Extremely fast web framework',
      whyUseIt: 'High throughput and low overhead',
      officialUrl: 'https://fastify.dev',
      tags: ['fastify', 'backend'],
      stackIndicators: ['fastify'],
      trustTier: 'verified' as const,
      timestamp: Date.now(),
      notes: 'Evaluate for microservice architecture',
    };

    it('validates a well-formed skill bookmark', () => {
      const result = validateSkillBookmark(sampleBookmark);
      expect(result.id).toBe('fastify');
      expect(result.trustTier).toBe('verified');
      expect(result.notes).toContain('microservice');
      expect(SkillBookmarkSchema.parse(result).name).toBe('Fastify');
    });

    it('rejects invalid bookmark with missing whyUseIt or invalid URL (Anti-Happy-Path)', () => {
      expect(() =>
        validateSkillBookmark({
          ...sampleBookmark,
          whyUseIt: '',
        })
      ).toThrow();

      expect(() =>
        validateSkillBookmark({
          ...sampleBookmark,
          officialUrl: 'not-a-valid-url',
        })
      ).toThrow();
    });

    it('validates multi-skill comparison request (2 to 3 skills)', () => {
      const req2 = validateComparisonRequest({
        skillIds: ['fastify', 'express'],
      });
      expect(req2.skillIds).toEqual(['fastify', 'express']);

      const req3 = validateComparisonRequest({
        skillIds: ['fastify', 'express', 'hono'],
      });
      expect(req3.skillIds).toHaveLength(3);
      expect(ComparisonRequestSchema.parse(req3).skillIds).toHaveLength(3);
    });

    it('rejects comparison request with fewer than 2 or more than 3 skills (Anti-Happy-Path)', () => {
      expect(() =>
        validateComparisonRequest({
          skillIds: ['fastify'],
        })
      ).toThrow('Must provide at least 2 skills to compare');

      expect(() =>
        validateComparisonRequest({
          skillIds: ['fastify', 'express', 'hono', 'koa'],
        })
      ).toThrow('Cannot compare more than 3 skills simultaneously');
    });

    it('validates full side-by-side comparison matrix payload', () => {
      const col1 = {
        id: 'fastify',
        name: 'Fastify',
        ecosystem: 'javascript',
        category: 'backend-framework' as const,
        difficulty: 'intermediate' as const,
        trustTier: 'verified' as const,
        description: 'Fast web framework',
        whyUseIt: 'High throughput',
        pros: ['Very fast', 'Plugin system'],
        caveats: 'Smaller ecosystem than Express',
        worksWellWith: ['pino', 'typebox'],
        stackIndicators: ['fastify'],
        isInstalledInWorkspace: false,
      };

      const col2 = {
        id: 'express',
        name: 'Express',
        ecosystem: 'javascript',
        category: 'backend-framework' as const,
        difficulty: 'beginner' as const,
        trustTier: 'verified' as const,
        description: 'Standard web framework',
        whyUseIt: 'Massive ecosystem',
        pros: ['Huge ecosystem', 'Simple'],
        caveats: 'Lower performance',
        worksWellWith: ['morgan', 'cors'],
        stackIndicators: ['express'],
        isInstalledInWorkspace: true,
      };

      const matrix = validateComparisonMatrix({
        columns: [col1, col2],
        categories: ['backend-framework'],
        isCrossEcosystem: false,
        conflictsDetected: ['fastify vs express: alternative backend frameworks'],
        summary: 'Comparing Fastify vs Express for Node.js backend development.',
      });

      expect(matrix.columns).toHaveLength(2);
      expect(matrix.isCrossEcosystem).toBe(false);
      expect(matrix.conflictsDetected).toHaveLength(1);
      expect(ComparisonMatrixSchema.parse(matrix).columns).toHaveLength(2);
    });

    it('rejects comparison matrix with fewer than 2 columns', () => {
      expect(() =>
        validateComparisonMatrix({
          columns: [
            {
              id: 'single',
              name: 'Single',
              ecosystem: 'javascript',
              category: 'utility',
              difficulty: 'beginner',
              trustTier: 'verified',
              description: 'One',
              whyUseIt: 'Reason',
            },
          ],
          categories: ['utility'],
          isCrossEcosystem: false,
        })
      ).toThrow();
    });
  });
});

