export interface ValidationCheckpoint {
  label: string;
  passed: boolean;
}

export interface ValidationResult {
  passed: boolean;
  checkpoints: ValidationCheckpoint[];
}

// Helper to parse HTML string
const parseHTML = (html: string): Document => {
  return new DOMParser().parseFromString(html, 'text/html');
};

// Helper to check CSS presence in style tags or inline
const hasCSS = (html: string, property: string, value?: string): boolean => {
  const regex = value
    ? new RegExp(`${property}\\s*:\\s*${value}`, 'i')
    : new RegExp(`${property}\\s*:`, 'i');
  return regex.test(html);
};

// Helper to check JS code presence
const hasJS = (code: string, pattern: string): boolean => {
  return code.toLowerCase().includes(pattern.toLowerCase());
};

// =============================================
// ========= WORLD 1: The Web Kingdom =========
// =============================================

// --- Mission 1: The First Page (HTML basics: title, h1, p) ---

export const validate_W1_M1_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasTitle = !!doc.querySelector('title')?.textContent?.trim();
  return {
    passed: hasTitle,
    checkpoints: [
      { label: 'Page has a <title> tag', passed: !!doc.querySelector('title') },
      { label: 'Title has text content', passed: hasTitle },
    ],
  };
};

export const validate_W1_M1_S2 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasH1 = !!doc.querySelector('h1')?.textContent?.trim();
  return {
    passed: hasH1,
    checkpoints: [
      { label: 'Page has an <h1> heading', passed: !!doc.querySelector('h1') },
      { label: 'Heading has text content', passed: hasH1 },
    ],
  };
};

export const validate_W1_M1_S3 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasP = !!doc.querySelector('p')?.textContent?.trim();
  const hasH1 = !!doc.querySelector('h1')?.textContent?.trim();
  return {
    passed: hasP && hasH1,
    checkpoints: [
      { label: 'Page has a <p> paragraph', passed: !!doc.querySelector('p') },
      { label: 'Paragraph has text content', passed: hasP },
      { label: 'Still has <h1> heading', passed: hasH1 },
    ],
  };
};

// --- Mission 2: Links & Lists (img, a, ul/li) ---

export const validate_W1_M2_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const img = doc.querySelector('img');
  const hasSrc = !!img?.getAttribute('src');
  const hasAlt = !!img?.getAttribute('alt');
  return {
    passed: hasSrc && hasAlt,
    checkpoints: [
      { label: 'Page has an <img> tag', passed: !!img },
      { label: 'Image has a src attribute', passed: hasSrc },
      { label: 'Image has an alt attribute', passed: hasAlt },
    ],
  };
};

export const validate_W1_M2_S2 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const anchor = doc.querySelector('a');
  const hasHref = !!anchor?.getAttribute('href');
  const hasText = !!anchor?.textContent?.trim();
  return {
    passed: hasHref && hasText,
    checkpoints: [
      { label: 'Page has an <a> link', passed: !!anchor },
      { label: 'Link has an href attribute', passed: hasHref },
      { label: 'Link has visible text', passed: hasText },
    ],
  };
};

export const validate_W1_M2_S3 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const ul = doc.querySelector('ul');
  const liItems = doc.querySelectorAll('ul > li');
  const hasEnoughItems = liItems.length >= 2;
  return {
    passed: !!ul && hasEnoughItems,
    checkpoints: [
      { label: 'Page has a <ul> list', passed: !!ul },
      { label: 'List has <li> items', passed: liItems.length > 0 },
      { label: 'List has at least 2 items', passed: hasEnoughItems },
    ],
  };
};

// --- Mission 3: Style It Up (CSS color, font-size/text-align, :hover) ---

export const validate_W1_M3_S1 = (html: string): ValidationResult => {
  const hasColor = hasCSS(html, 'color');
  const hasBackground = hasCSS(html, 'background-color') || hasCSS(html, 'background');
  return {
    passed: hasColor,
    checkpoints: [
      { label: 'Uses CSS color property', passed: hasColor },
      { label: 'Uses a background color', passed: hasBackground },
    ],
  };
};

export const validate_W1_M3_S2 = (html: string): ValidationResult => {
  const hasFontSize = hasCSS(html, 'font-size');
  const hasTextAlign = hasCSS(html, 'text-align');
  return {
    passed: hasFontSize && hasTextAlign,
    checkpoints: [
      { label: 'Uses font-size property', passed: hasFontSize },
      { label: 'Uses text-align property', passed: hasTextAlign },
    ],
  };
};

export const validate_W1_M3_S3 = (html: string): ValidationResult => {
  const hasHover = /:hover/i.test(html);
  const hasColor = hasCSS(html, 'color');
  return {
    passed: hasHover && hasColor,
    checkpoints: [
      { label: 'Uses :hover pseudo-class', passed: hasHover },
      { label: 'Hover changes a style property', passed: hasHover && hasColor },
    ],
  };
};

// --- Mission 4: Box Model (div+border, padding+margin, border-radius+box-shadow) ---

export const validate_W1_M4_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasDiv = !!doc.querySelector('div');
  const hasBorder = hasCSS(html, 'border');
  return {
    passed: hasDiv && hasBorder,
    checkpoints: [
      { label: 'Page has a <div> element', passed: hasDiv },
      { label: 'Uses CSS border property', passed: hasBorder },
    ],
  };
};

export const validate_W1_M4_S2 = (html: string): ValidationResult => {
  const hasPadding = hasCSS(html, 'padding');
  const hasMargin = hasCSS(html, 'margin');
  return {
    passed: hasPadding && hasMargin,
    checkpoints: [
      { label: 'Uses padding property', passed: hasPadding },
      { label: 'Uses margin property', passed: hasMargin },
    ],
  };
};

export const validate_W1_M4_S3 = (html: string): ValidationResult => {
  const hasBorderRadius = hasCSS(html, 'border-radius');
  const hasBoxShadow = hasCSS(html, 'box-shadow');
  return {
    passed: hasBorderRadius && hasBoxShadow,
    checkpoints: [
      { label: 'Uses border-radius property', passed: hasBorderRadius },
      { label: 'Uses box-shadow property', passed: hasBoxShadow },
    ],
  };
};

// --- Mission 5: Build a Card (card with img+h2+p, styled card, ul with skills) ---

export const validate_W1_M5_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasImg = !!doc.querySelector('img');
  const hasH2 = !!doc.querySelector('h2');
  const hasP = !!doc.querySelector('p');
  return {
    passed: hasImg && hasH2 && hasP,
    checkpoints: [
      { label: 'Card has an <img> element', passed: hasImg },
      { label: 'Card has an <h2> heading', passed: hasH2 },
      { label: 'Card has a <p> paragraph', passed: hasP },
    ],
  };
};

