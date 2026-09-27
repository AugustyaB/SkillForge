# 📜 SkillForge — Changelog & Version History

All notable changes, phase deliveries, and milestone releases for SkillForge are documented here.

The project follows a structured version & phase sequence:
- **Major Milestone (`v1.0.0`)**: Full cross-IDE suggestion engine with beginner UX, reliability pipeline, and context scoping.
- **Phase Subsections (`Phase 1` through `Phase 8`)**:
  - `Phase 1`: Foundation — LSP Server & Monorepo Scaffold (✅ Complete)
  - `Phase 2`: Skills Database & Schema — The Knowledge Base (✅ Complete)
  - `Phase 3`: Suggestion Engine & Context Scoping (✅ Complete)
  - `Phase 4`: Reliability Engine & Trust Verification (✅ Complete)
  - `Phase 5`: VS Code UI & Experience (⬜ Pending)
  - `Phase 6`: Fallback Cascade & Advanced Capabilities (⬜ Pending)
  - `Phase 7`: Polish, Packaging & Production Readiness (⬜ Pending)
  - `Phase 8`: E2E Verification & Release Sign-Off (⬜ Pending)

---

## Bug Remediation: Engine Hardening (BUG-01, BUG-02, BUG-03) (2026-09-27)

### Fixes & Enhancements
- **BUG-01 (RegExp Crash Prevention)**:
  - Added `escapeRegExp` utility and guarded token matching with `/^\w+$/` in `SkillsRepository.search`.
  - Symbolic tokens (`c++`, `c#`, `.net`) use safe exact/substring matching, eliminating `SyntaxError: Invalid regular expression`.
  - Added `c++`, `cpp`, and `c#` to `ECOSYSTEM_KEYWORDS` and sanitized punctuation in `IntentParser`.
- **BUG-02 (Manifest Package Name Resolution)**:
  - Added `indicatorIndex` in `SkillsRepository` mapping package names (e.g. `next`, `tailwindcss`, `@angular/core`) to canonical Skill IDs.
  - Resolved `alreadyInstalled` packages in `SuggestionEngine` and `ConflictDetector`, restoring compatibility boosts and conflict warnings for aliased packages.
- **BUG-03 (Ecosystem Query Precedence)**:
  - Prioritized explicit query ecosystem over ambient workspace context, ensuring cross-ecosystem queries return requested tools.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 diagnostics.
- `pnpm test` (`vitest run`): 97/97 tests passing across 11 test suites.
- `pnpm build`: Clean build with all 118 skills verified.

---

## Phase 4: Reliability Engine & Trust Verification (2026-09-27)

### Deliverables
- **Runtime Schema Validation (`@skillforge/shared/src/schemas.ts`)**:
  - `RawSuggestionSchema` enforces Zod contracts on untrusted inputs (LLM, external).
  - Validates name, optional ID format, URL validity, confidence bounds (0-1).
  - `validateRawSuggestion()` and `safeValidateRawSuggestion()` helpers.
- **Ground-Truth Anchoring (`@skillforge/server/src/reliability/ground-truth-anchor.ts`)**:
  - Cross-references suggestions against curated 118-skill database via 3 match strategies.
  - Matched skills elevated to `verified` trust tier with full curated metadata.
- **Conflict & Alternative Detector (`@skillforge/server/src/reliability/conflict-detector.ts`)**:
  - Detects installed conflicts and co-suggestion conflicts.
  - Annotates skills with `conflictWith` IDs and beginner-friendly `conflictWarning` messages.
- **Registry Health Verification (`@skillforge/server/src/reliability/health-verifier.ts`)**:
  - Queries npm registry with injectable `fetch`, classifies packages as healthy/aging/abandoned/risky.
  - In-memory cache with 24-hour TTL, AbortSignal timeout protection, offline-safe fallback.
- **Trust Tier Classification (`@skillforge/server/src/reliability/trust-tier-classifier.ts`)**:
  - 4-tier system: verified, validated, suggested, deprecated. Filtering via `filterByMinTier()`.
- **Fallback Cascade (`@skillforge/server/src/reliability/fallback-cascade.ts`)**:
  - Multi-level fallback: broader tag search then curated category browser starter packs.
- **Full SuggestionEngine Integration**: Wired all reliability components into `suggest()` pipeline.
- **Protocol Extensions**: `conflictWith`, `conflictWarning` on `SuggestedSkill`; `categoryRecommendations` on `SkillSuggestionResult`.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 TypeScript diagnostics.
- `pnpm test`: Passed 92/92 tests across 11 test suites.
- `pnpm build`: Clean build across all packages with 118-skill dataset validation.

---

