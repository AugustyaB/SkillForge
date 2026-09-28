import * as vscode from 'vscode';
import type { BookmarkManager } from '../bookmarks/bookmark-manager.js';
import {
  TreeItemModel,
  buildBookmarksTreeItems,
} from './tree-view-models.js';
import { toVsCodeTreeItem } from './context-tree-provider.js';

/**
 * TreeDataProvider for the "Bookmarked Tools" sidebar view.
 * Displays developer-saved skills grouped by category with 1-click details and actions.
 */
export class BookmarksTreeProvider implements vscode.TreeDataProvider<TreeItemModel> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItemModel | undefined | null | void>();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private bookmarkManager: BookmarkManager) {}

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

    const bookmarks = this.bookmarkManager.getBookmarks();
    return buildBookmarksTreeItems(bookmarks);
  }
}
