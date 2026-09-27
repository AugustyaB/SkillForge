import { describe, it, expect } from 'vitest';
import {
  DifficultySchema,
  SkillCategorySchema,
  SkillSchema,
  validateSkill,
  validateSkillsArray,
  safeValidateSkill,
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
