import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import type { InferredSkill } from '@skillforge/shared';
import { TerminalRunner } from '../terminal/terminal-runner.js';

export interface CatalogQuickPickItem extends vscode.QuickPickItem {
  skill: InferredSkill;
}

/**
 * Interactive Catalog Browser for exploring curated and workspace-private skills.
 */
export class CatalogBrowser {
  private static cachedSkills: InferredSkill[] | undefined;

  /**
   * Retrieves the in-memory cached skills catalog, if loaded.
   */
  public static getCachedCatalog(): InferredSkill[] | undefined {
    return CatalogBrowser.cachedSkills;
  }

  /**
   * Loads catalog skills from bundled assets with fallback to server data.
   */
  public static loadCatalog(extensionUri: vscode.Uri, workspaceRoot?: string): InferredSkill[] {
    const candidates = [
      vscode.Uri.joinPath(extensionUri, 'dist', 'skills.json').fsPath,
      path.resolve(__dirname, 'skills.json'),
      path.resolve(__dirname, '../skills.json'),
      path.resolve(__dirname, '../../server/src/data/skills.json'),
      path.resolve(__dirname, '../../../server/src/data/skills.json'),
      path.resolve(__dirname, '../../../../server/src/data/skills.json'),
      path.resolve(process.cwd(), 'packages/server/src/data/skills.json'),
      path.resolve(process.cwd(), 'server/src/data/skills.json'),
    ];

    let skills: InferredSkill[] = [];
    for (const file of candidates) {
      if (fs.existsSync(file)) {
        try {
          const raw = fs.readFileSync(file, 'utf8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            skills = parsed;
            break;
          }
        } catch {
          // Continue to next candidate
        }
      }
    }

    // Overlay workspace private catalog if present
    if (workspaceRoot) {
      const wsConfigPath = path.join(workspaceRoot, '.skillforge.json');
      if (fs.existsSync(wsConfigPath)) {
        try {
          const rawWs = fs.readFileSync(wsConfigPath, 'utf8');
          const wsParsed = JSON.parse(rawWs);
          const wsSkills: InferredSkill[] = Array.isArray(wsParsed)
            ? wsParsed
            : Array.isArray(wsParsed?.skills)
            ? wsParsed.skills
            : [];

          for (const s of wsSkills) {
            skills.push({ ...s, source: 'workspace' });
          }
        } catch {
          // Ignore corrupted workspace config in loader
        }
      }
    }

    CatalogBrowser.cachedSkills = skills;
    return skills;
  }

