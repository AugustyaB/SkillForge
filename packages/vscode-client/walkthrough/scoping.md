# Scope Your Context

In large codebases, polyglot repositories, or monorepos with multiple tiers (e.g., `apps/web` vs `packages/backend`), you need recommendations tailored specifically to the directory you're working in.

### How Context Scoping Works:
1. **Auto-Discovery**: SkillForge automatically discovers project root manifests (`package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`) up to 3 levels deep.
2. **Dedicated Scope Selector**: Click the folder icon in the SkillForge Activity Bar or run the scope selector to lock recommendations to a specific package.
3. **Smart Conflict & Compatibility Detection**: SkillForge checks packages already installed in your active scope to prevent redundant suggestions, boost complementary tools (+30 pts), and warn you about competing frameworks.
4. **Scoped Terminal Execution**: When you click "Install", SkillForge automatically switches (`cd`) to your active scope directory before executing the package manager install command.

[Select Active Context Scope](command:skillforge.selectScope)
