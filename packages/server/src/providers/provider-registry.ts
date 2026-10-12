import type {
  ProviderConfig,
  ProviderType,
  SkillSuggestionParams,
  SkillSuggestionResult,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { SuggestionEngine } from '../engine/suggestion-engine.js';
import { GeminiProvider } from './gemini-provider.js';
import { HybridMerger } from './hybrid-merger.js';
import { LocalProvider } from './local-provider.js';
import { OpenAIProvider } from './openai-provider.js';
import type { SuggestionProvider } from './types.js';

export interface ProviderRegistryOptions {
  engine?: SuggestionEngine;
  repository?: SkillsRepository;
  openaiProvider?: OpenAIProvider;
  geminiProvider?: GeminiProvider;
}

export class ProviderRegistry {
  private providers = new Map<ProviderType, SuggestionProvider>();
  private localProvider: LocalProvider;
  private repository: SkillsRepository;

  constructor(options?: ProviderRegistryOptions) {
    const engine = options?.engine ?? new SuggestionEngine({ repository: options?.repository });
    this.repository = engine.getRepository();
    this.localProvider = new LocalProvider(engine);
    this.providers.set('local', this.localProvider);

    const openai = options?.openaiProvider ?? new OpenAIProvider({ repository: this.repository });
    const gemini = options?.geminiProvider ?? new GeminiProvider({ repository: this.repository });

    this.providers.set('openai', openai);
    this.providers.set('gemini', gemini);
  }

  public registerProvider(provider: SuggestionProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(type: ProviderType): SuggestionProvider | undefined {
    return this.providers.get(type);
  }

  public async suggest(
    params: SkillSuggestionParams,
    config?: ProviderConfig
  ): Promise<SkillSuggestionResult> {
    const requestedType = config?.provider || 'local';

    if (requestedType === 'local') {
      return this.localProvider.suggest(params, config);
    }

    const provider = this.providers.get(requestedType);
    if (!provider) {
      const fallback = await this.localProvider.suggest(params, config);
      return {
        ...fallback,
        privacyNotice: `Provider "${requestedType}" not recognized. Fallback to 100% offline database.`,
      };
    }

    const available = await provider.isAvailable(config);
    if (!available) {
      const fallback = await this.localProvider.suggest(params, config);
      return {
        ...fallback,
        privacyNotice: `No API key configured for ${provider.name}. Running 100% offline.`,
      };
    }

    // Two-Phase Hybrid Execution:
    // 1. Always execute local engine first (<10ms)
    const localResult = await this.localProvider.suggest(params, config);

    // 2. Query BYOK LLM provider with graceful degradation
    try {
      const aiResult = await provider.suggest(params, config);
      return HybridMerger.merge(localResult, aiResult, {
        maxResults: params.options?.maxResults,
        alreadyInstalled: params.context?.alreadyInstalled,
        minTrustTier: params.options?.minTrustTier,
        repository: this.repository,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      // Graceful offline fallback on any network/rate-limit/auth error
      return {
        ...localResult,
        privacyNotice: `Offline fallback (AI Provider error: ${errorMsg})`,
      };
    }
  }
}
