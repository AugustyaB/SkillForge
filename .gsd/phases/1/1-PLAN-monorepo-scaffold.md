---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Monorepo Scaffolding & Shared Protocol Types

## Objective
Establish the pnpm monorepo workspace foundation with shared TypeScript project references, Vitest test configuration, and the `packages/shared` package defining the core LSP protocol contracts and data models.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/1/RESEARCH.md

## Tasks

<task type="auto" effort="medium">
  <name>Initialize pnpm workspace root configuration</name>
  <files>
    package.json,
    pnpm-workspace.yaml,
    tsconfig.base.json,
    .gitignore,
    .editorconfig
  </files>
  <action>
    Create the monorepo root files:
    1. `pnpm-workspace.yaml` defining `packages/*`.
    2. Root `package.json` with private: true, scripts for build, test, and typecheck across all workspaces using pnpm `--filter`. Include devDependencies for typescript, vitest, and rimraf.
    3. `tsconfig.base.json` with strict TypeScript configuration (ES2022, Node16 module/resolution, declaration: true, composite: true, sourceMap: true).
    4. `.gitignore` ignoring node_modules, dist, *.vsix, .turbo, .DS_Store, and test coverage output.
    5. `.editorconfig` setting utf-8, indent_size = 2, indent_style = space, insert_final_newline = true.
    AVOID: Wildcard or circular workspace dependencies.
  </action>
  <verify>pnpm install --no-frozen-lockfile</verify>
  <done>Root workspace config is valid and pnpm installs dependencies without error.</done>
</task>

<task type="auto" effort="medium">
  <name>Scaffold packages/shared with protocol contracts and types</name>
  <files>
    packages/shared/package.json,
    packages/shared/tsconfig.json,
    packages/shared/src/index.ts,
    packages/shared/src/protocol.ts,
    packages/shared/src/types.ts
  </files>
  <action>
    Create the `@skillforge/shared` package:
    1. `package.json` with name `@skillforge/shared`, version `0.1.0`, main and types pointing to `dist/index.js` and `dist/index.d.ts`. Add build script `tsc -b`.
    2. `tsconfig.json` extending `../../tsconfig.base.json` with rootDir `src` and outDir `dist`.
    3. `src/types.ts` defining:
       - `Skill`: id, name, category, difficulty ('beginner' | 'intermediate' | 'advanced'), description, whyUseIt, tags, ecosystem, officialUrl, learnResources, alternatives, worksWellWith, prerequisites, stackIndicators.
       - `TrustTier`: 'verified' | 'validated' | 'suggested' | 'deprecated'.
       - `WorkspaceContext`: scope ({ mode, paths, label }), detectedStack, activeFileSignals, ecosystem, alreadyInstalled.
    4. `src/protocol.ts` defining:
       - Custom LSP method constant: `SKILLFORGE_SUGGEST_METHOD = 'skillforge/suggest'`
       - `SkillSuggestionParams`: intent, context?, options?
       - `SkillSuggestionResult`: skills: Array<Skill & { trustTier: TrustTier; confidence: number; reasoning: string }>, timings: { localMs: number; totalMs: number }, fallbackUsed?: boolean
    5. `src/index.ts` re-exporting all types and protocol constants.
    AVOID: Importing editor-specific (vscode) APIs in packages/shared to ensure it remains environment-agnostic.
  </action>
  <verify>pnpm --filter @skillforge/shared build</verify>
  <done>packages/shared compiles cleanly to dist/ with TypeScript declaration files.</done>
</task>

<task type="auto" effort="small">
  <name>Configure Vitest test runner and write unit tests for shared protocol</name>
  <files>
    vitest.config.ts,
    packages/shared/src/__tests__/protocol.test.ts
  </files>
  <action>
    1. Create root `vitest.config.ts` configured for TypeScript monorepo testing.
    2. Write unit tests in `packages/shared/src/__tests__/protocol.test.ts` to assert that protocol method names, parameter structures, and types meet schema expectations.
    3. Ensure `pnpm test` runs vitest across the workspace.
  </action>
  <verify>pnpm test</verify>
  <done>Vitest executes and all shared protocol tests pass with 0 errors.</done>
</task>

## Success Criteria
- [ ] Root pnpm workspace configuration parses and installs dependencies cleanly.
- [ ] `@skillforge/shared` compiles with zero errors and generates typed definitions.
- [ ] Unit tests pass validating the LSP protocol constants and schema interfaces.
