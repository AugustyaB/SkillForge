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

const CATEGORY_SHORTHAND_MAP: Record<string, z.infer<typeof SkillCategorySchema>> = {
  state: 'state-management',
  store: 'state-management',
  auth: 'authentication',
  oauth: 'authentication',
  jwt: 'authentication',
  backend: 'backend-framework',
  server: 'backend-framework',
  frontend: 'frontend-framework',
  web: 'frontend-framework',
  ui: 'ui-library',
  styling: 'ui-library',
  css: 'ui-library',
  components: 'ui-library',
  db: 'database',
  sql: 'database',
  nosql: 'database',
  cache: 'database',
  api: 'api-protocol',
  graphql: 'api-protocol',
  rpc: 'api-protocol',
  rest: 'api-protocol',
  websocket: 'api-protocol',
  devtools: 'utility',
  performance: 'utility',
  cli: 'utility',
  build: 'utility',
  bundler: 'utility',
  logging: 'utility',
  validation: 'utility',
  tooling: 'utility',
  devops: 'devops-container',
  docker: 'devops-container',
  container: 'devops-container',
  cloud: 'cloud-hosting',
  hosting: 'cloud-hosting',
  serverless: 'cloud-hosting',
  ai: 'ai-ml',
  ml: 'ai-ml',
  llm: 'ai-ml',
  test: 'testing',
  e2e: 'testing',
};

/**
 * Normalizes arbitrary or LLM-shorthand category strings into a valid SkillCategory.
 */
export function normalizeSkillCategory(
  rawCategory?: unknown
): z.infer<typeof SkillCategorySchema> {
  if (typeof rawCategory !== 'string' || !rawCategory.trim()) {
    return 'other';
  }
  const cleaned = rawCategory.trim().toLowerCase();
  const parsed = SkillCategorySchema.safeParse(cleaned);
  if (parsed.success) {
    return parsed.data;
  }
  return CATEGORY_SHORTHAND_MAP[cleaned] ?? 'other';
}

/**
 * Normalizes an external or potentially protocol-less URL into a valid http(s) URL.
 */
export function normalizeOfficialUrl(
  rawUrl?: unknown,
  fallbackName: string = 'library'
): string {
  if (typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    const trimmed = rawUrl.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return trimmed;
      }
    } catch {
      if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) {
        try {
          const withHttps = `https://${trimmed}`;
          new URL(withHttps);
          return withHttps;
        } catch {
          // Fall through to search fallback
        }
      }
    }
  }
  return `https://www.google.com/search?q=${encodeURIComponent(fallbackName.trim() || 'library')}`;
}

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
  license: z.string().optional(),
  isDeprecated: z.boolean().optional(),
  deprecatedReason: z.string().optional(),
  migrationTarget: z.string().optional(),
  whenNotToUse: z.array(z.string()).optional(),
  runtimes: z.array(z.string()).optional(),
  source: z.enum(['bundled', 'workspace']).optional(),
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
 * Applies default lifecycle and metadata values to a skill record
 */
export function normalizeSkillDefaults(skill: InferredSkill): InferredSkill {
  return {
    ...skill,
    license: skill.license || 'MIT',
    isDeprecated: skill.isDeprecated ?? false,
    whenNotToUse: skill.whenNotToUse || [],
    runtimes: skill.runtimes || [],
    source: skill.source || 'bundled',
  };
}

/**
 * Validates a single skill record against the schema and applies defaults
 */
export function validateSkill(data: unknown): InferredSkill {
  return normalizeSkillDefaults(SkillSchema.parse(data));
}

/**
 * Safely parses a single skill record and applies defaults on success
 */
export function safeValidateSkill(data: unknown) {
  const result = SkillSchema.safeParse(data);
  if (result.success) {
    return {
      success: true as const,
      data: normalizeSkillDefaults(result.data),
    };
  }
  return result;
}

/**
 * Validates an array of skills, checking for valid schemas and ID uniqueness, and applying defaults
 */
export function validateSkillsArray(data: unknown): InferredSkill[] {
  const parsed = z.array(SkillSchema).parse(data);
  const ids = new Set<string>();

  return parsed.map((skill) => {
    if (ids.has(skill.id)) {
      throw new Error(`Duplicate skill ID detected: "${skill.id}"`);
    }
    ids.add(skill.id);
    return normalizeSkillDefaults(skill);
  });
}

