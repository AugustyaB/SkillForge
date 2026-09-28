# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 — SkillForge MVP
> **Target**: Cross-IDE skill suggestion engine with beginner-first UX, multi-tiered reliability, and user-controlled context scoping.

## Must-Haves (from SPEC)

- [x] Monorepo with pnpm workspaces + Turborepo + LSP server booting cleanly
- [x] 100+ curated skills database with categories, relationships, and metadata validation
- [x] Suggestion engine with natural language intent parsing and scoped workspace dependency scanning
- [x] Reliability engine with Zod schema contracts, package existence checks, health indicators, and trust tiers
- [x] VS Code UX with Command Palette, Sidebar (including context folder selector), and inline CodeLens triggers
- [x] Interactive Webview results panel with skill cards, "WHY" explanations, and trust badges
- [x] BYOK LLM integration (OpenAI-compatible & Gemini) securely using SecretStorage with optional Validator mode
- [x] Duplicate query detection, "already installed" detection, and graceful fallback cascade
- [x] Bookmarks persistence (globalState) and side-by-side technology comparison mode
- [ ] First-run onboarding walkthrough, strict Webview CSP, and clean VSIX packaging

---

## 8-Phase Roadmap

### Phase 1: Foundation — LSP Server & Monorepo Scaffold
**Status**: ✅ Complete
**Objective**: Establish pnpm monorepo structure, shared TypeScript build system, Vitest test harness, and a minimal headless LSP server that boots over stdio and responds to custom `skillforge/suggest` requests with client roundtrip validation.
**Deliverables**:
- Monorepo packages: `packages/server`, `packages/vscode-client`, `packages/shared`
- Shared protocol contracts and request/response types
- LSP server lifecycle handlers (`initialize`, `shutdown`, `exit`, error recovery)
- Basic VS Code client activation testing server connectivity
- Vitest configuration and base integration test
**Requirements**: Foundation for all phases
**Depends on**: Nothing

### Phase 2: Skills Database & Schema — The Knowledge Base
**Status**: ✅ Complete
**Objective**: Build a typed, validated, and queryable database of 100+ developer skills and technologies across major engineering domains with relationships and indicators.
**Deliverables**:
- TypeScript schema and Zod validation for `Skill`, `Category`, `Relationship`
- Curated seed database (100+ skills: Web Frontend, Backend, Databases, Mobile, DevOps, Testing, Security)
- Skill relationship graph (alternatives, works-with, prerequisites)
- Automated build-time validation script and search indexing structure
**Requirements**: REQ-Knowledge
**Depends on**: Phase 1

