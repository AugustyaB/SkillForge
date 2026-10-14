# 📜 SkillForge — Changelog & Version History

All notable changes, phase deliveries, and milestone releases for SkillForge are documented here.

The project follows a structured version & phase sequence:
- **Major Milestone (`v1.0.0`)**: Full cross-IDE suggestion engine with beginner UX, reliability pipeline, and context scoping.
- **Phase Subsections (`Phase 1` through `Phase 9`)**:
  - `Phase 1`: Foundation — LSP Server & Monorepo Scaffold (✅ Complete)
  - `Phase 2`: Skills Database & Schema — The Knowledge Base (✅ Complete)
  - `Phase 3`: Suggestion Engine & Context Scoping (✅ Complete)
  - `Phase 4`: Reliability Engine & Trust Verification (✅ Complete)
  - `Phase 5`: VS Code UI & Experience (✅ Complete — Phase 5.1 & Phase 5.2)
  - `Phase 6`: LLM Providers & BYOK Integration (✅ Complete)
  - `Phase 7`: Bookmarks, Technology Comparison Matrix & Reference Suite (✅ Complete)
  - `Phase 8`: Polish, Knowledge Base Expansion & Marketplace Release (✅ Complete)
  - `Phase 9`: Agent Skill Generation & Usability Validation Engine (✅ Complete)
  - `Phase 10`: Model Context Protocol (MCP) Server for AI Coding Agents (✅ Complete)
- **Database Milestones (`DB-v1.0.0` ➔ `DB-v1.1`)**:
  - `DB-Phase 1`: Graph Symmetry, Alias Resolution & Topology Invariants (`DB-v1.1.0-alpha` ✅ Complete)
  - `DB-Phase 2`: Web, Runtime & Mobile Cohort Quality Audit (`DB-v1.2.0-alpha` ✅ Complete)
  - `DB-Phase 3`: Backend, Databases & Systems Cohort Quality Audit (`DB-v1.3.0-alpha` ✅ Complete)
  - `DB-Phase 4`: AI/ML & Agentic Innovations Cohort Audit (`DB-v1.4.0-alpha` ✅ Complete)
  - `Clean Foundation Pass`: Mutual Exclusivity Overhaul & Utility Fitness Rubric (UFR) (✅ Complete)
## Release v0.1.1: Open VSX Quality & Trust Audit Remediation (2026-10-14)

Comprehensive remediation addressing all 10 findings from the external Open VSX marketplace quality and trust audit.

### Deliverables
- **Verified Repository & Issue Tracker Links**:
  - Corrected all four marketplace navigation links (Homepage, Repository, Bugs, Q&A) in `packages/vscode-client/package.json` from the non-existent `skillforge-team` organization to the verified author repository: `https://github.com/AugustyaB/SkillForge`.
  - Updated root `package.json` and `@skillforge/mcp/package.json` with matching canonical URLs.
- **Valid Production BYOK AI Model Names**:
  - Replaced unrecognized model identifiers (`gemini-3.5-flash`, `gpt-4.1-mini`) with official production endpoints: `gemini-2.0-flash` (Google Gemini) and `gpt-4o-mini` (OpenAI).
  - Updated `packages/server/src/providers/gemini-provider.ts` and `openai-provider.ts` fallback defaults, QuickPick UI descriptions in `extension.ts`, and test assertions.
  - Documented supported production alternatives (`gemini-1.5-flash`, `gemini-1.5-pro`, `gpt-4o`).
- **Python `# IDEA:` Syntax Support & Anti-Happy-Path Hardening**:
  - Documented Python comment trigger syntax (`# IDEA:` and `# SKILL:`) across README and walkthroughs, eliminating syntax errors from C-style `//` floor-division comments.
  - Added anti-happy-path test suite in `comment-parser.test.ts` verifying Python floor-division operations (`x = a // b`, `count // 2`) and inline strings are never misidentified as triggers.
- **Automated VSIX Changelog & NOTICE Bundling**:
  - Added `copy-docs` lifecycle script to automatically copy `CHANGELOG.md` and `NOTICE` to `packages/vscode-client/` during `build` and `package`.
  - Fixed Open VSX "No changelog available" gap; the full changelog and dual-license notice are now bundled at the root of `skillforge-0.1.1.vsix`.
- **High-Resolution UI Screenshots Showcase**:
  - Created 4 high-resolution 960x620 visual PNG screenshots in `resources/screenshots/`:
    1. `sidebar-overview.png`: 5 Activity Bar views (Context & Stack, Quick Actions, All Commands, Recent Discoveries, Bookmarks).
    2. `comparison-matrix.png`: Side-by-Side Comparison Matrix with metrics, health verdicts, and conflict warning banners.
    3. `codelens-triggers.png`: Inline CodeLens triggers showing both C-style (`// IDEA:`) and Python (`# IDEA:`).
    4. `agent-directives.png`: Agent Skill Directive generation (`SKILL.md` / `.cursor/rules/*.mdc`).
  - Switched README image references to PNG format complying with `vsce` packaging requirements.
- **Complete 16-Command Reference & Keybindings Table**:
  - Added comprehensive table in `README.md` detailing all 16 commands, command identifiers, default keybindings (`Ctrl+Alt+S`, `Ctrl+Alt+F`), and descriptions.
- **11-Language Ecosystem & Manifest Detection Matrix**:
  - Added full reference table documenting 11 programming languages, primary file extensions, 15 detected project manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.), and package manager mapping.
- **Quick-Install Snippet & Marketplace Badges**:
  - Added VS Code Quick Open installation command (`ext install SkillForge.skillforge`) and Open VSX version, download, license, and privacy badges.
- **Unified Tagline Wording**:
  - Standardized description across `package.json`, `README.md`, and walkthroughs: *"Cross-IDE developer skill discovery engine: map natural language ideas to vetted libraries, frameworks, and architecture patterns"*.
- **Dual-License Attribution Notice (NOTICE)**:
  - Added formal `NOTICE` file and README section detailing MIT software licensing and CC BY 4.0 data attribution requirements for the 378-skill dataset.
