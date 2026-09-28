import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('vscode', () => ({
  EventEmitter: class {
    event = vi.fn();
    fire = vi.fn();
  },
}));

import type * as vscode from 'vscode';
import { SecretManager } from '../secrets/secret-manager.js';

class MockSecretStorage implements vscode.SecretStorage {
  private secrets = new Map<string, string>();
  public readonly onDidChange = vi.fn() as any;

  async get(key: string): Promise<string | undefined> {
    return this.secrets.get(key);
  }

  async store(key: string, value: string): Promise<void> {
    this.secrets.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.secrets.delete(key);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.secrets.keys());
  }
}

describe('SecretManager', () => {
  let mockStorage: MockSecretStorage;
  let manager: SecretManager;

  beforeEach(() => {
    mockStorage = new MockSecretStorage();
    manager = new SecretManager(mockStorage);
  });

  it('stores and retrieves OpenAI API key with whitespace trimming', async () => {
    await manager.storeApiKey('openai', '  sk-test-key-12345  ');
    const retrieved = await manager.getApiKey('openai');
    expect(retrieved).toBe('sk-test-key-12345');
    expect(await manager.hasApiKey('openai')).toBe(true);
  });

  it('stores and retrieves Gemini API key', async () => {
    await manager.storeApiKey('gemini', 'AIzaSy-gemini-key');
    const retrieved = await manager.getApiKey('gemini');
    expect(retrieved).toBe('AIzaSy-gemini-key');
    expect(await manager.hasApiKey('gemini')).toBe(true);
  });

  it('returns undefined for local provider without querying storage', async () => {
    const key = await manager.getApiKey('local');
    expect(key).toBeUndefined();
    expect(await manager.hasApiKey('local')).toBe(false);
  });

  it('deletes stored API keys properly', async () => {
    await manager.storeApiKey('openai', 'sk-delete-me');
    expect(await manager.hasApiKey('openai')).toBe(true);

    await manager.deleteApiKey('openai');
    expect(await manager.hasApiKey('openai')).toBe(false);
    expect(await manager.getApiKey('openai')).toBeUndefined();
  });

  it('reports hasApiKey as false when key is missing or empty string', async () => {
    expect(await manager.hasApiKey('gemini')).toBe(false);

    await manager.storeApiKey('gemini', '   ');
    expect(await manager.hasApiKey('gemini')).toBe(false);
  });
});
