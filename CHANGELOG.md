# 📜 SkillForge — Changelog & Version History

All notable changes, phase deliveries, and milestone releases for SkillForge are documented here.

The project follows a structured version & phase sequence:
- **Major Milestone (`v1.0.0`)**: Full cross-IDE suggestion engine with beginner UX, reliability pipeline, and context scoping.
- **Phase Subsections (`Phase 1` through `Phase 8`)**:
  - `Phase 1`: Foundation — LSP Server & Monorepo Scaffold (✅ Complete)
  - `Phase 2`: Skills Database & Schema — The Knowledge Base (✅ Complete)
  - `Phase 3`: Suggestion Engine & Context Scoping (⬜ Pending)
  - `Phase 4`: Reliability Engine & Trust Verification (⬜ Pending)
  - `Phase 5`: VS Code UI & Experience (⬜ Pending)
  - `Phase 6`: Fallback Cascade & Advanced Capabilities (⬜ Pending)
  - `Phase 7`: Polish, Packaging & Production Readiness (⬜ Pending)
  - `Phase 8`: E2E Verification & Release Sign-Off (⬜ Pending)

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
