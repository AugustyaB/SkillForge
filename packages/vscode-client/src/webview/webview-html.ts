import type {
  CategoryRecommendation,
  PackageHealth,
  SkillSuggestionResult,
  SuggestedSkill,
  TrustTier,
} from '@skillforge/shared';
import { WEBVIEW_STYLES } from './design-tokens.js';

export interface WebviewHtmlOptions {
  nonce: string;
  cspSource: string;
  result?: SkillSuggestionResult;
  scopeLabel?: string;
  scopePath?: string;
  isLoading?: boolean;
}

// Embedded SVG Codicons (Minimalist, theme-adaptive vector icons)
export const ICON_FORGE = `<svg viewBox="0 0 24 24"><path d="M4 6h16l-2 4H6L4 6z"/><path d="M7 10v4h10v-4H7z" opacity="0.75"/><path d="M5 14h14l1 4H4l1-4z" opacity="0.85"/><path d="M3 18h18v2H3v-2z"/></svg>`;
export const ICON_TERMINAL = `<svg viewBox="0 0 16 16"><path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1v8h12V4H2zm2 2.5 2.5 1.5L4 9.5V6.5zm4 3h4v1H8v-1z"/></svg>`;
export const ICON_COPY = `<svg viewBox="0 0 16 16"><path d="M4 4v9h8V4H4zm1-1h6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm6-2H3a1 1 0 0 0-1 1v9h1V3h8V1z"/></svg>`;
export const ICON_CHECK = `<svg viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>`;
export const ICON_EXTERNAL = `<svg viewBox="0 0 16 16"><path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h5v1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8h1v4.5a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5v-10zM9 1h6v6h-1V2.707L8.354 8.354l-.708-.708L13.293 2H9V1z"/></svg>`;
export const ICON_STAR = `<svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>`;
export const ICON_DOWNLOAD = `<svg viewBox="0 0 16 16"><path d="M8 12l-4-4h2.5V2h3v6H12L8 12zm-6 2h12v1H2v-1z"/></svg>`;
export const ICON_CLOCK = `<svg viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-4a.75.75 0 0 1 .75.75v3.69l2.78 1.67a.75.75 0 1 1-.76 1.29l-3.25-1.95A.75.75 0 0 1 7.25 8V4.75A.75.75 0 0 1 8 4z"/></svg>`;
export const ICON_WARNING = `<svg viewBox="0 0 16 16"><path d="M7.56 1.77a.75.75 0 0 1 1.38 0l6.25 11.5a.75.75 0 0 1-.65 1.11H1.46a.75.75 0 0 1-.65-1.11L7.06 1.77zM8 5.5a.5.5 0 0 0-.5.5v3.5a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5zm.5 6.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/></svg>`;
export const ICON_INFO = `<svg viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm6.5 3h3v1h-3v-1zm1-5h1v4h-1V6zm0-2h1v1h-1V4z"/></svg>`;

/**
 * Robust HTML escaping for hostile or untrusted strings.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates that an external URL is safe (http: or https: only).
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Renders the Trust Tier seal badge with vector icons.
 */
export function renderTrustSeal(trustTier: TrustTier): string {
  switch (trustTier) {
    case 'verified':
      return `<span class="sf-seal sf-seal-verified" title="Verified: Tested, active maintenance, official documentation"><span class="sf-icon sf-icon-sm">${ICON_CHECK}</span>Verified</span>`;
    case 'validated':
      return `<span class="sf-seal sf-seal-validated" title="Validated: Registry-backed, active usage"><span class="sf-icon sf-icon-sm">${ICON_STAR}</span>Validated</span>`;
    case 'suggested':
      return `<span class="sf-seal sf-seal-suggested" title="Suggested: Matches intent, community library">Suggested</span>`;
    case 'deprecated':
      return `<span class="sf-seal sf-seal-deprecated" title="Deprecated: Package or framework is no longer maintained"><span class="sf-icon sf-icon-sm">${ICON_WARNING}</span>Deprecated</span>`;
    default:
      return `<span class="sf-seal sf-seal-suggested">Suggested</span>`;
  }
}

