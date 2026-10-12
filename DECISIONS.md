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
