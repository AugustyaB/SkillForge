# Multiple Ways to Discover Tools

SkillForge integrates naturally into your day-to-day coding flow with multiple entry points:

### 1. Command Palette
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type **SkillForge: Suggest Skills**. Enter what you want to build and press Enter. The Suggestion Canvas will slide open with ranked recommendations.

### 2. Activity Bar Sidebar
Click the **SkillForge Anvil Icon** in the VS Code Activity Bar on the left to see:
- **Context & Stack**: Your active scope, detected ecosystem, and installed packages.
- **Quick Actions**: One-click shortcuts for common intents.
- **Recent Discoveries**: Persistent query history with instant replay.
- **Saved Bookmarks**: Your curated library of bookmarked tools organized by category.

### 3. Inline CodeLens Comments
While coding in any of the 11 supported languages (TypeScript, JavaScript, Python, Rust, Go, Java, C, C++, C#), simply type a comment:
```typescript
// IDEA: user authentication with OAuth2 and sessions
// SKILL: high performance background queue
```
SkillForge will automatically render an inline CodeLens button above the comment:
`SkillForge: Suggest libraries for "user authentication..."`. Click it to get recommendations for that exact feature without leaving your code editor!

[Try a Suggestion Now](command:skillforge.suggest)
