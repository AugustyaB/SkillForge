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

    // 3. Resolve missing IDs against alternatives or companions of resolved skills
    const unresolvableIds: string[] = [];
    const synthesizedColumns: ComparisonColumn[] = [];

    for (const missingId of missingIds) {
      const lower = missingId.toLowerCase();
      const parentSkill = resolvedSkills.find(
        (s) =>
          s.alternatives.some((alt) => alt.toLowerCase() === lower) ||
          s.worksWellWith.some((w) => w.toLowerCase() === lower)
      );

      if (parentSkill) {
        synthesizedColumns.push(
          this.synthesizeAlternativeColumn(missingId, parentSkill, installedSet)
        );
      } else {
        unresolvableIds.push(missingId);
      }
    }

    if (unresolvableIds.length > 0) {
      throw new Error(
        `Failed to generate comparison: skill(s) not found: ${unresolvableIds.map((id) => `"${id}"`).join(', ')}`
      );
    }

    // 4. Build Comparison Columns from resolved catalog skills
    const catalogColumns: ComparisonColumn[] = resolvedSkills.map((skill) => {
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

    const columns: ComparisonColumn[] = [...catalogColumns, ...synthesizedColumns];

    if (columns.length < 2) {
      throw new Error(
        'Comparison requires at least 2 distinct skills. Both resolved to the same package.'
      );
    }

    // 5. Detect mutual conflicts and alternatives among compared tools
    const conflictsDetected: string[] = [];
    for (let i = 0; i < columns.length; i++) {
      for (let j = i + 1; j < columns.length; j++) {
        const a = columns[i]!;
        const b = columns[j]!;

        const skillA = resolvedSkills.find((s) => s.id === a.id);
        const skillB = resolvedSkills.find((s) => s.id === b.id);

        const aListsB =
          skillA &&
          (skillA.alternatives.some((alt) => alt.toLowerCase() === b.id.toLowerCase()) ||
            b.stackIndicators.some((ind) =>
              skillA.alternatives.some((alt) => alt.toLowerCase() === ind.toLowerCase())
            ));

        const bListsA =
          skillB &&
          (skillB.alternatives.some((alt) => alt.toLowerCase() === a.id.toLowerCase()) ||
            a.stackIndicators.some((ind) =>
              skillB.alternatives.some((alt) => alt.toLowerCase() === ind.toLowerCase())
            ));

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

    // 6. Cross-ecosystem detection
    const uniqueEcosystems = new Set(
      columns.map((c) => c.ecosystem.toLowerCase())
    );
    const isCrossEcosystem = uniqueEcosystems.size > 1;

    // 7. Categories represented
    const categories: SkillCategory[] = Array.from(
      new Set(columns.map((c) => c.category))
    );

    // 8. Executive summary
    const summary = this.generateSummary(columns, isCrossEcosystem);

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

  private synthesizeAlternativeColumn(
    identifier: string,
    parentSkill: Skill,
    installedSet: Set<string>
  ): ComparisonColumn {
    const clean = identifier.trim();
    const id = clean.toLowerCase();
    const isInstalled = installedSet.has(id);
    const category: SkillCategory = parentSkill.category;
    const ecosystem = parentSkill.ecosystem;

    // Format human-friendly display name (e.g. 'vuex' -> 'Vuex', 'react-query' -> 'React Query')
    const displayName = clean
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let officialUrl: string;
    if (ecosystem === 'python') {
      officialUrl = `https://pypi.org/project/${encodeURIComponent(clean)}/`;
    } else if (ecosystem === 'rust') {
      officialUrl = `https://crates.io/crates/${encodeURIComponent(clean)}`;
    } else if (ecosystem === 'go') {
      officialUrl = `https://pkg.go.dev/${encodeURIComponent(clean)}`;
    } else {
      officialUrl = `https://www.npmjs.com/package/${encodeURIComponent(clean)}`;
    }

    return {
      id,
      name: displayName,
      ecosystem,
      category,
      difficulty: 'intermediate',
      trustTier: this.classifier.classify(false),
      description: `Community alternative and ecosystem tool for ${clean}.`,
      whyUseIt: `Evaluated as an ecosystem alternative in ${category}.`,
      pros: [
        'Established community footprint',
        `Direct architectural alternative in ${category}`,
      ],
      caveats:
        'Third-party alternative not curated in the core SkillForge catalog; verify registry health, maintenance status, and security posture.',
      worksWellWith: [],
      stackIndicators: [id],
      officialUrl,
      isInstalledInWorkspace: isInstalled,
    };
  }

  private generateSummary(columns: ComparisonColumn[], isCrossEcosystem: boolean): string {
    const names = columns.map((c) => c.name).join(' vs ');
    if (isCrossEcosystem) {
      const ecosystems = Array.from(new Set(columns.map((c) => c.ecosystem))).join(
        ' and '
      );
      return `Side-by-side architectural comparison of ${names} spanning ${ecosystems} ecosystems.`;
    }
    return `Side-by-side architectural comparison of ${names} within the ${columns[0]?.ecosystem} ecosystem.`;
  }
}

