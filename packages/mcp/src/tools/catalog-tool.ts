import type { SkillsRepository } from '@skillforge/server';

export interface CatalogToolParams {
  category?: string;
  ecosystem?: string;
  limit?: number;
}

export function handleCatalogTool(
  params: CatalogToolParams,
  repository: SkillsRepository
): string {
  let skills = repository.getAllSkills();

  if (params.category && typeof params.category === 'string') {
    const targetCat = params.category.toLowerCase().trim();
    skills = skills.filter((s) => (s.category || '').toLowerCase() === targetCat);
  }

  if (params.ecosystem && typeof params.ecosystem === 'string') {
    const targetEco = params.ecosystem.toLowerCase().trim();
    skills = skills.filter((s) => (s.ecosystem || '').toLowerCase().includes(targetEco));
  }

  const limit = Math.max(1, Math.min(params.limit ?? 30, 100));
  const totalMatches = skills.length;
  skills = skills.slice(0, limit);

  const lines: string[] = [];
  lines.push(`### SkillForge Curated Catalog (${skills.length} of ${totalMatches} matching tools)\n`);

  for (const s of skills) {
    lines.push(`- **${s.name}** (\`${s.id}\`) — [${s.ecosystem} | \`${s.category}\`]: ${s.description}`);
  }

  return lines.join('\n');
}
