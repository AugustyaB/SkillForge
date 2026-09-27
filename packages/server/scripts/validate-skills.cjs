const fs = require('fs');
const path = require('path');
const { validateSkillsArray } = require('../../shared/dist/index.js');

const skillsPath = path.join(__dirname, '..', 'src', 'data', 'skills.json');

if (!fs.existsSync(skillsPath)) {
  console.error(`[Validate Skills] ERROR: skills.json not found at ${skillsPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(skillsPath, 'utf-8');
let rawJson;
try {
  rawJson = JSON.parse(rawData);
} catch (err) {
  console.error('[Validate Skills] ERROR: Failed to parse skills.json as JSON:', err);
  process.exit(1);
}

console.log(`[Validate Skills] Validating ${rawJson.length} skills from ${skillsPath}...`);

// 1. Zod Schema & Duplicate ID Check
let validated;
try {
  validated = validateSkillsArray(rawJson);
} catch (err) {
  console.error('[Validate Skills] ERROR: Schema validation failed:', err.message);
  process.exit(1);
}

// 2. Minimum count threshold (Must-have >= 100 skills)
if (validated.length < 100) {
  console.error(`[Validate Skills] ERROR: Expected at least 100 skills, found ${validated.length}`);
  process.exit(1);
}

// 3. Detailed field invariants
const allIds = new Set(validated.map((s) => s.id));
let warningCount = 0;

for (const skill of validated) {
  // Ensure URLs are HTTPS
  if (!skill.officialUrl.startsWith('https://')) {
    console.error(`[Validate Skills] ERROR: Skill "${skill.id}" has non-HTTPS officialUrl: ${skill.officialUrl}`);
    process.exit(1);
  }

  for (const resource of skill.learnResources) {
    if (!resource.url.startsWith('https://')) {
      console.error(`[Validate Skills] ERROR: Skill "${skill.id}" has non-HTTPS learn resource URL: ${resource.url}`);
      process.exit(1);
    }
  }

  // Ensure stackIndicators are non-empty
  if (skill.stackIndicators.length === 0) {
    console.error(`[Validate Skills] ERROR: Skill "${skill.id}" has empty stackIndicators.`);
    process.exit(1);
  }
}

console.log(`[Validate Skills] SUCCESS: All ${validated.length} skills verified against strict Zod rules!`);
process.exit(0);
