import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  isSafeUrl,
  renderTrustSeal,
  renderConfidence,
  renderHealthBar,
  renderConflictBanner,
  renderWhyUseIt,
  renderSkillCard,
  renderCategoryRecommendations,
  renderPrivacyPill,
  renderFeedbackBar,
  generateWebviewHtml,
} from '../webview/webview-html.js';
import type { SuggestedSkill, SkillSuggestionResult } from '@skillforge/shared';

describe('WebviewHtml (Clean Developer UI)', () => {
  const mockSkill: SuggestedSkill = {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend-framework',
    difficulty: 'beginner',
    description: 'The React Framework for the Web',
    whyUseIt: 'Built-in SSR, routing, and optimization',
    tags: ['react', 'ssr'],
    ecosystem: 'javascript',
    officialUrl: 'https://nextjs.org',
    learnResources: [
      { label: 'Next.js Documentation', url: 'https://nextjs.org/docs', type: 'docs' },
    ],
    alternatives: ['remix', 'astro'],
    worksWellWith: ['tailwind-css', 'prisma'],
    prerequisites: ['react'],
    stackIndicators: ['next'],
    trustTier: 'verified',
    confidence: 0.98,
    reasoning: 'Matches full-stack React requirement',
  };

  describe('escapeHtml', () => {
    it('escapes dangerous HTML characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
      expect(escapeHtml("Tom & 'Jerry'")).toBe('Tom &amp; &#39;Jerry&#39;');
    });

    it('handles null, undefined, and non-string values gracefully', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('123');
    });
  });

  describe('isSafeUrl', () => {
    it('accepts valid http and https URLs', () => {
      expect(isSafeUrl('https://nextjs.org/docs')).toBe(true);
      expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('rejects dangerous protocols and invalid strings', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('data:text/html,payload')).toBe(false);
      expect(isSafeUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl(null as unknown as string)).toBe(false);
    });
  });

  describe('renderTrustSeal (No Emojis)', () => {
    it('renders clean badges with embedded SVG icons for each trust tier', () => {
      const verified = renderTrustSeal('verified');
      expect(verified).toContain('sf-seal-verified');
      expect(verified).toContain('Verified');
      expect(verified).toContain('<svg');
      expect(verified).not.toContain('🟢');

      const validated = renderTrustSeal('validated');
      expect(validated).toContain('sf-seal-validated');
      expect(validated).toContain('Validated');
      expect(validated).toContain('<svg');
      expect(validated).not.toContain('🟡');

      const suggested = renderTrustSeal('suggested');
      expect(suggested).toContain('sf-seal-suggested');
      expect(suggested).toContain('Suggested');
      expect(suggested).not.toContain('🟠');

      const deprecated = renderTrustSeal('deprecated');
      expect(deprecated).toContain('sf-seal-deprecated');
      expect(deprecated).toContain('Deprecated');
      expect(deprecated).toContain('<svg');
      expect(deprecated).not.toContain('⛔');
    });
  });

  describe('renderConfidence (No Emojis)', () => {
    it('formats confidence score cleanly as percentage match without lightning emojis', () => {
      const conf = renderConfidence(0.956);
      expect(conf).toContain('96% match');
      expect(conf).not.toContain('⚡');
      expect(renderConfidence(1.2)).toContain('100% match');
      expect(renderConfidence(-0.1)).toContain('0% match');
    });
  });

  describe('renderHealthBar (Clean Metrics & SVGs)', () => {
    it('renders stars, downloads, and health status with vector icons', () => {
      const html = renderHealthBar({
        packageExists: true,
        githubStars: 15400,
        weeklyDownloads: 2300000,
        healthVerdict: 'healthy',
        lastPublished: '2026-09-01T00:00:00.000Z',
      });

      expect(html).toContain('15.4k');
      expect(html).toContain('2.3M/wk');
      expect(html).toContain('Healthy');
      expect(html).toContain('<svg');
      expect(html).not.toContain('★');
      expect(html).not.toContain('📥');
    });

    it('renders fallback when health object is missing or unverified', () => {
      const html = renderHealthBar(undefined);
      expect(html).toContain('Pending Verification');
    });
  });

  describe('renderConflictBanner', () => {
    it('renders conflict message with warning SVG icon', () => {
      const html = renderConflictBanner('Conflicts with fastify', ['fastify']);
      expect(html).toContain('Conflicts with fastify');
      expect(html).toContain('sf-conflict-banner');
      expect(html).toContain('<svg');
      expect(html).not.toContain('⚠');
    });

    it('returns empty string when there are no conflicts', () => {
      expect(renderConflictBanner(undefined, [])).toBe('');
      expect(renderConflictBanner(undefined, undefined)).toBe('');
    });
  });

  describe('renderWhyUseIt', () => {
    it('renders why-use-it callout box with clean info icon and label', () => {
      const html = renderWhyUseIt('Great for real-time applications');
      expect(html).toContain('Why this tool');
      expect(html).toContain('Great for real-time applications');
      expect(html).not.toContain('💡');
    });

    it('returns empty string for empty input', () => {
      expect(renderWhyUseIt('')).toBe('');
      expect(renderWhyUseIt('   ')).toBe('');
    });
  });

  describe('renderSkillCard (Developer-grade Action Buttons)', () => {
    it('renders card title, package identifier, install button with terminal icon, and copy button', () => {
      const html = renderSkillCard(mockSkill);
      expect(html).toContain('Next.js');
      expect(html).toContain('next');
      expect(html).toContain('data-cmd="pnpm add next"');
      expect(html).toContain('Install via terminal');
      expect(html).toContain('Copy command');
      expect(html).toContain('Docs');
      expect(html).toContain('remix');
      expect(html).toContain('tailwind-css');
      expect(html).not.toContain('⚡ Install');
      expect(html).not.toContain('📋 Copy');
      expect(html).not.toContain('📖 Docs');
    });

    it('derives correct package manager based on ecosystem', () => {
      const pySkill: SuggestedSkill = {
        ...mockSkill,
        id: 'fastapi',
        name: 'FastAPI',
        ecosystem: 'python',
        stackIndicators: ['fastapi'],
      };
      const html = renderSkillCard(pySkill);
      expect(html).toContain('data-cmd="pip install fastapi"');
    });

    it('omits docs button if officialUrl is unsafe', () => {
      const unsafeSkill: SuggestedSkill = {
        ...mockSkill,
        officialUrl: 'javascript:alert(1)',
      };
      const html = renderSkillCard(unsafeSkill);
      expect(html).not.toContain('Docs');
    });
  });

  describe('renderCategoryRecommendations', () => {
    it('renders category cards for fallback cascade', () => {
      const html = renderCategoryRecommendations([
        {
          category: 'frontend-framework',
          label: 'Frontend Frameworks',
          description: 'Client-side web application libraries',
          skillIds: ['react', 'vue', 'svelte'],
        },
      ]);

      expect(html).toContain('Browse by Category');
      expect(html).toContain('Frontend Frameworks');
      expect(html).toContain('3 tools available');
    });

    it('returns empty string if recommendations array is empty', () => {
      expect(renderCategoryRecommendations([])).toBe('');
      expect(renderCategoryRecommendations(undefined)).toBe('');
    });
  });

  describe('generateWebviewHtml (Zero-Emoji Verification)', () => {
    it('generates complete HTML document with CSP, nonce, and clean typography', () => {
      const result: SkillSuggestionResult = {
        skills: [],
        queryEcho: 'chat app',
        timings: { localMs: 3, totalMs: 5 },
      };

      const html = generateWebviewHtml({
        nonce: 'test-nonce-1234',
        cspSource: 'vscode-webview:',
        result,
        scopeLabel: 'packages/server',
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('nonce="test-nonce-1234"');
      expect(html).toContain('Content-Security-Policy');
      expect(html).toContain('Scope: packages/server');
      expect(html).toContain('chat app');
      expect(html).toContain('No direct skill matches found');

      // Verify zero unicode emojis in generated HTML
      expect(html).not.toContain('✨');
      expect(html).not.toContain('⚡');
      expect(html).not.toContain('📦');
      expect(html).not.toContain('🔍');
      expect(html).not.toContain('⏳');
    });

    it('sanitizes hostile query strings in header', () => {
      const result: SkillSuggestionResult = {
        skills: [],
        queryEcho: '<script>alert("pwned")</script>',
        timings: { localMs: 1, totalMs: 1 },
      };

      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
      });

      expect(html).not.toContain('<script>alert("pwned")</script>');
      expect(html).toContain('&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt;');
    });

    it('renders clean spinner loading state without hourglass emoji', () => {
      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        isLoading: true,
      });

      expect(html).toContain('sf-spinner');
      expect(html).toContain('Analyzing intent and workspace context...');
      expect(html).not.toContain('⏳');
    });

    it('renders fallback banner and category recommendations when fallback is used with starter skills', () => {
      const result: SkillSuggestionResult = {
        skills: [mockSkill],
        queryEcho: 'nonexistent-tool',
        fallbackUsed: true,
        categoryRecommendations: [
          {
            category: 'database',
            label: 'Databases',
            description: 'Storage and persistence',
            skillIds: ['postgresql'],
          },
        ],
        timings: { localMs: 2, totalMs: 2 },
      };

      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
      });

      expect(html).toContain('sf-fallback-banner');
      expect(html).toContain('No direct skill matches found for');
      expect(html).toContain('nonexistent-tool');
      expect(html).toContain('sf-card-grid');
      expect(html).toContain('Next.js');
      expect(html).toContain('sf-category-section');
      expect(html).toContain('Databases');
      expect(html).toContain('Storage and persistence');
    });

    it('safely escapes hostile query strings in fallback banner', () => {
      const result: SkillSuggestionResult = {
        skills: [mockSkill],
        queryEcho: '<script>alert("xss")</script> & "c++"',
        fallbackUsed: true,
        timings: { localMs: 1, totalMs: 1 },
      };

      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
      });

      expect(html).toContain('sf-fallback-banner');
      expect(html).not.toContain('<script>alert("xss")</script>');
      expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(html).toContain('&amp; &quot;c++&quot;');
    });

    it('omits fallback banner and category recommendations when fallbackUsed is false', () => {
      const result: SkillSuggestionResult = {
        skills: [mockSkill],
        queryEcho: 'react router',
        fallbackUsed: false,
        categoryRecommendations: [
          {
            category: 'database',
            label: 'Databases',
            description: 'Storage and persistence',
            skillIds: ['postgresql'],
          },
        ],
        timings: { localMs: 1, totalMs: 1 },
      };

      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
      });

      expect(html).not.toContain('<div class="sf-fallback-banner">');
      expect(html).not.toContain('<div class="sf-category-section">');
    });

    it('renders privacy pill and catalog suggestion link in footer', () => {
      const result: SkillSuggestionResult = {
        skills: [mockSkill],
        queryEcho: 'react router',
        timings: { localMs: 1, totalMs: 1 },
      };

      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
      });

      expect(html).toContain('Local &amp; Private');
      expect(html).toContain('Suggest a library');
      expect(html).toContain('id="suggestSkillLink"');
    });

    it('renders feedback bar when showFeedbackPrompt is true', () => {
      const result: SkillSuggestionResult = {
        skills: [mockSkill],
        queryEcho: 'fastify api',
        timings: { localMs: 1, totalMs: 1 },
      };

      const htmlWithFeedback = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
        showFeedbackPrompt: true,
      });

      expect(htmlWithFeedback).toContain('id="feedbackBar"');
      expect(htmlWithFeedback).toContain('Was this suggestion helpful?');
      expect(htmlWithFeedback).toContain('id="feedbackYesBtn"');
      expect(htmlWithFeedback).toContain('id="feedbackNoBtn"');
      expect(htmlWithFeedback).toContain('Other (1-click)');

      const htmlWithoutFeedback = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        result,
        showFeedbackPrompt: false,
      });

      expect(htmlWithoutFeedback).not.toContain('id="feedbackBar"');
    });
  });

  describe('renderPrivacyPill', () => {
    it('renders Local & Private badge by default or for local provider', () => {
      expect(renderPrivacyPill(undefined)).toContain('Local &amp; Private');
      expect(renderPrivacyPill({ providerUsed: 'local', skills: [], timings: { localMs: 1, totalMs: 1 }, queryEcho: '' })).toContain('Local &amp; Private');
    });

    it('renders BYOK badge for external AI providers', () => {
      const openaiPill = renderPrivacyPill({ providerUsed: 'openai', skills: [], timings: { localMs: 1, totalMs: 1 }, queryEcho: '' });
      expect(openaiPill).toContain('OpenAI BYOK');
      expect(openaiPill).toContain('BYOK Mode');

      const geminiPill = renderPrivacyPill({ providerUsed: 'gemini', skills: [], timings: { localMs: 1, totalMs: 1 }, queryEcho: '' });
      expect(geminiPill).toContain('Gemini BYOK');
    });
  });

  describe('renderFeedbackBar', () => {
    it('returns empty string when show is false or query is empty', () => {
      expect(renderFeedbackBar('test', false)).toBe('');
      expect(renderFeedbackBar('', true)).toBe('');
    });

    it('renders 1-click feedback options including Other', () => {
      const bar = renderFeedbackBar('fast api', true);
      expect(bar).toContain('sf-feedback-bar');
      expect(bar).toContain('Not relevant to my prompt');
      expect(bar).toContain('Already knew / installed this');
      expect(bar).toContain('Other (1-click)');
    });
  });
});
