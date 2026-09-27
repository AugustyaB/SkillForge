import * as vscode from 'vscode';
import { TreeItemModel, buildQuickActionItems } from './tree-view-models.js';
import { toVsCodeTreeItem } from './context-tree-provider.js';

/**
 * TreeDataProvider for the "Quick Actions" sidebar view.
 * Displays high-frequency developer workflows (suggest for file, search catalog, re-scan).
 */
export class QuickActionsTreeProvider implements vscode.TreeDataProvider<TreeItemModel> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItemModel | undefined | null | void>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: TreeItemModel): vscode.TreeItem {
    return toVsCodeTreeItem(element);
  }

  public getChildren(element?: TreeItemModel): vscode.ProviderResult<TreeItemModel[]> {
    if (element) {
      return element.children || [];
    }
    return buildQuickActionItems();
  }
}
