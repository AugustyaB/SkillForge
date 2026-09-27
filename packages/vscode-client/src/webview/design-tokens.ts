/**
 * SkillForge Webview Design System & Theme Styles
 * Implements standard VS Code theme token integration, responsive layout,
 * trust seals, conflict banners, and micro-interactions.
 */
export const WEBVIEW_STYLES = `
  :root {
    --sf-font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    --sf-mono-font: var(--vscode-editor-font-family, 'Cascadia Code', 'Fira Code', Consolas, monospace);
    --sf-accent-amber: #F59E0B;
    --sf-emerald: #10B981;
    --sf-indigo: #6366F1;
    --sf-rose: #EF4444;

    --sf-bg: var(--vscode-editor-background);
    --sf-fg: var(--vscode-editor-foreground);
    --sf-card-bg: var(--vscode-editorWidget-background, #1e1e1e);
    --sf-card-border: var(--vscode-editorWidget-border, rgba(128, 128, 128, 0.2));
    --sf-muted-fg: var(--vscode-descriptionForeground, #888888);
    --sf-badge-bg: var(--vscode-badge-background, #333333);
    --sf-badge-fg: var(--vscode-badge-foreground, #ffffff);
    --sf-link-fg: var(--vscode-textLink-foreground, #3794ff);
    --sf-code-bg: var(--vscode-textCodeBlock-background, rgba(128, 128, 128, 0.15));
    --sf-btn-primary-bg: var(--vscode-button-background, #007acc);
    --sf-btn-primary-fg: var(--vscode-button-foreground, #ffffff);
    --sf-btn-primary-hover: var(--vscode-button-hoverBackground, #0062a3);
    --sf-btn-secondary-bg: var(--vscode-button-secondaryBackground, #3a3d41);
    --sf-btn-secondary-fg: var(--vscode-button-secondaryForeground, #ffffff);
    --sf-btn-secondary-hover: var(--vscode-button-secondaryHoverBackground, #45494e);
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
    gap: 8px;
  }

  .sf-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sf-title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sf-spark-icon {
    color: var(--sf-accent-amber);
    display: inline-flex;
    align-items: center;
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
    border-radius: 12px;
    background: var(--sf-code-bg);
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
  }

  .sf-pill-accent {
    background: rgba(245, 158, 11, 0.12);
    color: var(--sf-accent-amber);
    border-color: rgba(245, 158, 11, 0.3);
  }

  .sf-query-echo {
    font-size: 14px;
    color: var(--sf-fg);
    margin-top: 4px;
  }

  .sf-query-highlight {
    font-weight: 600;
    color: var(--sf-accent-amber);
  }

  /* Filter Toolbar */
  .sf-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
    padding: 4px 10px;
    border-radius: 4px;
    background: var(--sf-code-bg);
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sf-filter-btn:hover {
    background: var(--sf-btn-secondary-hover);
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
    padding: 6px 12px;
    border-radius: 4px;
    background: var(--sf-card-bg);
    color: var(--sf-fg);
    border: 1px solid var(--sf-card-border);
    outline: none;
    min-width: 200px;
  }

  .sf-search-input:focus {
    border-color: var(--vscode-focusBorder, var(--sf-accent-amber));
  }

  /* Cards Grid */
  .sf-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;
  }

  /* Individual Skill Card */
  .sf-card {
    background: var(--sf-card-bg);
    border: 1px solid var(--sf-card-border);
    border-radius: 8px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    user-select: text;
  }

  .sf-card:hover {
    border-color: var(--vscode-focusBorder, var(--sf-accent-amber));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    gap: 2px;
  }

  .sf-card-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--sf-fg);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sf-card-pkg-name {
    font-family: var(--sf-mono-font);
    font-size: 11px;
    font-weight: 400;
    color: var(--sf-muted-fg);
    background: var(--sf-code-bg);
    padding: 1px 6px;
    border-radius: 3px;
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
    margin-top: 4px;
  }

  .sf-seal {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .sf-seal-verified {
    background: rgba(16, 185, 129, 0.12);
    color: var(--sf-emerald);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .sf-seal-validated {
    background: rgba(245, 158, 11, 0.12);
    color: var(--sf-accent-amber);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .sf-seal-suggested {
    background: rgba(99, 102, 241, 0.12);
    color: var(--sf-indigo);
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .sf-seal-deprecated {
    background: rgba(239, 68, 68, 0.12);
    color: var(--sf-rose);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .sf-tag {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--sf-code-bg);
    color: var(--sf-muted-fg);
    border: 1px solid var(--sf-card-border);
  }

  /* Confidence Meter */
  .sf-confidence {
    font-size: 11px;
    font-weight: 600;
    color: var(--sf-accent-amber);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* Conflict Alert Banner */
  .sf-conflict-banner {
    background: rgba(239, 68, 68, 0.08);
    border-left: 3px solid var(--sf-rose);
    padding: 8px 12px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
    color: var(--sf-fg);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sf-conflict-icon {
    color: var(--sf-rose);
    font-weight: bold;
  }

  /* "Why Use It" Box */
  .sf-why-box {
    background: rgba(245, 158, 11, 0.05);
    border-left: 3px solid var(--sf-accent-amber);
    padding: 8px 12px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
    line-height: 1.45;
  }

  .sf-why-label {
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--sf-accent-amber);
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Health Metrics Bar */
  .sf-health-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    color: var(--sf-muted-fg);
    border-top: 1px solid var(--sf-card-border);
    padding-top: 10px;
    flex-wrap: wrap;
  }

  .sf-health-metric {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .sf-health-healthy {
    color: var(--sf-emerald);
    font-weight: 600;
  }

  .sf-health-aging {
    color: var(--sf-accent-amber);
    font-weight: 600;
  }

  .sf-health-abandoned, .sf-health-risky {
    color: var(--sf-rose);
    font-weight: 600;
  }

  /* Action Buttons */
  .sf-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .sf-btn {
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
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
    background: rgba(16, 185, 129, 0.2) !important;
    color: var(--sf-emerald) !important;
    border-color: var(--sf-emerald) !important;
  }

  /* Deep Dive Drawer (Collapsible) */
  .sf-deep-dive {
    border-top: 1px solid var(--sf-card-border);
    padding-top: 12px;
    font-size: 12px;
  }

  .sf-deep-dive summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--sf-muted-fg);
    display: flex;
    align-items: center;
    gap: 6px;
    list-style: none;
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
    gap: 10px;
  }

  .sf-dd-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sf-dd-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--sf-muted-fg);
  }

  .sf-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .sf-chip {
    font-size: 11px;
    padding: 2px 8px;
    background: var(--sf-code-bg);
    border-radius: 4px;
    border: 1px solid var(--sf-card-border);
    cursor: pointer;
  }

  .sf-chip:hover {
    border-color: var(--sf-accent-amber);
    color: var(--sf-accent-amber);
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
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .sf-empty-icon {
    font-size: 32px;
    color: var(--sf-accent-amber);
  }

  .sf-empty-title {
    font-size: 16px;
    font-weight: 600;
  }

  .sf-empty-desc {
    font-size: 13px;
    color: var(--sf-muted-fg);
    max-width: 480px;
  }

  /* Category Recommendations Grid */
  .sf-category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    margin-top: 20px;
    width: 100%;
  }

  .sf-cat-card {
    background: var(--sf-card-bg);
    border: 1px solid var(--sf-card-border);
    border-radius: 6px;
    padding: 14px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .sf-cat-card:hover {
    border-color: var(--sf-accent-amber);
    transform: translateY(-2px);
  }

  .sf-cat-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--sf-fg);
    margin-bottom: 4px;
  }

  .sf-cat-desc {
    font-size: 12px;
    color: var(--sf-muted-fg);
    margin-bottom: 8px;
  }

  .sf-cat-count {
    font-size: 11px;
    color: var(--sf-accent-amber);
    font-weight: 500;
  }

  /* Loading Skeleton */
  .sf-skeleton {
    animation: sf-pulse 1.5s ease-in-out infinite;
    background: linear-gradient(90deg, var(--sf-card-bg) 25%, var(--sf-code-bg) 50%, var(--sf-card-bg) 75%);
    background-size: 200% 100%;
    border-radius: 4px;
  }

  @keyframes sf-pulse {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* High Contrast Accessibility Overrides */
  .vscode-high-contrast .sf-card,
  @media (forced-colors: active) {
    .sf-card {
      border: 1px solid ButtonText !important;
    }
    .sf-seal, .sf-why-box, .sf-conflict-banner {
      border: 1px solid ButtonText !important;
    }
    .sf-btn {
      border: 1px solid ButtonText !important;
    }
  }
`;
