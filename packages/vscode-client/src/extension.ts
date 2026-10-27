import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node.js';
import {
  SKILLFORGE_COMPARE_METHOD,
  SKILLFORGE_GENERATE_AGENT_SKILL_METHOD,
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  SKILLFORGE_COMPILE_IDEA_PROMPT_METHOD,
  type AgentSkillFormat,
  type CompareResult,
  type ComparisonMatrix,
  type GenerateAgentSkillRequest,
  type GeneratedAgentSkill,
  type PingResult,
  type ProviderConfig,
  type ProviderType,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
  type CompileIdeaPromptParams,
  type CompileIdeaPromptResult,
} from '@skillforge/shared';
import { ScopeManager } from './context/scope-manager.js';
import { SkillForgeCodeLensProvider } from './providers/codelens-provider.js';
import { TerminalRunner } from './terminal/terminal-runner.js';
import { ContextTreeProvider } from './views/context-tree-provider.js';
import { QuickActionsTreeProvider } from './views/quick-actions-tree-provider.js';
import { CommandsTreeProvider } from './views/commands-tree-provider.js';
import { RecentQueriesTreeProvider } from './views/recent-queries-tree-provider.js';
import { BookmarksTreeProvider } from './views/bookmarks-tree-provider.js';
import { BookmarkManager } from './bookmarks/bookmark-manager.js';
import { FeedbackManager } from './feedback/feedback-manager.js';
import { SecretManager } from './secrets/secret-manager.js';
import { SuggestionPanel } from './webview/suggestion-panel.js';
import { ComparisonPanel } from './webview/comparison-panel.js';
import { CatalogBrowser } from './catalog/catalog-browser.js';
import { WorkspaceFileScanner, type WorkspaceSkillFile } from './context/workspace-file-scanner.js';
import { ProjectIdeationWizard } from './ideation/project-wizard.js';
import { CharterPreviewPanel } from './ideation/charter-preview-panel.js';
import { LlmBridge } from './ideation/llm-bridge.js';

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
  const commandsTreeProvider = new CommandsTreeProvider();
  const recentQueriesTreeProvider = new RecentQueriesTreeProvider(context);
  const bookmarksTreeProvider = new BookmarksTreeProvider(bookmarkManager);
  SuggestionPanel.setBookmarkManager(bookmarkManager, bookmarksTreeProvider);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('skillforge.contextView', contextTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.quickActionsView', quickActionsTreeProvider),
    vscode.window.registerTreeDataProvider('skillforge.commandsView', commandsTreeProvider),
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
  let serverModule = context.asAbsolutePath(path.join('dist', 'server.js'));
  try {
    const fs = await import('fs');
    if (!fs.existsSync(serverModule)) {
      serverModule = context.asAbsolutePath(path.join('..', 'server', 'dist', 'index.js'));
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

  // Start client connection safely
  try {
    await client.start();
    outputChannel.appendLine('[SkillForge Client] Connected to SkillForge LSP server.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    outputChannel.appendLine(`[SkillForge Client] Error starting LSP server: ${msg}`);
  }

  // Command: Check Offline Engine Status
  const testConnCmd = vscode.commands.registerCommand('skillforge.testConnection', async () => {
    if (!client || !client.isRunning()) {
      vscode.window.showErrorMessage('SkillForge local background engine is not running.');
      return;
    }

    try {
      const ping = await client.sendRequest<PingResult>(SKILLFORGE_PING_METHOD);
      vscode.window.showInformationMessage(
        `SkillForge Offline Engine is active (v${ping.version}) — 363 vetted libraries ready on your computer. No internet required.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`SkillForge local engine check failed: ${msg}`);
    }
  });
  context.subscriptions.push(testConnCmd);

  // Command: Choose Project Folder Scope
  const selectScopeCmd = vscode.commands.registerCommand('skillforge.selectScope', async () => {
    const selected = await scopeManager.promptScopeSelection();
    if (selected) {
      vscode.window.showInformationMessage(`SkillForge: Active project folder set to "${selected.label}"`);
    }
  });
  context.subscriptions.push(selectScopeCmd);

  // Command: Refresh Installed Packages
  const rescanCmd = vscode.commands.registerCommand('skillforge.rescanWorkspace', () => {
    contextTreeProvider.refresh();
    vscode.window.showInformationMessage('SkillForge: Project files re-scanned for installed packages.');
  });
  context.subscriptions.push(rescanCmd);

  // Command: Clear Search History
  const clearRecentCmd = vscode.commands.registerCommand('skillforge.clearRecentQueries', async () => {
    await recentQueriesTreeProvider.clearHistory();
    vscode.window.showInformationMessage('SkillForge: Recent library search history cleared.');
  });
  context.subscriptions.push(clearRecentCmd);

  // Command: Install Package in Terminal
  const runInstallCmd = vscode.commands.registerCommand('skillforge.runInstallCommand', (cmd?: string) => {
    if (cmd && typeof cmd === 'string') {
      TerminalRunner.runCommand(cmd, scopeManager.activeScope.absolutePath);
    } else {
      vscode.window
        .showInputBox({
          title: 'Install a Library or Package in Your Project Terminal',
          prompt: `Type the package installation command to run inside your project folder (${scopeManager.activeScope.label}):`,
          placeHolder: 'e.g., npm install zod, pnpm add tailwindcss, pip install fastapi',
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
      if (
        activeEditor &&
        (activeEditor.document.uri.scheme === 'file' || activeEditor.document.uri.scheme === 'untitled')
      ) {
        const baseName =
          activeEditor.document.uri.scheme === 'file'
            ? path.basename(activeEditor.document.uri.fsPath)
            : 'scratchpad';
        promptPrefill = `Tools and libraries for ${baseName}`;
      }
      await vscode.commands.executeCommand('skillforge.suggest', {
        intent: promptPrefill,
        promptUser: true,
      });
    }
  );
  context.subscriptions.push(suggestForFileCmd);

  // Command: Open Results Dashboard
  const showCanvasCmd = vscode.commands.registerCommand('skillforge.showCanvas', () => {
    SuggestionPanel.createOrShow(context.extensionUri, scopeManager.activeScope);
  });
  context.subscriptions.push(showCanvasCmd);

  // Command: Browse All Available Skills (Catalog)
  const browseCatalogCmd = vscode.commands.registerCommand('skillforge.browseCatalog', async () => {
    const rootPath = scopeManager.workspaceRoot || scopeManager.activeScope.absolutePath;
    await CatalogBrowser.showCatalog(
      context.extensionUri,
      rootPath,
      async (skillId: string) => {
        await vscode.commands.executeCommand('skillforge.compareSkills', skillId);
      },
      async (skillId: string) => {
        await vscode.commands.executeCommand('skillforge.generateAgentSkill', skillId);
      }
    );
  });
  context.subscriptions.push(browseCatalogCmd);

  // Command: Open Beginner Guide
  const openWalkthroughCmd = vscode.commands.registerCommand('skillforge.openWalkthrough', () => {
    vscode.commands.executeCommand(
      'workbench.action.openWalkthrough',
      'skillforge.skillforge#skillforge.walkthrough',
      false
    );
  });
  context.subscriptions.push(openWalkthroughCmd);

  // Command: Save AI API Key (Optional)
  const setApiKeyCmd = vscode.commands.registerCommand('skillforge.setApiKey', async (targetProvider?: ProviderType) => {
    let provider = targetProvider;
    if (!provider || provider === 'local' || provider === 'hybrid') {
      const pick = await vscode.window.showQuickPick(
        [
          {
            label: '$(sparkle) Google Gemini',
            value: 'gemini' as ProviderType,
            description: 'Free tier available (gemini-2.0-flash)',
            detail: 'Uses your Google AI Studio API key (aistudio.google.com). Only needed if you enable Gemini search mode.',
          },
          {
            label: '$(sparkle) OpenAI',
            value: 'openai' as ProviderType,
            description: 'Standard API tier (gpt-4o-mini)',
            detail: 'Uses your OpenAI API key (platform.openai.com). Only needed if you enable OpenAI search mode.',
          },
        ],
        {
          title: 'Save Your Personal AI API Key (Optional — Not Needed for Offline Mode)',
          placeHolder: 'Which AI service do you want to save an API key for?',
        }
      );
      if (!pick) return;
      provider = pick.value;
    }

    const key = await vscode.window.showInputBox({
      title: `Save ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API Key`,
      prompt: `Paste your ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key below. It is encrypted in your computer's keychain and never saved in project files:`,
      password: true,
      ignoreFocusOut: true,
      placeHolder: provider === 'openai' ? 'sk-...' : 'AIzaSy...',
    });

    if (key && key.trim()) {
      await secretManager.storeApiKey(provider, key);
      vscode.window.showInformationMessage(
        `SkillForge: API key for ${provider} securely saved in your OS keychain.`
      );
    }
  });
  context.subscriptions.push(setApiKeyCmd);

  // Command: Remove Saved API Key
  const clearApiKeyCmd = vscode.commands.registerCommand('skillforge.clearApiKey', async () => {
    const pick = await vscode.window.showQuickPick(
      [
        {
          label: 'Google Gemini API Key',
          value: 'gemini' as ProviderType,
          description: 'Remove saved Gemini key from OS keychain',
        },
        {
          label: 'OpenAI API Key',
          value: 'openai' as ProviderType,
          description: 'Remove saved OpenAI key from OS keychain',
        },
      ],
      {
        title: 'Remove a Saved AI API Key from Your Computer',
        placeHolder: 'Select which saved API key you want to delete from your OS keychain:',
      }
    );
    if (pick) {
      await secretManager.deleteApiKey(pick.value);
      vscode.window.showInformationMessage(
        `SkillForge: Stored API key for ${pick.value} removed.`
      );
    }
  });
  context.subscriptions.push(clearApiKeyCmd);

  // Command: Switch Search Engine Mode
  const configureProviderCmd = vscode.commands.registerCommand('skillforge.configureProvider', async () => {
    const config = vscode.workspace.getConfiguration('skillforge');
    const currentGeminiModel = config.get<string>('gemini.model') || 'gemini-2.0-flash';
    const currentOpenAIModel = config.get<string>('openai.model') || 'gpt-4o-mini';

    const pick = await vscode.window.showQuickPick(
      [
        {
          label: '$(shield) 100% Offline Local Database (Default — Free)',
          value: 'local' as ProviderType,
          description: 'No API key or internet needed',
          detail: 'Searches SkillForge\'s built-in catalog of 378 vetted libraries right on your computer. 100% private.',
        },
        {
          label: '$(sparkle) Google Gemini AI (Uses Your API Key)',
          value: 'gemini' as ProviderType,
          description: `Model: ${currentGeminiModel}`,
          detail: 'Combines the offline database with Google Gemini AI for custom reasoning. Supports free, paid & custom models.',
        },
        {
          label: '$(sparkle) OpenAI (Uses Your API Key)',
          value: 'openai' as ProviderType,
          description: `Model: ${currentOpenAIModel}`,
          detail: 'Combines the offline database with OpenAI for custom reasoning. Supports gpt-4o-mini, gpt-4o, o3-mini & custom models.',
        },
      ],
      {
        title: 'Choose How SkillForge Searches for Libraries',
        placeHolder: 'Pick 100% Offline mode (default, free) or Cloud AI mode (uses your personal API key):',
      }
    );

    if (pick) {
      await config.update('provider', pick.value, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`SkillForge: Search engine mode set to "${pick.value}".`);

      if (pick.value === 'gemini' || pick.value === 'openai') {
        const customize = await vscode.window.showQuickPick(
          [
            { label: 'Use Current Model', detail: `Keep "${pick.value === 'gemini' ? currentGeminiModel : currentOpenAIModel}"` },
            { label: '$(edit) Change AI Model', detail: 'Select free, paid flagship, reasoning, or enter any custom model name' },
          ],
          { placeHolder: 'Do you want to customize the AI model for this provider?' }
        );
        if (customize && customize.label.includes('Change AI Model')) {
          await vscode.commands.executeCommand('skillforge.configureModel', pick.value);
        }
      }
    }
  });
  context.subscriptions.push(configureProviderCmd);

  // Command: Configure AI Model (Free, Paid & Custom)
  const configureModelCmd = vscode.commands.registerCommand('skillforge.configureModel', async (targetProvider?: 'gemini' | 'openai') => {
    let provider = targetProvider;
    if (!provider) {
      const pPick = await vscode.window.showQuickPick(
        [
          { label: '$(sparkle) Google Gemini', value: 'gemini' as const, detail: 'Configure model for Google Gemini (Free, Paid Pro, or Custom)' },
          { label: '$(sparkle) OpenAI', value: 'openai' as const, detail: 'Configure model for OpenAI (Mini, Flagship 4o, Reasoning o3/o1, or Custom)' },
        ],
        { title: 'Select Provider to Change Model', placeHolder: 'Which provider do you want to configure a model for?' }
      );
      if (!pPick) return;
      provider = pPick.value;
    }

    const config = vscode.workspace.getConfiguration('skillforge');

    if (provider === 'gemini') {
      const current = config.get<string>('gemini.model') || 'gemini-2.0-flash';
      const modelPick = await vscode.window.showQuickPick(
        [
          { label: 'gemini-2.0-flash', description: 'Recommended (Fast & Free-tier eligible)', detail: 'High performance default for developer discovery' },
          { label: 'gemini-1.5-pro', description: 'Paid / Flagship Reasoning', detail: 'Complex multi-turn architectural reasoning' },
          { label: 'gemini-2.5-pro', description: 'Paid / Experimental', detail: 'Highest reasoning depth on Google AI Studio' },
          { label: 'gemini-1.5-flash', description: 'Base Tier', detail: 'Standard low-latency generation' },
          { label: '$(edit) Enter Custom Model Name...', description: 'Custom / Fine-Tuned / Private', detail: 'Type any valid Gemini model identifier' },
        ],
        { title: `Configure Google Gemini Model (Current: ${current})`, placeHolder: 'Select a recommended model or enter any custom model name:' }
      );
      if (!modelPick) return;

      let finalModel = modelPick.label;
      if (modelPick.label.includes('Enter Custom Model Name')) {
        const custom = await vscode.window.showInputBox({
          title: 'Enter Custom Google Gemini Model ID',
          prompt: 'Enter the exact model identifier from Google AI Studio (e.g. gemini-2.0-flash-thinking-exp, your-tuned-model):',
          value: current,
          ignoreFocusOut: true,
        });
        if (!custom || !custom.trim()) return;
        finalModel = custom.trim();
      }

      await config.update('gemini.model', finalModel, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`SkillForge: Google Gemini model set to "${finalModel}".`);
    } else {
      const current = config.get<string>('openai.model') || 'gpt-4o-mini';
      const modelPick = await vscode.window.showQuickPick(
        [
          { label: 'gpt-4o-mini', description: 'Recommended (Fast & Inexpensive)', detail: 'Fast, high-quality tool discovery default' },
          { label: 'gpt-4o', description: 'Paid / Flagship Omnimodel', detail: 'Advanced reasoning and architectural trade-off synthesis' },
          { label: 'o3-mini', description: 'Paid / Reasoning Tier', detail: 'High-speed reasoning model tailored for coding' },
          { label: 'o1', description: 'Paid / Deep Reasoning', detail: 'Deepest reasoning model for complex architectural problems' },
          { label: '$(edit) Enter Custom Model Name...', description: 'Custom / Proxy / Local / Fine-Tuned', detail: 'Type any model name (e.g. deepseek-chat, mistral, llama3, or your proxy model)' },
        ],
        { title: `Configure OpenAI Model (Current: ${current})`, placeHolder: 'Select a recommended model or enter any custom model name:' }
      );
      if (!modelPick) return;

      let finalModel = modelPick.label;
      if (modelPick.label.includes('Enter Custom Model Name')) {
        const custom = await vscode.window.showInputBox({
          title: 'Enter Custom OpenAI-Compatible Model ID',
          prompt: 'Enter the exact model identifier (e.g. gpt-4o, o3-mini, deepseek-chat, local-llama):',
          value: current,
          ignoreFocusOut: true,
        });
        if (!custom || !custom.trim()) return;
        finalModel = custom.trim();
      }

      await config.update('openai.model', finalModel, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`SkillForge: OpenAI model set to "${finalModel}".`);
    }
  });
  context.subscriptions.push(configureModelCmd);

  // Helper: Run side-by-side comparison via LSP server
  const runComparison = async (skillIds: string[]): Promise<ComparisonMatrix | undefined> => {
    if (!client || !client.isRunning()) {
      vscode.window.showErrorMessage('SkillForge local engine is not running.');
      return undefined;
    }
    const workspaceCtx = scopeManager.buildWorkspaceContext();
    const result = await client.sendRequest<CompareResult>(SKILLFORGE_COMPARE_METHOD, {
      skillIds,
      installedPackages: workspaceCtx.alreadyInstalled,
    });
    return result.matrix;
  };
  SuggestionPanel.setCompareHandler(runComparison);

  // Command: Manage Saved Bookmarks
  const toggleBookmarkCmd = vscode.commands.registerCommand(
    'skillforge.toggleBookmark',
    async (arg?: any) => {
      let skill = arg?.skill || arg;
      if (!skill || !skill.id) {
        const bookmarks = bookmarkManager.getBookmarks();
        if (bookmarks.length === 0) {
          vscode.window.showInformationMessage(
            'SkillForge: You have no saved bookmarks yet. Click the star icon on any recommended library in the Results Dashboard to bookmark it.'
          );
          return;
        }
        const pick = await vscode.window.showQuickPick(
          bookmarks.map((b) => ({
            label: `$(bookmark) ${b.name}`,
            description: `[${b.ecosystem}] ${b.category}`,
            detail: `Click to remove "${b.name}" from your saved bookmarks — ${b.whyUseIt}`,
            skill: b,
          })),
          {
            title: 'Manage Your Saved Library Bookmarks',
            placeHolder: 'Select any bookmarked library below to remove it from your saved list:',
          }
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
        `Clear all ${count} saved library bookmarks?`,
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

  // Command: Compare Libraries Side-by-Side
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
              title: 'Compare Libraries Side-by-Side: Pick 2 or 3 Bookmarked Tools',
              canPickMany: true,
              placeHolder: 'Check 2 or 3 libraries to compare side-by-side (or press Esc to type names manually)',
            }
          );
          if (picks && picks.length >= 2 && picks.length <= 3) {
            skillIds = picks.map((p) => p.skillId);
          } else if (picks && (picks.length < 2 || picks.length > 3)) {
            vscode.window.showWarningMessage('Please select 2 or 3 libraries to compare.');
            return;
          }
        }

        if (!skillIds || skillIds.length < 2) {
          const input = await vscode.window.showInputBox({
            title: 'Compare 2 or 3 Libraries Side-by-Side',
            prompt: 'Type 2 or 3 library names separated by commas to compare their downloads, pros/cons, and compatibility:',
            placeHolder: 'e.g., react, vue, svelte   OR   fastapi, django, flask',
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
        vscode.window.showWarningMessage('Comparison supports up to 3 libraries simultaneously.');
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

  // Command: Create AI Rules File (Phase 9)
  const generateAgentSkillCmd = vscode.commands.registerCommand(
    'skillforge.generateAgentSkill',
    async (args?: { skillId?: string; skillName?: string; format?: AgentSkillFormat }) => {
      if (!client || !client.isRunning()) {
        vscode.window.showErrorMessage('SkillForge local engine is not running.');
        return;
      }

      let skillId = args?.skillId;
      if (!skillId) {
        const input = await vscode.window.showInputBox({
          title: 'Create AI Rules File (Step 1/2): Which Library?',
          prompt: 'Type a library name (e.g., react, fastapi, tailwind, zod). SkillForge will create a markdown guide in your project that teaches your AI assistant how to write code with it:',
          placeHolder: 'e.g., react, fastapi, tailwind, prisma, zod',
        });
        if (!input || !input.trim()) {
          return;
        }
        skillId = input.trim();
      }

      let format = args?.format;
      if (!format) {
        const pick = await vscode.window.showQuickPick(
          [
            {
              label: '$(hubot) Antigravity & Claude Code (Recommended)',
              description: `Saves to .agent/skills/${skillId}/SKILL.md`,
              detail: 'Creates a step-by-step markdown guide that Antigravity and Claude read automatically when writing code for you.',
              value: 'agent-skill' as AgentSkillFormat,
            },
            {
              label: '$(file-code) Cursor IDE Rule',
              description: `Saves to .cursor/rules/${skillId}.mdc`,
              detail: 'Creates an automatic coding rule for Cursor IDE whenever you edit matching code files.',
              value: 'cursor-rule' as AgentSkillFormat,
            },
            {
              label: '$(terminal) Claude Code Dedicated Skill',
              description: `Saves to .claude/skills/${skillId}/SKILL.md`,
              detail: 'Creates a dedicated skill instruction file inside the .claude/skills folder.',
              value: 'claude-skill' as AgentSkillFormat,
            },
            {
              label: '$(book) Universal Project AI Guide',
              description: 'Saves to AGENTS.md in project root',
              detail: 'Creates a single top-level AGENTS.md guide read by all AI coding assistants.',
              value: 'root-agents' as AgentSkillFormat,
            },
          ],
          {
            title: `Create AI Rules File (Step 2/2): Choose Format for "${args?.skillName || skillId}"`,
            placeHolder: 'Where should SkillForge save the AI coding instructions for this library?',
          }
        );
        if (!pick) {
          return;
        }
        format = pick.value;
      }

      try {
        const req: GenerateAgentSkillRequest = {
          skillId,
          format,
          workspacePath: scopeManager.activeScope.absolutePath,
          includeKarpathyRules: true,
        };

        const generated = await client.sendRequest<GeneratedAgentSkill>(
          SKILLFORGE_GENERATE_AGENT_SKILL_METHOD,
          req
        );

        // Workspace-level directives (AGENTS.md, .cursor/rules) belong at the repository root;
        // package-specific skill folders (.agent/skills, .claude/skills) can reside in active subscope.
        const isRootFormat = format === 'root-agents' || format === 'cursor-rule';
        const rootPath = isRootFormat
          ? (scopeManager.workspaceRoot || scopeManager.activeScope.absolutePath)
          : (scopeManager.activeScope.absolutePath || scopeManager.workspaceRoot);

        if (!rootPath) {
          const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: generated.markdownContent,
          });
          await vscode.window.showTextDocument(doc);
          vscode.window.showInformationMessage(
            `SkillForge: Created AI rules file for ${generated.skillName} in editor.`
          );
          return;
        }

        const targetFilePath = path.join(rootPath, generated.suggestedFilePath);
        const targetUri = vscode.Uri.file(targetFilePath);
        const dirUri = vscode.Uri.file(path.dirname(targetFilePath));

        await vscode.workspace.fs.createDirectory(dirUri);
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(targetUri, encoder.encode(generated.markdownContent));

        const choice = await vscode.window.showInformationMessage(
          `SkillForge: Created AI rules file (${generated.suggestedFilePath}) to guide your AI on ${generated.skillName}!`,
          'Open File'
        );

        if (choice === 'Open File') {
          const doc = await vscode.workspace.openTextDocument(targetUri);
          await vscode.window.showTextDocument(doc);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`SkillForge: Failed to create AI rules file: ${msg}`);
      }
    }
  );
  context.subscriptions.push(generateAgentSkillCmd);

  // Command: View Generated AI Skill Files
  const viewGeneratedSkillsCmd = vscode.commands.registerCommand(
    'skillforge.viewGeneratedSkills',
    async () => {
      const rootPath = scopeManager.workspaceRoot || scopeManager.activeScope.absolutePath;
      if (!rootPath && (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0)) {
        vscode.window.showInformationMessage(
          'SkillForge: Please open a workspace or project folder to view skill files.'
        );
        return;
      }

      const files = await WorkspaceFileScanner.scanWorkspace(rootPath);
      if (files.length === 0) {
        const action = await vscode.window.showInformationMessage(
          'SkillForge: No AI skill directives or configuration files found in this workspace.',
          'Generate AI Skill',
          'Create .skillforge.json'
        );
        if (action === 'Generate AI Skill') {
          vscode.commands.executeCommand('skillforge.generateAgentSkill');
        } else if (action === 'Create .skillforge.json') {
          const targetDir = rootPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (targetDir) {
            const templatePath = path.join(targetDir, '.skillforge.json');
            const templateContent = JSON.stringify(
              {
                version: '1.0',
                skills: [],
                overrides: {},
              },
              null,
              2
            );
            fs.writeFileSync(templatePath, templateContent, 'utf8');
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(templatePath));
            await vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(
              'SkillForge: Created starter .skillforge.json in workspace root.'
            );
          }
        }
        return;
      }

      interface FileQuickPickItem extends vscode.QuickPickItem {
        file: WorkspaceSkillFile;
      }

      const items: FileQuickPickItem[] = files.map((file) => {
        const icon = file.fileType === 'workspace-config' ? '$(gear)' : '$(file-code)';
        return {
          label: `${icon} ${file.name}`,
          description: `${file.relativePath} (${(file.fileSizeBytes / 1024).toFixed(1)} KB)`,
          detail: file.summary,
          file,
        };
      });

      const selected = await vscode.window.showQuickPick(items, {
        title: `SkillForge Workspace Skill Files (${files.length} found)`,
        placeHolder: 'Select a skill directive or configuration file to open in editor...',
        matchOnDescription: true,
        matchOnDetail: true,
      });

      if (selected) {
        const doc = await vscode.workspace.openTextDocument(selected.file.uri);
        await vscode.window.showTextDocument(doc);
      }
    }
  );
  context.subscriptions.push(viewGeneratedSkillsCmd);

  // Command: Brainstorm & Plan Project (Project Studio v1.2.0)
  const brainstormProjectCmd = vscode.commands.registerCommand(
    'skillforge.brainstormProject',
    async () => {
      if (!client || !client.isRunning()) {
        vscode.window.showErrorMessage('SkillForge local engine is not running.');
        return;
      }

      const wizardResult = await ProjectIdeationWizard.run();
      if (!wizardResult) {
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'SkillForge Project Studio: Formulating Project Spec...',
          cancellable: true,
        },
        async (_progress, token) => {
          try {
            // 1. Request prompt compilation from LSP server
            const compileRes = await client!.sendRequest<CompileIdeaPromptResult>(
              SKILLFORGE_COMPILE_IDEA_PROMPT_METHOD,
              {
                request: {
                  input: wizardResult.input,
                  isWildcard: wizardResult.isWildcard,
                },
              } as CompileIdeaPromptParams
            );

            const compiled = compileRes.compiled;

            // 2. Execute with LLM Bridge (native Copilot or fallback)
            let charter = await LlmBridge.executeWithVsCodeLm(compiled, token);

            // If no native LLM or LLM execution was aborted/empty, fallback to simulated or clipboard import
            if (!charter) {
              const action = await vscode.window.showInformationMessage(
                'SkillForge: Native language model not active. Would you like to export the master prompt or import a JSON charter?',
                'Copy Master Prompt',
                'Import JSON Charter'
              );

              if (action === 'Copy Master Prompt') {
                await LlmBridge.copyMasterPrompt(compiled);
                vscode.window.showInformationMessage(
                  '📋 Master prompt copied! Paste into ChatGPT/Claude, then click "Import JSON Charter".'
                );
                return;
              } else if (action === 'Import JSON Charter') {
                const jsonText = await vscode.window.showInputBox({
                  prompt: 'Paste the generated JSON charter from your AI chat',
                  placeHolder: '{ "id": "...", "title": "...", "problemStatement": "...", ... }',
                });
                if (!jsonText) return;
                charter = LlmBridge.parseProjectCharter(jsonText);
              } else {
                return;
              }
            }

            // 3. Surface Project Charter Preview
            await CharterPreviewPanel.show(
              charter,
              compiled,
              client,
              async () => {
                vscode.commands.executeCommand('skillforge.brainstormProject');
              }
            );
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`SkillForge Ideation Error: ${msg}`);
          }
        }
      );
    }
  );
  context.subscriptions.push(brainstormProjectCmd);

  // Command: Find Libraries for Idea (Core suggestion flow)
  const suggestCmd = vscode.commands.registerCommand(
    'skillforge.suggest',
    async (args?: { intent?: string; source?: string; promptUser?: boolean }) => {
      if (!client || !client.isRunning()) {
        vscode.window.showErrorMessage('SkillForge local engine is not running.');
        return;
      }

      let intent = args?.intent;
      if (!intent || args?.promptUser) {
        intent = await vscode.window.showInputBox({
          title: 'Find the Right Libraries & Tools for Your Idea',
          prompt: 'Describe what you want to build in plain English — SkillForge will recommend vetted libraries and explain why to use them:',
          placeHolder: 'e.g., user login with Google, fast Python web API, React state management, PDF generator...',
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

  // 12. First-Run Auto-Trigger Walkthrough
  const ONBOARDING_SHOWN_KEY = 'skillforge.onboarding.shown.v1';
  const hasShownOnboarding = context.globalState.get<boolean>(ONBOARDING_SHOWN_KEY, false);
  if (!hasShownOnboarding) {
    vscode.commands.executeCommand(
      'workbench.action.openWalkthrough',
      'skillforge.skillforge#skillforge.walkthrough',
      false
    );
    context.globalState.update(ONBOARDING_SHOWN_KEY, true);
  }

  // 13. Persistent Status Bar Item (1-Click Fast Access)
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'skillforge.suggest';
  statusBarItem.text = '$(sparkle) SkillForge';
  statusBarItem.tooltip = 'SkillForge: Map ideas to libraries & agent directives (Ctrl+Alt+S / ⌥⌘S)';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

export async function deactivate(): Promise<void> {
  if (client && client.isRunning()) {
    await client.stop();
  }
}