### Phase 3: Suggestion Engine & Context Scoping
**Status**: ✅ Complete
**Objective**: Implement the core matching engine that merges natural language intent with user-scoped workspace dependencies to generate ranked skill suggestions.
**Deliverables**:
- Natural language intent parser & keyword extractor
- Fuzzy tag matching and multi-factor relevance scorer
- Scoped workspace scanner supporting root or specific folder paths (`package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, etc.)
- Active file signal extractor (open editor tabs and nearby imports)
- In-memory query caching and duplicate query detection
**Requirements**: REQ-Engine, REQ-Context
**Depends on**: Phase 2

### Phase 4: Reliability Engine & Trust Verification
**Status**: ✅ Complete
**Objective**: Build the multi-tiered verification pipeline to eliminate hallucinations, detect abandoned packages, verify ecosystem compatibility, and assign transparent trust tiers.
**Deliverables**:
- Zod schema validator for all incoming and generated suggestions
- Ground-truth cross-referencer against the vetted Phase 2 database
- Package registry existence checker & health verification (npm registry / GitHub metrics with caching)
- Trust tier scoring & classification engine (🟢 Verified, 🟡 Validated, 🟠 Suggested, ⛔ Deprecated)
- Conflict and alternative detection ("pick one, not both")
- Fallback cascade orchestrator (LLM → Local DB → Category Browser)
**Requirements**: REQ-Reliability, REQ-Fallbacks
**Depends on**: Phase 3

### Phase 5.1: VS Code Client UX — The Command Center
**Status**: ✅ Complete
**Objective**: Build the core workbench integration: Command Palette, Activity Bar ViewContainer, Sidebar treeviews, Context Scope selector, inline CodeLens, and integrated terminal runner.
**Deliverables**:
- Custom Activity Bar forge icon and dedicated ViewContainer (`skillforge-activitybar`)
- Context & Stack view showing active scope, detected ecosystem, and installed packages with versions
- Quick Actions view with one-click triggers
- Recent Discoveries view persisting past queries in `workspaceState` with instant replay
- Active Context Folder Scope Selector with monorepo auto-discovery and manifest inspection
- Inline CodeLens provider for `// IDEA:` and `// SKILL:` comments across 11 languages with 300ms debounce
- Dedicated SkillForge integrated terminal runner for 1-click install execution
**Requirements**: REQ-UI, REQ-Context
**Depends on**: Phase 1, Phase 4

### Phase 5.2: VS Code Client UX — The Suggestion Canvas
**Status**: ✅ Complete
**Objective**: Build the rich, interactive Webview panel featuring the SkillForge CSS token design system, trust seals, collapsible "Why Use It" cards, health indicators, conflict alerts, and copy/install actions.
**Deliverables**:
- Secure Webview panel with strict Content Security Policy (CSP), nonces, and `asWebviewUri` asset loading
- SkillForge Design System: typography, light/dark/high-contrast VS Code theme integration, responsive CSS grid
- Skill Cards with category chips, difficulty tags, trust tier badges (🟢 Verified, 🟡 Validated, etc.)
- Deep Dive drawer / collapsible details ("Why Use It", learning resources, alternatives, caveats)
- One-click copy and terminal install triggers communicating via typed webview message passing
- Empty states, loading skeletons, and category browsing drawer when fallback cascade triggers
**Requirements**: REQ-UI, REQ-Security
**Depends on**: Phase 5.1

### Phase 6: LLM Providers & BYOK Integration (with Privacy Safeguards & Periodic Feedback)
**Status**: ✅ Complete
**Objective**: Implement pluggable Bring-Your-Own-Key LLM support with OpenAI-compatible and Gemini endpoints, OS keychain secret storage, hybrid result merging, privacy-preserving prompt builders, and periodic low-frequency feedback cadence with zero-friction dislike options.
**Deliverables**:
- `SuggestionProvider` interface abstraction and `LocalProvider` 100% offline baseline
- `OpenAIProvider` and `GeminiProvider` implementations with ground truth anchoring and timeout aborts
- Secure API key management via `vscode.SecretStorage` (`SecretManager`)
- `HybridMerger` combining instantaneous local results (<10ms) with dynamic AI discoveries
- Privacy-first visual assurance (`Local & Private` metadata pill)
- Periodic low-frequency feedback cadence manager (5 queries, 24h cooldown suppression)
- Zero-friction dislike flow with 1-click `"Other"` option (no mandatory typing)
- Offline catalog expansion link with local logging and prefilled GitHub issues
**Requirements**: REQ-LLM, REQ-BYOK, REQ-Privacy
**Depends on**: Phase 3, Phase 5

### Phase 7: Bookmarks, Comparison & Reference Suite
**Status**: ✅ Complete
**Objective**: Build productivity and decision-making features: persistent skill bookmarks, side-by-side alternative comparison matrix, and query history management.
**Deliverables**:
- Skill bookmarking system persisted across sessions via `globalState` (`BookmarkManager`)
- Bookmarks sidebar view (`skillforge.bookmarksView`, `BookmarksTreeProvider`) grouped by category with one-click access
- Side-by-side technology comparison panel (`ComparisonEngine`, `generateComparisonHtml`, `ComparisonPanel`) comparing 2-3 skills across difficulty, learning curve, ecosystem, metrics, and mutual conflict detection
- Deep Dive `vs` compare chips and 1-click terminal install buttons
- Query history view with one-click re-run capability
**Requirements**: REQ-Bookmarks, REQ-Comparison
**Depends on**: Phase 5, Phase 6

### Phase 8: Polish, Onboarding & Marketplace Release
**Status**: ⬜ Not Started
**Objective**: Finalize product readiness: interactive first-run walkthrough, graceful error notifications, performance optimization, accessibility audit, documentation, and VSIX packaging.
**Deliverables**:
- First-launch interactive walkthrough introducing trigger mechanisms
- Actionable error states (offline mode, invalid API keys, empty queries, category browser fallback)
- Performance & bundle optimization with `esbuild` (<500ms activation, <5MB VSIX)
- Extension icon (PNG ≥128x128), comprehensive marketplace `README.md`, `CHANGELOG.md`, `LICENSE` (MIT + CC BY)
- Clean VSIX package generation (`vsce package`) and local installation verification
**Requirements**: REQ-Release, REQ-Performance
**Depends on**: Phase 7

---

## Phase Dependency Graph

```mermaid
graph TD
    P1["🔧 Phase 1\nFoundation\n(LSP + Monorepo)"] --> P2["📚 Phase 2\nSkills DB\n(100+ vetted skills)"]
    P1 --> P5["🖥️ Phase 5\nVS Code UX\n(Sidebar, CodeLens, Webview)"]
    P2 --> P3["🧠 Phase 3\nSuggestion Engine\n(Intent & Context Scoping)"]
    P3 --> P4["🛡️ Phase 4\nReliability Engine\n(Zod, Health, Trust Tiers)"]
    P4 --> P5
    P3 --> P6["🤖 Phase 6\nLLM Integration\n(BYOK, Gemini/OpenAI, Hybrid)"]
    P5 --> P6
    P5 --> P7["⭐ Phase 7\nBookmarks & Compare\n(Reference Suite)"]
    P6 --> P7
    P7 --> P8["🚀 Phase 8\nPolish & Ship\n(Onboarding, VSIX, Release)"]
```
