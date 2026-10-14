import { describe, it, expect } from 'vitest';
import {
  parseCommentLine,
  parseDocumentComments,
} from '../providers/comment-parser.js';

describe('CommentParser', () => {
  describe('parseCommentLine', () => {
    it('parses C-style // IDEA: comment line', () => {
      const line = '  // IDEA: real-time chat with websockets  ';
      const parsed = parseCommentLine(line, 5);

      expect(parsed).toBeDefined();
      expect(parsed?.lineNumber).toBe(5);
      expect(parsed?.keyword).toBe('IDEA');
      expect(parsed?.intent).toBe('real-time chat with websockets');
      expect(parsed?.startCharacter).toBeGreaterThan(0);
      expect(parsed?.endCharacter).toBeGreaterThan(parsed!.startCharacter);
    });

    it('parses C-style // SKILL: comment line', () => {
      const line = '// SKILL: state management for react';
      const parsed = parseCommentLine(line, 12);

      expect(parsed).toBeDefined();
      expect(parsed?.keyword).toBe('SKILL');
      expect(parsed?.intent).toBe('state management for react');
    });

    it('parses Python / Shell # IDEA: comment line', () => {
      const line = '# IDEA: fastapi rest api with jwt auth';
      const parsed = parseCommentLine(line, 0);

      expect(parsed).toBeDefined();
      expect(parsed?.keyword).toBe('IDEA');
      expect(parsed?.intent).toBe('fastapi rest api with jwt auth');
    });

    it('parses Python / Shell # SKILL: comment line', () => {
      const line = '# SKILL: machine learning embeddings';
      const parsed = parseCommentLine(line, 1);

      expect(parsed).toBeDefined();
      expect(parsed?.keyword).toBe('SKILL');
      expect(parsed?.intent).toBe('machine learning embeddings');
    });

    it('handles hostile regex tokens in comments (c++, c#, brackets, asterisks)', () => {
      const line = '  // IDEA:   build a c++ backend with [axum] * ?  ';
      const parsed = parseCommentLine(line, 42);

      expect(parsed).toBeDefined();
      expect(parsed?.intent).toBe('build a c++ backend with [axum] * ?');
    });

    it('ignores comments with empty or whitespace-only intent', () => {
      expect(parseCommentLine('// IDEA:', 0)).toBeNull();
      expect(parseCommentLine('// IDEA:    ', 0)).toBeNull();
      expect(parseCommentLine('# SKILL: \t ', 0)).toBeNull();
    });

    it('ignores normal code comments and non-trigger words', () => {
      expect(parseCommentLine('// Just a normal comment', 0)).toBeNull();
      expect(parseCommentLine('// IDEATION: something else', 0)).toBeNull();
      expect(parseCommentLine('# TODO: fix later', 0)).toBeNull();
      expect(parseCommentLine('const idea = "my idea";', 0)).toBeNull();
    });

    it('rejects Python floor division operations and inline strings (Anti-Happy-Path)', () => {
      // Floor division must never trigger CodeLens
      expect(parseCommentLine('x = a // b', 0)).toBeNull();
      expect(parseCommentLine('val = count // 2  # integer divide', 0)).toBeNull();
      expect(parseCommentLine('const ratio = total // step;', 0)).toBeNull();

      // URLs and hex colors must never trigger CodeLens
      expect(parseCommentLine('const url = "https://example.com/api";', 0)).toBeNull();
      expect(parseCommentLine('const color = "#18181b";', 0)).toBeNull();
    });

    it('parses deeply indented Python # IDEA: comments correctly', () => {
      const line = '        # IDEA: async postgres connection pool with alembic';
      const parsed = parseCommentLine(line, 14);

      expect(parsed).toBeDefined();
      expect(parsed?.keyword).toBe('IDEA');
      expect(parsed?.intent).toBe('async postgres connection pool with alembic');
      expect(parsed?.lineNumber).toBe(14);
    });

    it('handles mixed casing (// idea: and // Skill:)', () => {
      const parsed1 = parseCommentLine('// idea: lowercase keyword', 0);
      expect(parsed1?.keyword).toBe('IDEA');
      expect(parsed1?.intent).toBe('lowercase keyword');

      const parsed2 = parseCommentLine('# Skill: capitalized keyword', 0);
      expect(parsed2?.keyword).toBe('SKILL');
      expect(parsed2?.intent).toBe('capitalized keyword');
    });
  });

  describe('parseDocumentComments', () => {
    it('scans document lines and extracts all matching triggers up to limit', () => {
      const lines = [
        'import React from "react";',
        '// IDEA: auth library with google login',
        'export function App() {',
        '  // Some regular comment',
        '  // SKILL: charting and data visualization',
        '  return <div>Hello</div>;',
        '}',
      ];

      const triggers = parseDocumentComments(lines, 10);
      expect(triggers).toHaveLength(2);
      expect(triggers[0]?.intent).toBe('auth library with google login');
      expect(triggers[0]?.lineNumber).toBe(1);
      expect(triggers[1]?.intent).toBe('charting and data visualization');
      expect(triggers[1]?.lineNumber).toBe(4);
    });

    it('caps extracted triggers at maxLenses to preserve performance', () => {
      const lines = Array.from({ length: 20 }, (_, i) => `// IDEA: task ${i}`);
      const triggers = parseDocumentComments(lines, 5);
      expect(triggers).toHaveLength(5);
    });
  });
});
