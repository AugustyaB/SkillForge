import type {
  ProviderConfig,
  ProviderType,
  SkillSuggestionParams,
  SkillSuggestionResult,
  SuggestedSkill,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { GroundTruthAnchor } from '../reliability/ground-truth-anchor.js';
import { OpenAIProviderOptions, parseRawSuggestions } from './openai-provider.js';
import {
  SKILLFORGE_SYSTEM_PROMPT,
  buildPrivacyPreservingUserPrompt,
} from './prompt-templates.js';
import type { FetchFunction, SuggestionProvider } from './types.js';

export class GeminiProvider implements SuggestionProvider {
  public readonly id: ProviderType = 'gemini';
  public readonly name = 'Google Gemini (BYOK)';

  private anchor: GroundTruthAnchor;
  private fetchFn: FetchFunction;
  private timeoutMs: number;

  constructor(options?: OpenAIProviderOptions) {
    const repo = options?.repository ?? new SkillsRepository();
    this.anchor = options?.anchor ?? new GroundTruthAnchor(repo);
    this.fetchFn = options?.fetchFn ?? globalThis.fetch;
    this.timeoutMs = options?.timeoutMs ?? 4000;
  }

  public isAvailable(config?: ProviderConfig): boolean {
    return config?.provider === 'gemini' && typeof config.apiKey === 'string' && config.apiKey.trim().length > 0;
  }

  public async suggest(
    params: SkillSuggestionParams,
    config?: ProviderConfig
  ): Promise<SkillSuggestionResult> {
    const startTime = Date.now();

    if (!config || !config.apiKey || !config.apiKey.trim()) {
      throw new Error('Gemini API key is missing or not configured.');
    }

    const endpointBase = (config.endpoint || 'https://generativelanguage.googleapis.com').replace(/\/+$/, '');
    const model = config.model || 'gemini-1.5-flash';
    const apiKey = config.apiKey.trim();
    const effectiveTimeout =
      typeof config.timeoutMs === 'number' && config.timeoutMs > 0
        ? config.timeoutMs
        : this.timeoutMs;
    const url = `${endpointBase}/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const fullPrompt = `${SKILLFORGE_SYSTEM_PROMPT}\nWrap your answer in a JSON object: {"skills": [...]}\n\n${buildPrivacyPreservingUserPrompt(params.intent, params.context)}`;

    let response: Response;
    try {
      response = await this.fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: config.temperature ?? 0.2,
          },
        }),
        signal: AbortSignal.timeout(effectiveTimeout),
      });
    } catch (err: unknown) {
      const errName = (err as Error)?.name;
      if (errName === 'TimeoutError' || errName === 'AbortError') {
        throw new Error(`Gemini request timed out after ${effectiveTimeout}ms.`);
      }
      throw err;
    }

    if (!response.ok) {
      if (response.status === 400 || response.status === 403) {
        throw new Error(`Gemini authentication or request rejected (HTTP ${response.status}): Check API key.`);
      }
      if (response.status === 429) {
        throw new Error('Gemini rate limit or quota exceeded (HTTP 429).');
      }
      throw new Error(`Gemini request failed: HTTP ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const textPart = payload.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const rawSuggestions = parseRawSuggestions(textPart);

    // Anchor through GroundTruthAnchor
    const anchoredResults = this.anchor.anchorAll(rawSuggestions);
    const skills: SuggestedSkill[] = anchoredResults.map((r) => {
      const s = r.suggestedSkill;
      return {
        ...s,
        llmEnhanced: true,
        trustTier: r.isAnchored ? 'verified' : 'suggested',
      };
    });

    const elapsed = Date.now() - startTime;
    return {
      skills,
      timings: {
        localMs: 0,
        totalMs: elapsed,
      },
      fallbackUsed: skills.length === 0,
      queryEcho: params.intent,
      providerUsed: 'gemini',
      llmEnhanced: true,
      privacyNotice: 'BYOK (Gemini) — Query sent securely. Zero source code transmitted.',
    };
  }
}
