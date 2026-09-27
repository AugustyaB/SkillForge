import * as vscode from 'vscode';
import { ScopeManager } from '../context/scope-manager.js';
import { TreeItemModel, buildContextTreeItems } from './tree-view-models.js';

/**
 * Converts a pure TreeItemModel into a concrete vscode.TreeItem.
 */
export function toVsCodeTreeItem(element: TreeItemModel): vscode.TreeItem {
  const collapsible =
    element.children && element.children.length > 0
      ? element.collapsibleState === 'collapsed'
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.Expanded
      : vscode.TreeItemCollapsibleState.None;

  const item = new vscode.TreeItem(element.label, collapsible);
  item.id = element.id;
  item.description = element.description;
  item.tooltip = element.tooltip;

  if (element.iconId) {
    item.iconPath = new vscode.ThemeIcon(element.iconId);
  }

  if (element.commandId) {
    item.command = {
      title: element.label,
      command: element.commandId,
      arguments: element.commandArgs,
    };
  }

  item.contextValue = element.contextValue;
  return item;
}

/**
 * TreeDataProvider for the "Context & Stack" sidebar view.
 * Shows active context scope, detected project ecosystem, and installed packages.
 */
export class ContextTreeProvider implements vscode.TreeDataProvider<TreeItemModel> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItemModel | undefined | null | void>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private scopeManager: ScopeManager) {
    this.scopeManager.onDidChangeScope(() => {
      this.refresh();
    });
  }

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

    const scope = this.scopeManager.activeScope;
    const installed = this.scopeManager.getInstalledPackages();

    return buildContextTreeItems({
      scopeLabel: scope.label,
      scopeRelativePath: scope.relativePath,
      scopeAbsolutePath: scope.absolutePath,
      isRoot: scope.isRoot,
      ecosystem: scope.ecosystem,
      installedPackages: installed,
    });
  }
}
