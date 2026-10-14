import { describe, expect, it } from 'vitest';
import type { ComparisonMatrix } from '@skillforge/shared';
import { generateComparisonHtml } from '../webview/comparison-html.js';

describe('generateComparisonHtml', () => {
  const sampleMatrix: ComparisonMatrix = {
    columns: [
      {
        id: 'react',
        name: 'React',
        ecosystem: 'javascript',
        category: 'frontend-framework',
        difficulty: 'beginner',
        trustTier: 'verified',
        description: 'A JavaScript library for building user interfaces.',
        whyUseIt: 'Massive ecosystem and industry standard.',
        pros: ['Virtual DOM', 'Huge community'],
        caveats: 'Requires build tooling like Vite or Next.js.',
        worksWellWith: ['nextjs', 'tailwind-css'],
        stackIndicators: ['react', 'react-dom'],
        officialUrl: 'https://react.dev',
        isInstalledInWorkspace: true,
      },
      {
        id: 'vue',
        name: 'Vue.js',
        ecosystem: 'javascript',
        category: 'frontend-framework',
        difficulty: 'beginner',
        trustTier: 'verified',
        description: 'Progressive JavaScript framework.',
        whyUseIt: 'Approachable and intuitive template syntax.',
        pros: ['Reactivity system', 'Official routing/pinia'],
        caveats: 'Smaller enterprise market share in some regions.',
        worksWellWith: ['nuxt', 'tailwind-css'],
        stackIndicators: ['vue'],
        officialUrl: 'https://vuejs.org',
        isInstalledInWorkspace: false,
      },
    ],
    categories: ['frontend-framework'],
    isCrossEcosystem: false,
    conflictsDetected: [
      '"React" and "Vue.js" are direct alternatives in frontend-framework. Choosing one typically replaces the other.',
    ],
    summary: 'Side-by-side architectural comparison of React vs Vue.js within the javascript ecosystem.',
  };

  it('renders a 2-column comparison table with headers and tool names', () => {
    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('React');
    expect(html).toContain('Vue.js');
    expect(html).toContain('Technology Comparison Matrix');
    expect(html).toContain('data-col-id="react"');
    expect(html).toContain('data-col-id="vue"');
  });

  it('renders the conflict warning banner when mutual conflicts exist', () => {
    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('sf-conflict-banner');
    expect(html).toContain('Architectural Conflict / Mutual Exclusivity Detected');
    expect(html).toContain('direct alternatives in frontend-framework');
  });

  it('renders cross-ecosystem notice when comparing tools from different languages', () => {
    const crossMatrix: ComparisonMatrix = {
      ...sampleMatrix,
      isCrossEcosystem: true,
      columns: [
        sampleMatrix.columns[0]!,
        {
          id: 'fastapi',
          name: 'FastAPI',
          ecosystem: 'python',
          category: 'backend-framework',
          difficulty: 'intermediate',
          trustTier: 'verified',
          description: 'Modern, fast Python web framework.',
          whyUseIt: 'Type hints and high performance.',
          pros: ['Pydantic validation'],
          worksWellWith: ['uvicorn'],
          stackIndicators: ['fastapi'],
          officialUrl: 'https://fastapi.tiangolo.com',
        },
      ],
    };

    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: crossMatrix,
    });

    expect(html).toContain('sf-crosseco-banner');
    expect(html).toContain('Cross-Ecosystem Comparison');
  });

  it('marks installed packages with an installed badge', () => {
    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('sf-pill-installed');
    expect(html).toContain('Installed');
  });

  it('safely escapes hostile and XSS strings in tool metadata', () => {
    const hostileMatrix: ComparisonMatrix = {
      columns: [
        {
          id: 'hostile-1',
          name: '<script>alert("xss")</script>',
          ecosystem: 'c++',
          category: 'other',
          difficulty: 'advanced',
          trustTier: 'suggested',
          description: 'Testing <img src=x onerror=alert(1)> description',
          whyUseIt: 'Why use it with "quotes" and & ampersands',
          pros: ['<svg onload=alert(2)>'],
          worksWellWith: [],
          stackIndicators: ['hostile-1'],
        },
        {
          id: 'hostile-2',
          name: 'Clean Tool',
          ecosystem: 'javascript',
          category: 'other',
          difficulty: 'beginner',
          trustTier: 'verified',
          description: 'A clean tool',
          whyUseIt: 'Safe',
          pros: ['Works'],
          worksWellWith: [],
          stackIndicators: ['clean-tool'],
        },
      ],
      categories: ['other'],
      isCrossEcosystem: true,
      conflictsDetected: ['<script>danger</script>'],
    };

    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: hostileMatrix,
    });

    expect(html).not.toContain('<script>alert("xss")</script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&lt;script&gt;danger&lt;/script&gt;');
  });

  it('falls back gracefully on missing metrics and caveats', () => {
    const minimalMatrix: ComparisonMatrix = {
      columns: [
        {
          id: 'min-1',
          name: 'Tool One',
          ecosystem: 'javascript',
          category: 'utility',
          difficulty: 'beginner',
          trustTier: 'suggested',
          description: 'Basic tool',
          whyUseIt: 'Basic utility',
          pros: [],
          worksWellWith: [],
          stackIndicators: ['min-1'],
        },
        {
          id: 'min-2',
          name: 'Tool Two',
          ecosystem: 'javascript',
          category: 'utility',
          difficulty: 'beginner',
          trustTier: 'suggested',
          description: 'Another basic tool',
          whyUseIt: 'Another utility',
          pros: [],
          worksWellWith: [],
          stackIndicators: ['min-2'],
        },
      ],
      categories: ['utility'],
      isCrossEcosystem: false,
      conflictsDetected: [],
    };

    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: minimalMatrix,
    });

    expect(html).toContain('Verified Catalog');
    expect(html).toContain('No critical caveats reported');
    expect(html).toContain('Standalone / general compatibility');
  });

  it('includes Agent Skill directive button in comparison column headers', () => {
    const html = generateComparisonHtml({
      nonce: 'test-nonce',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('sf-agent-skill-btn');
    expect(html).toContain("type: 'createAgentSkill'");
  });

  it('uses pnpm add for JS/TS install commands and enforces strict nonce style-src CSP (BUG-22)', () => {
    const html = generateComparisonHtml({
      nonce: 'strict-nonce-999',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('pnpm add react');
    expect(html).toContain('pnpm add vue');
    expect(html).not.toContain('npm install react');
    expect(html).toContain("style-src 'nonce-strict-nonce-999'");
    expect(html).not.toContain("style-src 'unsafe-inline'");
    expect(html).toContain('<style nonce="strict-nonce-999">');
  });

  it('renders responsive horizontal scroll wrapper and sticky row labels for narrow viewports (BUG-27)', () => {
    const html = generateComparisonHtml({
      nonce: 'responsive-test-nonce',
      cspSource: 'vscode-webview:',
      matrix: sampleMatrix,
    });

    expect(html).toContain('sf-matrix-scroll-wrapper');
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Comparison Table"');
    expect(html).toContain('overflow-x: auto');
    expect(html).toContain('position: sticky');
    expect(html).toContain('min-width: calc(180px + 2 * 280px)');
  });
});
