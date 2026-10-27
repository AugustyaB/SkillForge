import * as vscode from 'vscode';
import * as crypto from 'crypto';
import type { ComparisonMatrix, SkillSuggestionResult } from '@skillforge/shared';
import type { ScopeSelection } from '../context/scope-manager.js';
import { TerminalRunner } from '../terminal/terminal-runner.js';
import { generateWebviewHtml, isSafeUrl } from './webview-html.js';
import type { WebviewToHostMessage } from './webview-messages.js';
import type { FeedbackManager } from '../feedback/feedback-manager.js';
import type { BookmarkManager } from '../bookmarks/bookmark-manager.js';
import type { BookmarksTreeProvider } from '../views/bookmarks-tree-provider.js';
import { ComparisonPanel } from './comparison-panel.js';

/**
 * Singleton manager for the SkillForge Suggestion Canvas Webview Panel.
 */
export class SuggestionPanel {
  public static currentPanel: SuggestionPanel | undefined;
  public static readonly viewType = 'skillforge.suggestionCanvas';
  private static feedbackManager: FeedbackManager | undefined;
  private static bookmarkManager: BookmarkManager | undefined;
  private static bookmarksTreeProvider: BookmarksTreeProvider | undefined;
  private static compareHandler?: (skillIds: string[]) => Promise<ComparisonMatrix | undefined>;

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  private currentResult: SkillSuggestionResult | undefined;
  private currentScope: ScopeSelection | undefined;
  private isLoading = false;
  private showFeedbackPrompt = false;

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
   * Sets the global FeedbackManager instance.
   */
  public static setFeedbackManager(manager: FeedbackManager): void {
    SuggestionPanel.feedbackManager = manager;
  }

  /**
   * Sets the global BookmarkManager and optional TreeDataProvider instance.
   */
  public static setBookmarkManager(
    manager: BookmarkManager,
    treeProvider?: BookmarksTreeProvider
  ): void {
    SuggestionPanel.bookmarkManager = manager;
    SuggestionPanel.bookmarksTreeProvider = treeProvider;
  }

  /**
   * Sets the comparison request handler.
   */
  public static setCompareHandler(
    handler: (skillIds: string[]) => Promise<ComparisonMatrix | undefined>
  ): void {
    SuggestionPanel.compareHandler = handler;
  }

  /**
   * Renders the complete Suggestion Result payload into the Suggestion Canvas.
   */
  public static showResults(
    result: SkillSuggestionResult,
    scope: ScopeSelection,
    extensionUri: vscode.Uri,
    showFeedbackPrompt?: boolean
  ): void {
    const panel = SuggestionPanel.createOrShow(extensionUri, scope);
    panel.isLoading = false;
    panel.currentResult = result;
    panel.currentScope = scope;

    if (showFeedbackPrompt !== undefined) {
      panel.showFeedbackPrompt = showFeedbackPrompt;
    } else if (SuggestionPanel.feedbackManager) {
      panel.showFeedbackPrompt = SuggestionPanel.feedbackManager.shouldShowFeedback(
        Boolean(result.fallbackUsed)
      );
    } else {
      panel.showFeedbackPrompt = false;
    }

    panel.updateHtml();
  }

