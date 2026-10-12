# SkillForge

> **Cross-IDE developer skill discovery engine: map your natural language ideas to vetted libraries, frameworks, and architecture patterns.**

SkillForge acts as a developer's skill compass. When you have an idea for a feature or need to choose between competing libraries, SkillForge analyzes your intent and workspace context to recommend battle-tested tools with actionable learning paths, package health indicators, and verified trust signals.

---

## Highlights

- **Intent-Based Discovery**: Describe what you want to build in plain English (e.g. *"real-time chat with WebSockets"*, *"fast async postgres ORM"*, *"declarative UI animations"*) and receive instant, ranked suggestions.
- **350+ Curated, Purposeful Technologies**: An offline, in-memory knowledge base covering Web, Python, Mobile, AI/ML, Rust, Go, Java/JVM, DevOps, and Security. Every skill serves a concrete purpose with real package names, install commands, and verified docs.
- **100% Offline & Private by Default**: No code transmission, no cloud servers required, and zero telemetry. Queries execute locally in $<2\text{ms}$.
- **Battle-Tested Trust Seals**: Multi-tiered reliability with **Verified**, **Validated**, and **Suggested** tiers, real npm/GitHub download metrics, and deprecation warnings.
- **Side-by-Side Comparison Matrix**: Compare 2 to 3 competing tools directly inside VS Code with architectural conflict warnings, pros, caveats, and companion chips.
- **Context & Monorepo Scoping**: Auto-discovers monorepo workspaces and lets you lock context to specific directories (`apps/web`, `packages/backend`).
- **Inline CodeLens Triggers**: Detects `// IDEA:` and `// SKILL:` comments across 11 programming languages to suggest libraries without leaving your code editor.
- **One-Click Terminal Install**: Run exact package manager commands (`pnpm add`, `pip install`, `cargo add`, `go get`) in the scoped folder with a single click.
- **Optional BYOK Cloud AI**: Bring Your Own Key for OpenAI or Google Gemini. API keys are stored securely in your OS Keychain (`SecretStorage`).

---

## Trigger Mechanisms

SkillForge offers three distinct ways to discover tools:

### 1. Command Palette
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and run:
`SkillForge: Suggest Skills for My Idea`

### 2. Activity Bar Sidebar
Click the **SkillForge Forge Icon** in the VS Code Activity Bar on the left to access:
- **Context & Stack View**: Detected ecosystems, manifest files, and installed dependencies.
- **Quick Actions View**: One-click triggers for popular categories and comparisons.
- **Recent Discoveries View**: Past query history with instant replay.
- **Bookmarks View**: Saved tools organized by category.

### 3. Inline CodeLens Comments
Add a comment in any supported language:
```typescript
// IDEA: user authentication with OAuth2 and sessions
// SKILL: high performance background job queue
```
Click the inline CodeLens prompt above the comment to trigger immediate suggestions.

---

## Side-by-Side Technology Comparison

Uncertain whether to choose *FastAPI vs Django*, *React vs Vue vs Svelte*, or *Zustand vs Redux Toolkit*?
Run `SkillForge: Compare Skills Side-by-Side` or click the **vs** chip in any skill's Deep Dive drawer.

- **Architectural Conflict Warnings**: Detects mutually exclusive packages occupying the same architectural slot.
- **Metric Grids**: Weekly download counts, GitHub stars, last published recency, and maintenance verdicts.
- **Direct Terminal Actions**: Run install commands directly for whichever candidate you select.

---

## Configuration Settings

Customize SkillForge behavior in VS Code Settings (`Ctrl+,` $\to$ search `skillforge`):

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `skillforge.provider` | `string` | `"local"` | Active suggestion provider: `"local"` (100% offline), `"gemini"`, `"openai"`, or `"hybrid"`. |
| `skillforge.maxResults` | `number` | `5` | Maximum number of ranked recommendations to return. |
| `skillforge.defaultDifficulty` | `string` | `"all"` | Target difficulty tier: `"all"`, `"beginner"`, `"intermediate"`, `"advanced"`. |
| `skillforge.timeoutMs` | `number` | `4000` | Timeout in milliseconds for optional BYOK AI requests before falling back to local catalog. |
| `skillforge.openai.model` | `string` | `"gpt-4o-mini"` | Model name for OpenAI-compatible endpoints. |
| `skillforge.gemini.model` | `string` | `"gemini-1.5-flash"` | Model name for Google Gemini endpoints. |

---

## Privacy & Security Commitment

1. **Zero Source Code Transmission**: SkillForge never reads, parses, or transmits your application source code, file contents, or Git commit history.
2. **Local Execution**: All 350+ skills reside in an in-memory database bundled directly within the extension.
3. **OS Keychain Secret Storage**: API keys are stored exclusively in your operating system's native keychain (Windows Credential Manager, macOS Keychain, Linux Secret Service).
4. **Content Security Policy (CSP)**: The Suggestion Canvas Webview enforces strict nonces and disallows external unsafe scripts.

---

## License

- **Extension Code**: [MIT License](LICENSE)
- **Curated Skills Catalog**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE)
