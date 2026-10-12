import { describe, expect, it } from 'vitest';
import {
  AgentSkillGenerator,
  sanitizeSkillId,
  getGlobsForEcosystem,
  serializeYamlFrontmatter,
  getVerificationCommandsForEcosystem,
} from '../engine/agent-skill-generator.js';
import { SkillsRepository } from '../data/skills-repository.js';
import {
  validateGeneratedAgentSkill,
} from '@skillforge/shared';

/**
 * Minimal YAML parser for test assertions to verify frontmatter parseability
 * without adding third-party dependencies.
 */
function parseFrontmatter(markdown: string): Record<string, unknown> {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match || !match[1]) {
    throw new Error('Frontmatter delimiter --- not found in markdown content');
  }
  const lines = match[1].split(/\r?\n/);
  const result: Record<string, unknown> = {};
  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ') && currentKey && currentArray) {
      const item = trimmed.slice(2).replace(/^"|"$/g, '').trim();
      currentArray.push(item);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      if (currentKey && currentArray) {
        result[currentKey] = currentArray;
        currentKey = null;
        currentArray = null;
      }

      const key = line.slice(0, colonIdx).trim();
      const rawVal = line.slice(colonIdx + 1).trim();

      if (!rawVal) {
        currentKey = key;
        currentArray = [];
      } else if (rawVal === '[]') {
        result[key] = [];
      } else if (rawVal === 'true') {
        result[key] = true;
      } else if (rawVal === 'false') {
        result[key] = false;
      } else if (!isNaN(Number(rawVal)) && rawVal !== '') {
        result[key] = Number(rawVal);
      } else {
        result[key] = rawVal.replace(/^"|"$/g, '');
      }
    }
  }

  if (currentKey && currentArray) {
    result[currentKey] = currentArray;
  }

  return result;
}

