const DANGEROUS_PATTERNS: RegExp[] = [
  /document\.cookie/gi,
  /localStorage/gi,
  /sessionStorage/gi,
  /window\.parent/gi,
  /window\.top/gi,
  /\beval\s*\(/gi,
  /\bFunction\s*\(/gi,
  /XMLHttpRequest/gi,
  /\bfetch\s*\(/gi,
];

/**
 * Scans user code for potentially dangerous patterns that could
 * escape the sandbox or access sensitive browser APIs.
 * Returns an array of matched pattern source strings.
 */
export function scanCodeForDangerousPatterns(code: string): string[] {
  const matched: string[] = [];

  for (const pattern of DANGEROUS_PATTERNS) {
    // Reset lastIndex since we use the global flag
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      matched.push(pattern.source);
    }
  }

  return matched;
}

/**
 * Sanitizes HTML by stripping any <script> tags that load external resources
 * via the `src` attribute, preventing remote code injection.
 * Inline <script> blocks are preserved — the JS is handled separately.
 */
function sanitizeScriptTags(html: string): string {
  // Remove <script src="..."> ... </script> and self-closing variants
  return html.replace(/<script\b[^>]*\bsrc\s*=[^>]*>[\s\S]*?<\/script\s*>/gi, '<!-- blocked external script -->')
             .replace(/<script\b[^>]*\bsrc\s*=[^>]*\/?\s*>/gi, '<!-- blocked external script -->');
}

/**
 * Builds a complete HTML preview document that can be rendered in a
 * sandboxed iframe. Includes:
 * - Proper DOCTYPE and meta tags
 * - Body reset styles
 * - User CSS injected in a <style> block
 * - Sanitized user HTML (external scripts stripped)
 * - Error capture (window.onerror, unhandledrejection) that posts
 *   SPARK_ERROR messages to the parent frame
 * - DOMContentLoaded handler that posts SPARK_LOAD_SUCCESS
 * - User JS wrapped in a try/catch that posts SPARK_ERROR on failure
 */
export function buildPreviewDocument(html: string, css: string, js: string): string {
  const sanitizedHtml = sanitizeScriptTags(html);

  // Escape closing script tags inside user JS so they don't break the wrapper
  const escapedJs = js.replace(/<\/script/gi, '<\\/script');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>SPARK Preview</title>
  <style>
    /* Body reset */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1a1a2e;
      background: #ffffff;
    }
    img, video, canvas, svg { max-width: 100%; display: block; }
  </style>
  <style>
    /* User CSS */
    ${css}
  </style>
</head>
<body>
  ${sanitizedHtml}

  <script>
    // --- Error capture layer ---
    window.onerror = function(message, source, lineno, colno, error) {
      window.parent.postMessage({
        type: 'SPARK_ERROR',
        payload: {
          message: String(message),
          source: source || '',
          lineno: lineno || 0,
          colno: colno || 0,
          stack: error && error.stack ? error.stack : ''
        }
      }, '*');
      // Prevent default browser error logging
      return true;
    };

    window.addEventListener('unhandledrejection', function(event) {
      var reason = event.reason;
      window.parent.postMessage({
        type: 'SPARK_ERROR',
        payload: {
          message: reason instanceof Error ? reason.message : String(reason),
          source: 'unhandledrejection',
          lineno: 0,
          colno: 0,
          stack: reason instanceof Error && reason.stack ? reason.stack : ''
        }
      }, '*');
    });

    document.addEventListener('DOMContentLoaded', function() {
      window.parent.postMessage({ type: 'SPARK_LOAD_SUCCESS' }, '*');
    });
  </script>

  <script>
    // --- User JavaScript (sandboxed) ---
    try {
      ${escapedJs}
    } catch (__sparkErr) {
      window.parent.postMessage({
        type: 'SPARK_ERROR',
        payload: {
          message: __sparkErr instanceof Error ? __sparkErr.message : String(__sparkErr),
          source: 'user-script',
          lineno: 0,
          colno: 0,
          stack: __sparkErr instanceof Error && __sparkErr.stack ? __sparkErr.stack : ''
        }
      }, '*');
    }
  </script>
</body>
</html>`;
}