- **Empirical Verification**:
  - 381/381 tests passing across 31 test suites.
  - Zero `tsc -b` diagnostics across all packages.
  - Packaged `skillforge-0.1.1.vsix` verified at 567.34 KB across 70 files (zero source code leaks).

## Database Release DB-v1.1: Production Knowledge Base Certification (2026-10-14)

The first certified, production-ready release of the SkillForge Developer Knowledge Base, governed by the **Utility Fitness Rubric (UFR)**.

### Deliverables & Certified Metrics
- **Catalog-Wide Universal Inbound Reachability (0 Islands)**:
  - Rescued all 64 orphaned tools (`lucide-react`, `sonner`, `sharp`, `dotenv`, `react-native-mmkv`, `msw`, `faker-js`, `orjson`, `pytest-asyncio`, `testify-go`, etc.) by connecting them to natural parent frameworks.
  - Reduced isolated island skills from 113 (baseline) ➔ 64 ➔ **0**.
- **Mutual Exclusivity Enforcement (0 Contradictory Overlaps)**:
  - Eliminated all 22 contradictory overlaps between `alternatives` and `worksWellWith`.
  - Reclassified driver, substrate, and composition relationships as pure companions.
  - Added regression test suite in `conflict-detector.test.ts` verifying zero false-positive conflicts on companion tools.
- **7 CI Graph Invariants Permanently Active**:
  1. `Invariant 1`: Non-Reflexivity (0 self-references in alts or companions)
  2. `Invariant 2`: Bidirectional Symmetry (0 asymmetric alternative pairs)
  3. `Invariant 3`: Alias Cleanliness (0 forbidden shorthand/alias tokens)
  4. `Invariant 4`: Acyclic Prerequisites (0 circular DAG deadlock loops)
  5. `Invariant 5`: Pruned Dead-End Builtins (0 unanchored language built-ins)
  6. `Invariant 6`: Mutual Exclusivity (0 contradictory overlaps)
  7. `Invariant 7`: Universal Inbound Reachability (0 isolated islands)
- **Cohort Expansions & Quality Audits**:
  - Added 15 foundational developer tools across 4 cohorts (expanding catalog to **378 vetted skills**):
    - Web & Runtime: `typescript`, `vite`, `bun`, `eslint`, `pnpm`, `rxjs`, `ngrx`
    - Backend & Systems: `clickhouse`, `caddy`, `temporal`
    - AI/ML & Agentic: `anthropic-sdk`, `google-genai-sdk`, `instructor`, `dspy`, `fastembed`
- **Empirical Verification**:
  - TypeScript: `tsc -b` exits 0 with zero diagnostics.
  - Vitest: **378/378 tests passing** across 31 test suites.
  - Production Build: Clean bundle across all workspace packages (`@skillforge/shared`, `@skillforge/server`, `@skillforge/vscode-client`, `@skillforge/mcp`).

## Lead QA Audit: Pre-Publication Resilience & MCP Standalone Bundling (2026-10-14)

### Deliverables
- **Resilient Comparison Column Fallback Synthesis (`ComparisonEngine`)**:
  - Dynamically synthesizes unanchored `ComparisonColumn` records (`trustTier: 'suggested'`) whenever a catalog skill links to an external community tool in `alternatives` or `worksWellWith`.
  - Fixes unhandled exception crashes when comparing uncataloged alternatives (e.g. `pinia` vs `vuex`, `zod` vs `yup`, `mysql` vs `mariadb`).
  - Preserves bidirectional conflict detection across both curated and synthesized tools (`BUG-28`).
- **Standalone Zero-Dependency `@skillforge/mcp` Server Packaging**:
  - Added `packages/mcp/esbuild.mjs` bundling all internal monorepo dependencies (`@skillforge/server`, `@skillforge/shared`, and dataset) into a self-contained executable at `packages/mcp/dist/index.js` (1.45 MB) with shebang and `createRequire` banner (`BUG-29`).
  - Decoupled headless server API from `vscode-languageserver` in `packages/server/src/api.ts` to prevent ESM dynamic require conflicts.
- **Continuous Watch CI Integration & Verification**:
  - Added standalone MCP execution verification to `.github/workflows/ci.yml`.
  - Added `comparison-resilience.test.ts` (9 tests) and `mcp-anti-happy-path.test.ts` (13 tests).
  - Total test count expanded to **375 tests passing across 31 suites**.

## Database Interim: Clean Foundation Pass & Utility Fitness Rubric (UFR) Adoption (2026-10-14)

### Deliverables
- **Adoption of the Utility Fitness Rubric (UFR)**:
  - Formally institutionalized the 5-pillar UFR replacing legacy heuristic naming for skill curation, pruning, and verification.
  - Codified **Invariant 6 (Mutual Exclusivity)** in CI: asserts zero skills contain overlapping members in `alternatives` and `worksWellWith`.
- **Systematic Resolution of 22 Contradictory Graph Overlaps**:
  - Reclassified driver, substrate, and composition relationships from `alternatives` into pure companions (`worksWellWith`):
    - `redis` $\leftrightarrow$ `ioredis` (database engine vs Node client driver)
    - `webrtc` $\leftrightarrow$ `socket-io` (media channels vs signaling transport)
    - `kubernetes` $\leftrightarrow$ `docker` (container orchestrator vs container runtime)
    - `seaborn` $\leftrightarrow$ `matplotlib` (statistical API on plotting engine)
    - `duckdb` $\leftrightarrow$ `pandas`, `polars` (OLAP database on DataFrame memory buffers)
    - `react-native` $\leftrightarrow$ `expo` (mobile framework vs official toolchain)
    - `pytorch` $\leftrightarrow$ `numpy` (deep learning tensors vs CPU arrays)
    - `textual` $\leftrightarrow$ `rich` (TUI framework on terminal renderer)
    - `scipy` $\leftrightarrow$ `numpy` (scientific algorithms on array buffers)
    - `tailwind-merge` $\leftrightarrow$ `clsx` (conditional styling composition)
    - `husky` $\leftrightarrow$ `lint-staged` (git pre-commit hook chaining)
    - `hypothesis-py` $\leftrightarrow$ `pytest` (property testing plugin on test framework)
    - `crossbeam-rust` $\leftrightarrow$ `rayon-rust` (concurrency primitives vs data parallelism)
    - `beanie` $\leftrightarrow$ `motor` (ODM on MongoDB async driver)
    - `passlib` $\leftrightarrow$ `bcrypt` (password hashing on crypto engine)
    - `browser-use` $\leftrightarrow$ `playwright` (AI web agent on browser automation)
    - `outlines-ai` $\leftrightarrow$ `pydantic` (FSM guided generation on schema models)
    - `mcp-sdk` $\leftrightarrow$ `langchain` (agent context protocol on orchestration framework)
