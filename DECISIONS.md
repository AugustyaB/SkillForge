# 🏛️ SkillForge — Architecture Decision Records (`DECISIONS.md`)

This document records the major architectural, technical, and design decisions made throughout the development of SkillForge.

---

## 📌 Decision Log Index

- [ADR-001: LSP-Based Headless Architecture](#adr-001-lsp-based-headless-architecture)
- [ADR-002: Configurable Suggestion Backends (Offline-First + BYOK)](#adr-002-configurable-suggestion-backends-offline-first--byok)
- [ADR-003: Beginner-First UX Strategy](#adr-003-beginner-first-ux-strategy)
- [ADR-004: Zod Runtime Schema Validation & Single Source of Truth](#adr-004-zod-runtime-schema-validation--single-source-of-truth)
- [ADR-005: In-Memory Inverted Indexing for Curated Knowledge Base](#adr-005-in-memory-inverted-indexing-for-curated-knowledge-base)
- [ADR-006: Scoped Multi-Ecosystem Dependency Scanning & Deterministic Caching](#adr-006-scoped-multi-ecosystem-dependency-scanning--deterministic-caching)
- [ADR-007: Layered Reliability Pipeline with Injectable Health Verification](#adr-007-layered-reliability-pipeline-with-injectable-health-verification)
- [ADR-008: Privacy-First LLM Architecture & Zero-Friction Feedback System](#adr-008-privacy-first-llm-architecture--zero-friction-feedback-system)
- [ADR-009: Persistent Bookmarking Engine & Side-by-Side Technology Comparison Matrix](#adr-009-persistent-bookmarking-engine--side-by-side-technology-comparison-matrix)
- [ADR-016: Dedicated Model Context Protocol (MCP) Server Architecture (`packages/mcp`)](#adr-016-dedicated-model-context-protocol-mcp-server-architecture-packagesmcp)
- [ADR-019: Open VSX Marketplace Quality & Trust Audit Remediation](#adr-019-open-vsx-marketplace-quality--trust-audit-remediation)
- [ADR-020: Information Retrieval Evaluation Harness & SkillsBench Directive Certification (DB-v1.1)](#adr-020-information-retrieval-evaluation-harness--skillsbench-directive-certification-db-v11)
- [ADR-021: Schema & Semantic Metadata Depth (License, Deprecation, whenNotToUse)](#adr-021-schema--semantic-metadata-depth-license-deprecation-whennottouse)
- [ADR-022: Structured Synonym & Acronym Taxonomy Architecture](#adr-022-structured-synonym--acronym-taxonomy-architecture)
- [ADR-023: Workspace Private Catalog Extensibility Architecture](#adr-023-workspace-private-catalog-extensibility-architecture)
- [ADR-024: Local Skills Database & Interactive Management Engine Architecture](#adr-024-local-skills-database--interactive-management-engine-architecture)
- [ADR-025: Automated Link Health & Link Rot Audit Architecture](#adr-025-automated-link-health--link-rot-audit-architecture)
- [ADR-026: Expansion into Machine Learning, Accelerated Compute & Agent Directives (DB-v1.2)](#adr-026-expansion-into-machine-learning-accelerated-compute--agent-directives-db-v12)

---

## ADR-001: LSP-Based Headless Architecture

- **Date**: 2026-09-24
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 1)
- **Context**: The extension needs to eventually support multiple IDEs (VS Code initially, JetBrains and Neovim in future phases) without rewriting the suggestion core.
- **Decision**:
  - Build the suggestion engine as a headless Language Server Protocol (LSP) server in TypeScript (`@skillforge/server`).
  - IDE clients (`@skillforge/vscode-client`) act as thin consumers connecting via stdio JSON-RPC.
  - Define custom RPC methods (`skillforge/suggest`, `skillforge/ping`) in `@skillforge/shared`.
- **Rationale**: LSP is the industry standard for cross-IDE tooling. Writing one server is vastly more maintainable than duplicate native extensions.
- **Trade-offs**: Requires custom LSP protocol method definitions and JSON-RPC lifecycle handling.

---

## ADR-002: Configurable Suggestion Backends (Offline-First + BYOK)

- **Date**: 2026-09-24
- **Status**: **ACCEPTED**
- **Context**: Users have differing privacy preferences and environments—some want zero-network offline discovery, while others want rich LLM-assisted suggestions.
- **Decision**:
  - Implement a pluggable `SuggestionProvider` interface with backends:
    1. `LocalProvider`: Offline search against curated 100+ skills database.
    2. `GeminiProvider` / `OpenAIProvider`: Bring-Your-Own-Key (BYOK) cloud reasoning with keys stored securely in VS Code `SecretStorage`.
    3. `HybridProvider`: Local match augmented and validated by LLM.
- **Rationale**: Ensures zero-setup out of the box with zero data leakage, while providing advanced capabilities for users who want them.
- **Trade-offs**: Requires deduplication and ranking reconciliation in hybrid mode.

---

## ADR-003: Beginner-First UX Strategy

- **Date**: 2026-09-24
- **Status**: **ACCEPTED**
- **Context**: Targeting all developer experience levels at once creates confusing UX and over-complicated recommendations.
- **Decision**:
  - v1.0 optimizes for beginners and bootcamp graduates: clear explanations, "WHY" reasoning, curated learning links, and safety against deprecated or unmaintained packages.
  - v1.x will introduce side-by-side technical trade-off comparisons.
  - v2.0+ will address senior architect metrics (bundle size impact, enterprise compliance).
- **Rationale**: Beginners have the greatest need for tool discovery and clarity. Building up from clarity to advanced depth is more maintainable than simplifying a dense tool.
- **Trade-offs**: Advanced architectural comparison features deferred to post-v1.0.

---

## ADR-004: Zod Runtime Schema Validation & Single Source of Truth

- **Date**: 2026-09-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 2)
- **Context**: In production software integrating heterogeneous data and future LLM responses, TypeScript interfaces vanish at runtime, risking unhandled data shape anomalies or corrupt JSON inputs.
- **Decision**:
  - Add `zod` to `@skillforge/shared`.
  - Define all core domain contracts (`SkillSchema`, `SkillCategorySchema`, `DifficultySchema`, `TrustTierSchema`) as Zod schemas.
  - Derive static TypeScript types using `z.infer<...>` so that types and validation logic are unified in a single source of truth.
- **Rationale**: Guarantees zero drift between compile-time contracts and runtime validation across server, client, and test suites.
- **Trade-offs**: Adds a ~55KB runtime dependency in `@skillforge/shared`.

---

## ADR-005: In-Memory Inverted Indexing for Curated Knowledge Base

- **Date**: 2026-09-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 2)
- **Context**: The server needs to look up skills, filter by categories, and match keywords against 100+ curated records with sub-millisecond latency without adding heavy database engines (e.g., SQLite, DuckDB).
- **Decision**:
  - Implement an in-memory `SkillsRepository` that builds inverted tag indices (`Map<string, Set<string>>`), category maps, ecosystem maps, and O(1) ID lookups on startup.
  - Tokenize user queries, filter noise stop-words, and compute multi-factor relevance scores.
- **Rationale**: High performance (<1ms lookups), zero external native C++ bindings, zero platform-specific binary dependencies, fully portable across Windows, macOS, Linux.
- **Trade-offs**: All skills reside in heap memory (~100KB JSON, well within the 30MB idle memory budget).

---

## ADR-006: Scoped Multi-Ecosystem Dependency Scanning & Deterministic Caching

- **Date**: 2026-09-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 3)
- **Context**: In large monorepos or polyglot repositories, scanning the entire workspace directory tree causes severe I/O lag and mixes frontend/backend dependencies incorrectly. Furthermore, repeated queries should not re-run matching algorithms or waste computing resources.
- **Decision**:
  - Build `WorkspaceScanner` to strictly inspect manifest files directly at user-selected directory roots (`package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`) without recursive tree traversal.
  - Implement `QueryCache` using SHA-256 hashes of `query + scopePaths + installedPackages` with a 10-minute TTL to serve duplicate queries in `0ms`.
- **Rationale**: Eliminates editor lag, prevents runaway disk I/O in monorepos, and ensures repeat queries return instantaneously.
- **Trade-offs**: Nested dependencies inside subdirectories are not discovered unless the user scopes to that subfolder.

---

## ADR-007: Layered Reliability Pipeline with Injectable Health Verification

- **Date**: 2026-09-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 4)
- **Context**: SkillForge is an advisor targeting beginners who cannot independently verify tool quality. Suggesting abandoned, deprecated, or conflicting packages causes outsized harm. LLM-generated suggestions may hallucinate nonexistent packages or produce structurally malformed outputs. The system must remain fully functional offline without live network access.
- **Decision**:
  - Implement a 6-layer reliability pipeline: (1) Zod schema validation on raw inputs, (2) Ground-truth anchoring against the curated 118-skill database, (3) Registry health verification with injectable `fetch` and 24-hour TTL cache, (4) 4-tier trust classification (verified/validated/suggested/deprecated), (5) Conflict and alternative detection, (6) Fallback cascade with category browser.
  - Use dependency injection (`FetchFunction` type) for the `HealthVerifier` to enable deterministic zero-network unit tests and seamless offline fallback.
  - Integrate all reliability components as injectable dependencies into `SuggestionEngine`, allowing individual layers to be replaced or disabled.
- **Rationale**: Layered architecture isolates each concern for independent testing and extension. DI for fetch eliminates flaky network-dependent tests. The fallback cascade guarantees the user never sees an empty screen. The trust tier system provides transparent confidence signals.
- **Trade-offs**: All 6 layers run synchronously in the suggestion pipeline, adding marginal latency (~1-5ms for local operations). Health verification against live registries requires async network calls that are deferred to future LLM integration phases. The curated DB is the only source of `verified` tier — expanding coverage requires manual curation.

---

## ADR-008: Privacy-First LLM Architecture & Zero-Friction Feedback System

- **Date**: 2026-09-28
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 6)
- **Context**: Developers are highly sensitive about codebase privacy and rightly reluctant to transmit proprietary source code to third-party cloud LLMs. Simultaneously, developers demand that the offline knowledge base regularly expand and desire an effortless way to rate recommendations without intrusive friction or typing requirements.
- **Decision**:
  - **Local Offline as Unbreakable Default**: The extension defaults to `LocalProvider` (100% offline, zero network requests, zero telemetry). BYOK Cloud AI (`OpenAIProvider`, `GeminiProvider`) is purely an opt-in choice.
  - **Zero Source Code Transmission**: Even when BYOK is enabled, prompt builders only transmit the user's explicit query string and high-level detected language/ecosystem keywords. Workspace source code files, paths, and git metadata are never transmitted.
  - **OS Keychain Storage**: API keys are securely managed via `vscode.SecretStorage` (macOS Keychain, Windows Credential Manager, Linux libsecret).
  - **Low-Frequency Feedback Cadence**: Feedback prompts appear only every 5 queries or on fallback cascades, and are suppressed for 24 hours after submission.
  - **Zero-Friction "Other" Option**: Dislike flow provides 1-click reason chips including `"Other"`. Clicking `"Other"` immediately records the rating without requiring typing. Deferred elaboration (`"Add details (optional)"`) is offered non-intrusively.
  - **HTML Parser Script Injection Hardening**: Escaped `<` as `\u003c` in stringified variables embedded into webview script blocks to neutralize `</script>` parser termination vulnerabilities.
- **Rationale**: Guarantees total developer privacy while providing freedom of choice. Low-frequency feedback respects developer focus, and the zero-friction dislike flow yields high-quality signal for catalog curation without developer frustration.
- **Trade-offs**: Feedback is strictly voluntary and stored locally in `globalState`; global crowd analytics require manual community contribution via GitHub issues.

---

## ADR-009: Persistent Bookmarking Engine & Side-by-Side Technology Comparison Matrix

- **Date**: 2026-09-28
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 7)
- **Context**: Developers exploring tool suggestions require a frictionless way to save candidate technologies for future reference and compare competing libraries side-by-side without leaving their coding environment. Furthermore, unbounded comparisons lead to visual degradation in narrow editor splits, and comparing competing frameworks can create architectural ambiguity without explicit conflict warnings.
- **Decision**:
  - **Local Persistence via `globalState`**: Implement `BookmarkManager` persisting developer-saved skills in `context.globalState` with key `skillforge.bookmarks.v1`. Defensively validate all entries with Zod (`SkillBookmarkSchema`), gracefully dropping corrupted memento records without crashing.
  - **1-Click Star Toggle**: Add responsive bookmark toggle buttons to each Suggestion Canvas card header: active bookmarks show filled gold stars (`#f59e0b`), unbookmarked show subtle outlined stars. Updates are reflected reactively across both canvas and sidebar.
  - **Dedicated Bookmarks TreeView**: Register `BookmarksTreeProvider` in the SkillForge Activity Bar, organizing saved tools by category with difficulty tags, ecosystem icons, and empty-state onboarding.
  - **Headless Comparison Engine with Strict Bounds**: Implement `ComparisonEngine` in `@skillforge/server` exposed via LSP method `skillforge/compare`. Strictly limit comparisons to between 2 and 3 tools (`.min(2).max(3)`) to maintain optimal visual density and layout readability.
  - **Mutual Conflict & Exclusivity Detection**: Detect competing tools within the comparison set (e.g. React vs Vue.js vs Svelte) and display prominent amber/red architectural warning callouts.
  - **Cross-Ecosystem Evaluation**: Flag comparisons across multiple language runtimes (e.g. FastAPI [Python] vs Express [JavaScript]) with dedicated informational banners.
  - **Deep Dive "vs" Chips**: Integrate 1-click comparison chips directly into each skill card's Deep Dive "Alternatives" drawer, allowing developers to immediately compare a suggestion with its listed competitor.
  - **1-Click Terminal Execution**: Provide direct `Install` buttons per comparison column that automatically run the tool's canonical install command in the active workspace terminal.
- **Rationale**: Keeps developers in their primary flow state, eliminating browser tab sprawl while providing structured architectural guidance, trust seals, and direct terminal actions.
- **Trade-offs**: Bounding comparisons to 3 tools prevents large matrix tables (e.g. 5+ tools); however, multi-tool evaluations beyond 3 tools degrade usability in code editor splits.

---

## ADR-010: Expanded In-Memory Curated Knowledge Base (350+ Skills) vs. Cloud Database

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 8)
- **Context**: As the extension approached general release, we evaluated whether to migrate the skills repository to an external cloud database (such as Supabase or Firebase) to support arbitrary catalog growth, or retain the local in-memory JSON architecture.
- **Decision**:
  - **Retain Local In-Memory Architecture**: Keep the entire curated knowledge base local inside `packages/server/src/data/skills.json`.
  - **Aggressive Catalog Expansion**: Expand the curated starter catalog from 118 to **351 thoroughly vetted skills** covering JavaScript/TypeScript (157), Python (77), Multi-ecosystem (66), Mobile (29), Rust (20), Go (15), and Java/JVM (14).
  - **Automated Quality Rubric**: Enforce strict programmatic quality rules via `skills-quality-rubric.test.ts` ensuring that every skill has a concrete, non-fluff `whyUseIt` justification ($\ge 30$ chars, zero placeholder text), real installable package names in `stackIndicators`, and valid HTTPS documentation links.
  - **Fallback to BYOK LLM for Open-Ended Discovery**: Rely on Phase 6's BYOK LLM provider (OpenAI / Gemini) for long-tail, uncataloged edge cases, validated through the 6-layer reliability pipeline.
- **Rationale**:
  - Cloud databases destroy the extension's core value proposition: privacy (sending user queries to a 3rd party server), offline-first reliability (broken on airplanes or behind air-gapped firewalls), and speed ($<2\text{ms}$ local query vs 200-500ms network roundtrip).
  - 351 skills occupies only 260 KB raw JSON (compressed to ~65 KB in VSIX), comfortably within our 5MB VSIX budget and 30MB memory budget.
- **Trade-offs**: Catalog additions require extension releases or pull requests rather than real-time remote updates; mitigated by the BYOK LLM fallback and planned community dataset sync.

---

## ADR-011: Production `esbuild` Dual-Bundle Architecture

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 8)
- **Context**: VS Code extension best practices recommend bundling multi-file TypeScript distributions and dependencies into single self-contained files to minimize filesystem I/O, reduce VSIX archive sizes, and achieve sub-200ms extension activation latency.
- **Decision**:
  - **Dual-Bundle Pipeline**: Implement `packages/vscode-client/esbuild.mjs` bundling:
    1. Client Bundle: `src/extension.ts` $\to$ `dist/extension.js` (target: Node 18, format: CommonJS, external: `['vscode']`, minified, sourcemapped).
    2. Server Bundle: `packages/server/src/index.ts` $\to$ `packages/vscode-client/dist/server.js` (target: Node 18, format: CommonJS, inlines all JSON data and `@skillforge/shared`, minified, sourcemapped).
  - **Dynamic Server Path Resolution**: Update `extension.ts` to check `dist/server.js` first in production bundles, gracefully falling back to `../server/dist/index.js` in development.
  - **Strict `.vscodeignore`**: Exclude all TypeScript sources, test suites, build caches, and maps from the final package archive.
- **Rationale**: Reduces VSIX archive size to **261.57 KB** (far below the 5MB budget) and reduces cold activation time to $<150\text{ms}$ while eliminating runtime `node_modules` dependencies for the server.
- **Trade-offs**: Requires running `pnpm run bundle` or `pnpm run build` prior to running the extension in production mode.

---

## ADR-012: Interactive First-Run Onboarding Walkthrough

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 8)
- **Context**: First-time users installing SkillForge need immediate orientation on how intent discovery, context scoping, CodeLens triggers, and side-by-side comparisons operate without feeling overwhelmed by popups or unfamiliar terminology.
- **Decision**:
  - **Native `contributes.walkthroughs`**: Register a native VS Code Walkthrough (`skillforge.walkthrough`) with 5 visual markdown guide cards: Welcome, Scoping, Triggers, Comparison, and Privacy.
  - **Automatic First-Launch Trigger**: Automatically invoke `workbench.action.openWalkthrough` on initial extension activation using `context.globalState` (`skillforge.onboarding.shown.v1`), ensuring it runs once and never pops up uninvited again.
  - **Manual Trigger**: Expose `skillforge.openWalkthrough` in the Command Palette and Activity Bar header menu (`mortar-board` icon) so users can revisit the guide anytime.
- **Rationale**: Conforms to official VS Code Extension Guidelines for onboarding and drives discoverability of inline CodeLens and monorepo scoping features.
- **Trade-offs**: Adds 5 small markdown files to the extension distribution (~6 KB total).

---

## ADR-013: Multi-Platform Agent Skill Directive Generation & Usability Verification

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 9)
- **Context**: Modern developers increasingly pair-program with AI coding agents (Antigravity, Claude Code, Cursor, Windsurf, Copilot). Simply discovering a library is half the journey—agents also need deterministic, structured operational directives (`SKILL.md`, `.mdc`, `AGENTS.md`) so they don't hallucinate deprecated APIs, over-engineer abstractions, or skip verification tests. Furthermore, vague "Act as a senior developer" persona prompts fail in real agentic workflows.
- **Decision**:
  - **Multi-Format Directive Engine (`AgentSkillGenerator`)**: Generate structured markdown directives with strict YAML frontmatter supporting 4 target standards:
    1. `.agent/skills/<id>/SKILL.md` (Antigravity & Claude Code modular skills)
    2. `.cursor/rules/<id>.mdc` (Cursor IDE ecosystem-scoped glob rules)
    3. `.claude/skills/<id>/SKILL.md` (Dedicated Claude Code skills)
    4. `AGENTS.md` (Repository root agent directives)
  - **Andrej Karpathy's 4 Coding Disciplines**: Embed actionable operational constraints (*Think Before Coding*, *Simplicity & Minimal Surface Area*, *Surgical Precision*, *Verification Rigor*), category-specific idiomatic patterns, common anti-patterns, and deterministic CLI verification commands (`pytest`, `pnpm test && pnpm typecheck`, `cargo test`, `go test ./...`).
  - **Zero-Dependency YAML Serializer & Path Sanitizer**: Implement safe YAML frontmatter serialization and strict path sanitization (`sanitizeSkillId`) to neutralize directory traversal and scoped package characters (`@`, `/`, `.`).
  - **Empirical Agent Usability Test Suite**: Validate every generated skill file in `agent-skill-usability.test.ts` by simulating AI agent parsing of frontmatter triggers, operational rules, and executable bash verification blocks.
- **Rationale**: Transforms SkillForge from a passive discovery catalog into an active bridge between human developers and autonomous coding agents, with zero external runtime dependencies.
- **Trade-offs**: Increases server bundle size by ~12 KB (272 KB $\to$ 284.4 KB), remaining well within performance budgets.

---

## ADR-014: Dual-Marketplace Release Pipeline & Zero-Leak Package Hygiene

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 8 / Marketplace Automation)
- **Context**: Releasing SkillForge to developers requires seamless publishing across both the official Visual Studio Marketplace and the community Open VSX Registry (supporting VSCodium, Gitpod, Cursor, and open-source VS Code distributions). Manual publication is prone to human error (version mismatches, leaking development source files or test artifacts, forgotten verification commands).
- **Decision**:
  - **Automated GitHub Actions Release Pipeline (`.github/workflows/release.yml`)**:
    - Triggered on tag pushes (`v*`).
    - Enforces version parity: aborts release if the Git tag does not match the version declared in `packages/vscode-client/package.json`.
    - Enforces the 3-gate verification protocol before packaging (`pnpm typecheck`, `pnpm test`, `pnpm build`).
    - Dual publishing: `@vscode/vsce publish` (VS Code Marketplace) via `VSCE_PAT` and `npx ovsx publish` (Open VSX) via `OVSX_PAT`.
    - Automatically creates a GitHub Release and attaches the compiled `.vsix` binary for direct offline distribution.
  - **Multi-OS Continuous Integration (`.github/workflows/ci.yml`)**:
    - Runs matrix builds across Ubuntu and Windows runners on every `push` and `pull_request` to `main`.
    - Includes automated `package-audit` asserting that the generated VSIX is under $1.5\text{ MB}$ and contains zero raw `extension/src/` TypeScript source files.
  - **Strict Package Ignore Rules (`.vscodeignore`)**:
    - Whitelists compiled runtime bundles (`dist/`), icons (`resources/`), and user onboarding markdown (`walkthrough/`).
    - Explicitly excludes `*.vsix`, `src/**`, `coverage/**`, test files, `.map` files, and OS junk (`.DS_Store`, `Thumbs.db`).
- **Rationale**: Guarantees reproducible, zero-leak deployments across both marketplace ecosystems while preventing bloated binaries and accidental source code leaks.
- **Trade-offs**: Requires setting up repository secrets (`VSCE_PAT`, `OVSX_PAT`) and maintaining separate publisher accounts on Azure DevOps and Open VSX.

---

## ADR-015: Filesystem Boundary Containment & Anti-Misdirection Defense

- **Date**: 2026-10-12
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: As users open projects with non-standard folder layouts, multi-root workspaces, Windows drive letter inconsistencies, monorepos, and deleted/moved subfolders, naïve path operations (`.startsWith()`, `path.join(root, absPath)`, unqualified `cd`) cause files to be written in wrong subfolders, command executions to fail, or scopes to misdirect.
- **Decision**:
  - **Standardized Drive Casing (`normalizePath`)**: Capitalize drive letters (`c:` $\to$ `C:`) uniformly on Windows to prevent false mismatches.
  - **Strict Containment Validation (`isPathInsideRoot`)**: Enforce directory boundary checks using `path.relative()` rather than prefix matching, preventing sibling folder collisions (`/app` matching `/app-secrets`).
  - **Workspace Root Anchoring for Global Directives**: Enforce that repository-wide agent files (`AGENTS.md`, `.cursor/rules/*.mdc`) are placed at `scopeManager.workspaceRoot`, preventing them from being buried inside scoped subpackages in monorepos.
  - **Dynamic Scope Healing**: If a previously saved scope folder is deleted or moved during an active session, `ScopeManager.activeScope` detects disk absence and transparently falls back to `Entire Workspace`.
  - **Universal Shell Navigation**: Sanitize terminal commands across Windows PowerShell 5.1/7+, cmd.exe, and POSIX shells with disk existence pre-checks.
  - **Virtual Scheme Filtering**: Guard CodeLens and active editor suggestions to `file` and `untitled` schemes, ignoring internal `git:`, `output:`, and debug consoles.
- **Rationale**: Eliminates silent path misdirection bugs, prevents file leakage outside workspace boundaries, and guarantees stable execution regardless of OS or monorepo depth.
- **Trade-offs**: Adds tiny boundary checks ($\le 0.05\text{ms}$) on scope switching and file writing.

---

## ADR-016: Dedicated Model Context Protocol (MCP) Server Architecture (`packages/mcp`)

- **Date**: 2026-10-13
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: Autonomous AI coding agents and assistants (Claude Desktop, Claude Code CLI, Cursor, Windsurf, Google Antigravity) natively invoke developer capabilities using the Model Context Protocol (MCP). To empower AI agents with SkillForge's offline library catalog (363 skills), architectural conflict detection, and Karpathy rule generation, we needed to expose SkillForge via MCP without touching, modifying, or creating regression risks for the live VS Code extension client.
- **Decision**:
  - **Decoupled Monorepo Package (`packages/mcp`)**: Create a standalone package `@skillforge/mcp` powered by `@modelcontextprotocol/sdk` (`McpServer` + `StdioServerTransport`).
  - **Non-LSP Library Export (`@skillforge/server/api`)**: Refactor `@skillforge/server` to export its core algorithmic engines (`SuggestionEngine`, `ComparisonEngine`, `AgentSkillGenerator`, `SkillsRepository`, `WorkspaceScanner`) via a dedicated `src/api.ts` entry point, isolating them from `vscode-languageserver` stdio stream initialization.
  - **4 Registered Agent Tools**:
    1. `skillforge_suggest`: Intent-based library discovery with trust tiers, conflict warnings, and install commands.
    2. `skillforge_compare`: Side-by-side comparison matrix with conflict warnings, health metrics, and tradeoffs.
    3. `skillforge_create_rules`: Dynamic agent directive generation embedding Andrej Karpathy's 4 disciplines and bash verification protocols.
    4. `skillforge_get_catalog`: Filterable, paginated catalog browser.
  - **Strict Stdio Stream Discipline**: Keep `stdout` 100% clean for JSON-RPC 2.0 messages; route all diagnostic logs and startup messages to `stderr` (`console.error`).
  - **100% Offline-First Execution**: Zero user code or proprietary tokens leave the developer's machine; all decisions leverage the curated offline brain.
- **Rationale**: Gives AI coding assistants instant access to SkillForge's curated database, architectural conflict engine, and Karpathy rule generation without touching or destabilizing the VS Code extension codebase.
- **Trade-offs**: Requires building and publishing `@skillforge/mcp` as an npm binary (`skillforge-mcp`) alongside the VS Code VSIX extension.

---

## ADR-017: Resilient Comparison Column Fallback Synthesis for Uncataloged Alternatives

- **Date**: 2026-10-14
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: In real-world projects and in the curated database, catalog skills frequently reference external community alternatives (e.g. `pinia` lists `vuex`, `zod` lists `yup`, `mysql` lists `mariadb`). Previously, `ComparisonEngine.compare()` threw an unhandled exception if any requested ID was not in the curated catalog, causing the VS Code Webview comparison panel to crash with an error popup and causing the MCP tool to report misleading error messages.
- **Decision**:
  - Update `ComparisonEngine` to dynamically synthesize unanchored `ComparisonColumn` records (`trustTier: 'suggested'`) whenever a missing ID is declared in `alternatives` or `worksWellWith` of any resolved catalog skill.
  - Derive category, ecosystem, and official registry URLs (`npm`, `pypi`, `crates.io`, `pkg.go.dev`) cleanly from the companion anchor.
  - Maintain bidirectional conflict detection so direct alternative warnings (`"Pinia" and "Vuex" are direct alternatives in state-management`) continue to trigger.
  - Throw descriptive errors only when no tools in the comparison request are recognizable or related.
- **Rationale**: Real-world developers comparing tools must never experience an application crash when clicking comparison buttons provided by our own UI or when comparing real-world tools.

---

## ADR-018: Standalone Zero-Dependency Executable Packaging for Model Context Protocol (MCP) Server

- **Date**: 2026-10-14
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: Autonomous AI coding agents (Claude Desktop, Cursor, Antigravity) invoke `@skillforge/mcp` via `npx @skillforge/mcp`. Because `@skillforge/server` and `@skillforge/shared` are `"private": true` packages in the monorepo, compiling solely with `tsc -b` produced output with unresolvable module imports outside the workspace.
- **Decision**:
  - Implement `packages/mcp/esbuild.mjs` to bundle `@skillforge/server`, `@skillforge/shared`, and the catalog dataset into a single self-contained executable at `packages/mcp/dist/index.js`.
  - Remove `SkillForgeServer` (LSP server) from `packages/server/src/api.ts` to cleanly decouple headless engines from `vscode-languageserver` and eliminate ESM dynamic `require` incompatibilities.
  - Inject a `createRequire` banner and Node shebang `#!/usr/bin/env node`.
  - Add continuous watch and stdio smoke test verification in `.github/workflows/ci.yml`.
- **Rationale**: Guarantees that any developer running `npx -y @skillforge/mcp` anywhere in the world gets an instant, zero-setup, crash-free execution experience.

---

## ADR-019: Open VSX Marketplace Quality & Trust Audit Remediation

- **Date**: 2026-10-14
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: An external audit of the live Open VSX release (`SkillForge.skillforge v0.1.0`) surfaced 10 quality, trust, and discoverability issues: broken repository/issue links (404), invalid default cloud AI model IDs (`gemini-3.5-flash`, `gpt-4.1-mini`), missing changelog in the VSIX archive, lack of Python `# IDEA:` CodeLens syntax documentation, zero screenshots of the UI, missing complete 16-command reference, unlisted languages & manifest detection rules, missing Quick Install snippet, tagline wording inconsistency, and CC BY 4.0 data attribution gap.
- **Decision**:
  - **Verified Repository URLs**: Updated `repository`, `bugs`, and `homepage` across all manifests to `https://github.com/AugustyaB/SkillForge`.
  - **Production AI Model Defaults**: Updated default BYOK models to valid, production endpoints: `gemini-2.0-flash` (Google Gemini) and `gpt-4o-mini` (OpenAI), completely eliminating 404 API errors and silent fallback delays.
  - **Automated VSIX Changelog & NOTICE Bundling**: Integrated `pnpm run copy-docs` into extension build/packaging lifecycle, guaranteeing `CHANGELOG.md` and `NOTICE` are bundled at package root for the Open VSX "Changes" tab.
  - **UI Screenshots Showcase**: Created 4 high-resolution 960x620 PNG screenshots in `resources/screenshots/` (sidebar overview, comparison matrix, codelens triggers, agent directives) complying strictly with `vsce` PNG requirements.
  - **Python Syntax & Anti-Happy-Path Hardening**: Updated documentation and walkthroughs to show `# IDEA:` / `# SKILL:` for Python alongside C-style `// IDEA:`. Added tests confirming Python floor division (`//`) is never misidentified as a CodeLens trigger.
  - **Complete Command & Language Matrices**: Added complete 16-command table with keybindings and 11-language manifest detection table to README.
  - **Dual-License Attribution Notice**: Formalized dual-licensing in `README.md` and created `NOTICE` outlining MIT software permissions and CC BY 4.0 dataset attribution terms.
- **Rationale**: Resolves all 10 audit findings, ensuring user trust, accurate BYOK behavior, and seamless marketplace presentation on Open VSX and VS Code Marketplace.
- **Trade-offs**: Increases packaged VSIX archive size from 407 KB to 567 KB due to bundled screenshots and full changelog, well within the 1.5 MB performance budget.

---

## ADR-020: Information Retrieval Evaluation Harness & SkillsBench Directive Certification (DB-v1.1)

- **Date**: 2026-10-26
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: As the SkillForge knowledge base scaled to 378 skills across 15 categories, empirical proof of recommendation accuracy and agent usability became mandatory. Industry standards (Anthropic Agent Evals, SkillsBench, OpenAI Evals) require rigorous quantitative benchmarks (MRR, NDCG@k, HitRate@k) and defensive resilience against non-ideal queries (hostile inputs, typos, regex characters).
- **Decision**:
  - **IR Benchmark Architecture (`packages/server/src/benchmarks/`)**:
    - Created mathematical evaluation library (`ir-metrics.ts`) implementing MRR, DCG@k, NDCG@k, and HitRate@k.
    - Curated 46 diverse developer evaluation queries (`golden-queries.ts`) with graded relevance (3=Ideal, 2=Strong, 1=Acceptable), including adversarial edge cases.
    - Built `BenchmarkRunner` producing consolidated reports and terminal scorecards.
  - **SkillsBench & Anthropic 5-Pillar Directive Evaluator (`agent-directive-evaluator.ts`)**:
    - Built automated evaluator enforcing Token Budget (1,000–6,500 chars), Frontmatter Integrity (`agent-skill`, `claude-skill`, `cursor-rule`, `root-agents`), Progressive Disclosure (trigger guidance + negative boundaries), Deterministic Verification commands, and Anti-Pattern warnings.
  - **Ranking Algorithm Tuning**:
    - Added morphological lemmatization (suffix stripping) and length-guarded substring tag matching in `SkillsRepository.search`.
    - Replaced premature hard difficulty filtering with a Soft Inferred Difficulty Boost (+10 pts) in `SuggestionEngine`, ensuring descriptive query adjectives (e.g. "complex sorting") never eliminate relevant intermediate/beginner libraries.
    - Introduced Category Intent Alignment Boost (+35 pts) to prioritize domain-appropriate tools over mentioned ambient language identifiers.
  - **Defensive Error Boundaries**:
    - Wrapped LSP RPC handlers (`suggest`, `compare`, `generateAgentSkill`) in try/catch blocks with structured fallback responses.
    - Sanitized `alreadyInstalled` and `activeFileSignals` against hostile null/undefined/number inputs.
    - Clamped `options.maxResults` strictly between 1 and 50.
- **Empirical Results**:
  - MRR: **0.9496** (target $\ge 0.8500$)
  - NDCG@5: **0.8222** (target $\ge 0.8000$)
  - HitRate@1: **0.9070** (target $\ge 0.7000$)
  - HitRate@3: **1.0000** (target $\ge 0.9000$)
  - HitRate@5: **1.0000** (target $\ge 0.9500$)
  - Agent Directive Quality: **100% compliance** across all 28 variants.
  - Latency: P50 = 2.27ms, P95 = 4.92ms (< 10ms target).
- **Rationale**: Aligns SkillForge with peer industry benchmarks, certifying the database as production-ready and fully reproducible.

---

## ADR-021: Schema & Semantic Metadata Depth (License, Deprecation, whenNotToUse)

- **Date**: 2026-10-26
- **Status**: **ACCEPTED & IMPLEMENTED**
- **Context**: While `DB-v1.1` certified topological graph invariants and IR metrics, enterprise developers require explicit software licensing compliance (`license`), active deprecation warnings with modern replacement targets (`isDeprecated`, `migrationTarget`), tool-specific anti-patterns (`whenNotToUse`), and target execution runtimes (`runtimes`).
- **Decision**:
  - **Schema Extensions**: Added optional/defaulted fields to `SkillSchema` in `@skillforge/shared`: `license`, `isDeprecated`, `deprecatedReason`, `migrationTarget`, `whenNotToUse`, `runtimes`, and `source`.
  - **Backward Compatibility via Normalization**: Implemented `normalizeSkillDefaults` in `@skillforge/shared/src/schemas.ts` to ensure all parsed catalog records receive non-empty defaults (`license: 'MIT'`, `isDeprecated: false`, etc.) while allowing legacy mocks and test literals without new fields to compile cleanly.
  - **Full Catalog Backfill**: Enriched all 378 skills in `skills.json` with accurate SPDX licenses (`MIT`, `Apache-2.0`, `BSD-3-Clause`, `Proprietary`), active deprecation flags for legacy tools (e.g. `recoil` $\to$ `jotai`), and populated `whenNotToUse` bullets on architectural tools (`prisma`, `mongodb`, `zustand`, `docker`, `fastapi`, `apollo-graphql`, `tailwind-css`, etc.).
  - **Directive & Comparison Surfacing**: Updated `AgentSkillGenerator` to inject deprecation notice banners and tool-specific `### When NOT to Use` sections. Updated `ComparisonEngine` to surface licenses in pros and deprecation / avoid-if guidance in caveats.
- **Empirical Results**:
  - 100% of 378 catalog skills contain valid licenses, deprecation flags, and runtime metadata.
  - All 402 unit tests in 33 test files pass cleanly, including the new `schema-lifecycle.test.ts` suite.
- **Rationale**: Elevates SkillForge from a simple library index to a legally compliant, lifecycle-aware developer knowledge engine.

---

## ADR-022: Structured Synonym & Acronym Taxonomy Architecture

- **Date**: 2026-10-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 2)
- **Context**: Real-world developers frequently query using common industry abbreviations, acronyms, and shorthand (e.g. `authn`, `sso`, `k8s`, `tf`, `gql`, `e2e`, `rdbms`, `mq`, `i18n`, `wasm`). Previously, unless a skill's individual JSON tags manually duplicated these acronyms, natural language queries failed or produced suboptimal rankings.
- **Decision**:
  - **Centralized Taxonomy Dictionary (`packages/server/src/data/taxonomy.ts`)**:
    - Created `TAXONOMY_MAP` bridging industry acronyms with canonical categories, tags, target tools, and expansions across 9 key engineering domains (Auth, Databases, Testing, Protocols/Messaging, DevOps/IaC, Internationalization, Languages, UI/CLI, Observability/AI).
  - **Defensive Boundary & Prototype Pollution Protections**:
    - Implemented `expandQueryWithTaxonomy(rawQuery)` utilizing strict whole-word token matching. Substrings within larger words (e.g. `platform` containing `tf`, `rates` containing `ts`) never trigger spurious taxonomy expansions.
    - Added defense against object prototype properties (`constructor`, `__proto__`, `toString`, `valueOf`), ensuring adversarial attacks or unusual inputs cannot pollute runtime behavior.
    - Sanitized punctuation and non-alphanumeric noise strings (`!@#$%^&*()_+`) to return clean, empty token arrays without throwing exceptions.
  - **Integrated Intent Parsing & Scoring Pipeline**:
    - Enriched `IntentParser.parse`: dynamically extracts detected categories and explicit ecosystem hints from shorthand terms (`py`, `ts`, `rs`, `c++`, `authn`, `rdbms`).
    - Enriched `SkillsRepository.search`: awards canonical tool matches (+55 pts), taxonomy category alignment (+20 pts), and taxonomy synonym token matches (+25/+30 pts).
- **Empirical Results**:
  - Searching for `tf` reliably ranks `terraform` at #1.
  - Searching for `k8s` ranks `kubernetes` at #1.
  - Searching for `authn` surfaces top authentication tools (`next-auth`, `clerk`, `passport`, `lucia`).
  - Searching for `gql` returns `apollo-graphql` in top results.
  - Searching for `e2e` surfaces `playwright` and `cypress`.
  - Added dedicated test suite `taxonomy-expansion.test.ts` (17 tests).
  - Maintained zero regressions on benchmark harness: $\text{MRR} = 0.9496$, $\text{NDCG@5} = 0.8225$, $\text{HitRate@3} = 1.0000$. Total passing tests increased to **419 / 419 across 34 suites**.
- **Rationale**: Decouples query vocabulary flexibility from catalog authoring overhead, ensuring complete coverage for standard developer vernacular while maintaining strict performance and security.

---

## ADR-023: Workspace Private Catalog Extensibility Architecture

- **Date**: 2026-10-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 3)
- **Context**: Enterprise repositories and specialized engineering teams need to register internal corporate libraries (e.g. `@corp/auth-client`, bespoke design systems) or apply project-specific overrides (e.g. flagging a bundled library as deprecated in favor of an internal tool) without modifying the bundled `skills.json` dataset.
- **Decision**:
  - **Shared Configuration Schemas (`@skillforge/shared`)**:
    - Created `WorkspaceSkillsConfigSchema` supporting both loose array representations (`[ { id: "corp-auth", ... } ]`) and structured config objects (`{ version: "1.0", skills: [...], overrides: { "recoil": { ... } } }`).
    - Implemented `validateWorkspaceSkillsConfig` ensuring all declared workspace skills receive `source: 'workspace'`, undergo default normalization, and are validated against ID uniqueness constraints.
  - **In-Memory Dynamic Overlay Engine (`SkillsRepository`)**:
    - Built `loadWorkspaceConfig` and `loadWorkspaceSkills` scanning workspace candidate files in order: `.skillforge.json` $\to$ `.skillforge/skills.json` $\to$ `.skillforge/catalog.json`.
    - Merged private skills into all existing inverted indices (`idIndex`, `tagIndex`, `categoryIndex`, `ecosystemIndex`, `indicatorIndex`) with non-destructive shadowing: an identical ID shadows the bundled skill without corrupting or duplicating repository entries.
    - Implemented `resetWorkspaceSkills` ensuring pristine baseline restoration during test teardown and dynamic workspace folder switching.
  - **Relevance & Priority Scoring**:
    - Added a Workspace Affinity Boost (+40 pts) in `SkillsRepository.search` for private workspace skills that match query tokens, ensuring relevant company-internal tools take priority.
    - Preserved intent precedence: irrelevant workspace skills are never forcibly injected if the query opposes their category/ecosystem.
  - **Adversarial & Fault Tolerance Defenses**:
    - Enforced a 5MB maximum file size limit to prevent memory exhaustion attacks.
    - Wrapped file reading and JSON parsing in defensive try/catch blocks; invalid syntax, empty files, and permission errors record non-fatal diagnostics in `errors` array while preserving bundled catalog functionality.
    - Guarded against path traversal and hostile root inputs (`null`, `undefined`, empty string, non-existent directories).
- **Empirical Results**:
  - `workspace-private-catalog.test.ts` (14 tests) passing cleanly.
  - Total passing tests increased to **437 / 437 across 35 suites**.
  - All IR benchmark metrics maintained: $\text{MRR} = 0.9496$, $\text{NDCG@5} = 0.8225$, $\text{HitRate@3} = 1.0000$.
- **Rationale**: Provides enterprise-ready catalog extensibility with zero configuration friction and complete resilience against corrupt workspace files.

---

## ADR-024: Local Skills Database & Interactive Management Engine Architecture

- **Date**: 2026-10-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 4)
- **Context**: While Phase 3 established declarative loading of static workspace files, developers and client extensions need programmatic and interactive CRUD capabilities (create, update, delete, list) to manage custom project skills directly. These operations must be fail-safe, atomic, resilient to concurrency/file locks, and immediately synchronized with the in-memory search indices without requiring server restarts.
- **Decision**:
  - **Shared Management Contracts (`@skillforge/shared`)**:
    - Defined `AddLocalSkillPayloadSchema`, `RemoveLocalSkillPayloadSchema`, and `LocalSkillsResultSchema` in `schemas.ts`.
    - Registered custom LSP JSON-RPC methods: `skillforge/addLocalSkill`, `skillforge/removeLocalSkill`, `skillforge/listLocalSkills`.
  - **Atomic File Writing & Windows Lock Resilience**:
    - Built `LocalSkillsManager` in `@skillforge/server/src/data/local-skills-manager.ts` executing atomic writes via temporary files (`.tmp.<pid>.<timestamp>`) and atomic renames (`fs.renameSync`).
    - Added retry backoff logic (up to 3 attempts with exponential delay) to handle transient Windows antivirus or file watcher locks.
    - Added automated backup rotation: preserves `.skills.json.bak` prior to overwriting existing database files.
  - **Corrupted Database Recovery**:
    - Implemented non-destructive rotation: if an existing database file contains corrupted or invalid JSON, it is automatically rotated to `.skills.json.corrupt.<timestamp>` to prevent data loss while allowing clean recreation.
  - **Live In-Memory Cache Coherence**:
    - Implemented live mutability methods in `SkillsRepository`: `addLocalSkill`, `removeLocalSkill`, `listLocalSkills`.
    - Added or removed skills update all 5 inverted index maps immediately and invalidate `QueryCache`, making new tools instantly searchable with the +40 Workspace Affinity Boost.
- **Empirical Results**:
  - `local-skills-manager.test.ts` (11 tests) passing cleanly.
  - Total passing tests increased to **451 / 451 across 36 suites**.
  - All IR benchmark metrics maintained: $\text{MRR} = 0.9496$, $\text{NDCG@5} = 0.8225$, $\text{HitRate@3} = 1.0000$.
- **Rationale**: Encapsulates all data persistence, locking, and index synchronization within the database layer, freeing IDE clients from low-level storage management.

---

### ADR-025: Automated Link Health & Link Rot Audit Architecture
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 5)
- **Context**: External documentation URLs and learning resource links in modern developer tools continuously degrade over time ("link rot") due to domain migrations, doc engine restructurings, or CDN bot protection policies. To ensure developers never encounter broken 404 links or confusing redirects inside VS Code or agent tool calls, SkillForge requires an automated, robust verification harness that can audit URLs in CI and locally without being blocked by anti-bot protections.
- **Decision**:
  - **Core Auditor Engine (`packages/server/scripts/audit-link-rot.cjs`)**:
    - Concurrent HTTP connection pool with configurable concurrency (default: 6) and timeout (default: 6000ms).
    - Intelligent `HEAD` $\to$ `GET` fallback: tests lightweight `HEAD` first, seamlessly falling back to `GET` if the target server rejects `HEAD` (405/403/400) or fails.
    - Permanent Redirect (301/308) tracking: resolves redirects up to 5 hops with cycle detection (`REDIRECT_LOOP`) and provides an optional auto-fix flag (`--fix`) to patch `skills.json` directly.
    - Cloudflare / Anti-Bot Resilience: uses a modern desktop browser User-Agent header to avoid CDN bot-tarpitting, reducing latency from 14s+ to sub-300ms.
    - Smart Disk Caching: maintains `.link-audit-cache.json` with a 7-day TTL to avoid unnecessary repeated network requests.
    - Exponential backoff and retry for rate limiting (HTTP 429/503).
  - **CI Automation & Package Integration**:
    - Created [`.github/workflows/link-audit.yml`](file:///.github/workflows/link-audit.yml) running weekly scheduled health checks on Mondays.
    - Added `"audit:links"` script to `packages/server/package.json` and root `package.json`.
    - Created typed declarations [`audit-link-rot.d.ts`](file:///packages/server/scripts/audit-link-rot.d.ts) and [`audit-link-rot.d.cts`](file:///packages/server/scripts/audit-link-rot.d.cts).
  - **Catalog Link Rot Remediation**:
    - Audited catalog skills and resolved dead links / outdated hosts across: Recharts (`recharts.github.io`), SeaORM (`/sea-orm-tutorial/`), Uvicorn (`uvicorn.dev`), Gunicorn (MkDocs on `gunicorn.org`), Valibot (`/guides/installation/`), TanStack Virtual (`/framework/react/react-virtual`), Biome (`/linter/`), Elysia (`/quick-start`), wasm-bindgen (`/docs/wasm-bindgen/`), llm-c (`/doc/layernorm/layernorm.md`), PostCSS (`/postcss#readme`), Strawberry GraphQL (`/schema-basics`), Pytest-Asyncio (`/how-to-guides/index.html`), Ent Go (`/tutorial-setup`), Colyseus (`/getting-started`), Cassandra (`/cassandra/getting-started/`), Gin (`/en/docs/quickstart/`), BullMQ (`/guide/introduction`), OpenCV (`github.com/opencv/opencv-python`), Jotai (`/docs`), NativeWind (`/docs/getting-started/installation`), and ioredis (`/ioredis#readme`).
- **Empirical Results**:
  - `link-rot-auditor.test.ts` (13 tests) passing with 100% coverage of redirect loops, timeouts, caching, and auto-fixes.
  - Vitest test suite: **464 / 464 tests passing across 37 test suites**.
  - All Information Retrieval benchmarks verified: $\text{MRR} = 0.9496$, $\text{NDCG@5} = 0.8225$, $\text{HitRate@3} = 1.0000$, $\text{HitRate@5} = 1.0000$.
- **Rationale**: Keeps documentation links evergreen, prevents broken links from reaching production users, and automates link hygiene with zero manual overhead.

---

## ADR-026: Expansion into Machine Learning, Accelerated Compute & Agent Directives (DB-v1.2)

- **Date**: 2026-10-27
- **Status**: **ACCEPTED & IMPLEMENTED** (Release DB-v1.2)
- **Context**: The SkillForge database was primarily focused on web, backend, and cloud development. Critical non-web domains—specifically Machine Learning accelerators, LLM serving engines, quantization, vector retrieval, computer vision, post-training alignment, and RAG evaluation—as well as the core `javascript` language entry, were absent.
- **Decision**:
  - **4-Wave Staged Ingestion Lifecycle**:
    - **Wave 1 (Languages & ML Accelerators)**: `javascript`, `jax`, `onnxruntime`, `deepspeed`.
    - **Wave 2 (Serving, Quantization & Retrieval)**: `sglang`, `llama-cpp-python`, `faiss`, `sentence-transformers`.
    - **Wave 3 (Vision, Alignment & Evaluation)**: `diffusers`, `timm`, `trl`, `ragas`, `guardrails-ai`.
    - **Wave 4 (Agent Directives & IR Certification)**: Generated 52 verified agent directives (`SKILL.md`) in 4 formats and certified Information Retrieval benchmarks.
  - **Graph Topology & Reciprocity**:
    - Enforced all 7 Utility Fitness Rubric (UFR) invariants on 391 skills, ensuring 100% bidirectional alternative symmetry and zero isolated island skills.
    - Updated reciprocal relationships in `typescript`, `pytorch`, `tensorflow`, `unsloth`, `fastembed`, `bun`, `vllm`, `ollama`, `chromadb`, `qdrant`, `huggingface-transformers`, `opencv-python`, `outlines-ai`, and `instructor`.
  - **Zero Link Rot Certification**:
    - Audited all official documentation and tutorial URLs with `audit-link-rot.cjs` yielding 100% 200 OK responses with zero redirects or broken links.
  - **Natural Language Taxonomy Expansion**:
    - Added comprehensive synonym and acronym expansion mappings in `packages/server/src/data/taxonomy.ts` covering `diffusers`, `diffusion`, `flux`, `timm`, `vit`, `trl`, `dpo`, `grpo`, `ragas`, `guardrails`, `sglang`, `radix`, `gguf`, `llamacpp`, `faiss`, `hnsw`, `sbert`, `jax`, `onnxruntime`, and `deepspeed`.
- **Empirical Results**:
  - Catalog expanded from 378 to 391 skills.
  - All 467 tests across 37 suites passing cleanly.
  - Information Retrieval metrics certified on `DB-v1.2`: $\text{MRR} = 0.9496$, $\text{NDCG@5} = 0.8225$, $\text{HitRate@3} = 1.0000$, $\text{HitRate@5} = 1.0000$.
---

## ADR-027: SkillForge Project Studio — Adaptive Ideation & Workspace Scaffolder (v1.2.0)

- **Date**: 2026-10-28
- **Status**: **ACCEPTED & IMPLEMENTED** (Phase 11 / Release v1.2.0)
- **Context**: Developers (especially college students breaking out of tutorial hell, but also experienced professionals designing side projects or POCs) struggle with "blank canvas paralysis". Static project catalogs quickly become obsolete and impose heavy maintenance debt. The extension needed a dynamic, proactive studio that captures user preferences through guided discovery, formulates concrete project charters with non-clichéd technical twists using modern AI, and 1-click scaffolds the workspace while linking directly into SkillForge's vetted 391-skill ecosystem and AI coding directives.
- **Decision**:
  - **Hybrid Architecture (Adaptive Wizard + Wildcard + Flexible AI Bridge)**:
    - Implemented `ProjectIdeationWizard` providing a low-cognitive-barrier 5-step QuickPick flow (Persona, Domain, Language/Stack, Time Commitment, and Optional Learning Goal).
    - Built `WildcardIdeaSynthesizer` providing zero-input trending project seeds pairing modern paradigms (e.g. eBPF, local embeddings, WebSockets, regex bloom filters) with real problems.
    - Implemented `IdeaPromptCompiler` enforcing strict time-to-scope pruning (preventing over-engineering on weekend projects) and anchoring recommended libraries in SkillForge's canonical catalog.
  - **Multi-Tiered LLM Execution & Resilient Zero-Key Fallback**:
    - Primary: Native VS Code Language Model API (`vscode.lm`) with zero configuration required for users with GitHub Copilot or built-in language models.
    - Fallback: "Clipboard Master Prompt Exporter" (`LlmBridge.copyMasterPrompt`) allowing zero-key users to copy the engineered prompt to ChatGPT/Claude/Gemini web and import the resulting JSON charter.
  - **Non-Destructive Workspace Scaffolding**:
    - Built `ProjectScaffolderEngine` with path sanitization defending against directory traversal.
    - Generates `PROJECT_SPEC.md`, `README.md` (or `README.skillforge.md` if an existing README is present), `.skillforge.json`, and automatically invokes `AgentSkillGenerator` to generate matching `.cursor/rules/*.mdc` or `SKILL.md` files.
- **Empirical Results**:
  - Full test suite expanded to **509 tests passing across 40 suites**.
  - `skillforge-1.2.0.vsix` packaged cleanly (629.41 KB across 80 files).
- **Rationale**: Closes the developer loop from initial project ideation to technology selection, AI context generation, and verified execution.








