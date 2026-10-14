import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  normalizePath,
  isPathInsideRoot,
  detectManifestInDir,
  findCandidateScopes,
  resolveScopePath,
  readInstalledPackagesFromScope,
} from '../context/scope-utils.js';

describe('ScopeUtils', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skillforge-scope-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('normalizePath', () => {
    it('normalizes Windows backslashes to forward slashes and strips trailing slashes', () => {
      expect(normalizePath('C:\\Users\\dev\\project\\')).toBe('C:/Users/dev/project');
      expect(normalizePath('c:\\users\\dev\\project')).toBe('C:/users/dev/project');
      expect(normalizePath('packages\\server\\dist\\')).toBe('packages/server/dist');
      expect(normalizePath('foo//bar///baz')).toBe('foo/bar/baz');
      expect(normalizePath('')).toBe('');
    });
  });

  describe('isPathInsideRoot', () => {
    it('returns true for root itself or child subdirectories', () => {
      expect(isPathInsideRoot('C:/projects/app', 'C:/projects/app')).toBe(true);
      expect(isPathInsideRoot('C:/projects/app', 'C:/projects/app/frontend')).toBe(true);
      expect(isPathInsideRoot('c:/projects/app', 'C:/projects/app/packages/sub')).toBe(true);
    });

    it('returns false for sibling directories (preventing prefix traps)', () => {
      expect(isPathInsideRoot('C:/projects/app', 'C:/projects/app-sibling')).toBe(false);
      expect(isPathInsideRoot('C:/projects/app', 'C:/projects/app2')).toBe(false);
      expect(isPathInsideRoot('/home/user/app', '/home/user/app-other')).toBe(false);
    });

    it('returns false for directory traversal and cross-drive paths', () => {
      expect(isPathInsideRoot('C:/projects/app', 'C:/projects/app/../../etc')).toBe(false);
      expect(isPathInsideRoot('C:/projects/app', 'D:/projects/app/frontend')).toBe(false);
      expect(isPathInsideRoot('', 'C:/projects/app')).toBe(false);
    });
  });

  describe('detectManifestInDir', () => {
    it('detects package.json as javascript ecosystem', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      const detected = detectManifestInDir(tempDir);
      expect(detected).toEqual({ manifestFile: 'package.json', ecosystem: 'javascript' });
    });

    it('detects requirements.txt as python ecosystem', () => {
      fs.writeFileSync(path.join(tempDir, 'requirements.txt'), 'fastapi');
      const detected = detectManifestInDir(tempDir);
      expect(detected).toEqual({ manifestFile: 'requirements.txt', ecosystem: 'python' });
    });

    it('detects Cargo.toml as rust ecosystem', () => {
      fs.writeFileSync(path.join(tempDir, 'Cargo.toml'), '[package]');
      const detected = detectManifestInDir(tempDir);
      expect(detected).toEqual({ manifestFile: 'Cargo.toml', ecosystem: 'rust' });
    });

    it('returns null when no manifests exist', () => {
      expect(detectManifestInDir(tempDir)).toBeNull();
    });
  });

  describe('findCandidateScopes', () => {
    it('discovers monorepo package subdirectories with manifests', () => {
      // Create mock monorepo structure:
      // tempDir/packages/server/package.json
      // tempDir/packages/python-service/requirements.txt
      // tempDir/node_modules/ignored-pkg/package.json
      const serverDir = path.join(tempDir, 'packages', 'server');
      const pyDir = path.join(tempDir, 'packages', 'python-service');
      const nodeModulesDir = path.join(tempDir, 'node_modules', 'ignored-pkg');

      fs.mkdirSync(serverDir, { recursive: true });
      fs.mkdirSync(pyDir, { recursive: true });
      fs.mkdirSync(nodeModulesDir, { recursive: true });

      fs.writeFileSync(path.join(serverDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(pyDir, 'requirements.txt'), 'fastapi');
      fs.writeFileSync(path.join(nodeModulesDir, 'package.json'), '{}');

      const candidates = findCandidateScopes(tempDir);
      const relativePaths = candidates.map((c) => c.relativePath);

      expect(relativePaths).toContain('packages/server');
      expect(relativePaths).toContain('packages/python-service');
      // node_modules must be excluded
      expect(relativePaths.some((p) => p.includes('node_modules'))).toBe(false);
    });

    it('handles non-existent or empty root path gracefully', () => {
      expect(findCandidateScopes('')).toEqual([]);
      expect(findCandidateScopes('/non/existent/path/99999')).toEqual([]);
    });
  });

  describe('resolveScopePath', () => {
    it('resolves empty or root relative path to workspace root', () => {
      const res = resolveScopePath(tempDir, '');
      expect(res.isRoot).toBe(true);
      expect(res.isValid).toBe(true);
      expect(res.absolutePath).toBe(normalizePath(tempDir));
    });

    it('resolves valid subfolder relative path', () => {
      const sub = path.join(tempDir, 'apps', 'web');
      fs.mkdirSync(sub, { recursive: true });

      const res = resolveScopePath(tempDir, 'apps/web');
      expect(res.isRoot).toBe(false);
      expect(res.isValid).toBe(true);
      expect(res.absolutePath).toBe(normalizePath(sub));
    });

    it('falls back to workspace root when relative folder does not exist', () => {
      const res = resolveScopePath(tempDir, 'deleted/or/invalid/folder');
      expect(res.isRoot).toBe(true);
      expect(res.isValid).toBe(false);
      expect(res.absolutePath).toBe(normalizePath(tempDir));
    });
  });

  describe('readInstalledPackagesFromScope', () => {
    it('reads dependencies and devDependencies from package.json', () => {
      const pkgJson = {
        name: 'my-app',
        dependencies: {
          express: '^4.18.2',
          zod: '~3.22.0',
        },
        devDependencies: {
          typescript: '^5.0.0',
        },
      };
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

      const pkgs = readInstalledPackagesFromScope(tempDir);
      expect(pkgs).toEqual([
        { name: 'express', version: '^4.18.2', ecosystem: 'javascript', sourceFile: 'package.json' },
        { name: 'zod', version: '~3.22.0', ecosystem: 'javascript', sourceFile: 'package.json' },
        { name: 'typescript', version: '^5.0.0', ecosystem: 'javascript', sourceFile: 'package.json' },
      ]);
    });

    it('reads packages from requirements.txt with version operators and comments', () => {
      const reqTxt = `
# Comment line
fastapi==0.100.0
uvicorn>=0.22.0
pytest
-r other-requirements.txt
`;
      fs.writeFileSync(path.join(tempDir, 'requirements.txt'), reqTxt);

      const pkgs = readInstalledPackagesFromScope(tempDir);
      expect(pkgs).toEqual([
        { name: 'fastapi', version: '==0.100.0', ecosystem: 'python', sourceFile: 'requirements.txt' },
        { name: 'uvicorn', version: '>=0.22.0', ecosystem: 'python', sourceFile: 'requirements.txt' },
        { name: 'pytest', version: undefined, ecosystem: 'python', sourceFile: 'requirements.txt' },
      ]);
    });

    it('reads dependencies from Cargo.toml', () => {
      const cargoToml = `
[package]
name = "my-crate"
version = "0.1.0"

[dependencies]
serde = "1.0"
tokio = { version = "1.28", features = ["full"] }

[dev-dependencies]
criterion = "0.5"
`;
      fs.writeFileSync(path.join(tempDir, 'Cargo.toml'), cargoToml);

      const pkgs = readInstalledPackagesFromScope(tempDir);
      expect(pkgs).toEqual([
        { name: 'serde', version: '1.0', ecosystem: 'rust', sourceFile: 'Cargo.toml' },
        { name: 'tokio', version: '1.28', ecosystem: 'rust', sourceFile: 'Cargo.toml' },
        { name: 'criterion', version: '0.5', ecosystem: 'rust', sourceFile: 'Cargo.toml' },
      ]);
    });

    it('handles corrupt JSON in package.json gracefully without crashing', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{ invalid json ...');
      const pkgs = readInstalledPackagesFromScope(tempDir);
      expect(pkgs).toEqual([]);
    });

    it('handles empty, nonexistent, or hostile paths gracefully', () => {
      expect(readInstalledPackagesFromScope('')).toEqual([]);
      expect(readInstalledPackagesFromScope(null as unknown as string)).toEqual([]);
      expect(readInstalledPackagesFromScope('/non/existent/path/9999')).toEqual([]);
    });
  });
});

