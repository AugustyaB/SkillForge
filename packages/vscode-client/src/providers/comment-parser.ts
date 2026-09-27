export interface ParsedCommentTrigger {
  lineNumber: number;
  startCharacter: number;
  endCharacter: number;
  keyword: 'IDEA' | 'SKILL';
  intent: string;
}

// Regex matching single-line comments in C-style (//) or Shell/Python (#) languages
const COMMENT_TRIGGER_REGEX = /^(?:\/\/|#)\s*(IDEA|SKILL):\s*(.+)$/i;

/**
 * Parses a single line of text looking for SkillForge triggers.
 * Returns ParsedCommentTrigger if matched and intent is non-empty, otherwise null.
 */
export function parseCommentLine(
  lineText: string,
  lineNumber: number
): ParsedCommentTrigger | null {
  const trimmed = lineText.trim();
  const match = trimmed.match(COMMENT_TRIGGER_REGEX);
  if (!match) {
    return null;
  }

  const keyword = match[1]!.toUpperCase() as 'IDEA' | 'SKILL';
  const rawIntent = match[2]!;
  const cleanedIntent = rawIntent.trim();

  // If intent is blank (e.g. "// IDEA:   "), ignore
  if (!cleanedIntent) {
    return null;
  }

  // Calculate 0-based start and end indices in the original line
  const startChar = lineText.indexOf(match[0]);
  const endChar = startChar + match[0].length;

  return {
    lineNumber,
    startCharacter: startChar >= 0 ? startChar : 0,
    endCharacter: endChar >= 0 ? endChar : lineText.length,
    keyword,
    intent: cleanedIntent,
  };
}

/**
 * Scans an array of document lines extracting up to `maxLenses` comment triggers.
 */
export function parseDocumentComments(
  lines: string[],
  maxLenses = 10
): ParsedCommentTrigger[] {
  const triggers: ParsedCommentTrigger[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (triggers.length >= maxLenses) {
      break;
    }

    const line = lines[i];
    if (!line) continue;

    // Fast preliminary check: must contain "IDEA:" or "SKILL:" before regex
    const upper = line.toUpperCase();
    if (!upper.includes('IDEA:') && !upper.includes('SKILL:')) {
      continue;
    }

    const parsed = parseCommentLine(line, i);
    if (parsed) {
      triggers.push(parsed);
    }
  }

  return triggers;
}
