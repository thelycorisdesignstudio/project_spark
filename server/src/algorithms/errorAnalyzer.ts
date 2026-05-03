// ---------------------------------------------------------------------------
// errorAnalyzer.ts -- Classifies code errors into kid-friendly categories
// and provides age-appropriate explanations for the SPARK platform.
// ---------------------------------------------------------------------------

export type ErrorCategory =
  | 'syntax-typo'
  | 'syntax-structure'
  | 'logic-off-by-one'
  | 'logic-scope'
  | 'logic-type'
  | 'css-selector-invalid'
  | 'css-value-invalid'
  | 'dom-not-found'
  | 'runtime-undefined'
  | 'runtime-infinite-loop'
  | 'python-indent'
  | 'python-name'
  | 'python-type'
  | 'unknown';

export interface ParsedError {
  category: ErrorCategory;
  line: number | null;
  message: string;
  kidFriendlyExplanation: string;
  commonCause: string;
  fixHint: string;
}

// ---- Pattern table --------------------------------------------------------

interface ErrorPattern {
  pattern: RegExp;
  category: ErrorCategory;
}

export const ERROR_PATTERNS: ErrorPattern[] = [
  // --- Syntax / typo ---
  {
    pattern: /Unexpected token '?([^']*)'?/i,
    category: 'syntax-typo',
  },
  {
    pattern: /SyntaxError:\s*Unexpected (identifier|string|number)/i,
    category: 'syntax-typo',
  },
  {
    pattern: /Missing semicolon/i,
    category: 'syntax-typo',
  },

  // --- Syntax / structure ---
  {
    pattern: /Unexpected end of (input|file)/i,
    category: 'syntax-structure',
  },
  {
    pattern: /Unterminated (string|template) literal/i,
    category: 'syntax-structure',
  },
  {
    pattern: /Expected.*(\}|\)|\])/i,
    category: 'syntax-structure',
  },

  // --- Logic / off-by-one ---
  {
    pattern: /Index.*out of (range|bounds)/i,
    category: 'logic-off-by-one',
  },
  {
    pattern: /IndexError:\s*list index out of range/i,
    category: 'logic-off-by-one',
  },

  // --- Logic / scope ---
  {
    pattern: /is not defined/i,
    category: 'logic-scope',
  },
  {
    pattern: /Cannot access '.*' before initialization/i,
    category: 'logic-scope',
  },

  // --- Logic / type ---
  {
    pattern: /TypeError:.*is not a function/i,
    category: 'logic-type',
  },
  {
    pattern: /TypeError:.*Cannot read propert(y|ies)/i,
    category: 'logic-type',
  },

  // --- CSS / selector ---
  {
    pattern: /Unknown pseudo-class|Invalid selector/i,
    category: 'css-selector-invalid',
  },
  {
    pattern: /Expected selector|Selector expected/i,
    category: 'css-selector-invalid',
  },

  // --- CSS / value ---
  {
    pattern: /Invalid (property )?value|Unknown property/i,
    category: 'css-value-invalid',
  },
  {
    pattern: /Expected.*but found|is not a valid color/i,
    category: 'css-value-invalid',
  },

  // --- DOM ---
  {
    pattern: /querySelector.*returned null|getElementById.*null/i,
    category: 'dom-not-found',
  },
  {
    pattern: /Cannot (set|read) propert(y|ies) of null/i,
    category: 'dom-not-found',
  },

  // --- Runtime / undefined ---
  {
    pattern: /undefined is not an object/i,
    category: 'runtime-undefined',
  },
  {
    pattern: /ReferenceError:/i,
    category: 'runtime-undefined',
  },

  // --- Runtime / infinite loop ---
  {
    pattern: /Maximum call stack size exceeded/i,
    category: 'runtime-infinite-loop',
  },
  {
    pattern: /Script timeout|Execution timed out/i,
    category: 'runtime-infinite-loop',
  },
  {
    pattern: /too much recursion/i,
    category: 'runtime-infinite-loop',
  },

  // --- Python / indent ---
  {
    pattern: /IndentationError:/i,
    category: 'python-indent',
  },
  {
    pattern: /unexpected indent|expected an indented block/i,
    category: 'python-indent',
  },

  // --- Python / name ---
  {
    pattern: /NameError:\s*name '.*' is not defined/i,
    category: 'python-name',
  },

  // --- Python / type ---
  {
    pattern: /TypeError:.*unsupported operand type/i,
    category: 'python-type',
  },
  {
    pattern: /TypeError:.*can't multiply|TypeError:.*can only concatenate/i,
    category: 'python-type',
  },
];

// ---- Kid-friendly explanations for every category -------------------------

