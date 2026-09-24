# SPEC.md — Project Specification

> **Status**: `FINALIZED`
> **Project**: SkillForge
> **Created**: 2026-09-24

## Vision

**SkillForge** is a cross-IDE extension that acts as a developer's skill compass — when a developer has an idea they want to implement, SkillForge analyzes their intent and workspace context to suggest the technologies, frameworks, libraries, and patterns they need, with actionable learning paths. It starts beginner-friendly and progressively serves more advanced developers in future versions.

## Goals

1. **Cross-IDE Skill Suggestion Engine** — Build an LSP-based backend that works across VS Code, JetBrains, Neovim, and other LSP-compatible editors
2. **Multi-Entry-Point UX** — Support command palette, sidebar panel, and inline comment detection (`// IDEA: ...`) as trigger mechanisms
3. **Configurable Analysis Backend** — Let users choose and configure their suggestion engine: local curated DB, LLM API (Gemini/OpenAI/Anthropic), or hybrid mode
4. **Workspace-Aware Suggestions** — Scan the user's project files (package.json, requirements.txt, etc.) to tailor suggestions to their existing stack
5. **Skill Bookmarks & Comparison** — Allow users to save skill suggestions for later and compare 2-3 alternative technologies side by side
6. **Beginner-First Design** — Prioritize clarity, approachability, and educational value in all UX decisions

## Non-Goals (Out of Scope for v1.0)

- Code generation or auto-scaffolding (this is about *what to use*, not *writing code for you*)
- Full learning management system (we suggest paths, not host courses)
- Real-time collaboration features
- Senior/enterprise-tier features (advanced architecture recommendations, team skill gap analysis)
- Mobile IDE support
- Plugin marketplace for community-contributed skill databases

## Users

### Primary (v1.0): Beginners & Bootcamp Graduates
- Don't know what tools exist for a given problem domain
- Need guidance on *which* technology to pick and *why*
- Value clear explanations, difficulty ratings, and learning resources

### Secondary (v1.x+): Mid-Level Developers
- Exploring new domains (e.g., backend dev trying frontend)
- Want quick technology comparison when evaluating options
- Value workspace-aware suggestions that respect their existing stack

### Future (v2.0+): Senior Developers
- Evaluating architecture choices for new projects
- Want deep trade-off analysis and ecosystem health metrics
- Value integration with team workflows

## Constraints

- **Architecture**: LSP-based to maximize IDE compatibility from a single codebase
- **Language**: TypeScript for the LSP server and VS Code client; Kotlin for JetBrains client (later)
- **Monetization**: Design for flexibility — free core with optional premium features possible, but no commitment yet
- **API Dependencies**: Must work offline (curated DB) with optional LLM enhancement; never require an API key for basic functionality
- **Performance**: Suggestions should appear within 2 seconds for local DB, 5 seconds for LLM-enhanced

## Success Criteria

- [ ] LSP server starts and responds to skill suggestion requests
- [ ] VS Code extension connects to LSP and provides all 3 entry points (command palette, sidebar, inline comments)
- [ ] Local curated skills database returns relevant suggestions for common development domains
- [ ] At least one LLM provider (Gemini) integration works as configurable backend
- [ ] Workspace scanning detects and factors in existing project stack
- [ ] Skill bookmarks persist across sessions
- [ ] Comparison mode renders side-by-side view for 2-3 technologies
- [ ] Extension installs cleanly from VS Code marketplace (or local VSIX)
