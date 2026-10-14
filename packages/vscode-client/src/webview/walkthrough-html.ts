import {
  escapeHtml,
  ICON_CHECK,
  ICON_FORGE,
} from './webview-html.js';
import { WEBVIEW_STYLES } from './design-tokens.js';

export interface WalkthroughHtmlOptions {
  nonce: string;
  cspSource: string;
}

export interface WalkthroughStep {
  number: number;
  id: string;
  title: string;
  badge: string;
  summary: string;
  bullets: string[];
  codeExample?: string;
  primaryAction: {
    label: string;
    command: string;
  };
  secondaryAction?: {
    label: string;
    command: string;
  };
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    number: 1,
    id: 'welcome',
    title: 'Instant Intent-to-Skill Discovery',
    badge: '363 Curated Tools',
    summary:
      'Describe what you want to build in plain English (e.g., "real-time chat with WebSockets", "fast Python LLM structured output", "type-safe SQL ORM") and receive ranked, verified library recommendations.',
    bullets: [
      '100% offline local engine by default — zero code transmitted, <2ms response latency.',
      'Transparent Trust Tiers (Verified, Validated, Suggested) backed by catalog verification.',
      'Automatic architectural conflict alerts when a tool overlaps with your installed dependencies.',
    ],
    primaryAction: {
      label: 'Suggest Skills for My Idea',
      command: 'skillforge.suggest',
    },
    secondaryAction: {
      label: 'Open Suggestion Canvas',
      command: 'skillforge.showCanvas',
    },
  },
  {
    number: 2,
    id: 'triggers',
    title: 'Frictionless 1-Click & Keyboard Access',
    badge: 'Zero Palette Hunting',
    summary:
      'You never need to hunt through Ctrl+Shift+P to use SkillForge. Access recommendations with a single click or keystroke from anywhere in the IDE:',
    bullets: [
      'Bottom Status Bar: Click the "$(sparkle) SkillForge" button in the bottom-right status bar at any time.',
      'Keyboard Shortcuts: Press Ctrl+Alt+S (Cmd+Alt+S on macOS) for idea discovery, or Ctrl+Alt+F for the active file.',
      'Editor Title Bar: Click the sparkle icon in the top-right corner of any open file tab.',
      'Inline CodeLens: Type "// skillforge: <your intent>" in any JS, TS, Python, Go, Rust, or Java file.',
    ],
    codeExample: '// skillforge: fast schema validation library with TypeScript inference',
    primaryAction: {
      label: 'Suggest Skills for Active File',
      command: 'skillforge.suggestForCurrentFile',
    },
  },
  {
    number: 3,
    id: 'scoping',
    title: 'Monorepo & Context Scoping',
    badge: 'Stack-Aware',
    summary:
      'Target the entire workspace, a specific monorepo package (e.g. packages/server), or your currently active file so recommendations match your exact language and dependencies.',
    bullets: [
      'Automatically parses package.json, requirements.txt, pyproject.toml, Cargo.toml, and go.mod.',
      'Boosts tools that integrate cleanly with your existing framework and flags already-installed packages.',
      'Scopes 1-click terminal installation commands directly to your selected package directory.',
    ],
    primaryAction: {
      label: 'Select Context Scope',
      command: 'skillforge.selectScope',
    },
    secondaryAction: {
      label: 'Re-scan Project Stack',
      command: 'skillforge.rescanWorkspace',
    },
  },
  {
    number: 4,
    id: 'comparison',
    title: 'Side-by-Side Technology Comparison Matrix',
    badge: 'Responsive Matrix',
    summary:
      'Deciding between React vs Vue.js, Prisma vs Drizzle, or FastAPI vs Litestar? Compare 2 to 4 libraries side-by-side in an interactive matrix.',
    bullets: [
      'Compares Positioning, Registry Health, Key Strengths, Architectural Caveats, and Companion Stack.',
      'Smooth horizontal scroll with sticky row headers for clear visibility on any screen resolution.',
      'Highlights mutual exclusivity conflicts and provides 1-click terminal installation per column.',
    ],
    primaryAction: {
      label: 'Compare Libraries Side-by-Side',
      command: 'skillforge.compareSkills',
    },
  },
  {
    number: 5,
    id: 'agent-skills',
    title: 'Agent Skill Directives & BYOK AI Providers',
    badge: 'Agentic AI Ready',
    summary:
      'Turn any recommended library or framework into a validated AI coding agent directive (SKILL.md, .cursor/rules/*.mdc, or AGENTS.md) with 1 click.',
    bullets: [
      'Embeds Andrej Karpathy\'s 4 Coding Disciplines (Think Before Coding, Simplicity First, Surgical Precision, Verification Rigor).',
      'Includes category-specific architectural best practices, anti-patterns to avoid, and CLI verification commands.',
      'Optional BYOK AI enrichment (OpenAI / Google Gemini) with OS Keychain SecretStorage and automatic local fallback.',
    ],
    primaryAction: {
      label: 'Generate Agent Skill Directive',
      command: 'skillforge.generateAgentSkill',
    },
    secondaryAction: {
      label: 'Configure AI Provider (Local / BYOK)',
      command: 'skillforge.configureProvider',
    },
  },
];

/**
 * Generates HTML for the interactive SkillForge Welcome Walkthrough Webview.
 */
