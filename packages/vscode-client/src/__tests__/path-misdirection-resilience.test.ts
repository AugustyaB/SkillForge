import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

const mockSendText = vi.fn();
const mockShow = vi.fn();

vi.mock('vscode', () => {
  class EventEmitter {
    event = vi.fn();
    fire = vi.fn();
  }
  class Range {
    constructor(public start: any, public end: any) {}
  }
  class Position {
    constructor(public line: number, public character: number) {}
  }
  class CodeLens {
    constructor(public range: any, public command: any) {}
  }

  return {
    EventEmitter,
    Range,
    Position,
    CodeLens,
    window: {
      terminals: [] as any[],
      createTerminal: vi.fn((opts: any) => {
        const term = {
          name: opts.name,
          sendText: mockSendText,
          show: mockShow,
        };
        return term;
      }),
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
      onDidCloseTerminal: vi.fn(),
      activeTextEditor: undefined,
    },
    workspace: {
      workspaceFolders: [],
      onDidChangeTextDocument: vi.fn(),
    },
  };
});

import {
  normalizePath,
  isPathInsideRoot,
  resolveScopePath,
} from '../context/scope-utils.js';
import { TerminalRunner } from '../terminal/terminal-runner.js';
import { SkillForgeCodeLensProvider } from '../providers/codelens-provider.js';

describe('Path Misdirection & Filesystem Resilience QA Suite', () => {
  let tempWorkspace: string;

  beforeEach(() => {
    tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-path-audit-'));
    TerminalRunner.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    try {
      fs.rmSync(tempWorkspace, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Vector 1 & 2: Boundary Containment, Drive Casing, and Absolute Paths', () => {
    it('normalizes Windows drive casing to uppercase', () => {
      expect(normalizePath('c:\\users\\dev\\project')).toBe('C:/users/dev/project');
      expect(normalizePath('d:\\data\\store')).toBe('D:/data/store');
      expect(normalizePath('/usr/local/bin')).toBe('/usr/local/bin');
    });

    it('prevents sibling directory prefix traps', () => {
      const root = path.join(tempWorkspace, 'app');
      const sibling = path.join(tempWorkspace, 'app-secrets');
      fs.mkdirSync(root, { recursive: true });
      fs.mkdirSync(sibling, { recursive: true });

      expect(isPathInsideRoot(root, sibling)).toBe(false);
      expect(isPathInsideRoot(root, path.join(root, 'subpackage'))).toBe(true);

      const resolvedSibling = resolveScopePath(root, '../app-secrets');
      expect(resolvedSibling.isValid).toBe(false);
      expect(resolvedSibling.isRoot).toBe(true);
      expect(resolvedSibling.absolutePath).toBe(normalizePath(root));
    });

    it('safely resolves absolute paths within the workspace root', () => {
      const sub = path.join(tempWorkspace, 'packages', 'client');
      fs.mkdirSync(sub, { recursive: true });

      const res = resolveScopePath(tempWorkspace, sub);
      expect(res.isValid).toBe(true);
      expect(res.isRoot).toBe(false);
      expect(res.absolutePath).toBe(normalizePath(sub));
    });

    it('rejects absolute paths outside the workspace root', () => {
      const outside = path.join(os.tmpdir(), 'outside-sandbox-dir');
      fs.mkdirSync(outside, { recursive: true });

      try {
        const res = resolveScopePath(tempWorkspace, outside);
        expect(res.isValid).toBe(false);
        expect(res.isRoot).toBe(true);
        expect(res.absolutePath).toBe(normalizePath(tempWorkspace));
      } finally {
        fs.rmSync(outside, { recursive: true, force: true });
      }
    });

    it('neutralizes hostile directory traversal strings', () => {
      const res = resolveScopePath(tempWorkspace, '../../../../../../windows/system32');
      expect(res.isValid).toBe(false);
      expect(res.isRoot).toBe(true);
      expect(res.absolutePath).toBe(normalizePath(tempWorkspace));
    });
  });

  describe('Vector 4: Terminal Execution with Dead or Missing Directories', () => {
    it('falls back gracefully when target directory has been deleted or moved', () => {
      const missingDir = path.join(tempWorkspace, 'deleted-folder-xyz');
      expect(fs.existsSync(missingDir)).toBe(false);

      expect(() => {
        TerminalRunner.runCommand('npm install express', missingDir);
      }).not.toThrow();
    });

    it('correctly tracks and updates terminal working directory', () => {
      const validSub = path.join(tempWorkspace, 'apps', 'web');
      fs.mkdirSync(validSub, { recursive: true });

      TerminalRunner.runCommand('pnpm add zod', validSub);
      expect(TerminalRunner.getLastCwd()).toBe(validSub);

      const validSub2 = path.join(tempWorkspace, 'apps', 'backend');
      fs.mkdirSync(validSub2, { recursive: true });

      TerminalRunner.runCommand('pnpm add fastapi', validSub2);
      expect(TerminalRunner.getLastCwd()).toBe(validSub2);
    });
  });

  describe('Vector 5: CodeLens Virtual Scheme Rejection', () => {
    const provider = new SkillForgeCodeLensProvider();

    it('suppresses CodeLenses for git diff virtual schemes', () => {
      const fakeGitDoc: any = {
        uri: { scheme: 'git', fsPath: '/path/to/.git/index' },
        lineCount: 2,
        lineAt: vi.fn().mockReturnValue({ text: '// IDEA: state management' }),
      };

      const lenses = provider.provideCodeLenses(fakeGitDoc, {} as any);
      expect(lenses).toEqual([]);
    });

    it('suppresses CodeLenses for output and debug consoles', () => {
      const fakeOutputDoc: any = {
        uri: { scheme: 'output', fsPath: 'extension-output' },
        lineCount: 2,
        lineAt: vi.fn().mockReturnValue({ text: '// SKILL: background queue' }),
      };

      const lenses = provider.provideCodeLenses(fakeOutputDoc, {} as any);
      expect(lenses).toEqual([]);
    });

    it('provides CodeLenses for standard file and untitled schemes', () => {
      const fakeFileDoc: any = {
        uri: { scheme: 'file', fsPath: path.join(tempWorkspace, 'index.ts') },
        lineCount: 1,
        lineAt: vi.fn().mockReturnValue({ text: '// IDEA: real-time websockets' }),
      };

      const fileLenses = provider.provideCodeLenses(fakeFileDoc, {} as any);
      expect(fileLenses.length).toBe(1);
      expect(fileLenses[0]!.command?.arguments?.[0]?.intent).toBe('real-time websockets');

      const fakeUntitledDoc: any = {
        uri: { scheme: 'untitled', fsPath: 'Untitled-1' },
        lineCount: 1,
        lineAt: vi.fn().mockReturnValue({ text: '// SKILL: redis client' }),
      };

      const untitledLenses = provider.provideCodeLenses(fakeUntitledDoc, {} as any);
      expect(untitledLenses.length).toBe(1);
      expect(untitledLenses[0]!.command?.arguments?.[0]?.intent).toBe('redis client');
    });
  });
});
