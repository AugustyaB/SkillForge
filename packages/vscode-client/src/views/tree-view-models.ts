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
      description: 'Context-aware',
      tooltip: 'Discover libraries that match your active editor file language and imports',
      iconId: 'sparkle',
      commandId: 'skillforge.suggestForCurrentFile',
      contextValue: 'quickAction',
      collapsibleState: 'none',
    },
    {
      id: 'qa-open-suggest',
      label: 'Search 118 Skills & Libraries',
      description: 'Command Palette',
      tooltip: 'Describe what you want to build and get recommended tools with trust ratings',
      iconId: 'search',
      commandId: 'skillforge.suggest',
      contextValue: 'quickAction',
      collapsibleState: 'none',
    },
    {
      id: 'qa-rescan-workspace',
      label: 'Re-scan Project Stack',
      description: 'Refresh',
      tooltip: 'Re-scan manifests in the current scope for newly installed packages',
      iconId: 'refresh',
      commandId: 'skillforge.rescanWorkspace',
      contextValue: 'quickAction',
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
