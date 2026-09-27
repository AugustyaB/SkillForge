import * as path from 'path';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node.js';
import {
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  type PingResult,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
} from '@skillforge/shared';
import { ScopeManager } from './context/scope-manager.js';
import { SkillForgeCodeLensProvider } from './providers/codelens-provider.js';
import { TerminalRunner } from './terminal/terminal-runner.js';
import { ContextTreeProvider } from './views/context-tree-provider.js';
import { QuickActionsTreeProvider } from './views/quick-actions-tree-provider.js';
import { RecentQueriesTreeProvider } from './views/recent-queries-tree-provider.js';

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel('SkillForge Language Server');
  context.subscriptions.push(outputChannel);

  // 1. Initialize ScopeManager
  const scopeManager = new ScopeManager(context);

  // 2. Initialize Sidebar Tree Providers
  const contextTreeProvider = new ContextTreeProvider(scopeManager);
  const quickActionsTreeProvider = new QuickActionsTreeProvider();
  const recentQueriesTreeProvider = new RecentQueriesTreeProvider(context);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('skillforge.contextView', contextTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.quickActionsView', quickActionsTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.recentQueriesView', recentQueriesTreeProvider)
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

      try {
        const workspaceCtx = scopeManager.buildWorkspaceContext();
        const params: SkillSuggestionParams = {
          intent: cleanIntent,
          context: workspaceCtx,
        };

        const result = await client.sendRequest<SkillSuggestionResult>(
          SKILLFORGE_SUGGEST_METHOD,
          params
        );

        const count = result.skills.length;
        await recentQueriesTreeProvider.addQuery(cleanIntent, count);

        if (count === 0) {
          vscode.window.showInformationMessage(
            `SkillForge found 0 skills for "${cleanIntent}" (${result.timings.localMs}ms)`
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
