# SPEC.md — Project Specification

> **Status**: `FINALIZED`
> **Project**: SkillForge
> **Created**: 2026-09-24
> **Last Updated**: 2026-09-25

## Vision

**SkillForge** is a cross-IDE extension that acts as a developer's skill compass — when a developer has an idea they want to implement, SkillForge analyzes their intent and workspace context to suggest the technologies, frameworks, libraries, and patterns they need, with actionable learning paths and verified trust signals. It starts beginner-friendly and progressively serves more advanced developers in future versions.

## Goals

1. **Cross-IDE Headless Suggestion Engine** — Build an LSP-based backend that runs independently and can serve VS Code (v1.0) and future clients (JetBrains, Neovim).
2. **Multi-Entry-Point UX** — Support command palette, dedicated sidebar with context scope selector, and inline comment detection (`// IDEA: ...`, `// SKILL: ...`) as trigger mechanisms.
3. **Multi-Tiered Reliability & Trust Engine** — Guarantee accuracy and prevent hallucinations via a 6-layer reliability pipeline: Zod schema contracts, ground-truth anchoring against vetted database, package existence & health verification (npm/GitHub), trust tiers (🟢 Verified, 🟡 Validated, 🟠 Suggested, ⛔ Deprecated), transparent "WHY" reasoning, and optional Generator-Validator dual-pass LLM checking.
4. **User-Controlled Workspace Context** — Smart auto-detection of workspace dependencies with an explicit folder/scope selector in the sidebar (crucial for monorepos and multi-tier projects).
5. **Configurable Analysis Backend (BYOK)** — Fully offline zero-config curated database by default; optional Bring-Your-Own-Key (BYOK) for OpenAI-compatible and Gemini endpoints securely stored in VS Code `SecretStorage`.
6. **Smart Fallback & Duplicate Awareness** — Cache and detect duplicate/repeat queries, warn when skills are already installed in the active scope, and fallback gracefully (LLM → Local DB → Category Browser).
7. **Skill Bookmarks & Side-by-Side Comparison** — Allow users to bookmark skills into a personal library and compare 2-3 alternatives across difficulty, ecosystem, learning curve, and health metrics.
8. **Beginner-First Design & Performance Guardrails** — Snappy local results in <300ms, activation <500ms, non-blocking extension host, clean onboarding walkthrough, and accessible Webview UI with strict Content Security Policy (CSP).

## Non-Goals (Out of Scope for v1.0)

- Automatic code generation, scaffolding, or writing boilerplate
- Full learning management system (we suggest links and paths, not host courses)
- Real-time cloud collaboration / team skill gap tracking
- Native JetBrains or Neovim UI clients (LSP server is built headless to enable them post-v1.0)
- Telemetry tracking or collecting user data
- Arbitrary file-system access or outbound code transmission

## Users

### Primary (v1.0): Beginners & Bootcamp Graduates
- Don't know what tools exist for a given problem domain
- Need guidance on *which* technology to pick and *why*
- Need protection against abandoned, hallucinated, or unmaintained libraries
- Value clear explanations, difficulty ratings, and curated learning resources

### Secondary (v1.x+): Mid-Level Developers
- Exploring new domains (e.g., backend dev exploring frontend or DevOps)
- Need quick side-by-side technology comparison
- Work in monorepos where scoping context to specific folders is essential

### Future (v2.0+): Senior Developers & Architects
- Evaluating architecture choices for new projects
- Want deep trade-off analysis, health metrics, and ecosystem stability signals

## Constraints & Security Requirements

- **Privacy & Data Security**: No source code or full file paths ever leave the user's machine. Only query text and sanitized package lists are sent to the LLM (if enabled). API keys must exclusively be stored via `context.secrets` (VS Code `SecretStorage`).
- **Webview Security**: Strict CSP meta tag with nonces (`default-src 'none'; script-src 'nonce-...'; style-src ${webview.cspSource}`). Message payloads across `postMessage` must be strictly validated.
- **Architecture**: Decoupled LSP server (JSON-RPC over stdio) + thin VS Code client.
- **Language**: TypeScript across all packages managed with pnpm workspaces and Turborepo.
- **Performance Budget**: Activation <500ms, local query response <200ms, total VSIX bundle <5MB, idle memory <30MB.
- **Licensing**: Open source — MIT for extension code, CC BY 4.0 for curated skills dataset.

## Success Criteria

- [ ] LSP server boots and handles custom `skillforge/suggest` requests with strict types
- [ ] Curated skills database has 100+ verified skills with rich metadata and taxonomy
- [ ] Suggestion engine performs fuzzy matching, intent parsing, and workspace scanning
- [ ] Reliability engine validates outputs, verifies package health, filters hallucinations, and assigns trust badges
- [ ] VS Code client provides Command Palette, Sidebar with context scope selector, and CodeLens inline comment triggers
- [ ] Results panel (Webview) renders skill cards with "WHY" explanations, health metrics, and trust badges
- [ ] BYOK LLM integration works seamlessly with OpenAI-compatible and Gemini endpoints
- [ ] Duplicate query detection, "already installed" detection, and fallback cascade operate without breaking
- [ ] Bookmarks persist across sessions and comparison mode displays side-by-side matrices
- [ ] First-run onboarding walkthrough guides users interactively
- [ ] VSIX builds cleanly and installs with zero unhandled errors or typing lag
