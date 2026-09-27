# Phase 4: Reliability Engine & Trust Verification — Research & Architecture

> **Phase**: 4 — Reliability Engine & Trust Verification
> **Objective**: Formulate the multi-tiered verification pipeline to eliminate hallucinations, detect abandoned packages, verify ecosystem compatibility, and assign transparent trust tiers.
> **Protocol**: GSD Planning Gate (Gate 1 Strict Lock)

---

## 1. Problem Statement & Motivation

SkillForge is not merely a search tool — it is an **advisor**. For beginners and intermediate developers:
1. **Hallucination Risk**: When LLMs or external suggestion sources are integrated, they can invent nonexistent packages or suggest deprecated libraries.
2. **Maintenance Risk**: Recommending an unmaintained or abandoned library (e.g. `request`, abandoned in 2020) can cost developers weeks of refactoring later.
3. **Compatibility & Conflict Risk**: Suggesting mutually exclusive alternatives (e.g. both React and Angular, or Fastify when Express is already in the project) confuses beginners.
4. **Resilience Risk**: If an external API or network is unavailable, the user must never be stranded with an unhandled exception or blank screen.

---

## 2. Multi-Tiered Reliability Architecture

```
User Query + Context
        │
        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 1: Schema Validation (Zod Contract)              │
│ • Validates structure, field lengths, confidence (0-1) │
│ • Rejects or sanitizes malformed suggestion objects    │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Ground-Truth Anchoring                        │
│ • Cross-references candidates with vetted 118-skill DB │
│ • Match? Elevate to 'verified' (🟢), anchor official    │
│   metadata, stack indicators, and prerequisites        │
│ • Non-match? Flag for registry & health checks         │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Health & Registry Verification                │
│ • npm registry / downloads endpoint checks             │
│ • Checks: packageExists, deprecated flag, lastPublished│
│ • Classifies: 'healthy' | 'aging' | 'abandoned' |'risky│
│ • 24-hr TTL caching + offline graceful fallback        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 4: Trust Tier Classification                     │
│ • 🟢 verified: Curated, vetted, healthy                │
│ • 🟡 validated: Real package on registry, healthy/aging│
│ • 🟠 suggested: Exists, unverified health or niche     │
│ • ⛔ deprecated: Abandoned (>3 yrs) or deprecated flag  │
│ • Filter by minTrustTier option                        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 5: Conflict & Alternative Detection              │
│ • Cross-checks skill.alternatives                      │
│ • Suggestion vs. Already-Installed (e.g. Fastify vs pg)│
│ • Suggestion vs. Suggestion (e.g. React vs Vue)        │
│ • Generates "pick one, not both" warnings & groupings   │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│ Layer 6: Fallback Cascade Orchestrator                 │
│ • Primary query match -> Broadened tag search ->       │
│   Category Browser (curated starter packs)             │
│ • Zero empty screens; guaranteed helpful advice        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Key Technical Decisions & Patterns

### 3.1 Offline-Safe Registry Health Verification
- Use native Node 18+ `fetch` with an `AbortController` timeout (2000ms).
- Abstract HTTP calls behind a `FetchFunction` interface to allow dependency injection for zero-network unit tests.
- Maintain an in-memory `HealthCache` (with 24-hour TTL) so identical package lookups are instant ($O(1)$) and minimize network overhead.
- When offline or if the network fails:
  - Check cache first.
  - If uncached, assume package exists but mark health as unverified rather than failing the request.

### 3.2 Conflict & Alternative Detection Logic
- Every curated skill already defines `alternatives: string[]` (e.g., `react` has `['vue', 'svelte', 'angular']`).
- When a candidate skill $S$ is in the result set:
  - If any $A \in S.alternatives$ is present in `context.alreadyInstalled`:
    - Set `conflictWith = [A]`.
    - Set `conflictWarning = "Alternative to already-installed '${A}' — consider if you want to replace it."`
  - If any $A \in S.alternatives$ is also present in the active result set:
    - Set `conflictWith = [A]`.
    - Set `conflictWarning = "Alternative to '${A}' in this list — pick one, not both."`

### 3.3 Fallback Cascade & Category Browser
- When an intent produces zero matching skills (e.g., vague prompt, non-technical query, or obscure domain):
  - Do not return an empty array.
  - Activate `FallbackCascade`:
    1. Try fuzzy tag search across all categories.
    2. If still empty, return top curated starter skills grouped by foundational categories (`frontend-framework`, `backend-framework`, `database`, `testing`).
    3. Return `fallbackUsed: true` with `categoryRecommendations`.

---

## 4. Work Breakdown

- **Wave 1 (Plan 4.1)**:
  - Schemas & Types: `RawSuggestionSchema`, `CategoryRecommendation`, conflict fields in `SuggestedSkill`.
  - `GroundTruthAnchor`: Cross-referencing against `SkillsRepository`.
  - `ConflictDetector`: Alternative and conflict detection engine.
- **Wave 2 (Plan 4.2)**:
  - `HealthVerifier`: Package registry verification, metric extraction, and caching.
  - `TrustTierClassifier`: Multi-factor trust assignment and filtering.
  - `FallbackCascade`: Category browser and graceful degradation.
  - Integration: Wire all reliability components into `SuggestionEngine` and LSP server.