- **Elimination of False-Positive Conflict Warnings in ConflictDetector**:
  - Added adversarial regression tests in `conflict-detector.test.ts` verifying that companion tools never trigger false conflict badges.
  - Maintained genuine competitor detection (e.g. `browser-use` vs `open-interpreter`, `fastify` vs `express`).
- **Wave 4.1 & 4.2 Completions**:
  - Added 5 AI/ML staples: `anthropic-sdk`, `google-genai-sdk`, `instructor`, `dspy`, `fastembed` (catalog expanded to 378 skills).
  - Enforced bidirectional RAG and vector database links across `chromadb`, `pinecone`, `qdrant`, `weaviate`, `langchain`, `llamaindex`.
- **Verification Proof**:
  - `tsc -b`: Clean with 0 diagnostics.
  - Vitest: **353/353 tests passing** across 29 test suites (all 6 graph invariants passing).
  - Monorepo Build: All 4 workspace packages cleanly built and bundled.

## Database Milestone DB-v1.3.0: Backend, Databases & Systems Cohort Quality Audit (2026-10-14)

### Deliverables
- **3 Enterprise Systems Staples Added (Catalog Expanded to 373 Skills)**:
  - Added `clickhouse` (`database` / column-oriented OLAP analytical engine, reciprocal with `duckdb` & `elasticsearch`).
  - Added `caddy` (`devops-container` / Go web server with automatic HTTPS and Caddyfile syntax, reciprocal with `nginx`).
  - Added `temporal` (`utility` / distributed durable execution workflow orchestrator, reciprocal with `celery` & `bullmq`).
- **Database & ORM Reciprocal Pairing Audit (42 Skills)**:
  - Enforced engine-to-driver reciprocal synergy (`postgresql` with `sqlalchemy`/`asyncpg`; `sqlite` with `drizzle-orm`; `redis` with `ioredis`/`fastapi-cache2`; `mongodb` with `motor`/`beanie`).
  - Added driver indicators (`psycopg2`, `psycopg2-binary`, `asyncpg`, `drizzle-kit`).
  - Decoupled Go SQL and Rust SQL alternatives into isolated ecosystem clusters.
  - Pruned unanchored/dead alternatives (`peewee`, `django-migrations`, `mongoengine`, `jooq`, `mybatis`).
- **Backend Frameworks, Security & Protocols Vetting (34 Skills)**:
  - Reclassified `cors` & `helmet` as companion security middleware rather than mutually conflicting alternatives.
  - Remapped `echo-go` dangling reference to canonical `sqlc-go`.
  - Strengthened framework-to-validation companions (`fastapi` $\leftrightarrow$ `pydantic`, `hono` $\leftrightarrow$ `zod`, `trpc` $\leftrightarrow$ `zod`/`typescript`).
  - Sharpened technical performance differentiators across `hono`, `axum`, and `fastify`.
  - Pruned dead/unanchored alternatives (`grype`, `ably`, `limits`, `graphene`).
- **Verification Proof**:
  - `tsc -b`: Clean with 0 diagnostics.
  - Vitest: **347/347 tests passing** across 29 test suites.
  - Production Bundle: Clean production build and esbuild packaging in 252ms.

## Database Milestone DB-v1.2.0: Web, Runtime & Mobile Cohort Quality Audit (2026-10-14)


### Deliverables
- **7 Bedrock Developer Tools Added (Catalog Expanded to 370 Skills)**:
  - Added `typescript` (`utility` / `tsc` compiler, resolved 28 inbound companion links).
  - Added `vite` (`utility` / native ESM bundler and dev server, resolved 12 inbound links).
  - Added `bun` (`utility` / Zig-based all-in-one runtime, bundler, and package manager).
  - Added `eslint` (`utility` / pluggable linter, reciprocal alternatives with `biome` & `oxc-tool`).
  - Added `pnpm` (`utility` / content-addressable hardlink package manager).
  - Added `rxjs` (`utility` / reactive observable stream engine).
  - Added `ngrx` (`state-management` / Redux-inspired enterprise state store for Angular).
- **Modern Architectural Relevance & Deprecation Contextualization**:
  - Updated `styled-components` and `emotion`: Added React Server Components (RSC) hydration caveats and Next.js App Router `'use client'` requirements.
  - Updated `recoil`: Formally documented Meta repository abandonment and guided developers toward `jotai` or `zustand`.
  - Updated `react`, `vue`, and `svelte`: Contextualized with modern `vite` and `typescript` companions, Svelte 5 runes, and React 19 RSC paradigms.
- **Mobile Cohort Quality Deep Dive (29 Skills Audited)**:
  - Pruned non-package built-in API references (`react-native-stylesheet`, `react-native-animated`, `panresponder`, `safeareaview`).
  - Corrected `react-native-screens` relationship to a native optimization companion for React Navigation rather than a framework alternative.
  - Sharpened differentiators across `expo`, `react-native`, `flutter`, `tamagui`, and `nativewind`.
