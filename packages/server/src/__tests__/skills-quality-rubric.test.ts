import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { validateSkillsArray, type Skill } from '@skillforge/shared';

describe('Skills Quality & Purpose Rubric Verification', () => {
  const skillsPath = path.resolve(__dirname, '../data/skills.json');
  const rawData = fs.readFileSync(skillsPath, 'utf8');
  const skills: Skill[] = JSON.parse(rawData);

  it('validates that entire catalog has at least 350 curated skills', () => {
    expect(skills.length).toBeGreaterThanOrEqual(350);
  });

  it('passes strict Zod runtime schema validation without duplicate IDs', () => {
    expect(() => validateSkillsArray(skills)).not.toThrow();
  });

  it('enforces that every skill has a purposeful, non-fluff "whyUseIt" explanation', () => {
    const fillerPatterns = [
      /\bwork as\b/i,
      /\bact as\b/i,
      /\byou have to\b/i,
      /\ba good tool\b/i,
      /\ba nice tool\b/i,
      /\ba useful tool\b/i,
      /\blorem ipsum\b/i,
      /\btodo\b/i,
    ];

    for (const skill of skills) {
      expect(skill.whyUseIt.length, `Skill "${skill.id}" whyUseIt must be >= 30 chars`).toBeGreaterThanOrEqual(30);

      for (const pattern of fillerPatterns) {
        expect(
          pattern.test(skill.whyUseIt),
          `Skill "${skill.id}" whyUseIt contains filler pattern ${pattern}: "${skill.whyUseIt}"`
        ).toBe(false);
      }
    }
  });

  it('enforces valid, real package identifiers in stackIndicators', () => {
    for (const skill of skills) {
      expect(skill.stackIndicators.length, `Skill "${skill.id}" must have stackIndicators`).toBeGreaterThan(0);
      for (const indicator of skill.stackIndicators) {
        // Stack indicator must not have leading/trailing whitespace or spaces inside package name
        expect(indicator.trim()).toBe(indicator);
        expect(indicator.length).toBeGreaterThan(0);
        // Should not be a sentence or have generic punctuation
        expect(indicator).not.toMatch(/[!;?]/);
      }
    }
  });

  it('enforces valid HTTPS documentation URLs and learning resources', () => {
    for (const skill of skills) {
      expect(skill.officialUrl.startsWith('https://'), `Skill "${skill.id}" officialUrl must use HTTPS: ${skill.officialUrl}`).toBe(true);
      expect(skill.learnResources.length, `Skill "${skill.id}" must have >= 1 learning resource`).toBeGreaterThanOrEqual(1);

      for (const res of skill.learnResources) {
        expect(res.url.startsWith('https://'), `Skill "${skill.id}" resource "${res.label}" must use HTTPS: ${res.url}`).toBe(true);
        expect(res.label.trim().length, `Resource label in "${skill.id}" cannot be empty`).toBeGreaterThan(0);
      }
    }
  });

  it('verifies that alternatives do not contain self-references', () => {
    for (const skill of skills) {
      expect(skill.alternatives.includes(skill.id), `Skill "${skill.id}" cannot list itself as an alternative`).toBe(false);
    }
  });

  it('covers all major ecosystems (javascript, python, rust, go, java, mobile)', () => {
    const ecosystems = new Set(skills.map((s) => s.ecosystem));
    expect(ecosystems.has('javascript')).toBe(true);
    expect(ecosystems.has('python')).toBe(true);
    expect(ecosystems.has('rust')).toBe(true);
    expect(ecosystems.has('go')).toBe(true);
    expect(ecosystems.has('java')).toBe(true);
    expect(ecosystems.has('multi')).toBe(true);

    const mobileCount = skills.filter((s) => s.category === 'mobile').length;
    expect(mobileCount, 'Mobile skills category should have >= 20 skills').toBeGreaterThanOrEqual(20);

    const pythonCount = skills.filter((s) => s.ecosystem === 'python').length;
    expect(pythonCount, 'Python ecosystem should have >= 50 skills').toBeGreaterThanOrEqual(50);
  });
});
