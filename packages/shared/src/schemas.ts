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
  'mobile',
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
 * Schema for validating raw/untrusted suggestion inputs from external
 * sources (LLM, user-provided, etc.) before entering the reliability pipeline.
 */
export const RawSuggestionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with hyphens')
    .optional(),
  category: SkillCategorySchema.optional(),
  difficulty: DifficultySchema.optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  whyUseIt: z.string().min(10, 'whyUseIt must be at least 10 characters').optional(),
  officialUrl: z.string().url('Must be a valid URL').optional(),
  confidence: z.number().min(0).max(1).optional(),
  reasoning: z.string().min(1).optional(),
  ecosystem: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type InferredRawSuggestion = z.infer<typeof RawSuggestionSchema>;

/**
 * Validates a raw suggestion input against the schema.
 * Throws on invalid data.
 */
export function validateRawSuggestion(data: unknown): InferredRawSuggestion {
  return RawSuggestionSchema.parse(data);
}

/**
 * Safely parses a raw suggestion input, returning success/failure result.
 */
export function safeValidateRawSuggestion(data: unknown) {
  return RawSuggestionSchema.safeParse(data);
}

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

/**
 * Supported Suggestion Provider Types
 */
export const ProviderTypeSchema = z.enum(['local', 'openai', 'gemini', 'hybrid']);
export type InferredProviderType = z.infer<typeof ProviderTypeSchema>;

/**
 * Configuration options for BYOK & pluggable suggestion providers
 */
export const ProviderConfigSchema = z.object({
  provider: ProviderTypeSchema.default('local'),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  endpoint: z.string().url('Endpoint must be a valid URL').optional(),
  temperature: z.number().min(0).max(2).optional(),
  dualPassValidation: z.boolean().optional(),
  timeoutMs: z.number().int().positive().optional(),
});
export type InferredProviderConfig = z.infer<typeof ProviderConfigSchema>;

/**
 * Schema for developer feedback on suggestion quality
 */
export const FeedbackRatingSchema = z.enum(['helpful', 'unhelpful']);
export type InferredFeedbackRating = z.infer<typeof FeedbackRatingSchema>;

export const UnhelpfulReasonSchema = z.enum([
  'not_relevant',
  'already_known',
  'outdated',
  'other',
]);
export type InferredUnhelpfulReason = z.infer<typeof UnhelpfulReasonSchema>;

export const FeedbackPayloadSchema = z.object({
  query: z.string().min(1, 'Query intent is required'),
  skillId: z.string().optional(),
  rating: FeedbackRatingSchema,
  reason: UnhelpfulReasonSchema.optional(),
  details: z.string().max(500, 'Details cannot exceed 500 characters').optional(),
  providerUsed: ProviderTypeSchema.optional(),
  timestamp: z.number().int().positive(),
});
export type InferredFeedbackPayload = z.infer<typeof FeedbackPayloadSchema>;

/**
 * Schema for requesting new skills to be added to the offline catalog
 */
export const SkillRequestPayloadSchema = z.object({
  skillName: z.string().min(1, 'Library or skill name is required'),
  category: SkillCategorySchema.optional(),
  ecosystem: z.string().optional(),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
  timestamp: z.number().int().positive(),
});
export type InferredSkillRequestPayload = z.infer<typeof SkillRequestPayloadSchema>;

export function validateProviderConfig(data: unknown): InferredProviderConfig {
  return ProviderConfigSchema.parse(data);
}

export function validateFeedbackPayload(data: unknown): InferredFeedbackPayload {
  return FeedbackPayloadSchema.parse(data);
}

export function validateSkillRequestPayload(data: unknown): InferredSkillRequestPayload {
  return SkillRequestPayloadSchema.parse(data);
}

/**
 * Schema for developer-saved skill bookmarks
 */
