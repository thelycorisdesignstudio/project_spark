import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: 'parent' | 'child';
    profileId?: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

export const requireParent = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'parent') {
    res.status(403).json({ error: 'Parent access required' });
    return;
  }
  next();
};

export const requireChild = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'child') {
    res.status(403).json({ error: 'Child access required' });
    return;
  }
  next();
};
