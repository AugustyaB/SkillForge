import * as fs from 'node:fs';
import * as path from 'node:path';
import type { DetectedPackage, WorkspaceContext } from '@skillforge/shared';
import type { ScannerOptions } from './types.js';

/**
 * Parses package.json content extracting dependencies and devDependencies
 */
export function parsePackageJson(content: string, sourceFile = 'package.json'): DetectedPackage[] {
  const detected: DetectedPackage[] = [];
  try {
    const json = JSON.parse(content);
    const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) };

    for (const [name, version] of Object.entries(deps)) {
      detected.push({
        name,
        version: typeof version === 'string' ? version : undefined,
        ecosystem: 'javascript',
        sourceFile,
      });
    }
  } catch {
    // Ignore parse error
  }
  return detected;
}

/**
 * Parses requirements.txt content stripping comments and version specifiers
 */
export function parseRequirementsTxt(
  content: string,
  sourceFile = 'requirements.txt'
): DetectedPackage[] {
  const detected: DetectedPackage[] = [];
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('-')) {
      continue;
    }

    // Split on version specifiers: ==, >=, <=, ~=, !=, <, >, ;
    const beforeVersion = line.split(/[=><~;!]/)[0]?.trim();
    // Strip extras like uvicorn[standard] -> uvicorn
    const name = beforeVersion?.split('[')[0]?.trim();

    if (name && /^[a-zA-Z0-9_\-.]+$/.test(name)) {
      detected.push({
        name: name.toLowerCase(),
        ecosystem: 'python',
        sourceFile,
      });
    }
  }

  return detected;
}

/**
 * Parses Cargo.toml content extracting crates under dependencies sections
 */
export function parseCargoToml(content: string, sourceFile = 'Cargo.toml'): DetectedPackage[] {
  const detected: DetectedPackage[] = [];
  const lines = content.split(/\r?\n/);
  let inDependencies = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('[') && line.endsWith(']')) {
      const section = line.toLowerCase();
      inDependencies =
        section === '[dependencies]' ||
        section === '[dev-dependencies]' ||
        section.startsWith('[dependencies.');
      continue;
    }

    if (inDependencies && line && !line.startsWith('#')) {
      const match = line.match(/^([a-zA-Z0-9_\-]+)\s*=/);
      if (match && match[1]) {
        detected.push({
          name: match[1].toLowerCase(),
          ecosystem: 'rust',
          sourceFile,
        });
      }
    }
  }

  return detected;
}

/**
 * Parses go.mod content extracting required modules
 */
export function parseGoMod(content: string, sourceFile = 'go.mod'): DetectedPackage[] {
  const detected: DetectedPackage[] = [];
  const lines = content.split(/\r?\n/);
  let inRequireBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('require (')) {
      inRequireBlock = true;
      continue;
    }
    if (inRequireBlock && line === ')') {
      inRequireBlock = false;
      continue;
    }

    if (inRequireBlock && line && !line.startsWith('//')) {
      const parts = line.split(/\s+/);
      const mod = parts[0];
      if (mod) {
        detected.push({
          name: mod,
          version: parts[1],
          ecosystem: 'go',
          sourceFile,
        });
      }
    } else if (line.startsWith('require ') && !line.startsWith('require (')) {
      const parts = line.replace('require ', '').trim().split(/\s+/);
      const mod = parts[0];
      if (mod) {
        detected.push({
          name: mod,
          version: parts[1],
          ecosystem: 'go',
          sourceFile,
        });
      }
    }
  }

  return detected;
}

/**
 * Parses pom.xml content extracting artifactId dependencies
 */
export function parsePomXml(content: string, sourceFile = 'pom.xml'): DetectedPackage[] {
  const detected: DetectedPackage[] = [];
  const regex = /<artifactId>([a-zA-Z0-9_\-.]+)<\/artifactId>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    if (name) {
      detected.push({
        name: name.toLowerCase(),
        ecosystem: 'java',
        sourceFile,
      });
    }
  }

  return detected;
}

export class WorkspaceScanner {
  /**
   * Scans a scoped folder for dependency manifests
   */
  public async scanScope(scopePath: string, _options?: ScannerOptions): Promise<WorkspaceContext> {
    const detected: DetectedPackage[] = [];

    if (!fs.existsSync(scopePath)) {
      return {
        scope: {
          mode: 'folder',
          paths: [scopePath],
          label: path.basename(scopePath) || 'Scope',
        },
        detectedStack: [],
        activeFileSignals: [],
        ecosystem: 'multi',
        technologies: [],
        alreadyInstalled: [],
      };
    }

    // Inspect candidate manifests directly in scope root
    const manifests = [
      { name: 'package.json', parser: parsePackageJson },
      { name: 'requirements.txt', parser: parseRequirementsTxt },
      { name: 'Cargo.toml', parser: parseCargoToml },
      { name: 'go.mod', parser: parseGoMod },
      { name: 'pom.xml', parser: parsePomXml },
    ];

    for (const { name, parser } of manifests) {
      const manifestPath = path.join(scopePath, name);
      if (fs.existsSync(manifestPath)) {
        try {
          const content = fs.readFileSync(manifestPath, 'utf-8');
          const packages = parser(content, name);
          detected.push(...packages);
        } catch {
          // Ignore read error
        }
      }
    }

    // Deduplicate packages by name
    const seen = new Set<string>();
    const uniquePackages: DetectedPackage[] = [];
    for (const pkg of detected) {
      const key = `${pkg.ecosystem}:${pkg.name.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePackages.push(pkg);
      }
    }

    // Determine ecosystem
    const ecosystems = new Set(uniquePackages.map((p) => p.ecosystem));
    let ecosystem = 'multi';
    if (ecosystems.size === 1) {
      ecosystem = Array.from(ecosystems)[0]!;
    } else if (ecosystems.size === 0) {
      ecosystem = 'multi';
    }

    const alreadyInstalled = uniquePackages.map((p) => p.name.toLowerCase());

    return {
      scope: {
        mode: 'folder',
        paths: [scopePath],
        label: path.basename(scopePath) || 'Workspace',
      },
      detectedStack: uniquePackages,
      activeFileSignals: [],
      ecosystem,
      technologies: alreadyInstalled,
      alreadyInstalled,
    };
  }
}
