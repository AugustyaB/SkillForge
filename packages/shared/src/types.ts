/**
 * SkillForge Domain Types
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type SkillCategory =
  | 'frontend-framework'
  | 'ui-library'
  | 'state-management'
  | 'backend-framework'
  | 'database'
  | 'orm'
  | 'authentication'
  | 'api-protocol'
  | 'devops-container'
  | 'cloud-hosting'
  | 'testing'
  | 'utility'
  | 'ai-ml'
  | 'security'
  | 'other';

export type TrustTier = 'verified' | 'validated' | 'suggested' | 'deprecated';

export interface LearnLink {
  label: string;
  url: string;
  type?: 'docs' | 'tutorial' | 'video' | 'article';
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  difficulty: Difficulty;
  description: string;
  whyUseIt: string;
  tags: string[];
  ecosystem: string;
  officialUrl: string;
  learnResources: LearnLink[];
  alternatives: string[];
  worksWellWith: string[];
  prerequisites: string[];
  stackIndicators: string[];
}

export interface PackageHealth {
  packageExists: boolean;
  lastPublished?: string;
  weeklyDownloads?: number;
  githubStars?: number;
  healthVerdict?: 'healthy' | 'aging' | 'abandoned' | 'risky';
  cachedAt?: number;
}

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
