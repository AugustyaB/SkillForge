---
phase: 1
plan: 2
wave: 2
---

# Plan 1.2: Headless LSP Server & VS Code Client Integration

## Objective
Implement the headless Language Server Protocol (LSP) server in `packages/server` that handles JSON-RPC lifecycle events over stdio, implement the `packages/vscode-client` extension connecting to the server, and verify end-to-end communication via an automated integration test.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/1/RESEARCH.md
- packages/shared/src/index.ts

## Tasks

<task type="auto" effort="medium">
  <name>Implement headless LSP server in packages/server</name>
  <files>
    packages/server/package.json,
    packages/server/tsconfig.json,
    packages/server/src/server.ts,
    packages/server/src/index.ts
  </files>
  <action>
    Create `@skillforge/server`:
    1. `package.json` with dependencies on `vscode-languageserver: ^9.0.1` and `@skillforge/shared: workspace:*`. Build script running `tsc -b`.
    2. `tsconfig.json` extending `../../tsconfig.base.json` referencing `../shared`.
    3. `src/server.ts`:
       - Create connection via `createConnection(ProposedFeatures.all)`.
       - Implement `onInitialize` returning ServerCapabilities (TextDocumentSyncKind.Incremental).
       - Implement `onInitialized` logging readiness via `connection.console.log`.
       - Implement `onRequest(SKILLFORGE_SUGGEST_METHOD)` handler that receives `SkillSuggestionParams`, validates input, and returns a valid `SkillSuggestionResult` structure with baseline response data and execution timings.
       - Implement error handling so uncaught errors do not crash the connection.
    4. `src/index.ts` starting the connection listening on `process.stdin` / `process.stdout`.
    AVOID: Using `console.log` directly in the server process; only use `connection.console.log` to avoid corrupting stdio JSON-RPC messages.
  </action>
  <verify>pnpm --filter @skillforge/server build</verify>
  <done>packages/server compiles with zero TypeScript errors and produces dist/index.js.</done>
</task>

<task type="auto" effort="medium">
  <name>Implement VS Code client extension in packages/vscode-client</name>
  <files>
    packages/vscode-client/package.json,
    packages/vscode-client/tsconfig.json,
    packages/vscode-client/src/extension.ts
  </files>
  <action>
    Create `@skillforge/vscode-client`:
    1. `package.json` with VS Code extension manifest:
       - `name`: "skillforge"
       - `displayName`: "SkillForge"
       - `publisher`: "skillforge"
       - `version`: "0.1.0"
       - `engines.vscode`: "^1.85.0"
       - `activationEvents`: ["onCommand:skillforge.testConnection", "onCommand:skillforge.suggest"]
       - `contributes.commands`:
         - `command`: "skillforge.testConnection", `title`: "SkillForge: Test Server Connection"
         - `command`: "skillforge.suggest", `title`: "SkillForge: Suggest Skills for My Idea"
       - Dependencies: `vscode-languageclient: ^9.0.1`, `@skillforge/shared: workspace:*`
       - DevDependencies: `@types/vscode: ^1.85.0`
    2. `tsconfig.json` extending `../../tsconfig.base.json` with references to `../shared`.
    3. `src/extension.ts`:
       - `activate(context: vscode.ExtensionContext)` function.
       - Resolve server module path via `context.asAbsolutePath(...)` pointing to `@skillforge/server/dist/index.js`.
       - Configure `ServerOptions` with stdio transport.
       - Configure `LanguageClientOptions` with documentSelector and outputChannelName "SkillForge Language Server".
       - Start client and register disposables into `context.subscriptions`.
       - Register command `skillforge.testConnection` that sends a `SKILLFORGE_SUGGEST_METHOD` request to the server and reports response status via `vscode.window.showInformationMessage`.
       - `deactivate()` function stopping the client cleanly.
  </action>
  <verify>pnpm --filter @skillforge/vscode-client build</verify>
  <done>packages/vscode-client builds cleanly and compiles extension.ts to dist/extension.js.</done>
</task>

<task type="auto" effort="small">
  <name>Add end-to-end LSP communication integration test</name>
  <files>
    packages/server/src/__tests__/server-integration.test.ts
  </files>
  <action>
    Write an integration test in `packages/server/src/__tests__/server-integration.test.ts`:
    1. Spawn the compiled server process (or instantiate connection using in-memory / duplex streams).
    2. Send an `initialize` JSON-RPC request and verify successful response with server capabilities.
    3. Send a `skillforge/suggest` request with sample intent ("build a chat app").
    4. Assert that the server returns a valid `SkillSuggestionResult` with skills array and execution timings.
    5. Cleanly send `shutdown` and `exit` requests.
  </action>
  <verify>pnpm --filter @skillforge/server test</verify>
  <done>Integration test executes and confirms round-trip LSP request/response communication over JSON-RPC.</done>
</task>

## Success Criteria
- [ ] `@skillforge/server` handles LSP lifecycle events and answers `skillforge/suggest`.
- [ ] `@skillforge/vscode-client` compiles without errors and includes connection commands.
- [ ] Integration test passes with 100% success asserting client-server request roundtrips.
