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
 * Renders the Trust Tier seal badge.
 */
export function renderTrustSeal(trustTier: TrustTier): string {
  switch (trustTier) {
    case 'verified':
      return `<span class="sf-seal sf-seal-verified" title="Verified: Tested, active maintenance, official documentation">✓ Verified</span>`;
    case 'validated':
      return `<span class="sf-seal sf-seal-validated" title="Validated: Registry-backed, active usage">★ Validated</span>`;
    case 'suggested':
      return `<span class="sf-seal sf-seal-suggested" title="Suggested: Matches intent, community library">✦ Suggested</span>`;
    case 'deprecated':
      return `<span class="sf-seal sf-seal-deprecated" title="Deprecated: Package or framework is no longer maintained">⚠ Deprecated</span>`;
    default:
      return `<span class="sf-seal sf-seal-suggested">✦ Suggested</span>`;
  }
}

/**
 * Renders the confidence score percentage.
 */
export function renderConfidence(confidence: number): string {
  const pct = Math.max(0, Math.min(100, Math.round((confidence || 0) * 100)));
  return `<span class="sf-confidence" title="Relevance match score">⚡ ${pct}% Match</span>`;
}

/**
 * Formats large download/star numbers (e.g. 1.2M, 45k).
 */
export function formatMetricNumber(num?: number): string {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

/**
 * Formats relative time (e.g. "3d ago", "2mo ago").
 */
export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recent';
  try {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 'Recent';
    const diffDays = Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return 'Recent';
  }
}

/**
 * Renders the package registry health metrics bar.
 */
export function renderHealthBar(health?: PackageHealth): string {
  if (!health) {
    return `
      <div class="sf-health-bar">
        <span class="sf-health-metric">📊 Health: <span class="sf-health-aging">Pending Verification</span></span>
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
      <span class="sf-health-metric">★ ${stars} Stars</span>
      <span class="sf-health-metric">📥 ${downloads} dl/wk</span>
      <span class="sf-health-metric">🕒 ${updated}</span>
      <span class="sf-health-metric">Status: <span class="${verdictClass}">${verdictLabel}</span></span>
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
    `Conflicts with existing tool: ${conflictWith?.join(', ')}`;

  return `
    <div class="sf-conflict-banner">
      <span class="sf-conflict-icon">⚠</span>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

/**
 * Renders "Why Use It" rationale block.
 */
export function renderWhyUseIt(whyUseIt: string): string {
  if (!whyUseIt || !whyUseIt.trim()) return '';
  return `
    <div class="sf-why-box">
      <div class="sf-why-label">💡 Why Use It</div>
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
      <summary>▼ Deep Dive & Relationships</summary>
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
            <span class="sf-dd-title">Learning Resources</span>
            <div class="sf-chips">
              ${resources
                .map((res) => {
                  const safe = isSafeUrl(res.url);
                  const typeLabel = res.type ? `[${res.type}] ` : '';
                  return safe
                    ? `<a href="#" class="sf-resource-link sf-external-link" data-url="${escapeHtml(res.url)}" title="${escapeHtml(res.url)}">📖 ${escapeHtml(typeLabel)}${escapeHtml(res.label)} ↗</a>`
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
          <div class="sf-card-name">
            ${escapeHtml(skill.name)}
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
        <button class="sf-btn sf-btn-primary sf-install-btn" data-pkg="${escapeHtml(pkgName)}" data-eco="${escapeHtml(ecosystem)}" title="Execute '${escapeHtml(installCmd)}' in dedicated SkillForge terminal">
          ⚡ Install in Terminal
        </button>
        <button class="sf-btn sf-btn-secondary sf-copy-btn" data-cmd="${escapeHtml(installCmd)}" title="Copy command to clipboard">
          📋 Copy Command
        </button>
        ${
          hasSafeDocs
            ? `
          <button class="sf-btn sf-btn-ghost sf-external-btn" data-url="${escapeHtml(skill.officialUrl)}" title="Open official documentation in browser">
            📖 Docs ↗
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
      <div class="sf-empty-title">Browse By Category</div>
      <div class="sf-empty-desc">Explore recommended toolsets and frameworks across software domains:</div>
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
        <h1 class="sf-title">
          <span class="sf-spark-icon">✨</span>
          <span>SkillForge</span>
        </h1>
      </div>
      <div class="sf-meta-pills">
        ${
          scopeLabel
            ? `<span class="sf-pill sf-pill-accent" title="Active scope directory">📁 Scope: ${escapeHtml(scopeLabel)}</span>`
            : ''
        }
        <span class="sf-pill" title="Local suggestion latency">⚡ ${timingMs}ms local</span>
        <span class="sf-pill">${skills.length} ${skills.length === 1 ? 'skill' : 'skills'} found</span>
      </div>
    </div>

    ${
      query
        ? `
      <div class="sf-query-echo">
        Suggestions for: <span class="sf-query-highlight">"${escapeHtml(query)}"</span>
      </div>
    `
        : ''
    }
  </header>

  ${
    isLoading
      ? `
    <div class="sf-empty-state">
      <div class="sf-empty-icon">⏳</div>
      <div class="sf-empty-title">Analyzing intent and project context...</div>
      <div class="sf-empty-desc">Matching your request against 118 verified skills and dependencies.</div>
    </div>
  `
      : skills.length > 0
        ? `
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
      <input type="text" class="sf-search-input" id="filterInput" placeholder="Filter recommendations..." />
    </div>

    <main class="sf-card-grid" id="cardGrid">
      ${skills.map((s) => renderSkillCard(s)).join('')}
    </main>
  `
        : `
    <div class="sf-empty-state">
      <div class="sf-empty-icon">🔍</div>
      <div class="sf-empty-title">No direct skill matches found</div>
      <div class="sf-empty-desc">
        We couldn't find an exact match for "${escapeHtml(query)}". Try rephrasing your intent or explore categories below.
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
              const originalText = this.innerHTML;
              this.innerHTML = '✓ Copied!';
              this.classList.add('sf-btn-copied');
              setTimeout(() => {
                this.innerHTML = originalText;
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
