import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { type Skill } from '@skillforge/shared';

describe('Database Graph Invariants & Topology Verification (DB-v1.1 Certified)', () => {
  const skillsPath = path.resolve(__dirname, '../data/skills.json');
  const rawData = fs.readFileSync(skillsPath, 'utf8');
  const skills: Skill[] = JSON.parse(rawData);
  const idSet = new Set(skills.map((s) => s.id));
  const skillMap = new Map(skills.map((s) => [s.id, s]));

  it('Invariant 1 (Non-Reflexivity): zero skills list themselves in alternatives or worksWellWith', () => {
    for (const skill of skills) {
      expect(
        skill.alternatives.includes(skill.id),
        `Skill "${skill.id}" lists itself in alternatives`
      ).toBe(false);

      expect(
        skill.worksWellWith.includes(skill.id),
        `Skill "${skill.id}" lists itself in worksWellWith`
      ).toBe(false);
    }
  });

  it('Invariant 2 (Bidirectional Symmetry): all internal alternatives link both ways reciprocally', () => {
    const asymmetricPairs: string[] = [];

    for (const skill of skills) {
      for (const alt of skill.alternatives) {
        if (idSet.has(alt) && alt !== skill.id) {
          const target = skillMap.get(alt);
          if (!target || !target.alternatives.includes(skill.id)) {
            asymmetricPairs.push(`"${skill.id}" -> "${alt}" but "${alt}" lacks "${skill.id}"`);
          }
        }
      }
    }

    expect(
      asymmetricPairs,
      `Found asymmetric alternative pairs:\n${asymmetricPairs.join('\n')}`
    ).toHaveLength(0);
  });

  it('Invariant 3 (Alias Cleanliness): zero forbidden aliases or shorthands exist in catalog references', () => {
    const forbiddenAliases = new Set([
      'rails',
      'uv',
      'tower',
      'sqlx',
      'dependabot',
      'depcheck',
      'serde_json',
      'semantic-release',
      'asynq',
      'crossbeam',
      'locust',
      'quill',
      'slate',
      'mdx',
      'workerpool',
      'minikube',
      'outlines',
      'sphinx',
    ]);

    const violations: string[] = [];

    for (const skill of skills) {
      for (const alt of skill.alternatives) {
        if (forbiddenAliases.has(alt)) {
          violations.push(`Skill "${skill.id}" references forbidden alias in alternatives: "${alt}"`);
        }
      }
      for (const w of skill.worksWellWith) {
        if (forbiddenAliases.has(w)) {
          violations.push(`Skill "${skill.id}" references forbidden alias in worksWellWith: "${w}"`);
        }
      }
    }

    expect(
      violations,
      `Found forbidden alias violations:\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('Invariant 4 (Acyclic Prerequisites): prerequisite DAG contains zero circular deadlock loops', () => {
    for (const skill of skills) {
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      function checkCycle(currentId: string, pathChain: string[]): boolean {
        if (recursionStack.has(currentId)) {
          throw new Error(`Circular prerequisite loop detected: ${pathChain.join(' -> ')} -> ${currentId}`);
        }
        if (visited.has(currentId)) return false;

        visited.add(currentId);
        recursionStack.add(currentId);

        const currentSkill = skillMap.get(currentId);
        if (currentSkill) {
          for (const prereq of currentSkill.prerequisites) {
            if (idSet.has(prereq)) {
              checkCycle(prereq, [...pathChain, currentId]);
            }
          }
        }

        recursionStack.delete(currentId);
        return false;
      }

      expect(() => checkCycle(skill.id, [])).not.toThrow();
    }
  });

  it('Invariant 5 (Pruned Dead-End Builtins): zero language built-ins or dead frameworks exist in alternatives', () => {
    const deadOrBuiltinList = new Set([
      'child_process',
      'fs.watch',
      'json',
      'json-stringify-safe',
      'curses',
      'argparse',
      'enzyme',
      'easymock',
      'cordova',
    ]);

    for (const skill of skills) {
      for (const alt of skill.alternatives) {
        expect(
          deadOrBuiltinList.has(alt),
          `Skill "${skill.id}" still contains dead/builtin alternative: "${alt}"`
        ).toBe(false);
      }
    }
  });

  it('Invariant 6 (Mutual Exclusivity — Utility Fitness Rubric): zero skills have overlapping alternatives and worksWellWith', () => {
    const violations: string[] = [];

    for (const skill of skills) {
      const overlap = skill.alternatives.filter((alt) =>
        skill.worksWellWith.includes(alt)
      );
      if (overlap.length > 0) {
        violations.push(
          `Skill "${skill.id}" has contradictory overlap in both alternatives and worksWellWith: ${overlap.join(', ')}`
        );
      }
    }

    expect(
      violations,
      `Found contradictory relationship overlaps:\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('Invariant 7 (Universal Reachability — Zero Isolated Islands): every skill has at least one inbound recommendation link', () => {
    const inDegree = new Map<string, number>();
    for (const id of idSet) inDegree.set(id, 0);

    for (const skill of skills) {
      for (const alt of skill.alternatives) {
        if (idSet.has(alt)) {
          inDegree.set(alt, (inDegree.get(alt) || 0) + 1);
        }
      }
      for (const w of skill.worksWellWith) {
        if (idSet.has(w)) {
          inDegree.set(w, (inDegree.get(w) || 0) + 1);
        }
      }
    }

    const isolatedIslands: string[] = [];
    for (const [id, deg] of inDegree.entries()) {
      if (deg === 0) {
        isolatedIslands.push(id);
      }
    }

    expect(
      isolatedIslands,
      `Found isolated island skills with 0 inbound links:\n${isolatedIslands.join(', ')}`
    ).toHaveLength(0);
  });
});


