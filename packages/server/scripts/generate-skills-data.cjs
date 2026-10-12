const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../src/data/skills.json');
const tsPath = path.resolve(__dirname, '../src/data/skills-data.ts');

const raw = fs.readFileSync(jsonPath, 'utf8');
const count = JSON.parse(raw).length;
const content = `import type { Skill } from '@skillforge/shared';\n\nexport const DEFAULT_SKILLS_DATA: Skill[] = (${raw.trim()}) as unknown as Skill[];\n`;

fs.writeFileSync(tsPath, content, 'utf8');
console.log(`[Generate Skills Data] Successfully generated skills-data.ts with ${count} skills.`);
