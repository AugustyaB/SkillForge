# 🏛️ SkillForge — Architecture Decision Records (`DECISIONS.md`)

This document records the major architectural, technical, and design decisions made throughout the development of SkillForge.

---

## 📌 Decision Log Index

- [ADR-001: LSP-Based Headless Architecture](#adr-001-lsp-based-headless-architecture)
- [ADR-002: Configurable Suggestion Backends (Offline-First + BYOK)](#adr-002-configurable-suggestion-backends-offline-first--byok)
- [ADR-003: Beginner-First UX Strategy](#adr-003-beginner-first-ux-strategy)
- [ADR-004: Zod Runtime Schema Validation & Single Source of Truth](#adr-004-zod-runtime-schema-validation--single-source-of-truth)
- [ADR-005: In-Memory Inverted Indexing for Curated Knowledge Base](#adr-005-in-memory-inverted-indexing-for-curated-knowledge-base)

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
