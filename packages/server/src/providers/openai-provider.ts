import {
  normalizeSkillCategory,
  type ProviderConfig,
  type ProviderType,
  type RawSuggestion,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
  type SuggestedSkill,
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
 * Resilient against conversational preamble, markdown code fences, JSON objects with a "skills" key, and raw arrays.
 */
export function parseRawSuggestions(content: string): RawSuggestion[] {
  let cleaned = content.trim();
  if (!cleaned) {
    return [];
  }

  // 1. Extract markdown code fence anywhere in the response (handles conversational preamble/epilogue)
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && fenceMatch[1]) {
    cleaned = fenceMatch[1].trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  } else if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    // Extract first JSON object or array if conversational prose wraps raw JSON without fences
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endChar = '';
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endChar = '}';
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endChar = ']';
    }
    if (startIdx !== -1) {
      const endIdx = cleaned.lastIndexOf(endChar);
      if (endIdx > startIdx) {
        cleaned = cleaned.slice(startIdx, endIdx + 1).trim();
      }
    }
  }

  if (!cleaned) {
    return [];
  }

  const parsed = JSON.parse(cleaned);

  if (Array.isArray(parsed)) {
    return parsed.filter(isValidRawSuggestion).map(normalizeRawItem);
  }

  if (parsed && typeof parsed === 'object') {
    const arr = parsed.skills || parsed.recommendations || parsed.tools || parsed.data;
    if (Array.isArray(arr)) {
      return arr.filter(isValidRawSuggestion).map(normalizeRawItem);
    }
  }

  return [];
}

function isValidRawSuggestion(item: unknown): item is RawSuggestion {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return typeof candidate.name === 'string' && candidate.name.trim().length > 0;
}

function normalizeRawItem(item: RawSuggestion): RawSuggestion {
  return {
    ...item,
    category: item.category ? normalizeSkillCategory(item.category) : undefined,
  };
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
    const effectiveTimeout =
      typeof config.timeoutMs === 'number' && config.timeoutMs > 0
        ? config.timeoutMs
        : this.timeoutMs;
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
        signal: AbortSignal.timeout(effectiveTimeout),
      });
    } catch (err: unknown) {
      const errName = (err as Error)?.name;
      if (errName === 'TimeoutError' || errName === 'AbortError') {
        throw new Error(`OpenAI request timed out after ${effectiveTimeout}ms.`);
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