  /**
   * Displays the interactive QuickPick catalog browser.
   */
  public static async showCatalog(
    extensionUri: vscode.Uri,
    workspaceRoot?: string,
    onCompareRequest?: (skillId: string) => Promise<void>,
    onGenerateRuleRequest?: (skillId: string) => Promise<void>
  ): Promise<void> {
    const skills = CatalogBrowser.loadCatalog(extensionUri, workspaceRoot);

    if (skills.length === 0) {
      vscode.window.showWarningMessage('SkillForge: Unable to load skills catalog data.');
      return;
    }

    const quickPick = vscode.window.createQuickPick<CatalogQuickPickItem>();
    quickPick.title = `SkillForge Catalog (${skills.length} Vetted Libraries & Tools)`;
    quickPick.placeholder = 'Search by name, category, ecosystem, or shorthand (e.g. k8s, orm, jwt, zustand)...';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;

    const buildItems = (filteredSkills: InferredSkill[]): CatalogQuickPickItem[] => {
      return filteredSkills.map((skill) => {
        const isDep = skill.isDeprecated ? ' ⚠️ Deprecated' : '';
        const isWs = skill.source === 'workspace' ? ' [📦 Workspace]' : '';
        const licenseBadge = skill.license ? ` • ${skill.license}` : '';
        const avoidNote = skill.whenNotToUse && skill.whenNotToUse.length > 0
          ? ` • Avoid if: ${skill.whenNotToUse[0]}`
          : '';
        const trustTier = (skill as unknown as { trustTier?: string }).trustTier || skill.difficulty;

        return {
          label: `${skill.name}${isDep}${isWs}`,
          description: `[${trustTier}] [${skill.category}] [${skill.ecosystem}]${licenseBadge}`,
          detail: `${skill.whyUseIt}${avoidNote}`,
          skill,
        };
      });
    };

    quickPick.items = buildItems(skills);

    quickPick.onDidChangeValue((value) => {
      const q = value.toLowerCase().trim();
      if (!q) {
        quickPick.items = buildItems(skills);
        return;
      }

      // Safe substring matching — immune to regex syntax errors with c++, *, [, etc.
      const matched = skills.filter((s) => {
        const inName = s.name.toLowerCase().includes(q);
        const inId = s.id.toLowerCase().includes(q);
        const inCategory = s.category.toLowerCase().includes(q);
        const inEco = s.ecosystem.toLowerCase().includes(q);
        const inDesc = s.whyUseIt.toLowerCase().includes(q);
        const inTags = (s.tags || []).some((t) => t.toLowerCase().includes(q));
        const inIndicators = (s.stackIndicators || []).some((ind) => ind.toLowerCase().includes(q));
        return inName || inId || inCategory || inEco || inDesc || inTags || inIndicators;
      });

      quickPick.items = buildItems(matched);
    });

    quickPick.onDidAccept(async () => {
      const selected = quickPick.selectedItems[0];
      if (!selected) return;

      quickPick.hide();
      await CatalogBrowser.showSkillActions(
        selected.skill,
        workspaceRoot,
        onCompareRequest,
        onGenerateRuleRequest
      );
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  }

  /**
   * Action palette for a selected skill.
   */
  private static async showSkillActions(
    skill: InferredSkill,
    _workspaceRoot?: string,
    onCompareRequest?: (skillId: string) => Promise<void>,
    onGenerateRuleRequest?: (skillId: string) => Promise<void>
  ): Promise<void> {
    const packageName = skill.stackIndicators?.[0] || skill.id;
    const installCmd = TerminalRunner.deriveInstallCommand(packageName, skill.ecosystem);

    const items: (vscode.QuickPickItem & { action: string })[] = [
      {
        label: '$(terminal) Copy Install Command',
        description: installCmd || `Install ${skill.name}`,
        action: 'copyInstall',
      },
      {
        label: '$(robot) Generate AI Rule Directive',
        description: `Create SKILL.md or .cursor/rules for ${skill.name}`,
        action: 'generateRule',
      },
      {
        label: '$(split-horizontal) Compare Against Competitor',
        description: `Compare ${skill.name} against alternatives (${(skill.alternatives || []).slice(0, 3).join(', ')})`,
        action: 'compare',
      },
    ];

    if (skill.officialUrl) {
      items.push({
        label: '$(link-external) Open Official Documentation',
        description: skill.officialUrl,
        action: 'openDocs',
      });
    }

    const tier = (skill as unknown as { trustTier?: string }).trustTier || skill.difficulty;
    const selected = await vscode.window.showQuickPick(items, {
      title: `${skill.name} (${tier.toUpperCase()}) — ${skill.category}`,
      placeHolder: 'Select an action for this library',
    });

    if (!selected) return;

    switch (selected.action) {
      case 'copyInstall': {
        if (installCmd) {
          await vscode.env.clipboard.writeText(installCmd);
          vscode.window.showInformationMessage(`Copied to clipboard: ${installCmd}`);
        } else {
          vscode.window.showInformationMessage(`No default package command for ${skill.name}`);
        }
        break;
      }
      case 'generateRule': {
        if (onGenerateRuleRequest) {
          await onGenerateRuleRequest(skill.id);
        } else {
          vscode.commands.executeCommand('skillforge.generateAgentSkill', skill.id);
        }
        break;
      }
      case 'compare': {
        if (onCompareRequest) {
          await onCompareRequest(skill.id);
        } else {
          vscode.commands.executeCommand('skillforge.compareSkills', skill.id);
        }
        break;
      }
      case 'openDocs': {
        if (skill.officialUrl) {
          vscode.env.openExternal(vscode.Uri.parse(skill.officialUrl));
        }
        break;
      }
    }
  }
}
