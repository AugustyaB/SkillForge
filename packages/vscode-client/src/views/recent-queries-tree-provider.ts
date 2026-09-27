import * as vscode from 'vscode';
import {
  TreeItemModel,
  RecentQueryEntry,
  buildRecentQueriesItems,
} from './tree-view-models.js';
import { toVsCodeTreeItem } from './context-tree-provider.js';

export const STORAGE_KEY_RECENT_QUERIES = 'skillforge.recentQueries';

/**
 * TreeDataProvider for the "Recent Discoveries" sidebar view.
 * Persists recent developer queries in workspaceState and allows one-click replay.
 */
export class RecentQueriesTreeProvider implements vscode.TreeDataProvider<TreeItemModel> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItemModel | undefined | null | void>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public getQueries(): RecentQueryEntry[] {
    return (
      this.context.workspaceState.get<RecentQueryEntry[]>(
        STORAGE_KEY_RECENT_QUERIES
      ) || []
    );
  }

  public async addQuery(intent: string, resultCount?: number): Promise<void> {
    const clean = intent ? intent.trim() : '';
    if (!clean) return;

    let queries = this.getQueries();

    // Deduplicate existing identical intent (case-insensitive)
    queries = queries.filter(
      (q) => q.intent.toLowerCase() !== clean.toLowerCase()
    );

    // Prepend latest entry
    queries.unshift({
      intent: clean,
      timestamp: Date.now(),
      resultCount,
    });

    // Retain maximum of 15 queries to conserve memory
    queries = queries.slice(0, 15);

    await this.context.workspaceState.update(STORAGE_KEY_RECENT_QUERIES, queries);
    this.refresh();
  }

  public async clearHistory(): Promise<void> {
    await this.context.workspaceState.update(STORAGE_KEY_RECENT_QUERIES, []);
    this.refresh();
  }

  public getTreeItem(element: TreeItemModel): vscode.TreeItem {
    return toVsCodeTreeItem(element);
  }

  public getChildren(element?: TreeItemModel): vscode.ProviderResult<TreeItemModel[]> {
    if (element) {
      return element.children || [];
    }

    const queries = this.getQueries();
    return buildRecentQueriesItems(queries);
  }
}
