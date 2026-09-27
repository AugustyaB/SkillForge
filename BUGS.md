# 🐛 SkillForge Bug Registry & Action Item Tracker

> **Document Type**: Defect & Technical Debt Register  
> **Target Audience**: Development Pair, Next Chat/Agent, QA Review  
> **Last Updated**: 2026-09-27  
> **Audit Status**: Complete — 10 confirmed bugs identified, reproduced, and documented with remediation plans.

---

## 📋 Quick Action Checklist

- [x] **BUG-01** (Critical): Fix RegExp injection crash in `SkillsRepository.search` & `IntentParser`
- [x] **BUG-02** (High): Fix Skill ID vs Package Name mismatch in compatibility boost & conflict detection
- [x] **BUG-03** (High): Fix ambient workspace ecosystem overriding explicit user query intent
- [ ] **BUG-04** (High): Fix incomplete cache key generation in `QueryCache`
- [ ] **BUG-05** (Medium): Fix `GroundTruthAnchor.buildUnanchored()` invalid `officialUrl` contract violation
- [ ] **BUG-06** (Medium): Fix broken stale cache test in `health-verifier.test.ts`
- [ ] **BUG-07** (Medium): Add null/undefined guard for `params` in LSP suggest handler
- [ ] **BUG-08** (Medium): Fix inline comment stripping in `parseRequirementsTxt`
- [ ] **BUG-09** (Low): Fix fire-and-forget `weeklyDownloads` race condition in `HealthVerifier`
- [ ] **BUG-10** (Low): Fix npm publish date detection using `latest` release over `modified`

---

## 🔴 Critical Severity

### BUG-01: RegExp Injection Crash in `SkillsRepository` and `IntentParser`