- **Verification Proof**:
  - `tsc -b`: Clean with 0 diagnostics.
  - Vitest: **347/347 tests passing** across 29 test suites.
  - Production Bundle: Clean production build and packaging in 138ms.

## Database Milestone DB-v1.1.0: Graph Symmetry, Alias Resolution & Topology Invariants (2026-10-13)


### Deliverables
- **Canonical Alias Remapping**:
  - Remapped 25 alias and shorthand references to canonical database IDs (e.g. `rails` $\to$ `ruby-on-rails`, `uv` $\to$ `uv-pkg`, `sqlx` $\to$ `sqlx-rust`, `dependabot` $\to$ `dependabot-tool`, `serde_json` $\to$ `serde-json`, `locust` $\to$ `locust-load`, `quill` $\to$ `quill-editor`, `slate` $\to$ `slate-editor`).
  - Removed reflexive self-reference from `sqlite` (`better-sqlite3`).
- **100% Bidirectional Reciprocity Enforced**:
  - Injected 106 reciprocal alternative links so that $A \in \text{alts}(B) \iff B \in \text{alts}(A)$.
  - Asymmetric alternative pairs completely reduced from **119 to 0**.
  - Rescued 48 isolated island skills from being unreachable (island count dropped from 113 to 65).
- **Pruned Dead-End Built-in Modules**:
  - Removed standard library modules and dead libraries from alternatives (`child_process`, `fs.watch`, `json`, `curses`, `argparse`, `enzyme`, `easymock`, `cordova`).
- **Automated Vitest Graph Invariant Test Suite**:
  - Created `packages/server/src/__tests__/skills-graph-invariants.test.ts` with 5 permanent mathematical graph invariants (Non-Reflexivity, Bidirectional Symmetry, Alias Cleanliness, Acyclic Prerequisite DAGs, and Pruned Built-ins).
- **Verification Proof**:
  - `tsc -b`: Clean across all packages with 0 diagnostics.
  - Vitest: **347/347 tests passing** across 29 test suites.
  - Monorepo build: Clean production build and esbuild bundling across all 4 packages.


## Model Context Protocol (MCP) Server for AI Coding Agents (2026-10-13)

### Deliverables
- **Decoupled Architecture (`packages/mcp`)**:
  - Implemented standalone `@skillforge/mcp` package using `@modelcontextprotocol/sdk` and `StdioServerTransport`.
  - Non-LSP library export (`@skillforge/server/api`) isolating algorithmic engines (`SuggestionEngine`, `ComparisonEngine`, `AgentSkillGenerator`, `SkillsRepository`, `WorkspaceScanner`) from `vscode-languageserver` stdio bindings.
  - Zero risk of regression or build coupling to the live VS Code extension client.
- **4 Core MCP Agent Tools Registered**:
  1. `skillforge_suggest`: Intent-based library discovery with trust tiers, conflict warnings, ecosystem filtering, and install commands.
  2. `skillforge_compare`: Side-by-side comparison matrix with conflict warnings, health metrics, and tradeoffs.
  3. `skillforge_create_rules`: Dynamic agent directive generation embedding Andrej Karpathy's 4 disciplines and bash verification protocols.
  4. `skillforge_get_catalog`: Filterable, paginated catalog browser across 363 skills.
- **Stdio Stream Hygiene & Anti-Happy-Path Hardening**:
  - Reserved `stdout` strictly for JSON-RPC 2.0 messages; routed all server logs and diagnostics to `stderr` (`console.error`).
  - Hardened against regex characters, whitespace, empty/null values, unknown library IDs, and path traversal strings (`../../../../etc/passwd`).
- **Comprehensive Test Suite & Empirical Verification**:
  - 17 unit tests in `packages/mcp/src/__tests__/mcp-server.test.ts` verifying all tools and error cases.
  - Overall monorepo verification: 342/342 tests passing across 28 suites, clean `tsc -b` typecheck, clean production build.
  - Live smoke tested over stdio with real JSON-RPC initialize, tools/list, and tools/call sequences.

## Antigravity IDE Testing Polish & UX Hardening (2026-10-12)

### Deliverables
- **Walkthrough Identifier Parity (`BUG-24`)**:
  - Corrected `workbench.action.openWalkthrough` parameter to `'skillforge.skillforge#skillforge.walkthrough'` in both `openWalkthroughCmd` and first-run trigger, fixing the Antigravity IDE generic welcome tab fallback.
- **Transparent Catalog Health Status (`BUG-25`)**:
  - Replaced ambiguous `"Pending Verification"` badge with `"Catalog Verified • Curated Tool"` featuring a green checkmark and explanatory tooltips on health metrics.
- **Frictionless 1-Click Access & 5th Sidebar View (`BUG-26`)**:
  - Added a 5th Activity Bar section **"All SkillForge Commands"** (`skillforge.commandsView` via `CommandsTreeProvider`) exposing all 16 SkillForge commands for 1-click execution directly in the left sidebar.
  - Set **"Bookmarked Tools"** (`skillforge.bookmarksView`) to `"visibility": "collapsed"` by default so the commands section stays expanded and on show.
  - Added persistent Status Bar item `$(sparkle) SkillForge` on the bottom right for instant idea discovery.
  - Added global keybindings: `Ctrl+Alt+S` / `Cmd+Alt+S` for `skillforge.suggest`, and `Ctrl+Alt+F` / `Cmd+Alt+F` for `skillforge.suggestForCurrentFile`.
  - Contributed 1-click `$(sparkle)` action button in `editor/title` menu for instant file-level suggestions.
  - Added view/title shortcuts on `quickActionsView`.
- **Responsive Comparison Matrix & Horizontal Scroll (`BUG-27`)**:
  - Wrapped Comparison Matrix in `.sf-matrix-scroll-wrapper` with `overflow-x: auto;` and styled custom scrollbars.
  - Enforced column min-widths (`minmax(280px, 1fr)`) and container `min-width: calc(180px + ${colCount} * 280px)`, eliminating column truncation on narrow/split displays.
  - Anchored row labels with sticky positioning (`position: sticky; left: 0; z-index: 2; box-shadow: 2px 0 4px ...`) so developers never lose row context while scrolling across tools.
