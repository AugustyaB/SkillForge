import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateSkill,
  safeValidateWorkspaceSkillsConfig,
  type Skill,
  type LocalSkillOperationResult,
} from '@skillforge/shared';
import { SkillsRepository } from './skills-repository.js';
import { QueryCache } from '../engine/query-cache.js';

export interface LocalSkillsManagerOptions {
  repository?: SkillsRepository;
  cache?: QueryCache;
}

/**
 * LocalSkillsManager — Robust, atomic database manager for project-level custom skills.
 * Handles interactive CRUD operations on `.skillforge/skills.json` with file locking,
 * backup rotation, corrupted file recovery, and live in-memory index synchronization.
 */
export class LocalSkillsManager {
  private repository: SkillsRepository;
  private cache?: QueryCache;

  constructor(options?: LocalSkillsManagerOptions) {
    this.repository = options?.repository ?? new SkillsRepository();
    this.cache = options?.cache;
  }

  public getRepository(): SkillsRepository {
    return this.repository;
  }

  /**
   * Resolves the canonical database file path for a workspace root.
   */
  public resolveDatabasePath(workspaceRoot: string): string {
    if (!workspaceRoot || typeof workspaceRoot !== 'string') {
      throw new Error('Valid workspaceRoot path is required');
    }

    let clean = workspaceRoot.trim();
    if (clean.startsWith('file://')) {
      try {
        clean = fileURLToPath(clean);
      } catch {
        // Fallback to raw string
      }
    }

    const dotSkillforgeJson = path.join(clean, '.skillforge.json');
    const dotDirSkillsJson = path.join(clean, '.skillforge', 'skills.json');

    // If root-level .skillforge.json already exists, respect it; otherwise use .skillforge/skills.json
    if (fs.existsSync(dotSkillforgeJson) && !fs.existsSync(dotDirSkillsJson)) {
      return dotSkillforgeJson;
    }

    return dotDirSkillsJson;
  }

  /**
   * Safely reads the workspace database, recovering from corrupt files if detected.
   */
  public readDatabase(workspaceRoot: string): {
    skills: Skill[];
    overrides: Record<string, Partial<Skill>>;
    filePath: string;
  } {
    const filePath = this.resolveDatabasePath(workspaceRoot);
    if (!fs.existsSync(filePath)) {
      return { skills: [], overrides: {}, filePath };
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (!raw.trim()) {
        return { skills: [], overrides: {}, filePath };
      }

      const parsed = JSON.parse(raw);
      const validated = safeValidateWorkspaceSkillsConfig(parsed);
      if (validated.success) {
        return {
          skills: validated.data.skills,
          overrides: validated.data.overrides,
          filePath,
        };
      }

      // Schema invalid -> rotate corrupt file and return fresh baseline
      this.rotateCorruptFile(filePath);
      return { skills: [], overrides: {}, filePath };
    } catch {
      // JSON syntax error -> rotate corrupt file and return fresh baseline
      this.rotateCorruptFile(filePath);
      return { skills: [], overrides: {}, filePath };
    }
  }

  /**
   * Atomically writes file content using temporary file and atomic rename.
   */
  private async atomicWriteFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Preserve previous version as backup
    if (fs.existsSync(filePath)) {
      try {
        fs.copyFileSync(filePath, `${filePath}.bak`);
      } catch {
        // Best-effort backup
      }
    }

    const tmpPath = path.join(dir, `.skills.json.tmp.${process.pid}.${Date.now()}`);
    fs.writeFileSync(tmpPath, content, 'utf-8');

