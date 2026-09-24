# DECISIONS.md — Architecture Decision Records

> Tracks key architectural and design decisions with rationale.

---

## ADR-001: LSP-Based Architecture

**Date**: 2026-09-24
**Status**: Accepted
**Context**: The extension needs to work across VS Code, JetBrains, Neovim, and other editors.
**Decision**: Build the core as an LSP (Language Server Protocol) server in TypeScript. Each IDE gets a thin client that connects to the same server.
**Rationale**: LSP is the industry standard for cross-IDE tooling. Writing one server is far cheaper than maintaining N platform-specific implementations. TypeScript chosen because it's the native language for VS Code extensions and LSP libraries.
**Trade-offs**: JetBrains LSP support has quirks; may need Kotlin shim for rich Webview features.

---

## ADR-002: Configurable Suggestion Backends

**Date**: 2026-09-24
**Status**: Accepted
**Context**: Users have different preferences — some want offline-only, some want AI-powered, some want both.
**Decision**: Implement a `SuggestionProvider` interface with pluggable backends: `LocalProvider`, `GeminiProvider`, `HybridProvider`. Users configure their preferred mode in extension settings.
**Rationale**: Avoids forcing API key requirement. Respects offline users. Opens monetization options without architectural changes.
**Trade-offs**: More complexity in the suggestion pipeline; need deduplication logic in hybrid mode.

---

## ADR-003: Beginner-First UX Strategy

**Date**: 2026-09-24
**Status**: Accepted
**Context**: Extension targets "everyone" but can't optimize for all experience levels simultaneously.
**Decision**: v1.0 optimizes for beginners and bootcamp graduates. v1.x adds mid-level features. v2.0+ addresses senior/enterprise needs.
**Rationale**: Beginners have the most acute need for skill discovery. Their UX requirements (clarity, low jargon, learning links) are a superset of what advanced users also appreciate. Building "up" from simple is easier than simplifying a complex tool.
**Trade-offs**: May not attract senior devs in v1.0; that's acceptable.

---
