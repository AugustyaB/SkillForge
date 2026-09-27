# Plan 4.2: Registry Health Verification, Trust Tier Classification, Fallback Cascade & Engine Integration

> **Phase**: 4 — Reliability Engine & Trust Verification
> **Wave**: 2 of 2
> **Focus**: Package existence/health check with caching, 4-tier trust scoring, fallback cascade, and full SuggestionEngine integration.

---

## 1. Objectives

1. Implement `HealthVerifier` (`packages/server/src/reliability/health-verifier.ts`):
   - Registry existence checks and health indicators for npm packages.
   - Detect abandoned/deprecated packages (last published > 3 years ago or deprecated on registry).
   - In-memory caching with 24-hour TTL and offline-safe fallback.
   - Dependency injection for `fetch` to enable deterministic, fast unit tests without live internet.
2. Implement `TrustTierClassifier` (`packages/server/src/reliability/trust-tier-classifier.ts`):
   - Multi-factor classification into 4 tiers:
     - 🟢 `verified`: In curated DB, vetted, not abandoned.
     - 🟡 `validated`: Registry existence verified, healthy/aging, not in curated DB.
     - 🟠 `suggested`: Registry existence verified, health unverified or low usage.
     - ⛔ `deprecated`: Deprecated flag or abandoned status.
   - Filtering method `filterByMinTier(skills, minTier)`.
3. Implement `FallbackCascade` (`packages/server/src/reliability/fallback-cascade.ts`):
   - Replaces hardcoded fallback list with structured, intelligent fallback cascade:
     - Tier 1: Fuzzy search across broader tag/category indices.
     - Tier 2: Category Browser recommendations providing foundational starter tools for Frontend, Backend, Database, and DevOps.
4. Integrate Reliability Pipeline into `SuggestionEngine` (`packages/server/src/engine/suggestion-engine.ts`):
   - Wire in `GroundTruthAnchor`, `HealthVerifier`, `TrustTierClassifier`, `ConflictDetector`, and `FallbackCascade`.
   - Update `SkillForgeServer` and export all reliability modules in `packages/server/src/index.ts`.
5. Comprehensive test coverage for health checks, trust classification, fallback cascade, and end-to-end LSP requests.

---

## 2. Affected Files

| File | Action | Purpose |
|---|---|---|
| `packages/server/src/reliability/health-verifier.ts` | Create | Package existence, maintenance checks, TTL cache, offline fallback |
| `packages/server/src/reliability/trust-tier-classifier.ts` | Create | 4-tier classification and minimum trust tier filtering |
| `packages/server/src/reliability/fallback-cascade.ts` | Create | Intelligent multi-level fallback and category browser |
| `packages/server/src/reliability/index.ts` | Modify | Export all reliability modules |
| `packages/server/src/engine/suggestion-engine.ts` | Modify | Integrate full reliability pipeline into `suggest()` |
| `packages/server/src/index.ts` | Modify | Export reliability classes and types |
| `packages/server/src/__tests__/health-verifier.test.ts` | Create | Unit tests for registry existence, health metrics, caching, and offline handling |
| `packages/server/src/__tests__/trust-tier-classifier.test.ts` | Create | Unit tests for trust tier assignment and filtering |
| `packages/server/src/__tests__/fallback-cascade.test.ts` | Create | Unit tests for category browser and graceful degradation |
| `packages/server/src/__tests__/suggestion-engine.test.ts` | Modify | Update and expand suggestion engine tests to verify reliability pipeline |
| `packages/server/src/__tests__/server-integration.test.ts` | Modify | Verify full LSP RPC calls with reliability pipeline |

---

## 3. Detailed Architecture & Implementation Steps

