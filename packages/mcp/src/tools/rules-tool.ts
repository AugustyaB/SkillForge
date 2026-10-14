import { AgentSkillGenerator } from '@skillforge/server';
import type { AgentSkillFormat, GeneratedAgentSkill } from '@skillforge/shared';

export interface RulesToolParams {
  skillId: string;
  format?: AgentSkillFormat;
  workspacePath?: string;
}

export function handleRulesTool(
  params: RulesToolParams,
  generator: AgentSkillGenerator
): string {
  const cleanId = (params.skillId || '').trim();
  if (!cleanId) {
    return 'Please provide a valid `skillId` (e.g. "zod", "fastapi", "tailwind", "prisma").';
  }

  const format: AgentSkillFormat = params.format || 'agent-skill';

  try {
    const generated: GeneratedAgentSkill = generator.generate({
      skillId: cleanId,
      format,
      workspacePath: params.workspacePath,
      includeKarpathyRules: true,
    });

    const lines: string[] = [];
    lines.push(`### SkillForge AI Rules Directive Generated for "${generated.skillName}"\n`);
    lines.push(`- **Target Format**: \`${generated.format}\``);
    lines.push(`- **Suggested File Path**: \`${generated.suggestedFilePath}\`\n`);
    lines.push(`\`\`\`markdown`);
    lines.push(generated.markdownContent);
    lines.push(`\`\`\``);

    return lines.join('\n');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Failed to generate agent rules for "${cleanId}": ${msg}`;
  }
}
