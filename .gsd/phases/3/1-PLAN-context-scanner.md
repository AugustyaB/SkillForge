---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Scoped Workspace Dependency Scanner & Context Extractor

## Objective
Build a fast, scoped workspace scanner in `@skillforge/server` that parses project dependency manifests across multiple programming ecosystems (JavaScript/TypeScript, Python, Rust, Go, Java) within a user-defined folder scope, extracting installed packages and active file signals without blocking the event loop.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- PROJECT_RULES.md
- .gsd/phases/3/RESEARCH.md
- packages/shared/src/types.ts

## Tasks

<task type="auto" effort="medium">
  <name>Implement WorkspaceScanner with multi-language manifest parsing</name>
  <files>
    packages/server/src/context/workspace-scanner.ts,
    packages/server/src/context/types.ts
  </files>
  <action>
    Create `packages/server/src/context/workspace-scanner.ts`:
    1. Define manifest parsers:
       - `parsePackageJson(content)`: extracts dependencies and devDependencies from package.json.
       - `parseRequirementsTxt(content)`: extracts python package names ignoring version specifiers (==, >=, <=) and comments.
       - `parseCargoToml(content)`: extracts crates under [dependencies] section.
       - `parseGoMod(content)`: extracts module requirements.
       - `parsePomXml(content)`: extracts artifactId dependencies.
    2. Class `WorkspaceScanner`:
       - `scanScope(scopePath: string): Promise<WorkspaceContext>`:
         - Inspects the scoped folder path (or multiple paths).
         - Checks for existence of manifest files in the directory root.
         - Aggregates detected packages into `DetectedPackage[]` with name, ecosystem, and sourceFile.
         - Identifies primary ecosystem ('javascript', 'python', 'rust', 'go', 'java', 'multi').
         - Returns clean `WorkspaceContext` adhering to `@skillforge/shared`.
    AVOID: Recursive directory walks into node_modules, .git, dist, target, vendor, or .venv.
  </action>
  <verify>pnpm --filter @skillforge/server build</verify>
  <done>packages/server compiles with WorkspaceScanner producing clean types.</done>
</task>

<task type="auto" effort="small">
  <name>Add unit tests for WorkspaceScanner across all manifest formats</name>
  <files>
    packages/server/src/__tests__/workspace-scanner.test.ts
  </files>
  <action>
    Create `packages/server/src/__tests__/workspace-scanner.test.ts`:
    1. Test `package.json` parsing: verify extraction of packages like express, react, tailwindcss.
    2. Test `requirements.txt` parsing: verify extraction of fastapi, sqlalchemy, pytest with version specifiers stripped.
    3. Test `Cargo.toml` parsing: verify extraction of tokio, axum, serde.
    4. Test `go.mod` parsing: verify extraction of gin, gorm.
    5. Test scoped scanning of mock project directories and assert detected ecosystem and alreadyInstalled list.
  </action>
  <verify>pnpm test</verify>
  <done>All WorkspaceScanner tests pass with 100% success.</done>
</task>

## Success Criteria
- [ ] `WorkspaceScanner` reliably extracts dependencies from 5 common ecosystems.
- [ ] Scoped folder scanning functions without traversing ignored deep directories.
- [ ] Unit tests validate manifest parsing and ecosystem identification.