export function generateWalkthroughHtml(options: WalkthroughHtmlOptions): string {
  const { nonce, cspSource } = options;

  const stepsHtml = WALKTHROUGH_STEPS.map((step) => {
    const bulletsHtml = step.bullets
      .map(
        (b) =>
          `<li><span class="sf-icon sf-icon-sm sf-step-check">${ICON_CHECK}</span><span>${escapeHtml(b)}</span></li>`
      )
      .join('');

    const codeBlock = step.codeExample
      ? `<div class="sf-step-code"><code>${escapeHtml(step.codeExample)}</code></div>`
      : '';

    const secondaryBtn = step.secondaryAction
      ? `<button class="sf-btn sf-btn-secondary sf-cmd-btn" data-command="${escapeHtml(step.secondaryAction.command)}">
          ${escapeHtml(step.secondaryAction.label)}
         </button>`
      : '';

    return `
      <div class="sf-walkthrough-step" id="step-${escapeHtml(step.id)}">
        <div class="sf-step-number-col">
          <div class="sf-step-badge-num">${step.number}</div>
          <div class="sf-step-connector"></div>
        </div>
        <div class="sf-step-body">
          <div class="sf-step-header">
            <h2 class="sf-step-title">${escapeHtml(step.title)}</h2>
            <span class="sf-pill">${escapeHtml(step.badge)}</span>
          </div>
          <p class="sf-step-summary">${escapeHtml(step.summary)}</p>
          <ul class="sf-step-bullets">
            ${bulletsHtml}
          </ul>
          ${codeBlock}
          <div class="sf-step-actions">
            <button class="sf-btn sf-btn-primary sf-cmd-btn" data-command="${escapeHtml(step.primaryAction.command)}">
              ${escapeHtml(step.primaryAction.label)}
            </button>
            ${secondaryBtn}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${cspSource} https: data:; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; font-src ${cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SkillForge</title>
  <style nonce="${nonce}">
    ${WEBVIEW_STYLES}

    .sf-walkthrough-container {
      max-width: 920px;
      margin: 0 auto;
      padding-bottom: 40px;
    }

    .sf-hero {
      background: var(--sf-card-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .sf-hero-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }

    .sf-hero-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sf-hero-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--sf-fg);
    }

    .sf-hero-subtitle {
      font-size: 13.5px;
      color: var(--sf-muted-fg);
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .sf-shortcut-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      padding-top: 14px;
      border-top: 1px solid var(--sf-card-border);
    }

    .sf-shortcut-card {
      background: var(--sf-code-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .sf-shortcut-key {
      font-family: var(--sf-mono-font);
      font-size: 11.5px;
      font-weight: 600;
      color: var(--sf-verified-color);
    }

    .sf-shortcut-desc {
      font-size: 11.5px;
      color: var(--sf-muted-fg);
    }

    .sf-steps-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sf-walkthrough-step {
      display: flex;
      gap: 16px;
      background: var(--sf-card-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 8px;
      padding: 20px;
      transition: border-color 0.15s ease;
    }

    .sf-walkthrough-step:hover {
      border-color: var(--sf-card-hover-border);
    }

    .sf-step-number-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .sf-step-badge-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--sf-btn-primary-bg);
      color: var(--sf-btn-primary-fg);
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sf-step-body {
      flex: 1;
      min-width: 0;
    }

    .sf-step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    .sf-step-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--sf-fg);
    }

    .sf-step-summary {
      font-size: 13px;
      color: var(--sf-fg);
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .sf-step-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .sf-step-bullets li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12.5px;
      color: var(--sf-muted-fg);
    }

    .sf-step-check {
      color: var(--sf-verified-color);
      margin-top: 2px;
    }

    .sf-step-code {
      background: var(--sf-code-bg);
      border: 1px solid var(--sf-card-border);
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 14px;
      font-family: var(--sf-mono-font);
      font-size: 12px;
      overflow-x: auto;
    }

    .sf-step-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
  </style>
</head>
<body>
  <div class="sf-walkthrough-container">
    <div class="sf-hero">
      <div class="sf-hero-top">
        <div class="sf-hero-brand">
          <span class="sf-brand-logo">${ICON_FORGE}</span>
          <h1 class="sf-hero-title">Welcome to SkillForge</h1>
        </div>
        <span class="sf-trust-seal sf-seal-verified">
          <span class="sf-icon sf-icon-sm">${ICON_CHECK}</span>
          Catalog Verified • 100% Offline Ready
        </span>
      </div>
      <p class="sf-hero-subtitle">
        Your cross-IDE developer skill compass. Discover battle-tested libraries, compare architectures side-by-side, and generate verified AI agent skill directives (<code>SKILL.md</code> / <code>.mdc</code> / <code>AGENTS.md</code>) right from your workspace.
      </p>
      <div class="sf-shortcut-grid">
        <div class="sf-shortcut-card">
          <span class="sf-shortcut-key">Status Bar (Bottom Right)</span>
          <span class="sf-shortcut-desc">Click <strong>SkillForge</strong> in the status bar anytime for 1-click discovery</span>
        </div>
        <div class="sf-shortcut-card">
          <span class="sf-shortcut-key">Ctrl+Alt+S / Cmd+Alt+S</span>
          <span class="sf-shortcut-desc">Global shortcut to suggest libraries &amp; skills for your idea</span>
        </div>
        <div class="sf-shortcut-card">
          <span class="sf-shortcut-key">Ctrl+Alt+F / Editor Tab Icon</span>
          <span class="sf-shortcut-desc">Instant recommendations tailored to your active code file</span>
        </div>
        <div class="sf-shortcut-card">
          <span class="sf-shortcut-key">// skillforge: &lt;intent&gt;</span>
          <span class="sf-shortcut-desc">Write an inline comment to trigger a 1-click CodeLens prompt</span>
        </div>
      </div>
    </div>

    <div class="sf-steps-list">
      ${stepsHtml}
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    document.querySelectorAll('.sf-cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const command = btn.getAttribute('data-command');
        if (command) {
          vscode.postMessage({ type: 'executeCommand', command });
        }
      });
    });
  </script>
</body>
</html>`;
}
