// ---------------------------------------------------------------------------
// Server-side code safety scanner — COPPA-compliant
// Scans student-submitted code for dangerous or privacy-violating patterns
// before it is executed or stored.
// ---------------------------------------------------------------------------

interface DangerousPattern {
  pattern: RegExp;
  reason: string;
  severity: 'block' | 'warn';
}

const DANGEROUS_CODE_PATTERNS: DangerousPattern[] = [
  // --- block-level (execution prevented) ---
  {
    pattern: /\beval\s*\(/gi,
    reason: 'eval() can run hidden code and is not allowed',
    severity: 'block',
  },
  {
    pattern: /\bnew\s+Function\s*\(/gi,
    reason: 'The Function constructor can run hidden code and is not allowed',
    severity: 'block',
  },
  {
    pattern: /document\.cookie/gi,
    reason: 'Accessing cookies is not allowed for your safety',
    severity: 'block',
  },
  {
    pattern: /\blocalStorage\b/gi,
    reason: 'Direct localStorage access is not allowed — use SPARK save instead',
    severity: 'block',
  },
  {
    pattern: /\bsessionStorage\b/gi,
    reason: 'Direct sessionStorage access is not allowed — use SPARK save instead',
    severity: 'block',
  },
  {
    pattern: /window\.(parent|top|opener)\b/gi,
    reason: 'Accessing parent or top windows is not allowed in the sandbox',
    severity: 'block',
  },
  {
    pattern: /\bimportScripts\s*\(/gi,
    reason: 'importScripts is not available in the SPARK sandbox',
    severity: 'block',
  },
  {
    pattern: /document\.createElement\s*\(\s*['"`]iframe['"`]\s*\)/gi,
    reason: 'Creating iframes is not allowed for your safety',
    severity: 'block',
  },

  // --- warn-level (execution allowed, but flagged for review) ---
  {
    pattern: /\bfetch\s*\(\s*['"`]https?:\/\//gi,
    reason: 'Fetching external URLs may load content outside of SPARK',
    severity: 'warn',
  },
  {
    pattern: /new\s+XMLHttpRequest\s*\(/gi,
    reason: 'XMLHttpRequest to external servers may load content outside of SPARK',
    severity: 'warn',
  },
  {
    pattern: /new\s+WebSocket\s*\(/gi,
    reason: 'WebSocket connections are not recommended in SPARK projects',
    severity: 'warn',
  },
  {
    pattern: /CoinHive|coinhive|cryptonight|minero\.cc|jsecoin/gi,
    reason: 'Crypto-mining scripts are strictly prohibited',
    severity: 'block',
  },
];

// ---------------------------------------------------------------------------
// scanCode
// ---------------------------------------------------------------------------

interface ScanResult {
  safe: boolean;
  warnings: string[];
  blocked: string[];
}

/**
 * Scans the provided code string against every known dangerous pattern.
 * Returns a structured result indicating whether the code is safe, along
 * with human-readable reasons for any warnings or blocks.
 */
export function scanCode(code: string): ScanResult {
  const warnings: string[] = [];
  const blocked: string[] = [];

  for (const { pattern, reason, severity } of DANGEROUS_CODE_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      if (severity === 'block') {
        blocked.push(reason);
      } else {
        warnings.push(reason);
      }
    }
  }

  return {
    safe: blocked.length === 0,
    warnings,
    blocked,
  };
}

// ---------------------------------------------------------------------------
// getSafetyReport
// ---------------------------------------------------------------------------

interface SafetyReport {
  canExecute: boolean;
  buddyMessage: string;
}

/**
 * Generates a kid-friendly safety report for the given code.
 * If the code is blocked, `canExecute` is false and `buddyMessage`
 * explains what went wrong in language suitable for children.
 */
export function getSafetyReport(code: string): SafetyReport {
  const { safe, warnings, blocked } = scanCode(code);

  if (safe && warnings.length === 0) {
    return {
      canExecute: true,
      buddyMessage: 'Your code looks great! Ready to run.',
    };
  }

  if (safe && warnings.length > 0) {
    const warningList = warnings.map((w) => `• ${w}`).join('\n');
    return {
      canExecute: true,
      buddyMessage:
        `Your code can run, but Spark Buddy noticed a few things:\n${warningList}\n` +
        `These might not work the way you expect inside SPARK.`,
    };
  }

  // Code is blocked
  const blockedList = blocked.map((b) => `• ${b}`).join('\n');
  let message =
    `Oops! Spark Buddy found some code that isn't allowed:\n${blockedList}\n\n` +
    `Don't worry — this keeps everyone safe! ` +
    `Try removing those parts and run your code again.`;

  if (warnings.length > 0) {
    const warningList = warnings.map((w) => `• ${w}`).join('\n');
    message += `\n\nAlso, heads up on these:\n${warningList}`;
  }

  return {
    canExecute: false,
    buddyMessage: message,
  };
}
