/**
 * SkillForge Domain Types
 * Single source of truth derived from runtime Zod schemas.
 */

import type {
  InferredComparisonColumn,
  InferredComparisonMatrix,
  InferredComparisonRequest,
  InferredDifficulty,
  InferredFeedbackPayload,
  InferredFeedbackRating,
  InferredLearnLink,
  InferredPackageHealth,
  InferredProviderConfig,
  InferredProviderType,
  InferredRawSuggestion,
  InferredSkill,
  InferredSkillBookmark,
  InferredSkillCategory,
  InferredSkillRequestPayload,
  InferredTrustTier,
  InferredUnhelpfulReason,
} from './schemas.js';

export type Difficulty = InferredDifficulty;
export type SkillCategory = InferredSkillCategory;
export type TrustTier = InferredTrustTier;
export type LearnLink = InferredLearnLink;
export type Skill = InferredSkill;
export type PackageHealth = InferredPackageHealth;
export type RawSuggestion = InferredRawSuggestion;
export type ProviderType = InferredProviderType;
export type ProviderConfig = InferredProviderConfig;
export type FeedbackRating = InferredFeedbackRating;
export type UnhelpfulReason = InferredUnhelpfulReason;
export type FeedbackPayload = InferredFeedbackPayload;
export type SkillRequestPayload = InferredSkillRequestPayload;
export type SkillBookmark = InferredSkillBookmark;
export type ComparisonRequest = InferredComparisonRequest;
export type ComparisonColumn = InferredComparisonColumn;
export type ComparisonMatrix = InferredComparisonMatrix;

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
