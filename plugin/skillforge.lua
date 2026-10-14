-- SkillForge Neovim User Commands
-- Automatically sourced when loaded by lazy.nvim, packer, or packpath
if vim.g.loaded_skillforge then
  return
end
vim.g.loaded_skillforge = true

local skillforge = require("skillforge")

vim.api.nvim_create_user_command("SkillForgeSuggest", function(opts)
  skillforge.suggest(opts.args)
end, {
  nargs = "?",
  desc = "Suggest vetted libraries and architecture patterns matching an intent",
})

vim.api.nvim_create_user_command("SkillForgeCompare", function(opts)
  local parts = vim.split(opts.args, "%s+", { trimempty = true })
  skillforge.compare(parts[1], parts[2])
end, {
  nargs = "*",
  desc = "Compare 2 libraries side-by-side with trade-offs and conflict warnings",
})

vim.api.nvim_create_user_command("SkillForgeRules", function(opts)
  local parts = vim.split(opts.args, "%s+", { trimempty = true })
  skillforge.rules(parts[1], parts[2])
end, {
  nargs = "*",
  desc = "Generate AI skill rules (SKILL.md, .cursor/rules) for a vetted library",
})
