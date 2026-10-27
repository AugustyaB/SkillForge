import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('vscode', () => {
  return {
    Uri: {
      file: (fsPath: string) => ({
        fsPath,
        scheme: 'file',
        path: fsPath,
      }),
    },
    workspace: {
      workspaceFolders: undefined,
      openTextDocument: vi.fn(),
    },
    window: {
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
      showErrorMessage: vi.fn(),
      showQuickPick: vi.fn(),
      showInputBox: vi.fn(),
      showTextDocument: vi.fn(),
      showOpenDialog: vi.fn(),
    },
    env: {
      clipboard: {
        writeText: vi.fn(),
      },
    },
    commands: {
      executeCommand: vi.fn(),
      registerCommand: vi.fn(),
    },
  };
});

import * as vscode from 'vscode';
import { ProjectIdeationWizard } from '../ideation/project-wizard.js';
import { LlmBridge } from '../ideation/llm-bridge.js';
import { buildQuickActionItems, buildAllCommandsItems } from '../views/tree-view-models.js';

describe('SkillForge Project Studio Client Tests (v1.2.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tree View Models Integration', () => {
    it('surfaces Brainstorm & Plan Project in Quick Actions', () => {
      const items = buildQuickActionItems();
      const action = items.find((i) => i.id === 'qa-brainstorm-project');
      expect(action).toBeDefined();
      expect(action?.commandId).toBe('skillforge.brainstormProject');
      expect(action?.iconId).toBe('lightbulb');
    });

    it('surfaces Brainstorm & Plan Project in All Commands list', () => {
      const items = buildAllCommandsItems();
      const cmd = items.find((i) => i.id === 'cmd-brainstorm-project');
      expect(cmd).toBeDefined();
      expect(cmd?.commandId).toBe('skillforge.brainstormProject');
      expect(cmd?.iconId).toBe('lightbulb');
    });
  });

  describe('ProjectIdeationWizard', () => {
    it('returns wildcard configuration when I\'m Feeling Lucky is selected', async () => {
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: '🎲 I\'m Feeling Lucky',
        id: 'wildcard',
      } as any);

      const result = await ProjectIdeationWizard.run();
      expect(result).toBeDefined();
      expect(result?.isWildcard).toBe(true);
      expect(result?.input.persona).toBe('fresher-student');
    });

    it('returns undefined when user escapes mode selection', async () => {
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce(undefined);
      const result = await ProjectIdeationWizard.run();
      expect(result).toBeUndefined();
    });

    it('walks through the 5-step guided questionnaire successfully', async () => {
      // 1. Mode: Guided
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: 'Guided',
        id: 'guided',
      } as any);

      // 2. Persona: Working Professional
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: 'Working Professional',
        id: 'working-professional',
      } as any);

      // 3. Domain: DevTools & CLI
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: 'DevTools & CLI',
        id: 'devtools-cli',
      } as any);

      // 4. Ecosystem: Rust
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: 'Rust',
        id: 'rust',
      } as any);

      // 5. Time Budget: Weekend Hackathon
      vi.mocked(vscode.window.showQuickPick).mockResolvedValueOnce({
        label: 'Weekend Hackathon',
        id: 'weekend-hackathon',
      } as any);

      // 6. Learning Goal: AST parsing
      vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce('AST parsing and regex bloom filters');

      const result = await ProjectIdeationWizard.run();
      expect(result).toBeDefined();
      expect(result?.isWildcard).toBe(false);
      expect(result?.input.persona).toBe('working-professional');
      expect(result?.input.domain).toBe('devtools-cli');
      expect(result?.input.ecosystem).toBe('rust');
      expect(result?.input.timeBudget).toBe('weekend-hackathon');
      expect(result?.input.learningGoal).toBe('AST parsing and regex bloom filters');
    });

    it('supports custom domain freeform entry', async () => {
      vi.mocked(vscode.window.showQuickPick)
        .mockResolvedValueOnce({ id: 'guided' } as any)
        .mockResolvedValueOnce({ id: 'intermediate' } as any)
        .mockResolvedValueOnce({ id: 'custom' } as any);

      vi.mocked(vscode.window.showInputBox)
        .mockResolvedValueOnce('Bioinformatics Gene Splicer') // custom domain input
        .mockResolvedValueOnce(''); // skip learning goal

      vi.mocked(vscode.window.showQuickPick)
        .mockResolvedValueOnce({ id: 'python' } as any)
        .mockResolvedValueOnce({ id: 'two-week-deep-dive' } as any);

      const result = await ProjectIdeationWizard.run();
      expect(result?.input.domain).toBe('custom');
      expect(result?.input.customDomain).toBe('Bioinformatics Gene Splicer');
    });
  });

  describe('LlmBridge Parser & Fallbacks', () => {
    const validJsonCharter = JSON.stringify({
      id: 'local-rag',
      title: 'Local DocuQuery',
      tagline: '100% offline document search engine',
      targetPersona: 'intermediate',
      domain: 'ai-agents',
      problemStatement: 'Engineers cannot upload sensitive proprietary code to cloud LLMs.',
      technicalTwist: 'Local FAISS vector indexing with quantized ONNX models.',
      timeBudget: 'two-week-deep-dive',
      recommendedSkills: ['fastapi', 'faiss', 'onnxruntime'],
      architecturePattern: 'REST API + Vector Index',
      milestones: [
        {
          phase: 1,
          name: 'Vector Indexer',
          objective: 'Build offline FAISS vector storage',
          deliverables: ['Vector database module', 'Test runner'],
        },
      ],
      antiPatternsToAvoid: ['Do not send queries to external API endpoints'],
    });

    it('parses raw JSON successfully', () => {
      const parsed = LlmBridge.parseProjectCharter(validJsonCharter);
      expect(parsed.title).toBe('Local DocuQuery');
      expect(parsed.recommendedSkills).toContain('faiss');
    });

    it('strips markdown code fences (```json ... ```)', () => {
      const fenced = `\`\`\`json\n${validJsonCharter}\n\`\`\``;
      const parsed = LlmBridge.parseProjectCharter(fenced);
      expect(parsed.id).toBe('local-rag');
    });

    it('extracts JSON surrounded by conversational preamble text', () => {
      const conversational = `Here is a fantastic project idea tailored for you:\n\n${validJsonCharter}\n\nHope you build something amazing!`;
      const parsed = LlmBridge.parseProjectCharter(conversational);
      expect(parsed.title).toBe('Local DocuQuery');
    });

    it('throws error for invalid JSON or empty output', () => {
      expect(() => LlmBridge.parseProjectCharter('')).toThrow();
      expect(() => LlmBridge.parseProjectCharter('Not a json')).toThrow();
    });

    it('copies master prompt to clipboard', async () => {
      await LlmBridge.copyMasterPrompt({
        systemPrompt: 'System instructions',
        userPrompt: 'User requirements',
        recommendedCatalogSkills: ['fastapi'],
      });

      expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith(
        'System instructions\n\n---\n\nUser requirements'
      );
    });
  });
});
