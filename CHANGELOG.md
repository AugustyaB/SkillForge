# 📜 SkillForge — Changelog & Version History

All notable changes, phase deliveries, and milestone releases for SkillForge are documented here.

The project follows a structured version & phase sequence:
- **Major Milestone (`v1.0.0`)**: Full cross-IDE suggestion engine with beginner UX, reliability pipeline, and context scoping.
- **Phase Subsections (`Phase 1` through `Phase 8`)**:
  - `Phase 1`: Foundation — LSP Server & Monorepo Scaffold (✅ Complete)
  - `Phase 2`: Skills Database & Schema — The Knowledge Base (✅ Complete)
  - `Phase 3`: Suggestion Engine & Context Scoping (✅ Complete)
  - `Phase 4`: Reliability Engine & Trust Verification (✅ Complete)
  - `Phase 5`: VS Code UI & Experience (✅ Complete — Phase 5.1 & Phase 5.2)
  - `Phase 6`: Fallback Cascade & Advanced Capabilities (⬜ Pending)
  - `Phase 7`: Polish, Packaging & Production Readiness (⬜ Pending)
  - `Phase 8`: E2E Verification & Release Sign-Off (⬜ Pending)

---

## Phase 5.2: VS Code Client — The Suggestion Canvas (2026-09-27)

### Deliverables
- **The Suggestion Canvas Webview Panel (`packages/vscode-client/src/webview/suggestion-panel.ts`)**:
  - Singleton `vscode.WebviewPanel` lifecycle manager with `retainContextWhenHidden: true` ensuring persistent tab state and accordion positions.
  - Strict Content Security Policy (CSP) with cryptographic nonces for script and style tags.
  - Bidirectional typed IPC (`webview-messages.ts`) handling terminal install execution, clipboard copy, safe external URL navigation, and in-canvas re-querying.
- **Visual Design System & Theme Integration (`packages/vscode-client/src/webview/design-tokens.ts`)**:
  - 100% native VS Code CSS variable binding across Dark+, Light+, GitHub Dark/Light, and High Contrast.
  - Distinctive SkillForge amber ember branding (`#F59E0B`), card elevation hover effects, and responsive auto-fill grid layout.
  - High-contrast accessibility compliance (`@media (forced-colors: active)` and `.vscode-high-contrast`).
- **Interactive Skill Cards & Components (`packages/vscode-client/src/webview/webview-html.ts`)**:
  - **Trust Seals**: Transparent trust badges (🟢 Verified, 🟡 Validated, 🟠 Suggested, ⛔ Deprecated).
  - **Match Confidence**: Percentage match score pills (e.g. `⚡ 96% Match`).
  - **"Why Use It" Callouts**: Prominent rationale boxes explaining why the tool fits the user's intent.
  - **Registry Health Bar**: Displays GitHub stars, weekly download counts, last publish recency, and maintenance status.
  - **Conflict Warning Banners**: Highlights conflicting packages/tools with clear explanation.
  - **Deep Dive Drawer**: Collapsible accordion revealing alternatives, complementary tools, and validated learning links.
  - **Fallback Category Catalog**: Structured browsing cards for software domains when direct keyword matches are sparse.
  - **Interactive Action Bar**: One-click terminal install in active scope, clipboard command copying with animated `"✓ Copied!"` feedback, and docs launcher.
- **Workbench Integration**:
  - Registered `skillforge.showCanvas` command and view/title menu action on the Sidebar view.
  - Integrated with `skillforge.suggest` to stream loading skeletons and results directly into the canvas.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 diagnostics.
- `pnpm test` (`vitest run`): 166/166 tests passing across 16 test suites in 843ms.
- `pnpm build`: Clean build across all monorepo workspaces (`@skillforge/shared`, `@skillforge/server`, `@skillforge/vscode-client`).

---

## Phase 5.1: VS Code Client — The Command Center (2026-09-27)

### Deliverables
- **Custom Activity Bar & ViewContainer (`packages/vscode-client/resources/icon.svg`, `package.json`)**:
  - Theme-adaptive anvil/forge Activity Bar icon with amber ember accents (`resources/icon.svg`).
  - Registered `skillforge-activitybar` ViewContainer with three dedicated views:
    - `skillforge.contextView`: Context & Stack
    - `skillforge.quickActionsView`: Quick Actions
    - `skillforge.recentQueriesView`: Recent Discoveries