- **Severity**: Critical (Causes unhandled exception / process failure)
- **Files Affected**:
  - [`packages/server/src/data/skills-repository.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/data/skills-repository.ts#L238) (Line 238)
  - [`packages/server/src/engine/intent-parser.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/intent-parser.ts#L181) (Line 181)
- **Reproduction**:
  ```bash
  node -e "const { SuggestionEngine } = require('./packages/server/dist/engine/suggestion-engine.js'); new SuggestionEngine().suggest({ intent: 'build a c++ backend' });"
  ```
  **Output**:
  ```
  SyntaxError: Invalid regular expression: /\bc++\b/i: Nothing to repeat
      at new RegExp (<anonymous>)
      at SkillsRepository.search
  ```
- **Root Cause**:
  Raw query tokens (e.g. `c++`, `c#`, `[tool]`, `(foo)?`, `*`) are interpolated directly into `new RegExp(\`\\b${token}\\b\`, 'i')` without escaping regex special characters.
  Furthermore, optional quantifiers like `(react)?` cause the regex to match word boundaries against the empty string, falsely scoring *every single skill* in the database as matching.
- **Remediation**:
  1. Add a regex escaping helper:
     ```ts
     function escapeRegExp(str: string): string {
       return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     }
     ```
  2. In `skills-repository.ts`:
     ```ts
     const escaped = escapeRegExp(token);
     // Only perform regex whole-word test if token contains valid word characters
     if (/^\w+$/.test(token)) {
       if (new RegExp(`\\b${escaped}\\b`, 'i').test(lowerName)) { ... }
     } else if (lowerName.includes(token)) {
       score += 40;
       matchReasons.push(`Name contains "${token}"`);
     }
     ```

---

## 🟠 High Severity

### BUG-02: Skill ID vs Package Name Mismatch in Compatibility Boost & Conflict Detection

- **Severity**: High (Silent logic failure — features do not trigger)
- **Files Affected**:
  - [`packages/server/src/engine/suggestion-engine.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/suggestion-engine.ts#L126-L132) (Lines 126–132)
  - [`packages/server/src/reliability/conflict-detector.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/conflict-detector.ts#L44-L52) (Lines 44–52)
- **Root Cause**:
  - `alreadyInstalled` / `installedSet` contains raw package names from manifests (e.g. `next`, `tailwindcss`, `@angular/core`, `solid-js`, `@remix-run/react`).
  - `skill.worksWellWith` and `skill.alternatives` contain **SkillForge Skill IDs** (e.g. `nextjs`, `tailwind-css`, `angular`, `solidjs`, `remix`).
  - The code checks:
    ```ts
    const compatibleTools = skill.worksWellWith.filter((compat) =>
      alreadyInstalled.has(compat.toLowerCase())
    );
    ```
    This checks `alreadyInstalled.has("tailwind-css")` instead of checking the package `tailwindcss`, which fails.
- **Impact**:
  - React's `worksWellWith: ["nextjs", "tailwind-css"]` NEVER gets a compatibility boost in Next.js or Tailwind projects.
  - Conflict detection completely fails to detect installed conflicts for Angular (`@angular/core`), Solid (`solid-js`), Remix (`@remix-run/react`), etc.
- **Remediation**:
  Build a bidirectional mapping between package names/stack indicators and skill IDs in `SkillsRepository`. When checking compatibility or conflicts, map installed package names to their canonical Skill IDs first:
  ```ts
  // Convert installed package names to canonical skill IDs using stack indicators
  const installedSkillIds = new Set<string>();
  for (const pkg of alreadyInstalled) {
    const matchedSkill = repository.getSkillByIndicator(pkg);
    if (matchedSkill) installedSkillIds.add(matchedSkill.id);
    installedSkillIds.add(pkg); // fallback for direct match
  }
  ```

---

### BUG-03: Ambient Workspace Ecosystem Overrides Explicit Query Intent

- **Severity**: High (Incorrect search results)
- **File Affected**: [`packages/server/src/engine/suggestion-engine.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/suggestion-engine.ts#L91-L94) (Lines 91–94)
- **Code**:
  ```ts
  const targetEcosystem =
    context?.ecosystem && context.ecosystem !== 'multi'
      ? context.ecosystem
      : parsedIntent.explicitEcosystem;
  ```
- **Root Cause**:
  If a developer opens a Python project (`context.ecosystem === 'python'`) and enters:
  `"suggest a rust backend framework"` or `"javascript charting library"`, the suggestion engine forces `targetEcosystem = 'python'`.
  `SkillsRepository.search` then filters out all Rust/JS skills, returning 0 results and triggering an unwanted fallback.
- **Remediation**:
  Explicit query ecosystem must take precedence over ambient workspace context:
  ```ts
  const targetEcosystem =
    parsedIntent.explicitEcosystem ??
    (context?.ecosystem && context.ecosystem !== 'multi' ? context.ecosystem : undefined);
  ```

---

### BUG-04: Incomplete Cache Key Generation in `QueryCache`

- **Severity**: High (Cache poisoning & incorrect cached responses)
- **Files Affected**:
  - [`packages/server/src/engine/suggestion-engine.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/suggestion-engine.ts#L69-L74)
  - [`packages/server/src/engine/query-cache.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/query-cache.ts#L22-L32)
- **Root Cause**:
  `generateKey()` only takes `(intent, scopePaths, installed, difficulty)`.
  It completely omits:
  1. `options.maxResults` (Querying 3 results then 10 results returns cached 3)
  2. `options.minTrustTier` (Querying `verified` then `suggested` returns verified-only cached list)
  3. `context.ecosystem`
  4. `context.activeFileSignals` (Changing active editor tab language returns cached score boost from previous tab)
- **Remediation**:
  Update `generateKey` to hash the complete normalized options and context:
  ```ts
  public generateKey(params: SkillSuggestionParams): string {
    const payload = JSON.stringify({
      intent: params.intent.trim().toLowerCase(),
      scope: params.context?.scope?.paths?.slice().sort() ?? [],
      installed: params.context?.alreadyInstalled?.slice().sort() ?? [],
      ecosystem: params.context?.ecosystem ?? '',
      activeSignals: params.context?.activeFileSignals?.map(s => s.language).sort() ?? [],
      difficulty: params.options?.difficulty ?? 'all',
      maxResults: params.options?.maxResults ?? 5,
      minTrustTier: params.options?.minTrustTier ?? '',
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
  ```

---

## 🟡 Medium Severity

### BUG-05: `GroundTruthAnchor.buildUnanchored()` Contract Violation on `officialUrl`

- **Severity**: Medium (Data schema violation)
- **File Affected**: [`packages/server/src/reliability/ground-truth-anchor.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/ground-truth-anchor.ts#L118) (Line 118)
- **Code**:
  ```ts
  officialUrl: raw.officialUrl || '',
  ```
- **Root Cause**:
  `SuggestedSkill` extends `Skill`. `SkillSchema` mandates `officialUrl: z.string().url('Must be a valid URL')`.
  If an external suggestion omits `officialUrl`, `buildUnanchored()` assigns `''`.
  Calling `validateSkill()` or parsing with `SkillSchema` on this suggestion throws `ZodError: Must be a valid URL`.
- **Remediation**:
  Provide a valid placeholder URL or make `officialUrl` optional on `SuggestedSkill` / use a fallback search URL:
  ```ts
  officialUrl: raw.officialUrl || `https://www.google.com/search?q=${encodeURIComponent(raw.name)}`,
  ```

---

### BUG-06: Broken Stale Cache Test in `health-verifier.test.ts`

- **Severity**: Medium (False test verification)
- **File Affected**: [`packages/server/src/__tests__/health-verifier.test.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/__tests__/health-verifier.test.ts#L148-L181)
- **Root Cause**:
  The test constructs `verifier` and calls `checkPackage('stale-lib')`, then instantiates a completely separate `verifier2` with a separate empty cache to test offline behavior.
  The cache of `verifier` is never accessed by `verifier2`. The test verifies offline fallback on a cold cache, NOT stale cache recovery.
- **Remediation**:
  Use a single `HealthVerifier` instance and dynamically swap the `fetchFn` or simulate network failure on the same instance after TTL expiration.

---

### BUG-07: Missing Null/Undefined Guards on Incoming LSP Requests

- **Severity**: Medium (Process stability)
- **Files Affected**:
  - [`packages/server/src/server.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/server.ts#L78-L84)
  - [`packages/server/src/engine/suggestion-engine.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/suggestion-engine.ts#L51)
- **Root Cause**:
  `params.intent` is accessed directly. If an LSP client sends an empty notification or malformed JSON-RPC request without parameters, `params` is `null` or `undefined`, throwing `TypeError: Cannot read properties of undefined (reading 'intent')`.
- **Remediation**:
  ```ts
  const intent = typeof params?.intent === 'string' ? params.intent.trim() : '';
  ```

---

### BUG-08: Inline Comments in `requirements.txt` Silently Drop Python Packages

- **Severity**: Medium (Context loss)
- **File Affected**: [`packages/server/src/context/workspace-scanner.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/context/workspace-scanner.ts#L40-L50)
- **Root Cause**:
  `requirements.txt` parser splits on version characters (`=><~;!`), but does not strip inline `#` comments before testing `/^[a-zA-Z0-9_\-.]+$/`.
  A line like:
  ```text
  fastapi # High-performance web framework
  ```
  yields `name = "fastapi # high-performance web framework"`, which fails regex validation and is dropped.
- **Remediation**:
  Strip comments first before extracting package name:
  ```ts
  const noComment = rawLine.split('#')[0]?.trim();
  if (!noComment || noComment.startsWith('-')) continue;
  const beforeVersion = noComment.split(/[=><~;!]/)[0]?.trim();
  const name = beforeVersion?.split('[')[0]?.trim();
  ```

---

## 🔵 Low Severity

### BUG-09: `HealthVerifier.checkPackage` Returns Unpopulated `weeklyDownloads` on First Call

- **Severity**: Low (Performance optimization trade-off)
- **File Affected**: [`packages/server/src/reliability/health-verifier.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/health-verifier.ts#L83-L87)
- **Root Cause**:
  `this.fetchDownloads(normalizedName, health).catch(...)` is called fire-and-forget without `await`.
  The first call to `checkPackage` immediately returns before downloads are fetched. Downloads are only available on subsequent cache hits.
- **Remediation**:
  Either use `Promise.all` with a short timeout, or document that download metrics are asynchronously populated into the cache.

---

### BUG-10: `HealthVerifier` Uses `modified` Date Over `latest` Release Publish Date

- **Severity**: Low (Data accuracy)
- **File Affected**: [`packages/server/src/reliability/health-verifier.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/health-verifier.ts#L119-L130)
- **Root Cause**:
  In the npm registry, `data.time.modified` is updated whenever package metadata, tags, or maintainers change, even for abandoned packages published years ago.
  The latest version publish date (`data.time[data['dist-tags']?.latest]`) represents actual code release age and should be checked first.
- **Remediation**:
  Check `data['dist-tags']?.latest` first, and fall back to `modified`:
  ```ts
  const latestVersion = data['dist-tags']?.latest;
  const latestPublishTime = latestVersion && data.time ? data.time[latestVersion] : undefined;
  const publishTime = latestPublishTime || data.time?.modified;
  ```

---

## 🛠️ Instructions for Next Chat / Developer

When picking up these bug fixes:
1. Follow the **Mandatory Gating Protocol** in [`PROJECT_RULES.md`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/PROJECT_RULES.md):
   - Propose an implementation plan for the fixes.
   - Halt for user approval (Gate 1).
   - Implement the fixes.
   - Run `pnpm typecheck` and `pnpm test` for empirical verification (Gate 2).
   - Sync `CHANGELOG.md` and check off items in this document (Gate 3).
2. Start with **BUG-01** (Critical crash bug) and **BUG-02 / BUG-03** (Matching engine accuracy).