/**
 * Structured workspace skills configuration schema
 */
export const WorkspaceSkillsObjectSchema = z.object({
  version: z.string().optional().default('1.0'),
  skills: z.array(SkillSchema).default([]),
  overrides: z.record(z.string(), SkillSchema.partial()).optional().default({}),
});

export const WorkspaceSkillsConfigSchema = z.union([
  z.array(SkillSchema),
  WorkspaceSkillsObjectSchema,
]);

export type WorkspaceSkillsConfig = z.infer<typeof WorkspaceSkillsConfigSchema>;

export interface ValidatedWorkspaceConfig {
  skills: InferredSkill[];
  overrides: Record<string, Partial<InferredSkill>>;
}

/**
 * Validates a workspace private catalog config (either array of skills or config object with skills + overrides)
 */
export function validateWorkspaceSkillsConfig(data: unknown): ValidatedWorkspaceConfig {
  const parsed = WorkspaceSkillsConfigSchema.parse(data);

  if (Array.isArray(parsed)) {
    const ids = new Set<string>();
    const skills = parsed.map((s) => {
      if (ids.has(s.id)) {
        throw new Error(`Duplicate workspace skill ID detected: "${s.id}"`);
      }
      ids.add(s.id);
      return normalizeSkillDefaults({ ...s, source: 'workspace' });
    });
    return { skills, overrides: {} };
  }

  const ids = new Set<string>();
  const skills = (parsed.skills || []).map((s) => {
    if (ids.has(s.id)) {
      throw new Error(`Duplicate workspace skill ID detected: "${s.id}"`);
    }
    ids.add(s.id);
    return normalizeSkillDefaults({ ...s, source: 'workspace' });
  });

  return {
    skills,
    overrides: parsed.overrides || {},
  };
}

/**
 * Safely validates a workspace private catalog config
 */
export function safeValidateWorkspaceSkillsConfig(data: unknown):
  | { success: true; data: ValidatedWorkspaceConfig }
  | { success: false; error: z.ZodError | Error } {
  try {
    const validated = validateWorkspaceSkillsConfig(data);
    return { success: true, data: validated };
  } catch (err: unknown) {
    if (err instanceof z.ZodError || err instanceof Error) {
      return { success: false, error: err };
    }
    return { success: false, error: new Error(String(err)) };
  }
}

/**
 * Payload schema for adding or updating a local workspace skill
 */
export const AddLocalSkillPayloadSchema = z.object({
  workspaceRoot: z.string().min(1, 'workspaceRoot is required'),
  skill: SkillSchema,
  overwrite: z.boolean().optional().default(true),
});

export type InferredAddLocalSkillPayload = z.infer<typeof AddLocalSkillPayloadSchema>;

/**
 * Payload schema for removing a local workspace skill
 */
export const RemoveLocalSkillPayloadSchema = z.object({
  workspaceRoot: z.string().min(1, 'workspaceRoot is required'),
  skillId: z.string().min(1, 'skillId is required'),
});

export type InferredRemoveLocalSkillPayload = z.infer<typeof RemoveLocalSkillPayloadSchema>;

/**
 * Result schema for local skills CRUD operations
 */
export const LocalSkillsResultSchema = z.object({
  success: z.boolean(),
  skillId: z.string().optional(),
  message: z.string(),
  error: z.string().optional(),
  skills: z.array(SkillSchema).optional(),
});

export type InferredLocalSkillsResult = z.infer<typeof LocalSkillsResultSchema>;

export function validateAddLocalSkillPayload(data: unknown): InferredAddLocalSkillPayload {
  const parsed = AddLocalSkillPayloadSchema.parse(data);
  return {
    ...parsed,
    skill: normalizeSkillDefaults({ ...parsed.skill, source: 'workspace' }),
  };
}