- **BYOK Free/Base Tier Model Nomenclature Update**:
  - Updated Google Gemini default model identifier and UI descriptions from deprecated `gemini-1.5-flash` to `gemini-3.5-flash` (current free/base tier Flash model in Google AI Studio).
  - Updated OpenAI default model identifier and UI descriptions from legacy `gpt-4o-mini` to `gpt-4.1-mini` (current base/mini model in the OpenAI API).
- **Empirical Verification**: 325/325 tests passing across 27 suites; packaged VSIX (`407.21 KB`) installed directly into Antigravity IDE.

---

## Path Misdirection & Filesystem Resilience Hardening (2026-10-12)

### Deliverables
- **Boundary Containment & Drive Casing Hardening (`scope-utils.ts`)**:
  - Implemented `isPathInsideRoot()` using `path.relative()` containment checks to permanently eliminate sibling prefix collision traps (e.g. `/app` falsely matching `/app-secrets`).
  - Standardized Windows drive letter casing (`c:` $\to$ `C:`) in `normalizePath()`.
  - Added support for directly supplied absolute paths in `resolveScopePath()` with strict workspace containment validation.
- **Dynamic Scope Lifecycle & Deleted Folder Recovery (`scope-manager.ts`)**:
  - Added disk existence pre-check in `ScopeManager.activeScope` getter; automatically recovers and falls back to `Entire Workspace` if a folder is deleted or moved while the IDE is running.
  - Added boundary warning when browsing for custom folders outside the workspace boundary.
- **Repository-Level Directive Anchoring (`extension.ts`)**:
  - Anchored workspace-level agent directives (`AGENTS.md` and `.cursor/rules/*.mdc`) to `scopeManager.workspaceRoot`, preventing files from being misdirected into nested subpackages in monorepos.
  - Guarded `suggestForCurrentFile` against non-filesystem virtual documents (`git:`, `output:`, etc.).
- **Terminal Execution Shell & Path Resilience (`terminal-runner.ts`)**:
  - Pre-validates target directory existence before dispatching commands, preventing dead-directory execution and alerting users.
  - Guaranteed universal shell compatibility across PowerShell 5.1/7+, cmd.exe, and POSIX shells.
- **Virtual Document Filtering in CodeLens (`codelens-provider.ts`)**:
  - Strictly limited `provideCodeLenses` to `file` and `untitled` document schemes, eliminating phantom CodeLenses in git diffs, debug consoles, and output panels.
- **Empirical Verification**: Added dedicated test suite [`path-misdirection-resilience.test.ts`](./packages/vscode-client/src/__tests__/path-misdirection-resilience.test.ts) bringing the monorepo test suite to **320/320 tests passing** across 27 suites in 1.46s.

---

## Marketplace & Open VSX Deployment Automation (2026-10-12)

### Deliverables
- **Live Antigravity IDE Integration**: Installed and verified `skillforge-0.1.0.vsix` directly in Google Antigravity IDE setup with zero external dependencies.
- **Continuous Integration Pipeline (`.github/workflows/ci.yml`)**:
  - Matrix builds across Ubuntu and Windows runners.
  - Multi-gate verification: `pnpm typecheck` (`tsc -b`), `pnpm test` (292 tests), and `pnpm build`.
  - Automated package audit ensuring VSIX bundle size $<1.5\text{ MB}$ and verifying zero unbundled TypeScript source files leak into production.
- **Tag-Triggered Release Pipeline (`.github/workflows/release.yml`)**:
  - Automated GitHub Actions release pipeline triggered on `v*` tags.
  - Version alignment assertion between git tag and `packages/vscode-client/package.json`.
  - Dual marketplace publishing: Visual Studio Marketplace (`@vscode/vsce publish`) and Open VSX Registry (`ovsx publish`).
  - GitHub Release creation attaching the standalone `.vsix` bundle.
- **Publisher & Deployment Guide ([`DEPLOYMENT.md`](./DEPLOYMENT.md))**:
  - Detailed instructions for Azure DevOps PAT, Open VSX access token, publisher namespace claiming, and GitHub Actions repository secrets (`VSCE_PAT`, `OVSX_PAT`).
  - Local CLI fallback commands and bundle size audit metrics.
- **Package Hygiene & .vscodeignore Optimization**:
  - Cleaned `.vscodeignore` to exclude `*.vsix`, coverage, and OS artifacts.
  - VSIX package optimized to 269.1 KB across 53 files.

---

## Post-Phase 7/9 QA Audit & Cross-Layer Hardening (2026-10-12)

### Deliverables
- **Resolved 10 Cross-Layer & Adversarial Defects (`BUG-14` through `BUG-23`)**:
  - **BUG-14 (Critical)**: Aligned `SKILLFORGE_SYSTEM_PROMPT` categories with `SkillCategorySchema` and added `normalizeSkillCategory` + `normalizeOfficialUrl` across `@skillforge/shared`, `openai-provider.ts`, `ground-truth-anchor.ts`, and `bookmark-manager.ts` so unanchored AI skills never fail Zod validation when bookmarked.
  - **BUG-15 (High)**: Wired `ConflictDetector.detectConflicts`, `isInstalledInWorkspace` tagging, and `minTrustTier` filtering into `HybridMerger.merge()` and `ProviderRegistry.suggest()`.
  - **BUG-16 (High)**: Added `installedPackages?: string[]` to `CompareParams` (`protocol.ts`), forwarded `scopeManager.buildWorkspaceContext().alreadyInstalled` in `extension.ts`, and passed it into `comparisonEngine.compare()` in `server.ts`.
  - **BUG-17 (High)**: Preserved `categoryRecommendations` in `HybridMerger.merge()` when falling back with 0 AI matches.
  - **BUG-18 (Medium)**: Honored per-request `config.timeoutMs` in both `OpenAIProvider.suggest()` and `GeminiProvider.suggest()`.
  - **BUG-19 (Medium)**: Hardened `parseRawSuggestions()` to extract JSON from markdown fences even when wrapped in conversational LLM prose.
  - **BUG-20 (Medium)**: Added `getSkillByIndicator()` lookup in `GroundTruthAnchor.anchor()` so package names like `next` or `tailwindcss` anchor to `verified` catalog entries.
  - **BUG-21 (Medium)**: Reset `this.showFeedbackPrompt = false` in `SuggestionPanel` upon `submitFeedback` so subsequent bookmark toggles do not resurrect the feedback prompt.
  - **BUG-22 (Low)**: Aligned `deriveInstallString()` in `comparison-html.ts` with `pnpm add` and `mvn dependency:get`, enforced strict nonce-based `style-src` CSP, and updated `ComparisonPanel` tab title on reuse.
  - **BUG-23 (High)**: Replaced raw `trimmed.includes(lowerName)` substring check in `SkillsRepository.search()` with delimiter-bounded regex so short skill names (`Ent`, `Gin`) do not false-positive inside words like `"authentication"`, `"nonexistent"`, or `"login"`.