    // Atomic rename with Windows file lock retry loop
    let renamed = false;
    let lastError: unknown;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        fs.renameSync(tmpPath, filePath);
        renamed = true;
        break;
      } catch (err: unknown) {
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 50 * Math.pow(2, attempt)));
      }
    }

    if (!renamed) {
      try {
        if (fs.existsSync(tmpPath)) {
          fs.unlinkSync(tmpPath);
        }
      } catch {
        // ignore
      }
      throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }
  }

  /**
   * Rotates a corrupt database file to prevent total data loss while restoring database health.
   */
  private rotateCorruptFile(filePath: string): void {
    try {
      const corruptPath = `${filePath}.corrupt.${Date.now()}`;
      fs.renameSync(filePath, corruptPath);
    } catch {
      // ignore
    }
  }

  /**
   * Adds or updates a local custom skill in the workspace database.
   */
  public async addSkill(
    workspaceRoot: string,
    rawSkill: unknown,
    overwrite: boolean = true
  ): Promise<LocalSkillOperationResult> {
    try {
      const validatedSkill = validateSkill({
        ...(typeof rawSkill === 'object' && rawSkill !== null ? rawSkill : {}),
        source: 'workspace',
      });

      const db = this.readDatabase(workspaceRoot);
      const existingIdx = db.skills.findIndex((s) => s.id === validatedSkill.id);

      if (existingIdx !== -1 && !overwrite) {
        return {
          success: false,
          skillId: validatedSkill.id,
          message: `Skill "${validatedSkill.id}" already exists in local database and overwrite is false.`,
          error: 'ALREADY_EXISTS',
        };
      }

      if (existingIdx !== -1) {
        db.skills[existingIdx] = validatedSkill;
      } else {
        db.skills.push(validatedSkill);
      }

      // Format as structured config object
      const payload = {
        version: '1.0',
        skills: db.skills,
        overrides: db.overrides,
      };

      await this.atomicWriteFile(db.filePath, JSON.stringify(payload, null, 2));

      // Live In-Memory Cache Coherence
      this.repository.addLocalSkill(validatedSkill);
      if (this.cache) {
        this.cache.clear();
      }

      return {
        success: true,
        skillId: validatedSkill.id,
        message: `Successfully saved skill "${validatedSkill.name}" (${validatedSkill.id}) to local database.`,
        skills: db.skills,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Failed to add skill to local database: ${msg}`,
        error: msg,
      };
    }
  }

  /**
   * Removes a local skill from the workspace database.
   */
  public async removeSkill(
    workspaceRoot: string,
    skillId: string
  ): Promise<LocalSkillOperationResult> {
    try {
      if (!skillId || typeof skillId !== 'string' || !skillId.trim()) {
        return {
          success: false,
          message: 'A non-empty skillId is required to remove a skill.',
          error: 'INVALID_ID',
        };
      }

      const cleanId = skillId.trim().toLowerCase();
      const db = this.readDatabase(workspaceRoot);
      const existingIdx = db.skills.findIndex((s) => s.id.toLowerCase() === cleanId);

      if (existingIdx === -1) {
        return {
          success: false,
          skillId: cleanId,
          message: `Skill "${cleanId}" not found in local workspace database.`,
          error: 'NOT_FOUND',
        };
      }

      db.skills.splice(existingIdx, 1);

      const payload = {
        version: '1.0',
        skills: db.skills,
        overrides: db.overrides,
      };

      await this.atomicWriteFile(db.filePath, JSON.stringify(payload, null, 2));

      // Live in-memory index removal
      this.repository.removeLocalSkill(cleanId);
      if (this.cache) {
        this.cache.clear();
      }

      return {
        success: true,
        skillId: cleanId,
        message: `Successfully removed skill "${cleanId}" from local database.`,
        skills: db.skills,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Failed to remove skill from local database: ${msg}`,
        error: msg,
      };
    }
  }

  /**
   * Lists all local skills declared in the workspace database.
   */
  public async listSkills(workspaceRoot: string): Promise<LocalSkillOperationResult> {
    try {
      const db = this.readDatabase(workspaceRoot);
      return {
        success: true,
        skills: db.skills,
        message: `Found ${db.skills.length} local skills in workspace database.`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        skills: [],
        message: `Failed to list local skills: ${msg}`,
        error: msg,
      };
    }
  }
}
