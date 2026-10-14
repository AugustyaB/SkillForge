# 🟢 SkillForge Neovim / Vim Integration

Use SkillForge inside **Neovim** and **Vim** to discover curated libraries, detect architectural conflicts, and generate AI agent skill directives without leaving your editor.

---

## ⚡ Method 1: Install as a Neovim Plugin (`lazy.nvim`)

Install SkillForge directly as a native Neovim plugin with floating UI:

```lua
-- In ~/.config/nvim/lua/plugins/skillforge.lua
return {
  "AugustyaB/SkillForge",
  cmd = { "SkillForgeSuggest", "SkillForgeCompare", "SkillForgeRules" },
  keys = {
    { "<leader>sf", "<cmd>SkillForgeSuggest<cr>", desc = "SkillForge: Suggest Libraries" },
    { "<leader>sc", "<cmd>SkillForgeCompare<cr>", desc = "SkillForge: Compare Libraries" },
  },
  opts = {
    -- Optional custom configuration
    floating_border = "rounded",
  },
}
```

### Available Neovim Commands:
- `:SkillForgeSuggest [intent]` — Prompts for an intent (e.g. `fast state management`, `python pdf extraction`) and renders recommendations in a syntax-highlighted floating buffer. Press `q` or `<Esc>` to dismiss.
- `:SkillForgeCompare <lib1> <lib2>` — Displays a side-by-side Markdown comparison matrix (e.g. `:SkillForgeCompare zustand redux-toolkit`).
- `:SkillForgeRules <lib> [format]` — Generates Karpathy coding guidelines (`SKILL.md` or `.cursor/rules`) directly in your workspace.

---

## 🤖 Method 2: Avante.nvim (Cursor inside Neovim)

If you use [Avante.nvim](https://github.com/yetone/avante.nvim) as your AI pair programmer, connect SkillForge as an MCP server:

```lua
-- In your avante.lua config
return {
  "yetone/avante.nvim",
  opts = {
    mcp_servers = {
      skillforge = {
        command = "npx",
        args = { "-y", "skillforge-mcp-server" },
      },
    },
  },
}
```

Ask Avante:
> *"Use SkillForge to recommend a modern authentication library for Next.js that doesn't conflict with my existing packages."*

---

## 💬 Method 3: CodeCompanion.nvim

If you use [CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim):

```lua
-- In your codecompanion.lua config
return {
  "olimorris/codecompanion.nvim",
  opts = {
    strategies = {
      chat = {
        tools = {
          ["skillforge"] = {
            callback = "strategies.chat.tools.mcp",
            description = "SkillForge: Vetted library recommendations & conflict detector",
            opts = {
              command = "npx",
              args = { "-y", "skillforge-mcp-server" },
            },
          },
        },
      },
    },
  },
}
```

---

## 🔌 Method 4: Native Neovim LSP (`nvim-lspconfig`)

To run SkillForge as a background language server:

```lua
local lspconfig = require("lspconfig")
local configs = require("lspconfig.configs")

if not configs.skillforge then
  configs.skillforge = {
    default_config = {
      cmd = { "npx", "-y", "skillforge-mcp-server" },
      filetypes = { "typescript", "javascript", "python", "rust", "go" },
      root_dir = lspconfig.util.root_pattern("package.json", "pyproject.toml", "Cargo.toml", ".git"),
      settings = {},
    },
  }
end

lspconfig.skillforge.setup({})
```

---

## 💻 CLI / Standard Vim

You can run SkillForge from any standard Vim command buffer or terminal:

```vim
" Run query and view output in a scratch buffer
:new | r !npx -y skillforge-mcp-server --suggest "database orm"
```
