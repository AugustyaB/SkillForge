import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  normalizePath,
  detectManifestInDir,
  findCandidateScopes,
  resolveScopePath,
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
      expect(normalizePath('packages\\server\\dist\\')).toBe('packages/server/dist');
      expect(normalizePath('foo//bar///baz')).toBe('foo/bar/baz');
      expect(normalizePath('')).toBe('');
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
});
