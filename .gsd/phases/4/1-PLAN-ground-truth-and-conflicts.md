# Plan 4.1: Runtime Validation, Ground-Truth Anchoring & Conflict Detection

> **Phase**: 4 — Reliability Engine & Trust Verification
> **Wave**: 1 of 2
> **Focus**: Schema enforcement, vetted database anchoring, and mutual alternative / conflict detection.

---

## 1. Objectives

1. Extend `@skillforge/shared` contracts with:
   - `RawSuggestionSchema` and `validateRawSuggestion` for external/LLM input.
   - `conflictWith?: string[]` and `conflictWarning?: string` in `SuggestedSkill`.
   - `CategoryRecommendation` interface and `categoryRecommendations?: CategoryRecommendation[]` in `SkillSuggestionResult`.
2. Implement `GroundTruthAnchor` (`packages/server/src/reliability/ground-truth-anchor.ts`):
   - Cross-references incoming or candidate skills against `SkillsRepository`.
   - Elevates matched skills to `verified` tier and anchors vetted metadata (official URLs, stack indicators, difficulty).
3. Implement `ConflictDetector` (`packages/server/src/reliability/conflict-detector.ts`):
   - Analyzes suggested candidates against `alreadyInstalled` tools in workspace context.
   - Analyzes suggested candidates against each other for mutually exclusive alternatives.
   - Annotates candidates with clear, beginner-friendly conflict warnings ("pick one, not both").
4. Comprehensive test coverage for schema validation, anchoring, and conflict detection.

---

## 2. Affected Files

| File | Action | Purpose |
|---|---|---|
| `packages/shared/src/schemas.ts` | Modify | Add `RawSuggestionSchema`, `validateRawSuggestion`, and update exports |
| `packages/shared/src/protocol.ts` | Modify | Add conflict fields to `SuggestedSkill` and `CategoryRecommendation` to `SkillSuggestionResult` |
| `packages/shared/src/index.ts` | Modify | Export new schemas and types |
| `packages/server/src/reliability/ground-truth-anchor.ts` | Create | Ground-truth cross-referencer against curated 118-skill DB |
| `packages/server/src/reliability/conflict-detector.ts` | Create | Conflict and alternative detection logic |
| `packages/server/src/reliability/index.ts` | Create | Barrel export for reliability components |
| `packages/server/src/__tests__/ground-truth-anchor.test.ts` | Create | Unit tests for ground-truth anchoring |
| `packages/server/src/__tests__/conflict-detector.test.ts` | Create | Unit tests for conflict detection |

---

## 3. Detailed Architecture & Implementation Steps

### Step 1: Shared Contracts & Schemas
- Add `RawSuggestionSchema` to `packages/shared/src/schemas.ts`:
  - Validates `name`, optional `id`, `category`, `difficulty`, `description`, `whyUseIt`, `officialUrl`, `confidence`, `reasoning`.
  - Export `validateRawSuggestion` and `safeValidateRawSuggestion`.
- Update `SuggestedSkill` in `packages/shared/src/protocol.ts`:
  - `conflictWith?: string[]`
  - `conflictWarning?: string`
- Update `SkillSuggestionResult`:
  - `categoryRecommendations?: CategoryRecommendation[]`

### Step 2: `GroundTruthAnchor`
- Class `GroundTruthAnchor`:
  - Accepts `SkillsRepository` in constructor.
  - Method `anchor(suggestion: RawSuggestion | Partial<Skill>): { skill: SuggestedSkill; isAnchored: boolean }`
    - Normalizes name/ID.
    - Searches repository for matching skill.
    - If found: merges curated metadata with candidate reasoning/confidence and sets `trustTier: 'verified'`.
    - If not found: formats as a `suggested` skill awaiting registry validation (`isAnchored: false`).

### Step 3: `ConflictDetector`
- Class `ConflictDetector`:
  - Method `detectConflicts(skills: SuggestedSkill[], alreadyInstalled: string[]): SuggestedSkill[]`
  - Normalizes installed packages to a Set.
  - Scans each skill's `alternatives` array:
    1. Installed conflict: Checks if an alternative exists in `alreadyInstalled`.
       - Generates warning: `"Alternative to already-installed '${alt}' — consider whether to replace it."`
    2. Co-suggestion conflict: Checks if an alternative is also present in the `skills` list.
       - Generates warning: `"Alternative to '${alt}' in this list — pick one, not both."`
  - Attaches `conflictWith` and `conflictWarning` to the skill object.

---

## 4. Verification Criteria

- [ ] `packages/shared/src/__tests__/schemas.test.ts` verifies `RawSuggestionSchema` accepts valid inputs and catches invalid URLs or missing names.
- [ ] `packages/server/src/__tests__/ground-truth-anchor.test.ts` verifies:
  - Exact ID match anchors full curated data and sets `trustTier: 'verified'`.
  - Fuzzy name match (e.g., "Express.js" -> "express") anchors accurately.
  - Unknown external skill returns `isAnchored: false` with unverified tier.
- [ ] `packages/server/src/__tests__/conflict-detector.test.ts` verifies:
  - `fastify` vs installed `express` flags installed conflict.
  - `react` and `vue` in same list flags mutual alternative conflict.
  - Non-conflicting tools (e.g. `react` and `postgresql`) have zero warnings.
- [ ] `pnpm typecheck` (`tsc -b`) exits with code 0.
- [ ] `pnpm test` passes all tests.
