# PROJECT_RULES.md — SkillForge GSD Protocol & Standards

> **Single Source of Truth** for the SkillForge development lifecycle.
> Tailored for single-chat GSD execution with strict quality and verification gates.

---

## 🏛️ Core Lifecycle: The Gating Protocol

Every feature, phase, and non-trivial task follows a mandatory gated sequence:

```
Planning (Gate 1) ➔ User Approval ➔ Implementation ➔ Verification & Audit (Gate 2) ➔ Documentation Sync (Gate 3)
```

---

### Gate 1: The Planning Gate (Strict Lock)

1. **Before writing any implementation code**, formulate a clear implementation plan:
   - State the objective and deliverables.
   - List the exact files to create, modify, or delete.
   - Detail the architecture and design approach.
   - **Adversarial Test Criteria (Anti-Happy-Path)**:
     - Must explicitly enumerate test cases for **non-ideal conditions**, not just happy paths.
     - Include dirty input tests (symbols, regex metacharacters like `c++`, empty strings, undefined/null).
     - Include cross-layer discrepancy tests (package name vs. entity ID mismatches).
     - Include state/option conflict tests (options changes, ecosystem overrides).
2. **STRICT GATE**: Stop and present the plan to the user.
   - **Zero implementation code** may be written until the user gives explicit approval.
   - If the user asks questions or requests changes, adjust the plan and re-confirm.

---

### Implementation Standards

1. **Modular Architecture**:
   - Respect monorepo boundaries:
     - `@skillforge/shared`: Pure protocol contracts, Zod schemas, domain types. Zero node/vscode dependencies.
     - `@skillforge/server`: Headless LSP server logic, intent matching, caching, providers.
     - `@skillforge/vscode-client`: Thin VS Code integration, commands, Webview UI, configuration storage.
2. **Performance & Extension Host Safety**:
   - Never block the VS Code extension host. All LSP calls, file scans, and network requests must be asynchronous.
   - Strict Content Security Policy (CSP) on all Webview panels. Zero inline script strings without nonces.
3. **Type Safety & Schema Integrity**:
   - Strict TypeScript (`noImplicitAny`, project references via `tsconfig.base.json`).
   - Runtime data contracts enforced via Zod schemas.

---

### 🛡️ Adversarial Testing & Anti-Happy-Path Protocol

All test suites must adhere to the 5 non-ideal condition invariants. Testing *only* happy-path or ideal fixtures is considered an audit failure:

1. **Hostile & Dirty Input Invariants**:
   - Any string parsed by regex or string operations must be tested with regex metacharacters (`c++`, `c#`, `*`, `?`, `[`, `]`, `(`, `)`), quotes, punctuation, emojis, and whitespace-only strings.
   - All public methods receiving external or LSP parameters must be tested with `null`, `undefined`, and empty object `{}` payloads.
2. **Cross-Domain Discrepancy Invariants**:
   - Never assume external package names equal internal domain IDs (e.g. `next` vs `nextjs`, `tailwindcss` vs `tailwind-css`, `@angular/core` vs `angular`). Test cross-mapping explicitly.
3. **Intent vs Context Collision Invariants**:
   - Explicit user requests must take precedence over ambient context. Test with opposing context (e.g. user queries Rust tool in a Python workspace).
   - Test cache keys across all parameter dimensions (`maxResults`, `minTrustTier`, active tabs), not just the intent string.
4. **Lifecycle & State Isolation Invariants**:
   - State transitions (caches, fallback on network down, eviction) must be tested on the **same** instance, not separate unlinked instances.
   - Async background enhancements must not cause race conditions or unhandled rejections.
5. **Schema & Boundary Invariants**:
   - Test boundary values (`0.0`, `1.0`, min length - 1, min length) and invalid enum variants.
   - Generated fallback objects must conform 100% to their target schemas (e.g. no empty string URLs if `.url()` is required).

---

### Gate 2: The Verification & Audit Gate (Empirical Proof)

Immediately following code implementation, the agent must run automated validation and provide concrete evidence:

1. **Type Checking**: Run `pnpm typecheck` (`tsc -b`) — must exit `0` with zero type errors.
2. **Test Suites**: Run `pnpm test` (`vitest run`) — all unit, integration, and adversarial tests must pass.
3. **Build Integrity**: Run `pnpm build` — all monorepo packages must build cleanly.
4. **Empirical Evidence Rule**:
   - "Trust me, it works" is strictly forbidden.
   - Every claim of task completion must include actual test counts, exit codes, or terminal output proofs.
5. **Defect Remediation**: If any test or typecheck fails, diagnose and fix it immediately before declaring the task done.

---

### Gate 3: Documentation Synchronization Gate

Before marking a phase or milestone complete:

1. **Changelog**: Append the completed deliverables to [`CHANGELOG.md`](./CHANGELOG.md).
2. **Decisions**: If any architectural, library, or design trade-off was made, record an ADR in [`DECISIONS.md`](./DECISIONS.md).
3. **State Memory**: Update [`.gsd/STATE.md`](./.gsd/STATE.md) with the current position, completed summary, and immediate next action.

---

## 📝 Decision Logging Protocol

Record an Architecture Decision Record (ADR) in [`DECISIONS.md`](./DECISIONS.md) whenever:
- Adding a new runtime dependency or library.
- Choosing between architectural patterns (e.g., local SQLite vs in-memory trie, generator-validator dual pass vs single pass).
- Making API or LSP protocol breaking changes.
- Choosing UX trigger patterns (sidebar vs command palette vs inline CodeLens).

---

## 🚀 Execution Model

- **Session Workflow**: Interactive, single-chat execution.
- **Tone**: Focused, transparent, disciplined pair programmer.
- **Commits**: Standard atomic commits (`feat(phase-x): ...`, `fix(phase-x): ...`, `docs: ...`). No heavy branching ceremonies needed.