export const validate_W1_M5_S2 = (html: string): ValidationResult => {
  const hasBorderRadius = hasCSS(html, 'border-radius');
  const hasBoxShadow = hasCSS(html, 'box-shadow');
  const hasPadding = hasCSS(html, 'padding');
  return {
    passed: hasBorderRadius && hasPadding,
    checkpoints: [
      { label: 'Card has border-radius styling', passed: hasBorderRadius },
      { label: 'Card has box-shadow styling', passed: hasBoxShadow },
      { label: 'Card has padding', passed: hasPadding },
    ],
  };
};

export const validate_W1_M5_S3 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasUl = !!doc.querySelector('ul');
  const liItems = doc.querySelectorAll('ul > li');
  const hasEnoughItems = liItems.length >= 2;
  return {
    passed: hasUl && hasEnoughItems,
    checkpoints: [
      { label: 'Has a <ul> skills list', passed: hasUl },
      { label: 'Skills list has <li> items', passed: liItems.length > 0 },
      { label: 'At least 2 skills listed', passed: hasEnoughItems },
    ],
  };
};

// --- Mission 6: Full Page (header+nav, about+projects sections, footer+hover) ---

export const validate_W1_M6_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasHeader = !!doc.querySelector('header');
  const hasNav = !!doc.querySelector('nav');
  const hasNavLinks = doc.querySelectorAll('nav a').length >= 2;
  return {
    passed: hasHeader && hasNav,
    checkpoints: [
      { label: 'Page has a <header> element', passed: hasHeader },
      { label: 'Header has a <nav> element', passed: hasNav },
      { label: 'Nav has at least 2 links', passed: hasNavLinks },
    ],
  };
};

export const validate_W1_M6_S2 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const sections = doc.querySelectorAll('section');
  const hasSections = sections.length >= 2;
  const hasH2 = !!doc.querySelector('section h2');
  return {
    passed: hasSections && hasH2,
    checkpoints: [
      { label: 'Page has <section> elements', passed: sections.length > 0 },
      { label: 'At least 2 sections (about & projects)', passed: hasSections },
      { label: 'Sections have <h2> headings', passed: hasH2 },
    ],
  };
};

export const validate_W1_M6_S3 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasFooter = !!doc.querySelector('footer');
  const hasHover = /:hover/i.test(html);
  const hasFooterText = !!doc.querySelector('footer')?.textContent?.trim();
  return {
    passed: hasFooter && hasHover,
    checkpoints: [
      { label: 'Page has a <footer> element', passed: hasFooter },
      { label: 'Footer has text content', passed: hasFooterText },
      { label: 'Uses :hover effect somewhere', passed: hasHover },
    ],
  };
};

// ==============================================
// ========= WORLD 2: Script Valley ============
// ==============================================

// --- Mission 1: Variables (let/const) ---

export const validate_W2_M1_S1 = (html: string): ValidationResult => {
  const usesLet = hasJS(html, 'let ');
  const hasAssignment = /let\s+\w+\s*=/.test(html);
  return {
    passed: usesLet && hasAssignment,
    checkpoints: [
      { label: 'Uses let keyword', passed: usesLet },
      { label: 'Assigns a value to a variable', passed: hasAssignment },
    ],
  };
};

export const validate_W2_M1_S2 = (html: string): ValidationResult => {
  const usesConst = hasJS(html, 'const ');
  const hasAssignment = /const\s+\w+\s*=/.test(html);
  return {
    passed: usesConst && hasAssignment,
    checkpoints: [
      { label: 'Uses const keyword', passed: usesConst },
      { label: 'Assigns a value with const', passed: hasAssignment },
    ],
  };
};

export const validate_W2_M1_S3 = (html: string): ValidationResult => {
  const usesLet = /let\s+\w+\s*=/.test(html);
  const usesConst = /const\s+\w+\s*=/.test(html);
  const usesAlert = hasJS(html, 'alert(') || hasJS(html, 'console.log(');
  return {
    passed: (usesLet || usesConst) && usesAlert,
    checkpoints: [
      { label: 'Declares a variable (let or const)', passed: usesLet || usesConst },
      { label: 'Outputs the variable (alert or console.log)', passed: usesAlert },
    ],
  };
};

// --- Mission 2: Decisions (if/else) ---

