import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'parent' | 'child';
  profileId?: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  const expiresInSec = parseDuration(process.env.JWT_ACCESS_EXPIRES_IN || '15m');
  return jwt.sign(payload, secret, { expiresIn: expiresInSec });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
  const expiresInSec = parseDuration(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
  return jwt.sign(payload, secret, { expiresIn: expiresInSec });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set');
  return jwt.verify(token, secret) as TokenPayload;
};

/** Parse a duration string like '15m', '7d', '1h' into seconds */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // default 15 min
  const value = parseInt(match[1]);
  switch (match[2]) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 900;
  }
}