- **Empirical Verification**: Expanded test suite to **292/292 passing unit tests** across 25 test suites (`tsc -b` 0 errors, clean `esbuild` production bundle).

---

## Phase 9: Agent Skill Generation & Usability Validation Engine (2026-10-12)

### Deliverables
- **Shared Agent Skill Data Contracts (`packages/shared/src/schemas.ts`, `packages/shared/src/protocol.ts`, `packages/shared/src/types.ts`)**:
  - Defined `AgentSkillFormatSchema` supporting 4 industry standards: `'agent-skill'` (`.agent/skills/<id>/SKILL.md`), `'claude-skill'` (`.claude/skills/<id>/SKILL.md`), `'cursor-rule'` (`.cursor/rules/<id>.mdc`), and `'root-agents'` (`AGENTS.md`).
  - Added `GenerateAgentSkillRequestSchema`, `GeneratedAgentSkillSchema`, and `SKILLFORGE_GENERATE_AGENT_SKILL_METHOD` (`skillforge/generateAgentSkill`) LSP JSON-RPC protocol method.
- **Agent Skill Generator Engine (`packages/server/src/engine/agent-skill-generator.ts`, `packages/server/src/server.ts`)**:
  - Built `AgentSkillGenerator` transforming any of the 363 curated skills (including `jev`, `rea-re`, `llm-c`, `nanogpt`, `mcp-sdk`, `zod`, `fastapi`, `tailwind`) into structured, actionable agent directives.
  - Embeds **Andrej Karpathy's 4 Coding Disciplines** (*Think Before Coding*, *Simplicity & Minimal Surface Area*, *Surgical Precision*, *Verification Rigor*) alongside technology rationale, category-tailored idiomatic best practices, anti-patterns, and deterministic CLI verification commands.
  - Implemented `sanitizeSkillId` to safely handle scoped packages (`@modelcontextprotocol/sdk`), dots (`socket.io`), and hostile path inputs (`../../etc/passwd`) without directory traversal.
- **Empirical Agent Usability & Parseability Test Suite (`packages/server/src/__tests__/agent-skill-usability.test.ts`)**:
  - 24 automated tests validating YAML frontmatter parseability, section completeness, Karpathy rules toggling, ecosystem glob mapping, hostile input sanitization, and simulated AI agent extraction of triggers and deterministic verification scripts.
- **1-Click VS Code UI & Workspace File Generation (`packages/vscode-client/`)**:
  - Added `Agent Skill` action button with embedded vector AI codicon (`ICON_AI`, zero emojis) to both Suggestion Canvas cards (`webview-html.ts`) and Comparison Matrix column headers (`comparison-html.ts`).
  - Registered `skillforge.generateAgentSkill` command prompting format selection via QuickPick, writing the generated directive directly into the active workspace scope, and offering a 1-click `[Open File]` notification.

---

## Phase 8: Polish, Knowledge Base Expansion & Marketplace Release (2026-10-12)

### Deliverables
- **Knowledge Base Expansion & Purpose Verification (`packages/server/src/data/skills.json`)**:
  - Expanded curated catalog from 118 to **363 vetted, purposeful developer technologies** across all major modern ecosystems (JavaScript: 157, Python: 84, Multi: 70, Mobile: 29, Rust: 20, Go: 15, Java/JVM: 14).
  - Integrated high-demand trending GitHub skills: **Jev** (System One decision model), **REA** (Reverse Engineer Anything), **Andrej Karpathy's** repositories (`llm.c`, `nanoGPT`, `micrograd`, `autoresearch`), **Browser Use**, **Model Context Protocol (MCP)**, **Unsloth**, **LiteLLM**, **Outlines**, and **Open Interpreter**.
  - Added new `'mobile'` category to `SkillCategorySchema` and updated intent parser keywords (`mobile`, `ios`, `android`, `react-native`, `flutter`).
  - Strict purpose requirement: every skill answers *"What exact problem does this solve in my project?"* with canonical terminal installation indicators, valid HTTPS documentation URLs, and beginner tutorials.
- **Automated Quality & Purpose Rubric Verification (`packages/server/src/__tests__/skills-quality-rubric.test.ts`)**:
  - 7 automated tests enforcing non-fluff `whyUseIt` descriptions ($\ge 30$ chars, zero generic filler), real package names in `stackIndicators`, valid HTTPS docs, and absence of self-referencing alternatives.
- **Interactive First-Run Onboarding Walkthrough (`packages/vscode-client/walkthrough/`)**:
  - Registered `skillforge.walkthrough` in `package.json` with 5 visual guide steps: `welcome.md`, `scoping.md`, `triggers.md`, `comparison.md`, and `privacy.md`.
  - Registered `skillforge.openWalkthrough` command and implemented first-launch automatic trigger in `extension.ts` using `context.globalState`.
