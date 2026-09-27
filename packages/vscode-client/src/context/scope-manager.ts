import * as vscode from 'vscode';
import * as path from 'path';
import type { WorkspaceContext, DetectedPackage } from '@skillforge/shared';
import {
  findCandidateScopes,
  resolveScopePath,
  normalizePath,
  detectManifestInDir,
  readInstalledPackagesFromScope,
  type InstalledPackageInfo,
} from './scope-utils.js';

export interface ScopeSelection {
  label: string;
  relativePath: string;
  absolutePath: string;
  isRoot: boolean;
  ecosystem?: string;
}

const STORAGE_KEY_SCOPE = 'skillforge.activeScope';

export class ScopeManager {
  private _onDidChangeScope = new vscode.EventEmitter<ScopeSelection>();
  public readonly onDidChangeScope = this._onDidChangeScope.event;

  private currentScope: ScopeSelection;

  constructor(private context: vscode.ExtensionContext) {
    this.currentScope = this.restoreScope();
  }

  public get activeScope(): ScopeSelection {
    return this.currentScope;
  }

  public get workspaceRoot(): string {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return '';
    }
    return normalizePath(folders[0]!.uri.fsPath);
  }

  private restoreScope(): ScopeSelection {
    const root = this.workspaceRoot;
    if (!root) {
      return {
        label: 'No Workspace Open',
        relativePath: '',
        absolutePath: '',
        isRoot: true,
      };
    }

    const savedRelative = this.context.workspaceState.get<string>(STORAGE_KEY_SCOPE);
    const resolved = resolveScopePath(root, savedRelative);

    const manifestInfo = detectManifestInDir(resolved.absolutePath);

    return {
      label: resolved.isRoot ? 'Entire Workspace' : path.basename(resolved.absolutePath),
      relativePath: resolved.isRoot ? '' : (savedRelative || ''),
      absolutePath: resolved.absolutePath,
      isRoot: resolved.isRoot,
      ecosystem: manifestInfo?.ecosystem,
    };
  }

  /**
   * Prompts the developer with an interactive QuickPick to select their active scope.
   */
  public async promptScopeSelection(): Promise<ScopeSelection | undefined> {
    const root = this.workspaceRoot;
    if (!root) {
      vscode.window.showWarningMessage('SkillForge: Please open a workspace folder first.');
      return undefined;
    }

    const candidates = findCandidateScopes(root);

    interface ScopeQuickPickItem extends vscode.QuickPickItem {
      scopeRelative: string;
      isRoot: boolean;
    }

    const items: ScopeQuickPickItem[] = [
      {
        label: '$(root-folder) Entire Workspace',
        description: 'Scan dependencies across all workspace folders',
        detail: root,
        scopeRelative: '',
        isRoot: true,
      },
    ];

    for (const c of candidates) {
      items.push({
        label: `$(folder) ${c.relativePath}`,
        description: `Ecosystem: ${c.ecosystem} (${c.manifestFile})`,
        detail: c.absolutePath,
        scopeRelative: c.relativePath,
        isRoot: false,
      });
    }

    items.push({
      label: '$(folder-opened) Browse custom folder...',
      description: 'Select any subfolder in this project',
      scopeRelative: '__browse__',
      isRoot: false,
    });

    const selected = await vscode.window.showQuickPick(items, {
      title: 'SkillForge: Select Active Context Scope',
      placeHolder: 'Select a project subfolder or entire workspace...',
    });

    if (!selected) {
      return undefined;
    }

    if (selected.scopeRelative === '__browse__') {
      const uris = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri: vscode.Uri.file(root),
        openLabel: 'Select Scope',
      });
      if (!uris || uris.length === 0) {
        return undefined;
      }
      const chosenPath = normalizePath(uris[0]!.fsPath);
      const relative = normalizePath(path.relative(root, chosenPath));
      return await this.setScope(relative);
    }

    return await this.setScope(selected.scopeRelative);
  }

  public async setScope(relativePath: string): Promise<ScopeSelection> {
    const root = this.workspaceRoot;
    const resolved = resolveScopePath(root, relativePath);
    const manifestInfo = detectManifestInDir(resolved.absolutePath);

    this.currentScope = {
      label: resolved.isRoot ? 'Entire Workspace' : path.basename(resolved.absolutePath),
      relativePath: resolved.isRoot ? '' : relativePath,
      absolutePath: resolved.absolutePath,
      isRoot: resolved.isRoot,
      ecosystem: manifestInfo?.ecosystem,
    };

    await this.context.workspaceState.update(
      STORAGE_KEY_SCOPE,
      this.currentScope.relativePath
    );

    this._onDidChangeScope.fire(this.currentScope);
    return this.currentScope;
  }

  /**
   * Reads dependencies and packages detected in the active scope.
   */
  public getInstalledPackages(): InstalledPackageInfo[] {
    if (!this.currentScope.absolutePath) {
      return [];
    }
    return readInstalledPackagesFromScope(this.currentScope.absolutePath);
  }

  /**
   * Generates a partial WorkspaceContext payload reflecting the active scope and editor state.
   */
  public buildWorkspaceContext(
    alreadyInstalled?: string[]
  ): WorkspaceContext {
    const activeEditor = vscode.window.activeTextEditor;
    const activeSignals: WorkspaceContext['activeFileSignals'] = [];

    if (activeEditor) {
      const lang = activeEditor.document.languageId;
      activeSignals.push({
        language: lang,
        filePath: normalizePath(activeEditor.document.uri.fsPath),
        imports: [],
      });
    }

    const scopePaths = this.currentScope.absolutePath
      ? [this.currentScope.absolutePath]
      : [];

    const pkgs = this.getInstalledPackages();
    const detectedStack: DetectedPackage[] = pkgs.map((p) => ({
      name: p.name,
      version: p.version,
      ecosystem: p.ecosystem || this.currentScope.ecosystem || 'multi',
      sourceFile: p.sourceFile || 'package.json',
    }));

    const installed =
      alreadyInstalled !== undefined
        ? alreadyInstalled
        : detectedStack.map((p) => p.name);

    return {
      scope: {
        mode: this.currentScope.isRoot ? 'auto' : 'folder',
        paths: scopePaths,
        label: this.currentScope.label,
      },
      ecosystem: this.currentScope.ecosystem || 'multi',
      alreadyInstalled: installed,
      detectedStack,
      technologies: [],
      activeFileSignals: activeSignals,
    };
  }
}

