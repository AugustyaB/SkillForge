import type {
  ProviderConfig,
  ProviderType,
  RawSuggestion,
  SkillSuggestionParams,
  SkillSuggestionResult,
  SuggestedSkill,
} from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { GroundTruthAnchor } from '../reliability/ground-truth-anchor.js';
import {
  SKILLFORGE_SYSTEM_PROMPT,
  buildPrivacyPreservingUserPrompt,
} from './prompt-templates.js';
import type { FetchFunction, SuggestionProvider } from './types.js';

export interface OpenAIProviderOptions {
  repository?: SkillsRepository;
  anchor?: GroundTruthAnchor;
  fetchFn?: FetchFunction;
  timeoutMs?: number;
}

/**
 * Extracts and parses a list of RawSuggestions from an LLM response string.
 * Resilient against markdown code fences, JSON objects with a "skills" key, and raw arrays.
 */
export function parseRawSuggestions(content: string): RawSuggestion[] {
  let cleaned = content.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  if (!cleaned) {
    return [];
  }

  const parsed = JSON.parse(cleaned);

  if (Array.isArray(parsed)) {
    return parsed.filter(isValidRawSuggestion);
  }

  if (parsed && typeof parsed === 'object') {
    const arr = parsed.skills || parsed.recommendations || parsed.tools || parsed.data;
    if (Array.isArray(arr)) {
      return arr.filter(isValidRawSuggestion);
    }
  }

  return [];
}

function isValidRawSuggestion(item: unknown): item is RawSuggestion {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return typeof candidate.name === 'string' && candidate.name.trim().length > 0;
}

export class OpenAIProvider implements SuggestionProvider {
  public readonly id: ProviderType = 'openai';
  public readonly name = 'OpenAI (BYOK)';

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
    return config?.provider === 'openai' && typeof config.apiKey === 'string' && config.apiKey.trim().length > 0;
  }

  public async suggest(
    params: SkillSuggestionParams,
    config?: ProviderConfig
  ): Promise<SkillSuggestionResult> {
    const startTime = Date.now();

    if (!config || !config.apiKey || !config.apiKey.trim()) {
      throw new Error('OpenAI API key is missing or not configured.');
    }

    const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = config.model || 'gpt-4o-mini';
    const systemPrompt = `${SKILLFORGE_SYSTEM_PROMPT}\nWrap your answer in a JSON object: {"skills": [...]}`;
    const userPrompt = buildPrivacyPreservingUserPrompt(params.intent, params.context);

    let response: Response;
    try {
      response = await this.fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: config.temperature ?? 0.2,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err: unknown) {
      const errName = (err as Error)?.name;
      if (errName === 'TimeoutError' || errName === 'AbortError') {
        throw new Error(`OpenAI request timed out after ${this.timeoutMs}ms.`);
      }
      throw err;
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('OpenAI authentication failed (HTTP 401): Invalid API key.');
      }
      if (response.status === 429) {
        throw new Error('OpenAI rate limit or quota exceeded (HTTP 429).');
      }
      throw new Error(`OpenAI request failed: HTTP ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content || '';
    const rawSuggestions = parseRawSuggestions(content);

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
      providerUsed: 'openai',
      llmEnhanced: true,
      privacyNotice: 'BYOK (OpenAI) — Query sent securely. Zero source code transmitted.',
    };
  }
}
