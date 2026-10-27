import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateSkillsArray,
  safeValidateWorkspaceSkillsConfig,
  type Skill,
  type SkillCategory,
  type Difficulty,
} from '@skillforge/shared';
import { DEFAULT_SKILLS_DATA } from './skills-data.js';
import { expandQueryWithTaxonomy } from './taxonomy.js';

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
  private workspaceSkills: Skill[] = [];
  private workspaceOverrides = new Map<string, Partial<Skill>>();
  private loadedRoots = new Set<string>();

  constructor(customSkills?: Skill[]) {
    if (customSkills) {
      this.loadSkills(customSkills);
    } else {
      this.loadDefaultDataset();
    }
  }

  private loadDefaultDataset(): void {
    if (Array.isArray(DEFAULT_SKILLS_DATA) && DEFAULT_SKILLS_DATA.length > 0) {
      this.loadSkills(DEFAULT_SKILLS_DATA);
      return;
    }

    const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
    let jsonPath = path.join(currentDir, 'skills.json');

    // Fallback search locations
    if (!fs.existsSync(jsonPath)) {
      const candidates = [
        path.join(currentDir, 'skills.json'),
        path.join(currentDir, 'data', 'skills.json'),
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

    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const validated = validateSkillsArray(parsed);
      this.loadSkills(validated);
    }
  }

  public loadSkills(skillsList: Skill[]): void {
    this.skills = [...skillsList];
    this.idIndex.clear();
    this.tagIndex.clear();
    this.categoryIndex.clear();
    this.ecosystemIndex.clear();
    this.indicatorIndex.clear();
    this.workspaceSkills = [];
    this.workspaceOverrides.clear();
    this.loadedRoots.clear();

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

  /**
   * Programmatically merges workspace private skills and overrides into the repository indices.
   */
  public loadWorkspaceConfig(config: {
    skills?: Skill[];
    overrides?: Record<string, Partial<Skill>>;
  }): { loadedCount: number; overriddenCount: number } {
    let loadedCount = 0;
    let overriddenCount = 0;

    if (Array.isArray(config.skills)) {
      for (const skill of config.skills) {
        const workspaceSkill: Skill = {
          ...skill,
          source: 'workspace',
        };

        const existing = this.idIndex.get(workspaceSkill.id);
        if (existing) {
          // Shadow existing skill cleanly in the primary array
          const idx = this.skills.findIndex((s) => s.id === workspaceSkill.id);
          if (idx !== -1) {
            this.skills[idx] = workspaceSkill;
          }
        } else {
          this.skills.push(workspaceSkill);
        }

        this.idIndex.set(workspaceSkill.id, workspaceSkill);

        // Index tags
        for (const tag of workspaceSkill.tags) {
          const normalizedTag = tag.toLowerCase().trim();
          if (!this.tagIndex.has(normalizedTag)) {
            this.tagIndex.set(normalizedTag, new Set());
          }
          this.tagIndex.get(normalizedTag)!.add(workspaceSkill.id);
        }

        // Index category
        if (!this.categoryIndex.has(workspaceSkill.category)) {
          this.categoryIndex.set(workspaceSkill.category, new Set());
        }
        this.categoryIndex.get(workspaceSkill.category)!.add(workspaceSkill.id);

        // Index ecosystem
        const eco = workspaceSkill.ecosystem.toLowerCase();
        if (!this.ecosystemIndex.has(eco)) {
          this.ecosystemIndex.set(eco, new Set());
        }
        this.ecosystemIndex.get(eco)!.add(workspaceSkill.id);

        // Index indicators
        this.indicatorIndex.set(workspaceSkill.id.toLowerCase(), workspaceSkill);
        for (const ind of workspaceSkill.stackIndicators) {
          this.indicatorIndex.set(ind.toLowerCase().trim(), workspaceSkill);
        }

        this.workspaceSkills.push(workspaceSkill);
        loadedCount++;
      }
    }

    if (config.overrides) {
      for (const [skillId, override] of Object.entries(config.overrides)) {
        const target = this.idIndex.get(skillId);
        if (target) {
          Object.assign(target, override);
          this.workspaceOverrides.set(skillId, override);
          overriddenCount++;
        }
      }
    }

    return { loadedCount, overriddenCount };
  }

  /**
   * Discovers and parses .skillforge.json or .skillforge/skills.json across workspace roots.
   */
  public loadWorkspaceSkills(workspaceRoots: string | string[]): {
    loadedCount: number;
    overriddenCount: number;
    errors: string[];
  } {
    if (!workspaceRoots) {
      return { loadedCount: 0, overriddenCount: 0, errors: [] };
    }

    const roots = Array.isArray(workspaceRoots) ? workspaceRoots : [workspaceRoots];
    let loadedCount = 0;
    let overriddenCount = 0;
    const errors: string[] = [];

    for (const rawRoot of roots) {
      if (typeof rawRoot !== 'string' || !rawRoot.trim()) continue;

      let cleanRoot = rawRoot.trim();
      if (cleanRoot.startsWith('file://')) {
        try {
          cleanRoot = fileURLToPath(cleanRoot);
        } catch {
          // Keep as is if URL parse fails
        }
      }

      if (this.loadedRoots.has(cleanRoot)) {
        continue;
      }
      this.loadedRoots.add(cleanRoot);

      const candidates = [
        path.join(cleanRoot, '.skillforge.json'),
        path.join(cleanRoot, '.skillforge', 'skills.json'),
        path.join(cleanRoot, '.skillforge', 'catalog.json'),
      ];

      for (const candidate of candidates) {
        try {
          if (!fs.existsSync(candidate)) continue;

          const stat = fs.statSync(candidate);
          if (stat.isDirectory()) continue;

          if (stat.size > 5 * 1024 * 1024) {
            errors.push(`Config file ${candidate} exceeds 5MB size limit (${stat.size} bytes)`);
            continue;
          }
          if (stat.size === 0) {
            errors.push(`Config file ${candidate} is empty`);
            continue;
          }

          const raw = fs.readFileSync(candidate, 'utf-8');
          if (!raw.trim()) {
            errors.push(`Config file ${candidate} contains only whitespace`);
            continue;
          }

          let parsed: unknown;
          try {
            parsed = JSON.parse(raw);
          } catch (jsonErr: unknown) {
            const msg = jsonErr instanceof Error ? jsonErr.message : String(jsonErr);
            errors.push(`Invalid JSON syntax in ${candidate}: ${msg}`);
            continue;
          }

          const validated = safeValidateWorkspaceSkillsConfig(parsed);
          if (!validated.success) {
            errors.push(`Validation failed for ${candidate}: ${validated.error.message}`);
            continue;
          }

          const res = this.loadWorkspaceConfig(validated.data);
          loadedCount += res.loadedCount;
          overriddenCount += res.overriddenCount;
        } catch (fsErr: unknown) {
          const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
          errors.push(`Failed to read ${candidate}: ${msg}`);
        }
      }
    }

    return { loadedCount, overriddenCount, errors };
  }

  /**
   * Resets all loaded workspace skills and overrides, restoring the pristine default catalog.
   */
  public resetWorkspaceSkills(): void {
    this.workspaceSkills = [];
    this.workspaceOverrides.clear();
    this.loadedRoots.clear();
    this.loadDefaultDataset();
  }

  /**
   * Returns all active workspace private skills.
   */
  public getWorkspaceSkills(): Skill[] {
    return [...this.workspaceSkills];
  }

  /**
   * Adds or updates a local workspace skill in-memory, updating all 5 inverted indices.
   */
  public addLocalSkill(skill: Skill): void {
    const workspaceSkill: Skill = {
      ...skill,
      source: 'workspace',
    };

    const existingIdx = this.skills.findIndex((s) => s.id === workspaceSkill.id);
    if (existingIdx !== -1) {
      this.skills[existingIdx] = workspaceSkill;
    } else {
      this.skills.push(workspaceSkill);
    }

    this.idIndex.set(workspaceSkill.id, workspaceSkill);

    // Index tags
    for (const tag of workspaceSkill.tags) {
      const normalizedTag = tag.toLowerCase().trim();
      if (!this.tagIndex.has(normalizedTag)) {
        this.tagIndex.set(normalizedTag, new Set());
      }
      this.tagIndex.get(normalizedTag)!.add(workspaceSkill.id);
    }

    // Index category
    if (!this.categoryIndex.has(workspaceSkill.category)) {
      this.categoryIndex.set(workspaceSkill.category, new Set());
    }
    this.categoryIndex.get(workspaceSkill.category)!.add(workspaceSkill.id);

    // Index ecosystem
    const eco = workspaceSkill.ecosystem.toLowerCase();
    if (!this.ecosystemIndex.has(eco)) {
      this.ecosystemIndex.set(eco, new Set());
    }
    this.ecosystemIndex.get(eco)!.add(workspaceSkill.id);

    // Index indicators
    this.indicatorIndex.set(workspaceSkill.id.toLowerCase(), workspaceSkill);
    for (const ind of workspaceSkill.stackIndicators) {
      this.indicatorIndex.set(ind.toLowerCase().trim(), workspaceSkill);
    }

    const wsIdx = this.workspaceSkills.findIndex((s) => s.id === workspaceSkill.id);
    if (wsIdx !== -1) {
      this.workspaceSkills[wsIdx] = workspaceSkill;
    } else {
      this.workspaceSkills.push(workspaceSkill);
    }
  }

  /**
   * Surgically removes a local workspace skill from in-memory arrays and indices.
   */
  public removeLocalSkill(skillId: string): boolean {
    if (!skillId) return false;
    const cleanId = skillId.trim().toLowerCase();

    const skill = this.idIndex.get(cleanId);
    if (!skill) return false;

    // Remove from skills array
    const skillIdx = this.skills.findIndex((s) => s.id.toLowerCase() === cleanId);
    if (skillIdx !== -1) {
      this.skills.splice(skillIdx, 1);
    }

    // Remove from idIndex
    this.idIndex.delete(skill.id);
    this.idIndex.delete(cleanId);

    // Remove from tagIndex
    for (const tag of skill.tags) {
      const normalizedTag = tag.toLowerCase().trim();
      const set = this.tagIndex.get(normalizedTag);
      if (set) {
        set.delete(skill.id);
        if (set.size === 0) {
          this.tagIndex.delete(normalizedTag);
        }
      }
    }

    // Remove from categoryIndex
    const catSet = this.categoryIndex.get(skill.category);
    if (catSet) {
      catSet.delete(skill.id);
      if (catSet.size === 0) {
        this.categoryIndex.delete(skill.category);
      }
    }

    // Remove from ecosystemIndex
    const eco = skill.ecosystem.toLowerCase();
    const ecoSet = this.ecosystemIndex.get(eco);
    if (ecoSet) {
      ecoSet.delete(skill.id);
      if (ecoSet.size === 0) {
        this.ecosystemIndex.delete(eco);
      }
    }

    // Remove from indicatorIndex
    this.indicatorIndex.delete(skill.id.toLowerCase());
    for (const ind of skill.stackIndicators) {
      this.indicatorIndex.delete(ind.toLowerCase().trim());
    }

    // Remove from workspaceSkills
    const wsIdx = this.workspaceSkills.findIndex((s) => s.id.toLowerCase() === cleanId);
    if (wsIdx !== -1) {
      this.workspaceSkills.splice(wsIdx, 1);
    }

    return true;
  }

  /**
   * Lists all currently registered local workspace skills.
   */
  public listLocalSkills(): Skill[] {
    return [...this.workspaceSkills];
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
        // Lemmatization / stem: strip trailing 'ies', 'es', 's', 'ing', 'tion', 'ization'
        if (t.endsWith('ies') && t.length > 4) {
          tokens.add(t.slice(0, -3) + 'y');
        } else if (t.endsWith('es') && t.length > 3) {
          tokens.add(t.slice(0, -2));
        } else if (t.endsWith('s') && !t.endsWith('ss') && t.length > 2) {
          tokens.add(t.slice(0, -1));
        }
        if (t.endsWith('ing') && t.length > 4) {
          tokens.add(t.slice(0, -3));
        }
        if (t.endsWith('tion') && t.length > 5) {
          tokens.add(t.slice(0, -4));
        }
        if (t.endsWith('ization') && t.length > 8) {
          tokens.add(t.slice(0, -7));
        }
      }
      if (t.includes('-')) {
        const noHyphen = t.replace(/-/g, '');
        if (noHyphen.length >= 2 && !STOP_WORDS.has(noHyphen)) {
          tokens.add(noHyphen);
        }
      }
    }

    // Taxonomy enrichment for industry acronyms & synonyms (e.g. authn -> authentication, tf -> terraform)
    const taxonomy = expandQueryWithTaxonomy(trimmed);
    const canonicalToolIds = new Set(taxonomy.canonicalToolIds.map((id) => id.toLowerCase()));
    const synonymTokens = new Set<string>();
    for (const syn of taxonomy.synonymTokens) {
      if (syn.length >= 2 && !STOP_WORDS.has(syn)) {
        synonymTokens.add(syn);
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

      // Canonical tool match for acronyms (e.g. 'tf' -> 'terraform', 'k8s' -> 'kubernetes')
      if (canonicalToolIds.has(lowerId)) {
        score += 55;
        matchReasons.push(`Canonical tool match for acronym/synonym in query`);
      }

      // Taxonomy category alignment
      if (taxonomy.detectedCategories.includes(skill.category)) {
        score += 20;
        matchReasons.push(`Taxonomy category alignment: "${skill.category}"`);
      }

      // Exact name or ID match (use delimiter boundaries so short names like "Ent" or "Gin" don't match inside "authentication" or "login")
      const nameMentionRegex = new RegExp(
        `(?:^|[\\s,./_-])${escapeRegExp(lowerName)}(?:$|[\\s,./_-])`,
        'i'
      );
      if (trimmed === lowerName || trimmed === lowerId) {
        score += 100;
        matchReasons.push(`Exact name match: "${skill.name}"`);
      } else if (nameMentionRegex.test(trimmed)) {
        score += 60;
        matchReasons.push(`Query mentions name: "${skill.name}"`);
      }

      // Direct token matching
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

        const tagExact = skill.tags.some((t) => t.toLowerCase() === token);
        const tagContains = skill.tags.some((t) => {
          const lt = t.toLowerCase();
          if (lt === token) return true;
          if (lt.length >= 4 && token.length >= 4) {
            return lt.includes(token) || token.includes(lt);
          }
          return lt.includes(token);
        });

        if (tagExact) {
          score += 35;
          matchReasons.push(`Tag exact match: "${token}"`);
        } else if (tagContains) {
          score += 20;
          matchReasons.push(`Tag partial match: "${token}"`);
        }

        if (skill.stackIndicators.some((ind) => ind.toLowerCase() === token)) {
          score += 30;
          matchReasons.push(`Stack indicator match: "${token}"`);
        }

        if (lowerDesc.includes(token)) {
          score += 8;
        }

        if (lowerWhy.includes(token)) {
          score += 8;
        }
      }

      // Taxonomy synonym token matching
      for (const syn of synonymTokens) {
        if (tokens.has(syn)) continue; // already evaluated as direct token

        const tagExact = skill.tags.some((t) => t.toLowerCase() === syn);
        if (tagExact) {
          score += 25;
          matchReasons.push(`Taxonomy tag match: "${syn}"`);
        } else if (lowerName === syn || lowerId === syn) {
          score += 30;
          matchReasons.push(`Taxonomy concept match: "${syn}"`);
        } else if (lowerDesc.includes(syn)) {
          score += 5;
        }
      }

      if (score > 0) {
        // Workspace private skill affinity boost (+40 pts)
        if (skill.source === 'workspace') {
          score += 40;
          matchReasons.push('Workspace private skill defined in .skillforge.json');
        }

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