export const validate_W2_M2_S1 = (html: string): ValidationResult => {
  const hasIf = /if\s*\(/.test(html);
  const hasComparison = /[=!<>]=?/.test(html);
  return {
    passed: hasIf,
    checkpoints: [
      { label: 'Uses an if statement', passed: hasIf },
      { label: 'Has a comparison operator', passed: hasComparison },
    ],
  };
};

export const validate_W2_M2_S2 = (html: string): ValidationResult => {
  const hasIf = /if\s*\(/.test(html);
  const hasElse = /}\s*else\s*{/.test(html) || /else\s*{/.test(html);
  return {
    passed: hasIf && hasElse,
    checkpoints: [
      { label: 'Uses an if statement', passed: hasIf },
      { label: 'Uses an else branch', passed: hasElse },
    ],
  };
};

export const validate_W2_M2_S3 = (html: string): ValidationResult => {
  const hasIf = /if\s*\(/.test(html);
  const hasElseIf = /else\s+if\s*\(/.test(html);
  const hasElse = /}\s*else\s*{/.test(html);
  return {
    passed: hasIf && hasElseIf,
    checkpoints: [
      { label: 'Uses an if statement', passed: hasIf },
      { label: 'Uses else if for multiple conditions', passed: hasElseIf },
      { label: 'Has a final else block', passed: hasElse },
    ],
  };
};

// --- Mission 3: Loops (for/while) ---

export const validate_W2_M3_S1 = (html: string): ValidationResult => {
  const hasFor = /for\s*\(/.test(html);
  const hasInit = /for\s*\(\s*(let|var|const)\s+\w+/.test(html);
  return {
    passed: hasFor,
    checkpoints: [
      { label: 'Uses a for loop', passed: hasFor },
      { label: 'Loop has a proper initializer', passed: hasInit },
    ],
  };
};

export const validate_W2_M3_S2 = (html: string): ValidationResult => {
  const hasWhile = /while\s*\(/.test(html);
  const hasCondition = /while\s*\(.+\)/.test(html);
  return {
    passed: hasWhile,
    checkpoints: [
      { label: 'Uses a while loop', passed: hasWhile },
      { label: 'While loop has a condition', passed: hasCondition },
    ],
  };
};

export const validate_W2_M3_S3 = (html: string): ValidationResult => {
  const hasLoop = /for\s*\(/.test(html) || /while\s*\(/.test(html);
  const hasOutput = hasJS(html, 'alert(') || hasJS(html, 'console.log(') || hasJS(html, 'document.write(') || hasJS(html, 'innerhtml') || hasJS(html, 'textcontent');
  return {
    passed: hasLoop && hasOutput,
    checkpoints: [
      { label: 'Uses a loop (for or while)', passed: hasLoop },
      { label: 'Loop produces visible output', passed: hasOutput },
    ],
  };
};

// --- Mission 4: Functions ---

export const validate_W2_M4_S1 = (html: string): ValidationResult => {
  const hasFunction = /function\s+\w+\s*\(/.test(html);
  const hasArrow = /(?:const|let|var)\s+\w+\s*=\s*\(.*?\)\s*=>/.test(html);
  const declares = hasFunction || hasArrow;
  return {
    passed: declares,
    checkpoints: [
      { label: 'Declares a function', passed: declares },
      { label: 'Function has a name', passed: declares },
    ],
  };
};

export const validate_W2_M4_S2 = (html: string): ValidationResult => {
  const hasFunction = /function\s+\w+\s*\(/.test(html) || /(?:const|let|var)\s+\w+\s*=\s*\(.*?\)\s*=>/.test(html);
  const hasParam = /function\s+\w+\s*\(\s*\w+/.test(html) || /=\s*\(\s*\w+.*?\)\s*=>/.test(html);
  const hasReturn = hasJS(html, 'return ');
  return {
    passed: hasFunction && hasParam,
    checkpoints: [
      { label: 'Declares a function', passed: hasFunction },
      { label: 'Function accepts parameters', passed: hasParam },
      { label: 'Function returns a value', passed: hasReturn },
    ],
  };
};

export const validate_W2_M4_S3 = (html: string): ValidationResult => {
  const hasFunction = /function\s+\w+\s*\(/.test(html) || /(?:const|let|var)\s+\w+\s*=\s*\(.*?\)\s*=>/.test(html);
  const hasFunctionCall = /\w+\s*\(.*\)/.test(html);
  const hasOutput = hasJS(html, 'alert(') || hasJS(html, 'console.log(') || hasJS(html, 'innerhtml') || hasJS(html, 'textcontent');
  return {
    passed: hasFunction && hasOutput,
    checkpoints: [
      { label: 'Declares a function', passed: hasFunction },
      { label: 'Calls the function', passed: hasFunctionCall },
      { label: 'Function output is displayed', passed: hasOutput },
    ],
  };
};

// --- Mission 5: DOM Manipulation (getElementById, addEventListener) ---

export const validate_W2_M5_S1 = (html: string): ValidationResult => {
  const hasGetElement = hasJS(html, 'getelementbyid(') || hasJS(html, 'queryselector(');
  const doc = parseHTML(html);
  const hasIdAttr = !!doc.querySelector('[id]');
  return {
    passed: hasGetElement,
    checkpoints: [
      { label: 'Uses getElementById or querySelector', passed: hasGetElement },
      { label: 'An element has an id attribute', passed: hasIdAttr },
    ],
  };
};

export const validate_W2_M5_S2 = (html: string): ValidationResult => {
  const hasListener = hasJS(html, 'addeventlistener(');
  const hasClick = hasJS(html, "'click'") || hasJS(html, '"click"');
  return {
    passed: hasListener,
    checkpoints: [
      { label: 'Uses addEventListener', passed: hasListener },
      { label: 'Listens for a click event', passed: hasClick },
    ],
  };
};

export const validate_W2_M5_S3 = (html: string): ValidationResult => {
  const hasGetElement = hasJS(html, 'getelementbyid(') || hasJS(html, 'queryselector(');
  const hasListener = hasJS(html, 'addeventlistener(');
  const hasModify = hasJS(html, 'innerhtml') || hasJS(html, 'textcontent') || hasJS(html, '.style.');
  return {
    passed: hasGetElement && hasListener && hasModify,
    checkpoints: [
      { label: 'Selects a DOM element', passed: hasGetElement },
      { label: 'Attaches an event listener', passed: hasListener },
      { label: 'Modifies the DOM on event', passed: hasModify },
    ],
  };
};

// --- Mission 6: Quiz App ---

export const validate_W2_M6_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasButton = !!doc.querySelector('button');
  const hasQuestionText = !!doc.querySelector('h1, h2, h3, p')?.textContent?.trim();
  const hasMultipleButtons = doc.querySelectorAll('button').length >= 2;
  return {
    passed: hasButton && hasQuestionText,
    checkpoints: [
      { label: 'Has a question displayed', passed: hasQuestionText },
      { label: 'Has answer buttons', passed: hasButton },
      { label: 'Has at least 2 answer options', passed: hasMultipleButtons },
    ],
  };
};

export const validate_W2_M6_S2 = (html: string): ValidationResult => {
  const hasListener = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  const hasConditional = /if\s*\(/.test(html);
  const hasFeedback = hasJS(html, 'innerhtml') || hasJS(html, 'textcontent') || hasJS(html, 'alert(');
  return {
    passed: hasListener && hasConditional,
    checkpoints: [
      { label: 'Buttons have click handlers', passed: hasListener },
      { label: 'Checks if answer is correct', passed: hasConditional },
      { label: 'Gives feedback to the user', passed: hasFeedback },
    ],
  };
};

export const validate_W2_M6_S3 = (html: string): ValidationResult => {
  const hasScore = hasJS(html, 'score') || hasJS(html, 'points') || hasJS(html, 'count');
  const hasConditional = /if\s*\(/.test(html);
  const hasDisplay = hasJS(html, 'innerhtml') || hasJS(html, 'textcontent');
  return {
    passed: hasScore && hasConditional,
    checkpoints: [
      { label: 'Tracks a score variable', passed: hasScore },
      { label: 'Uses conditionals for quiz logic', passed: hasConditional },
      { label: 'Displays the score', passed: hasDisplay },
    ],
  };
};

// ==============================================
// ======= WORLD 3: The Animation Realm ========
// ==============================================

// --- Mission 1: Hover Transitions (:hover + transition) ---

export const validate_W3_M1_S1 = (html: string): ValidationResult => {
  const hasHover = /:hover/i.test(html);
  const hasStyleChange = hasCSS(html, 'color') || hasCSS(html, 'background') || hasCSS(html, 'transform');
  return {
    passed: hasHover,
    checkpoints: [
      { label: 'Uses :hover pseudo-class', passed: hasHover },
      { label: 'Changes a style on hover', passed: hasStyleChange },
    ],
  };
};

export const validate_W3_M1_S2 = (html: string): ValidationResult => {
  const hasTransition = hasCSS(html, 'transition');
  const hasHover = /:hover/i.test(html);
  return {
    passed: hasTransition && hasHover,
    checkpoints: [
      { label: 'Uses CSS transition property', passed: hasTransition },
      { label: 'Combines transition with :hover', passed: hasHover },
    ],
  };
};

export const validate_W3_M1_S3 = (html: string): ValidationResult => {
  const hasTransition = hasCSS(html, 'transition');
  const hasTransform = hasCSS(html, 'transform');
  const hasHover = /:hover/i.test(html);
  return {
    passed: hasTransition && hasTransform,
    checkpoints: [
      { label: 'Uses CSS transition', passed: hasTransition },
      { label: 'Uses CSS transform (scale, rotate, etc.)', passed: hasTransform },
      { label: 'Applied on :hover', passed: hasHover },
    ],
  };
};

// --- Mission 2: Keyframes (@keyframes) ---

export const validate_W3_M2_S1 = (html: string): ValidationResult => {
  const hasKeyframes = /@keyframes\s+\w+/i.test(html);
  const hasFromTo = /from\s*\{/.test(html) || /0%\s*\{/.test(html);
  return {
    passed: hasKeyframes,
    checkpoints: [
      { label: 'Defines a @keyframes rule', passed: hasKeyframes },
      { label: 'Has from/to or percentage steps', passed: hasFromTo },
    ],
  };
};

export const validate_W3_M2_S2 = (html: string): ValidationResult => {
  const hasKeyframes = /@keyframes\s+\w+/i.test(html);
  const hasAnimation = hasCSS(html, 'animation');
  return {
    passed: hasKeyframes && hasAnimation,
    checkpoints: [
      { label: 'Defines @keyframes', passed: hasKeyframes },
      { label: 'Applies animation property to an element', passed: hasAnimation },
    ],
  };
};

export const validate_W3_M2_S3 = (html: string): ValidationResult => {
  const hasKeyframes = /@keyframes\s+\w+/i.test(html);
  const hasAnimation = hasCSS(html, 'animation');
  const hasInfinite = /infinite/i.test(html);
  return {
    passed: hasKeyframes && hasAnimation,
    checkpoints: [
      { label: 'Defines @keyframes animation', passed: hasKeyframes },
      { label: 'Applies animation to an element', passed: hasAnimation },
      { label: 'Animation loops (infinite)', passed: hasInfinite },
    ],
  };
};

// --- Mission 3: Timers (setTimeout/setInterval) ---

export const validate_W3_M3_S1 = (html: string): ValidationResult => {
  const hasSetTimeout = hasJS(html, 'settimeout(');
  const hasCallback = /setTimeout\s*\(\s*(function|\(|['"]|[a-zA-Z])/.test(html);
  return {
    passed: hasSetTimeout,
    checkpoints: [
      { label: 'Uses setTimeout', passed: hasSetTimeout },
      { label: 'Passes a callback to setTimeout', passed: hasCallback },
    ],
  };
};

export const validate_W3_M3_S2 = (html: string): ValidationResult => {
  const hasSetInterval = hasJS(html, 'setinterval(');
  const hasCallback = /setInterval\s*\(\s*(function|\(|['"]|[a-zA-Z])/.test(html);
  return {
    passed: hasSetInterval,
    checkpoints: [
      { label: 'Uses setInterval', passed: hasSetInterval },
      { label: 'Passes a callback to setInterval', passed: hasCallback },
    ],
  };
};

export const validate_W3_M3_S3 = (html: string): ValidationResult => {
  const hasTimer = hasJS(html, 'settimeout(') || hasJS(html, 'setinterval(');
  const hasClear = hasJS(html, 'cleartimeout(') || hasJS(html, 'clearinterval(');
  const hasDOMChange = hasJS(html, 'innerhtml') || hasJS(html, 'textcontent') || hasJS(html, '.style.');
  return {
    passed: hasTimer && hasDOMChange,
    checkpoints: [
      { label: 'Uses a timer function', passed: hasTimer },
      { label: 'Clears the timer when done', passed: hasClear },
      { label: 'Timer updates the page', passed: hasDOMChange },
    ],
  };
};

// --- Mission 4: Dynamic Styles (.style manipulation) ---

export const validate_W3_M4_S1 = (html: string): ValidationResult => {
  const hasStyleDot = hasJS(html, '.style.');
  const hasGetElement = hasJS(html, 'getelementbyid(') || hasJS(html, 'queryselector(');
  return {
    passed: hasStyleDot,
    checkpoints: [
      { label: 'Uses .style to change CSS', passed: hasStyleDot },
      { label: 'Selects an element first', passed: hasGetElement },
    ],
  };
};

export const validate_W3_M4_S2 = (html: string): ValidationResult => {
  const hasStyleDot = hasJS(html, '.style.');
  const hasEvent = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  const hasColorChange = hasJS(html, '.style.color') || hasJS(html, '.style.background') || hasJS(html, '.style.backgroundColor');
  return {
    passed: hasStyleDot && hasEvent,
    checkpoints: [
      { label: 'Changes .style property', passed: hasStyleDot },
      { label: 'Triggered by an event', passed: hasEvent },
      { label: 'Changes a color property', passed: hasColorChange },
    ],
  };
};

export const validate_W3_M4_S3 = (html: string): ValidationResult => {
  const hasStyleDot = hasJS(html, '.style.');
  const hasMultipleStyles = (html.match(/\.style\./gi) || []).length >= 2;
  const hasEvent = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  return {
    passed: hasStyleDot && hasEvent,
    checkpoints: [
      { label: 'Uses .style manipulation', passed: hasStyleDot },
      { label: 'Changes multiple style properties', passed: hasMultipleStyles },
      { label: 'Styles change on event', passed: hasEvent },
    ],
  };
};

// --- Mission 5: Class Toggling (classList.toggle) ---

export const validate_W3_M5_S1 = (html: string): ValidationResult => {
  const hasClassList = hasJS(html, 'classlist');
  const hasAdd = hasJS(html, 'classlist.add(') || hasJS(html, 'classlist.toggle(');
  return {
    passed: hasClassList,
    checkpoints: [
      { label: 'Uses classList API', passed: hasClassList },
      { label: 'Adds or toggles a class', passed: hasAdd },
    ],
  };
};

export const validate_W3_M5_S2 = (html: string): ValidationResult => {
  const hasToggle = hasJS(html, 'classlist.toggle(');
  const hasEvent = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  return {
    passed: hasToggle && hasEvent,
    checkpoints: [
      { label: 'Uses classList.toggle()', passed: hasToggle },
      { label: 'Toggle triggered by an event', passed: hasEvent },
    ],
  };
};

export const validate_W3_M5_S3 = (html: string): ValidationResult => {
  const hasClassList = hasJS(html, 'classlist');
  const hasCSSDefined = /@keyframes/i.test(html) || hasCSS(html, 'transition') || hasCSS(html, 'animation');
  const hasEvent = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  return {
    passed: hasClassList && hasCSSDefined,
    checkpoints: [
      { label: 'Uses classList to swap classes', passed: hasClassList },
      { label: 'CSS class has animation/transition', passed: hasCSSDefined },
      { label: 'Toggled via user interaction', passed: hasEvent },
    ],
  };
};

// --- Mission 6: Animation Showcase (multiple animations combined) ---

export const validate_W3_M6_S1 = (html: string): ValidationResult => {
  const hasKeyframes = /@keyframes\s+\w+/i.test(html);
  const hasTransition = hasCSS(html, 'transition');
  const hasAnimatedElement = hasCSS(html, 'animation');
  return {
    passed: hasKeyframes || hasTransition,
    checkpoints: [
      { label: 'Uses @keyframes or transition', passed: hasKeyframes || hasTransition },
      { label: 'Animation applied to elements', passed: hasAnimatedElement || hasTransition },
    ],
  };
};

export const validate_W3_M6_S2 = (html: string): ValidationResult => {
  const hasJS_ = hasJS(html, '.style.') || hasJS(html, 'classlist');
  const hasCSSAnim = /@keyframes/i.test(html) || hasCSS(html, 'transition');
  const hasEvent = hasJS(html, 'addeventlistener(') || hasJS(html, 'onclick');
  return {
    passed: hasJS_ && hasCSSAnim,
    checkpoints: [
      { label: 'Combines JS and CSS animations', passed: hasJS_ && hasCSSAnim },
      { label: 'Has interactive triggers', passed: hasEvent },
    ],
  };
};

export const validate_W3_M6_S3 = (html: string): ValidationResult => {
  const hasKeyframes = /@keyframes/i.test(html);
  const hasTransition = hasCSS(html, 'transition');
  const hasJSAnim = hasJS(html, '.style.') || hasJS(html, 'classlist');
  const hasTimer = hasJS(html, 'settimeout(') || hasJS(html, 'setinterval(');
  const hasMultipleAnimations = [hasKeyframes, hasTransition, hasJSAnim, hasTimer].filter(Boolean).length >= 2;
  return {
    passed: hasMultipleAnimations,
    checkpoints: [
      { label: 'Uses CSS animations', passed: hasKeyframes || hasTransition },
      { label: 'Uses JavaScript animations', passed: hasJSAnim || hasTimer },
      { label: 'Combines multiple animation techniques', passed: hasMultipleAnimations },
    ],
  };
};

// ==============================================
// ======= WORLD 4: Canvas Quest ===============
// ==============================================

// --- Mission 1: Canvas Basics (canvas + getContext + fillRect) ---

export const validate_W4_M1_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasCanvas = !!doc.querySelector('canvas');
  const hasWidthHeight = /canvas.*width/i.test(html) || /width\s*=\s*["']\d+/i.test(html);
  return {
    passed: hasCanvas,
    checkpoints: [
      { label: 'Page has a <canvas> element', passed: hasCanvas },
      { label: 'Canvas has width/height set', passed: hasWidthHeight },
    ],
  };
};

export const validate_W4_M1_S2 = (html: string): ValidationResult => {
  const hasGetContext = hasJS(html, 'getcontext(');
  const has2D = hasJS(html, "'2d'") || hasJS(html, '"2d"');
  return {
    passed: hasGetContext && has2D,
    checkpoints: [
      { label: 'Calls getContext on canvas', passed: hasGetContext },
      { label: 'Gets 2D rendering context', passed: has2D },
    ],
  };
};

export const validate_W4_M1_S3 = (html: string): ValidationResult => {
  const hasFillRect = hasJS(html, 'fillrect(');
  const hasFillStyle = hasJS(html, 'fillstyle');
  const hasGetContext = hasJS(html, 'getcontext(');
  return {
    passed: hasFillRect && hasGetContext,
    checkpoints: [
      { label: 'Uses getContext for 2D', passed: hasGetContext },
      { label: 'Draws with fillRect()', passed: hasFillRect },
      { label: 'Sets fillStyle color', passed: hasFillStyle },
    ],
  };
};

// --- Mission 2: Drawing Shapes (arc/beginPath) ---

export const validate_W4_M2_S1 = (html: string): ValidationResult => {
  const hasBeginPath = hasJS(html, 'beginpath(');
  const hasStroke = hasJS(html, 'stroke(') || hasJS(html, 'fill(');
  return {
    passed: hasBeginPath,
    checkpoints: [
      { label: 'Uses beginPath()', passed: hasBeginPath },
      { label: 'Calls stroke() or fill()', passed: hasStroke },
    ],
  };
};

export const validate_W4_M2_S2 = (html: string): ValidationResult => {
  const hasArc = hasJS(html, 'arc(');
  const hasBeginPath = hasJS(html, 'beginpath(');
  return {
    passed: hasArc && hasBeginPath,
    checkpoints: [
      { label: 'Uses arc() to draw a circle', passed: hasArc },
      { label: 'Uses beginPath() before arc()', passed: hasBeginPath },
    ],
  };
};

export const validate_W4_M2_S3 = (html: string): ValidationResult => {
  const hasArc = hasJS(html, 'arc(');
  const hasFillRect = hasJS(html, 'fillrect(');
  const hasMultipleShapes = hasArc && hasFillRect;
  const hasColors = (html.match(/fillStyle/gi) || []).length >= 1;
  return {
    passed: hasArc || hasFillRect,
    checkpoints: [
      { label: 'Draws circles with arc()', passed: hasArc },
      { label: 'Draws rectangles with fillRect()', passed: hasFillRect },
      { label: 'Uses multiple shapes and colors', passed: hasMultipleShapes && hasColors },
    ],
  };
};

// --- Mission 3: Animation Loop (requestAnimationFrame) ---

export const validate_W4_M3_S1 = (html: string): ValidationResult => {
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasFunction = /function\s+\w+/.test(html) || /(?:const|let|var)\s+\w+\s*=\s*\(/.test(html);
  return {
    passed: hasRAF,
    checkpoints: [
      { label: 'Uses requestAnimationFrame()', passed: hasRAF },
      { label: 'Has an animation function', passed: hasFunction },
    ],
  };
};

export const validate_W4_M3_S2 = (html: string): ValidationResult => {
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasClear = hasJS(html, 'clearrect(');
  const hasPosition = /\b[xy]\b\s*[+=]/.test(html) || /position\s*[+=]/.test(html) || /\b(dx|dy|speed|vel)/i.test(html);
  return {
    passed: hasRAF && hasClear,
    checkpoints: [
      { label: 'Uses requestAnimationFrame loop', passed: hasRAF },
      { label: 'Clears canvas each frame with clearRect', passed: hasClear },
      { label: 'Updates position variables', passed: hasPosition },
    ],
  };
};

export const validate_W4_M3_S3 = (html: string): ValidationResult => {
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasClear = hasJS(html, 'clearrect(');
  const hasDraw = hasJS(html, 'fillrect(') || hasJS(html, 'arc(');
  return {
    passed: hasRAF && hasClear && hasDraw,
    checkpoints: [
      { label: 'Has animation loop with requestAnimationFrame', passed: hasRAF },
      { label: 'Clears and redraws each frame', passed: hasClear && hasDraw },
      { label: 'Object moves smoothly across canvas', passed: hasRAF && hasClear },
    ],
  };
};

// --- Mission 4: Keyboard Input (addEventListener keydown) ---

export const validate_W4_M4_S1 = (html: string): ValidationResult => {
  const hasKeydown = hasJS(html, "'keydown'") || hasJS(html, '"keydown"');
  const hasListener = hasJS(html, 'addeventlistener(');
  return {
    passed: hasKeydown && hasListener,
    checkpoints: [
      { label: 'Uses addEventListener', passed: hasListener },
      { label: 'Listens for keydown events', passed: hasKeydown },
    ],
  };
};

export const validate_W4_M4_S2 = (html: string): ValidationResult => {
  const hasKeydown = hasJS(html, "'keydown'") || hasJS(html, '"keydown"');
  const hasKeyCheck = hasJS(html, 'event.key') || hasJS(html, 'e.key') || hasJS(html, 'keycode') || hasJS(html, 'which');
  const hasArrowKeys = hasJS(html, 'arrowleft') || hasJS(html, 'arrowright') || hasJS(html, 'arrowup') || hasJS(html, 'arrowdown');
  return {
    passed: hasKeydown && hasKeyCheck,
    checkpoints: [
      { label: 'Listens for keyboard events', passed: hasKeydown },
      { label: 'Checks which key was pressed', passed: hasKeyCheck },
      { label: 'Handles arrow keys', passed: hasArrowKeys },
    ],
  };
};

export const validate_W4_M4_S3 = (html: string): ValidationResult => {
  const hasKeydown = hasJS(html, "'keydown'") || hasJS(html, '"keydown"');
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasPositionUpdate = /\b[xy]\b\s*[+=]/.test(html) || hasJS(html, 'playerspeed') || hasJS(html, 'player.x') || hasJS(html, 'player.y');
  return {
    passed: hasKeydown && hasRAF,
    checkpoints: [
      { label: 'Keyboard controls a canvas object', passed: hasKeydown },
      { label: 'Animation loop redraws on movement', passed: hasRAF },
      { label: 'Player position updates on key press', passed: hasPositionUpdate },
    ],
  };
};

// --- Mission 5: Collision Detection ---

export const validate_W4_M5_S1 = (html: string): ValidationResult => {
  const hasComparison = /<\s*\w+\.\w+\s*\+/.test(html) || /&&/.test(html);
  const hasPositionVars = /\b(player|obj|enemy|rect|box)\w*\.(x|y|width|height)/i.test(html) || (/\bx\b/.test(html) && /\by\b/.test(html));
  return {
    passed: hasComparison && hasPositionVars,
    checkpoints: [
      { label: 'Has position variables for objects', passed: hasPositionVars },
      { label: 'Compares positions for overlap', passed: hasComparison },
    ],
  };
};

export const validate_W4_M5_S2 = (html: string): ValidationResult => {
  const hasCollisionCheck = hasJS(html, 'collision') || (html.includes('&&') && /[xy].*[<>]/.test(html));
  const hasConditional = /if\s*\(/.test(html);
  const hasReaction = hasJS(html, 'score') || hasJS(html, 'gameover') || hasJS(html, 'game_over') || hasJS(html, 'alert(') || hasJS(html, 'filltext(');
  return {
    passed: hasCollisionCheck && hasConditional,
    checkpoints: [
      { label: 'Implements collision detection', passed: hasCollisionCheck },
      { label: 'Uses if statement to check collision', passed: hasConditional },
      { label: 'Reacts to collision (score/game over)', passed: hasReaction },
    ],
  };
};

export const validate_W4_M5_S3 = (html: string): ValidationResult => {
  const hasCollision = hasJS(html, 'collision') || (html.includes('&&') && /[xy].*[<>]/.test(html));
  const hasScore = hasJS(html, 'score');
  const hasDisplay = hasJS(html, 'filltext(') || hasJS(html, 'innerhtml') || hasJS(html, 'textcontent');
  return {
    passed: hasCollision && hasScore,
    checkpoints: [
      { label: 'Collision detection works', passed: hasCollision },
      { label: 'Score tracked on collision', passed: hasScore },
      { label: 'Score displayed to player', passed: hasDisplay },
    ],
  };
};

// --- Mission 6: Full Game ---

export const validate_W4_M6_S1 = (html: string): ValidationResult => {
  const doc = parseHTML(html);
  const hasCanvas = !!doc.querySelector('canvas');
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasKeydown = hasJS(html, "'keydown'") || hasJS(html, '"keydown"');
  return {
    passed: hasCanvas && hasRAF && hasKeydown,
    checkpoints: [
      { label: 'Game has a canvas element', passed: hasCanvas },
      { label: 'Has animation loop', passed: hasRAF },
      { label: 'Has keyboard controls', passed: hasKeydown },
    ],
  };
};

export const validate_W4_M6_S2 = (html: string): ValidationResult => {
  const hasCollision = hasJS(html, 'collision') || (html.includes('&&') && /[xy].*[<>]/.test(html));
  const hasScore = hasJS(html, 'score');
  const hasMultipleObjects = (html.match(/fillRect|arc\(/gi) || []).length >= 2;
  return {
    passed: hasCollision && hasScore,
    checkpoints: [
      { label: 'Game has collision detection', passed: hasCollision },
      { label: 'Game tracks score', passed: hasScore },
      { label: 'Multiple objects drawn on canvas', passed: hasMultipleObjects },
    ],
  };
};

export const validate_W4_M6_S3 = (html: string): ValidationResult => {
  const hasRAF = hasJS(html, 'requestanimationframe(');
  const hasScore = hasJS(html, 'score');
  const hasGameOver = hasJS(html, 'gameover') || hasJS(html, 'game_over') || hasJS(html, 'game over');
  const hasRestart = hasJS(html, 'restart') || hasJS(html, 'reset') || hasJS(html, 'start');
  const hasCollision = hasJS(html, 'collision') || (html.includes('&&') && /[xy].*[<>]/.test(html));
  return {
    passed: hasRAF && hasScore && (hasGameOver || hasCollision),
    checkpoints: [
      { label: 'Complete game loop running', passed: hasRAF },
      { label: 'Score and game over logic', passed: hasScore && (hasGameOver || hasCollision) },
      { label: 'Game can restart or end', passed: hasRestart || hasGameOver },
    ],
  };
};

// ==============================================
// ======= WORLD 5: Python Peaks ==============
// ==============================================

// --- Mission 1: Print (print()) ---

export const validate_W5_M1_S1 = (code: string): ValidationResult => {
  const hasPrint = hasJS(code, 'print(');
  const hasString = /print\s*\(\s*['"]/.test(code);
  return {
    passed: hasPrint && hasString,
    checkpoints: [
      { label: 'Uses print() function', passed: hasPrint },
      { label: 'Prints a string message', passed: hasString },
    ],
  };
};

export const validate_W5_M1_S2 = (code: string): ValidationResult => {
  const hasPrint = hasJS(code, 'print(');
  const hasVariable = /\w+\s*=\s*.+/.test(code);
  const printCount = (code.match(/print\s*\(/g) || []).length;
  return {
    passed: hasPrint && hasVariable,
    checkpoints: [
      { label: 'Assigns a value to a variable', passed: hasVariable },
      { label: 'Uses print() to output the variable', passed: hasPrint },
      { label: 'Has multiple print statements', passed: printCount >= 2 },
    ],
  };
};

export const validate_W5_M1_S3 = (code: string): ValidationResult => {
  const hasPrint = hasJS(code, 'print(');
  const hasVariable = /\w+\s*=\s*.+/.test(code);
  const hasFString = /f['"]/.test(code) || /\.format\(/.test(code) || /print\s*\(.*\+/.test(code);
  return {
    passed: hasPrint && hasVariable,
    checkpoints: [
      { label: 'Declares variables', passed: hasVariable },
      { label: 'Uses print()', passed: hasPrint },
      { label: 'Combines text and variables (f-string, format, or +)', passed: hasFString },
    ],
  };
};

// --- Mission 2: Decisions (if/elif/else + input) ---

export const validate_W5_M2_S1 = (code: string): ValidationResult => {
  const hasInput = hasJS(code, 'input(');
  const hasVariable = /\w+\s*=\s*input\s*\(/.test(code);
  return {
    passed: hasInput,
    checkpoints: [
      { label: 'Uses input() function', passed: hasInput },
      { label: 'Stores input in a variable', passed: hasVariable },
    ],
  };
};

export const validate_W5_M2_S2 = (code: string): ValidationResult => {
  const hasIf = /^if\s+.+:/m.test(code);
  const hasElse = /^else\s*:/m.test(code);
  return {
    passed: hasIf && hasElse,
    checkpoints: [
      { label: 'Uses an if statement', passed: hasIf },
      { label: 'Uses an else branch', passed: hasElse },
    ],
  };
};

export const validate_W5_M2_S3 = (code: string): ValidationResult => {
  const hasIf = /^if\s+.+:/m.test(code);
  const hasElif = /^elif\s+.+:/m.test(code);
  const hasElse = /^else\s*:/m.test(code);
  return {
    passed: hasIf && hasElif,
    checkpoints: [
      { label: 'Uses if statement', passed: hasIf },
      { label: 'Uses elif for extra conditions', passed: hasElif },
      { label: 'Has a final else', passed: hasElse },
    ],
  };
};

// --- Mission 3: Loops & Lists (for loop + list) ---

export const validate_W5_M3_S1 = (code: string): ValidationResult => {
  const hasList = /\[.+\]/.test(code);
  const hasAssignment = /\w+\s*=\s*\[/.test(code);
  return {
    passed: hasList,
    checkpoints: [
      { label: 'Creates a list with [ ]', passed: hasList },
      { label: 'Assigns list to a variable', passed: hasAssignment },
    ],
  };
};

export const validate_W5_M3_S2 = (code: string): ValidationResult => {
  const hasFor = /^for\s+\w+\s+in\s+/m.test(code);
  const hasPrint = hasJS(code, 'print(');
  return {
    passed: hasFor,
    checkpoints: [
      { label: 'Uses a for loop', passed: hasFor },
      { label: 'Prints items from the loop', passed: hasPrint },
    ],
  };
};

export const validate_W5_M3_S3 = (code: string): ValidationResult => {
  const hasFor = /^for\s+\w+\s+in\s+/m.test(code);
  const hasList = /\[.+\]/.test(code);
  const hasPrint = hasJS(code, 'print(');
  return {
    passed: hasFor && hasList && hasPrint,
    checkpoints: [
      { label: 'Defines a list', passed: hasList },
      { label: 'Loops over the list with for', passed: hasFor },
      { label: 'Prints each item', passed: hasPrint },
    ],
  };
};

// --- Mission 4: Functions (def) ---

export const validate_W5_M4_S1 = (code: string): ValidationResult => {
  const hasDef = /^def\s+\w+\s*\(/m.test(code);
  const hasBody = /^def\s+\w+\s*\(.*\)\s*:\s*\n\s+/m.test(code) || /def\s+\w+\s*\(.*\)\s*:/.test(code);
  return {
    passed: hasDef,
    checkpoints: [
      { label: 'Defines a function with def', passed: hasDef },
      { label: 'Function has a body', passed: hasBody },
    ],
  };
};

export const validate_W5_M4_S2 = (code: string): ValidationResult => {
  const hasDef = /^def\s+\w+\s*\(\s*\w+/m.test(code);
  const hasReturn = /^\s+return\s+/m.test(code);
  return {
    passed: hasDef && hasReturn,
    checkpoints: [
      { label: 'Function accepts parameters', passed: hasDef },
      { label: 'Function returns a value', passed: hasReturn },
    ],
  };
};

export const validate_W5_M4_S3 = (code: string): ValidationResult => {
  const hasDef = /^def\s+\w+\s*\(/m.test(code);
  const hasFunctionCall = /^\w+\s*\(/m.test(code);
  const hasPrint = hasJS(code, 'print(');
  return {
    passed: hasDef && hasPrint,
    checkpoints: [
      { label: 'Defines a function', passed: hasDef },
      { label: 'Calls the function', passed: hasFunctionCall },
      { label: 'Prints the result', passed: hasPrint },
    ],
  };
};

// --- Mission 5: Dictionaries ---

export const validate_W5_M5_S1 = (code: string): ValidationResult => {
  const hasDict = /\{.+:.+\}/.test(code);
  const hasAssignment = /\w+\s*=\s*\{/.test(code);
  return {
    passed: hasDict,
    checkpoints: [
      { label: 'Creates a dictionary with { }', passed: hasDict },
      { label: 'Assigns dictionary to a variable', passed: hasAssignment },
    ],
  };
};

export const validate_W5_M5_S2 = (code: string): ValidationResult => {
  const hasDict = /\w+\s*=\s*\{/.test(code);
  const hasAccess = /\w+\s*\[\s*['"]/.test(code) || /\.get\s*\(/.test(code);
  const hasPrint = hasJS(code, 'print(');
  return {
    passed: hasDict && hasAccess,
    checkpoints: [
      { label: 'Has a dictionary', passed: hasDict },
      { label: 'Accesses dictionary values by key', passed: hasAccess },
      { label: 'Prints dictionary values', passed: hasPrint },
    ],
  };
};

export const validate_W5_M5_S3 = (code: string): ValidationResult => {
  const hasDict = /\w+\s*=\s*\{/.test(code);
  const hasLoop = /^for\s+\w+.*in\s+/m.test(code);
  const hasPrint = hasJS(code, 'print(');
  return {
    passed: hasDict && hasLoop && hasPrint,
    checkpoints: [
      { label: 'Has a dictionary', passed: hasDict },
      { label: 'Loops over the dictionary', passed: hasLoop },
      { label: 'Prints keys and/or values', passed: hasPrint },
    ],
  };
};

// --- Mission 6: Capstone (while loop + dict + input) ---

export const validate_W5_M6_S1 = (code: string): ValidationResult => {
  const hasWhile = /^while\s+.+:/m.test(code);
  const hasInput = hasJS(code, 'input(');
  return {
    passed: hasWhile && hasInput,
    checkpoints: [
      { label: 'Uses a while loop', passed: hasWhile },
      { label: 'Takes user input inside the loop', passed: hasInput },
    ],
  };
};

export const validate_W5_M6_S2 = (code: string): ValidationResult => {
  const hasDict = /\w+\s*=\s*\{/.test(code);
  const hasWhile = /^while\s+.+:/m.test(code);
  const hasConditional = /^(\s*)if\s+.+:/m.test(code);
  return {
    passed: hasDict && hasWhile,
    checkpoints: [
      { label: 'Uses a dictionary for data', passed: hasDict },
      { label: 'Uses a while loop for flow', passed: hasWhile },
      { label: 'Has conditional logic', passed: hasConditional },
    ],
  };
};

export const validate_W5_M6_S3 = (code: string): ValidationResult => {
  const hasDict = /\w+\s*=\s*\{/.test(code);
  const hasWhile = /^while\s+.+:/m.test(code);
  const hasInput = hasJS(code, 'input(');
  const hasPrint = hasJS(code, 'print(');
  const hasDef = /^def\s+\w+\s*\(/m.test(code);
  const hasAll = hasDict && hasWhile && hasInput && hasPrint;
  return {
    passed: hasAll,
    checkpoints: [
      { label: 'Uses dictionary, while loop, and input', passed: hasAll },
      { label: 'Prints output to the user', passed: hasPrint },
      { label: 'Organizes code with functions (bonus)', passed: hasDef },
    ],
  };
};

// ==============================================
// ============ VALIDATOR REGISTRY =============
// ==============================================

export const VALIDATORS: Record<string, (code: string) => ValidationResult> = {
  // World 1: The Web Kingdom
  validate_W1_M1_S1,
  validate_W1_M1_S2,
  validate_W1_M1_S3,
  validate_W1_M2_S1,
  validate_W1_M2_S2,
  validate_W1_M2_S3,
  validate_W1_M3_S1,
  validate_W1_M3_S2,
  validate_W1_M3_S3,
  validate_W1_M4_S1,
  validate_W1_M4_S2,
  validate_W1_M4_S3,
  validate_W1_M5_S1,
  validate_W1_M5_S2,
  validate_W1_M5_S3,
  validate_W1_M6_S1,
  validate_W1_M6_S2,
  validate_W1_M6_S3,
  // World 2: Script Valley
  validate_W2_M1_S1,
  validate_W2_M1_S2,
  validate_W2_M1_S3,
  validate_W2_M2_S1,
  validate_W2_M2_S2,
  validate_W2_M2_S3,
  validate_W2_M3_S1,
  validate_W2_M3_S2,
  validate_W2_M3_S3,
  validate_W2_M4_S1,
  validate_W2_M4_S2,
  validate_W2_M4_S3,
  validate_W2_M5_S1,
  validate_W2_M5_S2,
  validate_W2_M5_S3,
  validate_W2_M6_S1,
  validate_W2_M6_S2,
  validate_W2_M6_S3,
  // World 3: The Animation Realm
  validate_W3_M1_S1,
  validate_W3_M1_S2,
  validate_W3_M1_S3,
  validate_W3_M2_S1,
  validate_W3_M2_S2,
  validate_W3_M2_S3,
  validate_W3_M3_S1,
  validate_W3_M3_S2,
  validate_W3_M3_S3,
  validate_W3_M4_S1,
  validate_W3_M4_S2,
  validate_W3_M4_S3,
  validate_W3_M5_S1,
  validate_W3_M5_S2,
  validate_W3_M5_S3,
  validate_W3_M6_S1,
  validate_W3_M6_S2,
  validate_W3_M6_S3,
  // World 4: Canvas Quest
  validate_W4_M1_S1,
  validate_W4_M1_S2,
  validate_W4_M1_S3,
  validate_W4_M2_S1,
  validate_W4_M2_S2,
  validate_W4_M2_S3,
  validate_W4_M3_S1,
  validate_W4_M3_S2,
  validate_W4_M3_S3,
  validate_W4_M4_S1,
  validate_W4_M4_S2,
  validate_W4_M4_S3,
  validate_W4_M5_S1,
  validate_W4_M5_S2,
  validate_W4_M5_S3,
  validate_W4_M6_S1,
  validate_W4_M6_S2,
  validate_W4_M6_S3,
  // World 5: Python Peaks
  validate_W5_M1_S1,
  validate_W5_M1_S2,
  validate_W5_M1_S3,
  validate_W5_M2_S1,
  validate_W5_M2_S2,
  validate_W5_M2_S3,
  validate_W5_M3_S1,
  validate_W5_M3_S2,
  validate_W5_M3_S3,
  validate_W5_M4_S1,
  validate_W5_M4_S2,
  validate_W5_M4_S3,
  validate_W5_M5_S1,
  validate_W5_M5_S2,
  validate_W5_M5_S3,
  validate_W5_M6_S1,
  validate_W5_M6_S2,
  validate_W5_M6_S3,
};