- **Production `esbuild` Dual-Bundle Pipeline (`packages/vscode-client/esbuild.mjs`)**:
  - Bundles extension client (`dist/extension.js`, 516 KB) and headless LSP server (`dist/server.js`, 272 KB) in $<100\text{ms}$.
  - Server inlines all JSON data and shared schemas into a single self-contained executable that boots in $<50\text{ms}$ on `--stdio`.
  - Configured `.vscodeignore` to omit source, tests, and maps, yielding an ultralight **261.57 KB VSIX archive** (budget $<5\text{MB}$).
- **Marketplace Identity & Release Assets**:
  - Rendered high-res 256x256 dark-slate & gold-ember PNG extension icon (`resources/icon.png`).
  - Added dual-license declaration (`LICENSE`, MIT for extension code + CC BY 4.0 for curated dataset).
  - Authored comprehensive developer-facing `README.md` with features, trigger mechanisms, and configuration settings table.
  - Packaged and verified `skillforge-0.1.0.vsix` via `@vscode/vsce`.

---

## Phase 7: Bookmarks, Technology Comparison Matrix & Reference Suite (2026-09-28)

### Deliverables
- **Skill Bookmarking & Persistence Engine (`packages/vscode-client/src/bookmarks/bookmark-manager.ts`)**:
  - Built `BookmarkManager` persisting developer-saved skills via `context.globalState` (`skillforge.bookmarks.v1`).
  - Added case-insensitive deduplication, tag/indicator normalization, and corrupted storage auto-recovery via strict Zod validation.
  - Added 1-click star toggle button to every Suggestion Canvas card header: active bookmarks show filled gold star (`#f59e0b`), unbookmarked show subtle outlined star.
- **Dedicated Sidebar Bookmarks View (`packages/vscode-client/src/views/bookmarks-tree-provider.ts`)**:
  - Registered `skillforge.bookmarksView` under `views.skillforge-activitybar` in `package.json`.
  - Implemented `BookmarksTreeProvider` displaying saved tools grouped cleanly by category with difficulty pills, ecosystem icons, and friendly empty-state guidance.
  - Registered commands `skillforge.toggleBookmark` and `skillforge.clearBookmarks` with modal confirmation.
- **Technology Comparison Matrix (`packages/server/src/engine/comparison-engine.ts`, `packages/vscode-client/src/webview/comparison-html.ts`, `packages/vscode-client/src/webview/comparison-panel.ts`)**:
  - Built `ComparisonEngine` in the headless LSP server accepting 2 or 3 skill IDs or indicators.
  - Added mutual conflict detector highlighting architectural exclusivity and competing library slots (e.g. React vs Vue.js vs Svelte).
  - Added cross-ecosystem detection and informational banner for multi-runtime comparisons (e.g. FastAPI [Python] vs Express [JavaScript]).
  - Built responsive side-by-side comparison webview with sticky column headers, trust seals, metric rows (downloads, stars, status), pros/strengths, caveats, companion stack chips, and 1-click terminal install buttons per column.
  - Added `vs` comparison action chips directly inside each skill card's Deep Dive "Alternatives" drawer, enabling instant 1-click comparison between a suggested tool and its alternative.
  - Registered command `skillforge.compareSkills` supporting quick-pick selection from bookmarks or direct input.
- **Adversarial & Edge Case Hardening**:
  - Validated strict 2-3 skill bounds via Zod (`ComparisonRequestSchema`). Rejecting <2 or >3 tools to preserve side-by-side column readability.
  - Graceful fallback for missing health metrics ("Verified Catalog", "Active", "No critical caveats reported").
  - Defensive alias resolution mapping package indicators (e.g. `next` -> `nextjs`) and preventing single-tool duplicate comparisons.
  - Safe HTML escaping across all matrix cells preventing XSS injection.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Clean build, 0 errors across all 3 packages.
- `pnpm test` (`vitest run`): 249/249 tests passing across 23 test suites in 1070ms.
- `pnpm build`: Clean monorepo build with 118 verified skills in catalog.
- **Playwright E2E Verification**: 11/11 tests passing, capturing visual proof:
  - `sf_comparison_matrix.png` (3-way comparison of React vs Vue.js vs Svelte with conflict banner, metrics, pros, and install buttons).
  - `sf_crosseco_matrix.png` (Cross-ecosystem evaluation of FastAPI vs Express.js).
  - `sf_bookmarks_canvas.png` (Active gold bookmark star and Deep Dive `vs` compare chips).

---

## Phase 6: LLM Providers & BYOK Integration (with Privacy Safeguards & Periodic Feedback System) (2026-09-28)

### Deliverables
- **Privacy-First Guarantee & Local Offline Baseline**:
  - Maintained 100% offline `LocalProvider` as the uncompromised default provider with zero network transmission.
  - Added visual `Local & Private` metadata pill in the header with a vector padlock codicon, assuring developers that zero code leaves their workstation.
  - BYOK Cloud AI is an explicit opt-in choice for users who want external LLM reasoning. Privacy-preserving prompt builders sanitize inputs, transmitting only user query intent and high-level ecosystem keywords (never file contents, file paths, secrets, or source code).
- **Pluggable BYOK Provider Engine (`packages/server/src/providers/*`)**:
  - `SuggestionProvider` interface defining standard provider contract.
  - `LocalProvider`: Offline suggestion engine (<10ms) wrapping `SuggestionEngine`.
  - `OpenAIProvider`: Direct OpenAI API integration (`gpt-4o-mini` default) using native `fetch` with 4000ms `AbortSignal` timeout, structured JSON parsing, and grounding via `GroundTruthAnchor`.
  - `GeminiProvider`: Direct Google Gemini REST integration (`gemini-1.5-flash` default) with `responseMimeType: "application/json"`, error resilience, and ground truth anchoring.
  - `HybridMerger`: Seamless two-phase merger combining instant curated local results with dynamic AI discoveries, deduplicating on canonical IDs and stack indicators, and tagging AI discoveries with `llmEnhanced: true`.
  - `ProviderRegistry`: Central orchestrator providing graceful degradation: if an AI provider fails (network timeout, rate limit HTTP 429, invalid API key HTTP 401), automatically falls back to the offline local database without disrupting the developer.
