import { describe, it, expect } from 'vitest';
import {
  SKILLFORGE_SUGGEST_METHOD,
  SKILLFORGE_PING_METHOD,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
  type SuggestedSkill,
  type PingResult,
} from '../index.js';

describe('SkillForge Shared Protocol', () => {
  it('defines correct custom LSP method names', () => {
    expect(SKILLFORGE_SUGGEST_METHOD).toBe('skillforge/suggest');
    expect(SKILLFORGE_PING_METHOD).toBe('skillforge/ping');
  });

  it('validates a valid SkillSuggestionParams object structure', () => {
    const params: SkillSuggestionParams = {
      intent: 'I want to build a real-time chat app',
      context: {
        ecosystem: 'javascript',
        alreadyInstalled: ['express'],
        scope: {
          mode: 'auto',
          paths: ['/root'],
          label: 'Entire Workspace',
        },
      },
      options: {
        maxResults: 5,
        difficulty: 'beginner',
        enableLlm: false,
      },
    };

    expect(params.intent).toBe('I want to build a real-time chat app');
    expect(params.context?.alreadyInstalled).toContain('express');
    expect(params.options?.maxResults).toBe(5);
  });

  it('validates a structured SkillSuggestionResult with trust tiers and metrics', () => {
    const mockSkill: SuggestedSkill = {
      id: 'socket-io',
      name: 'Socket.io',
      category: 'api-protocol',
      difficulty: 'beginner',
      description: 'Real-time bidirectional event-based communication library.',
      whyUseIt: 'Easy WebSocket abstraction with automatic reconnection.',
      tags: ['websocket', 'realtime', 'chat'],
      ecosystem: 'javascript',
      officialUrl: 'https://socket.io',
      learnResources: [
        { label: 'Documentation', url: 'https://socket.io/docs/v4/', type: 'docs' },
      ],
      alternatives: ['ws', 'pusher'],
      worksWellWith: ['express', 'react'],
      prerequisites: ['javascript', 'nodejs'],
      stackIndicators: ['socket.io'],
      trustTier: 'verified',
      confidence: 0.95,
      reasoning: 'Matches real-time chat intent and integrates with Express.',
      isInstalledInWorkspace: false,
    };

    const result: SkillSuggestionResult = {
      skills: [mockSkill],
      timings: {
        localMs: 42,
        totalMs: 42,
      },
      fallbackUsed: false,
      queryEcho: 'I want to build a real-time chat app',
    };

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0]?.id).toBe('socket-io');
    expect(result.skills[0]?.trustTier).toBe('verified');
    expect(result.timings.localMs).toBeGreaterThan(0);
  });

  it('validates PingResult structure', () => {
    const ping: PingResult = {
      status: 'ok',
      version: '0.1.0',
      timestamp: Date.now(),
    };

    expect(ping.status).toBe('ok');
    expect(ping.version).toBe('0.1.0');
    expect(typeof ping.timestamp).toBe('number');
  });
});
