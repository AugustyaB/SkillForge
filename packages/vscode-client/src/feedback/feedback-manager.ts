import * as vscode from 'vscode';
import type { FeedbackPayload, SkillRequestPayload } from '@skillforge/shared';

export interface FeedbackCadenceState {
  queryCount: number;
  lastFeedbackTimestamp?: number;
  feedbackHistory: FeedbackPayload[];
  skillRequests: SkillRequestPayload[];
}

/**
 * Manages periodic low-frequency feedback cadence, local rating persistence in globalState,
 * cooldown suppression, and prefilled issue URL generation.
 */
export class FeedbackManager {
  public static readonly STORAGE_KEY = 'skillforge.feedback.state';
  public static readonly CADENCE_INTERVAL = 5;
  public static readonly COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

  private memento: vscode.Memento;

  constructor(memento: vscode.Memento) {
    this.memento = memento;
  }

  private getState(): FeedbackCadenceState {
    const raw = this.memento.get<FeedbackCadenceState>(FeedbackManager.STORAGE_KEY);
    return {
      queryCount: typeof raw?.queryCount === 'number' ? raw.queryCount : 0,
      lastFeedbackTimestamp: raw?.lastFeedbackTimestamp,
      feedbackHistory: Array.isArray(raw?.feedbackHistory) ? raw.feedbackHistory : [],
      skillRequests: Array.isArray(raw?.skillRequests) ? raw.skillRequests : [],
    };
  }

  private async saveState(state: FeedbackCadenceState): Promise<void> {
    await this.memento.update(FeedbackManager.STORAGE_KEY, state);
  }

  /**
   * Increments query count and returns whether feedback prompt should be shown.
   */
  public async registerQuery(fallbackUsed: boolean = false): Promise<boolean> {
    const state = this.getState();
    state.queryCount += 1;
    await this.saveState(state);

    return this.shouldShowFeedback(fallbackUsed);
  }

  /**
   * Checks whether feedback prompt should be rendered for the current query.
   */
  public shouldShowFeedback(fallbackUsed: boolean = false): boolean {
    const state = this.getState();
    const now = Date.now();

    // If user provided feedback within cooldown period (24 hours), do not prompt
    if (state.lastFeedbackTimestamp && now - state.lastFeedbackTimestamp < FeedbackManager.COOLDOWN_MS) {
      return false;
    }

    // Always offer feedback on fallback cascade (zero match), or on every CADENCE_INTERVAL query
    if (fallbackUsed) {
      return true;
    }

    return state.queryCount > 0 && state.queryCount % FeedbackManager.CADENCE_INTERVAL === 0;
  }

  /**
   * Records a user rating (helpful / unhelpful with 1-click reason or details).
   * Resets query count and enters cooldown.
   */
  public async recordFeedback(payload: FeedbackPayload): Promise<void> {
    const state = this.getState();
    state.feedbackHistory.push(payload);
    state.lastFeedbackTimestamp = payload.timestamp || Date.now();
    state.queryCount = 0; // Reset cadence
    await this.saveState(state);
  }

  /**
   * Records a user skill contribution request into local storage.
   */
  public async recordSkillRequest(payload: SkillRequestPayload): Promise<void> {
    const state = this.getState();
    state.skillRequests.push(payload);
    await this.saveState(state);
  }

  /**
   * Generates a pre-filled GitHub issue URL for a skill contribution request.
   */
  public generateSkillRequestIssueUrl(skillName: string, reason?: string): string {
    const repo = 'https://github.com/AugustyaB/SkillForge/issues/new';
    const title = encodeURIComponent(`[Skill Request]: ${skillName.trim()}`);
    const bodyText = `### Requested Library / Skill\n**Name**: ${skillName.trim()}\n\n### Why should it be added to the offline catalog?\n${reason ? reason.trim() : 'Widely adopted tool in modern development.'}\n\n---\n*Submitted via SkillForge Extension*`;
    const body = encodeURIComponent(bodyText);
    const labels = encodeURIComponent('skill-request');
    return `${repo}?title=${title}&body=${body}&labels=${labels}`;
  }

  public getFeedbackHistory(): FeedbackPayload[] {
    return this.getState().feedbackHistory;
  }

  public getSkillRequests(): SkillRequestPayload[] {
    return this.getState().skillRequests;
  }

  public async clear(): Promise<void> {
    await this.memento.update(FeedbackManager.STORAGE_KEY, undefined);
  }
}
