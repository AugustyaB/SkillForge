/**
 * SkillForge Webview Design System & Theme Styles
 * Clean, engineering-focused developer UI binding directly to VS Code workbench tokens.
 * Zero emojis, clean typography, SVG codicons, and subtle state transitions.
 */
export const WEBVIEW_STYLES = `
  :root {
    --sf-font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
    --sf-mono-font: var(--vscode-editor-font-family, ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace);
    
    --sf-bg: var(--vscode-editor-background);
    --sf-fg: var(--vscode-editor-foreground);
    --sf-card-bg: var(--vscode-editorWidget-background, #1e1e1e);
    --sf-card-border: var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.2));
    --sf-card-hover-border: var(--vscode-focusBorder, #007acc);
    --sf-muted-fg: var(--vscode-descriptionForeground, #8c8c8c);
    --sf-link-fg: var(--vscode-textLink-foreground, #3794ff);
    --sf-code-bg: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.1));
    
    --sf-btn-primary-bg: var(--vscode-button-background, #007acc);
    --sf-btn-primary-fg: var(--vscode-button-foreground, #ffffff);
    --sf-btn-primary-hover: var(--vscode-button-hoverBackground, #0062a3);
    --sf-btn-secondary-bg: var(--vscode-button-secondaryBackground, #3a3d41);
    --sf-btn-secondary-fg: var(--vscode-button-secondaryForeground, #ffffff);
    --sf-btn-secondary-hover: var(--vscode-button-secondaryHoverBackground, #45494e);

    --sf-verified-color: var(--vscode-charts-green, #10B981);
    --sf-validated-color: var(--vscode-charts-blue, #38BDF8);
    --sf-suggested-color: var(--vscode-descriptionForeground, #94A3B8);
    --sf-deprecated-color: var(--vscode-charts-red, #EF4444);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--sf-font-family);
    font-size: 13px;
    line-height: 1.5;
    color: var(--sf-fg);
    background-color: var(--sf-bg);
    padding: 20px 24px;
    user-select: none;
    overflow-x: hidden;
  }

  /* SVG Icons */
  .sf-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    flex-shrink: 0;
  }

  .sf-icon svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .sf-icon-sm svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }

  /* Header Section */
  .sf-header {
    margin-bottom: 20px;
    border-bottom: 1px solid var(--sf-card-border);
    padding-bottom: 16px;
  }

  .sf-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .sf-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sf-brand-logo {
    color: var(--vscode-foreground);
    display: inline-flex;
    align-items: center;
  }

  .sf-brand-logo svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .sf-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.2px;
    color: var(--sf-fg);
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .sf-version-tag {
    font-family: var(--sf-mono-font);
    font-size: 10px;
    font-weight: 400;
    color: var(--sf-muted-fg);
  }

  .sf-meta-pills {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sf-pill {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--sf-code-bg);
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .sf-pill-active {
    border-color: var(--sf-card-hover-border);
    color: var(--sf-fg);
  }

  .sf-query-echo {
    font-size: 13px;
    color: var(--sf-muted-fg);
    margin-top: 4px;
  }

  .sf-query-highlight {
    font-weight: 600;
    color: var(--sf-fg);
    font-family: var(--sf-mono-font);
    font-size: 12px;
    background: var(--sf-code-bg);
    padding: 1px 6px;
    border-radius: 3px;
    border: 1px solid var(--sf-card-border);
  }

  /* Filter Toolbar */
  .sf-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sf-filter-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .sf-filter-btn {
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 4px;
    background: transparent;
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .sf-filter-btn:hover {
    background: var(--sf-code-bg);
    color: var(--sf-fg);
  }

  .sf-filter-btn.active {
    background: var(--sf-btn-primary-bg);
    color: var(--sf-btn-primary-fg);
    border-color: var(--sf-btn-primary-bg);
  }

  .sf-search-input {
    font-family: inherit;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 4px;
    background: var(--sf-card-bg);
    color: var(--sf-fg);
    border: 1px solid var(--sf-card-border);
    outline: none;
    min-width: 220px;
  }

  .sf-search-input:focus {
    border-color: var(--sf-card-hover-border);
  }

  /* Cards Grid */
  .sf-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 14px;
  }

  /* Individual Skill Card */
  .sf-card {
    background: var(--sf-card-bg);
    border: 1px solid var(--sf-card-border);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    user-select: text;
  }

  .sf-card:hover {
    border-color: var(--sf-card-hover-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  /* Card Header */
  .sf-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .sf-card-title-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
  }

  .sf-card-name-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .sf-card-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--sf-fg);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sf-card-pkg-name {
    font-family: var(--sf-mono-font);
    font-size: 11px;
    font-weight: 400;
    color: var(--sf-muted-fg);
    background: var(--sf-code-bg);
    padding: 1px 6px;
    border-radius: 3px;
    border: 1px solid var(--sf-card-border);
  }

  .sf-card-desc {
    font-size: 12px;
    color: var(--sf-muted-fg);
    line-height: 1.4;
  }

  /* Badges & Trust Seals */
  .sf-badge-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .sf-seal {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border: 1px solid transparent;
  }

  .sf-seal-verified {
    color: var(--sf-verified-color);
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.25);
  }

  .sf-seal-validated {
    color: var(--sf-validated-color);
    background: rgba(56, 189, 248, 0.08);
    border-color: rgba(56, 189, 248, 0.25);
  }

  .sf-seal-suggested {
    color: var(--sf-suggested-color);
    background: rgba(148, 163, 184, 0.08);
    border-color: var(--sf-card-border);
  }

  .sf-seal-deprecated {
    color: var(--sf-deprecated-color);
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.25);
  }

  .sf-tag {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 3px;
    background: var(--sf-code-bg);
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
  }

  .sf-confidence {
    font-family: var(--sf-mono-font);
    font-size: 11px;
    color: var(--sf-muted-fg);
    margin-left: auto;
  }

  /* Conflict Warning Banner */
  .sf-conflict-banner {
    background: rgba(239, 68, 68, 0.08);
    border-left: 3px solid var(--sf-deprecated-color);
    padding: 8px 10px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
    color: var(--sf-fg);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sf-conflict-icon {
    color: var(--sf-deprecated-color);
    display: inline-flex;
  }

  /* "Why this tool" Box */
  .sf-why-box {
    background: var(--sf-code-bg);
    border-left: 2px solid var(--sf-card-hover-border);
    padding: 8px 12px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
    line-height: 1.45;
  }

  .sf-why-label {
    font-weight: 600;
    font-size: 11px;
    color: var(--sf-fg);
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Health Metrics Bar */
  .sf-health-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11px;
    color: var(--sf-muted-fg);
    border-top: 1px solid var(--sf-card-border);
    padding-top: 8px;
    flex-wrap: wrap;
  }

  .sf-health-metric {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .sf-health-healthy {
    color: var(--sf-verified-color);
  }

  .sf-health-aging {
    color: var(--vscode-charts-orange, #FB923C);
  }

  .sf-health-abandoned, .sf-health-risky {
    color: var(--sf-deprecated-color);
  }

  /* Action Buttons */
  .sf-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 2px;
  }

  .sf-btn {
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 11px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.12s ease;
    user-select: none;
  }

  .sf-btn-primary {
    background: var(--sf-btn-primary-bg);
    color: var(--sf-btn-primary-fg);
  }

  .sf-btn-primary:hover {
    background: var(--sf-btn-primary-hover);
  }

  .sf-btn-secondary {
    background: var(--sf-btn-secondary-bg);
    color: var(--sf-btn-secondary-fg);
  }

  .sf-btn-secondary:hover {
    background: var(--sf-btn-secondary-hover);
  }

  .sf-btn-ghost {
    background: transparent;
    color: var(--sf-link-fg);
    border-color: var(--sf-card-border);
  }

  .sf-btn-ghost:hover {
    background: var(--sf-code-bg);
    color: var(--sf-fg);
  }

  .sf-btn-copied {
    background: rgba(16, 185, 129, 0.15) !important;
    color: var(--sf-verified-color) !important;
    border-color: rgba(16, 185, 129, 0.3) !important;
  }

  /* Deep Dive Drawer (Collapsible) */
  .sf-deep-dive {
    border-top: 1px solid var(--sf-card-border);
    padding-top: 10px;
    font-size: 12px;
  }

  .sf-deep-dive summary {
    cursor: pointer;
    font-weight: 500;
    color: var(--sf-muted-fg);
    display: flex;
    align-items: center;
    gap: 6px;
    list-style: none;
    font-size: 11px;
  }

  .sf-deep-dive summary::-webkit-details-marker {
    display: none;
  }

  .sf-deep-dive summary:hover {
    color: var(--sf-fg);
  }

  .sf-deep-dive-content {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sf-dd-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sf-dd-title {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--sf-muted-fg);
    letter-spacing: 0.3px;
  }

  .sf-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .sf-chip {
    font-size: 11px;
    font-family: var(--sf-mono-font);
    padding: 2px 7px;
    background: var(--sf-code-bg);
    border-radius: 3px;
    border: 1px solid var(--sf-card-border);
    cursor: pointer;
  }

  .sf-chip:hover {
    border-color: var(--sf-card-hover-border);
    color: var(--sf-fg);
  }

  .sf-resource-link {
    font-size: 12px;
    color: var(--sf-link-fg);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .sf-resource-link:hover {
    text-decoration: underline;
  }

  /* Empty & Fallback States */
  .sf-empty-state {
    text-align: center;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .sf-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--sf-card-border);
    border-top-color: var(--sf-card-hover-border);
    border-radius: 50%;
    animation: sf-spin 0.8s linear infinite;
    margin-bottom: 4px;
  }

  @keyframes sf-spin {
    to { transform: rotate(360deg); }
  }

  .sf-empty-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--sf-fg);
  }

  .sf-empty-desc {
    font-size: 12px;
    color: var(--sf-muted-fg);
    max-width: 440px;
    line-height: 1.5;
  }

  /* Category Recommendations Grid */
  .sf-category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    margin-top: 20px;
    width: 100%;
  }

  .sf-cat-card {
    background: var(--sf-card-bg);
    border: 1px solid var(--sf-card-border);
    border-radius: 6px;
    padding: 12px 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.12s ease;
  }

  .sf-cat-card:hover {
    border-color: var(--sf-card-hover-border);
  }

  .sf-cat-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--sf-fg);
    margin-bottom: 2px;
  }

  .sf-cat-desc {
    font-size: 11px;
    color: var(--sf-muted-fg);
    margin-bottom: 6px;
  }

  .sf-cat-count {
    font-size: 11px;
    color: var(--sf-link-fg);
    font-weight: 500;
  }

  /* High Contrast Accessibility Overrides */
  .vscode-high-contrast .sf-card,
  @media (forced-colors: active) {
    .sf-card, .sf-seal, .sf-why-box, .sf-conflict-banner, .sf-btn {
      border: 1px solid ButtonText !important;
    }
  }
`;
