import { ComparisonEngine, WorkspaceScanner } from '@skillforge/server';
import type { ComparisonMatrix } from '@skillforge/shared';

export interface CompareToolParams {
  skillIds: string[];
  workspacePath?: string;
}

export async function handleCompareTool(
  params: CompareToolParams,
  engine: ComparisonEngine,
  scanner: WorkspaceScanner
): Promise<string> {
  const ids = (params.skillIds || []).map((id) => (id || '').trim()).filter(Boolean);

  if (ids.length < 2 || ids.length > 3) {
    return 'Please provide exactly 2 or 3 valid library IDs to compare (e.g. `["fastapi", "django"]` or `["zustand", "redux-toolkit"]`).';
  }

  let installedPackages: string[] = [];
  if (params.workspacePath && typeof params.workspacePath === 'string' && params.workspacePath.trim()) {
    try {
      const ws = await scanner.scanScope(params.workspacePath.trim());
      installedPackages = ws.alreadyInstalled;
    } catch {
      // Ignore
    }
  }

  let matrix: ComparisonMatrix;
  try {
    matrix = engine.compare({ skillIds: ids }, installedPackages);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('requires at least 2 distinct skills')) {
      return 'Comparison requires at least 2 distinct skills. Both resolved to the same package.';
    }
    return `None of the requested libraries (${ids.join(', ')}) were found in the curated catalog or among direct alternatives.`;
  }

  if (!matrix.columns || matrix.columns.length === 0) {
    return `None of the requested libraries (${ids.join(', ')}) were found in the curated catalog.`;
  }

  const lines: string[] = [];
  lines.push(`### SkillForge Side-by-Side Comparison: ${matrix.columns.map((c) => c.name).join(' vs ')}\n`);

  if (matrix.conflictsDetected && matrix.conflictsDetected.length > 0) {
    for (const conf of matrix.conflictsDetected) {
      lines.push(`> ⚠️ **Architectural Conflict Warning**: ${conf}\n`);
    }
  }

  // Markdown Table
  const colNames = matrix.columns.map((c) => c.name);
  lines.push(`| Dimension | ${colNames.join(' | ')} |`);
  lines.push(`| :--- | ${colNames.map(() => ':---').join(' | ')} |`);

  lines.push(`| **Category** | ${matrix.columns.map((c) => `\`${c.category}\``).join(' | ')} |`);
  lines.push(`| **Ecosystem** | ${matrix.columns.map((c) => c.ecosystem).join(' | ')} |`);
  lines.push(`| **Difficulty** | ${matrix.columns.map((c) => c.difficulty).join(' | ')} |`);
  lines.push(`| **Trust Tier** | ${matrix.columns.map((c) => (c.trustTier === 'verified' ? '✅ Verified' : '💡 Suggested')).join(' | ')} |`);
  lines.push(`| **Installed in Project?** | ${matrix.columns.map((c) => (c.isInstalledInWorkspace ? '⭐ Yes' : 'No')).join(' | ')} |`);

  // Health Metrics
  lines.push(`| **Weekly Downloads** | ${matrix.columns.map((c) => (c.health?.weeklyDownloads ? c.health.weeklyDownloads.toLocaleString() : 'N/A')).join(' | ')} |`);
  lines.push(`| **Health Verdict** | ${matrix.columns.map((c) => (c.health?.healthVerdict ? `\`${c.health.healthVerdict}\`` : 'healthy')).join(' | ')} |`);

  lines.push('\n#### Tradeoffs & Key Insights:');
  for (const col of matrix.columns) {
    lines.push(`- **${col.name}**: ${col.whyUseIt}`);
    if (col.pros && col.pros.length > 0) {
      lines.push(`  - **Pros**: ${col.pros.join(', ')}`);
    }
    if (col.caveats) {
      lines.push(`  - **Caveats**: ${col.caveats}`);
    }
  }

  return lines.join('\n');
}
