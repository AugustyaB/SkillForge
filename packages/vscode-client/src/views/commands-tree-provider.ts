import * as vscode from 'vscode';
import { TreeItemModel, buildAllCommandsItems } from './tree-view-models.js';
import { toVsCodeTreeItem } from './context-tree-provider.js';

/**
 * TreeDataProvider for the "All SkillForge Commands" sidebar view.
 * Displays all 16 SkillForge commands for 1-click execution directly from the Activity Bar sidebar.
 */
export class CommandsTreeProvider implements vscode.TreeDataProvider<TreeItemModel> {
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
    return buildAllCommandsItems();
  }
}
