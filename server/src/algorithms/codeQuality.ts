// ---------------------------------------------------------------------------
// codeQuality.ts -- Scores student code across readability, structure,
// creativity, and efficiency, then awards bonus XP and a buddy comment
// for the SPARK kids coding education platform.
// ---------------------------------------------------------------------------

export interface QualityScore {
  total: number; // 0-100
  breakdown: {
    readability: number;
    structure: number;
    creativity: number;
    efficiency: number;
  };
  bonusXP: number;
  buddyComment: string;
}

// ---- Internal helpers -----------------------------------------------------

/** Clamp a number between min and max (inclusive). */
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/** Round to nearest integer. */
const round = (n: number): number => Math.round(n);

/** Count non-empty, non-whitespace-only lines. */
const meaningfulLines = (src: string): number =>
  src.split('\n').filter((l) => l.trim().length > 0).length;

/** Check whether every line that is indented uses a consistent unit. */
const hasConsistentIndentation = (src: string, unit: number = 2): boolean => {
  const lines = src.split('\n');
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const leadingSpaces = line.match(/^( *)/)?.[1].length ?? 0;
    // Allow 0 (top-level) or any multiple of `unit`
    if (leadingSpaces > 0 && leadingSpaces % unit !== 0) return false;
  }
  return true;
};

/** Return the set of unique non-empty matches from a global regex. */
const uniqueMatches = (src: string, re: RegExp): string[] => {
  const matches = src.match(re);
  return matches ? [...new Set(matches)] : [];
};

/** Pick a buddy comment based on a 0-100 total score. */
const pickBuddyComment = (total: number): string => {
  if (total >= 90)
    return "Incredible work! Your code is super clean and creative -- you're coding like a pro!";
  if (total >= 75)
    return "Great job! Your code is really coming together. A few small tweaks and it'll be perfect!";
  if (total >= 60)
    return "Nice effort! You've got solid ideas in here. Let's polish it up a bit more!";
  if (total >= 40)
    return "Good start! Keep experimenting -- every great coder started right where you are!";
  return "Don't give up! Writing code is tricky at first, but you're learning something new every time you try!";
};

/** Derive bonus XP from the total score (0-100 -> 0-50 XP). */
const deriveBonusXP = (total: number): number => {
  if (total >= 90) return 50;
  if (total >= 75) return 35;
  if (total >= 60) return 20;
  if (total >= 40) return 10;
  return 5;
};

/** Build a final QualityScore from four 0-25 sub-scores. */
const buildScore = (
  readability: number,
  structure: number,
  creativity: number,
  efficiency: number,
): QualityScore => {
  const total = clamp(round(readability + structure + creativity + efficiency), 0, 100);
  return {
    total,
    breakdown: {
      readability: clamp(round(readability), 0, 25),
      structure: clamp(round(structure), 0, 25),
      creativity: clamp(round(creativity), 0, 25),
      efficiency: clamp(round(efficiency), 0, 25),
    },
    bonusXP: deriveBonusXP(total),
    buddyComment: pickBuddyComment(total),
  };
};

// ---- HTML + CSS scorer ----------------------------------------------------

