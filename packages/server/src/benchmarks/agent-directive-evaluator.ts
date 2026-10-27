import type { GeneratedAgentSkill } from '@skillforge/shared';

/**
 * Result of evaluating a generated agent skill directive against SkillsBench & Anthropic standards.
 */
export interface DirectiveEvaluationResult {
  skillId: string;
  format: string;
  charCount: number;
  estimatedTokens: number;
  pillarScores: {
    tokenBudget: { passed: boolean; score: number; reason: string };
    frontmatterIntegrity: { passed: boolean; score: number; reason: string };
    progressiveDisclosure: { passed: boolean; score: number; reason: string };
    deterministicVerification: { passed: boolean; score: number; reason: string };
    codePatternsAndPitfalls: { passed: boolean; score: number; reason: string };
  };
  overallScore: number; // 0 - 100%
  passed: boolean;
}

/**
 * Evaluates a generated agent skill markdown artifact against industry agent-skill criteria.
 */
export class AgentDirectiveEvaluator {
  public evaluate(skill: GeneratedAgentSkill): DirectiveEvaluationResult {
    const content = skill.markdownContent || '';
    const charCount = content.length;
    // Standard rule of thumb: ~4 characters per token
    const estimatedTokens = Math.ceil(charCount / 4);

    // Pillar 1: Token Budget (1,000 - 6,500 chars / ~250 - 1,600 tokens)
    let tokenScore = 1.0;
    let tokenReason = 'Optimal directive length within context window budget';
    if (charCount < 400) {
      tokenScore = 0.2;
      tokenReason = `Directive too short (${charCount} chars); lacks operational guidance`;
    } else if (charCount < 900) {
      tokenScore = 0.7;
      tokenReason = `Directive slightly brief (${charCount} chars)`;
    } else if (charCount > 8000) {
      tokenScore = 0.4;
      tokenReason = `Directive exceeds token budget (${charCount} chars); risk of context bloat`;
    }

    // Pillar 2: Frontmatter Integrity
    // - Cursor MDC format specifies description + globs without name
    // - Root AGENTS.md format specifies project_skill + ecosystem + category
    // - Agent-skill / Claude-skill format specifies name + description + triggers
    const hasFrontmatter = content.startsWith('---') && content.slice(3).includes('---');
    const hasName =
      skill.format === 'cursor-rule'
        ? true
        : skill.format === 'root-agents'
        ? Boolean(skill.frontmatter?.project_skill)
        : Boolean(skill.frontmatter?.name);

    const hasDesc =
      skill.format === 'root-agents'
        ? Boolean(skill.frontmatter?.category)
        : typeof skill.frontmatter?.description === 'string' &&
          skill.frontmatter.description.trim().length >= 10 &&
          skill.frontmatter.description.trim().length <= 300;

    const globsValid =
      skill.format !== 'cursor-rule' ||
      (Array.isArray(skill.frontmatter?.globs) && skill.frontmatter.globs.length > 0);

    let frontmatterScore = 1.0;
    let frontmatterReason = 'Valid YAML frontmatter with concise name and description';
    if (!hasFrontmatter || !hasName || !hasDesc || !globsValid) {
      frontmatterScore = 0.0;
      frontmatterReason = `Frontmatter violation: delimiter=${hasFrontmatter}, name=${hasName}, desc=${hasDesc}, globs=${globsValid}`;
    }

    // Pillar 3: Progressive Disclosure & Structure
    const hasOverview = /(#+ .*(Overview|Rationale|Description)|Quick Start)/i.test(content);
    const hasWhenToUse = /(triggers:|When to (Use|Apply|Recommend)|Follow this protocol whenever)/i.test(content);
    const hasWhenNotToUse = /(When NOT to Use|When to Avoid|Alternatives to Consider|Anti-Patterns|Common Pitfalls)/i.test(content);

    let structureScore = 1.0;
    let structureReason = 'Complete progressive disclosure with triggers and negative boundaries';
    if (!hasOverview || !hasWhenToUse || !hasWhenNotToUse) {
      const missing: string[] = [];
      if (!hasOverview) missing.push('Overview');
      if (!hasWhenToUse) missing.push('When to Use / Triggers');
      if (!hasWhenNotToUse) missing.push('When NOT to Use / Alternatives');
      structureScore = Math.max(0, 1.0 - missing.length * 0.33);
      structureReason = `Missing required progressive disclosure sections: ${missing.join(', ')}`;
    }

    // Pillar 4: Deterministic Verification
    const hasVerificationHeader = /(Verification Protocol|Verification Commands?|How to Verify|Testing & Conformance)/i.test(content);
    const hasCodeBlock = /```[a-z]*[\s\S]+?```/i.test(content);
    const hasExecutableCommand = /(test|typecheck|check|vet|lint|cargo|pytest|mvn|pnpm|npm)/i.test(content);

    let verificationScore = 1.0;
    let verificationReason = 'Contains deterministic executable verification commands';
    if (!hasVerificationHeader || !hasCodeBlock || !hasExecutableCommand) {
      verificationScore = 0.0;
      verificationReason = `Missing deterministic verification commands or code block`;
    }

    // Pillar 5: Code Patterns & Anti-Patterns
    const hasBestPractices = /(Best Practices|Pitfalls|Common Pitfalls|Anti-Patterns|Key Patterns)/i.test(content);
    let patternsScore = 1.0;
    let patternsReason = 'Includes actionable code patterns and common pitfall warnings';
    if (!hasBestPractices) {
      patternsScore = 0.5;
      patternsReason = 'Lacks explicit best practices or pitfalls section';
    }

    const weights = {
      tokenBudget: 0.2,
      frontmatterIntegrity: 0.2,
      progressiveDisclosure: 0.25,
      deterministicVerification: 0.2,
      codePatternsAndPitfalls: 0.15,
    };

    const overallScore = Math.round(
      (tokenScore * weights.tokenBudget +
        frontmatterScore * weights.frontmatterIntegrity +
        structureScore * weights.progressiveDisclosure +
        verificationScore * weights.deterministicVerification +
        patternsScore * weights.codePatternsAndPitfalls) *
        100
    );

    const passed =
      tokenScore >= 0.7 &&
      frontmatterScore === 1.0 &&
      structureScore >= 0.66 &&
      verificationScore === 1.0 &&
      patternsScore >= 0.5;

    return {
      skillId: skill.skillId,
      format: skill.format,
      charCount,
      estimatedTokens,
      pillarScores: {
        tokenBudget: { passed: tokenScore >= 0.7, score: tokenScore, reason: tokenReason },
        frontmatterIntegrity: {
          passed: frontmatterScore === 1.0,
          score: frontmatterScore,
          reason: frontmatterReason,
        },
        progressiveDisclosure: {
          passed: structureScore >= 0.66,
          score: structureScore,
          reason: structureReason,
        },
        deterministicVerification: {
          passed: verificationScore === 1.0,
          score: verificationScore,
          reason: verificationReason,
        },
        codePatternsAndPitfalls: {
          passed: patternsScore >= 0.5,
          score: patternsScore,
          reason: patternsReason,
        },
      },
      overallScore,
      passed,
    };
  }
}