### Step 1: `HealthVerifier`
- Class `HealthVerifier`:
  - `constructor(options?: { fetchFn?: typeof fetch; cacheTtlMs?: number })`
  - Default `cacheTtlMs`: 24 * 60 * 60 * 1000 (24 hours).
  - Method `checkPackage(packageName: string, ecosystem?: string): Promise<PackageHealth>`:
    - If in cache and not expired: return cached `PackageHealth`.
    - If `ecosystem === 'node'` (or standard package):
      - Query npm registry endpoint with 2000ms timeout (`AbortSignal.timeout(2000)`).
      - Check HTTP 200 vs 404:
        - 404: `{ packageExists: false, healthVerdict: undefined }`
        - 200: Parse release dates and deprecation notice.
          - If `deprecated` field present: `healthVerdict: 'abandoned'`.
          - If `time.modified` or latest release > 3 years old: `healthVerdict: 'abandoned'`.
          - If > 1.5 years old: `healthVerdict: 'aging'`.
          - Otherwise: `healthVerdict: 'healthy'`.
      - Query downloads endpoint (optional or combined): extract `weeklyDownloads`.
    - If offline / fetch throws:
      - Return graceful fallback: `{ packageExists: true, cachedAt: Date.now() }`.
    - Store in memory cache.

### Step 2: `TrustTierClassifier`
- Class `TrustTierClassifier`:
  - Method `classify(skill: Skill | SuggestedSkill, health?: PackageHealth, isCurated?: boolean): TrustTier`:
    - If `health?.healthVerdict === 'abandoned'`: return `'deprecated'`.
    - If `isCurated`: return `'verified'`.
    - If `health?.packageExists`:
      - If `health.healthVerdict === 'healthy' || health.healthVerdict === 'aging'`: return `'validated'`.
      - Otherwise: return `'suggested'`.
    - If `health && !health.packageExists`: return `'suggested'` or reject.
    - Default: `'suggested'`.
  - Method `filterByMinTier(skills: SuggestedSkill[], minTier?: TrustTier): SuggestedSkill[]`:
    - Hierarchy: `verified` > `validated` > `suggested` > `deprecated`.
    - Filters out skills below the minimum required tier.

### Step 3: `FallbackCascade`
- Class `FallbackCascade`:
  - `constructor(repository: SkillsRepository)`
  - Method `getCategoryBrowserRecommendations(): CategoryRecommendation[]`:
    - Returns structured recommendations for core categories:
      - `frontend-framework` (e.g. React, Vue, Svelte)
      - `backend-framework` (e.g. Express, Fastify, NestJS)
      - `database` (e.g. PostgreSQL, SQLite, MongoDB)
      - `testing` (e.g. Vitest, Jest, Playwright)
  - Method `executeFallback(intent: string, context?: WorkspaceContext): SkillSuggestionResult`:
    - Returns baseline starter skills + category browser options.
    - Sets `fallbackUsed: true`.

### Step 4: SuggestionEngine Integration
- Update `SuggestionEngine`:
  - Instantiate and wire:
    - `GroundTruthAnchor`
    - `HealthVerifier`
    - `TrustTierClassifier`
    - `ConflictDetector`
    - `FallbackCascade`
  - In `suggest()`:
    1. Check `QueryCache`.
    2. Parse intent and search candidates.
    3. Apply context boost (+30 pts compatibility, already installed flag).
    4. Anchor ground-truth metadata.
    5. Check health & assign trust tiers.
    6. Run conflict detector to annotate mutually exclusive tools.
    7. Filter by `options.minTrustTier` if provided.
    8. If results empty: execute `FallbackCascade` to return curated starter skills and category browser recommendations.
    9. Cache and return result.

---

## 4. Verification Criteria

- [ ] `packages/server/src/__tests__/health-verifier.test.ts` passes:
  - 200 recent publish -> `healthy`.
  - Deprecated package -> `abandoned`.
  - 404 response -> `packageExists: false`.
  - Network error -> graceful offline fallback without unhandled promise rejection.
  - In-memory cache returns instant response on second query.
- [ ] `packages/server/src/__tests__/trust-tier-classifier.test.ts` passes:
  - Curated skill -> `verified`.
  - Abandoned package -> `deprecated`.
  - Non-curated valid package -> `validated`.
  - Filtering by `minTrustTier` correctly removes lower tiers.
- [ ] `packages/server/src/__tests__/fallback-cascade.test.ts` passes:
  - Generates multi-category browser starter suggestions.
  - All fallback skills are valid and verified.
- [ ] `packages/server/src/__tests__/suggestion-engine.test.ts` and `server-integration.test.ts` pass with full reliability pipeline.
- [ ] `pnpm typecheck` (`tsc -b`), `pnpm test` (`vitest run`), and `pnpm build` pass with exit code 0.
