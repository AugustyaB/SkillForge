export interface CheckUrlResult {
  url: string;
  status: number;
  ok: boolean;
  finalUrl?: string;
  error?: string;
  cached?: boolean;
  redirected?: boolean;
  redirectChain?: string[];
}

export interface BrokenUrlReference {
  skillId: string;
  field: string;
}

export interface BrokenUrlSummary {
  url: string;
  status: number;
  error?: string;
  references: BrokenUrlReference[];
}

export interface RedirectedUrlSummary {
  url: string;
  finalUrl: string;
  references?: BrokenUrlReference[];
}

export interface AuditSummary {
  totalSkills: number;
  totalUrls: number;
  healthyCount: number;
  redirectedCount: number;
  brokenCount: number;
  healthy: string[];
  redirected: RedirectedUrlSummary[];
  broken: BrokenUrlSummary[];
  results: Map<string, CheckUrlResult>;
}

export interface AuditCliOptions {
  sample?: number | null;
  skillId?: string | null;
  timeoutMs?: number;
  concurrency?: number;
  fix?: boolean;
  report?: boolean;
  noCache?: boolean;
  cacheFile?: string;
  skillsFile?: string;
  silent?: boolean;
}

export function parseCliArgs(args?: string[]): AuditCliOptions;
export function readCache(cacheFile?: string): Record<string, any>;
export function writeCache(cacheData: Record<string, any>, cacheFile?: string): void;
export function checkUrl(targetUrl: string, options?: AuditCliOptions, cache?: Record<string, any> | null): Promise<CheckUrlResult>;
export function auditSkills(skills: any[], options?: AuditCliOptions): Promise<AuditSummary>;
export function applyRedirectFixes(skills: any[], redirectedLinks: RedirectedUrlSummary[], skillsFile?: string): { appliedCount: number };
export function runCli(): Promise<void>;