export const scoreHTMLCSS = (html: string, css: string): QualityScore => {
  let readability = 0;  // max 25
  let structure = 0;    // max 25
  let creativity = 0;   // max 25
  let efficiency = 0;   // max 25

  // --- Readability (25 pts) ---

  // Consistent indentation in HTML (up to 8 pts)
  if (hasConsistentIndentation(html)) readability += 8;
  else if (hasConsistentIndentation(html, 4)) readability += 6;

  // Consistent indentation in CSS (up to 5 pts)
  if (hasConsistentIndentation(css)) readability += 5;

  // Descriptive class names: at least some classes > 3 chars, not just "a","b","x" (up to 7 pts)
  const classNames = uniqueMatches(html, /class="([^"]+)"/g)
    .flatMap((m) => m.replace(/class="/g, '').replace(/"/g, '').split(/\s+/));
  const meaningfulClassCount = classNames.filter((c) => c.length > 3).length;
  readability += clamp(meaningfulClassCount * 2, 0, 7);

  // CSS rule formatting -- selectors with declarations (up to 5 pts)
  const cssRules = css.match(/[^{}]+\{[^}]*\}/g) ?? [];
  if (cssRules.length > 0) readability += Math.min(cssRules.length, 5);

  readability = clamp(readability, 0, 25);

  // --- Structure (25 pts) ---

  // Semantic HTML tags (up to 10 pts)
  const semanticTags = [
    'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'figure', 'figcaption',
  ];
  const foundSemantic = semanticTags.filter((tag) =>
    new RegExp(`<${tag}[\\s>]`, 'i').test(html),
  );
  structure += clamp(foundSemantic.length * 2, 0, 10);

  // Multiple sections or divs (up to 5 pts)
  const sectionCount = (html.match(/<(section|div|article)[^>]*>/gi) ?? []).length;
  structure += clamp(sectionCount, 0, 5);

  // Has a DOCTYPE / html / head / body skeleton (up to 5 pts)
  if (/<!doctype\s+html>/i.test(html)) structure += 1;
  if (/<html[\s>]/i.test(html)) structure += 1;
  if (/<head[\s>]/i.test(html)) structure += 1;
  if (/<body[\s>]/i.test(html)) structure += 1;
  if (/<title[\s>]/i.test(html)) structure += 1;

  // CSS organization -- multiple selectors (up to 5 pts)
  structure += clamp(Math.floor(cssRules.length / 2), 0, 5);

  structure = clamp(structure, 0, 25);

  // --- Creativity (25 pts) ---

  // Custom web fonts / Google Fonts (up to 5 pts)
  if (/@import\s+url|font-family/i.test(css)) creativity += 5;

  // CSS animations or transitions (up to 6 pts)
  if (/@keyframes/i.test(css)) creativity += 4;
  if (/transition\s*:/i.test(css)) creativity += 2;
  if (/animation\s*:/i.test(css)) creativity += 2;

  // Color variety -- unique color values (up to 6 pts)
  const colorValues = uniqueMatches(
    css,
    /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+-[a-z]+|(?:red|blue|green|orange|purple|pink|yellow|white|black|gray|grey|teal|cyan|magenta|gold|silver|navy|maroon|olive|coral|salmon|tomato|violet|indigo|lime)\b/gi,
  );
  creativity += clamp(colorValues.length * 2, 0, 6);

  // Background images, gradients, or box-shadow (up to 4 pts)
  if (/background.*(?:url|gradient)/i.test(css)) creativity += 2;
  if (/box-shadow/i.test(css)) creativity += 2;

  // Media queries / responsive design (up to 4 pts)
  if (/@media/i.test(css)) creativity += 4;

  creativity = clamp(creativity, 0, 25);

  // --- Efficiency (25 pts) ---

  // Not excessively repetitive CSS (up to 8 pts)
  const cssLines = meaningfulLines(css);
  const uniqueCSSLines = new Set(css.split('\n').map((l) => l.trim()).filter((l) => l.length > 0));
  const repetitionRatio = cssLines > 0 ? uniqueCSSLines.size / cssLines : 1;
  efficiency += clamp(round(repetitionRatio * 8), 0, 8);

  // Uses CSS classes instead of inline styles (up to 7 pts)
  const inlineStyleCount = (html.match(/style="/gi) ?? []).length;
  if (inlineStyleCount === 0) efficiency += 7;
  else if (inlineStyleCount <= 2) efficiency += 4;
  else efficiency += 1;

  // Not over-qualifying selectors (up to 5 pts) -- short selectors are better
  const avgSelectorLen =
    cssRules.length > 0
      ? cssRules.reduce((sum, r) => {
          const sel = r.split('{')[0].trim();
          return sum + sel.length;
        }, 0) / cssRules.length
      : 0;
  if (avgSelectorLen > 0 && avgSelectorLen < 30) efficiency += 5;
  else if (avgSelectorLen < 50) efficiency += 3;

  // Reasonable file sizes (up to 5 pts)
  const totalLines = meaningfulLines(html) + cssLines;
  if (totalLines >= 5 && totalLines <= 500) efficiency += 5;
  else if (totalLines > 0) efficiency += 2;

  efficiency = clamp(efficiency, 0, 25);

  return buildScore(readability, structure, creativity, efficiency);
};

// ---- JavaScript scorer ----------------------------------------------------

export const scoreJavaScript = (js: string): QualityScore => {
  let readability = 0;
  let structure = 0;
  let creativity = 0;
  let efficiency = 0;

  const lines = js.split('\n');
  const trimmedLines = lines.filter((l) => l.trim().length > 0);
  const lineCount = trimmedLines.length;

  // --- Readability (25 pts) ---

  // camelCase variable naming (up to 8 pts)
  const varDecls = js.match(/(?:let|const|var)\s+([a-zA-Z_$][\w$]*)/g) ?? [];
  const varNames = varDecls.map((d) => d.replace(/^(?:let|const|var)\s+/, ''));
  const camelCaseCount = varNames.filter((v) => /^[a-z][a-zA-Z0-9]*$/.test(v)).length;
  const camelRatio = varNames.length > 0 ? camelCaseCount / varNames.length : 0;
  readability += clamp(round(camelRatio * 8), 0, 8);

  // Meaningful variable names (> 2 chars) (up to 5 pts)
  const meaningfulNames = varNames.filter((v) => v.length > 2).length;
  const meaningfulRatio = varNames.length > 0 ? meaningfulNames / varNames.length : 0;
  readability += clamp(round(meaningfulRatio * 5), 0, 5);

  // Has comments (up to 5 pts)
  const commentLines = lines.filter(
    (l) => l.trim().startsWith('//') || l.trim().startsWith('/*') || l.trim().startsWith('*'),
  ).length;
  if (commentLines >= 5) readability += 5;
  else if (commentLines >= 2) readability += 3;
  else if (commentLines >= 1) readability += 1;

  // Consistent indentation (up to 7 pts)
  if (hasConsistentIndentation(js)) readability += 7;
  else if (hasConsistentIndentation(js, 4)) readability += 5;

  readability = clamp(readability, 0, 25);

  // --- Structure (25 pts) ---

  // Uses functions (up to 10 pts)
  const functionDecls = (js.match(/function\s+\w+|const\s+\w+\s*=\s*(\([^)]*\)|[a-zA-Z_$]\w*)\s*=>/g) ?? []).length;
  if (functionDecls >= 4) structure += 10;
  else if (functionDecls >= 2) structure += 7;
  else if (functionDecls >= 1) structure += 4;

  // Event listener usage (up to 5 pts)
  const eventListeners = (js.match(/addEventListener\s*\(/g) ?? []).length;
  if (eventListeners >= 3) structure += 5;
  else if (eventListeners >= 1) structure += 3;

  // DOM manipulation quality (up to 5 pts)
  const domCalls = (
    js.match(
      /querySelector|getElementById|getElementsBy|createElement|append(?:Child)?|textContent|innerHTML|classList/g,
    ) ?? []
  ).length;
  if (domCalls >= 4) structure += 5;
  else if (domCalls >= 2) structure += 3;
  else if (domCalls >= 1) structure += 1;

  // Uses try/catch or error handling (up to 5 pts)
  if (/try\s*\{/.test(js)) structure += 3;
  if (/\.catch\s*\(/.test(js)) structure += 2;

  structure = clamp(structure, 0, 25);

  // --- Creativity (25 pts) ---

  // Uses modern JS features (up to 6 pts)
  if (/=>\s*[\{(]/.test(js)) creativity += 2; // arrow functions
  if (/`[^`]*\$\{/.test(js)) creativity += 2; // template literals
  if (/\.\.\.\w/.test(js)) creativity += 2; // spread operator

  // Uses array methods (up to 6 pts)
  const arrayMethods = uniqueMatches(
    js,
    /\.(?:map|filter|reduce|forEach|find|some|every|flatMap|includes)\s*\(/g,
  );
  creativity += clamp(arrayMethods.length * 2, 0, 6);

  // Async/await or fetch (up to 5 pts)
  if (/async\s+function|async\s*\(/.test(js)) creativity += 3;
  if (/\bfetch\s*\(/.test(js)) creativity += 2;

  // Uses objects/classes (up to 4 pts)
  if (/class\s+\w+/.test(js)) creativity += 3;
  else if (/new\s+\w+/.test(js)) creativity += 1;

  // Uses localStorage or sessionStorage (up to 4 pts)
  if (/localStorage|sessionStorage/.test(js)) creativity += 4;

  creativity = clamp(creativity, 0, 25);

  // --- Efficiency (25 pts) ---

  // No global pollution -- prefers const/let over var (up to 8 pts)
  const varCount = (js.match(/\bvar\s+/g) ?? []).length;
  const constLetCount = (js.match(/\b(?:const|let)\s+/g) ?? []).length;
  if (varCount === 0 && constLetCount > 0) efficiency += 8;
  else if (varCount <= 1) efficiency += 5;
  else efficiency += 2;

  // Avoids document.write (up to 4 pts)
  if (!/document\.write\s*\(/.test(js)) efficiency += 4;

  // Not overly repetitive (up to 6 pts)
  const uniqueNonEmpty = new Set(trimmedLines.map((l) => l.trim()));
  const uniqueRatio = lineCount > 0 ? uniqueNonEmpty.size / lineCount : 1;
  efficiency += clamp(round(uniqueRatio * 6), 0, 6);

  // Reasonable file size (up to 4 pts)
  if (lineCount >= 3 && lineCount <= 500) efficiency += 4;
  else if (lineCount > 0) efficiency += 2;

  // Uses strict equality === (up to 3 pts)
  const looseEq = (js.match(/[^=!]==[^=]/g) ?? []).length;
  const strictEq = (js.match(/===|!==/g) ?? []).length;
  if (looseEq === 0 && strictEq > 0) efficiency += 3;
  else if (looseEq === 0) efficiency += 2;

  efficiency = clamp(efficiency, 0, 25);

  return buildScore(readability, structure, creativity, efficiency);
};

// ---- Python scorer --------------------------------------------------------

export const scorePython = (python: string): QualityScore => {
  let readability = 0;
  let structure = 0;
  let creativity = 0;
  let efficiency = 0;

  const lines = python.split('\n');
  const trimmedLines = lines.filter((l) => l.trim().length > 0);
  const lineCount = trimmedLines.length;

  // --- Readability (25 pts) ---

  // snake_case variable naming (up to 8 pts)
  const pyVarDecls = python.match(/^([a-zA-Z_]\w*)\s*=/gm) ?? [];
  const pyVarNames = pyVarDecls.map((d) => d.replace(/\s*=.*/, '').trim());
  const snakeCaseCount = pyVarNames.filter((v) => /^[a-z][a-z0-9_]*$/.test(v)).length;
  const snakeRatio = pyVarNames.length > 0 ? snakeCaseCount / pyVarNames.length : 0;
  readability += clamp(round(snakeRatio * 8), 0, 8);

  // Proper indentation -- 4-space Python convention (up to 7 pts)
  if (hasConsistentIndentation(python, 4)) readability += 7;
  else if (hasConsistentIndentation(python, 2)) readability += 4;

  // Has comments (up to 5 pts)
  const pyComments = lines.filter((l) => l.trim().startsWith('#')).length;
  if (pyComments >= 5) readability += 5;
  else if (pyComments >= 2) readability += 3;
  else if (pyComments >= 1) readability += 1;

  // Docstrings (up to 5 pts)
  const docstrings = (python.match(/"""[\s\S]*?"""|'''[\s\S]*?'''/g) ?? []).length;
  if (docstrings >= 3) readability += 5;
  else if (docstrings >= 1) readability += 3;

  readability = clamp(readability, 0, 25);

  // --- Structure (25 pts) ---

  // Uses functions with def (up to 10 pts)
  const defCount = (python.match(/^\s*def\s+\w+/gm) ?? []).length;
  if (defCount >= 4) structure += 10;
  else if (defCount >= 2) structure += 7;
  else if (defCount >= 1) structure += 4;

  // Uses classes (up to 5 pts)
  const classCount = (python.match(/^\s*class\s+\w+/gm) ?? []).length;
  if (classCount >= 2) structure += 5;
  else if (classCount >= 1) structure += 3;

  // Uses if __name__ == "__main__" guard (up to 3 pts)
  if (/if\s+__name__\s*==\s*['"]__main__['"]/m.test(python)) structure += 3;

  // Imports at the top (up to 4 pts)
  const importLines = lines.filter((l) => /^\s*(import|from)\s+/.test(l));
  if (importLines.length > 0) {
    const firstImportIdx = lines.findIndex((l) => /^\s*(import|from)\s+/.test(l));
    const firstCodeIdx = lines.findIndex(
      (l) => l.trim().length > 0 && !l.trim().startsWith('#') && !/^\s*(import|from)\s+/.test(l),
    );
    if (firstCodeIdx === -1 || firstImportIdx < firstCodeIdx) structure += 4;
    else structure += 1;
  }

  // Uses return statements in functions (up to 3 pts)
  const returnCount = (python.match(/^\s+return\s+/gm) ?? []).length;
  if (returnCount >= 2) structure += 3;
  else if (returnCount >= 1) structure += 2;

  structure = clamp(structure, 0, 25);

  // --- Creativity (25 pts) ---

  // List comprehensions (up to 6 pts)
  const listComps = (python.match(/\[.+\bfor\b.+\bin\b.+\]/g) ?? []).length;
  if (listComps >= 3) creativity += 6;
  else if (listComps >= 1) creativity += 4;

  // Uses f-strings (up to 4 pts)
  if (/f['"]/.test(python)) creativity += 4;

  // Uses with statement / context managers (up to 4 pts)
  if (/\bwith\s+/.test(python)) creativity += 4;

  // Uses dictionaries or sets (up to 4 pts)
  if (/\{\s*['"]\w+['"]\s*:/.test(python)) creativity += 2;  // dict
  if (/\bset\s*\(/.test(python)) creativity += 2;             // set

  // Uses try/except (up to 3 pts)
  if (/\btry\s*:/.test(python)) creativity += 3;

  // Uses lambda / map / filter (up to 4 pts)
  if (/\blambda\b/.test(python)) creativity += 2;
  if (/\b(?:map|filter)\s*\(/.test(python)) creativity += 2;

  creativity = clamp(creativity, 0, 25);

  // --- Efficiency (25 pts) ---

  // No unused variables -- simple heuristic: every assigned name is used later (up to 8 pts)
  let usedCount = 0;
  for (const name of pyVarNames) {
    // Check if the name appears at least once more beyond the assignment
    const usageRe = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const occurrences = python.match(usageRe) ?? [];
    if (occurrences.length >= 2) usedCount++;
  }
  const usedRatio = pyVarNames.length > 0 ? usedCount / pyVarNames.length : 1;
  efficiency += clamp(round(usedRatio * 8), 0, 8);

  // Not overly repetitive (up to 6 pts)
  const uniqueNonEmpty = new Set(trimmedLines.map((l) => l.trim()));
  const uniqueRatio = lineCount > 0 ? uniqueNonEmpty.size / lineCount : 1;
  efficiency += clamp(round(uniqueRatio * 6), 0, 6);

  // Uses enumerate instead of range(len(...)) (up to 4 pts)
  const rangeLen = (python.match(/range\s*\(\s*len\s*\(/g) ?? []).length;
  const enumerateUse = (python.match(/\benumerate\s*\(/g) ?? []).length;
  if (rangeLen === 0 && enumerateUse > 0) efficiency += 4;
  else if (rangeLen === 0) efficiency += 2;

  // Reasonable file size (up to 4 pts)
  if (lineCount >= 3 && lineCount <= 500) efficiency += 4;
  else if (lineCount > 0) efficiency += 2;

  // No wildcard imports (up to 3 pts)
  if (!/from\s+\w+\s+import\s+\*/.test(python)) efficiency += 3;

  efficiency = clamp(efficiency, 0, 25);

  return buildScore(readability, structure, creativity, efficiency);
};

// ---- Combined scorer ------------------------------------------------------

/**
 * Score all provided code files and combine results. Only files with
 * actual content (after trimming whitespace) contribute to the final
 * score. When multiple languages are present the sub-scores are
 * averaged across contributors so no single language can dominate.
 */
export const scoreCode = (files: {
  html: string;
  css: string;
  js: string;
  python: string;
}): QualityScore => {
  const scores: QualityScore[] = [];

  const hasHTML = files.html.trim().length > 0;
  const hasCSS = files.css.trim().length > 0;
  const hasJS = files.js.trim().length > 0;
  const hasPython = files.python.trim().length > 0;

  // HTML/CSS are scored together when either is present
  if (hasHTML || hasCSS) {
    scores.push(scoreHTMLCSS(files.html, files.css));
  }

  if (hasJS) {
    scores.push(scoreJavaScript(files.js));
  }

  if (hasPython) {
    scores.push(scorePython(files.python));
  }

  // If nothing was provided, return a zero score
  if (scores.length === 0) {
    return buildScore(0, 0, 0, 0);
  }

  // Average breakdown values across all contributing scores
  const avgReadability =
    scores.reduce((s, q) => s + q.breakdown.readability, 0) / scores.length;
  const avgStructure =
    scores.reduce((s, q) => s + q.breakdown.structure, 0) / scores.length;
  const avgCreativity =
    scores.reduce((s, q) => s + q.breakdown.creativity, 0) / scores.length;
  const avgEfficiency =
    scores.reduce((s, q) => s + q.breakdown.efficiency, 0) / scores.length;

  return buildScore(avgReadability, avgStructure, avgCreativity, avgEfficiency);
};
