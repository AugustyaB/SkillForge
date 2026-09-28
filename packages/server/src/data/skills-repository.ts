import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  validateSkillsArray,
  type Skill,
  type SkillCategory,
  type Difficulty,
} from '@skillforge/shared';

export interface SearchOptions {
  category?: SkillCategory;
  ecosystem?: string;
  difficulty?: Difficulty | 'all';
  maxResults?: number;
}

export interface ScoredSkill {
  skill: Skill;
  score: number;
  matchReasons: string[];
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'he',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'that',
  'the',
  'to',
  'was',
  'were',
  'will',
  'with',
  'i',
  'want',
  'need',
  'like',
  'how',
  'can',
  'build',
  'create',
  'make',
  'do',
  'my',
  'app',
  'apps',
  'application',
]);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class SkillsRepository {
  private skills: Skill[] = [];
  private idIndex = new Map<string, Skill>();
  private tagIndex = new Map<string, Set<string>>();
  private categoryIndex = new Map<string, Set<string>>();
  private ecosystemIndex = new Map<string, Set<string>>();
  private indicatorIndex = new Map<string, Skill>();

  constructor(customSkills?: Skill[]) {
    if (customSkills) {
      this.loadSkills(customSkills);
    } else {
      this.loadDefaultDataset();
    }
  }

  private loadDefaultDataset(): void {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
    let jsonPath = path.join(currentDir, 'skills.json');

    // Fallback search locations
    if (!fs.existsSync(jsonPath)) {
      const candidates = [
        path.join(currentDir, '..', 'data', 'skills.json'),
        path.join(currentDir, '..', 'src', 'data', 'skills.json'),
        path.join(process.cwd(), 'packages', 'server', 'src', 'data', 'skills.json'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          jsonPath = candidate;
          break;
        }
      }
    }

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Failed to locate skills.json dataset. Looked at: ${jsonPath}`);
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const validated = validateSkillsArray(parsed);
    this.loadSkills(validated);
  }

  public loadSkills(skillsList: Skill[]): void {
    this.skills = skillsList;
    this.idIndex.clear();
    this.tagIndex.clear();
    this.categoryIndex.clear();
    this.ecosystemIndex.clear();

    for (const skill of skillsList) {
      // 1. Index by ID
      this.idIndex.set(skill.id, skill);

      // 2. Inverted index by tag
      for (const tag of skill.tags) {
        const normalizedTag = tag.toLowerCase().trim();
        if (!this.tagIndex.has(normalizedTag)) {
          this.tagIndex.set(normalizedTag, new Set());
        }
        this.tagIndex.get(normalizedTag)!.add(skill.id);
      }

      // 3. Index by category
      if (!this.categoryIndex.has(skill.category)) {
        this.categoryIndex.set(skill.category, new Set());
      }
      this.categoryIndex.get(skill.category)!.add(skill.id);

      // 4. Index by ecosystem
      const eco = skill.ecosystem.toLowerCase();
      if (!this.ecosystemIndex.has(eco)) {
        this.ecosystemIndex.set(eco, new Set());
      }
      this.ecosystemIndex.get(eco)!.add(skill.id);

      // 5. Index by stack indicators and skill ID
      this.indicatorIndex.set(skill.id.toLowerCase(), skill);
      for (const ind of skill.stackIndicators) {
        this.indicatorIndex.set(ind.toLowerCase().trim(), skill);
      }
    }
  }

  public get count(): number {
    return this.skills.length;
  }

  public getAllSkills(): Skill[] {
    return [...this.skills];
  }

  public getSkillById(id: string): Skill | undefined {
    if (!id || typeof id !== 'string') return undefined;
    const cleanId = id.trim();
    return this.idIndex.get(cleanId) || this.idIndex.get(cleanId.toLowerCase());
  }

  public getSkillByIndicator(indicator: string): Skill | undefined {
    return this.indicatorIndex.get(indicator.toLowerCase().trim());
  }

  public getSkillsByCategory(category: SkillCategory): Skill[] {
    const ids = this.categoryIndex.get(category);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.idIndex.get(id)!)
      .filter(Boolean);
  }

  public getSkillsByTag(tag: string): Skill[] {
    const ids = this.tagIndex.get(tag.toLowerCase().trim());
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.idIndex.get(id)!)
      .filter(Boolean);
  }

  public search(query: string, options?: SearchOptions): ScoredSkill[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    // Tokenization and stop-word removal
    const rawTokens = trimmed
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const tokens = new Set<string>();
    for (const t of rawTokens) {
      if (t.length >= 2 && !STOP_WORDS.has(t)) {
        tokens.add(t);
      }
      if (t.includes('-')) {
        const noHyphen = t.replace(/-/g, '');
        if (noHyphen.length >= 2 && !STOP_WORDS.has(noHyphen)) {
          tokens.add(noHyphen);
        }
      }
    }

    const scoredResults: ScoredSkill[] = [];

    for (const skill of this.skills) {
      // Apply filters
      if (options?.category && skill.category !== options.category) {
        continue;
      }
      if (
        options?.difficulty &&
        options.difficulty !== 'all' &&
        skill.difficulty !== options.difficulty
      ) {
        continue;
      }
      if (options?.ecosystem && skill.ecosystem !== 'multi' && skill.ecosystem !== options.ecosystem) {
        continue;
      }

      let score = 0;
      const matchReasons: string[] = [];
      const lowerName = skill.name.toLowerCase();
      const lowerId = skill.id.toLowerCase();
      const lowerDesc = skill.description.toLowerCase();
      const lowerWhy = skill.whyUseIt.toLowerCase();

      // Exact name or ID match
      if (trimmed === lowerName || trimmed === lowerId) {
        score += 100;
        matchReasons.push(`Exact name match: "${skill.name}"`);
      } else if (trimmed.includes(lowerName)) {
        score += 60;
        matchReasons.push(`Query mentions name: "${skill.name}"`);
      }

      // Token matching
      for (const token of tokens) {
        // Whole-word match in name or exact token match
        if (lowerName === token || lowerId === token) {
          score += 50;
          matchReasons.push(`Matches name "${skill.name}"`);
        } else if (/^\w+$/.test(token)) {
          const escaped = escapeRegExp(token);
          if (new RegExp(`\\b${escaped}\\b`, 'i').test(lowerName)) {
            score += 40;
            matchReasons.push(`Name contains word "${token}"`);
          }
        } else if (lowerName.includes(token)) {
          score += 40;
          matchReasons.push(`Name contains "${token}"`);
        }

        if (skill.tags.some((t) => t.toLowerCase() === token)) {
          score += 35;
          matchReasons.push(`Tag exact match: "${token}"`);
        } else if (skill.tags.some((t) => t.toLowerCase().includes(token))) {
          score += 15;
          matchReasons.push(`Tag partial match: "${token}"`);
        }

        if (skill.stackIndicators.some((ind) => ind.toLowerCase() === token)) {
          score += 30;
          matchReasons.push(`Stack indicator match: "${token}"`);
        }

        if (lowerDesc.includes(token)) {
          score += 5;
        }

        if (lowerWhy.includes(token)) {
          score += 5;
        }
      }

      if (score > 0) {
        scoredResults.push({
          skill,
          score,
          matchReasons,
        });
      }
    }

    scoredResults.sort((a, b) => b.score - a.score);

    const maxResults = options?.maxResults ?? 10;
    return scoredResults.slice(0, maxResults);
  }
}
