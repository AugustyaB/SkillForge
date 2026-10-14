import { describe, it, expect, vi } from 'vitest';
import type { SkillSuggestionParams } from '@skillforge/shared';
import { SkillsRepository } from '../data/skills-repository.js';
import { SuggestionEngine } from '../engine/suggestion-engine.js';
import { GeminiProvider } from '../providers/gemini-provider.js';
import { HybridMerger } from '../providers/hybrid-merger.js';
import { LocalProvider } from '../providers/local-provider.js';
import { OpenAIProvider, parseRawSuggestions } from '../providers/openai-provider.js';
import { ProviderRegistry } from '../providers/provider-registry.js';

describe('Pluggable BYOK Suggestion Providers', () => {
  const repository = new SkillsRepository();
  const engine = new SuggestionEngine({ repository });

  describe('LocalProvider', () => {
    it('executes 100% offline suggestions and attaches privacy notice', async () => {
      const provider = new LocalProvider(engine);
      expect(provider.id).toBe('local');
      expect(provider.isAvailable()).toBe(true);

      const params: SkillSuggestionParams = { intent: 'state management' };
      const result = await provider.suggest(params);

      expect(result.providerUsed).toBe('local');
      expect(result.llmEnhanced).toBe(false);
      expect(result.privacyNotice).toContain('100% Offline & Private');
      expect(result.skills.length).toBeGreaterThan(0);
    });
  });

  describe('OpenAIProvider', () => {
    it('successfully queries OpenAI, parses JSON, and grounds candidates', async () => {
      const mockPayload = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                skills: [
                  {
                    id: 'zustand',
                    name: 'Zustand',
                    description: 'Small, fast, scalable state-management solution.',
                    ecosystem: 'typescript',
                    category: 'state-management',
                    tags: ['react', 'state'],
                    whyUseIt: 'Simplest boilerplate-free state management.',
                  },
                  {
                    id: 'novel-tool',
                    name: 'NovelTool',
                    description: 'External experimental tool not in curated DB.',
                    ecosystem: 'typescript',
                    category: 'utility',
                    tags: ['utility'],
                    whyUseIt: 'High performance helper.',
                  },
                ],
              }),
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as unknown as Response);

      const provider = new OpenAIProvider({
        repository,
        fetchFn: mockFetch,
        timeoutMs: 3000,
      });

      const result = await provider.suggest(
        { intent: 'state management' },
        {
          provider: 'openai',
          apiKey: 'sk-test-valid-key',
        }
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [, openaiInit] = mockFetch.mock.calls[0]!;
      expect(JSON.parse(openaiInit.body).model).toBe('gpt-4o-mini');
      expect(result.providerUsed).toBe('openai');
      expect(result.llmEnhanced).toBe(true);
      expect(result.privacyNotice).toContain('Zero source code transmitted');
      expect(result.skills).toHaveLength(2);

      // 'zustand' is in curated DB -> anchored to 'verified'
      const zustandSkill = result.skills.find((s) => s.id === 'zustand');
      expect(zustandSkill).toBeDefined();
      expect(zustandSkill?.trustTier).toBe('verified');

      // 'novel-tool' is not in curated DB -> unanchored placeholder with 'suggested'
      const novelSkill = result.skills.find((s) => s.id === 'novel-tool');
      expect(novelSkill).toBeDefined();
      expect(novelSkill?.trustTier).toBe('suggested');
    });

    it('accepts paid flagship, reasoning, or arbitrary custom model strings', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({ skills: [{ name: 'FastAPI', description: 'Web framework' }] }),
              },
            },
          ],
        }),
      } as unknown as Response);

      const provider = new OpenAIProvider({ repository, fetchFn: mockFetch });

      // Test with paid flagship gpt-4o
      await provider.suggest(
        { intent: 'web api' },
        { provider: 'openai', apiKey: 'sk-test', model: 'gpt-4o' }
      );
      expect(JSON.parse(mockFetch.mock.calls[0]![1].body).model).toBe('gpt-4o');

      // Test with reasoning tier o3-mini
      await provider.suggest(
        { intent: 'web api' },
        { provider: 'openai', apiKey: 'sk-test', model: '  o3-mini  ' }
      );
      expect(JSON.parse(mockFetch.mock.calls[1]![1].body).model).toBe('o3-mini');

      // Test with arbitrary custom proxy model name
      await provider.suggest(
        { intent: 'web api' },
        { provider: 'openai', apiKey: 'sk-test', model: 'deepseek-chat-v3' }
      );
      expect(JSON.parse(mockFetch.mock.calls[2]![1].body).model).toBe('deepseek-chat-v3');
    });

    it('handles markdown code fences in model output (Anti-Happy-Path)', () => {
      const markdown = '```json\n[{"name": "Zustand", "description": "State management"}]\n```';
      const parsed = parseRawSuggestions(markdown);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]?.name).toBe('Zustand');
    });

    it('throws error when API key is missing', async () => {
      const provider = new OpenAIProvider({ repository });
      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'openai', apiKey: '' })
      ).rejects.toThrow('OpenAI API key is missing');
    });

    it('throws descriptive error on HTTP 401 unauthorized', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      } as unknown as Response);

      const provider = new OpenAIProvider({ repository, fetchFn: mockFetch });
      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'openai', apiKey: 'sk-invalid' })
      ).rejects.toThrow('OpenAI authentication failed (HTTP 401)');
    });

    it('throws descriptive error on HTTP 429 rate limit exceeded', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      } as unknown as Response);

      const provider = new OpenAIProvider({ repository, fetchFn: mockFetch });
      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'openai', apiKey: 'sk-quota' })
      ).rejects.toThrow('OpenAI rate limit or quota exceeded (HTTP 429)');
    });

    it('handles timeout abort gracefully (Anti-Happy-Path)', async () => {
      const timeoutErr = new Error('The operation was aborted');
      timeoutErr.name = 'TimeoutError';
      const mockFetch = vi.fn().mockRejectedValue(timeoutErr);

      const provider = new OpenAIProvider({
        repository,
        fetchFn: mockFetch,
        timeoutMs: 50,
      });

      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'openai', apiKey: 'sk-key' })
      ).rejects.toThrow('OpenAI request timed out after 50ms');
    });
  });

  describe('GeminiProvider', () => {
    it('successfully queries Gemini endpoint with responseMimeType json', async () => {
      const mockPayload = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify([
                    {
                      id: 'zod',
                      name: 'Zod',
                      description: 'TypeScript-first schema validation.',
                      ecosystem: 'typescript',
                      category: 'utility',
                      tags: ['validation'],
                      whyUseIt: 'Static type inference.',
                    },
                  ]),
                },
              ],
            },
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      } as unknown as Response);

      const provider = new GeminiProvider({
        repository,
        fetchFn: mockFetch,
        timeoutMs: 3000,
      });

      const result = await provider.suggest(
        { intent: 'schema validation' },
        {
          provider: 'gemini',
          apiKey: 'AIzaSy-test-key',
        }
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledInit] = mockFetch.mock.calls[0]!;
      expect(calledUrl).toContain('gemini-2.0-flash:generateContent');
      expect( JSON.parse(calledInit.body).generationConfig.responseMimeType ).toBe('application/json');
      expect(result.providerUsed).toBe('gemini');
      expect(result.llmEnhanced).toBe(true);
      expect(result.skills).toHaveLength(1);
      expect(result.skills[0]?.id).toBe('zod');
      expect(result.skills[0]?.trustTier).toBe('verified');
    });

    it('accepts paid flagship, reasoning, or arbitrary custom Gemini models', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify({ skills: [{ name: 'Zod', description: 'Validation' }] }) }],
              },
            },
          ],
        }),
      } as unknown as Response);

      const provider = new GeminiProvider({ repository, fetchFn: mockFetch });

      // Test with paid / flagship gemini-1.5-pro
      await provider.suggest(
        { intent: 'validation' },
        { provider: 'gemini', apiKey: 'AIzaSy-test', model: 'gemini-1.5-pro' }
      );
      expect(mockFetch.mock.calls[0]![0]).toContain('gemini-1.5-pro:generateContent');

      // Test with custom or experimental model
      await provider.suggest(
        { intent: 'validation' },
        { provider: 'gemini', apiKey: 'AIzaSy-test', model: '  gemini-2.0-flash-thinking-exp  ' }
      );
      expect(mockFetch.mock.calls[1]![0]).toContain('gemini-2.0-flash-thinking-exp:generateContent');
    });

    it('throws error when Gemini API key is missing', async () => {
      const provider = new GeminiProvider({ repository });
      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'gemini', apiKey: '' })
      ).rejects.toThrow('Gemini API key is missing');
    });

    it('throws descriptive error on Gemini HTTP 400/403 rejection', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as unknown as Response);

      const provider = new GeminiProvider({ repository, fetchFn: mockFetch });
      await expect(
        provider.suggest({ intent: 'test' }, { provider: 'gemini', apiKey: 'invalid-key' })
      ).rejects.toThrow('Gemini authentication or request rejected (HTTP 400)');
    });
  });

  describe('HybridMerger', () => {
    it('deduplicates identical skills between local and AI (curated local match wins)', () => {
      const localSkill = {
        ...repository.getSkillById('zod')!,
        trustTier: 'verified' as const,
        confidence: 0.95,
        reasoning: 'Curated recommendation',
      };

      const aiDuplicateSkill = {
        ...localSkill,
        name: 'Zod (AI duplicate)',
        reasoning: 'AI reasoning',
        llmEnhanced: true,
      };

      const aiNovelSkill = {
        id: 'valibot',
        name: 'Valibot',
        category: 'utility' as const,
        difficulty: 'intermediate' as const,
        description: 'Lightweight alternative schema validator',
        whyUseIt: 'Smaller bundle size',
        tags: ['validation'],
        ecosystem: 'typescript',
        officialUrl: 'https://valibot.dev',
        learnResources: [{ label: 'Docs', url: 'https://valibot.dev' }],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: ['valibot'],
        trustTier: 'suggested' as const,
        confidence: 0.8,
        reasoning: 'AI discovered lightweight schema validator',
        llmEnhanced: true,
      };

      const localResult = {
        skills: [localSkill],
        timings: { localMs: 8, totalMs: 8 },
        fallbackUsed: false,
        queryEcho: 'validation',
        providerUsed: 'local' as const,
      };

      const aiResult = {
        skills: [aiDuplicateSkill, aiNovelSkill],
        timings: { localMs: 0, totalMs: 450 },
        fallbackUsed: false,
        queryEcho: 'validation',
        providerUsed: 'openai' as const,
        llmEnhanced: true,
        privacyNotice: 'BYOK (OpenAI)',
      };

      const merged = HybridMerger.merge(localResult, aiResult, { maxResults: 5 });

      expect(merged.skills).toHaveLength(2);
      expect(merged.skills[0]?.id).toBe('zod');
      expect(merged.skills[0]?.reasoning).toBe('Curated recommendation'); // Curated local preserved
      expect(merged.skills[1]?.id).toBe('valibot'); // Novel AI skill included
      expect(merged.llmEnhanced).toBe(true);
      expect(merged.providerUsed).toBe('openai');
      expect(merged.timings.localMs).toBe(8);
      expect(merged.timings.totalMs).toBe(450);
    });
  });

  describe('ProviderRegistry & Graceful Degradation (Anti-Happy-Path)', () => {
    it('falls back to offline local engine when AI provider fails (network/401/timeout)', async () => {
      // Mock OpenAI provider that throws network failure
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error: Connection refused'));
      const failingOpenAi = new OpenAIProvider({ repository, fetchFn: mockFetch });

      const registry = new ProviderRegistry({
        engine,
        openaiProvider: failingOpenAi,
      });

      const result = await registry.suggest(
        { intent: 'state management' },
        { provider: 'openai', apiKey: 'sk-test' }
      );

      // Guaranteed non-broken output: local offline skills returned!
      expect(result.skills.length).toBeGreaterThan(0);
      expect(result.privacyNotice).toContain('Offline fallback');
      expect(result.privacyNotice).toContain('Connection refused');
    });

    it('falls back to offline engine when API key is missing for BYOK provider', async () => {
      const registry = new ProviderRegistry({ engine });

      const result = await registry.suggest(
        { intent: 'state management' },
        { provider: 'openai', apiKey: '' }
      );

      expect(result.skills.length).toBeGreaterThan(0);
      expect(result.privacyNotice).toContain('No API key configured for OpenAI (BYOK)');
    });

    it('falls back to offline engine when unknown provider type is supplied', async () => {
      const registry = new ProviderRegistry({ engine });

      const result = await registry.suggest(
        { intent: 'database' },
        { provider: 'unknown-vendor' as any }
      );

      expect(result.skills.length).toBeGreaterThan(0);
      expect(result.privacyNotice).toContain('Fallback to 100% offline database');
    });

    it('parses conversational preamble around markdown JSON fences and normalizes shorthand categories (BUG-14 & BUG-19)', () => {
      const chattyOutput = `Sure! Here are the recommended libraries for your project:
\`\`\`json
{
  "skills": [
    {
      "id": "effect-ts",
      "name": "Effect",
      "category": "state",
      "ecosystem": "typescript",
      "description": "Type-safe functional effect system for TypeScript."
    },
    {
      "id": "lucia",
      "name": "Lucia Auth",
      "category": "auth",
      "ecosystem": "typescript",
      "description": "Simple and flexible authentication library."
    }
  ]
}
\`\`\`
Let me know if you need anything else!`;

      const parsed = parseRawSuggestions(chattyOutput);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]?.category).toBe('state-management');
      expect(parsed[1]?.category).toBe('authentication');
    });

    it('honors per-request config.timeoutMs over default timeoutMs in OpenAI and Gemini providers (BUG-18)', async () => {
      const timeoutErr = new Error('Aborted');
      timeoutErr.name = 'TimeoutError';
      const mockFetch = vi.fn().mockRejectedValue(timeoutErr);

      const openai = new OpenAIProvider({ repository, fetchFn: mockFetch, timeoutMs: 4000 });
      await expect(
        openai.suggest(
          { intent: 'test' },
          { provider: 'openai', apiKey: 'sk-key', timeoutMs: 1234 }
        )
      ).rejects.toThrow('OpenAI request timed out after 1234ms');

      const gemini = new GeminiProvider({ repository, fetchFn: mockFetch, timeoutMs: 4000 });
      await expect(
        gemini.suggest(
          { intent: 'test' },
          { provider: 'gemini', apiKey: 'AIza-key', timeoutMs: 2345 }
        )
      ).rejects.toThrow('Gemini request timed out after 2345ms');
    });

    it('runs ConflictDetector, tags isInstalledInWorkspace, and filters by minTrustTier on HybridMerger results (BUG-15)', () => {
      const expressSkill = {
        ...repository.getSkillById('express')!,
        trustTier: 'verified' as const,
        confidence: 0.9,
        reasoning: 'Local match',
      };
      const fastifySkill = {
        ...repository.getSkillById('fastify')!,
        trustTier: 'verified' as const,
        confidence: 0.88,
        reasoning: 'AI match',
        llmEnhanced: true,
      };
      const unanchoredAiSkill = {
        id: 'novel-lib',
        name: 'NovelLib',
        category: 'utility' as const,
        difficulty: 'intermediate' as const,
        description: 'Unanchored external AI tool',
        whyUseIt: 'Experimental utility',
        tags: ['novel'],
        ecosystem: 'javascript',
        officialUrl: 'https://novellib.dev',
        learnResources: [{ label: 'Docs', url: 'https://novellib.dev' }],
        alternatives: [],
        worksWellWith: [],
        prerequisites: [],
        stackIndicators: ['novel-lib'],
        trustTier: 'suggested' as const,
        confidence: 0.6,
        reasoning: 'Unanchored AI suggestion',
        llmEnhanced: true,
      };

      const localResult = {
        skills: [expressSkill],
        timings: { localMs: 5, totalMs: 5 },
        fallbackUsed: false,
        queryEcho: 'node server',
      };
      const aiResult = {
        skills: [fastifySkill, unanchoredAiSkill],
        timings: { localMs: 0, totalMs: 300 },
        fallbackUsed: false,
        queryEcho: 'node server',
        providerUsed: 'openai' as const,
        llmEnhanced: true,
      };

      const merged = HybridMerger.merge(localResult, aiResult, {
        maxResults: 5,
        alreadyInstalled: ['fastify'],
        minTrustTier: 'verified',
        repository,
      });

      // Unanchored 'suggested' skill filtered out by minTrustTier: 'verified'
      expect(merged.skills.map((s) => s.id)).toEqual(['express', 'fastify']);
      // Fastify marked as installed in workspace
      expect(merged.skills.find((s) => s.id === 'fastify')?.isInstalledInWorkspace).toBe(true);
      // Cross-source conflict detected between Express and Fastify
      expect(merged.skills.find((s) => s.id === 'express')?.conflictWith).toContain('fastify');
      expect(merged.skills.find((s) => s.id === 'express')?.conflictWarning).toBeDefined();
    });

    it('preserves categoryRecommendations when HybridMerger falls back with 0 AI skills (BUG-17)', async () => {
      const localFallback = await engine.suggest({ intent: 'zzzz_nonexistent_gibberish_999' });
      expect(localFallback.fallbackUsed).toBe(true);
      expect(localFallback.categoryRecommendations?.length).toBeGreaterThan(0);

      const emptyAiResult = {
        skills: [],
        timings: { localMs: 0, totalMs: 250 },
        fallbackUsed: true,
        queryEcho: 'zzzz_nonexistent_gibberish_999',
        providerUsed: 'openai' as const,
        llmEnhanced: false,
      };

      const merged = HybridMerger.merge(localFallback, emptyAiResult, { maxResults: 5 });
      expect(merged.fallbackUsed).toBe(true);
      expect(merged.categoryRecommendations).toBeDefined();
      expect(merged.categoryRecommendations?.length).toBe(
        localFallback.categoryRecommendations?.length
      );
    });
  });
});
