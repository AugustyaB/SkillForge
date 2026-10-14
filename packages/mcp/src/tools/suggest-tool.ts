import { SuggestionEngine, WorkspaceScanner } from '@skillforge/server';
import type { SkillSuggestionResult, WorkspaceContext } from '@skillforge/shared';

export interface SuggestToolParams {
  intent: string;
  workspacePath?: string;
  ecosystem?: string;
  maxResults?: number;
}

export async function handleSuggestTool(
  params: SuggestToolParams,
  engine: SuggestionEngine,
  scanner: WorkspaceScanner
): Promise<string> {
  const cleanIntent = (params.intent || '').trim();
  if (!cleanIntent) {
    return 'Please provide a non-empty `intent` describing what you want to build or what capability you need.';
  }

  let workspaceContext: WorkspaceContext | undefined;
  if (params.workspacePath && typeof params.workspacePath === 'string' && params.workspacePath.trim()) {
    try {
      workspaceContext = await scanner.scanScope(params.workspacePath.trim());
    } catch {
      // Gracefully continue without workspace context on disk errors
    }
  }

  const result: SkillSuggestionResult = await engine.suggest({
    intent: cleanIntent,
    context: workspaceContext,
  });

  const limit = Math.max(1, Math.min(params.maxResults ?? 5, 20));
  let skills = result.skills;

  if (params.ecosystem && typeof params.ecosystem === 'string') {
    const targetEco = params.ecosystem.toLowerCase().trim();
    skills = skills.filter((s) => (s.ecosystem || '').toLowerCase().includes(targetEco));
  }

  skills = skills.slice(0, limit);

  if (skills.length === 0) {
    let msg = `### SkillForge: No direct skills found for "${cleanIntent}"\n\n`;
    if (result.categoryRecommendations && result.categoryRecommendations.length > 0) {
      msg += '**Recommended Categories to explore:**\n';
      for (const cat of result.categoryRecommendations) {
        msg += `- **${cat.label || cat.category}**: ${cat.description} (e.g. ${cat.skillIds.join(', ')})\n`;
      }
    }
    return msg;
  }

  const lines: string[] = [];
  lines.push(`### SkillForge Recommended Libraries for: "${cleanIntent}"`);
  lines.push(`*Curated from offline knowledge base of 363 vetted tools*\n`);

  if (workspaceContext && workspaceContext.alreadyInstalled.length > 0) {
    lines.push(`> **Workspace Context**: Detected ${workspaceContext.alreadyInstalled.length} existing dependencies (${workspaceContext.ecosystem} ecosystem).\n`);
  }

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i]!;
    const trustBadge = s.trustTier === 'verified' ? '✅ Verified' : '💡 Suggested';
    const installedBadge = s.isInstalledInWorkspace ? ' *(Already installed in workspace)*' : '';
    lines.push(`#### ${i + 1}. **${s.name}** \`${s.id}\` — ${trustBadge}${installedBadge}`);
    lines.push(`- **Category**: \`${s.category}\` | **Ecosystem**: \`${s.ecosystem}\` | **Difficulty**: ${s.difficulty || 'All levels'}`);
    lines.push(`- **Why Use It**: ${s.whyUseIt || s.description}`);
    
    if (s.conflictWarning) {
      lines.push(`- ⚠️ **Conflict Warning**: ${s.conflictWarning}`);
    }

    if (s.worksWellWith && s.worksWellWith.length > 0) {
      lines.push(`- **Works well with**: ${s.worksWellWith.map((w) => `\`${w}\``).join(', ')}`);
    }

    if (s.alternatives && s.alternatives.length > 0) {
      lines.push(`- **Alternatives**: ${s.alternatives.map((a) => `\`${a}\``).join(', ')}`);
    }

    if (s.officialUrl) {
      lines.push(`- **Official Docs**: ${s.officialUrl}`);
    }

    // Suggested install command
    const pkgName = s.stackIndicators?.[0] || s.id;
    let installCmd = `npm install ${pkgName}`;
    if (s.ecosystem === 'python') installCmd = `pip install ${pkgName}`;
    else if (s.ecosystem === 'rust') installCmd = `cargo add ${pkgName}`;
    else if (s.ecosystem === 'go') installCmd = `go get ${pkgName}`;
    lines.push(`- **Install**: \`${installCmd}\`\n`);
  }

  return lines.join('\n');
}
