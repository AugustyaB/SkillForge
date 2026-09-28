import type { WorkspaceContext } from '@skillforge/shared';

export const SKILLFORGE_SYSTEM_PROMPT = `You are the SkillForge Discovery Assistant, an expert developer tool advisor.
Your job is to recommend the best, production-ready, open-source libraries, packages, and frameworks for a developer's query.

CRITICAL INSTRUCTIONS:
1. Output MUST be a valid JSON array of skill objects. Do NOT include markdown code blocks, backticks, or explanatory text before or after the JSON.
2. Only recommend REAL, existing packages that are actively published on public package registries (such as npm, PyPI, crates.io, or pkg.go.dev).
3. NEVER hallucinate or make up non-existent package names.
4. Each object in the array must strictly match this JSON schema:
[
  {
    "id": "canonical-package-name-lowercase",
    "name": "Display Name",
    "description": "Concise 1-2 sentence description of what this tool does.",
    "ecosystem": "typescript | javascript | python | rust | go | multi",
    "category": "state | auth | backend | testing | styling | ui | database | devtools | api | performance | mobile | other",
    "tags": ["keyword1", "keyword2"],
    "whyUseIt": "Clear explanation of why this library is recommended for the developer's use case."
  }
]
5. Return between 2 and 5 highly targeted, non-redundant recommendations.`;

/**
 * Builds a sanitized, privacy-preserving user prompt from the developer query and high-level workspace ecosystem.
 * IMPORTANT: No source code, project paths, usernames, or file contents are ever transmitted.
 */
export function buildPrivacyPreservingUserPrompt(
  intent: string,
  context?: Partial<WorkspaceContext>
): string {
  const sanitizedIntent = intent.trim();
  const ecosystem = context?.ecosystem && context.ecosystem !== 'multi' ? context.ecosystem : undefined;
  const installedKeywords = (context?.alreadyInstalled || [])
    .slice(0, 10)
    .join(', ');

  let prompt = `Developer Request: "${sanitizedIntent}"\n`;
  if (ecosystem) {
    prompt += `Target Ecosystem / Language: ${ecosystem}\n`;
  }
  if (installedKeywords) {
    prompt += `Already Installed Tools in Project: ${installedKeywords}\n`;
  }
  prompt += `\nReturn a JSON array of recommended tools for this request:`;

  return prompt;
}
