# 🐛 SkillForge Bug Registry & Action Item Tracker

> **Document Type**: Defect & Technical Debt Register  
> **Target Audience**: Development Pair, Next Chat/Agent, QA Review  
> **Last Updated**: 2026-10-14  
> **Audit Status**: Complete — All 29 tracked bugs (BUG-01..BUG-29) identified, reproduced, documented, and 100% resolved. Marketplace, MCP & Resilience Audits verified with 375/375 tests passing across 31 suites.

---

## 📋 Quick Action Checklist

### 📌 Pre-Publish Checklist for Next Release (v0.1.2)
- [x] **PRE-01**: Mirror `resources/screenshots/` to repo root & set `--baseImagesUrl` in `package` script (fixes Open VSX relative image 404).
- [x] **PRE-02**: Remove raw LaTeX math syntax (`$<2\text{ms}$` -> `< 2ms`, `$\to$` -> `→`) in `packages/vscode-client/README.md`.

### Phase 1–5.1 Audit (Resolved)
- [x] **BUG-01** (Critical): Fix RegExp injection crash in `SkillsRepository.search` & `IntentParser`
- [x] **BUG-02** (High): Fix Skill ID vs Package Name mismatch in compatibility boost & conflict detection
- [x] **BUG-03** (High): Fix ambient workspace ecosystem overriding explicit user query intent
- [x] **BUG-04** (High): Fix incomplete cache key generation in `QueryCache`
- [x] **BUG-05** (Medium): Fix `GroundTruthAnchor.buildUnanchored()` invalid `officialUrl` contract violation
- [x] **BUG-06** (Medium): Fix broken stale cache test in `health-verifier.test.ts`
- [x] **BUG-07** (Medium): Add null/undefined guard for `params` in LSP suggest handler
- [x] **BUG-08** (Medium): Fix inline comment stripping in `parseRequirementsTxt`
- [x] **BUG-09** (Low): Fix fire-and-forget `weeklyDownloads` race condition in `HealthVerifier`
- [x] **BUG-10** (Low): Fix npm publish date detection using `latest` release over `modified`
- [x] **BUG-11** (Critical): Terminal install command passes human display name instead of package identifier
- [x] **BUG-12** (Critical): CodeLens triggers dormant on startup due to missing language activation events
- [x] **BUG-13** (High): `TerminalRunner` reuses stale working directory across context scope switches

### Phase 5.2, 6 & 7 Audit (Resolved)
- [x] **BUG-14** (Critical): AI-suggested skills silently fail to bookmark due to `SKILLFORGE_SYSTEM_PROMPT` category shorthand mismatch with `SkillCategorySchema`
- [x] **BUG-15** (High): Hybrid/BYOK pipeline bypasses `ConflictDetector`, `isInstalledInWorkspace`, and `minTrustTier` filtering
- [x] **BUG-16** (High): Live LSP `skillforge/compare` drops workspace `alreadyInstalled` packages (`isInstalledInWorkspace` always `false` in Comparison Matrix)
- [x] **BUG-17** (High): `HybridMerger.merge()` drops `categoryRecommendations` when falling back with an active BYOK provider
- [x] **BUG-18** (Medium): `OpenAIProvider` and `GeminiProvider` ignore dynamic per-request `config.timeoutMs` setting
- [x] **BUG-19** (Medium): `parseRawSuggestions()` crashes with `SyntaxError` when LLM wraps markdown JSON fences in conversational prose
- [x] **BUG-20** (Medium): `GroundTruthAnchor.anchor()` misses `getSkillByIndicator()` lookup, demoting verified skills like `next` or `next-auth` to unanchored `suggested`
- [x] **BUG-21** (Medium): Toggling a bookmark in `SuggestionPanel` re-renders Webview with `showFeedbackPrompt: true`, resurrecting a submitted feedback bar
- [x] **BUG-22** (Low): Comparison Matrix displays `npm install` instead of `pnpm add`, retains stale tab title on reuse, and uses `unsafe-inline` style CSP
- [x] **BUG-23** (High): `SkillsRepository.search()` substring check `trimmed.includes(lowerName)` false-positives short skill names (`"Ent"`, `"Gin"`) inside unrelated words (`"authentication"`, `"nonexistent"`, `"login"`)

