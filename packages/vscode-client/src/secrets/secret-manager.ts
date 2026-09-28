import * as vscode from 'vscode';
import type { ProviderType } from '@skillforge/shared';

/**
 * SecretManager — Securely stores and retrieves BYOK API keys using VS Code's SecretStorage
 * (backed by macOS Keychain, Windows Credential Manager, and Linux Secret Service / libsecret).
 *
 * Keys are never written to disk or settings.json in plain text.
 */
export class SecretManager {
  private secretStorage: vscode.SecretStorage;

  constructor(secretStorage: vscode.SecretStorage) {
    this.secretStorage = secretStorage;
  }

  public static getSecretKey(provider: ProviderType): string {
    return `skillforge.apiKey.${provider}`;
  }

  /**
   * Retrieves stored API key for the specified provider from OS keychain.
   */
  public async getApiKey(provider: ProviderType): Promise<string | undefined> {
    if (provider === 'local') {
      return undefined;
    }
    return this.secretStorage.get(SecretManager.getSecretKey(provider));
  }

  /**
   * Stores an API key in the OS keychain.
   */
  public async storeApiKey(provider: ProviderType, apiKey: string): Promise<void> {
    await this.secretStorage.store(
      SecretManager.getSecretKey(provider),
      apiKey.trim()
    );
  }

  /**
   * Removes an API key from the OS keychain.
   */
  public async deleteApiKey(provider: ProviderType): Promise<void> {
    await this.secretStorage.delete(SecretManager.getSecretKey(provider));
  }

  /**
   * Checks whether an API key is present for the specified provider.
   */
  public async hasApiKey(provider: ProviderType): Promise<boolean> {
    const key = await this.getApiKey(provider);
    return typeof key === 'string' && key.trim().length > 0;
  }
}
