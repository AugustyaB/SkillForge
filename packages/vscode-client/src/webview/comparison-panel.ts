import * as vscode from 'vscode';
import * as crypto from 'crypto';
import type { ComparisonMatrix } from '@skillforge/shared';
import type { ScopeSelection } from '../context/scope-manager.js';
import { TerminalRunner } from '../terminal/terminal-runner.js';
import { isSafeUrl } from './webview-html.js';
import { generateComparisonHtml } from './comparison-html.js';
import type { WebviewToHostMessage } from './webview-messages.js';

/**
 * Singleton manager for the SkillForge Comparison Matrix Webview Panel.
 */
export class ComparisonPanel {
  public static currentPanel: ComparisonPanel | undefined;
  public static readonly viewType = 'skillforge.comparisonMatrix';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private currentMatrix: ComparisonMatrix;
  private currentScope: ScopeSelection | undefined;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    matrix: ComparisonMatrix,
    initialScope?: ScopeSelection
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.currentMatrix = matrix;
    this.currentScope = initialScope;

    // Set panel icon
    const iconUri = vscode.Uri.joinPath(this.extensionUri, 'resources', 'icon.svg');
    this.panel.iconPath = iconUri;

    // Listen for panel disposal
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: WebviewToHostMessage) => this.handleWebviewMessage(message),
      null,
      this.disposables
    );

    this.updateHtml();
  }

  /**
   * Reveals the existing comparison panel with updated matrix or creates a new panel.
   */
  public static createOrShow(
    extensionUri: vscode.Uri,
    matrix: ComparisonMatrix,
    scope?: ScopeSelection
  ): ComparisonPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    if (ComparisonPanel.currentPanel) {
      ComparisonPanel.currentPanel.panel.reveal(column);
      ComparisonPanel.currentPanel.currentMatrix = matrix;
      if (scope) {
        ComparisonPanel.currentPanel.currentScope = scope;
      }
      ComparisonPanel.currentPanel.updateHtml();
      return ComparisonPanel.currentPanel;
    }

    const toolNames = matrix.columns.map((c) => c.name).join(' vs ');
    const panel = vscode.window.createWebviewPanel(
      ComparisonPanel.viewType,
      `Compare: ${toolNames}`,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          extensionUri,
          vscode.Uri.joinPath(extensionUri, 'resources'),
          vscode.Uri.joinPath(extensionUri, 'dist'),
        ],
      }
    );

    ComparisonPanel.currentPanel = new ComparisonPanel(
      panel,
      extensionUri,
      matrix,
      scope
    );
    return ComparisonPanel.currentPanel;
  }

  private updateHtml(): void {
    const nonce = crypto.randomBytes(16).toString('base64');
    const cspSource = this.panel.webview.cspSource;

    this.panel.webview.html = generateComparisonHtml({
      nonce,
      cspSource,
      matrix: this.currentMatrix,
      scopeLabel: this.currentScope?.label || 'Entire Workspace',
      scopePath: this.currentScope?.absolutePath,
    });
  }

  private async handleWebviewMessage(message: WebviewToHostMessage): Promise<void> {
    switch (message.type) {
      case 'runInstall': {
        const cmd = TerminalRunner.deriveInstallCommand(
          message.packageName,
          message.ecosystem
        );
        if (cmd) {
          TerminalRunner.runCommand(cmd, this.currentScope?.absolutePath);
        }
        break;
      }
      case 'copyCommand': {
        if (message.command) {
          vscode.env.clipboard.writeText(message.command);
          vscode.window.setStatusBarMessage(
            `[SkillForge] Copied to clipboard: ${message.command}`,
            2500
          );
        }
        break;
      }
      case 'openExternal': {
        if (message.url && isSafeUrl(message.url)) {
          vscode.env.openExternal(vscode.Uri.parse(message.url));
        } else {
          vscode.window.showWarningMessage('SkillForge: Blocked invalid external URL.');
        }
        break;
      }
    }
  }

  public dispose(): void {
    ComparisonPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
