import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export type WorkspaceFileType =
  | 'workspace-config'
  | 'skill-rule'
  | 'cursor-rule'
  | 'claude-skill'
  | 'agent-directive'
  | 'copilot-instructions';

export interface WorkspaceSkillFile {
  name: string;
  relativePath: string;
  absolutePath: string;
  uri: vscode.Uri;
  fileSizeBytes: number;
  fileType: WorkspaceFileType;
  summary: string;
}

export const WORKSPACE_FILE_INCLUDE_GLOB =
  '**/{.skillforge.json,.skillforge/skills.json,SKILL.md,AGENTS.md,.cursor/rules/*.mdc,.claude/skills/*.md,.github/copilot-instructions.md}';

export const WORKSPACE_FILE_EXCLUDE_GLOB =
  '**/{node_modules,.git,dist,build,.venv,.cache,coverage}/**';

/**
 * Determines the category of skill or directive file.
 */
export function classifySkillFile(filePath: string): { type: WorkspaceFileType; summary: string } {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();

  if (normalized.endsWith('.skillforge.json') || normalized.endsWith('.skillforge/skills.json')) {
    return {
      type: 'workspace-config',
      summary: 'SkillForge Workspace Private Catalog Configuration',
    };
  }
  if (normalized.endsWith('skill.md')) {
    return {
      type: 'skill-rule',
      summary: 'Agent Skill Directive (Anthropic / Claude Code)',
    };
  }
  if (normalized.includes('.cursor/rules/') && normalized.endsWith('.mdc')) {
    return {
      type: 'cursor-rule',
      summary: 'Cursor IDE MDC Rule',
    };
  }
  if (normalized.includes('.claude/skills/') && normalized.endsWith('.md')) {
    return {
      type: 'claude-skill',
      summary: 'Claude Code Project Skill',
    };
  }
  if (normalized.endsWith('agents.md')) {
    return {
      type: 'agent-directive',
      summary: 'Root AI Agent Behavior Directive',
    };
  }
  if (normalized.endsWith('copilot-instructions.md')) {
    return {
      type: 'copilot-instructions',
      summary: 'GitHub Copilot Workspace Instructions',
    };
  }

  return {
    type: 'skill-rule',
    summary: 'AI Coding Rule Directive',
  };
}

/**
 * Fast, resilient workspace scanner for AI coding rules and SkillForge configuration files.
 */
export class WorkspaceFileScanner {
  /**
   * Scans the active workspace or designated root for AI skill and directive files.
   */
  public static async scanWorkspace(customRoot?: string): Promise<WorkspaceSkillFile[]> {
    // 1. If VS Code findFiles API is available, use fast glob engine
    if (vscode.workspace && typeof vscode.workspace.findFiles === 'function') {
      try {
        const uris = await vscode.workspace.findFiles(
          WORKSPACE_FILE_INCLUDE_GLOB,
          WORKSPACE_FILE_EXCLUDE_GLOB,
          100 // Cap to prevent UI stalls
        );

        const results: WorkspaceSkillFile[] = [];
        for (const uri of uris) {
          try {
            const stat = await vscode.workspace.fs.stat(uri);
            const relative = vscode.workspace.asRelativePath(uri);
            const { type, summary } = classifySkillFile(uri.fsPath);

            results.push({
              name: path.basename(uri.fsPath),
              relativePath: relative,
              absolutePath: uri.fsPath,
              uri,
              fileSizeBytes: stat.size,
              fileType: type,
              summary,
            });
          } catch {
            // Skip unreadable files without failing the scan
          }
        }

        return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
      } catch {
        // Fallback to manual recursive scan below if findFiles threw
      }
    }

    // 2. Headless / Node fs fallback (used in unit tests and standalone execution)
    const roots = customRoot
      ? [customRoot]
      : (vscode.workspace.workspaceFolders || []).map((wf) => wf.uri.fsPath);

    if (roots.length === 0) {
      return [];
    }

    const results: WorkspaceSkillFile[] = [];
    for (const root of roots) {
      if (!fs.existsSync(root)) continue;
      WorkspaceFileScanner.scanDirectoryNode(root, root, results);
    }

    return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private static scanDirectoryNode(
    currentDir: string,
    workspaceRoot: string,
    collector: WorkspaceSkillFile[],
    depth = 0
  ): void {
    if (depth > 6 || collector.length >= 100) return;

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    const ignored = new Set([
      'node_modules',
      '.git',
      'dist',
      'build',
      '.venv',
      '.cache',
      'coverage',
      'out',
    ]);

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!ignored.has(entry.name)) {
          WorkspaceFileScanner.scanDirectoryNode(fullPath, workspaceRoot, collector, depth + 1);
        }
      } else if (entry.isFile()) {
        const { type, summary } = classifySkillFile(fullPath);
        const relative = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');

        // Check if file matches our tracked names
        const nameLower = entry.name.toLowerCase();
        const matchesTracked =
          nameLower === '.skillforge.json' ||
          nameLower === 'skill.md' ||
          nameLower === 'agents.md' ||
          nameLower === 'copilot-instructions.md' ||
          (nameLower.endsWith('.mdc') && relative.includes('.cursor/rules/')) ||
          (nameLower.endsWith('.md') && relative.includes('.claude/skills/'));

        if (matchesTracked) {
          try {
            const stat = fs.statSync(fullPath);
            collector.push({
              name: entry.name,
              relativePath: relative,
              absolutePath: fullPath,
              uri: vscode.Uri.file(fullPath),
              fileSizeBytes: stat.size,
              fileType: type,
              summary,
            });
          } catch {
            // Ignore unreadable stat
          }
        }
      }
    }
  }
}
