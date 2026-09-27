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

export interface InstalledPackageInfo {
  name: string;
  version?: string;
  ecosystem?: string;
  sourceFile?: string;
}

/**
 * Reads installed packages and dependencies from supported project manifests in a scope directory.
 * Safely handles missing files, malformed JSON, and unexpected formatting.
 */
export function readInstalledPackagesFromScope(scopePath: string): InstalledPackageInfo[] {
  if (!scopePath || typeof scopePath !== 'string') {
    return [];
  }

  const normalized = normalizePath(scopePath);
  if (!fs.existsSync(normalized)) {
    return [];
  }

  const results: InstalledPackageInfo[] = [];
  const seen = new Set<string>();

  // 1. Check package.json (Node / JavaScript / TypeScript)
  const pkgJsonPath = path.join(normalized, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const content = fs.readFileSync(pkgJsonPath, 'utf8');
      const data = JSON.parse(content);
      const deps = { ...(data.dependencies || {}), ...(data.devDependencies || {}) };
      for (const [name, version] of Object.entries(deps)) {
        const cleanName = name.trim();
        if (cleanName && !seen.has(`js:${cleanName}`)) {
          seen.add(`js:${cleanName}`);
          results.push({
            name: cleanName,
            version: typeof version === 'string' ? version.trim() : undefined,
            ecosystem: 'javascript',
            sourceFile: 'package.json',
          });
        }
      }
    } catch {
      // Ignore JSON parse errors or invalid structure
    }
  }

  // 2. Check requirements.txt (Python)
  const reqPath = path.join(normalized, 'requirements.txt');
  if (fs.existsSync(reqPath)) {
    try {
      const content = fs.readFileSync(reqPath, 'utf8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('-')) {
          continue;
        }
        // Match package name and optional version operator: e.g. flask==2.0.1, torch>=2.0
        const match = trimmed.match(/^([a-zA-Z0-9_\-\.]+)(?:\s*([=><~]=?)\s*([^\s;#]+))?/);
        if (match && match[1]) {
          const name = match[1].trim();
          if (name && !seen.has(`py:${name}`)) {
            seen.add(`py:${name}`);
            results.push({
              name,
              version: match[3] ? `${match[2] || ''}${match[3]}`.trim() : undefined,
              ecosystem: 'python',
              sourceFile: 'requirements.txt',
            });
          }
        }
      }
    } catch {
      // Ignore file reading errors
    }
  }

  // 3. Check Cargo.toml (Rust)
  const cargoPath = path.join(normalized, 'Cargo.toml');
  if (fs.existsSync(cargoPath)) {
    try {
      const content = fs.readFileSync(cargoPath, 'utf8');
      const lines = content.split(/\r?\n/);
      let inDepsSection = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('[')) {
          inDepsSection = /^\[(dependencies|dev-dependencies)\]/i.test(trimmed);
          continue;
        }

        if (inDepsSection && trimmed && !trimmed.startsWith('#')) {
          // Simple match: pkg = "1.0" or pkg = { version = "1.0", ... }
          const match = trimmed.match(/^([a-zA-Z0-9_\-]+)\s*=\s*(?:"([^"]+)"|\{[^}]*version\s*=\s*"([^"]+)")/);
          if (match && match[1]) {
            const name = match[1].trim();
            if (name && !seen.has(`rust:${name}`)) {
              seen.add(`rust:${name}`);
              results.push({
                name,
                version: match[2] || match[3] || undefined,
                ecosystem: 'rust',
                sourceFile: 'Cargo.toml',
              });
            }
          }
        }
      }
    } catch {
      // Ignore file reading errors
    }
  }

  return results;
}

