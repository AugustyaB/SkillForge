# skillforge-mcp-server

Model Context Protocol (MCP) server for SkillForge: map developer intents to vetted libraries, detect architectural conflicts, and generate AI agent skill directives with Karpathy coding disciplines.

Works natively with **Claude Desktop, Claude Code CLI, Cursor, Antigravity, and Windsurf**.

---

## ⚡ Quick Start with Claude Desktop

Add SkillForge to your `claude_desktop_config.json`:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "skillforge": {
      "command": "npx",
      "args": ["-y", "skillforge-mcp-server"]
    }
  }
}
```

Restart Claude Desktop, and you will see the SkillForge tools available!

---

## 🚀 Quick Start with Claude Code CLI

Run Claude Code with the SkillForge MCP server enabled:

```bash
claude mcp add skillforge -- npx -y skillforge-mcp-server
```

Or configure in your project root `.claude/config.json`.

---

## 🎯 Quick Start with Cursor IDE

1. Open Cursor Settings $\to$ **Features** $\to$ **MCP**.
2. Click **+ Add New MCP Server**.
3. Fill in:
   - **Name**: `skillforge`
   - **Type**: `command`
   - **Command**: `npx -y skillforge-mcp-server`

---

## 🛠️ Available MCP Tools

### 1. `skillforge_suggest`
Find curated, vetted libraries and tools for a programming language, feature, or architecture goal. Detects conflicts with packages already installed in the user's workspace.
- **Parameters**:
  - `intent` (string, required): Plain-English feature description (e.g. *"real-time websocket chat"*, *"state management"*, *"python pdf extraction"*).
  - `workspacePath` (string, optional): Project folder path to inspect existing dependencies.
  - `ecosystem` (enum, optional): Target ecosystem (`typescript`, `python`, `rust`, `go`, etc.).
  - `maxResults` (number, optional, default: 5): Max suggestions to return.

### 2. `skillforge_compare`
Compare 2 or 3 competing libraries side-by-side (e.g. `["fastapi", "django"]` or `["zustand", "redux-toolkit"]`). Analyzes pros, cons, architectural conflict risk, and maintenance status.
- **Parameters**:
  - `skillIds` (array of strings, 2–3 items, required): The library IDs to compare.
  - `workspacePath` (string, optional): Project path to check which candidate is already installed.

### 3. `skillforge_create_rules`
Generate an actionable coding rules file (`SKILL.md`, `.cursor/rules/*.mdc`, or `AGENTS.md`) that teaches AI coding assistants how to write bug-free code using a specific library, including Karpathy coding disciplines and deterministic CLI verification commands.
- **Parameters**:
  - `skillId` (string, required): Library ID (e.g. `zod`, `fastapi`, `tailwind`, `prisma`).
  - `format` (enum, optional, default: `'agent-skill'`): `agent-skill`, `cursor-rule`, `claude-skill`, or `root-agents`.
  - `workspacePath` (string, optional): Where the generated file should be saved.

### 4. `skillforge_get_catalog`
Browse or filter the complete 363-skill curated catalog by category or ecosystem.
- **Parameters**:
  - `category` (string, optional): Category name (e.g. `state-management`, `authentication`, `database`, `ai-agent`).
  - `ecosystem` (string, optional): Target ecosystem.
  - `limit` (number, optional, default: 30): Max tools to return.

---

## 🔒 100% Private & Offline by Default

- Runs entirely on your local machine using an in-memory database of 363 curated skills.
- Zero source code transmitted.
- Communicates over local standard input/output (`stdio`).

---

## 📜 License
 
- **Code**: [MIT License](./LICENSE)
- **Catalog Dataset**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](./LICENSE)