/**
 * Renders the confidence score percentage.
 */
export function renderConfidence(confidence: number): string {
  const pct = Math.max(0, Math.min(100, Math.round((confidence || 0) * 100)));
  return `<span class="sf-confidence" title="Relevance match score">${pct}% match</span>`;
}

/**
 * Formats large download/star numbers (e.g. 1.2M, 45k).
 */
export function formatMetricNumber(num?: number): string {
  if (num === undefined || num === null || isNaN(num)) return '—';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

/**
 * Formats relative time (e.g. "3d ago", "2mo ago").
 */
export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'recent';
  try {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 'recent';
    const diffDays = Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return 'recent';
  }
}

/**
 * Renders the package registry health metrics bar with clean vector icons.
 */
export function renderHealthBar(health?: PackageHealth): string {
  if (!health) {
    return `
      <div class="sf-health-bar">
        <span class="sf-health-metric">Health: <span class="sf-health-aging">Pending Verification</span></span>
      </div>
    `;
  }

  const verdict = health.healthVerdict || 'healthy';
  const verdictClass = `sf-health-${verdict.toLowerCase()}`;
  const verdictLabel = verdict.charAt(0).toUpperCase() + verdict.slice(1);

  const downloads = formatMetricNumber(health.weeklyDownloads);
  const stars = formatMetricNumber(health.githubStars);
  const updated = formatRelativeTime(health.lastPublished);

  return `
    <div class="sf-health-bar">
      <span class="sf-health-metric" title="${stars} GitHub stars"><span class="sf-icon sf-icon-sm">${ICON_STAR}</span>${stars}</span>
      <span class="sf-health-metric" title="${downloads} weekly downloads"><span class="sf-icon sf-icon-sm">${ICON_DOWNLOAD}</span>${downloads}/wk</span>
      <span class="sf-health-metric" title="Last published ${updated}"><span class="sf-icon sf-icon-sm">${ICON_CLOCK}</span>${updated}</span>
      <span class="sf-health-metric">Health: <span class="${verdictClass}">${verdictLabel}</span></span>
    </div>
  `;
}

/**
 * Renders conflict alert banner if suggestion conflicts with an installed dependency.
 */