export function validateRemoveLocalSkillPayload(data: unknown): InferredRemoveLocalSkillPayload {
  return RemoveLocalSkillPayloadSchema.parse(data);
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

/**
 * -------------------------------------------------------------
 * Project Studio & Adaptive Ideation Schemas (SkillForge v1.2.0)
 * -------------------------------------------------------------
 */

export const IdeationPersonaSchema = z.enum([
  'fresher-student',
  'intermediate',
  'working-professional',
]);
export type IdeationPersona = z.infer<typeof IdeationPersonaSchema>;

export const IdeationDomainSchema = z.enum([
  'devtools-cli',
  'fintech',
  'ai-agents',
  'realtime-collab',
  'observability-security',
  'campus-social',
  'open-source-utility',
  'web-fullstack',
  'custom',
]);
export type IdeationDomain = z.infer<typeof IdeationDomainSchema>;

export const TimeBudgetSchema = z.enum([
  'weekend-hackathon',
  'two-week-deep-dive',
  'production-mvp',
]);
export type TimeBudget = z.infer<typeof TimeBudgetSchema>;

export const IdeationWizardInputSchema = z.object({
  persona: IdeationPersonaSchema.default('fresher-student'),
  domain: IdeationDomainSchema.default('devtools-cli'),
  customDomain: z.string().trim().max(100).optional(),
  ecosystem: z.string().trim().default('recommend'),
  timeBudget: TimeBudgetSchema.default('two-week-deep-dive'),
  learningGoal: z.string().trim().max(200).optional(),
});
export type IdeationWizardInput = z.infer<typeof IdeationWizardInputSchema>;

export const ProjectMilestoneSchema = z.object({
  phase: z.number().int().positive(),
  name: z.string().min(2),
  objective: z.string().min(5),
  deliverables: z.array(z.string().min(2)).min(1),
});
export type ProjectMilestone = z.infer<typeof ProjectMilestoneSchema>;

export const ProjectCharterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2).max(120),
  tagline: z.string().min(5).max(250),
  targetPersona: IdeationPersonaSchema,
  domain: z.string().min(2),
  problemStatement: z.string().min(10),
  technicalTwist: z.string().min(5),
  timeBudget: TimeBudgetSchema,
  recommendedSkills: z.array(z.string().min(1)).min(1),
  architecturePattern: z.string().min(2),
  milestones: z.array(ProjectMilestoneSchema).min(1),
  antiPatternsToAvoid: z.array(z.string()).default([]),
});
export type ProjectCharter = z.infer<typeof ProjectCharterSchema>;

export const CompileIdeaPromptRequestSchema = z.object({
  input: IdeationWizardInputSchema,
  isWildcard: z.boolean().default(false),
});
export type CompileIdeaPromptRequest = z.infer<typeof CompileIdeaPromptRequestSchema>;

export const CompiledIdeaPromptSchema = z.object({
  systemPrompt: z.string().min(20),
  userPrompt: z.string().min(10),
  recommendedCatalogSkills: z.array(z.string()),
  suggestedTwistSeed: z.string().optional(),
});
export type CompiledIdeaPrompt = z.infer<typeof CompiledIdeaPromptSchema>;

export const ScaffoldProjectRequestSchema = z.object({
  workspacePath: z.string().min(1),
  charter: ProjectCharterSchema,
  targetRulesFormat: AgentSkillFormatSchema.default('cursor-rule'),
  overwriteExisting: z.boolean().default(false),
});
export type ScaffoldProjectRequest = z.infer<typeof ScaffoldProjectRequestSchema>;

export const ScaffoldProjectResultSchema = z.object({
  success: z.boolean(),
  createdFiles: z.array(z.string()),
  skippedFiles: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  message: z.string(),
});
export type ScaffoldProjectResult = z.infer<typeof ScaffoldProjectResultSchema>;

export function validateIdeationWizardInput(data: unknown): IdeationWizardInput {
  return IdeationWizardInputSchema.parse(data);
}

export function validateProjectCharter(data: unknown): ProjectCharter {
  return ProjectCharterSchema.parse(data);
}

export function validateCompileIdeaPromptRequest(data: unknown): CompileIdeaPromptRequest {
  return CompileIdeaPromptRequestSchema.parse(data);
}

export function validateCompiledIdeaPrompt(data: unknown): CompiledIdeaPrompt {
  return CompiledIdeaPromptSchema.parse(data);
}

export function validateScaffoldProjectRequest(data: unknown): ScaffoldProjectRequest {
  return ScaffoldProjectRequestSchema.parse(data);
}

export function validateScaffoldProjectResult(data: unknown): ScaffoldProjectResult {
  return ScaffoldProjectResultSchema.parse(data);
}