export const KID_FRIENDLY_ERRORS: Record<
  ErrorCategory,
  { kidFriendlyExplanation: string; commonCause: string; fixHint: string }
> = {
  'syntax-typo': {
    kidFriendlyExplanation:
      "Oops! There's a tiny spelling mistake or extra character in your code. " +
      "Think of it like a typo in a text message -- the computer just doesn't understand it yet.",
    commonCause:
      'A character was typed that the computer was not expecting, like a stray comma or a misspelled keyword.',
    fixHint:
      'Read the line the error points to very carefully. Look for misspelled words, extra commas, or missing quotes.',
  },
  'syntax-structure': {
    kidFriendlyExplanation:
      "Your code is missing a closing piece -- it's like starting a sentence but forgetting the period! " +
      'Every opening bracket, parenthesis, or quote needs a matching closing one.',
    commonCause:
      'A curly brace `{}`, parenthesis `()`, bracket `[]`, or quote was opened but never closed.',
    fixHint:
      'Count your opening and closing brackets. Every `{` needs a `}`, every `(` needs a `)`, and every quote needs a partner.',
  },
  'logic-off-by-one': {
    kidFriendlyExplanation:
      'Your code tried to grab an item from a list that does not exist -- like reaching for the 11th cookie in a box of 10. ' +
      'Remember, computers start counting at zero!',
    commonCause:
      'A loop or index went one step too far (or one step too short) past the actual items in a list.',
    fixHint:
      'If your list has 5 items, the valid positions are 0 through 4. Double-check your loop end condition or index number.',
  },
  'logic-scope': {
    kidFriendlyExplanation:
      "Your code is trying to use a variable that doesn't exist here. " +
      "It's like trying to use a toy that's in another room -- you need to be in the right place to use it!",
    commonCause:
      'A variable was created inside a function or block and then used outside where it cannot be seen.',
    fixHint:
      'Make sure you create (declare) the variable before you use it, and in a place where the rest of your code can reach it.',
  },
  'logic-type': {
    kidFriendlyExplanation:
      "You're trying to do something with a value that doesn't support it -- " +
      "like trying to multiply a word by a number. The computer is confused about what type of thing it's working with.",
    commonCause:
      'A value is a different type than expected. For example, trying to call something as a function when it is really a number or string.',
    fixHint:
      "Check the variable you're using. Is it actually the type you think? Try logging it with console.log() or print() to see what it really is.",
  },
  'css-selector-invalid': {
    kidFriendlyExplanation:
      "Your CSS selector (the name you used to pick an HTML element) doesn't look right. " +
      "It's like writing someone's address wrong -- the mail carrier can't find the house!",
    commonCause:
      'A class name, id, or pseudo-class was misspelled, or the selector syntax has an extra or missing character.',
    fixHint:
      'Double-check that your selector matches exactly what is in your HTML. Class selectors start with `.` and id selectors start with `#`.',
  },
  'css-value-invalid': {
    kidFriendlyExplanation:
      "The value you gave a CSS property isn't one it understands -- " +
      "like telling a crayon to be the color \"flurple\". CSS only knows certain values for each property.",
    commonCause:
      'A property received a value it does not accept, like using a word where a number with units (px, %, em) is required.',
    fixHint:
      'Check the CSS property docs for valid values. Common mistakes: forgetting "px" after a number, or misspelling a color name.',
  },
  'dom-not-found': {
    kidFriendlyExplanation:
      "Your JavaScript tried to find an HTML element on the page, but it wasn't there. " +
      "It's like looking for a friend at school and they're home sick!",
    commonCause:
      'The id or class name in your JavaScript does not match what is in the HTML, or the script runs before the page finishes loading.',
    fixHint:
      'Make sure the id/class in querySelector or getElementById matches your HTML exactly. ' +
      'Also try putting your <script> tag right before </body> so the HTML loads first.',
  },
  'runtime-undefined': {
    kidFriendlyExplanation:
      "Your code tried to use something that has no value yet -- it's like opening an empty lunchbox expecting a sandwich. " +
      'The variable exists, but nothing was put inside it.',
    commonCause:
      'A variable was declared but never assigned a value, or a function returned nothing when a value was expected.',
    fixHint:
      'Trace through your code and make sure every variable gets a value before you try to use it. ' +
      'Console.log the variable right before the error line to see what it holds.',
  },
  'runtime-infinite-loop': {
    kidFriendlyExplanation:
      "Your code got stuck doing the same thing over and over forever -- like a hamster on a wheel that can't stop! " +
      'The computer ran out of patience and stopped it.',
    commonCause:
      'A loop condition never becomes false, or a function keeps calling itself without a way to stop (missing base case).',
    fixHint:
      'Check your while/for loop: does the counter actually change each time? ' +
      'For recursive functions, make sure there is an "if" that stops calling itself.',
  },
  'python-indent': {
    kidFriendlyExplanation:
      'Python is very picky about spaces at the beginning of lines. ' +
      "Think of it like lining up in a queue -- everyone has to stand in the right spot or it gets messy!",
    commonCause:
      'Lines inside an if, for, while, or def block are not indented consistently. Mixing tabs and spaces also causes this.',
    fixHint:
      'Use exactly 4 spaces for each level of indentation. ' +
      "Make sure every line inside a block is indented the same amount. Don't mix tabs and spaces!",
  },
  'python-name': {
    kidFriendlyExplanation:
      "Python can't find a variable or function with that name. " +
      "It's like calling out for a friend named \"Zorp\" -- if nobody has that name, nobody answers!",
    commonCause:
      'The variable or function was never created, or it was spelled differently somewhere else.',
    fixHint:
      'Check for typos in variable and function names. Python is case-sensitive, so "myVar" and "myvar" are different!',
  },
  'python-type': {
    kidFriendlyExplanation:
      "You tried to mix things that Python can't combine -- like adding a number to a word. " +
      'Python needs you to be clear about what type each value is.',
    commonCause:
      'An operation was used with incompatible types, such as adding a string and an integer without converting one first.',
    fixHint:
      'Use str() to turn a number into text, or int()/float() to turn text into a number before combining them.',
  },
  unknown: {
    kidFriendlyExplanation:
      "Something went wrong, but I'm not sure exactly what. " +
      "Don't worry -- every coder runs into mystery bugs. Let's figure it out together!",
    commonCause:
      'The error did not match any known pattern. It may be a less common issue or a combination of problems.',
    fixHint:
      'Read the error message carefully, then look at the line number it mentions. ' +
      'Try commenting out that line to see if the rest of your code works, then fix it step by step.',
  },
};

