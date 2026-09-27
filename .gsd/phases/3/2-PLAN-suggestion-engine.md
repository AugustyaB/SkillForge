---
phase: 3
plan: 2
wave: 2
---

# Plan 3.2: Suggestion Engine, Context-Aware Ranking & Query Cache

## Objective
Implement an intelligent `SuggestionEngine` that combines natural language intent parsing with scoped workspace context, boosting complementary technologies, detecting already-installed packages, and caching queries for sub-millisecond repeat execution.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- PROJECT_RULES.md
- .gsd/phases/3/RESEARCH.md
- packages/server/src/data/skills-repository.ts
- packages/server/src/context/workspace-scanner.ts
- packages/server/src/server.ts

## Tasks

<task type="auto" effort="medium">
  <name>Implement IntentParser and in-memory QueryCache</name>
  <files>
    packages/server/src/engine/intent-parser.ts,
    packages/server/src/engine/query-cache.ts
  </files>
  <action>
    1. Create `packages/server/src/engine/intent-parser.ts`:
       - `ParsedIntent`: rawQuery, normalizedTokens, actionVerb, detectedCategories: SkillCategory[], explicitEcosystem?: string, constraints: string[].
       - Action detection: "build", "create", "add", "integrate", "migrate", "test", "secure", "deploy".
       - Category detection: maps synonyms (e.g. "ui" -> `ui-library`, "auth" / "login" -> `authentication`, "db" / "store" -> `database`, "websocket" / "realtime" -> `api-protocol`, "server" -> `backend-framework`).
    2. Create `packages/server/src/engine/query-cache.ts`:
       - In-memory cache with TTL (default 10 minutes) and max entries (500).
       - Key generation: SHA-256 of `(intent.trim() + ':' + scope.paths.join(',') + ':' + alreadyInstalled.sort().join(','))`.
       - Methods: `get(key): SkillSuggestionResult | undefined`, `set(key, result): void`, `clear(): void`, `get size(): number`.
  </action>
  <verify>pnpm --filter @skillforge/server build</verify>
  <done>packages/server compiles with IntentParser and QueryCache.</done>
</task>

<task type="auto" effort="medium">
  <name>Implement SuggestionEngine and wire into SkillForgeServer</name>
  <files>
    packages/server/src/engine/suggestion-engine.ts,
    packages/server/src/server.ts
  </files>
  <action>
    1. Create `packages/server/src/engine/suggestion-engine.ts`:
       - Class `SuggestionEngine`: accepts `SkillsRepository`, `IntentParser`, `QueryCache`.
       - Method `suggest(params: SkillSuggestionParams): Promise<SkillSuggestionResult>`:
         - Check `QueryCache` first: if hit, return immediately with `timings.localMs < 1`.
         - Parse intent via `IntentParser`.
         - Retrieve candidate matches from `SkillsRepository`.
         - Apply Context-Aware Relevance Adjustments:
           - **Compatibility Boost (+30 pts)**: If a skill's `worksWellWith` list contains any package present in `context.alreadyInstalled`, boost score and add reasoning: `"Works well with already installed [package]"`.
           - **Active File Signal Boost (+20 pts)**: If active file language or imports match the skill.
           - **Already-Installed Detection**: If skill's `stackIndicators` intersect with `context.alreadyInstalled`, flag `isInstalledInWorkspace: true` and note `"Already installed in your project"`.
         - Assign `trustTier: 'verified'`, calculate confidence, and format `SuggestedSkill[]`.
         - Store in `QueryCache`.
    2. Update `packages/server/src/server.ts`:
       - Delegate `skillforge/suggest` requests to `SuggestionEngine`.
  </action>
  <verify>pnpm --filter @skillforge/server build</verify>
  <done>SuggestionEngine compiles and is wired to SkillForgeServer.</done>
</task>

<task type="auto" effort="small">
  <name>Add unit and integration tests for context-aware suggestions and caching</name>
  <files>
    packages/server/src/__tests__/suggestion-engine.test.ts,
    packages/server/src/__tests__/server-integration.test.ts
  </files>
  <action>
    1. Create `packages/server/src/__tests__/suggestion-engine.test.ts`:
       - Test intent parsing: action verbs, synonyms, category mapping.
       - Test compatibility boost: Express in workspace -> Socket.io / Prisma score boost.
       - Test already-installed detection: React in workspace -> marked `isInstalledInWorkspace: true`.
       - Test QueryCache: repeat queries return identical cached results in <1ms.
    2. Update `packages/server/src/__tests__/server-integration.test.ts`:
       - Verify end-to-end `skillforge/suggest` with workspace context over JSON-RPC.
  </action>
  <verify>pnpm test</verify>
  <done>All tests in packages/shared and packages/server pass with 100% success.</done>
</task>

## Success Criteria
- [ ] `SuggestionEngine` accurately parses natural language intents.
- [ ] Workspace dependencies influence suggestions (compatibility boosts & already-installed flags).
- [ ] Query caching provides sub-millisecond responses for repeat queries.
- [ ] 100% of unit and integration tests pass.
