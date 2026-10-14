# 🛠️ SkillForge

> **Cross-IDE skill suggestion engine for developers.**
> Recommends frameworks, libraries, tools, and learning paths based on developer intent and active workspace context.

---

## 📦 Ecosystem Distributions

| Platform / Ecosystem | Integration Type | Installation / Link |
| :--- | :--- | :--- |
| **VS Code (Official)** | Native Extension | [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=skillforge.skillforge) |
| **VSCodium / Open VSX** | Open Source Extension | [Open VSX Registry](https://open-vsx.org/extension/SkillForge/skillforge) |
| **Claude / Cursor / Windsurf** | Model Context Protocol | `npx -y skillforge-mcp-server` |
| **Neovim / Vim** | Native Lua Plugin & MCP | [Neovim Setup Guide](./docs/integrations/NEOVIM.md) / `lazy.nvim` |

---

## 🏗️ Architecture & Monorepo Layout

SkillForge is structured as a TypeScript monorepo using `pnpm` workspaces:

```
skillforge/
├── packages/
│   ├── shared/         # Common domain types, Zod schemas & LSP protocol contracts
│   ├── server/         # Headless LSP suggestion engine (ranking, caching, providers)
│   ├── vscode-client/  # VS Code extension client, commands & Webview UI
│   └── mcp/            # Model Context Protocol (MCP) server & CLI runner
├── lua/                # Native Neovim plugin core module
├── plugin/             # Neovim user command registration (:SkillForgeSuggest, etc.)
├── docs/               # Platform integration guides (Neovim, etc.)
├── .gsd/               # GSD methodology state, specs, and roadmaps
├── CHANGELOG.md        # Phase history and milestone tracking
├── DECISIONS.md        # Architecture Decision Records (ADRs)
└── PROJECT_RULES.md    # GSD gating protocol and engineering standards
```

---

## ⚡ Quickstart & Development

### Prerequisites
- Node.js >= 20.x
- `pnpm` >= 9.x

### Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all test suites
pnpm test

# Typecheck the entire project
pnpm typecheck

# Clean build artifacts
pnpm clean
```

---

## 🏛️ GSD Development Lifecycle

Development in this repository is governed by the **GSD Gating Protocol** defined in [`PROJECT_RULES.md`](./PROJECT_RULES.md):

1. **Gate 1 — Planning Gate**: Before code is written, a plan is formulated. Execution is locked until user approval.
2. **Gate 2 — Verification Gate**: Every feature is empirically validated via `pnpm typecheck`, `pnpm test`, and `pnpm build`.
3. **Gate 3 — Documentation Sync**: [`CHANGELOG.md`](./CHANGELOG.md), [`DECISIONS.md`](./DECISIONS.md), and [`.gsd/STATE.md`](./.gsd/STATE.md) are updated upon completion.
