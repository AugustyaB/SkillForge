import type {
  ComparisonMatrix,
} from '@skillforge/shared';
import {
  escapeHtml,
  formatMetricNumber,
  formatRelativeTime,
  isSafeUrl,
  renderTrustSeal,
  ICON_AI,
  ICON_CHECK,
  ICON_COPY,
  ICON_EXTERNAL,
  ICON_FORGE,
  ICON_INFO,
  ICON_TERMINAL,
  ICON_WARNING,
} from './webview-html.js';
import { WEBVIEW_STYLES } from './design-tokens.js';

export interface ComparisonHtmlOptions {
  nonce: string;
  cspSource: string;
  matrix: ComparisonMatrix;
  scopeLabel?: string;
  scopePath?: string;
}

/**
 * Generates responsive, accessible HTML for the side-by-side Technology Comparison Matrix.
 */
export function generateComparisonHtml(options: ComparisonHtmlOptions): string {
  const { nonce, cspSource, matrix, scopeLabel = 'Entire Workspace' } = options;
  const columns = matrix.columns || [];
  const colCount = columns.length;

  const conflictBanner =
    matrix.conflictsDetected && matrix.conflictsDetected.length > 0
      ? `<div class="sf-conflict-banner" role="alert">
          <div class="sf-conflict-header">
            <span class="sf-icon">${ICON_WARNING}</span>
            <span>Architectural Conflict / Mutual Exclusivity Detected</span>
          </div>
          <ul class="sf-conflict-list">
            ${matrix.conflictsDetected.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  const crossEcoBanner = matrix.isCrossEcosystem
    ? `<div class="sf-crosseco-banner">
        <span class="sf-icon">${ICON_INFO}</span>
        <span>Cross-Ecosystem Comparison: Evaluating tools across multiple language runtimes.</span>
      </div>`
    : '';

  // Sticky header column cards
  const headerCards = columns
    .map((col) => {
      const packageName = col.stackIndicators[0] || col.id;
      const isInstalled = Boolean(col.isInstalledInWorkspace);
      const installedBadge = isInstalled
        ? `<span class="sf-pill sf-pill-installed" title="Package already installed in this workspace"><span class="sf-icon sf-icon-sm">${ICON_CHECK}</span>Installed</span>`
        : '';

      return `
        <div class="sf-matrix-header-col" data-col-id="${escapeHtml(col.id)}">
          <div class="sf-matrix-title-row">
            <h2 class="sf-matrix-tool-name">${escapeHtml(col.name)}</h2>
            ${installedBadge}
          </div>
          <div class="sf-matrix-seal-row">
            ${renderTrustSeal(col.trustTier)}
            <span class="sf-pill">${escapeHtml(col.ecosystem)}</span>
            <span class="sf-difficulty-pill sf-difficulty-${col.difficulty}">${escapeHtml(col.difficulty)}</span>
          </div>
          <div class="sf-matrix-actions">
            <button class="sf-btn sf-btn-primary sf-btn-sm sf-install-btn" 
                    data-pkg="${escapeHtml(packageName)}" 
                    data-eco="${escapeHtml(col.ecosystem)}" 
                    title="Install ${escapeHtml(packageName)} in project terminal">
              <span class="sf-icon">${ICON_TERMINAL}</span>
              ${isInstalled ? 'Reinstall' : 'Install'}
            </button>
            <button class="sf-btn sf-btn-secondary sf-btn-sm sf-agent-skill-btn" 
                    data-skill-id="${escapeHtml(col.id)}" 
                    data-skill-name="${escapeHtml(col.name)}" 
                    title="Generate agent skill directive for ${escapeHtml(col.name)}">
              <span class="sf-icon">${ICON_AI}</span> Agent Skill
            </button>
            ${
              col.officialUrl && isSafeUrl(col.officialUrl)
                ? `<button class="sf-btn sf-btn-secondary sf-btn-sm sf-external-btn" data-url="${escapeHtml(col.officialUrl)}" title="Open official documentation">
                    <span class="sf-icon">${ICON_EXTERNAL}</span> Docs
                   </button>`
                : ''
            }
          </div>
        </div>`;
    })
    .join('');

  // Row 1: Positioning & Purpose
  const rowPositioning = renderRow(
    'Positioning',
    columns.map(
      (c) => `
      <div class="sf-cell-desc">${escapeHtml(c.description)}</div>
      <div class="sf-cell-why"><strong>Why choose it:</strong> ${escapeHtml(c.whyUseIt)}</div>
    `
    )
  );

  // Row 2: Developer Metrics
  const rowMetrics = renderRow(
    'Registry & Health',
    columns.map((c) => {
      const h = c.health;
      const downloads = h?.weeklyDownloads !== undefined ? formatMetricNumber(h.weeklyDownloads) : 'Verified Catalog';
      const stars = h?.githubStars !== undefined ? formatMetricNumber(h.githubStars) : 'Active';
      const lastPub = h?.lastPublished ? formatRelativeTime(h.lastPublished) : 'Curated';
      const verdict = h?.healthVerdict || 'healthy';

      return `
        <div class="sf-cell-metrics">
          <div class="sf-metric-pair"><span class="sf-metric-lbl">Downloads/wk:</span> <span class="sf-metric-val">${escapeHtml(downloads)}</span></div>
          <div class="sf-metric-pair"><span class="sf-metric-lbl">GitHub Stars:</span> <span class="sf-metric-val">${escapeHtml(stars)}</span></div>
          <div class="sf-metric-pair"><span class="sf-metric-lbl">Updated:</span> <span class="sf-metric-val">${escapeHtml(lastPub)}</span></div>
          <div class="sf-metric-pair"><span class="sf-metric-lbl">Status:</span> <span class="sf-status-tag sf-status-${verdict}">${escapeHtml(verdict)}</span></div>
        </div>
      `;
    })
  );

  // Row 3: Key Strengths (Pros)
  const rowPros = renderRow(
    'Key Strengths',
    columns.map((c) => {
      const pros = Array.isArray(c.pros) && c.pros.length > 0 ? c.pros : [c.whyUseIt];
      return `
        <ul class="sf-cell-list sf-pros-list">
          ${pros.map((p) => `<li><span class="sf-icon sf-icon-sm sf-check-icon">${ICON_CHECK}</span><span>${escapeHtml(p)}</span></li>`).join('')}
        </ul>
      `;
    })
  );

  // Row 4: Caveats & Prerequisites
  const rowCaveats = renderRow(
    'Architectural Caveats',
    columns.map((c) => {
      if (c.caveats) {
        return `<div class="sf-cell-caveat"><span class="sf-icon sf-icon-sm">${ICON_WARNING}</span><span>${escapeHtml(c.caveats)}</span></div>`;
      }
      return `<div class="sf-cell-dim">No critical caveats reported for this tool.</div>`;
    })
  );

  // Row 5: Works Well With
  const rowCompanions = renderRow(
    'Companion Stack',
    columns.map((c) => {
      if (!c.worksWellWith || c.worksWellWith.length === 0) {
        return `<div class="sf-cell-dim">Standalone / general compatibility</div>`;
      }
      return `
        <div class="sf-cell-chips">
          ${c.worksWellWith.map((w) => `<span class="sf-chip">${escapeHtml(w)}</span>`).join('')}
        </div>
      `;
    })
  );

  // Row 6: Package Indicators & Direct Command
  const rowCommand = renderRow(
    'Installation Command',
    columns.map((c) => {
      const packageName = c.stackIndicators[0] || c.id;
      const cmd = deriveInstallString(packageName, c.ecosystem);
      return `
        <div class="sf-cell-cmd-box">
          <code class="sf-cmd-code">${escapeHtml(cmd)}</code>
          <button class="sf-btn-copy sf-copy-btn" data-cmd="${escapeHtml(cmd)}" title="Copy install command">
            <span class="sf-icon">${ICON_COPY}</span>
          </button>
        </div>
      `;
    })
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillForge: Technology Comparison Matrix</title>
  <style>
    ${WEBVIEW_STYLES}

    /* Comparison Matrix Custom Layout */
    .sf-matrix-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .sf-matrix-top {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--sf-card-border);
    }

    .sf-matrix-header-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--sf-fg);
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }

    .sf-matrix-summary {
      font-size: 13px;
      color: var(--sf-muted-fg);
    }

    /* Conflict and Cross-Eco Banners */
    .sf-conflict-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 16px;
      color: var(--sf-fg);
    }

    .sf-conflict-header {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--sf-deprecated-color);
      margin-bottom: 6px;
    }

    .sf-conflict-list {
      padding-left: 20px;
      font-size: 12px;
      line-height: 1.6;
    }

    .sf-crosseco-banner {
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--sf-fg);
    }

    /* Comparison Grid Table */
    .sf-comparison-grid {
      display: grid;
      grid-template-columns: 200px repeat(${colCount}, minmax(260px, 1fr));
      border: 1px solid var(--sf-card-border);
      border-radius: 8px;
      overflow: hidden;
      background: var(--sf-card-bg);
    }

    /* Sticky Header Row */
    .sf-matrix-header-corner {
      background: var(--sf-card-bg);
      border-bottom: 2px solid var(--sf-card-border);
      border-right: 1px solid var(--sf-card-border);
      padding: 16px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--sf-muted-fg);
      display: flex;
      align-items: flex-end;
    }

    .sf-matrix-header-col {
      background: var(--sf-card-bg);
      border-bottom: 2px solid var(--sf-card-border);
      border-right: 1px solid var(--sf-card-border);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sf-matrix-header-col:last-child {
      border-right: none;
    }

    .sf-matrix-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .sf-matrix-tool-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--sf-fg);
      margin: 0;
    }

    .sf-pill-installed {
      color: var(--sf-verified-color);
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.08);
    }

    .sf-matrix-seal-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    .sf-matrix-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    /* Row Styling */
    .sf-grid-row-label {
      background: rgba(128, 128, 128, 0.04);
      border-bottom: 1px solid var(--sf-card-border);
      border-right: 1px solid var(--sf-card-border);
      padding: 14px 16px;
      font-weight: 600;
      font-size: 12px;
      color: var(--sf-muted-fg);
      display: flex;
      align-items: flex-start;
    }

    .sf-grid-cell {
      border-bottom: 1px solid var(--sf-card-border);
      border-right: 1px solid var(--sf-card-border);
      padding: 14px 16px;
      font-size: 12px;
      line-height: 1.5;
    }

    .sf-grid-cell:last-child {
      border-right: none;
    }

    .sf-comparison-grid .sf-grid-row-label:nth-last-child(-n+${colCount + 1}),
    .sf-comparison-grid .sf-grid-cell:nth-last-child(-n+${colCount + 1}) {
      border-bottom: none;
    }

    /* Content Cell Details */
    .sf-cell-desc {
      margin-bottom: 6px;
      color: var(--sf-fg);
    }

    .sf-cell-why {
      color: var(--sf-muted-fg);
      font-size: 11.5px;
    }

    .sf-cell-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
      font-size: 11.5px;
    }

    .sf-metric-pair {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .sf-metric-lbl {
      color: var(--sf-muted-fg);
    }

    .sf-metric-val {
      font-family: var(--sf-mono-font);
      font-weight: 600;
    }

    .sf-status-healthy { color: var(--sf-verified-color); font-weight: 600; }
    .sf-status-aging { color: var(--sf-validated-color); font-weight: 600; }
    .sf-status-abandoned { color: var(--sf-deprecated-color); font-weight: 600; }

    .sf-pros-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .sf-pros-list li {
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .sf-check-icon {
      color: var(--sf-verified-color);
      margin-top: 2px;
    }

    .sf-cell-caveat {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      color: var(--vscode-charts-orange, #f59e0b);
      background: rgba(245, 158, 11, 0.08);
      border-radius: 4px;
      padding: 6px 10px;
    }

    .sf-cell-dim {
      color: var(--sf-muted-fg);
      font-style: italic;
    }

    .sf-cell-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .sf-chip {
      background: var(--sf-code-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      font-family: var(--sf-mono-font);
    }

    .sf-cell-cmd-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: var(--sf-code-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 4px;
      padding: 4px 8px;
    }

    .sf-cmd-code {
      font-family: var(--sf-mono-font);
      font-size: 11px;
      overflow-x: auto;
      white-space: nowrap;
    }

    .sf-btn-copy {
      background: transparent;
      border: none;
      color: var(--sf-muted-fg);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      padding: 2px;
      border-radius: 3px;
    }

    .sf-btn-copy:hover {
      color: var(--sf-fg);
      background: var(--sf-card-border);
    }

    /* Difficulty Pills */
    .sf-difficulty-pill {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 3px;
    }
    .sf-difficulty-beginner { background: rgba(16, 185, 129, 0.15); color: var(--sf-verified-color); }
    .sf-difficulty-intermediate { background: rgba(56, 189, 248, 0.15); color: var(--sf-validated-color); }
    .sf-difficulty-advanced { background: rgba(239, 68, 68, 0.15); color: var(--sf-deprecated-color); }
  </style>
</head>
<body>
  <div class="sf-matrix-container">
    <div class="sf-matrix-top">
      <div class="sf-matrix-header-title">
        <span class="sf-brand-logo">${ICON_FORGE}</span>
        <span>Technology Comparison Matrix</span>
      </div>
      <div class="sf-matrix-summary">
        ${escapeHtml(matrix.summary || 'Side-by-side architectural comparison.')}
        &bull; Target Scope: <strong>${escapeHtml(scopeLabel)}</strong>
      </div>
    </div>

    ${conflictBanner}
    ${crossEcoBanner}

    <div class="sf-comparison-grid" style="--col-count: ${colCount};">
      <!-- Sticky Column Headers -->
      <div class="sf-matrix-header-corner">Tool Architecture</div>
      ${headerCards}

      <!-- Grid Rows -->
      ${rowPositioning}
      ${rowMetrics}
      ${rowPros}
      ${rowCaveats}
      ${rowCompanions}
      ${rowCommand}
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    // 1-Click Install Buttons
    document.querySelectorAll('.sf-install-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkg = btn.getAttribute('data-pkg');
        const eco = btn.getAttribute('data-eco');
        if (pkg) {
          vscode.postMessage({
            type: 'runInstall',
            packageName: pkg,
            ecosystem: eco || undefined
          });
        }
      });
    });

    // Copy Command Buttons
    document.querySelectorAll('.sf-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          vscode.postMessage({
            type: 'copyCommand',
            command: cmd
          });
        }
      });
    });

    // External Documentation Buttons
    document.querySelectorAll('.sf-external-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = btn.getAttribute('data-url');
        if (url) {
          vscode.postMessage({
            type: 'openExternal',
            url: url
          });
        }
      });
    });

    // Agent Skill Directive Generator Buttons
    document.querySelectorAll('.sf-agent-skill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skillId = btn.getAttribute('data-skill-id');
        const skillName = btn.getAttribute('data-skill-name');
        if (skillId) {
          vscode.postMessage({
            type: 'createAgentSkill',
            skillId: skillId,
            skillName: skillName || skillId
          });
        }
      });
    });
  </script>
</body>
</html>`;
}

function renderRow(label: string, cells: string[]): string {
  return `
    <div class="sf-grid-row-label">${escapeHtml(label)}</div>
    ${cells.map((c) => `<div class="sf-grid-cell">${c}</div>`).join('')}
  `;
}

function deriveInstallString(pkg: string, ecosystem?: string): string {
  switch (ecosystem?.toLowerCase()) {
    case 'python':
      return `pip install ${pkg}`;
    case 'rust':
      return `cargo add ${pkg}`;
    case 'go':
      return `go get ${pkg}`;
    case 'javascript':
    case 'typescript':
    default:
      return `npm install ${pkg}`;
  }
}
