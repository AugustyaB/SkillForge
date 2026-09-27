import * as path from 'path';
import * as fs from 'fs';

export interface CandidateScope {
  name: string;
  relativePath: string;
  absolutePath: string;
  ecosystem: string;
  manifestFile: string;
}

const MANIFEST_PATTERNS = [
  { file: 'package.json', ecosystem: 'javascript' },
  { file: 'requirements.txt', ecosystem: 'python' },
  { file: 'pyproject.toml', ecosystem: 'python' },
  { file: 'Cargo.toml', ecosystem: 'rust' },
  { file: 'go.mod', ecosystem: 'go' },
  { file: 'pom.xml', ecosystem: 'java' },
];

/**
 * Normalizes a file or directory path to use forward slashes uniformly.
 */
export function normalizePath(inputPath: string): string {
  if (!inputPath) return '';
  return inputPath.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
}

/**
 * Checks if a directory contains any supported project manifests.
 */
export function detectManifestInDir(
  dirPath: string
): { manifestFile: string; ecosystem: string } | null {
  try {
    for (const pattern of MANIFEST_PATTERNS) {
      const fullPath = path.join(dirPath, pattern.file);
      if (fs.existsSync(fullPath)) {
        return { manifestFile: pattern.file, ecosystem: pattern.ecosystem };
      }
    }
  } catch {
    // Ignore I/O or permission errors
  }
  return null;
}

/**
 * Scans top-level and 1-level deep subdirectories to discover monorepo packages/workspaces.
 * Limited to depth 2 to prevent disk lag in massive repositories.
 */
export function findCandidateScopes(
  workspaceRoot: string,
  maxDepth = 3
): CandidateScope[] {
  const normalizedRoot = normalizePath(workspaceRoot);
  if (!normalizedRoot || !fs.existsSync(normalizedRoot)) {
    return [];
  }

  const results: CandidateScope[] = [];

  function scan(currentDir: string, currentDepth: number): void {
    if (currentDepth > maxDepth) return;

    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      // Check current directory for manifests (unless it is the root itself)
      if (currentDir !== normalizedRoot) {
        const detected = detectManifestInDir(currentDir);
        if (detected) {
          const relative = path.relative(normalizedRoot, currentDir);
          const normalizedRelative = normalizePath(relative);
          results.push({
            name: path.basename(currentDir),
            relativePath: normalizedRelative,
            absolutePath: normalizePath(currentDir),
            ecosystem: detected.ecosystem,
            manifestFile: detected.manifestFile,
          });
        }
      }

      // Recurse into subdirectories (skipping common build/noise directories)
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const name = entry.name;
          if (
            name === 'node_modules' ||
            name === '.git' ||
            name === 'dist' ||
            name === 'build' ||
            name === 'target' ||
            name === '.vscode' ||
            name.startsWith('.')
          ) {
            continue;
          }
          scan(path.join(currentDir, name), currentDepth + 1);
        }
      }
    } catch {
      // Ignore unreadable directories
    }
  }

  scan(normalizedRoot, 0);
  return results;
}

/**
 * Validates a selected scope path against the workspace root.
 * If the path no longer exists on disk, falls back to the workspace root.
 */
export function resolveScopePath(
  workspaceRoot: string,
  selectedRelativePath?: string
): { isValid: boolean; absolutePath: string; isRoot: boolean } {
  const normalizedRoot = normalizePath(workspaceRoot);
  if (!normalizedRoot || !fs.existsSync(normalizedRoot)) {
    return { isValid: false, absolutePath: '', isRoot: true };
  }

  if (!selectedRelativePath || selectedRelativePath === '.' || selectedRelativePath === '') {
    return { isValid: true, absolutePath: normalizedRoot, isRoot: true };
  }

  const resolved = normalizePath(path.join(normalizedRoot, selectedRelativePath));
  if (fs.existsSync(resolved) && resolved.startsWith(normalizedRoot)) {
    return { isValid: true, absolutePath: resolved, isRoot: false };
  }

  // Graceful fallback to root
  return { isValid: false, absolutePath: normalizedRoot, isRoot: true };
}
