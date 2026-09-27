import * as vscode from 'vscode';
import * as crypto from 'crypto';
import type { SkillSuggestionResult } from '@skillforge/shared';
import type { ScopeSelection } from '../context/scope-manager.js';
import { TerminalRunner } from '../terminal/terminal-runner.js';
import { generateWebviewHtml, isSafeUrl } from './webview-html.js';
import type { WebviewToHostMessage } from './webview-messages.js';

/**
 * Singleton manager for the SkillForge Suggestion Canvas Webview Panel.
 */
export class SuggestionPanel {
  public static currentPanel: SuggestionPanel | undefined;
  public static readonly viewType = 'skillforge.suggestionCanvas';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private currentResult: SkillSuggestionResult | undefined;
  private currentScope: ScopeSelection | undefined;
  private isLoading = false;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    initialScope?: ScopeSelection
  ) {
    this.panel = panel;
    this.extensionUri = extensionUri;
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
  }

  /**
   * Reveals the existing Suggestion Canvas or creates a new panel.
   */
  public static createOrShow(
    extensionUri: vscode.Uri,
    scope?: ScopeSelection
  ): SuggestionPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    if (SuggestionPanel.currentPanel) {
      SuggestionPanel.currentPanel.panel.reveal(column);
      if (scope) {
        SuggestionPanel.currentPanel.currentScope = scope;
      }
      return SuggestionPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      SuggestionPanel.viewType,
      'SkillForge Suggestions',
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

    SuggestionPanel.currentPanel = new SuggestionPanel(panel, extensionUri, scope);
    return SuggestionPanel.currentPanel;
  }

  /**
   * Displays the Suggestion Canvas in a loading skeleton state.
   */
  public static showLoading(
    intent: string,
    scope: ScopeSelection,
    extensionUri: vscode.Uri
  ): void {
    const panel = SuggestionPanel.createOrShow(extensionUri, scope);
    panel.isLoading = true;
    panel.currentResult = {
      skills: [],
      queryEcho: intent,
      timings: { localMs: 0, totalMs: 0 },
    };
    panel.updateHtml();
  }

  /**
   * Renders the complete Suggestion Result payload into the Suggestion Canvas.
   */
  public static showResults(
    result: SkillSuggestionResult,
    scope: ScopeSelection,
    extensionUri: vscode.Uri
  ): void {
    const panel = SuggestionPanel.createOrShow(extensionUri, scope);
    panel.isLoading = false;
    panel.currentResult = result;
    panel.currentScope = scope;
    panel.updateHtml();
  }

  private updateHtml(): void {
    const nonce = crypto.randomBytes(16).toString('base64');
    const cspSource = this.panel.webview.cspSource;

    this.panel.webview.html = generateWebviewHtml({
      nonce,
      cspSource,
      result: this.currentResult,
      scopeLabel: this.currentScope?.label || 'Entire Workspace',
      scopePath: this.currentScope?.absolutePath,
      isLoading: this.isLoading,
    });
  }

  private handleWebviewMessage(message: WebviewToHostMessage): void {
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
      case 'reQuery': {
        if (message.intent) {
          vscode.commands.executeCommand('skillforge.suggest', {
            intent: message.intent,
          });
        }
        break;
      }
    }
  }

  public dispose(): void {
    SuggestionPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
