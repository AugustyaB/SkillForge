import * as vscode from 'vscode';
import {
  type CompiledIdeaPrompt,
  type ProjectCharter,
  validateProjectCharter,
} from '@skillforge/shared';

export class LlmBridge {
  /**
   * Attempts to execute the compiled prompt through native VS Code Language Models (Copilot).
   * Falls back to returning undefined if no language model is active.
   */
  public static async executeWithVsCodeLm(
    compiled: CompiledIdeaPrompt,
    token?: vscode.CancellationToken
  ): Promise<ProjectCharter | undefined> {
    try {
      // Check if vscode.lm is available in the current environment
      if (typeof vscode.lm === 'undefined' || typeof vscode.lm.selectChatModels !== 'function') {
        return undefined;
      }

      // Try selecting chat models (prefer gpt-4o or any active model)
      let models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
      if (!models || models.length === 0) {
        models = await vscode.lm.selectChatModels();
      }

      if (!models || models.length === 0) {
        return undefined;
      }

      const model = models[0]!;
      const messages = [
        vscode.LanguageModelChatMessage.User(
          `${compiled.systemPrompt}\n\n---\n\n${compiled.userPrompt}`
        ),
      ];

      const response = await model.sendRequest(messages, {}, token);
      let fullText = '';
      for await (const chunk of response.text) {
        fullText += chunk;
      }

      return this.parseProjectCharter(fullText);
    } catch {
      return undefined;
    }
  }

  /**
   * Safely extracts and validates a ProjectCharter from raw LLM output.
   * Strips markdown fences, whitespace, and validates via Zod schema.
   */
  public static parseProjectCharter(rawText: string): ProjectCharter {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('LLM output is empty or not a string.');
    }

    let cleaned = rawText.trim();
    // Remove markdown code fences if present (```json ... ``` or ``` ... ```)
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    // Try finding JSON object boundaries if model output included preamble
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleaned = cleaned.substring(startIdx, endIdx + 1);
    }

    const parsed = JSON.parse(cleaned);
    return validateProjectCharter(parsed);
  }

  /**
   * Copies the master prompt to clipboard and prompts user to import the resulting JSON.
   */
  public static async copyMasterPrompt(compiled: CompiledIdeaPrompt): Promise<void> {
    const fullPrompt = `${compiled.systemPrompt}\n\n---\n\n${compiled.userPrompt}`;
    await vscode.env.clipboard.writeText(fullPrompt);
  }
}
