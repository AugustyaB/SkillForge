import * as path from 'path';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node.js';
import {
  SKILLFORGE_COMPARE_METHOD,
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  type CompareResult,
  type ComparisonMatrix,
  type PingResult,
  type ProviderConfig,
  type ProviderType,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
} from '@skillforge/shared';
import { ScopeManager } from './context/scope-manager.js';
import { SkillForgeCodeLensProvider } from './providers/codelens-provider.js';
import { TerminalRunner } from './terminal/terminal-runner.js';
import { ContextTreeProvider } from './views/context-tree-provider.js';
import { QuickActionsTreeProvider } from './views/quick-actions-tree-provider.js';
import { RecentQueriesTreeProvider } from './views/recent-queries-tree-provider.js';
import { BookmarksTreeProvider } from './views/bookmarks-tree-provider.js';
import { BookmarkManager } from './bookmarks/bookmark-manager.js';
import { FeedbackManager } from './feedback/feedback-manager.js';
import { SecretManager } from './secrets/secret-manager.js';
import { SuggestionPanel } from './webview/suggestion-panel.js';
import { ComparisonPanel } from './webview/comparison-panel.js';

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel('SkillForge Language Server');
  context.subscriptions.push(outputChannel);

  // 1. Initialize ScopeManager, FeedbackManager, SecretManager, and BookmarkManager
  const scopeManager = new ScopeManager(context);
  const feedbackManager = new FeedbackManager(context.globalState);
  const secretManager = new SecretManager(context.secrets);
  const bookmarkManager = new BookmarkManager(context.globalState);
  SuggestionPanel.setFeedbackManager(feedbackManager);

  // 2. Initialize Sidebar Tree Providers
  const contextTreeProvider = new ContextTreeProvider(scopeManager);
  const quickActionsTreeProvider = new QuickActionsTreeProvider();
  const recentQueriesTreeProvider = new RecentQueriesTreeProvider(context);
  const bookmarksTreeProvider = new BookmarksTreeProvider(bookmarkManager);
  SuggestionPanel.setBookmarkManager(bookmarkManager, bookmarksTreeProvider);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('skillforge.contextView', contextTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.quickActionsView', quickActionsTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.recentQueriesView', recentQueriesTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.bookmarksView', bookmarksTreeProvider)
  );

  // 3. Initialize CodeLens Provider
  const codeLensProvider = new SkillForgeCodeLensProvider();
  context.subscriptions.push(codeLensProvider);

  const supportedLanguages = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'python',
    'rust',
    'go',
    'java',
    'c',
    'cpp',
    'csharp',
  ];

  for (const lang of supportedLanguages) {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider({ language: lang, scheme: 'file' }, codeLensProvider)
    );
  }

  // 4. Resolve Server Module
  let serverModule = context.asAbsolutePath(path.join('..', 'server', 'dist', 'index.js'));
  try {
    const fs = await import('fs');
    if (!fs.existsSync(serverModule)) {
      serverModule = context.asAbsolutePath(path.join('dist', 'server.js'));
    }
  } catch {
    // Ignore and proceed with standard path
  }

  outputChannel.appendLine(`[SkillForge Client] Server module resolved to: ${serverModule}`);

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.stdio },
    debug: {
      module: serverModule,
      transport: TransportKind.stdio,
      options: { execArgv: ['--nolazy', '--inspect=6009'] },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file' }],
    synchronize: {
      configurationSection: 'skillforge',
    },
    outputChannel,
  };

  client = new LanguageClient(
    'skillforgeServer',
    'SkillForge Language Server',
    serverOptions,
    clientOptions
  );

  context.subscriptions.push({
    dispose: () => {
      if (client?.isRunning()) {
        client.stop();
      }
    },
  });

  // Start client connection
  await client.start();
  outputChannel.appendLine('[SkillForge Client] Connected to SkillForge LSP server.');

  // Command: Test Server Connection
  const testConnCmd = vscode.commands.registerCommand('skillforge.testConnection', async () => {
    if (!client || !client.isRunning()) {
      vscode.window.showErrorMessage('SkillForge LSP server is not running.');
      return;
    }

    try {
      const ping = await client.sendRequest<PingResult>(SKILLFORGE_PING_METHOD);
      vscode.window.showInformationMessage(
        `SkillForge LSP Server Connected! Version: ${ping.version} (Status: ${ping.status})`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`SkillForge ping failed: ${msg}`);
    }
  });
  context.subscriptions.push(testConnCmd);

  // Command: Select Active Context Scope
  const selectScopeCmd = vscode.commands.registerCommand('skillforge.selectScope', async () => {
    const selected = await scopeManager.promptScopeSelection();
    if (selected) {
      vscode.window.showInformationMessage(`SkillForge: Scope set to "${selected.label}"`);
    }
  });
  context.subscriptions.push(selectScopeCmd);

  // Command: Rescan Workspace Stack
  const rescanCmd = vscode.commands.registerCommand('skillforge.rescanWorkspace', () => {
    contextTreeProvider.refresh();
    vscode.window.showInformationMessage('SkillForge: Project stack re-scanned.');
  });
  context.subscriptions.push(rescanCmd);

  // Command: Clear Recent Discoveries History
  const clearRecentCmd = vscode.commands.registerCommand('skillforge.clearRecentQueries', async () => {
    await recentQueriesTreeProvider.clearHistory();
    vscode.window.showInformationMessage('SkillForge: Recent discoveries cleared.');
  });
  context.subscriptions.push(clearRecentCmd);

  // Command: Run Install Command in Terminal
  const runInstallCmd = vscode.commands.registerCommand('skillforge.runInstallCommand', (cmd?: string) => {
    if (cmd && typeof cmd === 'string') {
      TerminalRunner.runCommand(cmd, scopeManager.activeScope.absolutePath);
    } else {
      vscode.window
        .showInputBox({
          title: 'SkillForge: Run Command',
          prompt: 'Enter shell command to execute in SkillForge terminal',
        })
        .then((input) => {
          if (input) {
            TerminalRunner.runCommand(input, scopeManager.activeScope.absolutePath);
          }
        });
    }
  });
  context.subscriptions.push(runInstallCmd);

  // Command: Suggest for Active Editor File
  const suggestForFileCmd = vscode.commands.registerCommand(
    'skillforge.suggestForCurrentFile',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      let promptPrefill = '';
      if (activeEditor) {
        const baseName = path.basename(activeEditor.document.uri.fsPath);
        promptPrefill = `Tools and libraries for ${baseName}`;
      }
      await vscode.commands.executeCommand('skillforge.suggest', {
        intent: promptPrefill,
        promptUser: true,
      });
    }
  );
  context.subscriptions.push(suggestForFileCmd);

  // Command: Open Suggestion Canvas
  const showCanvasCmd = vscode.commands.registerCommand('skillforge.showCanvas', () => {
    SuggestionPanel.createOrShow(context.extensionUri, scopeManager.activeScope);
  });
  context.subscriptions.push(showCanvasCmd);

  // Command: Set BYOK API Key
  const setApiKeyCmd = vscode.commands.registerCommand('skillforge.setApiKey', async (targetProvider?: ProviderType) => {
    let provider = targetProvider;
    if (!provider || provider === 'local' || provider === 'hybrid') {
      const pick = await vscode.window.showQuickPick(
        [
          { label: 'OpenAI', value: 'openai' as ProviderType, description: 'Requires OpenAI API key (gpt-4o-mini)' },
          { label: 'Google Gemini', value: 'gemini' as ProviderType, description: 'Requires Google AI Studio API key (gemini-1.5-flash)' },
        ],
        { placeHolder: 'Select provider to store API key for:' }
      );
      if (!pick) return;
      provider = pick.value;
    }

    const key = await vscode.window.showInputBox({
      title: `SkillForge: Set ${provider.toUpperCase()} API Key`,
      prompt: `Enter your ${provider} API key (stored securely in your OS keychain):`,
      password: true,
      ignoreFocusOut: true,
      placeHolder: provider === 'openai' ? 'sk-...' : 'AIzaSy...',
    });

    if (key && key.trim()) {
      await secretManager.storeApiKey(provider, key);
      vscode.window.showInformationMessage(
        `SkillForge: API key for ${provider} securely saved in OS keychain.`
      );
    }
  });
  context.subscriptions.push(setApiKeyCmd);

  // Command: Clear Stored API Key
  const clearApiKeyCmd = vscode.commands.registerCommand('skillforge.clearApiKey', async () => {
    const pick = await vscode.window.showQuickPick(
      [
        { label: 'OpenAI', value: 'openai' as ProviderType },
        { label: 'Google Gemini', value: 'gemini' as ProviderType },
      ],
      { placeHolder: 'Select API key to remove from OS keychain:' }
    );
    if (pick) {
      await secretManager.deleteApiKey(pick.value);
      vscode.window.showInformationMessage(
        `SkillForge: Stored API key for ${pick.value} removed.`
      );
    }
  });
  context.subscriptions.push(clearApiKeyCmd);

  // Command: Choose Suggestion Provider
  const configureProviderCmd = vscode.commands.registerCommand('skillforge.configureProvider', async () => {
    const pick = await vscode.window.showQuickPick(
      [
        {
          label: '$(shield) 100% Offline & Private (Default)',
          value: 'local' as ProviderType,
          description: 'Zero code leaves machine. Curated offline database.',
        },
        {
          label: '$(sparkle) OpenAI (BYOK)',
          value: 'openai' as ProviderType,
          description: 'Uses gpt-4o-mini with your API key. Only prompt sent; no code files.',
        },
        {
          label: '$(sparkle) Google Gemini (BYOK)',
          value: 'gemini' as ProviderType,
          description: 'Uses Gemini with your API key. Only prompt sent; no code files.',
        },
      ],
      { placeHolder: 'Select SkillForge Suggestion Provider:' }
    );

    if (pick) {
      await vscode.workspace.getConfiguration('skillforge').update('provider', pick.value, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`SkillForge: Provider set to "${pick.value}".`);
    }
  });
  context.subscriptions.push(configureProviderCmd);

  // Helper: Run side-by-side comparison via LSP server
  const runComparison = async (skillIds: string[]): Promise<ComparisonMatrix | undefined> => {
    if (!client || !client.isRunning()) {
      vscode.window.showErrorMessage('SkillForge LSP server is not running.');
      return undefined;
    }
    const result = await client.sendRequest<CompareResult>(SKILLFORGE_COMPARE_METHOD, {
      skillIds,
    });
    return result.matrix;
  };
  SuggestionPanel.setCompareHandler(runComparison);

  // Command: Toggle Skill Bookmark
  const toggleBookmarkCmd = vscode.commands.registerCommand(
    'skillforge.toggleBookmark',
    async (arg?: any) => {
      let skill = arg?.skill || arg;
      if (!skill || !skill.id) {
        const bookmarks = bookmarkManager.getBookmarks();
        if (bookmarks.length === 0) {
          vscode.window.showInformationMessage('SkillForge: No bookmarks saved yet.');
          return;
        }
        const pick = await vscode.window.showQuickPick(
          bookmarks.map((b) => ({
            label: b.name,
            description: `[${b.ecosystem}] ${b.category}`,
            skill: b,
          })),
          { placeHolder: 'Select bookmark to toggle/remove:' }
        );
        if (!pick) return;
        skill = pick.skill;
      }

      const wasAdded = await bookmarkManager.toggleBookmark(skill);
      bookmarksTreeProvider.refresh();
      vscode.window.setStatusBarMessage(
        `[SkillForge] ${wasAdded ? '★ Bookmarked' : '☆ Removed bookmark for'} ${skill.name || skill.id}`,
        3000
      );
    }
  );
  context.subscriptions.push(toggleBookmarkCmd);

  // Command: Clear All Bookmarks
  const clearBookmarksCmd = vscode.commands.registerCommand(
    'skillforge.clearBookmarks',
    async () => {
      const count = bookmarkManager.getBookmarks().length;
      if (count === 0) {
        vscode.window.showInformationMessage('SkillForge: No bookmarks to clear.');
        return;
      }
      const choice = await vscode.window.showWarningMessage(
        `Clear all ${count} saved bookmarks?`,
        { modal: true },
        'Clear All Bookmarks'
      );
      if (choice === 'Clear All Bookmarks') {
        await bookmarkManager.clearBookmarks();
        bookmarksTreeProvider.refresh();
        vscode.window.showInformationMessage('SkillForge: All bookmarks cleared.');
      }
    }
  );
  context.subscriptions.push(clearBookmarksCmd);

  // Command: Compare Skills Side-by-Side
  const compareSkillsCmd = vscode.commands.registerCommand(
    'skillforge.compareSkills',
    async (args?: { skillIds?: string[] } | string[]) => {
      let skillIds = Array.isArray(args) ? args : args?.skillIds;
      if (!skillIds || skillIds.length < 2) {
        const bookmarks = bookmarkManager.getBookmarks();
        if (bookmarks.length >= 2) {
          const picks = await vscode.window.showQuickPick(
            bookmarks.map((b) => ({
              label: b.name,
              description: `[${b.ecosystem}] ${b.category}`,
              detail: b.whyUseIt,
              skillId: b.id,
            })),
            {
              title: 'SkillForge: Select 2 or 3 Tools to Compare',
              canPickMany: true,
              placeHolder: 'Select 2 or 3 bookmarked tools to compare side-by-side',
            }
          );
          if (picks && picks.length >= 2 && picks.length <= 3) {
            skillIds = picks.map((p) => p.skillId);
          } else if (picks && (picks.length < 2 || picks.length > 3)) {
            vscode.window.showWarningMessage('Please select exactly 2 or 3 tools to compare.');
            return;
          }
        }

        if (!skillIds || skillIds.length < 2) {
          const input = await vscode.window.showInputBox({
            title: 'SkillForge: Compare Technologies',
            prompt: 'Enter 2 or 3 tool IDs separated by commas (e.g. "react, vue" or "fastapi, express"):',
            placeHolder: 'tool1, tool2, [tool3]',
          });
          if (input && input.trim()) {
            skillIds = input.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
      }

      if (!skillIds || skillIds.length < 2) {
        return;
      }

      if (skillIds.length > 3) {
        vscode.window.showWarningMessage('Comparison supports up to 3 tools simultaneously.');
        skillIds = skillIds.slice(0, 3);
      }

      try {
        const matrix = await runComparison(skillIds);
        if (matrix) {
          ComparisonPanel.createOrShow(
            context.extensionUri,
            matrix,
            scopeManager.activeScope
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`SkillForge: Comparison failed: ${msg}`);
      }
    }
  );
  context.subscriptions.push(compareSkillsCmd);

  // Command: Suggest Skills for My Idea (Core suggestion flow)
  const suggestCmd = vscode.commands.registerCommand(
    'skillforge.suggest',
    async (args?: { intent?: string; source?: string; promptUser?: boolean }) => {
      if (!client || !client.isRunning()) {
        vscode.window.showErrorMessage('SkillForge LSP server is not running.');
        return;
      }

      let intent = args?.intent;
      if (!intent || args?.promptUser) {
        intent = await vscode.window.showInputBox({
          title: 'SkillForge: Suggest Skills',
          prompt: 'What do you want to build? (e.g., "real-time chat app", "REST API with auth")',
          placeHolder: 'Describe your idea or feature...',
          value: intent || '',
        });
      }

      if (!intent || !intent.trim()) {
        return;
      }

      const cleanIntent = intent.trim();

      // Open Suggestion Canvas immediately in loading state
      SuggestionPanel.showLoading(
        cleanIntent,
        scopeManager.activeScope,
        context.extensionUri
      );

      try {
        const workspaceCtx = scopeManager.buildWorkspaceContext();
        const sfConfig = vscode.workspace.getConfiguration('skillforge');
        const configuredProvider = (sfConfig.get<string>('provider') || 'local') as ProviderType;
        let effectiveProvider = configuredProvider;
        let apiKey: string | undefined;

        if (configuredProvider === 'openai' || configuredProvider === 'gemini') {
          apiKey = await secretManager.getApiKey(configuredProvider);
          if (!apiKey) {
            const action = await vscode.window.showWarningMessage(
              `SkillForge: No API key found for ${configuredProvider}. Would you like to enter your API key now?`,
              'Enter API Key',
              'Run 100% Offline'
            );
            if (action === 'Enter API Key') {
              await vscode.commands.executeCommand('skillforge.setApiKey', configuredProvider);
              apiKey = await secretManager.getApiKey(configuredProvider);
            }
            if (!apiKey) {
              effectiveProvider = 'local';
            }
          }
        }

        const providerConfig: ProviderConfig = {
          provider: effectiveProvider,
          apiKey,
          model: effectiveProvider === 'openai'
            ? sfConfig.get<string>('openai.model')
            : effectiveProvider === 'gemini'
            ? sfConfig.get<string>('gemini.model')
            : undefined,
          endpoint: effectiveProvider === 'openai'
            ? sfConfig.get<string>('openai.endpoint')
            : effectiveProvider === 'gemini'
            ? sfConfig.get<string>('gemini.endpoint')
            : undefined,
          timeoutMs: sfConfig.get<number>('timeoutMs') || 4000,
        };

        const params: SkillSuggestionParams = {
          intent: cleanIntent,
          context: workspaceCtx,
          providerConfig,
        };

        const result = await client.sendRequest<SkillSuggestionResult>(
          SKILLFORGE_SUGGEST_METHOD,
          params
        );

        const count = result.skills.length;
        await recentQueriesTreeProvider.addQuery(cleanIntent, count);
        await feedbackManager.registerQuery(Boolean(result.fallbackUsed));

        // Render results into the Suggestion Canvas
        SuggestionPanel.showResults(
          result,
          scopeManager.activeScope,
          context.extensionUri
        );

        if (count === 0) {
          vscode.window.showInformationMessage(
            `SkillForge found 0 direct skills for "${cleanIntent}" (${result.timings.localMs}ms)`
          );
          return;
        }

        const topSkill = result.skills[0]!;
        const names = result.skills.map((s) => s.name).join(', ');
        const packageName = topSkill.stackIndicators?.[0] || topSkill.id;
        const installCmd = TerminalRunner.deriveInstallCommand(
          packageName,
          topSkill.ecosystem
        );

        const actionBtn = installCmd ? `Install ${packageName}` : undefined;
        const message = `SkillForge found ${count} skill${count === 1 ? '' : 's'}: ${names} (${result.timings.localMs}ms)`;

        if (actionBtn) {
          vscode.window.showInformationMessage(message, actionBtn).then((action) => {
            if (action === actionBtn) {
              TerminalRunner.runCommand(installCmd, scopeManager.activeScope.absolutePath);
            }
          });
        } else {
          vscode.window.showInformationMessage(message);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`SkillForge suggestion failed: ${msg}`);
      }
    }
  );
  context.subscriptions.push(suggestCmd);
}

export async function deactivate(): Promise<void> {
  if (client && client.isRunning()) {
    await client.stop();
  }
}
