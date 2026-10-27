import * as fs from 'fs';
import * as path from 'path';
import {
  type ProjectCharter,
  type ScaffoldProjectRequest,
  type ScaffoldProjectResult,
  validateScaffoldProjectRequest,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { AgentSkillGenerator } from './agent-skill-generator.js';

export class ProjectScaffolderEngine {
  private repository: SkillsRepository;
  private agentSkillGenerator: AgentSkillGenerator;

  constructor(repository?: SkillsRepository) {
    this.repository = repository || new SkillsRepository();
    this.agentSkillGenerator = new AgentSkillGenerator(this.repository);
  }

  /**
   * Scaffolds the formulated project into the target workspace non-destructively.
   */
  public scaffold(rawRequest: ScaffoldProjectRequest): ScaffoldProjectResult {
    const request = validateScaffoldProjectRequest(rawRequest);
    const { workspacePath, charter, targetRulesFormat, overwriteExisting } = request;

    // Defense against Directory Traversal (ADV-07)
    const resolvedRoot = path.resolve(workspacePath);
    if (!fs.existsSync(resolvedRoot)) {
      try {
        fs.mkdirSync(resolvedRoot, { recursive: true });
      } catch (err) {
        return {
          success: false,
          createdFiles: [],
          skippedFiles: [],
          warnings: [`Failed to create workspace directory: ${String(err)}`],
          message: `Workspace path does not exist and could not be created.`,
        };
      }
    }

    const createdFiles: string[] = [];
    const skippedFiles: string[] = [];
    const warnings: string[] = [];

    try {
      // 1. Scaffold PROJECT_SPEC.md
      const specContent = this.generateSpecMarkdown(charter);
      const specPath = path.join(resolvedRoot, 'PROJECT_SPEC.md');
      this.safeWriteFile(specPath, specContent, resolvedRoot, overwriteExisting, createdFiles, skippedFiles, warnings);

      // 2. Scaffold README.md (or README.skillforge.md if existing and overwrite is false)
      const readmeContent = this.generateReadmeMarkdown(charter);
      let targetReadme = path.join(resolvedRoot, 'README.md');
      if (fs.existsSync(targetReadme) && !overwriteExisting) {
        targetReadme = path.join(resolvedRoot, 'README.skillforge.md');
        warnings.push('Existing README.md preserved; wrote README.skillforge.md instead.');
      }
      this.safeWriteFile(targetReadme, readmeContent, resolvedRoot, true, createdFiles, skippedFiles, warnings);

      // 3. Scaffold .skillforge.json
      const configContent = JSON.stringify(
        {
          $schema: 'https://skillforge.dev/schemas/workspace-skills.json',
          version: '1.0.0',
          projectName: charter.title,
          projectCharterId: charter.id,
          recommendedSkills: charter.recommendedSkills,
          skills: [],
        },
        null,
        2
      );
      const configPath = path.join(resolvedRoot, '.skillforge.json');
      this.safeWriteFile(configPath, configContent, resolvedRoot, overwriteExisting, createdFiles, skippedFiles, warnings);

      // 4. Generate AI Coding Rules for top recommended skills
      const primarySkills = charter.recommendedSkills.slice(0, 3);
      for (const skillId of primarySkills) {
        try {
          const generated = this.agentSkillGenerator.generate({
            skillId,
            format: targetRulesFormat,
            workspacePath: resolvedRoot,
            includeKarpathyRules: true,
          });

          const ruleFilePath = path.join(resolvedRoot, generated.suggestedFilePath);
          this.safeWriteFile(
            ruleFilePath,
            generated.markdownContent,
            resolvedRoot,
            true, // rule files are skill-specific, safe to write
            createdFiles,
            skippedFiles,
            warnings
          );
        } catch (ruleErr) {
          warnings.push(`Could not generate agent skill for "${skillId}": ${String(ruleErr)}`);
        }
      }

      return {
        success: createdFiles.length > 0,
        createdFiles,
        skippedFiles,
        warnings,
        message: `Successfully scaffolded ${createdFiles.length} project files for "${charter.title}".`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        createdFiles,
        skippedFiles,
        warnings: [...warnings, msg],
        message: `Scaffolding failed: ${msg}`,
      };
    }
  }

  private safeWriteFile(
    targetPath: string,
    content: string,
    workspaceRoot: string,
    overwrite: boolean,
    created: string[],
    skipped: string[],
    warnings: string[]
  ) {
    const resolvedTarget = path.resolve(targetPath);
    // Boundary check (Directory Traversal Defense)
    if (!resolvedTarget.startsWith(workspaceRoot)) {
      warnings.push(`Blocked traversal write outside workspace: ${targetPath}`);
      skipped.push(targetPath);
      return;
    }

    if (fs.existsSync(resolvedTarget) && !overwrite) {
      skipped.push(targetPath);
      warnings.push(`File already exists (skipped): ${path.relative(workspaceRoot, resolvedTarget)}`);
      return;
    }

    const dir = path.dirname(resolvedTarget);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(resolvedTarget, content, 'utf8');
    created.push(path.relative(workspaceRoot, resolvedTarget));
  }

  private generateSpecMarkdown(charter: ProjectCharter): string {
    const skillsList = charter.recommendedSkills
      .map((id) => {
        const skill = this.repository.getSkillById(id);
        const name = skill?.name || id;
        const desc = skill?.description || 'Curated library';
        const url = skill?.officialUrl ? ` - [Docs](${skill.officialUrl})` : '';
        return `- **\`${id}\`** (${name}): ${desc}${url}`;
      })
      .join('\n');

    const milestonesList = charter.milestones
      .map((m) => {
        const deliverables = m.deliverables.map((d) => `  - [ ] ${d}`).join('\n');
        return `### Phase ${m.phase}: ${m.name}\n**Objective**: ${m.objective}\n**Deliverables**:\n${deliverables}\n`;
      })
      .join('\n');

    const antiPatterns = charter.antiPatternsToAvoid.length > 0
      ? charter.antiPatternsToAvoid.map((a) => `- ⚠️ ${a}`).join('\n')
      : '- Maintain clean separation of concerns and robust error handling.';

    return `# 📋 ${charter.title} — Project Specification

> **Tagline**: ${charter.tagline}  
> **Target Persona**: \`${charter.targetPersona}\`  
> **Domain**: \`${charter.domain}\`  
> **Time Budget**: \`${charter.timeBudget}\`  
> **Architecture Pattern**: \`${charter.architecturePattern}\`

---

## 🎯 1. Problem Statement
${charter.problemStatement}

---

## 💡 2. The Technical Twist (Key Differentiator)
${charter.technicalTwist}

---

## 🛠️ 3. Recommended Tech Stack
${skillsList}

---

## 🛑 4. Anti-Patterns & Constraints
${antiPatterns}

---

## 🚀 5. Phased Milestone Roadmap
${milestonesList}
`;
  }

  private generateReadmeMarkdown(charter: ProjectCharter): string {
    return `# ${charter.title}

> ${charter.tagline}

## 📖 Overview
${charter.problemStatement}

### 💡 The Technical Twist
${charter.technicalTwist}

---

## 🏗️ Architecture
- **Pattern**: ${charter.architecturePattern}
- **Target Persona**: ${charter.targetPersona}
- **Estimated Scope**: ${charter.timeBudget}

\`\`\`mermaid
flowchart LR
    A["Client / Input"] --> B["Core Engine"]
    B --> C["Storage / State"]
    B --> D["Verification Tests"]
\`\`\`

---

## 📦 Tech Stack
${charter.recommendedSkills.map((s) => `- \`${s}\``).join('\n')}

---

## 🚀 Getting Started
1. Review the full specification in [\`PROJECT_SPEC.md\`](./PROJECT_SPEC.md).
2. Follow the milestones outlined in Phase 1.
3. Use SkillForge (\`Ctrl+Shift+P\` → \`SkillForge: Suggest Skills\`) to explore additional packages as you build.
`;
  }
}
