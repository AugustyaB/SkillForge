import * as vscode from 'vscode';
import { parseDocumentComments } from './comment-parser.js';

export class SkillForgeCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  private debounceTimer: NodeJS.Timeout | undefined;

  constructor() {
    // Refresh CodeLenses when the active document is edited (with 300ms debounce)
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        vscode.window.activeTextEditor &&
        event.document === vscode.window.activeTextEditor.document
      ) {
        this.triggerRefresh();
      }
    });
  }

  public triggerRefresh(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this._onDidChangeCodeLenses.fire();
    }, 300);
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): vscode.CodeLens[] {
    const lines: string[] = [];
    const lineCount = document.lineCount;

    // Read lines from document
    for (let i = 0; i < lineCount; i++) {
      lines.push(document.lineAt(i).text);
    }

    const triggers = parseDocumentComments(lines, 10);
    const codeLenses: vscode.CodeLens[] = [];

    for (const trigger of triggers) {
      const range = new vscode.Range(
        new vscode.Position(trigger.lineNumber, trigger.startCharacter),
        new vscode.Position(trigger.lineNumber, trigger.endCharacter)
      );

      const title = `SkillForge: Suggest libraries for "${trigger.intent}"`;
      const lens = new vscode.CodeLens(range, {
        title,
        command: 'skillforge.suggest',
        arguments: [{ intent: trigger.intent, source: 'codelens' }],
      });

      codeLenses.push(lens);
    }

    return codeLenses;
  }

  public dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
