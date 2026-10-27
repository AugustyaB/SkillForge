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
  WorkspaceSkillsConfigSchema,
  validateWorkspaceSkillsConfig,
  safeValidateWorkspaceSkillsConfig,
  validateAddLocalSkillPayload,
  validateRemoveLocalSkillPayload,
  validateIdeationWizardInput,
  validateProjectCharter,
  validateCompileIdeaPromptRequest,
  validateScaffoldProjectRequest,
  validateScaffoldProjectResult,
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
      'mobile',
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

  describe('Workspace Private Catalog Configuration Schemas', () => {
    const validPrivateSkill = {
      id: 'corp-auth',
      name: 'CorpAuth',
      category: 'authentication',
      difficulty: 'intermediate',
      description: 'Internal corporate authentication library with SSO and MFA.',
      whyUseIt: 'Enforces corporate identity policy and security standards.',
      tags: ['auth', 'sso', 'mfa', 'security', 'corp'],
      ecosystem: 'javascript',
      officialUrl: 'https://internal.corp.com/docs/auth',
      learnResources: [
        { label: 'Internal Wiki', url: 'https://internal.corp.com/wiki/auth', type: 'docs' },
      ],
      alternatives: ['next-auth', 'clerk'],
      worksWellWith: ['fastify'],
      prerequisites: ['node'],
      stackIndicators: ['@corp/auth', 'corp-auth'],
    };

    it('validates workspace config in loose array format', () => {
      expect(WorkspaceSkillsConfigSchema.safeParse([validPrivateSkill]).success).toBe(true);
      const result = validateWorkspaceSkillsConfig([validPrivateSkill]);
      expect(result.skills).toHaveLength(1);
      expect(result.skills[0]?.id).toBe('corp-auth');
      expect(result.skills[0]?.source).toBe('workspace');
      expect(result.skills[0]?.license).toBe('MIT');
      expect(result.overrides).toEqual({});
    });

    it('validates workspace config in structured object format with overrides', () => {
      const config = {
        version: '1.0',
        skills: [validPrivateSkill],
        overrides: {
          recoil: {
            isDeprecated: true,
            deprecatedReason: 'Migrated to corp-state',
            migrationTarget: 'corp-state',
          },
        },
      };

      expect(WorkspaceSkillsConfigSchema.safeParse(config).success).toBe(true);
      const result = validateWorkspaceSkillsConfig(config);
      expect(result.skills).toHaveLength(1);
      expect(result.skills[0]?.id).toBe('corp-auth');
      expect(result.skills[0]?.source).toBe('workspace');
      expect(result.overrides.recoil).toBeDefined();
      expect(result.overrides.recoil?.migrationTarget).toBe('corp-state');
    });

    it('detects duplicate skill IDs within workspace config', () => {
      expect(() =>
        validateWorkspaceSkillsConfig([validPrivateSkill, { ...validPrivateSkill }])
      ).toThrow(/Duplicate workspace skill ID detected/);
    });

    it('safely handles malformed workspace config without crashing', () => {
      const invalid = safeValidateWorkspaceSkillsConfig({
        version: 123, // invalid type
        skills: [{ id: 'bad skill with spaces' }],
      });
      expect(invalid.success).toBe(false);
    });

    it('validates AddLocalSkillPayload and normalizes defaults', () => {
      const payload = {
        workspaceRoot: '/path/to/project',
        skill: validPrivateSkill,
      };
      const validated = validateAddLocalSkillPayload(payload);
      expect(validated.workspaceRoot).toBe('/path/to/project');
      expect(validated.overwrite).toBe(true);
      expect(validated.skill.source).toBe('workspace');
      expect(validated.skill.license).toBe('MIT');
    });

    it('rejects AddLocalSkillPayload with missing root or invalid skill', () => {
      expect(() => validateAddLocalSkillPayload({ workspaceRoot: '', skill: validPrivateSkill })).toThrow();
      expect(() => validateAddLocalSkillPayload({ workspaceRoot: '/path', skill: { id: 'bad' } })).toThrow();
    });

    it('validates RemoveLocalSkillPayload', () => {
      const payload = {
        workspaceRoot: '/path/to/project',
        skillId: 'corp-auth',
      };
      const validated = validateRemoveLocalSkillPayload(payload);
      expect(validated.workspaceRoot).toBe('/path/to/project');
      expect(validated.skillId).toBe('corp-auth');
    });
  });

  describe('Project Studio & Ideation Schemas (v1.2.0)', () => {
    it('validates IdeationWizardInput with defaults', () => {
      const input = validateIdeationWizardInput({});
      expect(input.persona).toBe('fresher-student');
      expect(input.domain).toBe('devtools-cli');
      expect(input.ecosystem).toBe('recommend');
      expect(input.timeBudget).toBe('two-week-deep-dive');
    });

    it('validates custom domain and persona in IdeationWizardInput', () => {
      const input = validateIdeationWizardInput({
        persona: 'working-professional',
        domain: 'custom',
        customDomain: 'Bioinformatics Pipeline',
        ecosystem: 'python',
        timeBudget: 'production-mvp',
        learningGoal: 'Mastering distributed task queues with Celery and Redis',
      });
      expect(input.persona).toBe('working-professional');
      expect(input.customDomain).toBe('Bioinformatics Pipeline');
      expect(input.ecosystem).toBe('python');
    });

    it('validates a complete and structured ProjectCharter', () => {
      const validCharter = {
        id: 'campus-lost-found',
        title: 'Campus Beacon: Real-Time Lost & Found',
        tagline: 'Instant lost item matching with Telegram alerts and fuzzy search',
        targetPersona: 'fresher-student',
        domain: 'campus-social',
        problemStatement: 'College students lose essentials constantly with no centralized reliable retrieval system.',
        technicalTwist: 'Automated image classification with MobileNet and real-time Telegram bot alerts.',
        timeBudget: 'two-week-deep-dive',
        recommendedSkills: ['fastapi', 'sqlite3', 'pydantic'],
        architecturePattern: 'REST API + Telegram Webhook + SQLite',
        milestones: [
          {
            phase: 1,
            name: 'Core Storage & API',
            objective: 'Build SQLite schemas and CRUD REST endpoints',
            deliverables: ['Database schema', 'CRUD endpoints for items', 'Unit tests'],
          },
          {
            phase: 2,
            name: 'Telegram Bot & Fuzzy Search',
            objective: 'Integrate python-telegram-bot and rapidfuzz',
            deliverables: ['Bot webhook', 'Fuzzy matching algorithm'],
          },
        ],
        antiPatternsToAvoid: ['Do not use heavy multi-node Kafka for a campus tool'],
      };

      const charter = validateProjectCharter(validCharter);
      expect(charter.title).toBe('Campus Beacon: Real-Time Lost & Found');
      expect(charter.recommendedSkills).toHaveLength(3);
      expect(charter.milestones).toHaveLength(2);
    });

    it('rejects ProjectCharter with empty milestones or zero recommended skills', () => {
      expect(() =>
        validateProjectCharter({
          id: 'bad-charter',
          title: 'Bad Charter',
          tagline: 'Short tagline',
          targetPersona: 'intermediate',
          domain: 'fintech',
          problemStatement: 'Problem is too short to pass validation constraints',
          technicalTwist: 'Short',
          timeBudget: 'weekend-hackathon',
          recommendedSkills: [], // invalid: empty
          architecturePattern: 'Microservices',
          milestones: [], // invalid: empty
        })
      ).toThrow();
    });

    it('validates ScaffoldProjectRequest and normalizes target rules format', () => {
      const req = validateScaffoldProjectRequest({
        workspacePath: '/my/workspace',
        charter: {
          id: 'dev-linter',
          title: 'Git Commit Sentinel',
          tagline: 'Fast local Git commit message and secret scanner CLI',
          targetPersona: 'intermediate',
          domain: 'devtools-cli',
          problemStatement: 'Engineers accidentally commit API keys and poorly formatted commit messages.',
          technicalTwist: 'Zero-dependency binary scanner with regex bloom filter.',
          timeBudget: 'weekend-hackathon',
          recommendedSkills: ['rust', 'clap'],
          architecturePattern: 'CLI Binary',
          milestones: [
            {
              phase: 1,
              name: 'CLI Parser & Regex Engine',
              objective: 'Implement Clap arguments and secret rules',
              deliverables: ['Scanner binary', 'Test suite'],
            },
          ],
        },
      });

      expect(req.workspacePath).toBe('/my/workspace');
      expect(req.targetRulesFormat).toBe('cursor-rule');
      expect(req.overwriteExisting).toBe(false);

      const promptReq = validateCompileIdeaPromptRequest({
        input: { persona: 'fresher-student', domain: 'campus-social' },
        isWildcard: false,
      });
      expect(promptReq.isWildcard).toBe(false);

      const scaffoldResult = validateScaffoldProjectResult({
        success: true,
        createdFiles: ['PROJECT_SPEC.md', 'README.md'],
        skippedFiles: [],
        warnings: [],
        message: 'Scaffolded cleanly',
      });
      expect(scaffoldResult.success).toBe(true);
    });
  });
});

