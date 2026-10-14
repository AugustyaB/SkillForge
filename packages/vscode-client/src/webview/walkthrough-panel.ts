import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { generateWalkthroughHtml } from './walkthrough-html.js';

const ALLOWED_WALKTHROUGH_COMMANDS = new Set<string>([
  'skillforge.suggest',
  'skillforge.showCanvas',
  'skillforge.suggestForCurrentFile',
  'skillforge.selectScope',
  'skillforge.rescanWorkspace',
  'skillforge.compareSkills',
  'skillforge.generateAgentSkill',
  'skillforge.configureProvider',
]);

interface WalkthroughMessage {
  type: 'executeCommand';
  command: string;
}

/**
 * Dedicated Singleton Webview Panel for the SkillForge Welcome Walkthrough.
 * Ensures 100% consistent interactive onboarding across VS Code and custom IDE forks (e.g. Antigravity IDE)
 * without falling back to the generic IDE welcome screen.
 */
export class WalkthroughPanel {
  public static currentPanel: WalkthroughPanel | undefined;
  public static readonly viewType = 'skillforge.walkthroughPanel';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    const iconUri = vscode.Uri.joinPath(this.extensionUri, 'resources', 'icon.svg');
    this.panel.iconPath = iconUri;

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(
      (message: WalkthroughMessage) => this.handleMessage(message),
      null,
      this.disposables
    );

    this.updateHtml();
  }

  public static createOrShow(extensionUri: vscode.Uri): WalkthroughPanel {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    if (WalkthroughPanel.currentPanel) {
      WalkthroughPanel.currentPanel.panel.reveal(column);
      return WalkthroughPanel.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      WalkthroughPanel.viewType,
      'Welcome to SkillForge',
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

    WalkthroughPanel.currentPanel = new WalkthroughPanel(panel, extensionUri);
    return WalkthroughPanel.currentPanel;
  }

  private handleMessage(message: WalkthroughMessage): void {
    if (
      message &&
      message.type === 'executeCommand' &&
      typeof message.command === 'string' &&
      ALLOWED_WALKTHROUGH_COMMANDS.has(message.command)
    ) {
      vscode.commands.executeCommand(message.command);
    }
  }

  private updateHtml(): void {
    const nonce = crypto.randomBytes(16).toString('hex');
    this.panel.webview.html = generateWalkthroughHtml({
      nonce,
      cspSource: this.panel.webview.cspSource,
    });
  }

  public dispose(): void {
    WalkthroughPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
