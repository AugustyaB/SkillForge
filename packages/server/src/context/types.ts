import type { DetectedPackage } from '@skillforge/shared';

export interface ParsedManifest {
  packages: DetectedPackage[];
  ecosystem: string;
}

export interface ScannerOptions {
  includeDevDependencies?: boolean;
  maxFilesToInspect?: number;
}
