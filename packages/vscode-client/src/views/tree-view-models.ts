export interface TreeItemModel {
  id: string;
  label: string;
  description?: string;
  tooltip?: string;
  iconId?: string; // codicon name like 'folder', 'package', 'sparkle'
  commandId?: string;
  commandArgs?: unknown[];
  contextValue?: string;
  collapsibleState?: 'none' | 'collapsed' | 'expanded';
  children?: TreeItemModel[];
}

export interface ContextViewModelParams {
  scopeLabel: string;
  scopeRelativePath: string;
  scopeAbsolutePath: string;
  isRoot: boolean;
  ecosystem?: string;
  installedPackages?: Array<{ name: string; version?: string; ecosystem?: string }>;
}

/**
 * Builds the tree model for the "Context & Stack" sidebar view.
 */
export function buildContextTreeItems(params: ContextViewModelParams): TreeItemModel[] {
  const items: TreeItemModel[] = [];

  // 1. Scope Selector Item
  const scopeDisplay = params.isRoot ? 'Entire Workspace' : params.scopeLabel;
  items.push({
    id: 'scope-selector',
    label: `Scope: ${scopeDisplay}`,
    description: '(Click to change)',
    tooltip: `Active Scope: ${params.scopeAbsolutePath || 'Entire Workspace'}\nClick to switch to a subfolder or monorepo package.`,
    iconId: params.isRoot ? 'root-folder' : 'folder',
    commandId: 'skillforge.selectScope',
    contextValue: 'scopeItem',
    collapsibleState: 'none',
  });

  // 2. Ecosystem Item
  const ecoDisplay = params.ecosystem
    ? params.ecosystem.charAt(0).toUpperCase() + params.ecosystem.slice(1)
    : 'Auto-detecting...';
  items.push({
    id: 'ecosystem-indicator',
    label: `Ecosystem: ${ecoDisplay}`,
    description: params.isRoot ? 'Multi-stack' : undefined,
    tooltip: `Detected Project Ecosystem: ${ecoDisplay}`,
    iconId: 'symbol-namespace',
    contextValue: 'ecosystemItem',
    collapsibleState: 'none',
  });

  // 3. Detected Stack Group
  const packages = params.installedPackages || [];
  if (packages.length > 0) {
    const pkgChildren: TreeItemModel[] = packages.map((pkg) => ({
      id: `pkg-${pkg.name}`,
      label: pkg.name,
      description: pkg.version || undefined,
      tooltip: `Installed dependency: ${pkg.name} ${pkg.version ? `(${pkg.version})` : ''}`,
      iconId: 'package',
      contextValue: 'packageItem',
      collapsibleState: 'none',
    }));

    items.push({
      id: 'detected-stack-group',
      label: `Detected Stack (${packages.length} tools)`,
      tooltip: 'Packages and frameworks detected from project manifests',
      iconId: 'layers',
      contextValue: 'stackGroup',
      collapsibleState: 'expanded',
      children: pkgChildren,
    });
  } else {
    items.push({
      id: 'detected-stack-empty',
      label: 'No packages detected',
      description: 'Ready to discover',
      tooltip: 'No package.json, requirements.txt, or Cargo.toml detected in current scope.',
      iconId: 'info',
      contextValue: 'stackEmpty',
      collapsibleState: 'none',
    });
  }

  return items;
}

/**
 * Builds the tree model for the "Quick Actions" sidebar view.
 */
export function buildQuickActionItems(): TreeItemModel[] {
  return [
    {
      id: 'qa-suggest-current-file',
      label: 'Suggest for Current File',
      description: 'Match open file',
      tooltip: 'Recommends libraries that match the programming language and packages of the code file you currently have open.',
      iconId: 'sparkle',
      commandId: 'skillforge.suggestForCurrentFile',
      contextValue: 'quickAction',
      collapsibleState: 'none',
    },
    {
      id: 'qa-open-suggest',
      label: 'Find Libraries for Idea',
      description: 'Search 363 tools',
      tooltip: 'Describe what you want to build in plain English and get recommended libraries with trust ratings and install buttons.',
      iconId: 'search',
      commandId: 'skillforge.suggest',
      contextValue: 'quickAction',
      collapsibleState: 'none',
    },
    {
      id: 'qa-rescan-workspace',
      label: 'Refresh Installed Packages',
      description: 'Re-scan project',
      tooltip: 'Re-reads your package.json, requirements.txt, or Cargo.toml to detect newly installed libraries.',
      iconId: 'refresh',
      commandId: 'skillforge.rescanWorkspace',
      contextValue: 'quickAction',
      collapsibleState: 'none',
    },
  ];
}

