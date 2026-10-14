-- SkillForge Neovim Integration
-- https://github.com/AugustyaB/SkillForge
local M = {}

M.config = {
  cmd = { "npx", "-y", "skillforge-mcp-server" },
  floating_border = "rounded",
  keymaps = {
    close = { "q", "<Esc>" },
  },
}

function M.setup(user_opts)
  M.config = vim.tbl_deep_extend("force", M.config, user_opts or {})
end

local function open_floating_window(title, lines)
  local width = math.min(100, math.floor(vim.o.columns * 0.85))
  local height = math.min(30, math.floor(vim.o.lines * 0.75))
  local row = math.floor((vim.o.lines - height) / 2)
  local col = math.floor((vim.o.columns - width) / 2)

  local buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
  vim.bo[buf].filetype = "markdown"
  vim.bo[buf].buftype = "nofile"
  vim.bo[buf].bufhidden = "wipe"
  vim.bo[buf].modifiable = false

  local win = vim.api.nvim_open_win(buf, true, {
    relative = "editor",
    width = width,
    height = height,
    row = row,
    col = col,
    style = "minimal",
    border = M.config.floating_border,
    title = " " .. title .. " ",
    title_pos = "center",
  })

  for _, key in ipairs(M.config.keymaps.close) do
    vim.keymap.set("n", key, function()
      if vim.api.nvim_win_is_valid(win) then
        vim.api.nvim_win_close(win, true)
      end
    end, { buffer = buf, silent = true, nowait = true })
  end

  return buf, win
end

local function execute_cli(cli_args, title)
  local cmd = vim.list_extend(vim.deepcopy(M.config.cmd), cli_args)
  local output = {}

  vim.notify("SkillForge: Querying recommendation engine...", vim.log.levels.INFO)

  vim.fn.jobstart(cmd, {
    stdout_buffered = true,
    stderr_buffered = true,
    on_stdout = function(_, data)
      if data then
        for _, line in ipairs(data) do
          if line ~= "" or #output > 0 then
            table.insert(output, line)
          end
        end
      end
    end,
    on_stderr = function(_, data)
      -- ignore notice output from npx
    end,
    on_exit = function(_, exit_code)
      vim.schedule(function()
        if exit_code ~= 0 or #output == 0 then
          vim.notify("SkillForge: Failed to retrieve recommendations.", vim.log.levels.WARN)
          return
        end
        open_floating_window(title, output)
      end)
    end,
  })
end

function M.suggest(intent)
  if not intent or intent == "" then
    vim.ui.input({ prompt = "SkillForge Suggest (e.g. 'state management'): " }, function(input)
      if input and input ~= "" then
        M.suggest(input)
      end
    end)
    return
  end

  execute_cli({ "--suggest", intent }, "SkillForge Suggestions: " .. intent)
end

function M.compare(lib1, lib2)
  if not lib1 or lib1 == "" then
    vim.ui.input({ prompt = "SkillForge Compare (e.g. 'zustand redux-toolkit'): " }, function(input)
      if input and input ~= "" then
        local parts = vim.split(input, "%s+", { trimempty = true })
        if #parts >= 2 then
          M.compare(parts[1], parts[2])
        else
          vim.notify("SkillForge: Please specify at least 2 libraries to compare.", vim.log.levels.WARN)
        end
      end
    end)
    return
  end

  execute_cli({ "--compare", lib1, lib2 }, "SkillForge Comparison: " .. lib1 .. " vs " .. lib2)
end

function M.rules(skill_id, format)
  if not skill_id or skill_id == "" then
    vim.ui.input({ prompt = "SkillForge Generate Rules for Skill (e.g. 'zod'): " }, function(input)
      if input and input ~= "" then
        M.rules(input, format)
      end
    end)
    return
  end

  local args = { "--rules", skill_id }
  if format then
    table.insert(args, "--format")
    table.insert(args, format)
  end

  execute_cli(args, "SkillForge Rules: " .. skill_id)
end

-- Helper for Avante.nvim MCP configuration
function M.avante_config()
  return {
    command = "npx",
    args = { "-y", "skillforge-mcp-server" },
  }
end

-- Helper for CodeCompanion.nvim MCP tool configuration
function M.codecompanion_config()
  return {
    callback = "strategies.chat.tools.mcp",
    description = "SkillForge library discovery and conflict detection",
    opts = {
      command = "npx",
      args = { "-y", "skillforge-mcp-server" },
    },
  }
end

return M
