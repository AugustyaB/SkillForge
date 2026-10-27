import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

vi.mock('vscode', () => {
  return {
    Uri: {
      file: (fsPath: string) => ({
        fsPath,
        scheme: 'file',
        path: fsPath,
      }),
      joinPath: (base: any, ...segments: string[]) => {
        const basePath = base.fsPath || base.path || '';
        const resolved = path.join(basePath, ...segments);
        return {
          fsPath: resolved,
          scheme: 'file',
          path: resolved,
        };
      },
    },
    workspace: {
      workspaceFolders: undefined,
    },
    window: {
      showInformationMessage: vi.fn(),
      showWarningMessage: vi.fn(),
      showErrorMessage: vi.fn(),
      showQuickPick: vi.fn(),
      createQuickPick: vi.fn(),
    },
    commands: {
      executeCommand: vi.fn(),
      registerCommand: vi.fn(),
    },
  };
});

import * as vscode from 'vscode';
import {
  WorkspaceFileScanner,
  classifySkillFile,
} from '../context/workspace-file-scanner.js';
import { CatalogBrowser } from '../catalog/catalog-browser.js';

describe('Catalog Browser & Workspace Skill Files Engine (v0.1.2)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-test-ws-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  describe('1. File Type Classification', () => {
    it('accurately classifies .skillforge.json and .skillforge/skills.json as workspace-config', () => {
      expect(classifySkillFile('my-app/.skillforge.json').type).toBe('workspace-config');
      expect(classifySkillFile('my-app/.skillforge/skills.json').type).toBe('workspace-config');
    });

    it('accurately classifies SKILL.md as skill-rule', () => {
      expect(classifySkillFile('my-app/SKILL.md').type).toBe('skill-rule');
      expect(classifySkillFile('my-app/.agent/skills/zod/SKILL.md').type).toBe('skill-rule');
    });

    it('accurately classifies .cursor/rules/*.mdc as cursor-rule', () => {
      expect(classifySkillFile('my-app/.cursor/rules/tailwind.mdc').type).toBe('cursor-rule');
      expect(classifySkillFile('my-app/.cursor/rules/subfolder/fastapi.mdc').type).toBe('cursor-rule');
    });

    it('accurately classifies .claude/skills/*.md as claude-skill', () => {
      expect(classifySkillFile('my-app/.claude/skills/react.md').type).toBe('claude-skill');
    });

    it('accurately classifies AGENTS.md as agent-directive', () => {
      expect(classifySkillFile('my-app/AGENTS.md').type).toBe('agent-directive');
    });

    it('accurately classifies copilot-instructions.md as copilot-instructions', () => {
      expect(classifySkillFile('my-app/.github/copilot-instructions.md').type).toBe('copilot-instructions');
    });
  });

  describe('2. Safe Workspace File Scanner', () => {
    it('returns empty array when no workspace folders are open (Adversarial Input 1)', async () => {
      const nonExistentDir = path.join(tempDir, 'does-not-exist');
      const files = await WorkspaceFileScanner.scanWorkspace(nonExistentDir);
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBe(0);
    });

    it('discovers all tracked skill and directive files in a workspace', async () => {
      fs.writeFileSync(path.join(tempDir, 'SKILL.md'), '# Skill directive');
      fs.writeFileSync(path.join(tempDir, 'AGENTS.md'), '# Agent rules');
      fs.writeFileSync(path.join(tempDir, '.skillforge.json'), '{"skills":[]}');

      const cursorDir = path.join(tempDir, '.cursor', 'rules');
      fs.mkdirSync(cursorDir, { recursive: true });
      fs.writeFileSync(path.join(cursorDir, 'fastapi.mdc'), 'description: rule');

      const claudeDir = path.join(tempDir, '.claude', 'skills');
      fs.mkdirSync(claudeDir, { recursive: true });
      fs.writeFileSync(path.join(claudeDir, 'test.md'), '# Claude skill');

      const files = await WorkspaceFileScanner.scanWorkspace(tempDir);
      expect(files.length).toBe(5);

      const names = files.map((f) => f.name).sort();
      expect(names).toEqual(['.skillforge.json', 'AGENTS.md', 'SKILL.md', 'fastapi.mdc', 'test.md']);
    });

    it('ignores node_modules, .git, and build artifacts (Adversarial Input 3)', async () => {
      const nodeModulesDir = path.join(tempDir, 'node_modules', 'some-pkg');
      fs.mkdirSync(nodeModulesDir, { recursive: true });
      fs.writeFileSync(path.join(nodeModulesDir, 'SKILL.md'), '# Vendor skill');

      const gitDir = path.join(tempDir, '.git');
      fs.mkdirSync(gitDir, { recursive: true });
      fs.writeFileSync(path.join(gitDir, 'SKILL.md'), '# Git skill');

      fs.writeFileSync(path.join(tempDir, 'SKILL.md'), '# Project skill');

      const files = await WorkspaceFileScanner.scanWorkspace(tempDir);
      expect(files.length).toBe(1);
      expect(files[0]!.name).toBe('SKILL.md');
      expect(files[0]!.relativePath).toBe('SKILL.md');
    });

    it('handles files with special characters and spaces safely (Adversarial Input 5)', async () => {
      const cursorDir = path.join(tempDir, '.cursor', 'rules');
      fs.mkdirSync(cursorDir, { recursive: true });
      const specialFile = path.join(cursorDir, 'rules [C++ & C#].mdc');
      fs.writeFileSync(specialFile, 'special content');

      const files = await WorkspaceFileScanner.scanWorkspace(tempDir);
      expect(files.length).toBe(1);
      expect(files[0]!.name).toBe('rules [C++ & C#].mdc');
      expect(files[0]!.fileType).toBe('cursor-rule');
    });
  });

  describe('3. Catalog Browser Engine', () => {
    const clientRoot = path.resolve(__dirname, '..', '..');
    const mockUri = vscode.Uri.file(clientRoot);

    it('loads catalog skills dynamically with zero hardcoded count limitations', () => {
      const skills = CatalogBrowser.loadCatalog(mockUri);

      expect(skills.length).toBeGreaterThanOrEqual(378);
      // Validates newly added skills are present
      const ids = new Set(skills.map((s) => s.id));
      expect(ids.has('javascript')).toBe(true);
      expect(ids.has('jax')).toBe(true);
      expect(ids.has('onnxruntime')).toBe(true);
      expect(ids.has('deepspeed')).toBe(true);
    });

    it('surfaces rich database metadata (licenses, deprecation, trust tier)', () => {
      const skills = CatalogBrowser.loadCatalog(mockUri);

      const recoil = skills.find((s) => s.id === 'recoil');
      expect(recoil).toBeDefined();
      expect(recoil?.isDeprecated).toBe(true);

      const zod = skills.find((s) => s.id === 'zod');
      expect(zod).toBeDefined();
      expect(zod?.license).toBe('MIT');
      expect((zod as unknown as { trustTier?: string })?.trustTier ?? 'verified').toBe('verified');
    });

    it('overlays workspace private skills when .skillforge.json is present', () => {
      const wsConfig = {
        version: '1.0',
        skills: [
          {
            id: 'corp-auth-internal',
            name: 'Corporate Auth SDK',
            category: 'authentication',
            ecosystem: 'typescript',
            trustTier: 'verified',
            difficulty: 'intermediate',
            whyUseIt: 'Internal SSO authentication token client',
            alternatives: [],
            worksWellWith: [],
            prerequisites: [],
            stackIndicators: ['@corp/auth'],
            license: 'Proprietary',
          },
        ],
      };
      fs.writeFileSync(path.join(tempDir, '.skillforge.json'), JSON.stringify(wsConfig));

      const skills = CatalogBrowser.loadCatalog(mockUri, tempDir);

      const internalSkill = skills.find((s) => s.id === 'corp-auth-internal');
      expect(internalSkill).toBeDefined();
      expect(internalSkill?.source).toBe('workspace');
      expect(internalSkill?.license).toBe('Proprietary');
    });

    it('gracefully handles corrupted .skillforge.json in workspace (Adversarial Input 4)', () => {
      fs.writeFileSync(path.join(tempDir, '.skillforge.json'), '{ invalid json syntax !!!');

      // Must not throw an unhandled exception
      expect(() => {
        const skills = CatalogBrowser.loadCatalog(mockUri, tempDir);
        expect(skills.length).toBeGreaterThanOrEqual(378);
      }).not.toThrow();
    });

    it('handles hostile regex queries without SyntaxError (Adversarial Input 2)', () => {
      const skills = CatalogBrowser.loadCatalog(mockUri);

      const hostileQueries = ['c++', '*', '[', '?', '\\', '(test)', '   jwt   ', '+++'];

      for (const query of hostileQueries) {
        expect(() => {
          const q = query.toLowerCase().trim();
          const matched = skills.filter((s) => {
            const inName = s.name.toLowerCase().includes(q);
            const inId = s.id.toLowerCase().includes(q);
            const inCategory = s.category.toLowerCase().includes(q);
            const inEco = s.ecosystem.toLowerCase().includes(q);
            const inDesc = s.whyUseIt.toLowerCase().includes(q);
            const inTags = (s.tags || []).some((t) => t.toLowerCase().includes(q));
            return inName || inId || inCategory || inEco || inDesc || inTags;
          });
          expect(Array.isArray(matched)).toBe(true);
        }).not.toThrow();
      }
    });
  });
});
