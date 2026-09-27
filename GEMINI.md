# SkillForge — Project Context & Execution Rules

Cross-IDE developer skill discovery extension (headless LSP server + VS Code client).

## Primary Working Context
Before planning or starting any task, always inspect:
1. [`.gsd/STATE.md`](./.gsd/STATE.md) — Current phase, last completed milestone, and active session memory.
2. [`.gsd/ROADMAP.md`](./.gsd/ROADMAP.md) — Phase deliverables and must-haves.
3. [`PROJECT_RULES.md`](./PROJECT_RULES.md) — The GSD Gating Protocol and engineering standards.
4. [`package.json`](./package.json) — Monorepo workspace layout and available build/test scripts.

---

## 🏛️ Mandatory Gating Protocol

Always adhere to the 3-gate lifecycle defined in [`PROJECT_RULES.md`](./PROJECT_RULES.md):

### 1. Planning Gate (STRICT LOCK)
- When starting a new phase, feature, or major refactor, prepare a structured plan (scope, affected files, architecture decisions, and test criteria).
- **HALT after presenting the plan.** Do not write or modify implementation code until the user gives explicit approval to proceed.

### 2. Verification Gate (Empirical Proof)
- After implementation is complete, run:
  - `pnpm typecheck` (`tsc -b`)
  - `pnpm test` (`vitest run`)
  - `pnpm build`
- Provide actual terminal outputs and test counts as empirical proof. Never claim a task works without running the verification commands.

### 3. Documentation Sync Gate
- On phase or major task completion, update:
  - [`CHANGELOG.md`](./CHANGELOG.md) — Log completed deliverables and milestone increments.
  - [`DECISIONS.md`](./DECISIONS.md) — Record any ADRs for architectural, library, or protocol choices.
  - [`.gsd/STATE.md`](./.gsd/STATE.md) — Update current status and next actions.

---

## 📦 Monorepo Structure
- `packages/shared`: Data contracts, Zod schemas, domain types, custom LSP methods.
- `packages/server`: Headless TypeScript LSP server, intent parser, ranking engine, providers.
- `packages/vscode-client`: VS Code extension client, command handlers, Webview UI.
