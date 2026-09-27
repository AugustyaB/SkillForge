import type { TrustTier, PackageHealth, SuggestedSkill } from '@skillforge/shared';

/**
 * Trust tier hierarchy from highest to lowest confidence.
 * Used for ordering and filtering comparisons.
 */
const TRUST_TIER_RANK: Record<TrustTier, number> = {
  verified: 4,
  validated: 3,
  suggested: 2,
  deprecated: 1,
};

/**
 * TrustTierClassifier — Assigns a transparent trust tier to each suggestion
 * based on curation status, health verification results, and package existence.
 *
 * Trust Tiers:
 *  🟢 verified   — In curated DB, vetted, not abandoned
 *  🟡 validated  — Registry existence verified, healthy/aging
 *  🟠 suggested  — Exists, health unverified or low-confidence
 *  ⛔ deprecated — Deprecated flag or abandoned status
 */
export class TrustTierClassifier {
  /**
   * Classify a skill into a trust tier based on curation status and health data.
   */
  public classify(
    isCurated: boolean,
    health?: PackageHealth
  ): TrustTier {
    // Check for abandoned/deprecated first — overrides everything
    if (health?.healthVerdict === 'abandoned') {
      return 'deprecated';
    }

    // Curated and not abandoned = verified
    if (isCurated) {
      return 'verified';
    }

    // Not curated but verified to exist with good health
    if (health?.packageExists) {
      if (
        health.healthVerdict === 'healthy' ||
        health.healthVerdict === 'aging'
      ) {
        return 'validated';
      }
      // Exists but health is risky or unverified
      return 'suggested';
    }

    // Default: unverified
    return 'suggested';
  }

  /**
   * Apply trust tier classification to a SuggestedSkill and return updated copy.
   */
  public classifySkill(
    skill: SuggestedSkill,
    isCurated: boolean,
    health?: PackageHealth
  ): SuggestedSkill {
    const tier = this.classify(isCurated, health);
    return {
      ...skill,
      trustTier: tier,
      health: health ?? skill.health,
    };
  }

  /**
   * Filter skills by minimum trust tier.
   * Returns only skills at or above the specified tier.
   */
  public filterByMinTier(
    skills: SuggestedSkill[],
    minTier?: TrustTier
  ): SuggestedSkill[] {
    if (!minTier) return skills;

    const minRank = TRUST_TIER_RANK[minTier];
    return skills.filter(
      (skill) => TRUST_TIER_RANK[skill.trustTier] >= minRank
    );
  }

  /**
   * Get the numeric rank of a trust tier (higher = more trusted).
   */
  public getTierRank(tier: TrustTier): number {
    return TRUST_TIER_RANK[tier];
  }
}