export const SkillBookmarkSchema = z.object({
  id: z.string().min(1, 'Skill ID is required'),
  name: z.string().min(1, 'Skill Name is required'),
  ecosystem: z.string().min(1, 'Ecosystem is required'),
  category: SkillCategorySchema,
  difficulty: DifficultySchema,
  description: z.string().optional(),
  whyUseIt: z.string().min(1, 'whyUseIt is required'),
  officialUrl: z.string().url('Must be a valid URL'),
  tags: z.array(z.string()).default([]),
  stackIndicators: z.array(z.string()).default([]),
  trustTier: TrustTierSchema.optional(),
  timestamp: z.number().int().positive(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});
export type InferredSkillBookmark = z.infer<typeof SkillBookmarkSchema>;

/**
 * Schema for requesting a multi-skill side-by-side comparison
 */
export const ComparisonRequestSchema = z.object({
  skillIds: z
    .array(z.string().min(1))
    .min(2, 'Must provide at least 2 skills to compare')
    .max(3, 'Cannot compare more than 3 skills simultaneously'),
});
export type InferredComparisonRequest = z.infer<typeof ComparisonRequestSchema>;

/**
 * Normalized data for a single tool column in the comparison matrix
 */
export const ComparisonColumnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ecosystem: z.string().min(1),
  category: SkillCategorySchema,
  difficulty: DifficultySchema,
  trustTier: TrustTierSchema,
  description: z.string(),
  whyUseIt: z.string(),
  pros: z.array(z.string()).default([]),
  caveats: z.string().optional(),
  worksWellWith: z.array(z.string()).default([]),
  stackIndicators: z.array(z.string()).default([]),
  health: PackageHealthSchema.optional(),
  officialUrl: z.string().url().optional(),
  isInstalledInWorkspace: z.boolean().optional(),
});
export type InferredComparisonColumn = z.infer<typeof ComparisonColumnSchema>;

/**
 * Full side-by-side comparison matrix payload
 */
export const ComparisonMatrixSchema = z.object({
  columns: z.array(ComparisonColumnSchema).min(2).max(3),
  categories: z.array(SkillCategorySchema),
  isCrossEcosystem: z.boolean(),
  conflictsDetected: z.array(z.string()).default([]),
  summary: z.string().optional(),
});
export type InferredComparisonMatrix = z.infer<typeof ComparisonMatrixSchema>;

export function validateSkillBookmark(data: unknown): InferredSkillBookmark {
  return SkillBookmarkSchema.parse(data);
}

export function validateComparisonRequest(data: unknown): InferredComparisonRequest {
  return ComparisonRequestSchema.parse(data);
}

export function validateComparisonMatrix(data: unknown): InferredComparisonMatrix {
  return ComparisonMatrixSchema.parse(data);
}

/**
 * Format target for generated agent skills
 */
export const AgentSkillFormatSchema = z.enum([
  'agent-skill', // .agent/skills/<id>/SKILL.md (Antigravity & Claude Code)
  'claude-skill', // .claude/skills/<id>/SKILL.md
  'cursor-rule', // .cursor/rules/<id>.mdc (Cursor)
  'root-agents', // AGENTS.md (Root repo guidelines)
]);
export type AgentSkillFormat = z.infer<typeof AgentSkillFormatSchema>;

/**
 * Request payload for generating an agent skill
 */
export const GenerateAgentSkillRequestSchema = z.object({
  skillId: z.string().min(1),
  format: AgentSkillFormatSchema.default('agent-skill'),
  workspacePath: z.string().optional(),
  includeKarpathyRules: z.boolean().default(true),
});
export type GenerateAgentSkillRequest = z.input<typeof GenerateAgentSkillRequestSchema>;

/**
 * Generated agent skill response
 */
export const GeneratedAgentSkillSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  format: AgentSkillFormatSchema,
  suggestedFilePath: z.string(),
  frontmatter: z.record(z.unknown()),
  markdownContent: z.string().min(30),
});
export type GeneratedAgentSkill = z.infer<typeof GeneratedAgentSkillSchema>;

export function validateGenerateAgentSkillRequest(
  data: unknown
): z.output<typeof GenerateAgentSkillRequestSchema> {
  return GenerateAgentSkillRequestSchema.parse(data);
}

export function validateGeneratedAgentSkill(data: unknown): GeneratedAgentSkill {
  return GeneratedAgentSkillSchema.parse(data);
}
