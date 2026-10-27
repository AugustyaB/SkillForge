import {
  type GenerateAgentSkillRequest,
  type GeneratedAgentSkill,
  type Skill,
  type SkillCategory,
  validateGenerateAgentSkillRequest,
  validateGeneratedAgentSkill,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';

/**
 * Sanitizes arbitrary or hostile skill identifiers into safe filesystem path segments.
 * Prevents directory traversal (e.g. '../', '..\\') and invalid filename characters.
 */
export function sanitizeSkillId(id: string): string {
  if (!id || typeof id !== 'string') {
    return 'custom-skill';
  }
  const trimmed = id.trim().toLowerCase();
  // Strip leading '@' (common in scoped npm packages like @modelcontextprotocol/sdk)
  const noAt = trimmed.replace(/^@+/, '');
  // Replace slashes, backslashes, colons, dots, and unsafe characters with hyphens
  const sanitized = noAt.replace(/[/\\:.]+/g, '-').replace(/[^a-z0-9_-]/g, '-');
  // Collapse multiple hyphens
  const collapsed = sanitized.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return collapsed || 'custom-skill';
}

/**
 * Maps a technology ecosystem to standard glob patterns for Cursor rules.
 */
export function getGlobsForEcosystem(ecosystem: string): string[] {
  const eco = (ecosystem || '').toLowerCase();
  if (
    eco.includes('javascript') ||
    eco.includes('typescript') ||
    eco.includes('react') ||
    eco.includes('node') ||
    eco.includes('vue') ||
    eco.includes('svelte') ||
    eco.includes('next')
  ) {
    return ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'];
  }
  if (eco.includes('python')) {
    return ['**/*.py', '**/*.pyi'];
  }
  if (eco.includes('rust')) {
    return ['**/*.rs', 'Cargo.toml'];
  }
  if (eco.includes('go')) {
    return ['**/*.go', 'go.mod'];
  }
  if (eco.includes('java') || eco.includes('kotlin')) {
    return ['**/*.java', '**/*.kt', 'pom.xml', 'build.gradle'];
  }
  if (eco.includes('c++') || eco.includes('cpp') || eco.includes('c')) {
    return ['**/*.c', '**/*.cpp', '**/*.h', '**/*.hpp', 'CMakeLists.txt'];
  }
  return ['**/*'];
}

/**
 * Serializes a key-value record into safe YAML frontmatter.
 */
export function serializeYamlFrontmatter(data: Record<string, unknown>): string {
  const lines: string[] = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string') {
      if (
        value.includes('\n') ||
        value.includes('"') ||
        value.includes(':') ||
        value.includes('#') ||
        value.startsWith('@')
      ) {
        lines.push(`${key}: "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of value) {
          const str = String(item);
          if (
            str.includes('\n') ||
            str.includes('"') ||
            str.includes(':') ||
            str.includes('#') ||
            str.startsWith('@')
          ) {
            lines.push(`  - "${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
          } else {
            lines.push(`  - ${str}`);
          }
        }
      }
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/**
 * Returns deterministic verification commands tailored to ecosystem and language.
 */
export function getVerificationCommandsForEcosystem(
  ecosystem: string,
  packageName: string
): { primary: string; secondary?: string; note: string } {
  const eco = (ecosystem || '').toLowerCase();
  if (
    eco.includes('javascript') ||
    eco.includes('typescript') ||
    eco.includes('node') ||
    eco.includes('react') ||
    eco.includes('vue') ||
    eco.includes('svelte') ||
    eco.includes('next')
  ) {
    return {
      primary: 'pnpm test && pnpm typecheck',
      secondary: 'npm run test || npx vitest run',
      note: 'Run typecheck (tsc -b or npx tsc --noEmit) and test runner to ensure zero regressions.',
    };
  }
  if (eco.includes('python')) {
    return {
      primary: 'pytest',
      secondary: 'mypy .',
      note: 'Run pytest for unit test validation and mypy for static type conformance.',
    };
  }
  if (eco.includes('rust')) {
    return {
      primary: 'cargo test',
      secondary: 'cargo check',
      note: 'Run cargo check for immediate compilation diagnostics, followed by cargo test.',
    };
  }
  if (eco.includes('go')) {
    return {
      primary: 'go test ./...',
      secondary: 'go vet ./...',
      note: 'Run go vet for static analysis and go test ./... across all packages.',
    };
  }
  if (eco.includes('java')) {
    return {
      primary: 'mvn test',
      secondary: './gradlew test',
      note: 'Run Maven or Gradle test phase to verify package integration.',
    };
  }
  return {
    primary: `test -f package.json && npm test || true`,
    secondary: undefined,
    note: `Execute the workspace test suite to verify integration with ${packageName}.`,
  };
}

/**
 * Best practices tailored by skill category and ecosystem.
 */
function getCategoryBestPractices(category: SkillCategory): string[] {
  switch (category) {
    case 'state-management':
      return [
        `Keep state minimal and normalized; derive computed values rather than syncing duplicated state.`,
        `Colocate state with the components or submodules that own it; avoid globalizing transient state.`,
        `Maintain immutability for state transitions to ensure predictable change detection and undoability.`,
        `Define explicit action/mutation types or slice selectors to prevent tight coupling across modules.`,
      ];
    case 'backend-framework':
    case 'api-protocol':
      return [
        `Enforce strict request validation and schema parsing at the application boundary before processing payloads.`,
        `Implement structured error responses with predictable status codes and sanitized messages.`,
        `Always configure request timeouts, retry policies with exponential backoff, and graceful cancellation.`,
        `Separate route handlers from business logic and data access layers for clean testability.`,
      ];
    case 'database':
    case 'orm':
      return [
        `Always use parameterized queries or type-safe query builders to eliminate SQL injection risks.`,
        `Manage database connections via connection pools; ensure explicit disposal or return on error.`,
        `Maintain explicit schema migration scripts under version control rather than relying on automatic sync in production.`,
        `Index query columns thoughtfully; profile slow queries and avoid unbounded SELECT * operations.`,
      ];
    case 'testing':
      return [
        `Structure tests with clear Arrange-Act-Assert blocks and isolated mocks.`,
        `Test boundary conditions, hostile inputs, and error states, not just the happy path.`,
        `Keep tests deterministic and independent of execution order or network availability.`,
        `Avoid testing internal implementation details; assert public contracts and observable behavior.`,
      ];
    case 'ai-ml':
      return [
        `Enforce strict schema validation and structured JSON outputs for all model responses.`,
        `Implement robust fallback cascades and circuit breakers for LLM rate limits and API outages.`,
        `Sanitize external prompts and untrusted context to prevent prompt injection vulnerabilities.`,
        `Keep token usage, latency budgets, and cost metrics monitored and observable.`,
      ];
    case 'ui-library':
    case 'frontend-framework':
      return [
        `Leverage design tokens and CSS custom properties rather than hardcoded magic numbers.`,
        `Ensure full theme adaptability (support both light and dark mode contrasts).`,
        `Optimize bundle size by utilizing tree-shaking and purge unused class definitions in production.`,
        `Adhere strictly to accessibility (WCAG AA) contrast ratios and focus ring visibility.`,
      ];
    case 'security':
    case 'authentication':
      return [
        `Never commit secrets, tokens, or private keys to source control; use environment variables or secret managers.`,
        `Follow the principle of least privilege for API permissions and token scopes.`,
        `Hash passwords with modern memory-hard algorithms (Argon2id or bcrypt with appropriate cost).`,
        `Sanitize user inputs and encode outputs to neutralize XSS, CSRF, and injection attacks.`,
      ];
    default:
      return [
        `Favor explicit, readable code over clever abstractions; document non-obvious architecture decisions.`,
        `Adhere to the single responsibility principle: each module should do one thing well.`,
        `Maintain comprehensive error handling at external I/O boundaries and avoid silent failures.`,
        `Leverage static analysis and strict linting to catch defects prior to runtime execution.`,
      ];
  }
}

/**
 * Common pitfalls and anti-patterns tailored for agents working with a skill.
 */
function getAntiPatterns(skill: Skill): string[] {
  return [
    `Hallucinating nonexistent API methods or configuration options not present in ${skill.officialUrl}.`,
    `Blindly upgrading or mixing incompatible major versions of ${skill.name} without checking breaking changes.`,
    `Silently swallowing exceptions or catch-all try/catch blocks that hide errors from developer logs.`,
    `Bypassing static typing with untyped dictionaries, 'any' casts, or '@ts-ignore' suppressions.`,
    `Leaking resources by failing to clean up subscriptions, connections, timers, or child processes.`,
  ];
}

/**
 * Generator engine for creating agent-ready skill directive files.
 */
export class AgentSkillGenerator {
  private repository: SkillsRepository;

  constructor(repository?: SkillsRepository) {
    this.repository = repository || new SkillsRepository();
  }

  /**
   * Generates a fully compliant agent skill file for the requested skill and format.
   */
  public generate(request: GenerateAgentSkillRequest): GeneratedAgentSkill {
    const validatedRequest = validateGenerateAgentSkillRequest(request);
    const sanitizedId = sanitizeSkillId(validatedRequest.skillId);

    // Look up skill in repository
    let skill =
      this.repository.getSkillById(validatedRequest.skillId) ||
      this.repository.getSkillById(sanitizedId) ||
      this.repository.getSkillByIndicator(validatedRequest.skillId);

    // Fallback if not found in catalog
    if (!skill) {
      skill = {
        id: sanitizedId,
        name: validatedRequest.skillId.trim(),
        category: 'utility',
        difficulty: 'intermediate',
        description: `Operational rules, best practices, and integration guidelines for ${validatedRequest.skillId}.`,
        whyUseIt: `Provides specialized capabilities for ${validatedRequest.skillId} in developer workflows.`,
        tags: [sanitizedId, 'utility'],
        ecosystem: 'multi-language',
        officialUrl: 'https://github.com',
        learnResources: [{ label: 'Official Repository', url: 'https://github.com', type: 'docs' }],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: [sanitizedId],
      };
    }

    const { format } = validatedRequest;
    const includeKarpathy = validatedRequest.includeKarpathyRules !== false;

    // Determine target relative path
    let suggestedFilePath: string;
    switch (format) {
      case 'agent-skill':
        suggestedFilePath = `.agent/skills/${sanitizedId}/SKILL.md`;
        break;
      case 'claude-skill':
        suggestedFilePath = `.claude/skills/${sanitizedId}/SKILL.md`;
        break;
      case 'cursor-rule':
        suggestedFilePath = `.cursor/rules/${sanitizedId}.mdc`;
        break;
      case 'root-agents':
        suggestedFilePath = 'AGENTS.md';
        break;
    }

    // Determine frontmatter
    let frontmatterData: Record<string, unknown>;
    const triggers = Array.from(
      new Set(
        [
          sanitizedId,
          skill.id.toLowerCase(),
          skill.name.toLowerCase(),
          ...skill.tags.map((t) => t.toLowerCase().trim()),
          ...skill.stackIndicators.map((i) => i.toLowerCase().trim()),
        ].filter(Boolean)
      )
    );

    if (format === 'cursor-rule') {
      frontmatterData = {
        description: `Operational rules and best practices for ${skill.name} (${skill.ecosystem})`,
        globs: getGlobsForEcosystem(skill.ecosystem),
        alwaysApply: false,
      };
    } else if (format === 'root-agents') {
      frontmatterData = {
        project_skill: skill.name,
        ecosystem: skill.ecosystem,
        category: skill.category,
        license: skill.license || 'MIT',
        generated_by: 'SkillForge',
      };
    } else {
      // 'agent-skill' and 'claude-skill'
      frontmatterData = {
        name: sanitizedId,
        description: `Operational guidelines, best practices, and verification protocols for ${skill.name} (${skill.ecosystem})`,
        triggers,
        stack: skill.ecosystem,
        difficulty: skill.difficulty,
        license: skill.license || 'MIT',
        official_docs: skill.officialUrl,
      };
    }

    const frontmatterYaml = serializeYamlFrontmatter(frontmatterData);
    const verification = getVerificationCommandsForEcosystem(
      skill.ecosystem,
      skill.stackIndicators[0] || skill.id
    );
    const bestPractices = getCategoryBestPractices(skill.category);
    const antiPatterns = getAntiPatterns(skill);

    // Build Markdown Document Body
    const sections: string[] = [];

    // Title & Context Header
    sections.push(`# SkillForge Agent Directive: ${skill.name}`);

    if (skill.isDeprecated) {
      sections.push(
        `> ⚠️ **DEPRECATION NOTICE**: \`${skill.name}\` is deprecated/sunsetted. ${skill.deprecatedReason || ''}\n${skill.migrationTarget ? `> **Recommended Migration Target**: \`${skill.migrationTarget}\`` : ''}`
      );
    }

    sections.push(
      `> **Mission**: Automated agent directive for using \`${skill.name}\` (${skill.category} / ${skill.ecosystem}). Follow this protocol whenever inspecting, authoring, refactoring, or testing code integrating with this technology.`
    );

    // Section 1: Technology Overview & Rationale
    sections.push(`## 1. Technology Overview & Rationale
- **Package / Tool**: \`${skill.stackIndicators[0] || skill.id}\`
- **Ecosystem**: \`${skill.ecosystem}\`
- **Category**: \`${skill.category}\`
- **License**: \`${skill.license || 'MIT'}\`
- **Why Choose It**: ${skill.whyUseIt}
- **Official Documentation**: [${skill.officialUrl}](${skill.officialUrl})
- **Stack Synergy**: ${skill.worksWellWith.length > 0 ? skill.worksWellWith.map((w) => `\`${w}\``).join(', ') : 'Standard ecosystem libraries'}
- **Alternatives to Consider**: ${skill.alternatives.length > 0 ? skill.alternatives.map((a) => `\`${a}\``).join(', ') : 'None listed'}
- **Prerequisites**: ${skill.prerequisites.length > 0 ? skill.prerequisites.join('; ') : 'Standard runtime setup'}`);

    // Section 2: Operational Rules (Karpathy Disciplines)
    if (includeKarpathy) {
      sections.push(`## 2. Operational Rules & Coding Disciplines
As an AI coding agent, adhere to the following four non-negotiable disciplines:

1. **Think Before Coding**:
   - Inspect existing architecture, configuration files, and types before proposing changes.
   - Formulate a clear hypothesis and plan rather than writing speculative code.
   - Verify library version constraints in project manifests prior to importing methods.

2. **Simplicity & Minimal Surface Area**:
   - Choose the most direct, minimal solution that satisfies the requirement.
   - Do not introduce premature abstractions, unnecessary wrapper classes, or speculative helpers.
   - Keep diffs tight, focused, and reviewable.

3. **Surgical Precision**:
   - Make targeted, localized modifications; do not rewrite unrelated working code.
   - Respect and match the surrounding codebase's indentation, naming conventions, and style.
   - Preserve comments, docstrings, and existing test cases.

4. **Verification Rigor**:
   - Every change must be validated using deterministic commands before claiming completion.
   - Run type checks and test suites; never assume code works without empirical proof.`);
    }

    // Section 3: Best Practices & Idiomatic Patterns
    sections.push(`## 3. Best Practices & Idiomatic Patterns
When writing code with \`${skill.name}\`, follow these idiomatic guidelines:

${bestPractices.map((bp) => `- ${bp}`).join('\n')}`);

    // Section 4: Common Anti-Patterns & Pitfalls
    let antiPatternsBody = antiPatterns.map((ap) => `- ${ap}`).join('\n');
    if (skill.whenNotToUse && skill.whenNotToUse.length > 0) {
      antiPatternsBody = `### When NOT to Use\n${skill.whenNotToUse.map((w) => `- ${w}`).join('\n')}\n\n### Operational Failure Modes\n${antiPatternsBody}`;
    }

    sections.push(`## 4. Common Anti-Patterns & Pitfalls
Avoid the following failure modes when implementing changes:

${antiPatternsBody}`);

    // Section 5: Deterministic Verification Protocol
    sections.push(`## 5. Verification Protocol
Validate your implementation using the following deterministic commands:

\`\`\`bash
# Primary Verification
${verification.primary}
${verification.secondary ? `\n# Secondary / Fallback\n${verification.secondary}` : ''}
\`\`\`

> **Verification Standard**: ${verification.note} Do not report a task as complete if any tests fail or compiler errors are present.`);

    const fullMarkdown = `${frontmatterYaml}\n\n${sections.join('\n\n')}\n`;

    return validateGeneratedAgentSkill({
      skillId: skill.id,
      skillName: skill.name,
      format,
      suggestedFilePath,
      frontmatter: frontmatterData,
      markdownContent: fullMarkdown,
    });
  }
}
