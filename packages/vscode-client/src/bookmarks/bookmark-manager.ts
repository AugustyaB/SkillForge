import * as vscode from 'vscode';
import type { Skill, SuggestedSkill, SkillBookmark } from '@skillforge/shared';
import {
  normalizeOfficialUrl,
  normalizeSkillCategory,
  validateSkillBookmark,
} from '@skillforge/shared';

export class BookmarkManager {
  public static readonly STORAGE_KEY = 'skillforge.bookmarks.v1';

  private memento: vscode.Memento;

  constructor(memento: vscode.Memento) {
    this.memento = memento;
  }

  /**
   * Retrieves all saved bookmarks, defensive against corrupted storage states.
   */
  public getBookmarks(): SkillBookmark[] {
    const raw = this.memento.get<unknown[]>(BookmarkManager.STORAGE_KEY);
    if (!Array.isArray(raw)) {
      return [];
    }

    const validBookmarks: SkillBookmark[] = [];
    for (const item of raw) {
      try {
        const validated = validateSkillBookmark(item);
        validBookmarks.push(validated);
      } catch {
        // Skip corrupted individual bookmark entries gracefully
      }
    }

    // Sort latest first
    return validBookmarks.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Checks whether a skill is bookmarked by ID (case-insensitive).
   */
  public isBookmarked(skillId: string): boolean {
    if (!skillId) return false;
    const normalized = skillId.toLowerCase().trim();
    return this.getBookmarks().some(
      (b) => b.id.toLowerCase() === normalized
    );
  }

  /**
   * Adds or updates a skill bookmark in globalState.
   */
  public async addBookmark(
    skill: Skill | SuggestedSkill | SkillBookmark,
    notes?: string
  ): Promise<void> {
    const existing = this.getBookmarks();
    const normalizedId = skill.id.toLowerCase().trim();

    const filtered = existing.filter(
      (b) => b.id.toLowerCase() !== normalizedId
    );

    const cleanName = skill.name.trim() || skill.id.trim();
    const bookmark: SkillBookmark = {
      id: skill.id.trim(),
      name: cleanName,
      ecosystem: skill.ecosystem?.trim() || 'multi',
      category: normalizeSkillCategory(skill.category),
      difficulty: skill.difficulty || 'intermediate',
      description: skill.description,
      whyUseIt: skill.whyUseIt?.trim() || `Saved tool bookmark for ${cleanName}`,
      officialUrl: normalizeOfficialUrl(skill.officialUrl, cleanName),
      tags: Array.isArray(skill.tags) ? [...skill.tags] : [],
      stackIndicators: Array.isArray(skill.stackIndicators)
        ? [...skill.stackIndicators]
        : [],
      trustTier: (skill as SuggestedSkill).trustTier || 'suggested',
      timestamp: Date.now(),
      notes: notes?.trim() || (skill as SkillBookmark).notes,
    };

    filtered.unshift(bookmark);
    await this.memento.update(BookmarkManager.STORAGE_KEY, filtered);
  }

  /**
   * Removes a bookmark by ID. Returns true if removed, false if not found.
   */
  public async removeBookmark(skillId: string): Promise<boolean> {
    if (!skillId) return false;
    const normalized = skillId.toLowerCase().trim();
    const existing = this.getBookmarks();
    const initialLength = existing.length;

    const filtered = existing.filter(
      (b) => b.id.toLowerCase() !== normalized
    );

    if (filtered.length !== initialLength) {
      await this.memento.update(BookmarkManager.STORAGE_KEY, filtered);
      return true;
    }

    return false;
  }

  /**
   * Toggles bookmark state for a skill.
   * Returns true if added, false if removed.
   */
  public async toggleBookmark(
    skill: Skill | SuggestedSkill | SkillBookmark
  ): Promise<boolean> {
    if (this.isBookmarked(skill.id)) {
      await this.removeBookmark(skill.id);
      return false;
    } else {
      await this.addBookmark(skill);
      return true;
    }
  }

  /**
   * Groups saved bookmarks by category.
   */
  public getBookmarksByCategory(): Map<string, SkillBookmark[]> {
    const bookmarks = this.getBookmarks();
    const grouped = new Map<string, SkillBookmark[]>();

    for (const b of bookmarks) {
      const list = grouped.get(b.category) || [];
      list.push(b);
      grouped.set(b.category, list);
    }

    return grouped;
  }

  /**
   * Groups saved bookmarks by ecosystem.
   */
  public getBookmarksByEcosystem(): Map<string, SkillBookmark[]> {
    const bookmarks = this.getBookmarks();
    const grouped = new Map<string, SkillBookmark[]>();

    for (const b of bookmarks) {
      const list = grouped.get(b.ecosystem) || [];
      list.push(b);
      grouped.set(b.ecosystem, list);
    }

    return grouped;
  }

  /**
   * Clears all bookmarks from storage.
   */
  public async clearBookmarks(): Promise<void> {
    await this.memento.update(BookmarkManager.STORAGE_KEY, []);
  }
}