/**
 * Builds the tree model for the "All SkillForge Commands" sidebar view.
 * Exposes every SkillForge command with beginner-friendly 4-word titles for 1-click execution.
 */
export function buildAllCommandsItems(): TreeItemModel[] {
  return [
    {
      id: 'cmd-suggest',
      label: 'Find Libraries for Idea',
      description: 'Ctrl+Alt+S',
      tooltip: 'Describe what you want to build in plain English and get vetted library recommendations (Ctrl+Alt+S / Cmd+Alt+S).',
      iconId: 'sparkle',
      commandId: 'skillforge.suggest',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-suggest-file',
      label: 'Suggest for Current File',
      description: 'Ctrl+Alt+F',
      tooltip: 'Recommends libraries tailored to the programming language of the file you currently have open (Ctrl+Alt+F / Cmd+Alt+F).',
      iconId: 'file-code',
      commandId: 'skillforge.suggestForCurrentFile',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-show-canvas',
      label: 'Open Results Dashboard',
      description: 'Visual view',
      tooltip: 'Opens the visual SkillForge dashboard showing your recommended libraries, trust badges, and install buttons.',
      iconId: 'layout',
      commandId: 'skillforge.showCanvas',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-compare-skills',
      label: 'Compare Libraries Side-by-Side',
      description: 'Compare 2–3 tools',
      tooltip: 'Compare 2 or 3 competing libraries (like React vs Vue or FastAPI vs Django) side-by-side in a table.',
      iconId: 'split-horizontal',
      commandId: 'skillforge.compareSkills',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-generate-agent-skill',
      label: 'Create AI Rules File',
      description: 'Guide AI on a library',
      tooltip: 'Creates a markdown rules file (SKILL.md, .mdc, or AGENTS.md) in your project that teaches your AI assistant how to write code with a library.',
      iconId: 'hubot',
      commandId: 'skillforge.generateAgentSkill',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-select-scope',
      label: 'Choose Project Folder Scope',
      description: 'Target folder',
      tooltip: 'Pick which project folder or sub-package SkillForge should scan and install libraries into.',
      iconId: 'folder',
      commandId: 'skillforge.selectScope',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-rescan-workspace',
      label: 'Refresh Installed Packages',
      description: 'Re-scan project',
      tooltip: 'Re-reads your project manifest files (package.json, requirements.txt, Cargo.toml) to detect newly installed libraries.',
      iconId: 'refresh',
      commandId: 'skillforge.rescanWorkspace',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-configure-provider',
      label: 'Switch Search Engine Mode',
      description: 'Offline DB vs Cloud AI',
      tooltip: 'Choose whether SkillForge searches 100% offline on your computer (free, default) or uses Cloud AI (Gemini / OpenAI) with your own API key.',
      iconId: 'settings-gear',
      commandId: 'skillforge.configureProvider',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-set-api-key',
      label: 'Save AI API Key',
      description: 'Optional (Gemini / OpenAI)',
      tooltip: 'Optionally save your personal Google Gemini or OpenAI API key in your computer\'s secure keychain if you want AI-enhanced search.',
      iconId: 'key',
      commandId: 'skillforge.setApiKey',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-clear-api-key',
      label: 'Remove Saved API Key',
      description: 'Delete from keychain',
      tooltip: 'Deletes a previously saved Google Gemini or OpenAI API key from your computer\'s keychain.',
      iconId: 'trash',
      commandId: 'skillforge.clearApiKey',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-toggle-bookmark',
      label: 'Manage Saved Bookmarks',
      description: 'View or remove',
      tooltip: 'View your bookmarked libraries or remove a saved library from your list.',
      iconId: 'bookmark',
      commandId: 'skillforge.toggleBookmark',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-clear-bookmarks',
      label: 'Clear All Bookmarks',
      description: 'Reset saved list',
      tooltip: 'Removes all libraries from your Bookmarked Tools list.',
      iconId: 'clear-all',
      commandId: 'skillforge.clearBookmarks',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-clear-recent',
      label: 'Clear Search History',
      description: 'Reset recent list',
      tooltip: 'Clears your list of recent library searches in the sidebar.',
      iconId: 'history',
      commandId: 'skillforge.clearRecentQueries',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-run-install',
      label: 'Install Package in Terminal',
      description: 'npm / pip / cargo',
      tooltip: 'Run a library installation command (like "npm install zod" or "pip install fastapi") directly inside your project terminal.',
      iconId: 'terminal',
      commandId: 'skillforge.runInstallCommand',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-open-walkthrough',
      label: 'Open Beginner Guide',
      description: '5-step walkthrough',
      tooltip: 'Opens the interactive 5-step getting-started guide for SkillForge.',
      iconId: 'mortar-board',
      commandId: 'skillforge.openWalkthrough',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
    {
      id: 'cmd-test-connection',
      label: 'Check Offline Engine Status',
      description: 'Local health check',
      tooltip: 'Verifies that SkillForge\'s built-in offline library search engine is running on your computer (no internet required).',
      iconId: 'pulse',
      commandId: 'skillforge.testConnection',
      contextValue: 'commandItem',
      collapsibleState: 'none',
    },
  ];
}

export interface RecentQueryEntry {
  intent: string;
  timestamp: number;
  resultCount?: number;
}

/**
 * Builds the tree model for the "Recent Discoveries" sidebar view.
 */
export function buildRecentQueriesItems(queries: RecentQueryEntry[]): TreeItemModel[] {
  if (!queries || queries.length === 0) {
    return [
      {
        id: 'recent-empty',
        label: 'No recent discoveries yet',
        description: 'Try a query above',
        tooltip: 'Past skill queries will appear here for fast one-click replay',
        iconId: 'history',
        contextValue: 'recentEmpty',
        collapsibleState: 'none',
      },
    ];
  }

  return queries.slice(0, 10).map((q, idx) => ({
    id: `recent-${idx}-${q.intent}`,
    label: q.intent,
    description: q.resultCount !== undefined ? `${q.resultCount} tools` : undefined,
    tooltip: `Query: "${q.intent}"\nClick to re-run suggestion`,
    iconId: 'history',
    commandId: 'skillforge.suggest',
    commandArgs: [{ intent: q.intent }],
    contextValue: 'recentQueryItem',
    collapsibleState: 'none',
  }));
}

import type { SkillBookmark } from '@skillforge/shared';

export function formatCategoryName(cat: string): string {
  if (!cat) return 'Other';
  return cat
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Builds the tree model for the "Bookmarked Tools" sidebar view.
 */
export function buildBookmarksTreeItems(bookmarks: SkillBookmark[]): TreeItemModel[] {
  if (!bookmarks || bookmarks.length === 0) {
    return [
      {
        id: 'bookmarks-empty',
        label: 'No bookmarked tools yet',
        description: 'Star tools to save',
        tooltip: 'Star skills in the Suggestion Canvas to save them here for quick access',
        iconId: 'bookmark',
        contextValue: 'bookmarkEmpty',
        collapsibleState: 'none',
      },
    ];
  }

  // Group by category
  const groups = new Map<string, SkillBookmark[]>();
  for (const b of bookmarks) {
    const cat = b.category || 'other';
    const list = groups.get(cat) || [];
    list.push(b);
    groups.set(cat, list);
  }

  const items: TreeItemModel[] = [];
  for (const [cat, list] of groups.entries()) {
    const children: TreeItemModel[] = list.map((b) => ({
      id: `bookmark-${b.id}`,
      label: b.name,
      description: b.ecosystem,
      tooltip: `${b.name} (${formatCategoryName(b.category)})\n${b.whyUseIt}${b.notes ? `\n\nNotes: ${b.notes}` : ''}`,
      iconId: 'bookmark',
      commandId: 'skillforge.suggest',
      commandArgs: [{ intent: b.name }],
      contextValue: 'bookmarkItem',
      collapsibleState: 'none',
    }));

    items.push({
      id: `bookmark-cat-${cat}`,
      label: `${formatCategoryName(cat)} (${list.length})`,
      tooltip: `${formatCategoryName(cat)}: ${list.length} saved tool${list.length === 1 ? '' : 's'}`,
      iconId: 'symbol-folder',
      contextValue: 'bookmarkCategory',
      collapsibleState: 'expanded',
      children,
    });
  }

  return items;
}
