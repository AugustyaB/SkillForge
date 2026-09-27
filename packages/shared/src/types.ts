/**
 * SkillForge Domain Types
 * Single source of truth derived from runtime Zod schemas.
 */

import type {
  InferredDifficulty,
  InferredLearnLink,
  InferredPackageHealth,
  InferredRawSuggestion,
  InferredSkill,
  InferredSkillCategory,
  InferredTrustTier,
} from './schemas.js';

export type Difficulty = InferredDifficulty;
export type SkillCategory = InferredSkillCategory;
export type TrustTier = InferredTrustTier;
export type LearnLink = InferredLearnLink;
export type Skill = InferredSkill;
export type PackageHealth = InferredPackageHealth;
export type RawSuggestion = InferredRawSuggestion;

export interface DetectedPackage {
  name: string;
  version?: string;
  ecosystem: string;
  sourceFile: string;
}

export interface ActiveFileSignal {
  filePath: string;
  language: string;
  imports: string[];
  framework?: string;
}

export interface ContextScope {
  mode: 'auto' | 'folder' | 'custom';
  paths: string[];
  label: string;
}

export interface WorkspaceContext {
  scope: ContextScope;
  detectedStack: DetectedPackage[];
  activeFileSignals: ActiveFileSignal[];
  ecosystem: string;
  technologies: string[];
  alreadyInstalled: string[];
}