// ---- Core analysis function -----------------------------------------------

/**
 * Attempt to extract a line number from an error message or surrounding context.
 * Supports formats like "line 12", ":12:", "(12,5)", "at line 12", etc.
 */
const extractLineNumber = (errorMessage: string, code: string): number | null => {
  // Common patterns for line numbers in error messages
  const linePatterns: RegExp[] = [
    /line\s+(\d+)/i,
    /:(\d+):\d+/,          // file:line:col
    /:(\d+)\b/,            // file:line
    /\((\d+),\s*\d+\)/,    // (line, col)
    /at\s+.*:(\d+)/i,
  ];

  for (const lp of linePatterns) {
    const match = errorMessage.match(lp);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Sanity-check against the code length
        const totalLines = code.split('\n').length;
        return parsed <= totalLines ? parsed : parsed;
      }
    }
  }

  return null;
};

/**
 * Analyze a raw error message against the user's source code and return a
 * fully-populated `ParsedError` with kid-friendly guidance.
 */
export const analyzeError = (errorMessage: string, code: string): ParsedError => {
  let matchedCategory: ErrorCategory = 'unknown';

  for (const ep of ERROR_PATTERNS) {
    if (ep.pattern.test(errorMessage)) {
      matchedCategory = ep.category;
      break;
    }
  }

  const line = extractLineNumber(errorMessage, code);
  const friendly = KID_FRIENDLY_ERRORS[matchedCategory];

  return {
    category: matchedCategory,
    line,
    message: errorMessage.trim(),
    kidFriendlyExplanation: friendly.kidFriendlyExplanation,
    commonCause: friendly.commonCause,
    fixHint: friendly.fixHint,
  };
};

// ---- Analytics helper -----------------------------------------------------

/**
 * Given an array of previously parsed errors, produce a frequency count
 * for each `ErrorCategory`. Categories with zero occurrences are included
 * so downstream consumers always get a complete picture.
 */
export const categorizeErrorFrequency = (
  errors: ParsedError[],
): Record<ErrorCategory, number> => {
  const ALL_CATEGORIES: ErrorCategory[] = [
    'syntax-typo',
    'syntax-structure',
    'logic-off-by-one',
    'logic-scope',
    'logic-type',
    'css-selector-invalid',
    'css-value-invalid',
    'dom-not-found',
    'runtime-undefined',
    'runtime-infinite-loop',
    'python-indent',
    'python-name',
    'python-type',
    'unknown',
  ];

  const counts = {} as Record<ErrorCategory, number>;
  for (const cat of ALL_CATEGORIES) {
    counts[cat] = 0;
  }

  for (const err of errors) {
    counts[err.category] = (counts[err.category] ?? 0) + 1;
  }

  return counts;
};
