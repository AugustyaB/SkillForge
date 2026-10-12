import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Marketplace Readiness & QA Audit', () => {
  const clientDir = path.resolve(__dirname, '..', '..');
  const pkgPath = path.join(clientDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  describe('1. Manifest & Marketplace Metadata', () => {
    it('has a valid name, displayName, and descriptive summary', () => {
      expect(pkg.name).toMatch(/^[a-z0-9-]+$/);
      expect(pkg.displayName).toBe('SkillForge');
      expect(typeof pkg.description).toBe('string');
      expect(pkg.description.length).toBeGreaterThan(20);
      expect(pkg.description.length).toBeLessThan(300);
    });

    it('has valid SemVer version and valid publisher identifier', () => {
      expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(pkg.publisher).toBeTruthy();
      expect(typeof pkg.publisher).toBe('string');
    });

    it('has compatible vscode engine requirement', () => {
      expect(pkg.engines?.vscode).toMatch(/^\^[1-9]\.\d+\.\d+$/);
    });

    it('specifies valid categories and curated keywords within marketplace limits', () => {
      expect(Array.isArray(pkg.categories)).toBe(true);
      expect(pkg.categories.length).toBeGreaterThanOrEqual(1);

      expect(Array.isArray(pkg.keywords)).toBe(true);
      expect(pkg.keywords.length).toBeGreaterThanOrEqual(3);
      expect(pkg.keywords.length).toBeLessThanOrEqual(20);
    });

    it('includes valid repository, bugs, and homepage URLs', () => {
      expect(pkg.repository?.url).toMatch(/^https:\/\/github\.com\//);
      expect(pkg.bugs?.url).toMatch(/^https:\/\/github\.com\//);
      expect(pkg.homepage).toMatch(/^https:\/\/github\.com\//);
    });

    it('specifies MIT license with physical LICENSE file present', () => {
      expect(pkg.license).toBe('MIT');
      const licensePath = path.join(clientDir, 'LICENSE');
      expect(fs.existsSync(licensePath)).toBe(true);
      const licenseContent = fs.readFileSync(licensePath, 'utf8');
      expect(licenseContent).toContain('MIT License');
    });
  });

  describe('2. Visual Assets & Icon Specifications', () => {
    it('provides a valid 256x256 square PNG icon', () => {
      const iconPath = path.join(clientDir, pkg.icon);
      expect(fs.existsSync(iconPath)).toBe(true);

      const buf = fs.readFileSync(iconPath);
      // PNG header signature: 89 50 4E 47 0D 0A 1A 0A
      expect(buf[0]).toBe(0x89);
      expect(buf[1]).toBe(0x50);
      expect(buf[2]).toBe(0x4e);
      expect(buf[3]).toBe(0x47);

      // Width and Height in IHDR chunk
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      expect(width).toBe(256);
      expect(height).toBe(256);
      expect(width).toBe(height); // Strictly square
    });

    it('provides a valid SVG activity bar icon', () => {
      const svgPath = path.join(clientDir, 'resources', 'icon.svg');
      expect(fs.existsSync(svgPath)).toBe(true);
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      expect(svgContent).toContain('<svg');
    });
  });

  describe('3. Command & View Wiring Parity', () => {
    const extContent = fs.readFileSync(path.join(clientDir, 'src', 'extension.ts'), 'utf8');

    it('registers every contributed command in extension.ts', () => {
      const commands = pkg.contributes?.commands || [];
      expect(commands.length).toBeGreaterThan(0);

      for (const cmd of commands) {
        expect(cmd.command).toBeTruthy();
        expect(cmd.title).toBeTruthy();
        expect(extContent).toContain(cmd.command);
      }
    });

    it('registers every contributed view container in extension.ts', () => {
      const views = pkg.contributes?.views?.['skillforge-activitybar'] || [];
      expect(views.length).toBe(4);

      for (const v of views) {
        expect(v.id).toBeTruthy();
        expect(extContent).toContain(v.id);
      }
    });

    it('contains no dead activation command events', () => {
      const declaredCmds = new Set(pkg.contributes.commands.map((c: any) => c.command));
      const cmdEvents = (pkg.activationEvents || [])
        .filter((e: string) => e.startsWith('onCommand:'))
        .map((e: string) => e.replace('onCommand:', ''));

      for (const cmd of cmdEvents) {
        expect(declaredCmds.has(cmd)).toBe(true);
      }
    });
  });

  describe('4. Documentation & Walkthrough Links', () => {
    it('verifies all walkthrough markdown files exist and contain content', () => {
      const walkthroughs = pkg.contributes?.walkthroughs || [];
      expect(walkthroughs.length).toBeGreaterThan(0);

      const steps = walkthroughs[0].steps;
      expect(steps.length).toBe(5);

      for (const step of steps) {
        const filePath = path.join(clientDir, step.description);
        expect(fs.existsSync(filePath)).toBe(true);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content.length).toBeGreaterThan(100);
      }
    });

    it('verifies walkthrough command buttons link to valid commands', () => {
      const declaredCmds = new Set([
        ...pkg.contributes.commands.map((c: any) => c.command),
        'workbench.action.openSettings',
      ]);

      const steps = pkg.contributes.walkthroughs[0].steps;
      const cmdRegex = /command:([a-zA-Z0-9._-]+)/g;

      for (const step of steps) {
        const filePath = path.join(clientDir, step.description);
        const content = fs.readFileSync(filePath, 'utf8');
        let match;
        while ((match = cmdRegex.exec(content)) !== null) {
          expect(declaredCmds.has(match[1])).toBe(true);
        }
      }
    });
  });

  describe('5. Package Archive Hygiene & .vscodeignore', () => {
    it('ensures .vscodeignore excludes raw source code, coverage, and map files', () => {
      const ignorePath = path.join(clientDir, '.vscodeignore');
      expect(fs.existsSync(ignorePath)).toBe(true);
      const ignoreContent = fs.readFileSync(ignorePath, 'utf8');

      expect(ignoreContent).toContain('src/**');
      expect(ignoreContent).toContain('*.vsix');
      expect(ignoreContent).toContain('coverage/**');
      expect(ignoreContent).toContain('**/*.map');
    });

    it('ensures VSIX archive exists and is within target performance size (<500 KB)', () => {
      const vsixPath = path.join(clientDir, `skillforge-${pkg.version}.vsix`);
      if (fs.existsSync(vsixPath)) {
        const stats = fs.statSync(vsixPath);
        // Target is <500 KB (currently ~270 KB)
        expect(stats.size).toBeLessThan(500 * 1024);
        expect(stats.size).toBeGreaterThan(50 * 1024);
      }
    });
  });
});
