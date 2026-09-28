import type {
  ProviderConfig,
  ProviderType,
  SkillSuggestionParams,
  SkillSuggestionResult,
} from '@skillforge/shared';
import type { SuggestionEngine } from '../engine/suggestion-engine.js';
import type { SuggestionProvider } from './types.js';

/**
 * LocalProvider — Default 100% offline, zero-network suggestion provider.
 * Guarantees zero bytes of developer code leave the machine.
 */
export class LocalProvider implements SuggestionProvider {
  public readonly id: ProviderType = 'local';
  public readonly name = 'SkillForge Local Engine';

  private engine: SuggestionEngine;

  constructor(engine: SuggestionEngine) {
    this.engine = engine;
  }

  public isAvailable(_config?: ProviderConfig): boolean {
    return true;
  }

  public async suggest(
    params: SkillSuggestionParams,
    _config?: ProviderConfig
  ): Promise<SkillSuggestionResult> {
    const result = await this.engine.suggest(params);
    return {
      ...result,
      providerUsed: 'local',
      llmEnhanced: false,
      privacyNotice: '100% Offline & Private (Zero code leaves your machine)',
    };
  }
}
