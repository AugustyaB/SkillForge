import type { SkillSuggestionResult } from '@skillforge/shared';

/**
 * Messages sent from the Webview (DOM context) to the Extension Host.
 */
export type WebviewToHostMessage =
  | {
      type: 'runInstall';
      packageName: string;
      ecosystem?: string;
    }
  | {
      type: 'copyCommand';
      command: string;
    }
  | {
      type: 'openExternal';
      url: string;
    }
  | {
      type: 'reQuery';
      intent: string;
    };

/**
 * Messages sent from the Extension Host to the Webview.
 */
export type HostToWebviewMessage =
  | {
      type: 'renderSuggestions';
      payload: SkillSuggestionResult;
      scopeLabel: string;
      scopePath: string;
    }
  | {
      type: 'setLoading';
      isLoading: boolean;
      intent?: string;
    }
  | {
      type: 'showError';
      message: string;
    };
