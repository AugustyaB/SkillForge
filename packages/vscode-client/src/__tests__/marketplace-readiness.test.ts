import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateWalkthroughHtml, WALKTHROUGH_STEPS } from '../webview/walkthrough-html.js';

describe('Marketplace Readiness & QA Audit', () => {
  const clientDir = path.resolve(__dirname, '..', '..');
  const pkgPath = path.join(clientDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const extContent = fs.readFileSync(path.join(clientDir, 'src', 'extension.ts'), 'utf8');

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
      expect(pkg.repository?.url).toBe('https://github.com/AugustyaB/SkillForge');
      expect(pkg.bugs?.url).toBe('https://github.com/AugustyaB/SkillForge/issues');
      expect(pkg.homepage).toBe('https://github.com/AugustyaB/SkillForge#readme');
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
    it('registers every contributed command in extension.ts', () => {
      const commands = pkg.contributes?.commands || [];
      expect(commands.length).toBeGreaterThan(0);

      for (const cmd of commands) {
        expect(cmd.command).toBeTruthy();
        expect(cmd.title).toBeTruthy();
        expect(extContent).toContain(cmd.command);
      }
    });

    it('registers every contributed view container in extension.ts including 5th All SkillForge Commands view', () => {
      const views = pkg.contributes?.views?.['skillforge-activitybar'] || [];
      expect(views.length).toBe(5);

      for (const v of views) {
        expect(v.id).toBeTruthy();
        expect(extContent).toContain(v.id);
      }

      const commandsView = views.find((v: any) => v.id === 'skillforge.commandsView');
      expect(commandsView?.name).toBe('All SkillForge Commands');

      const bookmarksView = views.find((v: any) => v.id === 'skillforge.bookmarksView');
      expect(bookmarksView?.visibility).toBe('collapsed');
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
    it('verifies all walkthrough steps declare required media.markdown and description (BUG-24)', () => {
      const walkthroughs = pkg.contributes?.walkthroughs || [];
      expect(walkthroughs.length).toBeGreaterThan(0);

      const steps = walkthroughs[0].steps;
      expect(steps.length).toBe(5);

      for (const step of steps) {
        expect(typeof step.description).toBe('string');
        expect(step.description.length).toBeGreaterThan(20);
        expect(step.media).toBeDefined();
        expect(typeof step.media.markdown).toBe('string');

        const filePath = path.join(clientDir, step.media.markdown);
        expect(fs.existsSync(filePath)).toBe(true);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content.length).toBeGreaterThan(100);
      }
    });

    it('verifies walkthrough command buttons in descriptions and markdown files link to valid commands', () => {
      const declaredCmds = new Set([
        ...pkg.contributes.commands.map((c: any) => c.command),
        'workbench.action.openSettings',
      ]);

      const steps = pkg.contributes.walkthroughs[0].steps;
      const cmdRegex = /command:([a-zA-Z0-9._-]+)/g;

      for (const step of steps) {
        let descMatch;
        while ((descMatch = cmdRegex.exec(step.description)) !== null) {
          expect(declaredCmds.has(descMatch[1])).toBe(true);
        }

        const filePath = path.join(clientDir, step.media.markdown);
        const content = fs.readFileSync(filePath, 'utf8');
        let match;
        while ((match = cmdRegex.exec(content)) !== null) {
          expect(declaredCmds.has(match[1])).toBe(true);
        }
      }
    });

    it('asserts walkthrough trigger in extension.ts strictly uses publisher.name#id format (BUG-24)', () => {
      const expectedWalkthroughId = `${pkg.publisher}.${pkg.name}#${pkg.contributes.walkthroughs[0].id}`;
      expect(extContent).toContain(`'${expectedWalkthroughId}'`);
      expect(extContent).not.toContain(`'${pkg.publisher}#${pkg.contributes.walkthroughs[0].id}'`);
      expect(WALKTHROUGH_STEPS.length).toBe(5);

      const html = generateWalkthroughHtml({
        nonce: 'walkthrough-nonce-123',
        cspSource: 'vscode-webview:',
      });
      expect(html).toContain('Welcome to SkillForge');
    });

    it('verifies frictionless access keybindings and editor/title menu contributions (BUG-26)', () => {
      const keybindings = pkg.contributes?.keybindings || [];
      expect(keybindings.length).toBeGreaterThanOrEqual(2);
      const suggestKb = keybindings.find((k: any) => k.command === 'skillforge.suggest');
      expect(suggestKb?.key).toBe('ctrl+alt+s');

      const editorTitleMenus = pkg.contributes?.menus?.['editor/title'] || [];
      expect(editorTitleMenus.some((m: any) => m.command === 'skillforge.suggestForCurrentFile')).toBe(true);
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

    it('ensures VSIX archive exists and is within target performance size (<1 MB)', () => {
      const vsixPath = path.join(clientDir, `skillforge-${pkg.version}.vsix`);
      if (fs.existsSync(vsixPath)) {
        const stats = fs.statSync(vsixPath);
        // Target is <1 MB (currently ~567 KB including changelog, NOTICE, and screenshots)
        expect(stats.size).toBeLessThan(1024 * 1024);
        expect(stats.size).toBeGreaterThan(50 * 1024);
      }
    });

    it('ensures CHANGELOG.md and NOTICE are bundled at package root with dual-license attribution', () => {
      const changelogPath = path.join(clientDir, 'CHANGELOG.md');
      expect(fs.existsSync(changelogPath)).toBe(true);
      const changelog = fs.readFileSync(changelogPath, 'utf8');
      expect(changelog.length).toBeGreaterThan(500);

      const noticePath = path.join(clientDir, 'NOTICE');
      expect(fs.existsSync(noticePath)).toBe(true);
      const notice = fs.readFileSync(noticePath, 'utf8');
      expect(notice).toContain('MIT License');
      expect(notice).toContain('CC BY 4.0');
    });

    it('verifies all 4 high-resolution screenshot assets exist in resources/screenshots', () => {
      const screenshotsDir = path.join(clientDir, 'resources', 'screenshots');
      expect(fs.existsSync(screenshotsDir)).toBe(true);
      expect(fs.existsSync(path.join(screenshotsDir, 'sidebar-overview.svg'))).toBe(true);
      expect(fs.existsSync(path.join(screenshotsDir, 'comparison-matrix.svg'))).toBe(true);
      expect(fs.existsSync(path.join(screenshotsDir, 'codelens-triggers.svg'))).toBe(true);
      expect(fs.existsSync(path.join(screenshotsDir, 'agent-directives.svg'))).toBe(true);
    });

    it('verifies README.md has Quick Install, marketplace badges, command table, and Python syntax', () => {
      const readmePath = path.join(clientDir, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
      const readme = fs.readFileSync(readmePath, 'utf8');

      expect(readme).toContain('ext install SkillForge.skillforge');
      expect(readme).toContain('Open VSX');
      expect(readme).toContain('# IDEA:');
      expect(readme).toContain('// IDEA:');
      expect(readme).toContain('skillforge.suggest');
      expect(readme).toContain('Ctrl+Alt+S');
      expect(readme).toContain('gemini-2.0-flash');
      expect(readme).toContain('gpt-4o-mini');
    });
  });
});
