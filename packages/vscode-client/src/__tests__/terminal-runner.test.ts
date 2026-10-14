import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockSendText = vi.fn();
const mockShow = vi.fn();
const mockTerminal = {
  name: 'SkillForge',
  sendText: mockSendText,
  show: mockShow,
};

let closeCallback: ((t: { name: string }) => void) | undefined;

vi.mock('fs', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    existsSync: vi.fn((p: string) => {
      if (typeof p === 'string' && p.includes('/workspace/root')) return true;
      return actual.existsSync(p);
    }),
  };
});

vi.mock('vscode', () => ({
  window: {
    terminals: [] as typeof mockTerminal[],
    createTerminal: vi.fn((options: { name: string; cwd?: string }) => {
      const term = {
        name: options.name,
        sendText: mockSendText,
        show: mockShow,
      };
      (mockVscodeWindow.terminals as unknown[]).push(term);
      return term;
    }),
    showInformationMessage: vi.fn(),
    showWarningMessage: vi.fn(),
    onDidCloseTerminal: vi.fn((cb: (t: { name: string }) => void) => {
      closeCallback = cb;
    }),
  },
  workspace: {
    workspaceFolders: [{ uri: { fsPath: '/workspace/root' } }],
  },
}));

import * as vscode from 'vscode';
const mockVscodeWindow = vscode.window as unknown as {
  terminals: (typeof mockTerminal)[];
  createTerminal: ReturnType<typeof vi.fn>;
  showInformationMessage: ReturnType<typeof vi.fn>;
  showWarningMessage: ReturnType<typeof vi.fn>;
};

import { TerminalRunner } from '../terminal/terminal-runner.js';

describe('TerminalRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVscodeWindow.terminals = [];
    TerminalRunner.reset();
  });

  describe('deriveInstallCommand', () => {
    it('generates pnpm add for JavaScript/TypeScript packages', () => {
      expect(TerminalRunner.deriveInstallCommand('express', 'javascript')).toBe('pnpm add express');
      expect(TerminalRunner.deriveInstallCommand('@tanstack/react-query', 'javascript')).toBe(
        'pnpm add @tanstack/react-query'
      );
      expect(TerminalRunner.deriveInstallCommand('next', 'node')).toBe('pnpm add next');
    });

    it('generates pip install for Python packages', () => {
      expect(TerminalRunner.deriveInstallCommand('fastapi', 'python')).toBe('pip install fastapi');
      expect(TerminalRunner.deriveInstallCommand('scikit-learn', 'python')).toBe(
        'pip install scikit-learn'
      );
    });

    it('generates cargo add for Rust crates', () => {
      expect(TerminalRunner.deriveInstallCommand('tokio', 'rust')).toBe('cargo add tokio');
      expect(TerminalRunner.deriveInstallCommand('serde', 'rust')).toBe('cargo add serde');
    });

    it('generates go get for Go modules', () => {
      expect(
        TerminalRunner.deriveInstallCommand('github.com/gin-gonic/gin', 'go')
      ).toBe('go get github.com/gin-gonic/gin');
    });

    it('generates mvn dependency:get for Java artifacts', () => {
      expect(
        TerminalRunner.deriveInstallCommand('org.springframework.boot:spring-boot-starter-web', 'java')
      ).toBe('mvn dependency:get -Dartifact=org.springframework.boot:spring-boot-starter-web');
    });

    it('defaults unknown or undefined ecosystems to pnpm add', () => {
      expect(TerminalRunner.deriveInstallCommand('some-tool', undefined)).toBe('pnpm add some-tool');
      expect(TerminalRunner.deriveInstallCommand('some-tool', 'unknown')).toBe('pnpm add some-tool');
    });

    it('handles dirty, whitespace, and hostile inputs gracefully', () => {
      expect(TerminalRunner.deriveInstallCommand('', 'javascript')).toBe('');
      expect(TerminalRunner.deriveInstallCommand('   ', 'python')).toBe('');
      expect(TerminalRunner.deriveInstallCommand(null as unknown as string, 'rust')).toBe('');
      expect(TerminalRunner.deriveInstallCommand(undefined as unknown as string)).toBe('');
      expect(TerminalRunner.deriveInstallCommand('  tailwindcss  ', 'javascript')).toBe(
        'pnpm add tailwindcss'
      );
      expect(TerminalRunner.deriveInstallCommand('c++', 'javascript')).toBe('pnpm add c++');
    });
  });

  describe('runCommand and CWD management (BUG-13)', () => {
    it('creates a terminal and executes command', () => {
      TerminalRunner.runCommand('pnpm add express');

      expect(mockVscodeWindow.createTerminal).toHaveBeenCalledWith({
        name: 'SkillForge',
        cwd: undefined,
      });
      expect(mockSendText).toHaveBeenCalledWith('pnpm add express', true);
    });

    it('switches working directory when switching scope folders', () => {
      // 1. First run in root scope
      TerminalRunner.runCommand('pnpm add root-pkg', '/workspace/root');
      expect(TerminalRunner.getLastCwd()).toBe('/workspace/root');
      expect(mockSendText).toHaveBeenCalledWith('pnpm add root-pkg', true);

      // 2. Second run in subpackage scope — must emit cd command!
      TerminalRunner.runCommand('pnpm add server-pkg', '/workspace/root/packages/server');
      expect(mockSendText).toHaveBeenCalledWith('cd "/workspace/root/packages/server"', true);
      expect(mockSendText).toHaveBeenCalledWith('pnpm add server-pkg', true);
      expect(TerminalRunner.getLastCwd()).toBe('/workspace/root/packages/server');
    });

    it('does not emit redundant cd command when cwd has not changed', () => {
      TerminalRunner.runCommand('pnpm test', '/workspace/root/packages/server');
      mockSendText.mockClear();

      TerminalRunner.runCommand('pnpm build', '/workspace/root/packages/server');
      expect(mockSendText).not.toHaveBeenCalledWith(expect.stringContaining('cd '), true);
      expect(mockSendText).toHaveBeenCalledWith('pnpm build', true);
    });

    it('resets lastCwd when terminal is closed', () => {
      TerminalRunner.runCommand('pnpm test', '/workspace/root');
      expect(TerminalRunner.getLastCwd()).toBe('/workspace/root');

      // Simulate terminal closed event
      if (closeCallback) {
        closeCallback({ name: 'SkillForge' });
      }
      expect(TerminalRunner.getLastCwd()).toBeUndefined();
    });

    it('ignores empty or whitespace-only commands', () => {
      TerminalRunner.runCommand('   ');
      expect(mockVscodeWindow.createTerminal).not.toHaveBeenCalled();
    });
  });
});
