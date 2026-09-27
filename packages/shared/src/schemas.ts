import { z } from 'zod';

export const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const SkillCategorySchema = z.enum([
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
]);

export const TrustTierSchema = z.enum(['verified', 'validated', 'suggested', 'deprecated']);

export const LearnLinkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['docs', 'tutorial', 'video', 'article']).optional(),
});

export const SkillSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1, 'Name is required'),
  category: SkillCategorySchema,
  difficulty: DifficultySchema,
  description: z.string().min(10, 'Description must be at least 10 characters'),
  whyUseIt: z.string().min(10, 'whyUseIt must be at least 10 characters'),
  tags: z.array(z.string().min(1)).min(1, 'Must have at least one tag'),
  ecosystem: z.string().min(1, 'Ecosystem is required'),
  officialUrl: z.string().url('Must be a valid URL'),
  learnResources: z.array(LearnLinkSchema).min(1, 'Must have at least one learning resource'),
  alternatives: z.array(z.string()),
  worksWellWith: z.array(z.string()),
  prerequisites: z.array(z.string()),
  stackIndicators: z.array(z.string()).min(1, 'Must have at least one stack indicator'),
});

export const PackageHealthSchema = z.object({
  packageExists: z.boolean(),
  lastPublished: z.string().optional(),
  weeklyDownloads: z.number().nonnegative().optional(),
  githubStars: z.number().nonnegative().optional(),
  healthVerdict: z.enum(['healthy', 'aging', 'abandoned', 'risky']).optional(),
  cachedAt: z.number().optional(),
});

export type InferredSkill = z.infer<typeof SkillSchema>;
export type InferredSkillCategory = z.infer<typeof SkillCategorySchema>;
export type InferredDifficulty = z.infer<typeof DifficultySchema>;
export type InferredTrustTier = z.infer<typeof TrustTierSchema>;
export type InferredLearnLink = z.infer<typeof LearnLinkSchema>;
export type InferredPackageHealth = z.infer<typeof PackageHealthSchema>;

/**
 * Validates a single skill record against the schema
 */
export function validateSkill(data: unknown): InferredSkill {
  return SkillSchema.parse(data);
}

/**
 * Safely parses a single skill record
 */
export function safeValidateSkill(data: unknown) {
  return SkillSchema.safeParse(data);
}

/**
 * Validates an array of skills, checking for valid schemas and ID uniqueness
 */
export function validateSkillsArray(data: unknown): InferredSkill[] {
  const parsed = z.array(SkillSchema).parse(data);
  const ids = new Set<string>();

  for (const skill of parsed) {
    if (ids.has(skill.id)) {
      throw new Error(`Duplicate skill ID detected: "${skill.id}"`);
    }
    ids.add(skill.id);
  }

  return parsed;
}
