---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Zod Schemas & Domain Validation in Shared Package

## Objective
Implement runtime data contracts and schema validation using Zod in `@skillforge/shared`, replacing manual interface definitions with schema-derived types and exporting validation utilities.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- PROJECT_RULES.md
- .gsd/phases/2/RESEARCH.md
- packages/shared/src/types.ts

## Tasks

<task type="auto" effort="medium">
  <name>Install Zod and define runtime schemas in packages/shared</name>
  <files>
    packages/shared/package.json,
    packages/shared/src/schemas.ts,
    packages/shared/src/types.ts,
    packages/shared/src/index.ts
  </files>
  <action>
    1. Add `zod: ^3.24.2` as a dependency in `packages/shared/package.json`.
    2. Create `packages/shared/src/schemas.ts`:
       - `DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced'])`
       - `SkillCategorySchema = z.enum([...all 15 categories...])`
       - `TrustTierSchema = z.enum(['verified', 'validated', 'suggested', 'deprecated'])`
       - `LearnLinkSchema = z.object({ label: z.string().min(1), url: z.string().url(), type: z.enum(['docs', 'tutorial', 'video', 'article']).optional() })`
       - `SkillSchema = z.object({ id: z.string().min(1).regex(/^[a-z0-9-]+$/), name: z.string().min(1), category: SkillCategorySchema, difficulty: DifficultySchema, description: z.string().min(10), whyUseIt: z.string().min(10), tags: z.array(z.string().min(1)).min(1), ecosystem: z.string().min(1), officialUrl: z.string().url(), learnResources: z.array(LearnLinkSchema).min(1), alternatives: z.array(z.string()), worksWellWith: z.array(z.string()), prerequisites: z.array(z.string()), stackIndicators: z.array(z.string()).min(1) })`
       - Export helper functions: `validateSkill(data: unknown): Skill` and `validateSkillsArray(data: unknown): Skill[]`.
    3. Update `packages/shared/src/types.ts` to derive types from Zod schemas (`export type Skill = z.infer<typeof SkillSchema>`, etc.) to ensure a single source of truth.
    4. Re-export all schemas and validation helpers in `packages/shared/src/index.ts`.
    AVOID: Introducing any node.js or vscode-specific imports into `@skillforge/shared`.
  </action>
  <verify>pnpm --filter @skillforge/shared build</verify>
  <done>packages/shared compiles cleanly to dist/ with schema definitions and zero TypeScript errors.</done>
</task>

<task type="auto" effort="small">
  <name>Add unit tests for Zod schema validation</name>
  <files>
    packages/shared/src/__tests__/schemas.test.ts
  </files>
  <action>
    Create `packages/shared/src/__tests__/schemas.test.ts`:
    1. Test that a valid skill object parses successfully and returns typed data.
    2. Test that missing required fields (e.g., missing description, empty tags, invalid URL) throw descriptive ZodErrors.
    3. Test that `validateSkillsArray` validates collections of skills and rejects duplicates or invalid entries.
    4. Assert that `SkillSchema` correctly validates all difficulty and category enumerations.
  </action>
  <verify>pnpm test</verify>
  <done>Vitest executes and all schema validation tests pass with 0 errors.</done>
</task>

## Success Criteria
- [ ] `@skillforge/shared` exports runtime Zod schemas for `Skill`, `SkillCategory`, `Difficulty`, `TrustTier`.
- [ ] TypeScript types are derived from Zod schemas without type drift.
- [ ] Unit tests verify both positive parsing and negative schema rejection.
