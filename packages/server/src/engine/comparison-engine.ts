import {
  type ComparisonColumn,
  type ComparisonMatrix,
  type ComparisonRequest,
  type Skill,
  type SkillCategory,
  validateComparisonMatrix,
  validateComparisonRequest,
} from '@skillforge/shared';
import type { SkillsRepository } from '../data/skills-repository.js';
import { TrustTierClassifier } from '../reliability/trust-tier-classifier.js';

export interface ComparisonEngineOptions {
  repository: SkillsRepository;
  classifier?: TrustTierClassifier;
}

export class ComparisonEngine {
  private repository: SkillsRepository;
  private classifier: TrustTierClassifier;

  constructor(options: ComparisonEngineOptions) {
    this.repository = options.repository;
    this.classifier = options.classifier || new TrustTierClassifier();
  }

  /**
   * Generates a side-by-side comparison matrix for 2 to 3 skill IDs.
   *
   * @param request The comparison request containing 2-3 skill IDs
   * @param installedPackages Optional list of packages installed in current workspace
   */
  public compare(
    request: ComparisonRequest,
    installedPackages: string[] = []
  ): ComparisonMatrix {
    // 1. Validate request bounds (anti-happy path: checks min 2, max 3, non-empty)
    const validatedRequest = validateComparisonRequest(request);

    const installedSet = new Set(
      installedPackages.map((p) => p.toLowerCase().trim())
    );

    // 2. Resolve skills from repository (resilient to ID, indicator, or name)
    const resolvedSkills: Skill[] = [];
    const missingIds: string[] = [];

    for (const rawId of validatedRequest.skillIds) {
      const cleanId = rawId.trim();
      const skill = this.resolveSkill(cleanId);
      if (skill) {
        // Prevent duplicate columns if user requested the same skill twice under different aliases
        if (!resolvedSkills.some((s) => s.id === skill.id)) {
          resolvedSkills.push(skill);
        }
      } else {
        missingIds.push(cleanId);
      }
    }

    if (missingIds.length > 0) {
      throw new Error(
        `Failed to generate comparison: skill(s) not found: ${missingIds.map((id) => `"${id}"`).join(', ')}`
      );
    }

    if (resolvedSkills.length < 2) {
      throw new Error(
        'Comparison requires at least 2 distinct skills. Both resolved to the same package.'
      );
    }

    // 3. Build Comparison Columns
    const columns: ComparisonColumn[] = resolvedSkills.map((skill) => {
      const isInstalled =
        installedSet.has(skill.id.toLowerCase()) ||
        skill.stackIndicators.some((ind) => installedSet.has(ind.toLowerCase()));

      const pros = this.derivePros(skill);
      const caveats = this.deriveCaveats(skill);

      return {
        id: skill.id,
        name: skill.name,
        ecosystem: skill.ecosystem,
        category: skill.category,
        difficulty: skill.difficulty,
        trustTier: this.classifier.classify(true),
        description: skill.description,
        whyUseIt: skill.whyUseIt,
        pros,
        caveats,
        worksWellWith: [...skill.worksWellWith],
        stackIndicators: [...skill.stackIndicators],
        officialUrl: skill.officialUrl,
        isInstalledInWorkspace: isInstalled,
      };
    });

    // 4. Detect mutual conflicts and alternatives among compared tools
    const conflictsDetected: string[] = [];
    for (let i = 0; i < resolvedSkills.length; i++) {
      for (let j = i + 1; j < resolvedSkills.length; j++) {
        const a = resolvedSkills[i]!;
        const b = resolvedSkills[j]!;

        const aListsB =
          a.alternatives.includes(b.id) ||
          b.stackIndicators.some((ind) => a.alternatives.includes(ind));
        const bListsA =
          b.alternatives.includes(a.id) ||
          a.stackIndicators.some((ind) => b.alternatives.includes(ind));

        if (aListsB || bListsA) {
          conflictsDetected.push(
            `"${a.name}" and "${b.name}" are direct alternatives in ${a.category}. Choosing one typically replaces the other.`
          );
        } else if (a.category === b.category && a.ecosystem === b.ecosystem) {
          conflictsDetected.push(
            `"${a.name}" and "${b.name}" serve similar roles in ${a.ecosystem} projects.`
          );
        }
      }
    }

    // 5. Cross-ecosystem detection
    const uniqueEcosystems = new Set(
      resolvedSkills.map((s) => s.ecosystem.toLowerCase())
    );
    const isCrossEcosystem = uniqueEcosystems.size > 1;

    // 6. Categories represented
    const categories: SkillCategory[] = Array.from(
      new Set(resolvedSkills.map((s) => s.category))
    );

    // 7. Executive summary
    const summary = this.generateSummary(resolvedSkills, isCrossEcosystem);

    const matrix: ComparisonMatrix = {
      columns,
      categories,
      isCrossEcosystem,
      conflictsDetected,
      summary,
    };

    return validateComparisonMatrix(matrix);
  }

  private resolveSkill(identifier: string): Skill | undefined {
    // 1. Direct ID lookup
    const byId = this.repository.getSkillById(identifier);
    if (byId) return byId;

    // 2. By indicator or package name
    const byIndicator = this.repository.getSkillByIndicator(identifier);
    if (byIndicator) return byIndicator;

    // 3. By display name or case-insensitive search
    const lower = identifier.toLowerCase();
    return this.repository
      .getAllSkills()
      .find((s) => s.name.toLowerCase() === lower || s.id.toLowerCase() === lower);
  }

  private derivePros(skill: Skill): string[] {
    const pros: string[] = [];
    if (skill.whyUseIt) {
      pros.push(skill.whyUseIt);
    }
    if (skill.worksWellWith && skill.worksWellWith.length > 0) {
      pros.push(
        `Integrates seamlessly with ${skill.worksWellWith.slice(0, 3).join(', ')}`
      );
    }
    if (skill.tags && skill.tags.length > 0) {
      pros.push(`Core competencies: ${skill.tags.slice(0, 3).join(', ')}`);
    }
    return pros;
  }

  private deriveCaveats(skill: Skill): string | undefined {
    if (skill.prerequisites && skill.prerequisites.length > 0) {
      return `Assumes proficiency with ${skill.prerequisites.join(', ')}.`;
    }
    if (skill.difficulty === 'advanced') {
      return 'Advanced architectural paradigms and learning curve.';
    }
    return undefined;
  }

  private generateSummary(skills: Skill[], isCrossEcosystem: boolean): string {
    const names = skills.map((s) => s.name).join(' vs ');
    if (isCrossEcosystem) {
      const ecosystems = Array.from(new Set(skills.map((s) => s.ecosystem))).join(
        ' and '
      );
      return `Side-by-side architectural comparison of ${names} spanning ${ecosystems} ecosystems.`;
    }
    return `Side-by-side architectural comparison of ${names} within the ${skills[0]?.ecosystem} ecosystem.`;
  }
}
