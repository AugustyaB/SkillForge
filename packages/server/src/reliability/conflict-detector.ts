import type { SuggestedSkill } from '@skillforge/shared';
import type { SkillsRepository } from '../data/skills-repository.js';

export interface ConflictAnnotation {
  skillId: string;
  conflictWith: string[];
  conflictWarning: string;
}

/**
 * ConflictDetector — Analyzes suggested skills for mutually exclusive
 * alternatives and incompatibility with already-installed workspace packages.
 *
 * Two conflict types:
 *  1. Installed Conflict: A suggested skill's alternatives list contains a
 *     package already in the user's workspace.
 *  2. Co-suggestion Conflict: Two suggested skills in the same result set
 *     are listed as alternatives to each other.
 */
export class ConflictDetector {
  private repository?: SkillsRepository;

  constructor(repository?: SkillsRepository) {
    this.repository = repository;
  }

  /**
   * Annotate suggested skills with conflict warnings.
   * Returns a new array with conflictWith and conflictWarning populated
   * on any skill that has detected conflicts.
   */
  public detectConflicts(
    skills: SuggestedSkill[],
    alreadyInstalled: string[] = []
  ): SuggestedSkill[] {
    const safeInstalled = Array.isArray(alreadyInstalled)
      ? alreadyInstalled.filter(
          (pkg): pkg is string => typeof pkg === 'string' && pkg.trim().length > 0
        )
      : [];

    const installedSet = new Set(
      safeInstalled.map((pkg) => pkg.toLowerCase().trim())
    );

    // Expand installed set with canonical skill IDs if repository is available
    if (this.repository) {
      for (const pkg of safeInstalled) {
        const matched = this.repository.getSkillByIndicator(pkg);
        if (matched) {
          installedSet.add(matched.id.toLowerCase());
        }
      }
    }

    // Build a lookup of skill IDs in this result set for co-suggestion detection
    const resultIdSet = new Set(
      skills.map((s) => s.id.toLowerCase())
    );

    return skills.map((skill) => {
      const conflicts: string[] = [];
      const warnings: string[] = [];

      // 1. Installed Conflict: Check if any of this skill's alternatives
      //    are already installed in the user's workspace
      for (const alt of skill.alternatives) {
        const normalizedAlt = alt.toLowerCase().trim();
        let isAltInstalled = installedSet.has(normalizedAlt);

        if (!isAltInstalled && this.repository) {
          const altSkill = this.repository.getSkillById(normalizedAlt);
          if (altSkill) {
            isAltInstalled = altSkill.stackIndicators.some((ind) =>
              installedSet.has(ind.toLowerCase())
            );
          }
        }

        if (isAltInstalled) {
          conflicts.push(alt);
          warnings.push(
            `Alternative to already-installed '${alt}' — consider whether to replace it`
          );
        }
      }

      // 2. Co-suggestion Conflict: Check if any of this skill's alternatives
      //    are also present in the current result set
      for (const alt of skill.alternatives) {
        const normalizedAlt = alt.toLowerCase().trim();
        // Only flag if not the same skill and not already flagged as installed conflict
        if (
          resultIdSet.has(normalizedAlt) &&
          normalizedAlt !== skill.id.toLowerCase() &&
          !conflicts.includes(alt)
        ) {
          conflicts.push(alt);
          warnings.push(
            `Alternative to '${alt}' in this list — pick one, not both`
          );
        }
      }

      if (conflicts.length === 0) {
        return skill;
      }

      return {
        ...skill,
        conflictWith: conflicts,
        conflictWarning: warnings.join('. ') + '.',
      };
    });
  }
}
