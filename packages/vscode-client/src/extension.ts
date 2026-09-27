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

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const outputChannel = vscode.window.createOutputChannel('SkillForge Language Server');
  context.subscriptions.push(outputChannel);

  // In development, the server lives in packages/server/dist/index.js
  // When packaged, it can be resolved relative to extension directory or bundled
  let serverModule = context.asAbsolutePath(path.join('..', 'server', 'dist', 'index.js'));
  
  // Fallback for flat structure or packaged layout
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

  // Register command: Test Server Connection
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

  // Register command: Suggest Skills for My Idea
  const suggestCmd = vscode.commands.registerCommand('skillforge.suggest', async () => {
    if (!client || !client.isRunning()) {
      vscode.window.showErrorMessage('SkillForge LSP server is not running.');
      return;
    }

    const intent = await vscode.window.showInputBox({
      title: 'SkillForge: Suggest Skills',
      prompt: 'What do you want to build? (e.g., "real-time chat app", "REST API with auth")',
      placeHolder: 'Describe your idea or feature...',
    });

    if (!intent || !intent.trim()) {
      return;
    }

    try {
      const params: SkillSuggestionParams = {
        intent: intent.trim(),
      };
      const result = await client.sendRequest<SkillSuggestionResult>(
        SKILLFORGE_SUGGEST_METHOD,
        params
      );

      const count = result.skills.length;
      const names = result.skills.map((s) => s.name).join(', ');
      vscode.window.showInformationMessage(
        `SkillForge found ${count} skill${count === 1 ? '' : 's'}: ${names || 'None'} (${result.timings.localMs}ms)`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`SkillForge suggestion failed: ${msg}`);
    }
  });
  context.subscriptions.push(suggestCmd);
}

export async function deactivate(): Promise<void> {
  if (client && client.isRunning()) {
    await client.stop();
  }
}
