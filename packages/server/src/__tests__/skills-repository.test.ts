import { describe, it, expect, beforeEach } from 'vitest';
import { SkillsRepository } from '../data/skills-repository.js';

describe('SkillsRepository', () => {
  let repository: SkillsRepository;

  beforeEach(() => {
    repository = new SkillsRepository();
  });

  it('loads the curated dataset with at least 100 verified skills', () => {
    expect(repository.count).toBeGreaterThanOrEqual(100);
    const all = repository.getAllSkills();
    expect(all.length).toBe(repository.count);
  });

  it('retrieves skills by exact ID in O(1)', () => {
    const react = repository.getSkillById('react');
    expect(react).toBeDefined();
    expect(react?.name).toBe('React');
    expect(react?.category).toBe('frontend-framework');

    const postgres = repository.getSkillById('postgresql');
    expect(postgres).toBeDefined();
    expect(postgres?.name).toBe('PostgreSQL');
    expect(postgres?.category).toBe('database');

    const unknown = repository.getSkillById('unknown-nonexistent-skill');
    expect(unknown).toBeUndefined();
  });

  it('retrieves skills grouped by category', () => {
    const frontendFrameworks = repository.getSkillsByCategory('frontend-framework');
    expect(frontendFrameworks.length).toBeGreaterThanOrEqual(5);
    const ids = frontendFrameworks.map((s) => s.id);
    expect(ids).toContain('react');
    expect(ids).toContain('vue');
    expect(ids).toContain('svelte');

    const databases = repository.getSkillsByCategory('database');
    expect(databases.length).toBeGreaterThanOrEqual(5);
    const dbIds = databases.map((s) => s.id);
    expect(dbIds).toContain('postgresql');
    expect(dbIds).toContain('mongodb');
    expect(dbIds).toContain('redis');
  });

  it('retrieves skills by tag lookup', () => {
    const websocketSkills = repository.getSkillsByTag('websocket');
    expect(websocketSkills.length).toBeGreaterThan(0);
    const ids = websocketSkills.map((s) => s.id);
    expect(ids).toContain('socket-io');

    const ormSkills = repository.getSkillsByTag('orm');
    expect(ormSkills.length).toBeGreaterThan(0);
    const ormIds = ormSkills.map((s) => s.id);
    expect(ormIds).toContain('prisma');
  });

  it('searches for real-time chat and ranks Socket.io top', () => {
    const results = repository.search('real-time chat application');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.skill.id).toBe('socket-io');
    expect(results[0]?.score).toBeGreaterThan(0);
    expect(results[0]?.matchReasons.length).toBeGreaterThan(0);
  });

  it('searches for python api backend and ranks FastAPI or Django', () => {
    const results = repository.search('python fast api backend');
    expect(results.length).toBeGreaterThan(0);
    const topIds = results.slice(0, 3).map((r) => r.skill.id);
    expect(topIds).toContain('fastapi');
  });

  it('searches for database orm with category filter', () => {
    const results = repository.search('orm database', {
      category: 'orm',
      maxResults: 3,
    });
    expect(results.length).toBeLessThanOrEqual(3);
    for (const item of results) {
      expect(item.skill.category).toBe('orm');
    }
  });

  it('returns empty array for empty search queries', () => {
    expect(repository.search('')).toHaveLength(0);
    expect(repository.search('   ')).toHaveLength(0);
    expect(repository.search('\t\n  ')).toHaveLength(0);
  });

  it('handles hostile regex tokens (c++, c#, (react)?, *, []) without throwing (BUG-01)', () => {
    // These queries previously threw SyntaxError: Invalid regular expression: /\bc++\b/i: Nothing to repeat
    expect(() => repository.search('build a c++ backend')).not.toThrow();
    expect(() => repository.search('c# web api framework')).not.toThrow();
    expect(() => repository.search('(react)? [tool] * + $ ^')).not.toThrow();

    const cppResults = repository.search('c++ backend');
    expect(Array.isArray(cppResults)).toBe(true);

    const regexResults = repository.search('(react)? [tool] * +');
    expect(Array.isArray(regexResults)).toBe(true);
  });

  it('retrieves skills by package stack indicators (BUG-02)', () => {
    expect(repository.getSkillByIndicator('next')?.id).toBe('nextjs');
    expect(repository.getSkillByIndicator('tailwindcss')?.id).toBe('tailwind-css');
    expect(repository.getSkillByIndicator('@angular/core')?.id).toBe('angular');
    expect(repository.getSkillByIndicator('solid-js')?.id).toBe('solidjs');
    expect(repository.getSkillByIndicator('unknown-package-xyz')).toBeUndefined();
  });
});

