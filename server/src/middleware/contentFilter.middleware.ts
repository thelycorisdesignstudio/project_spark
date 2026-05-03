import { Request, Response, NextFunction } from 'express';

const BLOCKED_PATTERNS = [
  /personal (address|phone number|email|password|location)/i,
  /(hurt|harm|kill|violent|weapon|suicide|self.harm)/i,
  /(sex|porn|adult content|nude|naked)/i,
  /(hate|racist|sexist|homophob)/i,
];

export const SAFE_FALLBACK = "Let's keep our focus on your project — you're building something awesome! What part should we look at? 🚀";

export const isSafeContent = (text: string): boolean => {
  return !BLOCKED_PATTERNS.some(pattern => pattern.test(text));
};

export const contentFilterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { message } = req.body;
  if (message && !isSafeContent(message)) {
    res.json({
      role: 'assistant',
      content: SAFE_FALLBACK,
      filtered: true,
    });
    return;
  }
  next();
};
