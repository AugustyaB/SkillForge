# Phase 3: Research — Suggestion Engine & Context Scoping

> **Phase**: 3 — Suggestion Engine & Context Scoping
> **Date**: 2026-09-27
> **Standards Alignment**: Follows [`PROJECT_RULES.md`](../../PROJECT_RULES.md) (Gating Protocol & Monorepo Boundaries)

---

## 1. Scoped Workspace Dependency Scanner

### Requirement
Per `PROJECT_RULES.md` and `context-selection.md`:
- Scans user-scoped paths (root workspace or specific subfolders in monorepos).
- High performance: Never traverse deep file trees; only inspect root manifest files within the scoped folder.
- Respects ignore lists (`node_modules`, `.git`, `dist`, `build`, `target`, `vendor`, `.venv`).

### Manifests Supported:
| Manifest | Ecosystem | Extracted Information |
|---|---|---|
| `package.json` | JavaScript / TypeScript | `dependencies`, `devDependencies` |
| `requirements.txt` / `Pipfile` / `pyproject.toml` | Python | Package names |
| `Cargo.toml` | Rust | `[dependencies]` crates |
| `go.mod` | Go | `require` modules |
| `pom.xml` / `build.gradle` | Java / Kotlin | `artifactId` / implementation dependencies |

---

## 2. Natural Language Intent Parser & Keyword Extractor

### Design
Input query string (e.g., *"I need to add real-time messaging to my Express backend"*):
1. **Normalization**: lowercasing, punctuation stripping, stop-word elimination.
2. **Action / Goal Detection**: "add", "build", "integrate", "migrate", "optimize", "test", "secure".
3. **Category Affinity**: Maps intent phrases to canonical `SkillCategory` (e.g., "real-time" -> `api-protocol`, "auth" -> `authentication`, "db" -> `database`, "style" -> `ui-library`).
4. **Constraint Extraction**: "lightweight", "fast", "simple", "enterprise", "beginner".

---

## 3. Context-Aware Multi-Factor Relevance Scorer

The scoring equation:
$$\text{Score} = S_{\text{intent}} + S_{\text{compatibility}} + S_{\text{activeFile}} - S_{\text{conflict}}$$

Where:
- $S_{\text{intent}}$: Base keyword, name, and tag matches from Phase 2.
- $S_{\text{compatibility}}$ (+30 pts): Skill's `worksWellWith` matches packages detected in the workspace (e.g., user has `express`, skill is `socket-io` or `prisma`).
- $S_{\text{activeFile}}$ (+20 pts): Active editor file language matches skill ecosystem, or open file imports related packages.
- $S_{\text{installed}}$: If `stackIndicators` intersect with `alreadyInstalled`, mark `isInstalledInWorkspace: true` with a clear notice: *"Already installed in your project"*.

---

## 4. Query Caching & Repeat Query Handling

### Cache Design
- Class `QueryCache` in `@skillforge/server/src/engine/query-cache.ts`.
- Cache key: `SHA256(intent + scope.paths.join(',') + installed.sort().join(','))`.
- TTL: 10 minutes (in-memory).
- Invalidation: Cache invalidates when workspace files change or user clears cache.
- Benefits: Instantaneous (<1ms) response for duplicate queries, preventing repeated computation or unnecessary future LLM calls.
