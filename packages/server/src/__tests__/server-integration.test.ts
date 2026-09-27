import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PassThrough } from 'node:stream';
import {
  createConnection,
  createProtocolConnection,
  StreamMessageReader,
  StreamMessageWriter,
  InitializeRequest,
  type ProtocolConnection,
} from 'vscode-languageserver/node.js';
import { SkillForgeServer } from '../server.js';
import {
  SKILLFORGE_PING_METHOD,
  SKILLFORGE_SUGGEST_METHOD,
  type PingResult,
  type SkillSuggestionParams,
  type SkillSuggestionResult,
} from '@skillforge/shared';

describe('SkillForge Headless LSP Server Integration', () => {
  let clientIn: PassThrough;
  let clientOut: PassThrough;
  let serverIn: PassThrough;
  let serverOut: PassThrough;
  let clientConn: ProtocolConnection;
  let server: SkillForgeServer;

  beforeEach(() => {
    // Pipe streams:
    // clientOut -> serverIn
    // serverOut -> clientIn
    clientOut = new PassThrough();
    serverIn = new PassThrough();
    clientOut.pipe(serverIn);

    serverOut = new PassThrough();
    clientIn = new PassThrough();
    serverOut.pipe(clientIn);

    // Initialize server connection
    const serverConn = createConnection(serverIn, serverOut);
    server = new SkillForgeServer(serverConn);
    server.listen();

    // Initialize client connection
    clientConn = createProtocolConnection(
      new StreamMessageReader(clientIn),
      new StreamMessageWriter(clientOut)
    );
    clientConn.listen();
  });

  afterEach(() => {
    // Remove the default process.exit listeners on stream close
    serverIn.removeAllListeners('close');
    serverOut.removeAllListeners('close');
    clientIn.removeAllListeners('close');
    clientOut.removeAllListeners('close');

    server.dispose();
    clientConn.dispose();
  });

  it('handles initialize lifecycle and returns server capabilities', async () => {
    const initParams = {
      processId: process.pid,
      rootUri: null,
      capabilities: {},
    };

    const result = await clientConn.sendRequest(InitializeRequest.type, initParams);

    expect(result.capabilities).toBeDefined();
    expect(result.capabilities.textDocumentSync).toBe(2); // Incremental = 2
    expect(result.serverInfo?.name).toBe('skillforge-lsp-server');
    expect(result.serverInfo?.version).toBe('0.1.0');
  });

  it('handles custom skillforge/ping request', async () => {
    const ping = await clientConn.sendRequest<PingResult>(SKILLFORGE_PING_METHOD);

    expect(ping.status).toBe('ok');
    expect(ping.version).toBe('0.1.0');
    expect(typeof ping.timestamp).toBe('number');
  });

  it('handles skillforge/suggest for a matching intent (chat app)', async () => {
    const params: SkillSuggestionParams = {
      intent: 'I want to build a real-time chat application',
      options: { maxResults: 3 },
    };

    const result = await clientConn.sendRequest<SkillSuggestionResult>(
      SKILLFORGE_SUGGEST_METHOD,
      params
    );

    expect(result.queryEcho).toBe('I want to build a real-time chat application');
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.timings.localMs).toBeGreaterThanOrEqual(0);

    const hasSocketIo = result.skills.some((s) => s.id === 'socket-io');
    expect(hasSocketIo).toBe(true);

    const socketSkill = result.skills.find((s) => s.id === 'socket-io');
    expect(socketSkill?.trustTier).toBe('verified');
    expect(socketSkill?.confidence).toBeGreaterThan(0.8);
  });

  it('handles skillforge/suggest for REST API intent', async () => {
    const params: SkillSuggestionParams = {
      intent: 'REST API backend',
    };

    const result = await clientConn.sendRequest<SkillSuggestionResult>(
      SKILLFORGE_SUGGEST_METHOD,
      params
    );

    expect(result.skills.length).toBeGreaterThan(0);
    const hasExpress = result.skills.some((s) => s.id === 'express');
    expect(hasExpress).toBe(true);
  });

  it('handles skillforge/suggest with empty intent gracefully', async () => {
    const params: SkillSuggestionParams = {
      intent: '   ',
    };

    const result = await clientConn.sendRequest<SkillSuggestionResult>(
      SKILLFORGE_SUGGEST_METHOD,
      params
    );

    expect(result.skills).toHaveLength(0);
    expect(result.queryEcho).toBe('');
  });
});
