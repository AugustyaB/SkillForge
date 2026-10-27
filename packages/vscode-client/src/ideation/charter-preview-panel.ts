import * as vscode from 'vscode';
import type { LanguageClient } from 'vscode-languageclient/node.js';
import {
  SKILLFORGE_SCAFFOLD_PROJECT_METHOD,
  type CompiledIdeaPrompt,
  type ProjectCharter,
  type ScaffoldProjectParams,
  type ScaffoldProjectResponse,
} from '@skillforge/shared';
import { LlmBridge } from './llm-bridge.js';

export class CharterPreviewPanel {
  public static async show(
    charter: ProjectCharter,
    compiledPrompt: CompiledIdeaPrompt,
    client: LanguageClient | undefined,
    onRegenerate: () => Promise<void>
  ): Promise<void> {
    const quickPickItems = [
      {
        label: '$(rocket) Scaffold Workspace Now',
        description: 'Create PROJECT_SPEC.md, README.md, .skillforge.json & AI coding rules',
        action: 'scaffold',
      },
      {
        label: '$(copy) Copy Project Charter Markdown',
        description: 'Copy the full specification markdown to your clipboard',
        action: 'copy-charter',
      },
      {
        label: '$(clippy) Copy Master Prompt (for ChatGPT / Claude.ai)',
        description: 'Export engineered prompt for use in external web AI chats',
        action: 'copy-prompt',
      },
      {
        label: '$(sync) 🔄 Regenerate / Tweak Twist',
        description: 'Re-roll the idea with a different perspective or twist',
        action: 'regenerate',
      },
    ];

    const selection = await vscode.window.showQuickPick(quickPickItems, {
      title: `✨ Project Formulated: ${charter.title}`,
      placeHolder: `${charter.tagline} (Twist: ${charter.technicalTwist})`,
    });

    if (!selection) {
      return;
    }

    if (selection.action === 'scaffold') {
      await this.handleScaffold(charter, client);
    } else if (selection.action === 'copy-charter') {
      const markdown = this.renderCharterMarkdown(charter);
      await vscode.env.clipboard.writeText(markdown);
      vscode.window.showInformationMessage('📋 Project specification copied to clipboard!');
    } else if (selection.action === 'copy-prompt') {
      await LlmBridge.copyMasterPrompt(compiledPrompt);
      vscode.window.showInformationMessage(
        '📋 Master prompt copied! Paste into ChatGPT, Claude, or Gemini to iterate.'
      );
    } else if (selection.action === 'regenerate') {
      await onRegenerate();
    }
  }

  private static async handleScaffold(
    charter: ProjectCharter,
    client: LanguageClient | undefined
  ): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let targetPath: string;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      const selected = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Workspace Folder to Scaffold',
      });
      if (!selected || selected.length === 0) {
        vscode.window.showWarningMessage('Scaffolding canceled: No folder selected.');
        return;
      }
      targetPath = selected[0]!.fsPath;
    } else {
      targetPath = workspaceFolders[0]!.uri.fsPath;
    }

    if (!client) {
      vscode.window.showErrorMessage('SkillForge LSP server is not connected.');
      return;
    }

    try {
      const response = await client.sendRequest<ScaffoldProjectResponse>(
        SKILLFORGE_SCAFFOLD_PROJECT_METHOD,
        {
          request: {
            workspacePath: targetPath,
            charter,
            targetRulesFormat: 'cursor-rule',
            overwriteExisting: false,
          },
        } as ScaffoldProjectParams
      );

      const result = response.result;
      if (result.success) {
        const openSpecAction = 'Open PROJECT_SPEC.md';
        const choice = await vscode.window.showInformationMessage(
          `🚀 Project "${charter.title}" scaffolded with ${result.createdFiles.length} files!`,
          openSpecAction
        );

        if (choice === openSpecAction) {
          const specUri = vscode.Uri.file(`${targetPath}/PROJECT_SPEC.md`);
          const doc = await vscode.workspace.openTextDocument(specUri);
          await vscode.window.showTextDocument(doc);
        }
      } else {
        vscode.window.showErrorMessage(`Scaffolding failed: ${result.message}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      vscode.window.showErrorMessage(`Error communicating with SkillForge server: ${msg}`);
    }
  }

  private static renderCharterMarkdown(charter: ProjectCharter): string {
    return `# ${charter.title}\n\n> ${charter.tagline}\n\n## Problem Statement\n${charter.problemStatement}\n\n## The Technical Twist\n${charter.technicalTwist}\n\n## Recommended Skills\n${charter.recommendedSkills.map((s) => `- ${s}`).join('\n')}\n`;
  }
}