- **Active Context Folder Scope Selector (`packages/vscode-client/src/context/`)**:
  - Pure `scope-utils.ts` for monorepo package discovery (`maxDepth: 3`, excludes `node_modules`, `dist`, `.git`), manifest detection (`package.json`, `requirements.txt`, `Cargo.toml`, etc.), and graceful root fallback.
  - Dependency inspection via `readInstalledPackagesFromScope` extracting installed packages, versions, and source manifests.
  - `ScopeManager` with `workspaceState` persistence, interactive QuickPick (`skillforge.selectScope`), and automated `WorkspaceContext` signal extraction.
- **Sidebar Tree Views (`packages/vscode-client/src/views/`)**:
  - Decoupled pure `tree-view-models.ts` for isolated unit testing without VS Code mocks.
  - `ContextTreeProvider`: Displays active scope, detected ecosystem, and expandable list of detected packages with versions.
  - `QuickActionsTreeProvider`: High-frequency shortcuts ("Suggest for Current File", "Search 118 Skills", "Re-scan Project Stack").
  - `RecentQueriesTreeProvider`: Persists up to 15 recent queries with one-click re-query execution and clear history.
- **Inline CodeLens Provider (`packages/vscode-client/src/providers/`)**:
  - `comment-parser.ts`: Multi-language comment trigger parser (`// IDEA:`, `// SKILL:`, `# IDEA:`, `# SKILL:`) with line offset calculation and hostile input guards.
  - `SkillForgeCodeLensProvider`: Debounced (300ms) inline CodeLens across 11 programming languages triggering instant suggestions.
- **Integrated Terminal Runner (`packages/vscode-client/src/terminal/`)**:
  - `TerminalRunner`: Dedicated `"SkillForge"` terminal manager for executing derived install commands (`pnpm add`, `pip install`, `cargo add`, etc.) directly from suggestion notifications.

### Bug Fixes & Refinements
- **BUG-11 (Install Package Identifier Resolution)**:
  - Fixed `deriveInstallCommand` invocation in `extension.ts` to pass `topSkill.stackIndicators?.[0] || topSkill.id` rather than display name (`topSkill.name`), eliminating shell syntax errors on names containing parentheses or spaces (e.g. `TanStack Query (React Query)`).
- **BUG-12 (Language Activation Events)**:
  - Added explicit `onLanguage:*` activation triggers for all 11 supported languages (`javascript`, `typescript`, `python`, `rust`, `go`, `java`, `c`, `cpp`, `csharp`, etc.) in `package.json`, ensuring CodeLens providers activate immediately on file open.
- **BUG-13 (Terminal Working Directory Tracking)**:
  - Added `lastCwd` state tracking and automatic `cd "<cwd>"` command dispatch in `TerminalRunner`, ensuring install commands run in the active context scope rather than a stale monorepo root. Added terminal disposal listener.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 diagnostics.
- `pnpm test` (`vitest run`): 146/146 tests passing across 15 test suites in 781ms.
- `pnpm build`: Clean build across all monorepo workspaces (`@skillforge/shared`, `@skillforge/server`, `@skillforge/vscode-client`).

---

## Bug Remediation & Hardening: 100% Defect Resolution (BUG-01 to BUG-10) (2026-09-27)

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
- **BUG-04 (QueryCache Key Completeness)**:
  - Updated `generateKey` to hash full request options and context (`maxResults`, `minTrustTier`, `ecosystem`, `activeFileSignals`), preventing cache collisions when toggling options or switching editor tabs.
- **BUG-05 (GroundTruthAnchor Schema Compliance)**:
  - Provided valid fallback URL and default learning resource entry for unanchored suggestions, ensuring complete compliance with strict `SkillSchema` Zod validation without throwing.
- **BUG-06 (Stale Cache Retention Test)**:
  - Corrected test in `health-verifier.test.ts` to test stale cache retention on a single verifier instance during simulated network failure.
- **BUG-07 (LSP Null/Undefined Guards)**:
  - Added defensive guards across `SkillForgeServer.onRequest` and `SuggestionEngine.suggest` to prevent unhandled `TypeError` exceptions on null or malformed JSON-RPC payloads.
- **BUG-08 (Inline Comments in requirements.txt)**:
  - Stripped inline `#` comments before extracting package names, preventing valid Python packages (e.g. `fastapi # framework`) from being dropped.
- **BUG-09 & BUG-10 (HealthVerifier Metrics & Publish Date Order)**:
  - Awaited download counts within timeout budget so download metrics populate on the first call.
  - Prioritized `dist-tags.latest` publish date over `modified` metadata date to accurately detect abandoned packages.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 diagnostics.
- `pnpm test` (`vitest run`): 102/102 tests passing across 11 test suites in 383ms.
- `pnpm build`: Clean build with all 118 skills verified.
- All 10 defects in `BUGS.md` verified and resolved.

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
