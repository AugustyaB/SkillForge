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
  generateWebviewHtml,
} from '../webview/webview-html.js';
import type { SuggestedSkill, SkillSuggestionResult } from '@skillforge/shared';

describe('WebviewHtml', () => {
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

  describe('renderTrustSeal', () => {
    it('renders correct seal for each trust tier', () => {
      expect(renderTrustSeal('verified')).toContain('sf-seal-verified');
      expect(renderTrustSeal('verified')).toContain('Verified');

      expect(renderTrustSeal('validated')).toContain('sf-seal-validated');
      expect(renderTrustSeal('validated')).toContain('Validated');

      expect(renderTrustSeal('suggested')).toContain('sf-seal-suggested');
      expect(renderTrustSeal('suggested')).toContain('Suggested');

      expect(renderTrustSeal('deprecated')).toContain('sf-seal-deprecated');
      expect(renderTrustSeal('deprecated')).toContain('Deprecated');
    });
  });

  describe('renderConfidence', () => {
    it('clamps and rounds confidence score to percentage', () => {
      expect(renderConfidence(0.956)).toContain('96% Match');
      expect(renderConfidence(1.2)).toContain('100% Match');
      expect(renderConfidence(-0.1)).toContain('0% Match');
    });
  });

  describe('renderHealthBar', () => {
    it('renders stars, downloads, and health status when metrics are present', () => {
      const html = renderHealthBar({
        packageExists: true,
        githubStars: 15400,
        weeklyDownloads: 2300000,
        healthVerdict: 'healthy',
        lastPublished: '2026-09-01T00:00:00.000Z',
      });

      expect(html).toContain('15.4k Stars');
      expect(html).toContain('2.3M dl/wk');
      expect(html).toContain('Healthy');
    });

    it('renders fallback when health object is missing or unverified', () => {
      const html = renderHealthBar(undefined);
      expect(html).toContain('Pending Verification');
    });
  });

  describe('renderConflictBanner', () => {
    it('renders conflict message if warning is provided', () => {
      const html = renderConflictBanner('Conflicts with fastify', ['fastify']);
      expect(html).toContain('Conflicts with fastify');
      expect(html).toContain('sf-conflict-banner');
    });

    it('returns empty string when there are no conflicts', () => {
      expect(renderConflictBanner(undefined, [])).toBe('');
      expect(renderConflictBanner(undefined, undefined)).toBe('');
    });
  });

  describe('renderWhyUseIt', () => {
    it('renders why-use-it callout box', () => {
      const html = renderWhyUseIt('Great for real-time applications');
      expect(html).toContain('Why Use It');
      expect(html).toContain('Great for real-time applications');
    });

    it('returns empty string for empty input', () => {
      expect(renderWhyUseIt('')).toBe('');
      expect(renderWhyUseIt('   ')).toBe('');
    });
  });

  describe('renderSkillCard', () => {
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

    it('renders card title, package identifier, install button, and copy button', () => {
      const html = renderSkillCard(mockSkill);
      expect(html).toContain('Next.js');
      expect(html).toContain('next');
      expect(html).toContain('data-cmd="pnpm add next"');
      expect(html).toContain('⚡ Install in Terminal');
      expect(html).toContain('📖 Docs ↗');
      expect(html).toContain('remix');
      expect(html).toContain('tailwind-css');
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
      expect(html).not.toContain('📖 Docs ↗');
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

      expect(html).toContain('Browse By Category');
      expect(html).toContain('Frontend Frameworks');
      expect(html).toContain('3 tools available');
    });

    it('returns empty string if recommendations array is empty', () => {
      expect(renderCategoryRecommendations([])).toBe('');
      expect(renderCategoryRecommendations(undefined)).toBe('');
    });
  });

  describe('generateWebviewHtml', () => {
    it('generates complete HTML document with CSP and nonce', () => {
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

    it('renders loading state when isLoading is true', () => {
      const html = generateWebviewHtml({
        nonce: 'nonce',
        cspSource: 'vscode-webview:',
        isLoading: true,
      });

      expect(html).toContain('Analyzing intent and project context...');
    });
  });
});
