import type { Skill, SuggestedSkill, RawSuggestion, TrustTier } from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';

export interface AnchorResult {
  /** The fully populated SuggestedSkill after anchoring */
  suggestedSkill: SuggestedSkill;
  /** Whether the skill was found in the curated database */
  isAnchored: boolean;
}

/**
 * Ground-Truth Anchor — Cross-references candidate suggestions against the
 * curated SkillsRepository to:
 *  1. Elevate matched skills to 'verified' trust tier
 *  2. Replace or merge with vetted metadata (URLs, descriptions, stack indicators)
 *  3. Flag non-matches for downstream registry/health verification
 */
export class GroundTruthAnchor {
  private repository: SkillsRepository;

  constructor(repository: SkillsRepository) {
    this.repository = repository;
  }

  /**
   * Attempt to anchor a raw/external suggestion against the curated DB.
   * If found, returns verified SuggestedSkill with full curated metadata.
   * If not found, returns a 'suggested' tier placeholder.
   */
  public anchor(raw: RawSuggestion, defaults?: Partial<SuggestedSkill>): AnchorResult {
    // Strategy 1: Direct ID match
    const directMatch = raw.id ? this.repository.getSkillById(raw.id) : undefined;

    if (directMatch) {
      return this.buildAnchored(directMatch, raw, defaults);
    }

    // Strategy 2: Normalized name match — convert name to ID-like format
    const normalizedId = this.normalizeToId(raw.name);
    const nameMatch = this.repository.getSkillById(normalizedId);

    if (nameMatch) {
      return this.buildAnchored(nameMatch, raw, defaults);
    }

    // Strategy 3: Fuzzy search — search by name and take top exact match
    const searchResults = this.repository.search(raw.name, { maxResults: 3 });
    const topMatch = searchResults.find(
      (r) =>
        r.skill.name.toLowerCase() === raw.name.toLowerCase() ||
        r.skill.id === normalizedId
    );

    if (topMatch) {
      return this.buildAnchored(topMatch.skill, raw, defaults);
    }

    // No match — return unanchored suggestion
    return this.buildUnanchored(raw, defaults);
  }

  /**
   * Anchor multiple raw suggestions at once.
   */
  public anchorAll(
    suggestions: RawSuggestion[],
    defaults?: Partial<SuggestedSkill>
  ): AnchorResult[] {
    return suggestions.map((raw) => this.anchor(raw, defaults));
  }

  /**
   * Build a verified SuggestedSkill from a curated match, merging external reasoning.
   */
  private buildAnchored(
    curatedSkill: Skill,
    raw: RawSuggestion,
    defaults?: Partial<SuggestedSkill>
  ): AnchorResult {
    const reasoning =
      raw.reasoning ||
      defaults?.reasoning ||
      `Verified in curated database: ${curatedSkill.whyUseIt}`;

    const confidence = Math.max(raw.confidence ?? 0.85, 0.8);

    return {
      suggestedSkill: {
        ...curatedSkill,
        trustTier: 'verified' as TrustTier,
        confidence,
        reasoning,
        isInstalledInWorkspace: defaults?.isInstalledInWorkspace ?? false,
        ...(defaults?.caveats && { caveats: defaults.caveats }),
      },
      isAnchored: true,
    };
  }

  /**
   * Build an unanchored SuggestedSkill for candidates not found in the curated DB.
   * These will be forwarded to health verification and registry checks downstream.
   */
  private buildUnanchored(
    raw: RawSuggestion,
    defaults?: Partial<SuggestedSkill>
  ): AnchorResult {
    return {
      suggestedSkill: {
        id: raw.id || this.normalizeToId(raw.name),
        name: raw.name,
        category: raw.category || 'other',
        difficulty: raw.difficulty || 'intermediate',
        description: raw.description || `${raw.name} — external suggestion.`,
        whyUseIt: raw.whyUseIt || raw.reasoning || `Suggested tool: ${raw.name}.`,
        tags: raw.tags || [this.normalizeToId(raw.name)],
        ecosystem: raw.ecosystem || 'multi',
        officialUrl: raw.officialUrl || '',
        learnResources: [],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: [this.normalizeToId(raw.name)],
        trustTier: 'suggested' as TrustTier,
        confidence: raw.confidence ?? 0.5,
        reasoning: raw.reasoning || defaults?.reasoning || 'External suggestion — not yet verified.',
        isInstalledInWorkspace: defaults?.isInstalledInWorkspace ?? false,
      },
      isAnchored: false,
    };
  }

  /**
   * Convert a display name to a normalized ID format.
   * "Express.js" -> "express-js", "React Router" -> "react-router"
   */
  private normalizeToId(name: string): string {
    return name
      .toLowerCase()
      .replace(/\./g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