  private updateHtml(): void {
    const nonce = crypto.randomBytes(16).toString('base64');
    const cspSource = this.panel.webview.cspSource;

    const bookmarkedSet = new Set(
      SuggestionPanel.bookmarkManager?.getBookmarks().map((b) => b.id.toLowerCase()) || []
    );

    const extensionVersion =
      vscode.extensions.getExtension('skillforge.skillforge')?.packageJSON?.version || '0.1.2';

    this.panel.webview.html = generateWebviewHtml({
      nonce,
      cspSource,
      result: this.currentResult,
      scopeLabel: this.currentScope?.label || 'Entire Workspace',
      scopePath: this.currentScope?.absolutePath,
      isLoading: this.isLoading,
      showFeedbackPrompt: this.showFeedbackPrompt,
      bookmarkedSkillIds: bookmarkedSet,
      extensionVersion,
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
      case 'reQuery': {
        if (message.intent) {
          vscode.commands.executeCommand('skillforge.suggest', {
            intent: message.intent,
          });
        }
        break;
      }
      case 'submitFeedback': {
        this.showFeedbackPrompt = false;
        if (SuggestionPanel.feedbackManager) {
          await SuggestionPanel.feedbackManager.recordFeedback({
            query: message.query,
            skillId: message.skillId,
            rating: message.rating,
            reason: message.reason as any,
            details: message.details,
            timestamp: Date.now(),
          });
        }
        break;
      }
      case 'requestSkill': {
        const skillName = await vscode.window.showInputBox({
          title: 'SkillForge: Suggest a Library for the Offline Catalog',
          prompt: 'Enter the name of the package or tool you would like added:',
          placeHolder: 'e.g. effect-ts, hono, kysely, polars',
          value: message.prefillName || '',
        });

        if (skillName && skillName.trim()) {
          const reason = await vscode.window.showInputBox({
            title: 'SkillForge: Suggest a Library for the Offline Catalog',
            prompt: 'Why should this tool be added to the offline catalog? (optional):',
            placeHolder: 'e.g. Modern lightweight alternative, widely adopted',
          });

          if (SuggestionPanel.feedbackManager) {
            await SuggestionPanel.feedbackManager.recordSkillRequest({
              skillName: skillName.trim(),
              reason: reason?.trim(),
              timestamp: Date.now(),
            });

            const issueUrl = SuggestionPanel.feedbackManager.generateSkillRequestIssueUrl(
              skillName.trim(),
              reason?.trim()
            );

            const choice = await vscode.window.showInformationMessage(
              `SkillForge: Skill request for "${skillName.trim()}" saved locally! Would you also like to open a GitHub issue?`,
              'Open GitHub Issue',
              'Done'
            );

            if (choice === 'Open GitHub Issue') {
              vscode.env.openExternal(vscode.Uri.parse(issueUrl));
            }
          }
        }
        break;
      }
      case 'toggleBookmark': {
        if (SuggestionPanel.bookmarkManager) {
          const found = this.currentResult?.skills.find(
            (s) => s.id.toLowerCase() === message.skillId.toLowerCase()
          );

          const skillToBookmark = found || {
            id: message.skillId,
            name: message.skillName,
            ecosystem: message.ecosystem || 'javascript',
            category: (message.category as any) || 'other',
            difficulty: 'beginner' as const,
            description: `Saved tool bookmark for ${message.skillName}`,
            whyUseIt: `Saved tool bookmark`,
            officialUrl: 'https://github.com',
            tags: [],
            stackIndicators: [message.skillId],
            alternatives: [],
            worksWellWith: [],
            prerequisites: [],
            learnResources: [{ label: 'Docs', url: 'https://github.com', type: 'docs' as const }],
          };

          const wasAdded = await SuggestionPanel.bookmarkManager.toggleBookmark(skillToBookmark);
          SuggestionPanel.bookmarksTreeProvider?.refresh();
          this.updateHtml();

          vscode.window.setStatusBarMessage(
            `[SkillForge] ${wasAdded ? '★ Bookmarked' : '☆ Removed bookmark for'} ${message.skillName}`,
            3000
          );
        }
        break;
      }
      case 'compareSkills': {
        if (SuggestionPanel.compareHandler) {
          try {
            const matrix = await SuggestionPanel.compareHandler(message.skillIds);
            if (matrix) {
              ComparisonPanel.createOrShow(
                this.extensionUri,
                matrix,
                this.currentScope
              );
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`SkillForge compare failed: ${msg}`);
          }
        }
        break;
      }
      case 'createAgentSkill': {
        vscode.commands.executeCommand('skillforge.generateAgentSkill', {
          skillId: message.skillId,
          skillName: message.skillName,
        });
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