### Antigravity IDE QA & UX Polish Audit (Resolved)
- [x] **BUG-24** (High): `workbench.action.openWalkthrough` parameter omitted extension name segment (`skillforge#skillforge.walkthrough`), causing IDE fallback to generic welcome tab
- [x] **BUG-25** (Medium): Suggestion Canvas rendered ambiguous `"Health: Pending Verification"` badge on curated catalog tools
- [x] **BUG-26** (High): Discovering skills required navigating command palette without persistent status bar, title bar, or default keybinding shortcuts
- [x] **BUG-27** (High): Comparison Matrix `.sf-comparison-grid` clipped horizontally without scrollbar on narrow and split viewports

### Pre-Publication Resilience & MCP Standalone Audit (Resolved)
- [x] **BUG-28** (Critical): `ComparisonEngine` crash on uncataloged alternatives (`pinia` vs `vuex`) & misleading MCP error
- [x] **BUG-29** (Critical): `@skillforge/mcp` server runtime failure on `npx` due to unbundled private monorepo dependencies

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

### BUG-11: Terminal Install Command Passes Human Display Name Instead of Package Identifier

- **Severity**: Critical (Shell syntax crash / package installation failure)
- **File Affected**: [`packages/vscode-client/src/extension.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/extension.ts#L244-L248) (Lines 244–248)
- **Root Cause**:
  `extension.ts` calls `TerminalRunner.deriveInstallCommand(topSkill.name, topSkill.ecosystem)`.
  `topSkill.name` is the human-facing name (e.g. `"Next.js"`, `"Tailwind CSS"`, `"TanStack Query (React Query)"`, `"Vue.js"`).
  This generates shell commands like:
  ```bash
  pnpm add TanStack Query (React Query)
  ```
  which crashes with shell syntax errors on parentheses, or installs nonexistent packages.
- **Remediation**:
  Derive the install command from `topSkill.stackIndicators?.[0] || topSkill.id`:
  ```ts
  const packageName = topSkill.stackIndicators?.[0] || topSkill.id;
  const installCmd = TerminalRunner.deriveInstallCommand(
    packageName,
    topSkill.ecosystem
  );
  ```

---

### BUG-12: CodeLens Provider Dormant on Fresh Startup (Missing Activation Events)

- **Severity**: Critical (Feature Dormant on Startup)
- **File Affected**: [`packages/vscode-client/package.json`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/package.json#L16-L27) (Lines 16–27)
- **Root Cause**:
  `activationEvents` only includes views (`onView:skillforge.*`) and commands (`onCommand:skillforge.*`).
  It lacks language activation events (`onLanguage:typescript`, `onLanguage:javascript`, `onLanguage:python`, etc.).
  CodeLens is registered via `vscode.languages.registerCodeLensProvider` in `activate()`, which is never invoked when a developer opens a source code file.
- **Remediation**:
  Add `onLanguage` entries for all 11 supported languages or `onStartupFinished` in `activationEvents`.

---

### BUG-13: `TerminalRunner` Reuses Stale CWD on Context Scope Switch

- **Severity**: High (Silent state misdirection)
- **File Affected**: [`packages/vscode-client/src/terminal/terminal-runner.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/terminal/terminal-runner.ts#L9-L21) (Lines 9–21)
- **Root Cause**:
  `TerminalRunner.getOrCreateTerminal(cwd)` reuses any open terminal named `"SkillForge"`.
  If the terminal was initially opened with root `cwd`, and the user switches scope to `packages/server`, `getOrCreateTerminal` returns the root terminal without updating the directory.
- **Remediation**:
  Navigate to `cwd` if specified before executing commands:
  ```ts
  public static runCommand(command: string, cwd?: string): void {
    if (!command || !command.trim()) return;
    const terminal = TerminalRunner.getOrCreateTerminal(cwd);
    terminal.show(false);
    if (cwd) {
      terminal.sendText(`cd "${cwd}"`, true);
    }
    terminal.sendText(command.trim(), true);
  }
  ```

---

## 🧪 Phase 5.2, 6 & 7 Audit Findings (BUG-14 to BUG-22)

### BUG-14: AI-Suggested Skills Silently Fail to Bookmark (`prompt-templates.ts` vs `SkillCategorySchema`)

- **Severity**: Critical (Silent data loss / broken feature across BYOK + Bookmarks layers)
- **Files Affected**:
  - [`packages/server/src/providers/prompt-templates.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/prompt-templates.ts#L17) (Line 17)
  - [`packages/server/src/providers/openai-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/openai-provider.ts#L56) (Line 56)
  - [`packages/server/src/reliability/ground-truth-anchor.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/ground-truth-anchor.ts#L112-L120) (Lines 112–120)
  - [`packages/vscode-client/src/bookmarks/bookmark-manager.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/bookmarks/bookmark-manager.ts#L24-L31) (Lines 24–31)
- **Root Cause**:
  `SKILLFORGE_SYSTEM_PROMPT` instructs OpenAI/Gemini to emit categories `"state | auth | backend | testing | styling | ui | database | devtools | api | performance | mobile | other"`. However, `SkillCategorySchema` requires `'state-management' | 'authentication' | 'backend-framework' | 'ui-library' | 'api-protocol' | 'utility' | ...`. `parseRawSuggestions()` and `GroundTruthAnchor.buildUnanchored()` pass the unvalidated LLM category through onto `SuggestedSkill`. When the user clicks the Bookmark icon on an unanchored AI suggestion, `BookmarkManager.addBookmark()` persists it, and `BookmarkManager.getBookmarks()` immediately runs `validateSkillBookmark()`, which throws a `ZodError` and silently drops the bookmark.
- **Remediation**:
  1. Align `SKILLFORGE_SYSTEM_PROMPT` categories with `SkillCategorySchema`.
  2. Normalize shorthand categories (`state` → `state-management`, `auth` → `authentication`, `backend` → `backend-framework`, `ui`/`styling` → `ui-library`, `api` → `api-protocol`, `devtools`/`performance` → `utility`) and validate `officialUrl` in `parseRawSuggestions()`, `GroundTruthAnchor.buildUnanchored()`, and `BookmarkManager.addBookmark()`.

---

### BUG-15: Hybrid/BYOK Pipeline Bypasses `ConflictDetector`, `isInstalledInWorkspace`, and `minTrustTier`

- **Severity**: High (Missing safety warnings & filter enforcement on AI/Hybrid results)
- **Files Affected**:
  - [`packages/server/src/providers/hybrid-merger.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/hybrid-merger.ts#L21-L94) (Lines 21–94)
  - [`packages/server/src/providers/openai-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/openai-provider.ts#L141-L149)
  - [`packages/server/src/providers/gemini-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/gemini-provider.ts#L104-L112)
- **Root Cause**:
  Unlike `SuggestionEngine.suggest()`, `OpenAIProvider`, `GeminiProvider`, and `HybridMerger.merge()` only run `GroundTruthAnchor.anchorAll()` and never invoke `ConflictDetector.detectConflicts()`, never populate `isInstalledInWorkspace` against `context.alreadyInstalled`, and never filter by `options.minTrustTier`.
- **Remediation**:
  Post-process merged/AI skills through `ConflictDetector.detectConflicts()`, `isInstalledInWorkspace` tagging, and `minTrustTier` filtering using the active `SkillSuggestionParams`.

---

### BUG-16: Live LSP `skillforge/compare` Drops Workspace `alreadyInstalled` Context

- **Severity**: High (`isInstalledInWorkspace` is always `false` in live Comparison Matrix)
- **Files Affected**:
  - [`packages/shared/src/protocol.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/shared/src/protocol.ts#L88-L90) (Lines 88–90)
  - [`packages/server/src/server.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/server.ts#L120-L130) (Lines 120–130)
  - [`packages/vscode-client/src/extension.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/extension.ts#L314-L323) (Lines 314–323)
- **Root Cause**:
  `CompareParams` omits `installedPackages?: string[]`, `extension.ts` does not send `scopeManager.buildWorkspaceContext().alreadyInstalled`, and `server.ts` invokes `this.comparisonEngine.compare({ skillIds })` without the second `installedPackages` argument.
- **Remediation**:
  Add `installedPackages?: string[]` to `CompareParams`, send `scopeManager.buildWorkspaceContext().alreadyInstalled` from `extension.ts`, and forward it to `this.comparisonEngine.compare({ skillIds }, params?.installedPackages)` in `server.ts`.

---

### BUG-17: `HybridMerger.merge()` Drops `categoryRecommendations` on Fallback Cascade

- **Severity**: High (Empty category drawer when fallback triggers with active BYOK provider)
- **File Affected**: [`packages/server/src/providers/hybrid-merger.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/hybrid-merger.ts#L70-L93) (Lines 70–93)
- **Root Cause**:
  When `isFallback` is `true` in `HybridMerger.merge()`, `localResult.categoryRecommendations` is omitted from the returned `SkillSuggestionResult` object.
- **Remediation**:
  Preserve `categoryRecommendations: isFallback ? localResult.categoryRecommendations : undefined` in `HybridMerger.merge()`.

---

### BUG-18: `OpenAIProvider` and `GeminiProvider` Ignore Dynamic `config.timeoutMs`

- **Severity**: Medium (User timeout setting ignored)
- **Files Affected**:
  - [`packages/server/src/providers/openai-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/openai-provider.ts#L113) (Line 113)
  - [`packages/server/src/providers/gemini-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/gemini-provider.ts#L72) (Line 72)
- **Root Cause**:
  Both providers use `AbortSignal.timeout(this.timeoutMs)` instead of `AbortSignal.timeout(config.timeoutMs ?? this.timeoutMs)`.
- **Remediation**:
  Respect `config.timeoutMs ?? this.timeoutMs` on every `suggest()` request.

---

### BUG-19: `parseRawSuggestions()` Crashes on Conversational Prose Around Markdown JSON Fences

- **Severity**: Medium (Unnecessary fallback on valid LLM JSON inside fenced blocks)
- **File Affected**: [`packages/server/src/providers/openai-provider.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/providers/openai-provider.ts#L28-L40) (Lines 28–40)
- **Root Cause**:
  `cleaned.startsWith('```')` fails when an LLM prepends conversational text before the code fence, causing `JSON.parse()` to throw `SyntaxError`.
- **Remediation**:
  Extract fenced JSON via regex `/```(?:json)?\s*([\s\S]*?)```/i` or outer `{...}` / `[...]` bounds before calling `JSON.parse()`.

---

### BUG-20: `GroundTruthAnchor.anchor()` Misses `getSkillByIndicator()` Package Name Lookup

- **Severity**: Medium (Verified skills demoted to unanchored `suggested` when LLM uses npm/PyPI package name)
- **File Affected**: [`packages/server/src/reliability/ground-truth-anchor.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/reliability/ground-truth-anchor.ts#L30-L60) (Lines 30–60)
- **Root Cause**:
  `anchor()` checks `getSkillById()` and display name, but never calls `this.repository.getSkillByIndicator()` (e.g., `next` → `nextjs`, `tailwindcss` → `tailwind-css`, `next-auth` → `authjs`).
- **Remediation**:
  Check `this.repository.getSkillByIndicator(raw.id)` and `this.repository.getSkillByIndicator(raw.name)` in `GroundTruthAnchor.anchor()`.

---

### BUG-21: Toggling a Bookmark Resurrects a Submitted Feedback Bar

- **Severity**: Medium (UI state regression on re-render)
- **File Affected**: [`packages/vscode-client/src/webview/suggestion-panel.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/webview/suggestion-panel.ts#L225-L237) (Lines 225–237)
- **Root Cause**:
  `handleWebviewMessage` (`case 'submitFeedback'`) records feedback in `FeedbackManager` but does not set `this.showFeedbackPrompt = false`. Subsequent `toggleBookmark` calls invoke `this.updateHtml()`, re-rendering the feedback prompt.
- **Remediation**:
  Set `this.showFeedbackPrompt = false;` when `submitFeedback` is handled.

---

### BUG-22: Comparison Matrix Package Manager Discrepancy (`npm install` vs `pnpm add`), Stale Tab Title, and CSP

- **Severity**: Low (UX/Security consistency)
- **Files Affected**:
  - [`packages/vscode-client/src/webview/comparison-html.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/webview/comparison-html.ts#L195) (Lines 195, 517, 602–615)
  - [`packages/vscode-client/src/webview/comparison-panel.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/webview/comparison-panel.ts#L64-L71) (Lines 64–71)
- **Root Cause**:
  1. `deriveInstallString()` in `comparison-html.ts` outputs `npm install` (and omits `java`), whereas clicking `Install` in the header calls `TerminalRunner.deriveInstallCommand()`, which runs `pnpm add`.
  2. `ComparisonPanel.createOrShow()` does not update `this.panel.title` when reusing an existing panel for a new comparison.
  3. `comparison-html.ts` uses `style-src 'unsafe-inline'` instead of `style-src 'nonce-${nonce}'`.
- **Remediation**:
  Align `deriveInstallString()` with `TerminalRunner.deriveInstallCommand()`, update `this.panel.title` on reuse, and enforce `style-src 'nonce-${nonce}'`.

---

### BUG-23: `SkillsRepository.search()` Substring False-Positive on Short Skill Names (`"Ent"`, `"Gin"`)

- **Severity**: High (Incorrect search scoring & suppressed fallback cascade)
- **File Affected**: [`packages/server/src/data/skills-repository.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/data/skills-repository.ts#L240-L250) (Lines 240–250)
- **Root Cause**:
  `else if (trimmed.includes(lowerName))` performed an unbounded substring check for `skill.name` inside the query string. Short 3-letter skill names like `"Ent"` (`ent-go`) or `"Gin"` (`gin-gonic`) matched inside unrelated words like `"authentication"`, `"component"`, `"nonexistent"`, `"login"`, `"logging"`, or `"pagination"`, awarding a false `+60` (`Query mentions name`) score boost and preventing the fallback cascade from triggering on unrecognized queries containing `"ent"`.
- **Remediation**:
  Use a delimiter-bounded regex `(?:^|[\s,./_-])${escapeRegExp(lowerName)}(?:$|[\s,./_-])` so multi-word and punctuation-containing skill names (`"next.js"`, `"c++"`) still match while internal word substrings do not.

### BUG-24: Walkthrough Trigger Command Missing Extension Name Segment
- **Severity**: High (Walkthrough fails to open; falls back to generic IDE welcome)
- **Files Affected**: [`packages/vscode-client/src/extension.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/extension.ts#L232)
- **Root Cause**: `workbench.action.openWalkthrough` expects `${publisher}.${name}#${walkthroughId}`. Passing `'skillforge#skillforge.walkthrough'` omitted the extension name segment, causing VS Code / Antigravity IDE to fail resolution and open the standard IDE welcome screen.
- **Remediation**: Updated parameter to `'skillforge.skillforge#skillforge.walkthrough'` in both `openWalkthroughCmd` and first-run trigger. Added regression assertion in `marketplace-readiness.test.ts`.

---

### BUG-25: Ambiguous "Pending Verification" Health Status on Curated Skills
- **Severity**: Medium (Confusing UX / falsely implies tool is unvetted or untrustworthy)
- **File Affected**: [`packages/vscode-client/src/webview/webview-html.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/webview/webview-html.ts#L125-L135)
- **Root Cause**: When a skill has no live registry telemetry, `renderHealthBar` displayed `"Health: Pending Verification"` with orange aging styling.
- **Remediation**: Render `<span class="sf-health-healthy">Catalog Verified • Curated Tool</span>` with an inline vector checkmark icon (`ICON_CHECK`) and clear explanatory tooltips.

---

### BUG-26: High Friction Discovery Workflow (Missing Status Bar, Keybindings & Title Icons)
- **Severity**: High (Accessibility & ergonomics blocker)
- **Files Affected**:
  - [`packages/vscode-client/package.json`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/package.json)
  - [`packages/vscode-client/src/extension.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/extension.ts)
- **Root Cause**: Users were required to repeatedly open Command Palette (`Ctrl+Shift+P`), type `"skillforge"`, and locate commands.
- **Remediation**:
  1. Created permanent status bar item `$(sparkle) SkillForge` running `skillforge.suggest`.
  2. Contributed global keybindings: `Ctrl+Alt+S` / `Cmd+Alt+S` for `skillforge.suggest`, and `Ctrl+Alt+F` / `Cmd+Alt+F` for `skillforge.suggestForCurrentFile`.
  3. Contributed 1-click `editor/title` icon for active file suggestions.
  4. Added `view/title` action buttons on `quickActionsView`.

---

### BUG-27: Comparison Matrix Horizontal Overflow & Truncated Columns on Narrow Screens
- **Severity**: High (Information loss on standard & split viewports)
- **File Affected**: [`packages/vscode-client/src/webview/comparison-html.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/vscode-client/src/webview/comparison-html.ts)
- **Root Cause**: The grid had `overflow: hidden` on `.sf-comparison-grid` without a parent scroll container. On narrow or split viewports, columns on the right (like Vue.js in React vs Vue comparisons) were clipped and impossible to scroll into view.
- **Remediation**:
  1. Wrapped the grid in `.sf-matrix-scroll-wrapper` with `overflow-x: auto;` and styled custom scrollbars.
  2. Set `.sf-comparison-grid` min-width to `calc(180px + ${colCount} * 280px)` and column minmax to `280px`.
  3. Made the row labels column sticky (`position: sticky; left: 0; z-index: 2; box-shadow: 2px 0 4px rgba(0,0,0,0.08);`) so row labels stay visible while scrolling across columns.

---

### BUG-28: ComparisonEngine Crash on Uncataloged Alternatives & Misleading MCP Error

- **Severity**: Critical (Causes unhandled exception in comparison panel and false error reporting in MCP)
- **Files Affected**:
  - [`packages/server/src/engine/comparison-engine.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/engine/comparison-engine.ts)
  - [`packages/mcp/src/tools/compare-tool.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/mcp/src/tools/compare-tool.ts)
- **Reproduction**:
  ```ts
  new ComparisonEngine().compare({ skillIds: ['pinia', 'vuex'] });
  ```
  **Output Before Fix**:
  ```
  Error: Failed to generate comparison: skill(s) not found: "vuex"
  ```
  In MCP, this triggered a catch block returning `None of the requested libraries (pinia, vuex) were found in the curated catalog.` (even though `pinia` is in the catalog!).
- **Root Cause**:
  `ComparisonEngine` threw an unhandled exception if any requested ID was not in the catalog, even when the ID was explicitly declared in `skill.alternatives`. Furthermore, `handleCompareTool` returned a blanket error claiming neither skill existed.
- **Remediation**:
  1. Updated `ComparisonEngine` to dynamically synthesize resilient unanchored comparison columns (`trustTier: 'suggested'`) for missing IDs declared in `alternatives` or `worksWellWith`.
  2. Maintained conflict detection across both curated and unanchored tools (`"Pinia" and "Vuex" are direct alternatives in state-management`).
  3. Updated `handleCompareTool` in MCP to cleanly render comparisons and only report not found when none of the tools are known or related.
  4. Added regression suite `comparison-resilience.test.ts` (9 tests).

---

### BUG-29: Standalone MCP Server Execution Failure via `npx` due to Unbundled Private Dependencies

- **Severity**: Critical (External runtime failure for all non-monorepo users)
- **Files Affected**:
  - [`packages/mcp/package.json`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/mcp/package.json)
  - `packages/mcp/esbuild.mjs` (New)
  - [`packages/server/src/api.ts`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/packages/server/src/api.ts)
  - [`.github/workflows/ci.yml`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/.github/workflows/ci.yml)
- **Root Cause**:
  `packages/mcp` compiled solely with `tsc -b`, leaving direct imports to `@skillforge/server` and `@skillforge/shared`. Because those packages are `"private": true` and not published to npm, running `npx @skillforge/mcp` outside the monorepo failed immediately with `Cannot find module '@skillforge/server'`. Additionally, `packages/server/src/api.ts` re-exported `SkillForgeServer`, pulling in `vscode-languageserver` and causing ESM `require('node:fs')` runtime syntax errors.
- **Remediation**:
  1. Removed `SkillForgeServer` from `api.ts`, cleanly decoupling headless engines from LSP dependencies.
  2. Created `packages/mcp/esbuild.mjs` to bundle `@skillforge/server`, `@skillforge/shared`, and dataset into a self-contained executable at `packages/mcp/dist/index.js` with `createRequire` banner and shebang.
  3. Updated build script in `packages/mcp/package.json` to `tsc -b && node esbuild.mjs`.
  4. Added standalone MCP execution verification to CI workflow `.github/workflows/ci.yml`.
  5. Verified live stdio JSON-RPC handshake with 0 missing dependency errors.

---

## 📌 Pre-Publish Action Items for Next Release (v0.1.2 — ALL RESOLVED)

### PRE-01: Fix Open VSX Relative Screenshot Resolution (RESOLVED in v0.1.2)
- **Status**: ✅ RESOLVED
- **Resolution**:
  1. Mirrored `packages/vscode-client/resources/screenshots/` into repository root `resources/screenshots/`.
  2. Configured `--baseImagesUrl https://raw.githubusercontent.com/AugustyaB/SkillForge/main/packages/vscode-client` in `packages/vscode-client/package.json` package and publish scripts.

### PRE-02: Remove Unrendered LaTeX Math Delimiters in README (RESOLVED in v0.1.2)
- **Status**: ✅ RESOLVED
- **Resolution**:
  Replaced KaTeX math delimiters in `packages/vscode-client/README.md` (`$<2\text{ms}$` with `< 2ms` and `$\to$` with standard arrow `→`).

---

## 🛠️ Instructions for Next Chat / Developer

All 29 identified bugs (`BUG-01` through `BUG-29`) and both pre-publish action items (`PRE-01` and `PRE-02`) have been completely resolved and empirically verified with regression tests in `v0.1.2`. Follow the **Mandatory Gating Protocol** in [`PROJECT_RULES.md`](file:///c:/Users/augus/Documents/antigravity/radiant-bardeen/PROJECT_RULES.md) for any future enhancements.
