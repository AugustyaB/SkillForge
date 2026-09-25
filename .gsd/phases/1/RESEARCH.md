# Phase 1: Research — Foundation & LSP Architecture

> **Phase**: 1 — Foundation: LSP Server & Monorepo Scaffold
> **Date**: 2026-09-25

## 1. Monorepo & Tooling Decisions

### Package Manager
- **pnpm 12.6.0** (installed and active).
- Configuration: `pnpm-workspace.yaml` with `packages/*`.
- Why pnpm: Fast hard-linked dependencies, strict dependency resolution preventing ghost dependencies, native support for `workspace:*` protocols.

### Build Orchestration & Compilation
- **TypeScript Project References** with `composite: true` across packages.
- Root `tsconfig.base.json` provides shared compiler options:
  - `target: ES2022`, `module: Node16` or `NodeNext`, `moduleResolution: Node16` or `NodeNext`
  - `strict: true`, `declaration: true`, `sourceMap: true`
- **esbuild / tsup** for fast packaging and tree-shaking client and server bundles.

## 2. LSP Server Architecture (`packages/server`)

### Libraries
- `vscode-languageserver`: `^9.0.1` (official Microsoft LSP server library for Node).
- Standard connection transport: `createConnection(ProposedFeatures.all)` communicating over `process.stdin` / `process.stdout` (stdio).

### Lifecycle Handlers
- `connection.onInitialize`: Returns server capabilities (document sync, custom command registration).
- `connection.onInitialized`: Confirms handshake and logs connection readiness.
- `connection.onShutdown` and `connection.onExit`: Handles graceful clean-up.

### Custom Protocol Registration
- Method: `skillforge/suggest`
- Schema: Handled via `connection.onRequest(SkillSuggestRequestType, async (params) => { ... })`

## 3. VS Code Client Architecture (`packages/vscode-client`)

### Libraries
- `vscode-languageclient/node`: `^9.0.1`
- `vscode`: `@types/vscode: ^1.85.0`

### Client Configuration
- `ServerOptions`:
  - Run: `{ module: serverModule, transport: TransportKind.stdio }`
  - Debug: `{ module: serverModule, transport: TransportKind.stdio, options: { execArgv: ['--nolazy', '--inspect=6009'] } }`
- `LanguageClientOptions`:
  - Document selectors (or global selector for custom requests)
  - Synchronize settings and configuration section `skillforge`

## 4. Test Strategy

- **Vitest**: Fast ESM/TypeScript test runner.
- Unit tests in `packages/shared` for protocol schemas and types.
- Integration tests in `packages/server` spinning up the server process over stdio/IPC and executing the initialization handshake and custom request.

## 5. Potential Pitfalls & Mitigations

1. **Stdio logging collisions**: Never write raw `console.log` inside the LSP server process, as `stdout` is reserved for JSON-RPC messages. Use `connection.console.log` or `connection.tracer.log`.
2. **Path resolution in VS Code Extension Host**: Ensure the client resolves the server entry file via `context.asAbsolutePath(...)` so it works in both development and bundled VSIX environments.
3. **Workspace symlinking**: Use `workspace:*` dependencies in package manifests to guarantee local linking during development.
