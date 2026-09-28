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
    }
  | {
      type: 'submitFeedback';
      rating: 'helpful' | 'unhelpful';
      reason?: string;
      details?: string;
      query: string;
      skillId?: string;
    }
  | {
      type: 'requestSkill';
      prefillName?: string;
    }
  | {
      type: 'toggleBookmark';
      skillId: string;
      skillName: string;
      ecosystem?: string;
      category?: string;
    }
  | {
      type: 'compareSkills';
      skillIds: string[];
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