- **Periodic Low-Frequency Feedback System (`packages/vscode-client/src/feedback/feedback-manager.ts`)**:
  - Manages low-frequency feedback cadence: prompts only every 5 queries or upon zero-match fallback cascade.
  - Enforces a 24-hour cooldown suppression period after any feedback submission to prevent repetitive prompts.
  - Persists feedback history and skill contribution requests locally in `context.globalState`.
- **Zero-Friction Dislike Flow & Catalog Expansion UI (`packages/vscode-client/src/webview/*`)**:
  - Designed zero-friction feedback bar with Thumbs Up/Down selectors.
  - Dislike options include 1-click `"Other"` at the bottom: clicking `"Other"` immediately records the rating without requiring any typed explanation.
  - Provides a discreet `"Add details (optional)"` button for deferred elaboration if the developer wishes to elaborate later.
  - Added offline catalog expansion footer: `"SkillForge local database is regularly updated. • Suggest a library"`. Generates pre-filled GitHub issue URLs for requested tools with safe URL encoding.
- **OS Keychain Secret Storage & Settings (`packages/vscode-client/src/secrets/*`, `package.json`, `extension.ts`)**:
  - Created `SecretManager` wrapping `vscode.SecretStorage` (macOS Keychain, Windows Credential Manager, Linux libsecret).
  - Registered commands `skillforge.setApiKey`, `skillforge.clearApiKey`, and `skillforge.configureProvider`.
  - Added VS Code configuration settings: `skillforge.provider`, `skillforge.openai.*`, `skillforge.gemini.*`, and `skillforge.timeoutMs`.
- **Adversarial Security Hardening**:
  - Neutralized HTML parser injection vulnerability by escaping `<` as `\u003c` in stringified script tag interpolations within `generateWebviewHtml`.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed cleanly across all packages with 0 diagnostics.
- `pnpm test` (`vitest run`): 215/215 tests passing across 19 test suites in 1010ms.
- `pnpm build`: Clean build across all monorepo packages (`@skillforge/shared`, `@skillforge/server`, `@skillforge/vscode-client`).
- **Playwright E2E Verification**: 8/8 automated tests passing, verifying the Privacy Pill, Thumbs Up/Down interactions, 1-click "Other" option, and instant thank-you state transition (`sf_feedback_system.png`).

---

## Phase 5.2: VS Code Client — The Suggestion Canvas (2026-09-27)

### Deliverables
- **The Suggestion Canvas Webview Panel (`packages/vscode-client/src/webview/suggestion-panel.ts`)**:
  - Singleton `vscode.WebviewPanel` lifecycle manager with `retainContextWhenHidden: true` ensuring persistent tab state and accordion positions.
  - Strict Content Security Policy (CSP) with cryptographic nonces for script and style tags.
  - Bidirectional typed IPC (`webview-messages.ts`) handling terminal install execution, clipboard copy, safe external URL navigation, and in-canvas re-querying.
- **Visual Design System & Theme Integration (`packages/vscode-client/src/webview/design-tokens.ts`)**:
  - 100% native VS Code CSS variable binding across Dark+, Light+, GitHub Dark/Light, and High Contrast.
  - Minimalist, senior-developer aesthetic: eliminated all decorative unicode emojis in favor of crisp, embedded SVG codicons (`ICON_TERMINAL`, `ICON_COPY`, `ICON_CHECK`, `ICON_EXTERNAL`, `ICON_STAR`, `ICON_DOWNLOAD`, `ICON_CLOCK`, `ICON_WARNING`, `ICON_INFO`, `ICON_FORGE`).
  - Sleek card hover elevation, responsive auto-fill grid layout, CSS ring spinner, and high-contrast accessibility compliance.
- **Interactive Skill Cards & Components (`packages/vscode-client/src/webview/webview-html.ts`)**:
  - **Trust Seals**: Engineered status badges with vector icons (`Verified`, `Validated`, `Suggested`, `Deprecated`).
  - **Match Confidence**: Clean percentage score pills (`96% match`).
  - **"Why this tool" Rationale**: Understated rationale boxes explaining why the tool fits the user's intent.
  - **Registry Health Bar**: Displays GitHub stars, weekly download counts, last publish recency, and maintenance status with SVG indicators.
  - **Conflict Warning Banners**: Highlights conflicting packages/tools with SVG warning indicator.
  - **Deep Dive Drawer**: Collapsible accordion revealing alternatives, complementary tools, and validated documentation links.
  - **Fallback Cascade & Starter Skills UX**: When fallback suggestions are triggered for zero-match queries, renders a clear amber explanation banner (`No direct skill matches found for "<query>". Showing recommended starter tools:`) and displays interactive category exploration cards below starter tools.
  - **Interactive Action Bar**: One-click terminal install in active scope, clipboard command copying with animated `"Copied"` feedback, and docs launcher.
- **CodeLens Refinement (`packages/vscode-client/src/providers/codelens-provider.ts`)**:
  - Replaced decorative sparkles with clean developer-focused prompt: `SkillForge: Suggest libraries for "..."`.
- **Workbench Integration**:
  - Registered `skillforge.showCanvas` command and view/title menu action on the Sidebar view.
  - Integrated with `skillforge.suggest` to stream loading skeletons and results directly into the canvas.

### Verification Proof
- `pnpm typecheck` (`tsc -b`): Passed with 0 diagnostics.
- `pnpm test` (`vitest run`): 169/169 tests passing across 16 test suites in 858ms.
- `pnpm build`: Clean build across all monorepo workspaces (`@skillforge/shared`, `@skillforge/server`, `@skillforge/vscode-client`).
- **Playwright E2E Suite**: 8/8 automated UI tests passing across full rendering pipeline, theme variables, micro-interactions, XSS sanitization, and Fallback Cascade dual rendering.

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