describe('AgentSkillGenerator — Usability & Verification Suite', () => {
  const repo = new SkillsRepository();
  const generator = new AgentSkillGenerator(repo);

  describe('Core Generation & Trending Skills Support', () => {
    const trendingSkills = [
      'jev',
      'rea-re',
      'llm-c',
      'nanogpt',
      'mcp-sdk',
      'zod',
      'fastapi',
      'tailwind',
    ];

    it.each(trendingSkills)(
      'generates valid agent skill for "%s" adhering to schema',
      (skillId) => {
        const result = generator.generate({ skillId, format: 'agent-skill' });
        expect(result.skillId).toBe(skillId);
        expect(result.format).toBe('agent-skill');
        expect(result.suggestedFilePath).toBe(`.agent/skills/${skillId}/SKILL.md`);

        // Validate complete object with Zod schema
        const validated = validateGeneratedAgentSkill(result);
        expect(validated.markdownContent.length).toBeGreaterThan(200);
      }
    );
  });

  describe('YAML Frontmatter Parseability & Cleanliness', () => {
    it('generates strictly parseable YAML frontmatter with required agent metadata', () => {
      const result = generator.generate({
        skillId: 'zod',
        format: 'agent-skill',
      });

      const parsed = parseFrontmatter(result.markdownContent);
      expect(parsed.name).toBe('zod');
      expect(typeof parsed.description).toBe('string');
      expect(Array.isArray(parsed.triggers)).toBe(true);
      expect((parsed.triggers as string[]).length).toBeGreaterThan(0);
      expect(parsed.stack).toBeDefined();
      expect(parsed.difficulty).toBeDefined();
      expect(parsed.official_docs).toContain('http');
    });

    it('correctly formats frontmatter for Cursor rules (.mdc)', () => {
      const result = generator.generate({
        skillId: 'fastapi',
        format: 'cursor-rule',
      });

      expect(result.suggestedFilePath).toBe('.cursor/rules/fastapi.mdc');
      const parsed = parseFrontmatter(result.markdownContent);
      expect(parsed.description).toContain('FastAPI');
      expect(Array.isArray(parsed.globs)).toBe(true);
      expect((parsed.globs as string[])).toContain('**/*.py');
      expect(parsed.alwaysApply).toBe(false);
    });

    it('correctly formats root AGENTS.md format', () => {
      const result = generator.generate({
        skillId: 'rea-re',
        format: 'root-agents',
      });

      expect(result.suggestedFilePath).toBe('AGENTS.md');
      const parsed = parseFrontmatter(result.markdownContent);
      expect(parsed.project_skill).toBeDefined();
      expect(parsed.generated_by).toBe('SkillForge');
    });
  });

  describe('Karpathy Coding Disciplines & Structural Rigor', () => {
    it('includes all 4 Karpathy disciplines by default', () => {
      const result = generator.generate({ skillId: 'jev' });
      const md = result.markdownContent;

      expect(md).toContain('## 2. Operational Rules & Coding Disciplines');
      expect(md).toContain('Think Before Coding');
      expect(md).toContain('Simplicity & Minimal Surface Area');
      expect(md).toContain('Surgical Precision');
      expect(md).toContain('Verification Rigor');
    });

    it('omits operational rules when includeKarpathyRules is false', () => {
      const result = generator.generate({
        skillId: 'jev',
        includeKarpathyRules: false,
      });
      const md = result.markdownContent;

      expect(md).not.toContain('## 2. Operational Rules & Coding Disciplines');
      expect(md).not.toContain('Think Before Coding');
      // Other sections remain intact
      expect(md).toContain('## 1. Technology Overview & Rationale');
      expect(md).toContain('## 5. Verification Protocol');
    });

    it('contains all 5 standard markdown sections for agent consumption', () => {
      const result = generator.generate({ skillId: 'nanogpt' });
      const md = result.markdownContent;

      expect(md).toContain(`# SkillForge Agent Directive: ${result.skillName}`);
      expect(md).toContain('## 1. Technology Overview & Rationale');
      expect(md).toContain('## 2. Operational Rules & Coding Disciplines');
      expect(md).toContain('## 3. Best Practices & Idiomatic Patterns');
      expect(md).toContain('## 4. Common Anti-Patterns & Pitfalls');
      expect(md).toContain('## 5. Verification Protocol');
    });
  });

  describe('Adversarial & Dirty Inputs (Anti-Happy-Path)', () => {
    it('sanitizes scoped packages without directory traversal', () => {
      const sanitized = sanitizeSkillId('@modelcontextprotocol/sdk');
      expect(sanitized).toBe('modelcontextprotocol-sdk');
      expect(sanitized).not.toContain('@');
      expect(sanitized).not.toContain('/');

      const result = generator.generate({
        skillId: '@modelcontextprotocol/sdk',
        format: 'agent-skill',
      });
      expect(result.suggestedFilePath).toBe(
        '.agent/skills/modelcontextprotocol-sdk/SKILL.md'
      );
    });

    it('sanitizes dots, slashes, and special characters', () => {
      expect(sanitizeSkillId('socket.io')).toBe('socket-io');
      expect(sanitizeSkillId('c++')).toBe('c');
      expect(sanitizeSkillId('../../etc/passwd')).toBe('etc-passwd');
      expect(sanitizeSkillId('  ')).toBe('custom-skill');
      expect(sanitizeSkillId(null as any)).toBe('custom-skill');
    });

    it('handles leading and trailing whitespace gracefully', () => {
      const result = generator.generate({ skillId: '   zod   ' });
      expect(result.skillId).toBe('zod');
      expect(result.skillName).toBe('Zod');
    });

    it('generates a graceful fallback for completely unknown skills without crashing', () => {
      const result = generator.generate({
        skillId: 'quantum-hyper-optimizer',
        format: 'agent-skill',
      });

      expect(result.skillId).toBe('quantum-hyper-optimizer');
      expect(result.suggestedFilePath).toBe(
        '.agent/skills/quantum-hyper-optimizer/SKILL.md'
      );
      expect(result.markdownContent).toContain('quantum-hyper-optimizer');
      expect(result.markdownContent).toContain('## 5. Verification Protocol');
    });
  });

  describe('Empirical Agentic AI Usability Simulation', () => {
    it('allows an AI agent to deterministically extract verification commands', () => {
      const result = generator.generate({
        skillId: 'zod',
        format: 'agent-skill',
      });

      // Simulation: Agent inspects generated skill and parses verification block
      const bashMatch = result.markdownContent.match(/```bash([\s\S]*?)```/);
      expect(bashMatch).not.toBeNull();
      const bashScript = bashMatch![1]!.trim();

      expect(bashScript).toContain('pnpm test');
      expect(bashScript).toContain('pnpm typecheck');
    });

    it('allows an AI agent to match user intent against triggers array', () => {
      const result = generator.generate({
        skillId: 'fastapi',
        format: 'agent-skill',
      });

      const triggers = (result.frontmatter.triggers as string[]) || [];
      expect(triggers).toContain('fastapi');
      expect(triggers.some((t) => t.includes('api') || t.includes('python'))).toBe(true);

      // Simulated agent intent matching
      const userIntent = 'I need a fast python REST api framework';
      const matched = triggers.some((trigger) =>
        userIntent.toLowerCase().includes(trigger.toLowerCase())
      );
      expect(matched).toBe(true);
    });

    it('provides clear anti-patterns that prevent agent hallucinations', () => {
      const result = generator.generate({ skillId: 'react' });
      const md = result.markdownContent;

      expect(md).toContain('Hallucinating nonexistent API methods');
      expect(md).toContain('Silently swallowing exceptions');
      expect(md).toContain('Bypassing static typing');
    });
  });

  describe('Helper Functions Unit Tests', () => {
    it('getGlobsForEcosystem returns accurate glob arrays', () => {
      expect(getGlobsForEcosystem('javascript')).toContain('**/*.ts');
      expect(getGlobsForEcosystem('python')).toEqual(['**/*.py', '**/*.pyi']);
      expect(getGlobsForEcosystem('rust')).toEqual(['**/*.rs', 'Cargo.toml']);
      expect(getGlobsForEcosystem('go')).toEqual(['**/*.go', 'go.mod']);
      expect(getGlobsForEcosystem('unknown-xyz')).toEqual(['**/*']);
    });

    it('serializeYamlFrontmatter safely escapes strings with quotes and colons', () => {
      const yaml = serializeYamlFrontmatter({
        title: 'Tool: "Zod" with : colons',
        flag: true,
        count: 42,
        items: ['first', 'second: "sub"'],
      });

      expect(yaml).toContain('title: "Tool: \\"Zod\\" with : colons"');
      expect(yaml).toContain('flag: true');
      expect(yaml).toContain('count: 42');
      expect(yaml).toContain('  - first');
      expect(yaml).toContain('  - "second: \\"sub\\""');
    });

    it('getVerificationCommandsForEcosystem returns expected commands', () => {
      const pyCmd = getVerificationCommandsForEcosystem('python', 'fastapi');
      expect(pyCmd.primary).toBe('pytest');
      expect(pyCmd.secondary).toBe('mypy .');

      const rustCmd = getVerificationCommandsForEcosystem('rust', 'tokio');
      expect(rustCmd.primary).toBe('cargo test');
    });
  });
});
