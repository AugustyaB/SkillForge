import type {
  ProviderConfig,
  ProviderType,
  SkillSuggestionParams,
  SkillSuggestionResult,
} from '@skillforge/shared';

export type FetchFunction = typeof globalThis.fetch;

export interface SuggestionProvider {
  readonly id: ProviderType;
  readonly name: string;
  isAvailable(config?: ProviderConfig): boolean | Promise<boolean>;
  suggest(
    params: SkillSuggestionParams,
    config?: ProviderConfig
  ): Promise<SkillSuggestionResult>;
}

export interface ProviderExecutionOptions {
  timeoutMs?: number;
  fetchFn?: FetchFunction;
}