export function renderConflictBanner(
  conflictWarning?: string,
  conflictWith?: string[]
): string {
  if (!conflictWarning && (!conflictWith || conflictWith.length === 0)) {
    return '';
  }

  const message =
    conflictWarning ||
    `Conflicts with installed tool: ${conflictWith?.join(', ')}`;

  return `
    <div class="sf-conflict-banner">
      <span class="sf-conflict-icon sf-icon">${ICON_WARNING}</span>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

/**
 * Renders "Why this tool" rationale block.
 */
export function renderWhyUseIt(whyUseIt: string): string {
  if (!whyUseIt || !whyUseIt.trim()) return '';
  return `
    <div class="sf-why-box">
      <div class="sf-why-label"><span class="sf-icon sf-icon-sm">${ICON_INFO}</span>Why this tool</div>
      <div>${escapeHtml(whyUseIt)}</div>
    </div>
  `;
}

/**
 * Renders the collapsible Deep Dive drawer.
 */
export function renderDeepDive(skill: SuggestedSkill): string {
  const alternatives = skill.alternatives || [];
  const worksWith = skill.worksWellWith || [];
  const resources = skill.learnResources || [];

  return `
    <details class="sf-deep-dive">
      <summary>Related tools & resources</summary>
      <div class="sf-deep-dive-content">
        ${
          alternatives.length > 0
            ? `
          <div class="sf-dd-section">
            <span class="sf-dd-title">Alternatives</span>
            <div class="sf-chips">
              ${alternatives
                .map(
                  (alt) =>
                    `<span class="sf-chip sf-requery-chip" data-intent="${escapeHtml(alt)}" title="Search for ${escapeHtml(alt)}">${escapeHtml(alt)}</span>`
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          worksWith.length > 0
            ? `
          <div class="sf-dd-section">
            <span class="sf-dd-title">Works Well With</span>
            <div class="sf-chips">
              ${worksWith
                .map(
                  (w) =>
                    `<span class="sf-chip sf-requery-chip" data-intent="${escapeHtml(w)}" title="Search for ${escapeHtml(w)}">${escapeHtml(w)}</span>`
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          resources.length > 0
            ? `
          <div class="sf-dd-section">
            <span class="sf-dd-title">Documentation & Tutorials</span>
            <div class="sf-chips">
              ${resources
                .map((res) => {
                  const safe = isSafeUrl(res.url);
                  const typeLabel = res.type ? `[${res.type}] ` : '';
                  return safe
                    ? `<a href="#" class="sf-resource-link sf-external-link" data-url="${escapeHtml(res.url)}" title="${escapeHtml(res.url)}">${escapeHtml(typeLabel)}${escapeHtml(res.label)} <span class="sf-icon sf-icon-sm">${ICON_EXTERNAL}</span></a>`
                    : `<span>${escapeHtml(res.label)}</span>`;
                })
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    </details>
  `;
}

/**
 * Renders an individual skill card.
 */
export function renderSkillCard(skill: SuggestedSkill): string {
  const pkgName = skill.stackIndicators?.[0] || skill.id;
  const ecosystem = skill.ecosystem || 'javascript';
  const installCmd =
    skill.ecosystem === 'python'
      ? `pip install ${pkgName}`
      : skill.ecosystem === 'rust'
        ? `cargo add ${pkgName}`
        : skill.ecosystem === 'go'
          ? `go get ${pkgName}`
          : skill.ecosystem === 'java'
            ? `mvn dependency:get -Dartifact=${pkgName}`
            : `pnpm add ${pkgName}`;

  const hasSafeDocs = isSafeUrl(skill.officialUrl);

  return `
    <div class="sf-card" data-category="${escapeHtml(skill.category)}" data-trust="${escapeHtml(skill.trustTier)}" data-name="${escapeHtml(skill.name.toLowerCase())}" data-pkg="${escapeHtml(pkgName.toLowerCase())}">
      <div class="sf-card-header">
        <div class="sf-card-title-group">
          <div class="sf-card-name-row">
            <div class="sf-card-name">${escapeHtml(skill.name)}</div>
            <span class="sf-card-pkg-name">${escapeHtml(pkgName)}</span>
          </div>
          <div class="sf-card-desc">${escapeHtml(skill.description)}</div>
        </div>
      </div>

      <div class="sf-badge-row">
        ${renderTrustSeal(skill.trustTier)}
        <span class="sf-tag">${escapeHtml(skill.category)}</span>
        <span class="sf-tag">${escapeHtml(skill.difficulty)}</span>
        ${renderConfidence(skill.confidence)}
      </div>

      ${renderConflictBanner(skill.conflictWarning, skill.conflictWith)}
      ${renderWhyUseIt(skill.whyUseIt)}
      ${renderHealthBar(skill.health)}

      <div class="sf-card-actions">
        <button class="sf-btn sf-btn-primary sf-install-btn" data-pkg="${escapeHtml(pkgName)}" data-eco="${escapeHtml(ecosystem)}" title="Execute '${escapeHtml(installCmd)}' in terminal">
          <span class="sf-icon">${ICON_TERMINAL}</span>Install via terminal
        </button>
        <button class="sf-btn sf-btn-secondary sf-copy-btn" data-cmd="${escapeHtml(installCmd)}" title="Copy command to clipboard">
          <span class="sf-icon">${ICON_COPY}</span>Copy command
        </button>
        ${
          hasSafeDocs
            ? `
          <button class="sf-btn sf-btn-ghost sf-external-btn" data-url="${escapeHtml(skill.officialUrl)}" title="Open official documentation in browser">
            Docs <span class="sf-icon sf-icon-sm">${ICON_EXTERNAL}</span>
          </button>
        `
            : ''
        }
      </div>

      ${renderDeepDive(skill)}
    </div>
  `;
}

/**
 * Renders category recommendation cards (fallback cascade).
 */
export function renderCategoryRecommendations(
  recommendations?: CategoryRecommendation[]
): string {
  if (!recommendations || recommendations.length === 0) {
    return '';
  }

  return `
    <div class="sf-category-section">
      <div class="sf-empty-title">Browse by Category</div>
      <div class="sf-empty-desc">Explore curated toolsets and libraries across software engineering domains:</div>
      <div class="sf-category-grid">
        ${recommendations
          .map(
            (cat) => `
          <div class="sf-cat-card sf-requery-chip" data-intent="${escapeHtml(cat.label)}" title="Discover ${escapeHtml(cat.label)}">
            <div class="sf-cat-name">${escapeHtml(cat.label)}</div>
            <div class="sf-cat-desc">${escapeHtml(cat.description)}</div>
            <div class="sf-cat-count">${cat.skillIds.length} tools available →</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

/**
 * Generates the complete, self-contained HTML page for the Webview.
 */
export function generateWebviewHtml(options: WebviewHtmlOptions): string {
  const { nonce, cspSource, result, scopeLabel, isLoading } = options;

  const skills = result?.skills || [];
  const query = result?.queryEcho || '';
  const timingMs = result?.timings?.localMs ?? 0;
  const categories = Array.from(new Set(skills.map((s) => s.category))).sort();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource} https: data:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillForge Suggestions</title>
  <style nonce="${nonce}">
    ${WEBVIEW_STYLES}
  </style>
</head>
<body>
  <header class="sf-header">
    <div class="sf-header-top">
      <div class="sf-title-row">
        <span class="sf-brand-logo sf-icon">${ICON_FORGE}</span>
        <h1 class="sf-title">
          <span>SkillForge</span>
          <span class="sf-version-tag">v0.1.0</span>
        </h1>
      </div>
      <div class="sf-meta-pills">
        ${
          scopeLabel
            ? `<span class="sf-pill sf-pill-active" title="Active context scope">Scope: ${escapeHtml(scopeLabel)}</span>`
            : ''
        }
        <span class="sf-pill" title="Local suggestion latency">${timingMs}ms local</span>
        <span class="sf-pill">${skills.length} ${skills.length === 1 ? 'result' : 'results'}</span>
      </div>
    </div>

    ${
      query
        ? `
      <div class="sf-query-echo">
        Query: <span class="sf-query-highlight">${escapeHtml(query)}</span>
      </div>
    `
        : ''
    }
  </header>

  ${
    isLoading
      ? `
    <div class="sf-empty-state">
      <div class="sf-spinner"></div>
      <div class="sf-empty-title">Analyzing intent and workspace context...</div>
      <div class="sf-empty-desc">Matching your query against vetted skills and detected dependencies.</div>
    </div>
  `
      : skills.length > 0
        ? `
    ${
      result?.fallbackUsed
        ? `
    <div class="sf-fallback-banner">
      <span class="sf-fallback-icon sf-icon">${ICON_INFO}</span>
      <span>
        No direct skill matches found for <strong>"${escapeHtml(query)}"</strong>. Showing recommended starter tools for your ecosystem:
      </span>
    </div>
    `
        : ''
    }
    <div class="sf-toolbar">
      <div class="sf-filter-group">
        <button class="sf-filter-btn active" data-filter="all">All (${skills.length})</button>
        <button class="sf-filter-btn" data-filter="verified">Verified Only</button>
        ${categories
          .map(
            (c) =>
              `<button class="sf-filter-btn" data-filter="cat:${escapeHtml(c)}">${escapeHtml(c)}</button>`
          )
          .join('')}
      </div>
      <input type="text" class="sf-search-input" id="filterInput" placeholder="Filter results..." />
    </div>

    <main class="sf-card-grid" id="cardGrid">
      ${skills.map((s) => renderSkillCard(s)).join('')}
    </main>

    ${
      result?.fallbackUsed && result.categoryRecommendations && result.categoryRecommendations.length > 0
        ? renderCategoryRecommendations(result.categoryRecommendations)
        : ''
    }
  `
        : `
    <div class="sf-empty-state">
      <div class="sf-empty-title">No direct skill matches found</div>
      <div class="sf-empty-desc">
        No libraries matched "${escapeHtml(query)}" directly. Refine your query keywords or browse categories below.
      </div>
      ${renderCategoryRecommendations(result?.categoryRecommendations)}
    </div>
  `
  }

  <script nonce="${nonce}">
    (function () {
      const vscode = acquireVsCodeApi();

      // 1. Install Button Handler
      document.querySelectorAll('.sf-install-btn').forEach((btn) => {
        btn.addEventListener('click', function (e) {
          const pkg = this.getAttribute('data-pkg');
          const eco = this.getAttribute('data-eco');
          if (pkg) {
            vscode.postMessage({
              type: 'runInstall',
              packageName: pkg,
              ecosystem: eco
            });
          }
        });
      });

      // 2. Copy Command Handler
      document.querySelectorAll('.sf-copy-btn').forEach((btn) => {
        btn.addEventListener('click', function (e) {
          const cmd = this.getAttribute('data-cmd');
          if (cmd) {
            navigator.clipboard.writeText(cmd).then(() => {
              const originalHtml = this.innerHTML;
              this.innerHTML = '<span class="sf-icon">${ICON_CHECK}</span>Copied';
              this.classList.add('sf-btn-copied');
              setTimeout(() => {
                this.innerHTML = originalHtml;
                this.classList.remove('sf-btn-copied');
              }, 1500);

              vscode.postMessage({
                type: 'copyCommand',
                command: cmd
              });
            });
          }
        });
      });

      // 3. External Link / Docs Handler
      document.querySelectorAll('.sf-external-btn, .sf-external-link').forEach((el) => {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          const url = this.getAttribute('data-url');
          if (url) {
            vscode.postMessage({
              type: 'openExternal',
              url: url
            });
          }
        });
      });

      // 4. Re-query Chip Handler (Alternatives, Works Well With, Categories)
      document.querySelectorAll('.sf-requery-chip').forEach((chip) => {
        chip.addEventListener('click', function (e) {
          const intent = this.getAttribute('data-intent');
          if (intent) {
            vscode.postMessage({
              type: 'reQuery',
              intent: intent
            });
          }
        });
      });

      // 5. In-page Filter & Search
      const filterInput = document.getElementById('filterInput');
      const cards = document.querySelectorAll('.sf-card');
      let activeFilter = 'all';

      function applyFilters() {
        const query = (filterInput ? filterInput.value : '').toLowerCase().trim();

        cards.forEach((card) => {
          const cat = card.getAttribute('data-category') || '';
          const trust = card.getAttribute('data-trust') || '';
          const name = card.getAttribute('data-name') || '';
          const pkg = card.getAttribute('data-pkg') || '';

          let matchesTab = true;
          if (activeFilter === 'verified') {
            matchesTab = trust === 'verified';
          } else if (activeFilter.startsWith('cat:')) {
            matchesTab = cat === activeFilter.substring(4);
          }

          let matchesSearch = true;
          if (query) {
            matchesSearch = name.includes(query) || pkg.includes(query) || cat.includes(query);
          }

          card.style.display = matchesTab && matchesSearch ? 'flex' : 'none';
        });
      }

      document.querySelectorAll('.sf-filter-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.sf-filter-btn').forEach((b) => b.classList.remove('active'));
          this.classList.add('active');
          activeFilter = this.getAttribute('data-filter') || 'all';
          applyFilters();
        });
      });

      if (filterInput) {
        filterInput.addEventListener('input', applyFilters);
      }
    })();
  </script>
</body>
</html>`;
}