## Phase 3: Suggestion Engine & Context Scoping (2026-09-27)

### Deliverables
- **Natural Language Intent Parser (`@skillforge/server/src/engine/intent-parser.ts`)**:
  - Extracts action verbs ("build", "create", "integrate", "test", "secure", "deploy").
  - Maps domain keywords to 15 canonical skill categories with synonym mapping.
  - Strips stop words and extracts explicit ecosystems and difficulty preferences.
- **Multi-Ecosystem Scoped Workspace Scanner (`@skillforge/server/src/context/workspace-scanner.ts`)**:
  - Parsers for `package.json`, `requirements.txt` (with extras handling), `Cargo.toml`, `go.mod`, and `pom.xml`.
  - Non-recursive scoped folder discovery preventing I/O overhead in large monorepos.
  - Aggregates detected packages into `DetectedPackage[]` and identifies ecosystem.
- **Context-Aware Multi-Factor Scorer (`@skillforge/server/src/engine/suggestion-engine.ts`)**:
  - Compatibility Boost (+30 pts): Detects when a skill's `worksWellWith` matches already-installed tools and updates reasoning.
  - Already-Installed Detection: Identifies existing project tools and flags them with `isInstalledInWorkspace: true`.
  - Wired into `SkillForgeServer` to handle live `skillforge/suggest` requests.
- **In-Memory Query Cache (`@skillforge/server/src/engine/query-cache.ts`)**:
  - SHA-256 deterministic key generation from query, scoped paths, and installed tools.
  - 10-minute TTL with auto-pruning, serving repeat queries in `0ms`.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 TypeScript diagnostics.
- `pnpm test`: Passed 44/44 tests across 6 test suites in 511ms.
- `pnpm build`: Clean build across all packages with dataset integrity validation.

---

## Phase 2: Skills Database & Schema — The Knowledge Base (2026-09-27)

### Deliverables
- **Zod Runtime Schema Contracts (`@skillforge/shared`)**:
  - `SkillSchema`, `SkillCategorySchema` (15 engineering categories), `DifficultySchema`, `TrustTierSchema`.
  - Derived TypeScript types (`Skill`, `Category`, `Difficulty`) via `z.infer<...>` for single source of truth.
  - Runtime validation helpers (`validateSkill`, `validateSkillsArray`, `safeValidateSkill`).
- **Curated Knowledge Base (`@skillforge/server/src/data/skills.json`)**:
  - 118 verified skills across 15 domains with beginner-friendly explanations, authentic documentation links, alternatives, and package stack indicators.
- **`SkillsRepository` In-Memory Indexing**:
  - Built-in $O(1)$ ID lookups, inverted tag index, category index, and ecosystem index.
  - Multi-factor search scoring with stop-word filtering and exact token matching.
- **Automated Build-Time Integrity Validation**:
  - `scripts/validate-skills.cjs` runs on every build, ensuring 100% schema compliance, non-empty stack indicators, and HTTPS URLs.
- **LSP Server Suggestion Integration**:
  - `SkillForgeServer` answers `skillforge/suggest` requests from the 118-skill repository with match confidence scores and transparent reasoning.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 TypeScript diagnostics.
- `pnpm test`: Passed 26/26 tests across 4 test suites in 442ms.
- `pnpm build`: Clean build across all packages with automated dataset validation passing.

---

## Phase 1: Foundation — LSP Server & Monorepo Scaffold (2026-09-27)

### Deliverables
- **Root Monorepo Infrastructure**:
  - `pnpm` workspaces configured across `packages/*`.
  - Root TypeScript project reference system via `tsconfig.base.json` and `tsconfig.json`.
  - Monorepo test runner via `vitest.config.ts`.
- **`@skillforge/shared` Package**:
  - Core domain models: `Skill`, `TrustTier`, `SkillCategory`, `WorkspaceContext`, `PackageHealth`.
  - Custom LSP protocol definitions: `skillforge/suggest`, `skillforge/ping`.
- **`@skillforge/server` Package**:
  - Headless LSP server running over stdio JSON-RPC.
  - Lifecycle handlers (`initialize`, `shutdown`, `exit`) and custom request handlers.
- **`@skillforge/vscode-client` Package**:
  - Thin VS Code client extension with non-wildcard activation events.
  - Commands registered: `skillforge.testConnection`, `skillforge.suggest`.
  - Full client-server lifecycle and roundtrip communication.

### Verification Proof
- `pnpm build`: Passed with 0 errors across all 3 workspace packages.
- `pnpm typecheck` (`tsc -b`): Passed with 0 TypeScript diagnostics.
- `pnpm test`: Passed 9/9 tests across 2 test suites in 397ms.
